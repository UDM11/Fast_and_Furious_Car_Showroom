"""CRM Adapter - Google Sheets API v4 (no gspread).

Uses googleapiclient directly. Stores leads with 18 columns; deduplicates by
phone or email. Timestamp and booking date are shown in short form (e.g. 20/3 13:00).
"""
import os
import re
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build


def _normalize_spreadsheet_id(value: str) -> str:
    value = (value or "").strip().strip('"').strip("'").split("#")[0].split("\n")[0]
    match = re.search(r"/d/([a-zA-Z0-9_-]+)", value)
    if match:
        return match.group(1)
    return value


def _normalize_creds_path(value: str) -> str:
    value = (value or "").strip().strip('"').strip("'").lstrip("=")
    return os.path.normpath(value) if value else ""


def _cell_str(val: Any) -> str:
    """Ensure a value is a string for Google Sheets (no dicts/objects)."""
    if val is None:
        return ""
    if isinstance(val, dict):
        return (val.get("title") or val.get("ref") or val.get("label") or str(val))[:500]
    if isinstance(val, (int, float)):
        return str(val)
    return str(val).strip()[:2000]


def _short_datetime(dt_or_str) -> str:
    """Format as day/month hour:minute, e.g. 20/3 13:00 (24h)."""
    if isinstance(dt_or_str, datetime):
        d = dt_or_str
    elif isinstance(dt_or_str, str) and dt_or_str.strip():
        try:
            d = datetime.fromisoformat(dt_or_str.strip().replace("Z", "+00:00"))
        except Exception:
            return dt_or_str
    else:
        return ""
    return f"{d.day}/{d.month} {d.hour:02d}:{d.minute:02d}"


