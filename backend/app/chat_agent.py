from __future__ import annotations

import re
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional, Tuple
from zoneinfo import ZoneInfo
import os
from openai import OpenAI

from app.adapters.calendar import CalendarAdapter
from app.adapters.crm import CRMAdapter
from app.adapters.inventory import InventoryAdapter
from app.storage import load_lead, save_lead

# Day names for parsing
_DAY_NAMES = {
    "monday": 0, "mon": 0, "tuesday": 1, "tue": 1, "wednesday": 2, "wed": 2,
    "thursday": 3, "thu": 3, "friday": 4, "fri": 4, "saturday": 5, "sat": 5,
    "sunday": 6, "sun": 6,
}
_HOUR_WORDS = {
    "one": 1, "two": 2, "three": 3, "four": 4, "five": 5, "six": 6,
    "seven": 7, "eight": 8, "nine": 9, "ten": 10, "eleven": 11, "twelve": 12,
}

def _parse_preferred_datetime(date_description: str, time_description: str) -> Optional[datetime]:
    tz = ZoneInfo("Asia/Nicosia")
    now = datetime.now(tz)
    today = now.date()

    date_part = (date_description or "").strip().lower()
    time_part = (time_description or "").strip().lower()
    target_date = None
    if not date_part and not time_part:
        return None
    if re.search(r"\b(tomorrow|αύριο|αυριο|завтра)\b", date_part):
        target_date = today + timedelta(days=1)
    elif re.search(r"\b(today|σήμερα|σημερα|сегодня)\b", date_part):
        target_date = today
    else:
        for name, wday in _DAY_NAMES.items():
            if re.search(rf"\b{name}\b", date_part):
                days_ahead = (wday - today.weekday() + 7) % 7
                if days_ahead == 0:
                    days_ahead = 7
                target_date = today + timedelta(days=days_ahead)
                break
    if not target_date:
        target_date = today + timedelta(days=1)

    hour, minute = None, 0
    for word, h_val in _HOUR_WORDS.items():
        if re.search(rf"\b{word}\b\s*(?:o['']?clock)?\s*(am|pm)?\b", time_part):
            meridiem = "pm" if "pm" in time_part else ("am" if "am" in time_part else None)
            h = h_val
            if meridiem == "pm" and h < 12:
                h += 12
            elif meridiem == "am" and h == 12:
                h = 0
            hour = h
            minute = 0
            break
    if hour is None:
        time_match = re.search(r"\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b", time_part)
        if time_match:
            h = int(time_match.group(1))
            m = int(time_match.group(2)) if time_match.group(2) else 0
            meridiem = time_match.group(3)
            if meridiem == "pm" and h < 12:
                h += 12
            elif meridiem == "am" and h == 12:
                h = 0
            hour = h
            minute = m
    if hour is None:
        return None

    return datetime(target_date.year, target_date.month, target_date.day, hour, minute, 0, tzinfo=tz)


_client: OpenAI | None = None

def _get_client() -> OpenAI:
    global _client
    if _client is None:
        _client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    return _client

