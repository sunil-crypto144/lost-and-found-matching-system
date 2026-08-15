import pytest
from app.services.matching import (
    calculate_category_score,
    calculate_item_score,
    calculate_brand_score,
    calculate_color_score,
    calculate_location_score,
    calculate_time_score,
    calculate_description_score,
    calculate_overall_score,
    generate_explainable_reasons
)
from app.services.text_similarity import calculate_text_similarity
from app.models.db_models import Item, ItemType, ItemStatus

def test_category_matching():
    assert calculate_category_score("Electronics", "Electronics") == 100.0
    assert calculate_category_score("electronics", "ELECTRONICS") == 100.0
    assert calculate_category_score("Electronics", "Bags") == 0.0

def test_brand_matching():
    assert calculate_brand_score("Samsung", "Samsung") == 100.0
    assert calculate_brand_score("Apple", "Apple Inc") == 85.0
    assert calculate_brand_score(None, "Samsung") == 50.0  # neutral

def test_color_matching():
    assert calculate_color_score("Black", "Black") == 100.0
    assert calculate_color_score("Black", "Dark Black") == 80.0
    assert calculate_color_score(None, None) == 50.0  # neutral

def test_location_scoring():
    # Exact location string match
    assert calculate_location_score("Central Park Library", "Central Park Library") == 100.0
    # Coordinates proximity (same spot)
    assert calculate_location_score("Loc A", "Loc B", 40.7128, -74.0060, 40.7128, -74.0060) == 100.0

def test_time_proximity_scoring():
    assert calculate_time_score("2026-08-10", "2026-08-10") == 100.0
    assert calculate_time_score("2026-08-10", "2026-08-11") == 85.0
    assert calculate_time_score("2026-08-10", "2026-08-13") == 70.0
    assert calculate_time_score("2026-08-10", "2026-08-25") == 10.0

def test_text_similarity_fuzzy_description():
    desc1 = "Black Samsung phone with a clear transparent case"
    desc2 = "Black Samsung smartphone with a clear protective cover"
    score = calculate_description_score(desc1, desc2)
    assert score >= 60.0

def test_overall_score_calculation():
    factors = {
        "category_score": 100.0,
        "item_score": 90.0,
        "brand_score": 100.0,
        "color_score": 100.0,
        "location_score": 100.0,
        "time_score": 100.0,
        "description_score": 85.0,
        "image_score": 0.0
    }
    overall = calculate_overall_score(factors)
    # Weighted average calculation test
    assert overall >= 90.0

def test_explainable_reasons():
    item1 = Item(
        name="Samsung Galaxy S23",
        category="Electronics",
        brand="Samsung",
        color="Black",
        description="Black smartphone",
        location="Central Park Library",
        event_date="2026-08-10"
    )
    item2 = Item(
        name="Samsung Phone",
        category="Electronics",
        brand="Samsung",
        color="Black",
        description="Black phone",
        location="Central Park Library",
        event_date="2026-08-10"
    )
    factors = {
        "category_score": 100.0,
        "item_score": 90.0,
        "brand_score": 100.0,
        "color_score": 100.0,
        "location_score": 100.0,
        "time_score": 100.0,
        "description_score": 85.0,
        "image_score": 0.0
    }
    reasons = generate_explainable_reasons(item1, item2, factors)
    assert "Identical category (Electronics)" in reasons
    assert "Matching brand (Samsung)" in reasons
    assert "Matching color scheme (Black)" in reasons
    assert "Nearby/Same location (Central Park Library)" in reasons
