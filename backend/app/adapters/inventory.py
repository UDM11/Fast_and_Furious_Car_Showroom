"""Inventory Adapter - Supabase and fallback static car listings.

Pulls live vehicle information from Supabase for the AI chat agent.
"""
import re
import os
import requests
from typing import Any
from dotenv import load_dotenv

# Curated list of actual showroom cars as a fallback
STATIC_CAR_LISTINGS = [
    {
        "id": "1",
        "ref": "INV-001",
        "title": "2023 Ferrari 488 GTB",
        "brand": "Ferrari",
        "model": "488 GTB",
        "body_type": "sports",
        "price": "$330,000",
        "price_num": 330000,
        "condition": "New",
        "year": 2023,
    },
    {
        "id": "2",
        "ref": "INV-002",
        "title": "2024 Lamborghini Huracán",
        "brand": "Lamborghini",
        "model": "Huracán",
        "body_type": "sports",
        "price": "$285,000",
        "price_num": 285000,
        "condition": "New",
        "year": 2024,
    },
    {
        "id": "3",
        "ref": "INV-003",
        "title": "2023 Porsche Cayenne",
        "brand": "Porsche",
        "model": "Cayenne",
        "body_type": "suv",
        "price": "$85,000",
        "price_num": 85000,
        "condition": "Used",
        "year": 2023,
    },
    {
        "id": "4",
        "ref": "INV-004",
        "title": "2024 BMW M5 Competition",
        "brand": "BMW",
        "model": "M5 Competition",
        "body_type": "sedan",
        "price": "$125,000",
        "price_num": 125000,
        "condition": "New",
        "year": 2024,
    },
    {
        "id": "5",
        "ref": "INV-005",
        "title": "2023 Mercedes-Benz AMG GT",
        "brand": "Mercedes-Benz",
        "model": "AMG GT",
        "body_type": "sports",
        "price": "$165,000",
        "price_num": 165000,
        "condition": "Used",
        "year": 2023,
    },
    {
        "id": "6",
        "ref": "INV-006",
        "title": "2024 Range Rover Sport",
        "brand": "Range Rover",
        "model": "Sport",
        "body_type": "suv",
        "price": "$95,000",
        "price_num": 95000,
        "condition": "New",
        "year": 2024,
    },
    {
        "id": "7",
        "ref": "INV-007",
        "title": "2024 Tesla Model S Plaid",
        "brand": "Tesla",
        "model": "Model S Plaid",
        "body_type": "sedan",
        "price": "$89,990",
        "price_num": 89990,
        "condition": "New",
        "year": 2024,
    },
    {
        "id": "8",
        "ref": "INV-008",
        "title": "2024 Audi RS e-tron GT",
        "brand": "Audi",
        "model": "RS e-tron GT",
        "body_type": "sedan",
        "price": "$104,900",
        "price_num": 104900,
        "condition": "New",
        "year": 2024,
    }
]

def get_supabase_cars() -> list[dict[str, Any]]:
    """Fetch live cars from Supabase database."""
    # Ensure env is loaded
    load_dotenv()
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_ANON_KEY")
    if not url or not key:
        return []
    
    headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}"
    }
    
    try:
        res = requests.get(f"{url}/rest/v1/cars", headers=headers, timeout=5)
        if res.status_code != 200:
            return []
        
        db_cars = res.json()
        listings = []
        for idx, car in enumerate(db_cars):
            make = car.get("make") or ""
            model = car.get("model") or ""
            year = car.get("year") or 2024
            price_num = car.get("price") or 0
            is_new = car.get("is_new")
            if is_new is None:
                # check fallback field casing
                is_new = car.get("isNew", True)
            
            listings.append({
                "id": car.get("id") or f"car_{idx}",
                "ref": f"INV-{idx+1:03d}",
                "title": f"{year} {make} {model}",
                "brand": make,
                "model": model,
                "body_type": car.get("type") or "Sedan",
                "price": f"${price_num:,}",
                "price_num": price_num,
                "condition": "New" if is_new else "Used",
                "year": year,
                "engine": car.get("engine") or "",
                "fuel": car.get("fuel") or "",
                "transmission": car.get("transmission") or "",
                "mileage": car.get("mileage") or 0,
                "description": car.get("description") or "",
                "features": car.get("features") or [],
            })
        return listings
    except Exception:
        return []

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

        # Fetch from Supabase, fallback to static showroom listings
        all_listings = get_supabase_cars()
        if not all_listings:
            all_listings = STATIC_CAR_LISTINGS

        out = []
        for p in all_listings:
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
