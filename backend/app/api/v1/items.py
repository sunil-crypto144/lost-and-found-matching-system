import os
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.core.database import get_db
from app.core.config import settings
from app.models.db_models import User, Item, ItemType, ItemStatus, Match, MatchFactor, MatchStatus
from app.models.schemas import ItemOut, ReportSubmissionResult, MatchOut
from app.api.deps import get_current_user
from app.services.matching import compute_match_factors, calculate_overall_score, generate_explainable_reasons, settings as matching_settings

router = APIRouter()

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

def run_auto_matching_for_item(item: Item, db: Session) -> List[Match]:
    """Run matching engine when an item is reported."""
    opposite_type = ItemType.FOUND if item.type == ItemType.LOST else ItemType.LOST
    
    candidates = db.query(Item).filter(
        Item.type == opposite_type,
        Item.status == ItemStatus.OPEN,
        Item.id != item.id
    ).all()

    generated_matches = []

    for candidate in candidates:
        lost_item = item if item.type == ItemType.LOST else candidate
        found_item = candidate if item.type == ItemType.LOST else item

        existing_match = db.query(Match).filter(
            Match.lost_item_id == lost_item.id,
            Match.found_item_id == found_item.id
        ).first()

        if existing_match:
            generated_matches.append(existing_match)
            continue

        factors = compute_match_factors(lost_item, found_item)
        score = calculate_overall_score(factors)

        if score >= matching_settings.THRESHOLD_MIN_RECOMMEND:
            match = Match(
                lost_item_id=lost_item.id,
                found_item_id=found_item.id,
                match_score=score,
                status=MatchStatus.SUGGESTED
            )
            db.add(match)
            db.flush()

            factor_record = MatchFactor(
                match_id=match.id,
                category_score=factors["category_score"],
                item_score=factors["item_score"],
                brand_score=factors["brand_score"],
                color_score=factors["color_score"],
                location_score=factors["location_score"],
                time_score=factors["time_score"],
                description_score=factors["description_score"],
                image_score=factors.get("image_score", 0.0)
            )
            db.add(factor_record)
            generated_matches.append(match)

    db.commit()
    return generated_matches

def format_match_response(match: Match) -> MatchOut:
    out = MatchOut.model_validate(match)
    factors_dict = {
        "category_score": match.factors.category_score if match.factors else 0,
        "item_score": match.factors.item_score if match.factors else 0,
        "brand_score": match.factors.brand_score if match.factors else 0,
        "color_score": match.factors.color_score if match.factors else 0,
        "location_score": match.factors.location_score if match.factors else 0,
        "time_score": match.factors.time_score if match.factors else 0,
        "description_score": match.factors.description_score if match.factors else 0,
        "image_score": match.factors.image_score if match.factors else 0,
    }
    out.reasons = generate_explainable_reasons(match.lost_item, match.found_item, factors_dict)
    return out

@router.post("/lost", response_model=ReportSubmissionResult, status_code=status.HTTP_201_CREATED)
def create_lost_item(
    reporter_name: str = Form(...),
    reporter_contact: str = Form(...),
    name: str = Form(...),
    category: str = Form(...),
    description: str = Form(...),
    location: str = Form(...),
    event_date: str = Form(...),
    brand: Optional[str] = Form(None),
    color: Optional[str] = Form(None),
    event_time: Optional[str] = Form(None),
    latitude: Optional[float] = Form(None),
    longitude: Optional[float] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    image_url = None
    if image:
        if image.content_type not in ALLOWED_IMAGE_TYPES:
            raise HTTPException(status_code=400, detail="Invalid image type. Only JPEG, PNG, and WEBP are allowed.")
        contents = image.file.read()
        if len(contents) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="Image size exceeds 5MB limit.")
        
        ext = os.path.splitext(image.filename)[1] or ".jpg"
        filename = f"{uuid.uuid4().hex}{ext}"
        filepath = os.path.join(settings.UPLOAD_DIR, filename)
        with open(filepath, "wb") as f:
            f.write(contents)
        image_url = f"/static/{filename}"

    item = Item(
        reporter_name=reporter_name.strip(),
        reporter_contact=reporter_contact.strip(),
        type=ItemType.LOST,
        name=name.strip(),
        category=category.strip(),
        brand=brand.strip() if brand else None,
        color=color.strip() if color else None,
        description=description.strip(),
        location=location.strip(),
        latitude=latitude,
        longitude=longitude,
        event_date=event_date.strip(),
        event_time=event_time.strip() if event_time else None,
        image_url=image_url,
        status=ItemStatus.OPEN
    )
    db.add(item)
    db.commit()
    db.refresh(item)

    # Run auto matching
    generated_matches = run_auto_matching_for_item(item, db)
    formatted_matches = [format_match_response(m) for m in generated_matches]

    item_out = ItemOut.model_validate(item)
    item_out.owner_name = item.reporter_name
    return ReportSubmissionResult(item=item_out, matches=formatted_matches)

