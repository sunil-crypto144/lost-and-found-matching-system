import pytest

def test_create_lost_item_public(client):
    response = client.post(
        "/api/v1/items/lost",
        data={
            "reporter_name": "Alice Smith",
            "reporter_contact": "alice@example.com",
            "name": "Black iPhone 15",
            "category": "Electronics",
            "brand": "Apple",
            "color": "Black",
            "description": "Black iPhone 15 with leather case",
            "location": "Coffee Shop Central",
            "event_date": "2026-08-15"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["item"]["name"] == "Black iPhone 15"
    assert data["item"]["reporter_name"] == "Alice Smith"
    assert data["item"]["type"] == "LOST"

def test_unsupported_image_upload(client):
    files = {"image": ("test.txt", b"dummy content", "text/plain")}
    data = {
        "reporter_name": "John Doe",
        "reporter_contact": "john@example.com",
        "name": "Lost Wallet",
        "category": "Documents",
        "description": "Leather wallet with ID card",
        "location": "Bus Station",
        "event_date": "2026-08-15"
    }
    
    response = client.post(
        "/api/v1/items/lost",
        data=data,
        files=files
    )
    assert response.status_code == 400
    assert "Invalid image type" in response.json()["detail"]

def test_search_and_filter(client):
    client.post(
        "/api/v1/items/lost",
        data={
            "reporter_name": "Public User",
            "reporter_contact": "user@example.com",
            "name": "Sony Headphones",
            "category": "Electronics",
            "description": "Wireless noise cancelling headphones",
            "location": "Library",
            "event_date": "2026-08-15"
        }
    )
    
    search_res = client.get("/api/v1/items?query=Headphones")
    assert search_res.status_code == 200
    assert len(search_res.json()) == 1
    assert search_res.json()[0]["name"] == "Sony Headphones"
