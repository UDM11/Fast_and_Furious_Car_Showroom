# Mock adapters - swap with real integrations later
from app.adapters.crm import CRMAdapter
from app.adapters.calendar import CalendarAdapter
from app.adapters.inventory import InventoryAdapter

__all__ = ["CRMAdapter", "CalendarAdapter", "InventoryAdapter"]
