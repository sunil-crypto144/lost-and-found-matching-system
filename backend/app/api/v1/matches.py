from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.db_models import User, Item, ItemStatus, Match, MatchStatus
from app.models.schemas import MatchOut
from app.services.matching import generate_explainable_reasons

router = APIRouter()

def build_match_out(match: Match) -> MatchOut:
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

@router.get("", response_model=List[MatchOut])
def get_matches(
    status_filter: Optional[MatchStatus] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Match)
    if status_filter:
        query = query.filter(Match.status == status_filter)
        
    matches = query.order_by(Match.match_score.desc()).all()
    return [build_match_out(m) for m in matches]

@router.get("/resolved", response_model=List[MatchOut])
def get_resolved_retrievals(db: Session = Depends(get_db)):
    """Retrieve all successfully matched and collected items."""
    matches = db.query(Match).filter(Match.status == MatchStatus.RESOLVED).order_by(Match.confirmed_at.desc()).all()
    return [build_match_out(m) for m in matches]

@router.get("/{match_id}", response_model=MatchOut)
def get_match_by_id(
    match_id: int,
    db: Session = Depends(get_db)
):
    match = db.query(Match).filter(Match.id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    return build_match_out(match)

@router.post("/{match_id}/confirm", response_model=MatchOut)
def confirm_match(
    match_id: int,
    db: Session = Depends(get_db)
):
    match = db.query(Match).filter(Match.id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")

    if match.status == MatchStatus.ACCEPTED or match.status == MatchStatus.RESOLVED:
        raise HTTPException(status_code=400, detail="Match has already been confirmed or resolved")

    match.status = MatchStatus.ACCEPTED
    match.confirmed_at = datetime.utcnow()

    # Update item statuses to MATCHED
    match.lost_item.status = ItemStatus.MATCHED
    match.found_item.status = ItemStatus.MATCHED

    db.commit()
    db.refresh(match)
    return build_match_out(match)

@router.post("/{match_id}/resolve", response_model=MatchOut)
def mark_match_as_collected_and_retrieved(
    match_id: int,
    db: Session = Depends(get_db)
):
    """Mark an item as successfully handed over, collected by the owner, and retrieved."""
    match = db.query(Match).filter(Match.id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")

    match.status = MatchStatus.RESOLVED
    match.confirmed_at = datetime.utcnow()

    # Update both items to RESOLVED (removes from active listings)
    match.lost_item.status = ItemStatus.RESOLVED
    match.found_item.status = ItemStatus.RESOLVED

    db.commit()
    db.refresh(match)
    return build_match_out(match)

@router.post("/{match_id}/reject", response_model=MatchOut)
def reject_match(
    match_id: int,
    db: Session = Depends(get_db)
):
    match = db.query(Match).filter(Match.id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")

    match.status = MatchStatus.REJECTED
    db.commit()
    db.refresh(match)
    return build_match_out(match)
