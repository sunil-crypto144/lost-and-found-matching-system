import os
from pydantic_settings import BaseSettings

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DEFAULT_DB_PATH = os.path.join(BASE_DIR, "backend", "lost_found.db").replace("\\", "/")

class Settings(BaseSettings):
    PROJECT_NAME: str = "Lost & Found Matching System"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-jwt-key-change-in-production-12345")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database (Absolute path so seed script and API always share the same DB file)
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{DEFAULT_DB_PATH}")
    
    # Uploads
    UPLOAD_DIR: str = os.path.join(BASE_DIR, "backend", "uploads")
    
    # Matching Engine Weights & Config
    WEIGHT_CATEGORY: float = 0.15
    WEIGHT_ITEM_NAME: float = 0.15
    WEIGHT_BRAND: float = 0.15
    WEIGHT_COLOR: float = 0.10
    WEIGHT_LOCATION: float = 0.20
    WEIGHT_TIME: float = 0.15
    WEIGHT_DESCRIPTION: float = 0.10
    
    # Thresholds
    THRESHOLD_STRONG: float = 80.0
    THRESHOLD_POSSIBLE: float = 60.0
    THRESHOLD_WEAK: float = 40.0
    THRESHOLD_MIN_RECOMMEND: float = 40.0

    class Config:
        case_sensitive = True

settings = Settings()
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
