import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Enum, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

class UserRole(str, enum.Enum):
    USER = "USER"
    ADMIN = "ADMIN"

class ItemType(str, enum.Enum):
    LOST = "LOST"
    FOUND = "FOUND"

class ItemStatus(str, enum.Enum):
    OPEN = "OPEN"
    MATCHED = "MATCHED"
    RESOLVED = "RESOLVED"

class MatchStatus(str, enum.Enum):
    SUGGESTED = "SUGGESTED"
    ACCEPTED = "ACCEPTED"
    REJECTED = "REJECTED"
    RESOLVED = "RESOLVED"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.USER, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    items = relationship("Item", back_populates="owner", cascade="all, delete-orphan")

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    reporter_name = Column(String(100), nullable=False, default="Guest")
    reporter_contact = Column(String(255), nullable=False, default="Not Provided")
    type = Column(Enum(ItemType), nullable=False, index=True)
    name = Column(String(200), nullable=False, index=True)
    category = Column(String(100), nullable=False, index=True)
    brand = Column(String(100), nullable=True)
    color = Column(String(100), nullable=True)
    description = Column(Text, nullable=False)
    location = Column(String(255), nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    event_date = Column(String(50), nullable=False)  # ISO Date String (YYYY-MM-DD)
    event_time = Column(String(50), nullable=True)   # HH:MM
    image_url = Column(String(500), nullable=True)
    status = Column(Enum(ItemStatus), default=ItemStatus.OPEN, nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner = relationship("User", back_populates="items")
    lost_matches = relationship("Match", foreign_keys="Match.lost_item_id", back_populates="lost_item", cascade="all, delete-orphan")
    found_matches = relationship("Match", foreign_keys="Match.found_item_id", back_populates="found_item", cascade="all, delete-orphan")

class Match(Base):
    __tablename__ = "matches"

    id = Column(Integer, primary_key=True, index=True)
    lost_item_id = Column(Integer, ForeignKey("items.id"), nullable=False, index=True)
    found_item_id = Column(Integer, ForeignKey("items.id"), nullable=False, index=True)
    match_score = Column(Float, nullable=False)
    status = Column(Enum(MatchStatus), default=MatchStatus.SUGGESTED, nullable=False, index=True)
    confirmed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    confirmed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    lost_item = relationship("Item", foreign_keys=[lost_item_id], back_populates="lost_matches")
    found_item = relationship("Item", foreign_keys=[found_item_id], back_populates="found_matches")
    factors = relationship("MatchFactor", back_populates="match", uselist=False, cascade="all, delete-orphan")

class MatchFactor(Base):
    __tablename__ = "match_factors"

    id = Column(Integer, primary_key=True, index=True)
    match_id = Column(Integer, ForeignKey("matches.id"), nullable=False, unique=True)
    category_score = Column(Float, nullable=False)
    item_score = Column(Float, nullable=False)
    brand_score = Column(Float, nullable=False)
    color_score = Column(Float, nullable=False)
    location_score = Column(Float, nullable=False)
    time_score = Column(Float, nullable=False)
    description_score = Column(Float, nullable=False)
    image_score = Column(Float, default=0.0)

    match = relationship("Match", back_populates="factors")
