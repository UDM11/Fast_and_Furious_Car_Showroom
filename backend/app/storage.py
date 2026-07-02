"""Local JSON persistence for lead state. Demo only."""
import json
from pathlib import Path
from typing import Any

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
LEAD_FILE = DATA_DIR / "lead.json"


def ensure_data_dir() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)


def default_lead() -> dict[str, Any]:
    return {}


def load_lead() -> dict[str, Any]:
    ensure_data_dir()
    if not LEAD_FILE.exists():
        return default_lead()
    try:
        with open(LEAD_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
        out = default_lead()
        out.update(data)
        return out
    except (json.JSONDecodeError, IOError):
        return default_lead()


def save_lead(lead: dict[str, Any]) -> None:
    ensure_data_dir()
    with open(LEAD_FILE, "w", encoding="utf-8") as f:
        json.dump(lead, f, indent=2, ensure_ascii=False)


def reset_lead() -> dict[str, Any]:
    lead = default_lead()
    save_lead(lead)
    return lead