@router.post("/found", response_model=ReportSubmissionResult, status_code=status.HTTP_201_CREATED)
def create_found_item(
    reporter_name: str = Form(...),
    reporter_contact: str = Form(...),
    name: str = Form(...),
    category: str = Form(...),
    description: str = Form(...),
    location: str = Form(...),
    event_date: str = Form(...),
    brand: Optional[str] = Form(None),
    color: Optional[str] = Form(None),
    event_time: Optional[str] = Form(None),
    latitude: Optional[float] = Form(None),
    longitude: Optional[float] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    image_url = None
    if image:
        if image.content_type not in ALLOWED_IMAGE_TYPES:
            raise HTTPException(status_code=400, detail="Invalid image type. Only JPEG, PNG, and WEBP are allowed.")
        contents = image.file.read()
        if len(contents) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="Image size exceeds 5MB limit.")
        
        ext = os.path.splitext(image.filename)[1] or ".jpg"
        filename = f"{uuid.uuid4().hex}{ext}"
        filepath = os.path.join(settings.UPLOAD_DIR, filename)
        with open(filepath, "wb") as f:
            f.write(contents)
        image_url = f"/static/{filename}"

    item = Item(
        reporter_name=reporter_name.strip(),
        reporter_contact=reporter_contact.strip(),
        type=ItemType.FOUND,
        name=name.strip(),
        category=category.strip(),
        brand=brand.strip() if brand else None,
        color=color.strip() if color else None,
        description=description.strip(),
        location=location.strip(),
        latitude=latitude,
        longitude=longitude,
        event_date=event_date.strip(),
        event_time=event_time.strip() if event_time else None,
        image_url=image_url,
        status=ItemStatus.OPEN
    )
    db.add(item)
    db.commit()
    db.refresh(item)

    # Run auto matching
    generated_matches = run_auto_matching_for_item(item, db)
    formatted_matches = [format_match_response(m) for m in generated_matches]

    item_out = ItemOut.model_validate(item)
    item_out.owner_name = item.reporter_name
    return ReportSubmissionResult(item=item_out, matches=formatted_matches)

@router.get("", response_model=List[ItemOut])
def search_items(
    query: Optional[str] = None,
    category: Optional[str] = None,
    brand: Optional[str] = None,
    color: Optional[str] = None,
    location: Optional[str] = None,
    type: Optional[ItemType] = None,
    status_filter: Optional[ItemStatus] = Query(None, alias="status"),
    sort_by: Optional[str] = "newest",
    db: Session = Depends(get_db)
):
    q = db.query(Item)
    if type:
        q = q.filter(Item.type == type)
    if status_filter:
        q = q.filter(Item.status == status_filter)
    if category:
        q = q.filter(Item.category.ilike(f"%{category}%"))
    if brand:
        q = q.filter(Item.brand.ilike(f"%{brand}%"))
    if color:
        q = q.filter(Item.color.ilike(f"%{color}%"))
    if location:
        q = q.filter(Item.location.ilike(f"%{location}%"))
    if query:
        search_pattern = f"%{query}%"
        q = q.filter(
            or_(
                Item.name.ilike(search_pattern),
                Item.description.ilike(search_pattern),
                Item.location.ilike(search_pattern),
                Item.brand.ilike(search_pattern),
                Item.category.ilike(search_pattern)
            )
        )

    if sort_by == "oldest":
        q = q.order_by(Item.created_at.asc())
    else:
        q = q.order_by(Item.created_at.desc())

    items = q.all()
    results = []
    for item in items:
        out = ItemOut.model_validate(item)
        out.owner_name = item.reporter_name
        results.append(out)
    return results

@router.get("/my", response_model=List[ItemOut])
def get_my_items(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    items = db.query(Item).filter(Item.user_id == current_user.id).order_by(Item.created_at.desc()).all()
    results = []
    for item in items:
        out = ItemOut.model_validate(item)
        out.owner_name = item.reporter_name
        results.append(out)
    return results

@router.get("/{item_id}", response_model=ItemOut)
def get_item_by_id(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    out = ItemOut.model_validate(item)
    out.owner_name = item.reporter_name
    return out
