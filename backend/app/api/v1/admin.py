from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.db_models import User, Item, ItemType, ItemStatus, Match, MatchStatus
from app.models.schemas import AdminStats, UserOut, ItemOut, MatchOut
from app.api.deps import get_current_admin_user
from app.api.v1.matches import build_match_out

router = APIRouter()

@router.get("/stats", response_model=AdminStats)
def get_admin_stats(
    admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    total_users = db.query(User).count()
    total_lost = db.query(Item).filter(Item.type == ItemType.LOST).count()
    total_found = db.query(Item).filter(Item.type == ItemType.FOUND).count()
    total_potential = db.query(Match).filter(Match.status == MatchStatus.SUGGESTED).count()
    total_confirmed = db.query(Match).filter(Match.status == MatchStatus.ACCEPTED).count()
    total_rejected = db.query(Match).filter(Match.status == MatchStatus.REJECTED).count()
    total_resolved = db.query(Item).filter(Item.status == ItemStatus.RESOLVED).count()

    return AdminStats(
        total_users=total_users,
        total_lost_reports=total_lost,
        total_found_reports=total_found,
        total_potential_matches=total_potential,
        total_confirmed_matches=total_confirmed,
        total_rejected_matches=total_rejected,
        total_resolved_items=total_resolved
    )

@router.get("/users", response_model=List[UserOut])
def get_admin_users(
    admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    return db.query(User).order_by(User.created_at.desc()).all()

@router.get("/reports", response_model=List[ItemOut])
def get_admin_reports(
    admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    items = db.query(Item).order_by(Item.created_at.desc()).all()
    results = []
    for item in items:
        out = ItemOut.model_validate(item)
        if item.owner:
            out.owner_name = item.owner.name
        results.append(out)
    return results

@router.delete("/reports/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_admin_report(
    item_id: int,
    admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Report not found")
    db.delete(item)
    db.commit()
    return None

@router.get("/matches", response_model=List[MatchOut])
def get_admin_matches(
    admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    matches = db.query(Match).order_by(Match.created_at.desc()).all()
    return [build_match_out(m) for m in matches]
