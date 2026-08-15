from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.db_models import User, Item, Match
from app.models.schemas import UserOut
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/me", response_model=UserOut)
def get_user_profile(current_user: User = Depends(get_current_user)):
    return current_user
