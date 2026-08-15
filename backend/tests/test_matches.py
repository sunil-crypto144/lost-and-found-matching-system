import pytest

def test_automatic_matching_and_confirmation(client):
    # Public user 1 reports LOST Samsung Phone
    lost_res = client.post(
        "/api/v1/items/lost",
        data={
            "reporter_name": "Alice Smith",
            "reporter_contact": "alice@example.com",
            "name": "Black Samsung Galaxy Phone",
            "category": "Electronics",
            "brand": "Samsung",
            "color": "Black",
            "description": "Black Samsung smartphone with clear cover",
            "location": "Central Park Library",
            "event_date": "2026-08-10"
        }
    )
    lost_id = lost_res.json()["item"]["id"]

    # Public user 2 reports FOUND Samsung Phone
    found_res = client.post(
        "/api/v1/items/found",
        data={
            "reporter_name": "Bob Johnson",
            "reporter_contact": "bob@example.com",
            "name": "Black Samsung Smartphone",
            "category": "Electronics",
            "brand": "Samsung",
            "color": "Black",
            "description": "Black Samsung phone with clear cover found on table",
            "location": "Central Park Library",
            "event_date": "2026-08-10"
        }
    )
    found_id = found_res.json()["item"]["id"]

    # Instant matches returned in found_res
    matches = found_res.json()["matches"]
    assert len(matches) == 1
    match = matches[0]
    assert match["match_score"] >= 80.0
    assert len(match["reasons"]) > 0

    # Confirm match
    match_id = match["id"]
    confirm_res = client.post(f"/api/v1/matches/{match_id}/confirm")
    assert confirm_res.status_code == 200
    assert confirm_res.json()["status"] == "ACCEPTED"
    assert confirm_res.json()["lost_item"]["status"] == "MATCHED"
    assert confirm_res.json()["found_item"]["status"] == "MATCHED"
