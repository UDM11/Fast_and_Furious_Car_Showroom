"""Inventory Adapter - Mock Car Showroom properties (for_sale/lease).

Curated list of cars for the chatbot.
"""
import re
from typing import Any

# Mock Car Showroom properties
CARS_LISTINGS = [
    {
        "id": "car_001",
        "ref": "INV-001",
        "title": "2024 Toyota Camry XSE",
        "brand": "Toyota",
        "model": "Camry",
        "body_type": "Sedan",
        "price": "$34,000",
        "price_num": 34000,
        "condition": "New",
        "year": 2024,
    },
    {
        "id": "car_002",
        "ref": "INV-002",
        "title": "2023 Honda CR-V EX-L",
        "brand": "Honda",
        "model": "CR-V",
        "body_type": "SUV",
        "price": "$31,500",
        "price_num": 31500,
        "condition": "New",
        "year": 2023,
    },
    {
        "id": "car_003",
        "ref": "INV-003",
        "title": "2024 Ford Mustang GT Premium",
        "brand": "Ford",
        "model": "Mustang",
        "body_type": "Coupe",
        "price": "$52,000",
        "price_num": 52000,
        "condition": "New",
        "year": 2024,
    },
    {
        "id": "car_004",
        "ref": "INV-004",
        "title": "2022 BMW 3 Series 330i",
        "brand": "BMW",
        "model": "3 Series",
        "body_type": "Sedan",
        "price": "$39,900",
        "price_num": 39900,
        "condition": "Used",
        "year": 2022,
    },
    {
        "id": "car_005",
        "ref": "INV-005",
        "title": "2024 Tesla Model Y Long Range",
        "brand": "Tesla",
        "model": "Model Y",
        "body_type": "SUV",
        "price": "$48,990",
        "price_num": 48990,
        "condition": "New",
        "year": 2024,
    },
    {
        "id": "car_006",
        "ref": "INV-006",
        "title": "2021 Toyota RAV4 XLE",
        "brand": "Toyota",
        "model": "RAV4",
        "body_type": "SUV",
        "price": "$26,500",
        "price_num": 26500,
        "condition": "Used",
        "year": 2021,
    },
    {
        "id": "car_007",
        "ref": "INV-007",
        "title": "2024 Porsche 911 Carrera",
        "brand": "Porsche",
        "model": "911",
        "body_type": "Coupe",
        "price": "$114,400",
        "price_num": 114400,
        "condition": "New",
        "year": 2024,
    },
    {
        "id": "car_008",
        "ref": "INV-008",
        "title": "2023 Ford F-150 Lariat",
        "brand": "Ford",
        "model": "F-150",
        "body_type": "Truck",
        "price": "$61,000",
        "price_num": 61000,
        "condition": "New",
        "year": 2023,
    },
    {
        "id": "car_009",
        "ref": "INV-009",
        "title": "2020 Honda Civic Sport",
        "brand": "Honda",
        "model": "Civic",
        "body_type": "Sedan",
        "price": "$19,800",
        "price_num": 19800,
        "condition": "Used",
        "year": 2020,
    }
]

def _normalize_string(s: str) -> str:
    """Normalize string for matching."""
    if not s or not s.strip():
        return ""
    return s.strip().lower()

def _price_to_num(price_str: str) -> int | None:
    """Extract numeric price from string like $325,000."""
    if not price_str:
        return None
    s = re.sub(r"[^\d]", "", price_str.replace(" ", ""))
    return int(s) if s else None

class InventoryAdapter:
    """Car Showroom Inventory Adapter. search(criteria) filters by lead preferences."""

    def search(self, criteria: dict[str, Any] | None = None) -> list[dict[str, Any]]:
        """
        Return listings, optionally filtered by criteria.
        """
        criteria = criteria or {}
        brand_want = _normalize_string(str(criteria.get("brand") or ""))
        body_type_want = _normalize_string(str(criteria.get("body_type") or ""))
        condition_want = _normalize_string(str(criteria.get("condition") or ""))
        budget_min = criteria.get("budget_min")
        budget_max = criteria.get("budget_max")

        if budget_min is not None and not isinstance(budget_min, int):
            budget_min = _price_to_num(str(budget_min)) if budget_min else None
        if budget_max is not None and not isinstance(budget_max, int):
            budget_max = _price_to_num(str(budget_max)) if budget_max else None

        out = []
        for p in CARS_LISTINGS:
            # Brand filter
            if brand_want and brand_want not in _normalize_string(p.get("brand", "")):
                continue
            # Body type filter
            if body_type_want and body_type_want not in _normalize_string(p.get("body_type", "")):
                continue
            # Condition filter
            if condition_want and condition_want != _normalize_string(p.get("condition", "")):
                continue
            # Budget range
            price_num = p.get("price_num") or _price_to_num(p.get("price", ""))
            if price_num is not None:
                if budget_min is not None and price_num < budget_min:
                    continue
                if budget_max is not None and price_num > budget_max:
                    continue
            out.append(p.copy())

        # Sort by relevance
        def score(prop: dict) -> tuple:
            same_brand = 1 if brand_want and brand_want in _normalize_string(prop.get("brand", "")) else 0
            price_num = prop.get("price_num") or _price_to_num(prop.get("price", "")) or 0
            budget_mid = (budget_min + budget_max) / 2 if (budget_min is not None and budget_max is not None) else (budget_min or budget_max or 0)
            budget_diff = abs(price_num - budget_mid) if budget_mid else 0
            return (-same_brand, budget_diff)

        out.sort(key=score)
        return out
