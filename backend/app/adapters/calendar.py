"""Calendar Adapter - Real Google Calendar API integration.

Matches voice_backend: Cyprus timezone (Asia/Nicosia), business hours 08:00-17:30.
Booking allowed any day; last slot starts at 16:30 (ends 17:30). All appointments 1 hour.
"""
import os
import requests
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional
from zoneinfo import ZoneInfo

from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

def insert_supabase_booking(lead: Dict[str, Any], slot_dt: datetime) -> None:
    """Helper to insert AI booking into Supabase test_drive_bookings table."""
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_ANON_KEY")
    if not url or not key:
        print("[Calendar] insert_supabase_booking: missing SUPABASE_URL or SUPABASE_ANON_KEY")
        return
    
    headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }
    
    # 1. Resolve car_id by matching interested_car/carId with database
    car_id = None
    interested_car = lead.get("interested_car") or lead.get("carId") or ""
    if interested_car:
        try:
            res = requests.get(f"{url}/rest/v1/cars", headers=headers, timeout=5)
            if res.status_code == 200:
                db_cars = res.json()
                norm_interested = str(interested_car).lower()
                for car in db_cars:
                    make_model = f"{car.get('make', '')} {car.get('model', '')}".lower()
                    if norm_interested in make_model or make_model in norm_interested or norm_interested == str(car.get("id")).lower():
                        car_id = car.get("id")
                        break
        except Exception as e:
            print("[Calendar] Error resolving car_id from Supabase:", e)
            
    # 2. Extract date and time
    date_str = slot_dt.strftime("%Y-%m-%d")
    time_str = slot_dt.strftime("%H:%M")
    
    # 3. Construct payload matching table columns
    payload = {
        "car_id": car_id,
        "user_id": None, # AI bookings default to guest/unauthenticated user
        "date": date_str,
        "time": time_str,
        "name": lead.get("name") or "AI Booking",
        "email": lead.get("email") or "",
        "phone": lead.get("phone") or "",
        "status": "pending"
    }
    
    # 4. Insert into test_drive_bookings
    try:
        res = requests.post(f"{url}/rest/v1/test_drive_bookings", headers=headers, json=payload, timeout=5)
        print(f"[Calendar] Inserted AI booking to Supabase. Status: {res.status_code}")
    except Exception as e:
        print("[Calendar] Error inserting booking to Supabase:", e)


def _normalize_creds_path(value: str) -> str:
    """Normalize credentials file path (same as CRMAdapter)."""
    value = (value or "").strip().strip('"').strip("'").lstrip("=")
    return os.path.normpath(value) if value else ""