def _system_prompt(now: datetime | None = None) -> str:
    now = now or datetime.utcnow()
    now_str = now.strftime("%A, %d %B %Y, %H:%M UTC")
    return f"""
You are the official AI Assistant for Fast and Furious Car Showroom. You should sound like a warm, knowledgeable car sales consultant — calm, helpful, and human, never like a script or a robot.

Date/time now: {now_str}

Your goals:
- Understand what the client wants (buy / lease / test drive / general question).
- Ask only the questions that are really needed.
- When they ask about cars (e.g. "Do you have any SUVs under $40,000?"), use the search_cars tool and then answer with specific options in plain language.
- Name and phone: Accept the name and phone exactly as the user gives them. A first name and a number are enough. If the user says the name and number they gave are their full name and number, accept it and move on to the next step.
- Calendar flow (strict): (1) Do NOT call book_preferred_time or book_slot until the user has given you BOTH their name AND phone number. (2) When you call book_preferred_time you MUST pass in the lead parameter a full object with every detail you already know: name, phone, intent, budget, interested_car, etc. (3) After name and phone, ask once: "When would you like to come in for a test drive or consultation? You can give me a day and time that suits you." (4) When the user gives a date and time, call book_preferred_time with that date and time and the full lead. (5) If the tool returns ok: true, confirm the booking. (6) If it returns ok: false with reason "missing_contact", say you need their name and phone to confirm the booking and ask them to share again. (7) If it returns ok: false with "alternatives", say we have no free slot at that time but we have these 3 options (list the labels), and ask which they want. (8) If the user picks one or another time, call book_preferred_time again with that date/time and the full lead.
- Keep track of the specific car they are interested in and include it in the lead when booking and in your confirmation message.
- CRM and conversation memory (mandatory): (1) Call save_lead_to_crm as soon as you have meaningful lead data (e.g. intent, brand preference, or name and phone), even if the user has not booked. (2) When you have name and phone, call save_lead_to_crm with a complete lead object. (3) If you have just booked an appointment, include in the lead the booking so the CRM shows the appointment.
- If search_cars returns no suitable cars, briefly summarise what they are looking for and suggest a consultation or test drive with a human agent to explore similar options.

Tone and phrasing:
- Use natural confirmations like "Of course.", "Absolutely.", "Perfect." but do not repeat the same word every time.
- Keep replies short and natural. One question at a time. No long bullet lists unless you are summarising search results.
- If you are not sure about something, ask one short clarifying question instead of guessing.
- Never re-ask for information the user has already given. Use what they said and move to the next step.

Tools:
- Use the tools to search cars, check availability, book appointments, and save/update client details. Never invent car prices or availability. When you call save_lead_to_crm, pass a lead object containing all known fields.
- Calendar: Business hours are 08:00–16:30.
"""