class CRMAdapter:
    """Append/update lead in Google Sheets with duplicate detection."""

    def __init__(self) -> None:
        self._service = None

    def _get_service(self):
        if self._service is not None:
            return self._service
        creds_file = _normalize_creds_path(os.getenv("GOOGLE_CREDENTIALS_FILE") or "")
        if not creds_file or not os.path.isfile(creds_file):
            return None
        scopes = ["https://www.googleapis.com/auth/spreadsheets"]
        credentials = Credentials.from_service_account_file(creds_file, scopes=scopes)
        self._service = build("sheets", "v4", credentials=credentials)
        return self._service

    def _find_existing_row(self, service, spreadsheet_id: str, sheet: str,
                           lead: Dict[str, Any]) -> Optional[int]:
        """Find existing lead by phone or email. Returns row number (1-based) or None."""
        phone = (lead.get("phone") or "").strip()
        email = (lead.get("email") or "").strip().lower()
        if not phone and not email:
            return None
        try:
            result = service.spreadsheets().values().get(
                spreadsheetId=spreadsheet_id,
                range=f"'{sheet}'!A:R",
            ).execute()
            rows = result.get("values", [])
            if len(rows) < 2:
                return None
            # Row 0 = headers, rows 1+ = data
            for idx, row in enumerate(rows[1:], start=2):
                row_phone = (row[2] if len(row) > 2 else "").strip()
                row_email = (row[3] if len(row) > 3 else "").strip().lower()
                if (phone and row_phone == phone) or (email and row_email == email):
                    return idx
            return None
        except Exception:
            return None

    def _format_row(self, lead: Dict[str, Any]) -> List[str]:
        """Format lead data into 18 columns. Timestamp and booking date use short form (e.g. 20/3 13:00)."""
        ts = _short_datetime(datetime.now(timezone.utc))

        # Build a complete short profile summary
        summary_parts = []
        if lead.get("name"):
            summary_parts.append(lead["name"])
        intent = lead.get("intent") or ""
        if intent:
            summary_parts.append(f"wants to {intent}")
        if lead.get("property_type"):
            summary_parts.append(f"a {lead['property_type']}")
        # Location: city + area
        if lead.get("location_city"):
            loc = lead["location_city"]
            if lead.get("location_area"):
                loc += f", {lead['location_area']}"
            summary_parts.append(f"in {loc}")
        elif lead.get("location"):
            summary_parts.append(f"in {lead['location']}")
        if lead.get("budget"):
            summary_parts.append(f"budget {lead['budget']}")
        if lead.get("bedrooms"):
            summary_parts.append(f"{lead['bedrooms']} bedrooms")
        if lead.get("timeline"):
            summary_parts.append(f"timeline: {lead['timeline']}")
        booking = lead.get("booking") or {}
        if isinstance(booking, dict):
            blabel = booking.get("label") or (booking.get("slot") or {}).get("label", "") if isinstance(booking.get("slot"), dict) else booking.get("label", "")
            if blabel:
                summary_parts.append(f"Booked: {blabel}")
        if lead.get("handoff"):
            summary_parts.append("Requested human agent")
        profile_summary = ". ".join(summary_parts) if summary_parts else ""

        # Spreadsheet summary = clean profile line only (same as UI sidebar)
        transcript_str = profile_summary

        booking = lead.get("booking") or {}
        booking_date = lead.get("booking_date") or ""
        if not booking_date and isinstance(booking, dict):
            # Prefer short format from datetime if present (e.g. 20/3 13:00)
            if booking.get("datetime"):
                booking_date = _short_datetime(booking["datetime"])
            else:
                booking_date = booking.get("label", "")
        elif booking_date and isinstance(booking_date, str) and "T" in booking_date:
            try:
                booking_date = _short_datetime(booking_date)
            except Exception:
                pass
        booking_status = "Confirmed" if booking_date else "None"

        notes_parts = []
        if lead.get("notes"):
            notes_parts.append(lead["notes"])
        if lead.get("property_type"):
            notes_parts.append(f"Property Type: {lead['property_type']}")
        if lead.get("size_sqm"):
            notes_parts.append(f"Size: {lead['size_sqm']} sqm")
        if lead.get("condition"):
            notes_parts.append(f"Condition: {lead['condition']}")
        if lead.get("lease_duration"):
            notes_parts.append(f"Lease: {lead['lease_duration']}")
        if lead.get("furnished"):
            notes_parts.append(f"Furnished: {lead['furnished']}")
        if lead.get("handoff"):
            notes_parts.append("Requested human agent")
        if lead.get("expected_price"):
            notes_parts.append(f"Expected price: {lead['expected_price']}")
        if lead.get("expected_rental_price"):
            notes_parts.append(f"Expected rental: {lead['expected_rental_price']}")
        if lead.get("move_in_date"):
            notes_parts.append(f"Move-in: {lead['move_in_date']}")
        if lead.get("availability_date"):
            notes_parts.append(f"Available: {lead['availability_date']}")
        notes = " | ".join(notes_parts)

        return [
            _cell_str(ts),                                                      # 1. Timestamp
            _cell_str(lead.get("name")),                                        # 2. Full Name
            _cell_str(lead.get("phone")),                                       # 3. Phone
            _cell_str(lead.get("email")),                                       # 4. Email
            _cell_str(lead.get("preferred_contact")),                           # 5. Preferred Contact
            _cell_str(lead.get("language") or "en"),                            # 6. Language
            _cell_str(lead.get("intent")),                                      # 7. Intent
            _cell_str(lead.get("location_city") or lead.get("location")),       # 8. City
            _cell_str(lead.get("location_area")),                               # 9. Area
            _cell_str(lead.get("budget")),                                      # 10. Budget
            _cell_str(lead.get("bedrooms")),                                     # 11. Bedrooms
            _cell_str(lead.get("timeline")),                                    # 12. Timeline
            _cell_str(lead.get("interested_property")),                          # 13. Interested Property (may be dict from listing)
            _cell_str(lead.get("property_id")),                                  # 14. Property ID
            _cell_str(booking_status),                                          # 15. Booking Status
            _cell_str(booking_date),                                            # 16. Booking Date
            _cell_str(notes),                                                    # 17. Notes
            _cell_str(transcript_str),                                           # 18. Conversation Transcript
        ]

    def _create_or_update_lead(self, lead: Dict[str, Any]) -> None:
        service = self._get_service()
        if service is None:
            print("[CRM] No Google credentials configured -- skipping save")
            return

        spreadsheet_id = _normalize_spreadsheet_id(os.getenv("GOOGLE_SHEETS_SPREADSHEET_ID") or "")
        sheet = (os.getenv("GOOGLE_SHEETS_WORKSHEET_NAME") or "Leads").strip().strip('"').strip("'")
        if not spreadsheet_id:
            print("[CRM] No spreadsheet ID configured -- skipping save")
            return

        row_data = self._format_row(lead)

        # Check for existing lead (deduplicate by phone/email)
        existing_row = self._find_existing_row(service, spreadsheet_id, sheet, lead)

        if existing_row:
            rng = f"'{sheet}'!A{existing_row}:R{existing_row}"
            service.spreadsheets().values().update(
                spreadsheetId=spreadsheet_id,
                range=rng,
                body={"values": [row_data]},
                valueInputOption="RAW",
            ).execute()
            print(f"[CRM] Updated existing row {existing_row}")
        else:
            service.spreadsheets().values().append(
                spreadsheetId=spreadsheet_id,
                range=f"'{sheet}'!A:R",
                body={"values": [row_data]},
                valueInputOption="RAW",
                insertDataOption="INSERT_ROWS",
            ).execute()
            print("[CRM] Appended new lead row")

    def save_lead(self, lead: Dict[str, Any], event: str = "qualified") -> Dict[str, Any]:
        try:
            self._create_or_update_lead(lead)
            return {"ok": True}
        except Exception as exc:
            print(f"[CRM] Save error: {exc}")
            return {"ok": False, "message": repr(exc)}
