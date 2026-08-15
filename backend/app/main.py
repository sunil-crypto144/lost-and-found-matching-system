from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import os

from app.core.config import settings
from app.core.database import Base, engine
from app.api.v1 import auth, items, matches, users, admin

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Full-Stack Explainable Lost & Found Matching Engine API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file serving for uploads
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/static", StaticFiles(directory=settings.UPLOAD_DIR), name="static")

# Custom exception handler for clean json responses
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # Log internal exceptions
    print(f"[GLOBAL_ERROR] {exc}")
    return JSONResponse(
        status_code=500,
        content={"error": "INTERNAL_SERVER_ERROR", "message": "An unexpected error occurred."}
    )

# Include Routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Auth"])
app.include_router(items.router, prefix=f"{settings.API_V1_STR}/items", tags=["Items"])
app.include_router(matches.router, prefix=f"{settings.API_V1_STR}/matches", tags=["Matches"])
app.include_router(users.router, prefix=f"{settings.API_V1_STR}/users", tags=["Users"])
app.include_router(admin.router, prefix=f"{settings.API_V1_STR}/admin", tags=["Admin"])

@app.get("/")
def root():
    return {
        "name": settings.PROJECT_NAME,
        "status": "healthy",
        "docs": "/docs"
    }