OPENAI_TOOLS: List[Dict[str, Any]] = [
    {
        "type": "function",
        "function": {
            "name": "search_cars",
            "description": "Search car inventory by brand, body type, budget, and condition.",
            "parameters": {
                "type": "object",
                "properties": {
                    "brand": {
                        "type": "string",
                        "description": "Car brand (e.g. Toyota, Ford, BMW).",
                    },
                    "body_type": {
                        "type": "string",
                        "description": "Body type (e.g. SUV, Sedan, Coupe).",
                    },
                    "budget_min": {
                        "type": "number",
                        "description": "Minimum budget in dollars.",
                    },
                    "budget_max": {
                        "type": "number",
                        "description": "Maximum budget in dollars.",
                    },
                    "condition": {
                        "type": "string",
                        "description": "New or Used.",
                    },
                },
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_available_slots",
            "description": "Get upcoming appointment slots from the calendar.",
            "parameters": {
                "type": "object",
                "properties": {
                    "date_preference": {
                        "type": "string",
                    }
                },
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "book_slot",
            "description": "Book a specific slot for a test drive or consultation. Only call when the user has explicitly chosen a slot.",
            "parameters": {
                "type": "object",
                "properties": {
                    "slot_id": {
                        "type": "string",
                    },
                    "lead": {
                        "type": "object",
                    },
                },
                "required": ["slot_id"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "book_preferred_time",
            "description": "Try to book the user's requested day and time. MUST pass the lead parameter with name and phone.",
            "parameters": {
                "type": "object",
                "properties": {
                    "date_description": {
                        "type": "string",
                    },
                    "time_description": {
                        "type": "string",
                    },
                    "lead": {
                        "type": "object",
                    },
                },
                "required": ["date_description", "time_description"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "save_lead_to_crm",
            "description": "Create or update a lead in Google Sheets CRM.",
            "parameters": {
                "type": "object",
                "properties": {
                    "lead": {
                        "type": "object",
                    }
                },
                "required": ["lead"],
            },
        },
    },
]

def _execute_tool(name: str, arguments: Dict[str, Any]) -> Tuple[str, Any]:
    if name == "search_cars":
        adapter = InventoryAdapter()
        criteria: Dict[str, Any] = {}
        for k in ["brand", "body_type", "condition", "budget_min", "budget_max"]:
            if k in arguments:
                criteria[k] = arguments[k]
        listings = adapter.search(criteria)
        return name, {"cars": listings}

    if name == "get_available_slots":
        adapter = CalendarAdapter()
        slots = adapter.get_available_slots(date_preference=arguments.get("date_preference"))
        return name, {"slots": slots}

    if name == "book_slot":
        adapter = CalendarAdapter()
        slot_id = arguments.get("slot_id") or ""
        lead = arguments.get("lead") or {}
        try:
            current = load_lead()
            for k, v in (lead if isinstance(lead, dict) else {}).items():
                if v: current[k] = v
        except Exception:
            current = lead if isinstance(lead, dict) else {}

        if not current.get("name") or not current.get("phone"):
            return name, {
                "ok": False,
                "message": "Cannot book: missing name or phone. Please ask the client."
            }
        result = adapter.book_slot(slot_id, current)
        if isinstance(result.get("ok"), bool) and result.get("ok"):
            try:
                if result.get("booking"):
                    current["booking"] = result.get("booking", {}).get("slot") or result.get("booking")
                save_lead(current)
                CRMAdapter().save_lead(current)
            except Exception:
                pass
        return name, result

    if name == "book_preferred_time":
        adapter = CalendarAdapter()
        date_desc = (arguments.get("date_description") or "").strip() or ""
        time_desc = (arguments.get("time_description") or "").strip() or ""
        lead = arguments.get("lead") or {}
        if not date_desc or not time_desc:
            return name, {"ok": False, "message": "Missing date or time."}

        try:
            current = load_lead()
            for k, v in (lead if isinstance(lead, dict) else {}).items():
                if v: current[k] = v
        except Exception:
            current = lead if isinstance(lead, dict) else {}

        if not (current.get("name") or "").strip() or not (current.get("phone") or "").strip():
            return name, {
                "ok": False,
                "reason": "missing_contact",
                "message": "Need client name and phone to book."
            }
        preferred_dt = _parse_preferred_datetime(date_desc, time_desc)
        if preferred_dt is None:
            return name, {"ok": False, "message": "Could not parse date/time."}
        result = adapter.book_datetime(preferred_dt, current)
        if isinstance(result.get("ok"), bool) and result.get("ok"):
            try:
                if result.get("slot"):
                    current["booking"] = result.get("slot")
                save_lead(current)
                CRMAdapter().save_lead(current)
            except Exception:
                pass
        return name, result

    if name == "save_lead_to_crm":
        adapter = CRMAdapter()
        lead = arguments.get("lead") or {}
        if not isinstance(lead, dict): lead = {}
        try:
            current = load_lead()
            for k, v in lead.items():
                if v: current[k] = v
            lead = current
            save_lead(lead)
        except Exception:
            pass
        result = adapter.save_lead(lead)
        return name, result

    return name, {"ok": False, "message": f"Unknown tool: {name}"}

def run_chat_turn(
    user_message: str,
    history: List[Dict[str, Any]],
) -> Tuple[str, List[Dict[str, Any]]]:
    client = _get_client()
    now = datetime.utcnow()

    messages: List[Dict[str, Any]] = [
        {"role": "system", "content": _system_prompt(now)},
    ] + history
    messages.append({"role": "user", "content": user_message})

    for _ in range(5):
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            tools=OPENAI_TOOLS,
            tool_choice="auto",
        )
        choice = response.choices[0]
        msg = choice.message

        tool_calls = msg.tool_calls or []
        if tool_calls:
            messages.append(
                {
                    "role": "assistant",
                    "content": msg.content or "",
                    "tool_calls": [
                        {
                            "id": tc.id,
                            "type": "function",
                            "function": {
                                "name": tc.function.name,
                                "arguments": tc.function.arguments or "{}",
                            },
                        }
                        for tc in tool_calls
                    ],
                }
            )
            for tc in tool_calls:
                name = tc.function.name
                try:
                    import json as _json
                    args = _json.loads(tc.function.arguments or "{}")
                except Exception:
                    args = {}
                _, result = _execute_tool(name, args)
                import json as _json
                result_str = _json.dumps(result, ensure_ascii=False)
                messages.append(
                    {
                        "role": "tool",
                        "tool_call_id": tc.id,
                        "name": name,
                        "content": result_str,
                    }
                )
            continue

        reply_text = msg.content or ""
        messages.append({"role": "assistant", "content": reply_text})
        new_history = [m for m in messages if m.get("role") != "system"]
        return reply_text, new_history

    fallback = "Thank you. I’ve processed your request; an agent will follow up with you shortly."
    messages.append({"role": "assistant", "content": fallback})
    new_history = [m for m in messages if m.get("role") != "system"]
    return fallback, new_history
