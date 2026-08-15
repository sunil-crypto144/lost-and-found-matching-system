from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from app.models.db_models import UserRole, ItemType, ItemStatus, MatchStatus

# User Schemas
class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    confirm_password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: UserRole
    created_at: datetime

    class Config:
        from_attributes = True

# Item Schemas
class ItemCreate(BaseModel):
    reporter_name: str = Field(..., min_length=2, max_length=100)
    reporter_contact: str = Field(..., min_length=3, max_length=255)
    name: str = Field(..., min_length=2, max_length=200)
    category: str = Field(..., min_length=2, max_length=100)
    brand: Optional[str] = None
    color: Optional[str] = None
    description: str = Field(..., min_length=5, max_length=2000)
    location: str = Field(..., min_length=2, max_length=255)
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    event_date: str = Field(..., description="YYYY-MM-DD")
    event_time: Optional[str] = None

class ItemOut(BaseModel):
    id: int
    user_id: Optional[int] = None
    reporter_name: str
    reporter_contact: str
    type: ItemType
    name: str
    category: str
    brand: Optional[str] = None
    color: Optional[str] = None
    description: str
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    event_date: str
    event_time: Optional[str] = None
    image_url: Optional[str] = None
    status: ItemStatus
    created_at: datetime
    updated_at: datetime
    owner_name: Optional[str] = None

    class Config:
        from_attributes = True

# Match Factor Schema
class MatchFactorOut(BaseModel):
    category_score: float
    item_score: float
    brand_score: float
    color_score: float
    location_score: float
    time_score: float
    description_score: float
    image_score: float = 0.0

    class Config:
        from_attributes = True

# Match Schema
class MatchOut(BaseModel):
    id: int
    lost_item_id: int
    found_item_id: int
    match_score: float
    status: MatchStatus
    confirmed_by: Optional[int] = None
    confirmed_at: Optional[datetime] = None
    created_at: datetime
    lost_item: ItemOut
    found_item: ItemOut
    factors: MatchFactorOut
    reasons: List[str] = []

    class Config:
        from_attributes = True

# Response model after public report submission
class ReportSubmissionResult(BaseModel):
    item: ItemOut
    matches: List[MatchOut] = []

# Admin Stats
class AdminStats(BaseModel):
    total_users: int
    total_lost_reports: int
    total_found_reports: int
    total_potential_matches: int
    total_confirmed_matches: int
    total_rejected_matches: int
    total_resolved_items: int
