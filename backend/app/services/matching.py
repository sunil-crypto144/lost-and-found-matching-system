from datetime import datetime
from typing import Dict, Any, List, Tuple
from app.core.config import settings
from app.models.db_models import Item
from app.services.text_similarity import calculate_text_similarity, fuzzy_ratio, normalize_text
from app.services.image_similarity import calculate_image_similarity

def calculate_category_score(cat1: str, cat2: str) -> float:
    if not cat1 or not cat2:
        return 0.0
    if normalize_text(cat1) == normalize_text(cat2):
        return 100.0
    return 0.0

def calculate_item_score(name1: str, name2: str) -> float:
    return calculate_text_similarity(name1, name2)

def calculate_brand_score(brand1: str, brand2: str) -> float:
    b1 = normalize_text(brand1 or "")
    b2 = normalize_text(brand2 or "")
    if not b1 or not b2:
        return 50.0  # Neutral score if brand isn't specified
    if b1 == b2:
        return 100.0
    if b1 in b2 or b2 in b1:
        return 85.0
    return fuzzy_ratio(b1, b2)

def calculate_color_score(color1: str, color2: str) -> float:
    c1 = normalize_text(color1 or "")
    c2 = normalize_text(color2 or "")
    if not c1 or not c2:
        return 50.0  # Neutral score if color isn't specified
    if c1 == c2:
        return 100.0
    if c1 in c2 or c2 in c1:
        return 80.0
    return fuzzy_ratio(c1, c2)

def calculate_location_score(loc1: str, loc2: str, lat1: float = None, lon1: float = None, lat2: float = None, lon2: float = None) -> float:
    # If coordinates exist, use lat/lon proximity
    if lat1 is not None and lon1 is not None and lat2 is not None and lon2 is not None:
        dist_sq = (lat1 - lat2)**2 + (lon1 - lon2)**2
        if dist_sq < 0.0001:  # ~100 meters
            return 100.0
        elif dist_sq < 0.0025: # ~500 meters
            return 85.0
        elif dist_sq < 0.01:   # ~1 km
            return 70.0
    
    # Fallback to location string text similarity
    return calculate_text_similarity(loc1, loc2)

def calculate_time_score(date_str1: str, date_str2: str) -> float:
    try:
        d1 = datetime.strptime(date_str1, "%Y-%m-%d")
        d2 = datetime.strptime(date_str2, "%Y-%m-%d")
        days_diff = abs((d1 - d2).days)
        
        if days_diff == 0:
            return 100.0
        elif days_diff == 1:
            return 85.0
        elif days_diff <= 3:
            return 70.0
        elif days_diff <= 7:
            return 45.0
        elif days_diff <= 14:
            return 25.0
        else:
            return 10.0
    except Exception:
        return 50.0

def calculate_description_score(desc1: str, desc2: str) -> float:
    return calculate_text_similarity(desc1, desc2)

def compute_match_factors(item1: Item, item2: Item) -> Dict[str, float]:
    cat_score = calculate_category_score(item1.category, item2.category)
    item_score = calculate_item_score(item1.name, item2.name)
    brand_score = calculate_brand_score(item1.brand, item2.brand)
    color_score = calculate_color_score(item1.color, item2.color)
    loc_score = calculate_location_score(
        item1.location, item2.location,
        item1.latitude, item1.longitude,
        item2.latitude, item2.longitude
    )
    time_score = calculate_time_score(item1.event_date, item2.event_date)
    desc_score = calculate_description_score(item1.description, item2.description)
    img_score = calculate_image_similarity(item1.image_url, item2.image_url)

    return {
        "category_score": cat_score,
        "item_score": item_score,
        "brand_score": brand_score,
        "color_score": color_score,
        "location_score": loc_score,
        "time_score": time_score,
        "description_score": desc_score,
        "image_score": img_score
    }

def calculate_overall_score(factors: Dict[str, float], custom_weights: Dict[str, float] = None) -> float:
    w_cat = custom_weights.get("WEIGHT_CATEGORY", settings.WEIGHT_CATEGORY) if custom_weights else settings.WEIGHT_CATEGORY
    w_item = custom_weights.get("WEIGHT_ITEM_NAME", settings.WEIGHT_ITEM_NAME) if custom_weights else settings.WEIGHT_ITEM_NAME
    w_brand = custom_weights.get("WEIGHT_BRAND", settings.WEIGHT_BRAND) if custom_weights else settings.WEIGHT_BRAND
    w_color = custom_weights.get("WEIGHT_COLOR", settings.WEIGHT_COLOR) if custom_weights else settings.WEIGHT_COLOR
    w_loc = custom_weights.get("WEIGHT_LOCATION", settings.WEIGHT_LOCATION) if custom_weights else settings.WEIGHT_LOCATION
    w_time = custom_weights.get("WEIGHT_TIME", settings.WEIGHT_TIME) if custom_weights else settings.WEIGHT_TIME
    w_desc = custom_weights.get("WEIGHT_DESCRIPTION", settings.WEIGHT_DESCRIPTION) if custom_weights else settings.WEIGHT_DESCRIPTION

    weighted_sum = (
        factors["category_score"] * w_cat +
        factors["item_score"] * w_item +
        factors["brand_score"] * w_brand +
        factors["color_score"] * w_color +
        factors["location_score"] * w_loc +
        factors["time_score"] * w_time +
        factors["description_score"] * w_desc
    )
    
    total_weight = w_cat + w_item + w_brand + w_color + w_loc + w_time + w_desc
    final_score = weighted_sum / total_weight if total_weight > 0 else 0.0
    return round(max(0.0, min(100.0, final_score)), 1)

def generate_explainable_reasons(item1: Item, item2: Item, factors: Dict[str, float]) -> List[str]:
    reasons = []

    if factors["category_score"] == 100.0:
        reasons.append(f"Identical category ({item1.category})")
    elif factors["category_score"] > 0:
        reasons.append("Matching category group")

    if factors["item_score"] >= 80.0:
        reasons.append(f"High item name similarity ({factors['item_score']}%)")

    if item1.brand and item2.brand:
        if factors["brand_score"] >= 85.0:
            reasons.append(f"Matching brand ({item1.brand})")

    if item1.color and item2.color:
        if factors["color_score"] >= 80.0:
            reasons.append(f"Matching color scheme ({item1.color})")

    if factors["location_score"] >= 85.0:
        reasons.append(f"Nearby/Same location ({item1.location})")
    elif factors["location_score"] >= 60.0:
        reasons.append("Similar location area")

    if factors["time_score"] == 100.0:
        reasons.append("Reported on the exact same date")
    elif factors["time_score"] >= 70.0:
        reasons.append("Reported within 1 to 3 days of each other")

    if factors["description_score"] >= 75.0:
        reasons.append(f"High description semantic similarity ({factors['description_score']}%)")

    if factors.get("image_score", 0.0) >= 70.0:
        reasons.append(f"Visual image similarity match ({factors['image_score']}%)")

    if not reasons:
        reasons.append("General attribute correlation")

    return reasons