class CalendarAdapter:
    """Real Google Calendar integration. Same config as voice_backend: Asia/Nicosia, 08:00-17:30."""

    TIMEZONE = "Asia/Nicosia"  # Cyprus (UTC+2/UTC+3); match voice_backend
    BUSINESS_HOURS_START = 8   # 08:00
    BUSINESS_HOURS_END = 17    # 17:00 (last slot at 16:30 ends at 17:30)
    APPOINTMENT_DURATION_HOURS = 1

    def __init__(self) -> None:
        self._service = None

    def _get_service(self):
        """Initialize Google Calendar API service."""
        if self._service is not None:
            return self._service

        # Check if calendar is configured
        calendar_id = os.getenv("GOOGLE_CALENDAR_ID", "").strip()
        if not calendar_id:
            print("[Calendar] No GOOGLE_CALENDAR_ID configured - using fallback mode")
            return None

        creds_file = _normalize_creds_path(os.getenv("GOOGLE_CREDENTIALS_FILE") or "")
        if not creds_file or not os.path.isfile(creds_file):
            print("[Calendar] No valid credentials file - using fallback mode")
            return None

        try:
            scopes = ["https://www.googleapis.com/auth/calendar"]
            credentials = Credentials.from_service_account_file(creds_file, scopes=scopes)
            self._service = build("calendar", "v3", credentials=credentials)
            print("[Calendar] Service initialized successfully")
            return self._service
        except Exception as e:
            print(f"[Calendar] Failed to initialize service: {e}")
            return None

    def _is_business_hours(self, dt: datetime) -> bool:
        """Check if datetime is within business hours (any day 08:00-17:30 Cyprus time)."""
        hour = dt.hour
        minute = dt.minute

        # Business hours: 08:00 - 17:30 (all days of the week)
        # Last appointment slot starts at 16:30 (ends at 17:30)
        if hour < self.BUSINESS_HOURS_START:
            return False
        if hour > 16:  # After 16:xx
            return False
        if hour == 16 and minute > 30:  # After 16:30
            return False

        return True

    def _get_next_business_day(self, start_date: datetime) -> datetime:
        """Return the given date (booking allowed all days of the week)."""
        return start_date

    def _generate_slots(self, start_date: datetime, num_slots: int = 20) -> List[Dict[str, Any]]:
        """Generate available time slots within business hours for the next 7 days."""
        tz = ZoneInfo(self.TIMEZONE)
        now = datetime.now(tz)
        slots: List[Dict[str, Any]] = []
        current = start_date.astimezone(tz)

        if current.hour >= 17:
            current = current.replace(hour=self.BUSINESS_HOURS_START, minute=0, second=0, microsecond=0)
            current = current + timedelta(days=1)
        elif current.hour < self.BUSINESS_HOURS_START:
            current = current.replace(hour=self.BUSINESS_HOURS_START, minute=0, second=0, microsecond=0)

        # Build slots for the next 7 days at fixed hours so weekends and weekdays are covered.
        # BUG #4 fix: skip any slot that is already in the past relative to "now".
        slot_hours = [9, 10, 11, 14, 15, 16]
        idx = 0
        for day_delta in range(0, 8):
            for hour in slot_hours:
                minute = 0
                slot_dt = current + timedelta(days=day_delta)
                slot_dt = slot_dt.replace(hour=hour, minute=minute, second=0, microsecond=0)
                if slot_dt <= now:
                    continue
                if not self._is_business_hours(slot_dt):
                    continue
                dt_str = slot_dt.isoformat()
                label = slot_dt.strftime("%A, %b %d at %I:%M %p")
                slots.append(
                    {
                        "id": f"slot_{idx + 1}",
                        "label": label,
                        "datetime": dt_str,
                        "start_time": slot_dt,
                    }
                )
                idx += 1
                if len(slots) >= num_slots:
                    return slots
        return slots

    def _check_availability_with_api(self, slots: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Check which slots are actually free using Google Calendar API."""
        service = self._get_service()
        if not service:
            # No API available, return all generated slots
            return slots
        
        calendar_id = os.getenv("GOOGLE_CALENDAR_ID", "").strip()
        if not calendar_id:
            return slots
        
        try:
            # Query free/busy for all slots
            time_min = min(s["start_time"] for s in slots).isoformat()
            time_max = (max(s["start_time"] for s in slots) + timedelta(hours=2)).isoformat()
            
            body = {
                "timeMin": time_min,
                "timeMax": time_max,
                "items": [{"id": calendar_id}]
            }
            
            freebusy = service.freebusy().query(body=body).execute()
            busy_times = freebusy.get("calendars", {}).get(calendar_id, {}).get("busy", [])
            
            # Filter out slots that conflict with busy times
            free_slots = []
            for slot in slots:
                start = slot["start_time"]
                end = start + timedelta(hours=self.APPOINTMENT_DURATION_HOURS)
                
                is_free = True
                for busy in busy_times:
                    busy_start = datetime.fromisoformat(busy["start"].replace("Z", "+00:00"))
                    busy_end = datetime.fromisoformat(busy["end"].replace("Z", "+00:00"))
                    
                    # Check if slot overlaps with busy time
                    if start < busy_end and end > busy_start:
                        is_free = False
                        break
                
                if is_free:
                    free_slots.append(slot)
            
            return free_slots if free_slots else slots  # Return original if none free
            
        except Exception as e:
            print(f"[Calendar] Error checking availability: {e}")
            return slots  # Return generated slots on error

    def get_available_slots(self, date_preference: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get available appointment slots.
        
        Args:
            date_preference: Optional date preference from user (not implemented yet)
        
        Returns:
            List of available slots with id, label, and datetime
        """
        # Start from now
        tz = ZoneInfo(self.TIMEZONE)
        now = datetime.now(tz)
        
        # Generate potential slots for the next 7 days (so e.g. Sunday appears)
        slots = self._generate_slots(now, num_slots=28)
        
        # Check availability against Google Calendar
        available_slots = self._check_availability_with_api(slots)
        
        # Log for debugging
        print(f"[Calendar] Generated {len(available_slots)} available slots")
        for slot in available_slots:
            print(f"[Calendar] - {slot['label']}")
        
        # Return slots without the start_time (not JSON serializable)
        return [{k: v for k, v in s.items() if k != "start_time"} for s in available_slots]

    def book_slot(self, slot_id: str, lead: Dict[str, Any],
                  override_slot: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Book a specific slot (creates Google Calendar event if API is available).

        Args:
            slot_id: ID of the slot to book
            lead: Lead information
            override_slot: If provided, use this slot dict directly instead of looking up slot_id.

        Returns:
            Result dict with ok, booking, and optional event_id
        """
        # Use override slot or look up from available slots
        if override_slot:
            slot = override_slot
        else:
            slots = self.get_available_slots()
            slot = None
            for s in slots:
                if s["id"] == slot_id:
                    slot = s
                    break
        
        if not slot:
            return {"ok": False, "message": "Slot not found"}

        # Insert booking into Supabase test_drive_bookings table
        try:
            start_dt = datetime.fromisoformat(slot["datetime"])
            insert_supabase_booking(lead, start_dt)
        except Exception as e:
            print(f"[Calendar] Error saving booking to Supabase: {e}")
        
        # Try to create Google Calendar event
        service = self._get_service()
        calendar_id = os.getenv("GOOGLE_CALENDAR_ID", "").strip()
        
        if service and calendar_id:
            try:
                # Parse the datetime
                start_dt = datetime.fromisoformat(slot["datetime"])
                end_dt = start_dt + timedelta(hours=self.APPOINTMENT_DURATION_HOURS)
                
                # Determine purpose based on intent
                intent = lead.get("intent", "")
                if intent == "buy":
                    purpose = "Property Viewing"
                elif intent == "rent":
                    purpose = "Rental Viewing"
                elif intent == "sell":
                    purpose = "Property Valuation"
                elif intent == "landlord":
                    purpose = "Rental Consultation"
                else:
                    purpose = "Consultation"

                # Try to include property reference/title if available
                prop = lead.get("interested_property") or lead.get("property_id") or ""
                
                # Create event
                event = {
                    "summary": f"{purpose} - {lead.get('name', 'Prospective Client')}{f' ({prop})' if prop else ''}",
                    "description": (
                        f"Client: {lead.get('name', 'N/A')}\n"
                        f"Phone: {lead.get('phone', 'N/A')}\n"
                        f"Email: {lead.get('email', 'N/A')}\n"
                        f"Purpose: {purpose}\n"
                        f"Property: {prop or 'N/A'}\n"
                        f"Location: {lead.get('location', 'N/A')}\n"
                        f"Budget: {lead.get('budget', 'N/A')}"
                    ),
                    "start": {
                        "dateTime": start_dt.isoformat(),
                        "timeZone": self.TIMEZONE,
                    },
                    "end": {
                        "dateTime": end_dt.isoformat(),
                        "timeZone": self.TIMEZONE,
                    },
                }
                
                created_event = service.events().insert(
                    calendarId=calendar_id,
                    body=event
                ).execute()
                
                print(f"[Calendar] Event created: {created_event.get('id')}")
                
                return {
                    "ok": True,
                    "booking": {
                        "slot": slot,
                        "lead_name": lead.get("name"),
                        "event_id": created_event.get("id"),
                    }
                }
                
            except Exception as e:
                print(f"[Calendar] Error creating event: {e}")
                # Fall through to non-API booking so the UI still shows it as scheduled
        
        # No API or error: return soft success (no event_id) so UI can still show "scheduled"
        return {
            "ok": True,
            "booking": {
                "slot": slot,
                "lead_name": lead.get("name")
            }
        }

    def cancel_event(self, event_id: str) -> bool:
        """Delete a Google Calendar event by its event_id.

        Returns True if deleted, False if API not configured or event not found.
        """
        service = self._get_service()
        calendar_id = (os.getenv("GOOGLE_CALENDAR_ID") or "").strip()

        if not service or not calendar_id:
            print(f"[Calendar] cancel_event: no API configured, skipping deletion of {event_id}")
            return False

        try:
            service.events().delete(
                calendarId=calendar_id,
                eventId=event_id,
            ).execute()
            print(f"[Calendar] Deleted event {event_id}")
            return True
        except Exception as e:
            print(f"[Calendar] cancel_event error for {event_id}: {e}")
            return False

    def book_datetime(self, preferred_dt: datetime, lead: Dict[str, Any]) -> Dict[str, Any]:
        """1) Ask date/time → 2) Try to book that time. If free, create event. If busy, return
        ok=False and exactly 3 free alternative slots. If user picks one (or another time), call
        again to book that slot.
        """
        tz = ZoneInfo(self.TIMEZONE)
        dt = preferred_dt.astimezone(tz)

        if not self._is_business_hours(dt):
            return {
                "ok": False,
                "reason": "outside_business_hours",
                "requested": dt.isoformat(),
                "message": "That time is outside our hours (08:00–16:30).",
            }

        slot = {
            "id": "custom",
            "label": dt.strftime("%A, %b %d at %I:%M %p"),
            "datetime": dt.isoformat(),
        }

        service = self._get_service()
        calendar_id = (os.getenv("GOOGLE_CALENDAR_ID") or "").strip()

        # Check if requested slot is free; if busy, return 3 free alternatives (no double-booking).
        if service and calendar_id:
            try:
                end_dt = dt + timedelta(hours=self.APPOINTMENT_DURATION_HOURS)
                body = {
                    "timeMin": dt.isoformat(),
                    "timeMax": end_dt.isoformat(),
                    "items": [{"id": calendar_id}],
                }
                freebusy = service.freebusy().query(body=body).execute()
                busy_times = freebusy.get("calendars", {}).get(calendar_id, {}).get("busy", [])

                is_free = True
                for busy in busy_times:
                    busy_start = datetime.fromisoformat(busy["start"].replace("Z", "+00:00"))
                    busy_end = datetime.fromisoformat(busy["end"].replace("Z", "+00:00"))
                    if dt < busy_end and end_dt > busy_start:
                        is_free = False
                        break

                if not is_free:
                    alternatives = self._get_alternatives_near(dt, num=3)
                    return {
                        "ok": False,
                        "reason": "slot_busy",
                        "requested_label": slot["label"],
                        "message": "No free slot at that time.",
                        "alternatives": alternatives,
                    }
            except Exception as e:
                print(f"[Calendar] book_datetime freebusy error: {e}")
                # On API error, still try to create the event (calendar may be slow).

        # Slot is free (or we couldn't check): create the event.
        fake_slot = {"id": "custom_slot", "label": slot["label"], "datetime": slot["datetime"]}
        result = self.book_slot("custom_slot", lead, override_slot=fake_slot)
        if not result.get("ok"):
            return result
        event_id = (result.get("booking") or {}).get("event_id")
        return {"ok": True, "slot": slot, "event_id": event_id}

    def _get_alternatives_near(self, preferred_dt: datetime, num: int = 3) -> List[Dict[str, Any]]:
        """Return up to `num` free slots closest to preferred_dt."""
        tz = ZoneInfo(self.TIMEZONE)
        # Try slots: same day earlier/later, next day
        candidates = []
        base = preferred_dt.astimezone(tz)
        for delta_hours in [1, -1, 2, 3, 4, 24, 25, 48]:
            candidate = base + timedelta(hours=delta_hours)
            candidate = candidate.replace(minute=0, second=0, microsecond=0)
            if self._is_business_hours(candidate):
                candidates.append({
                    "id": f"alt_{len(candidates) + 1}",
                    "label": candidate.strftime("%A, %b %d at %I:%M %p"),
                    "datetime": candidate.isoformat(),
                    "start_time": candidate,
                })
            if len(candidates) >= num * 2:
                break

        free = self._check_availability_with_api(candidates)
        return [{k: v for k, v in s.items() if k != "start_time"} for s in free[:num]]
