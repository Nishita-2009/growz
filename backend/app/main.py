from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.router import api_router
from app.api import data, analytics, intelligence, ai

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
)

# CORS Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include V1 API Router
app.include_router(api_router, prefix=settings.API_V1_STR)

# Register /api/data, /api/analytics, /api/intelligence, and /api/ai router endpoints
app.include_router(data.router, prefix="/api/data", tags=["Data Processing"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics Engine"])
app.include_router(intelligence.router, prefix="/api/intelligence", tags=["Intelligence Engine"])
app.include_router(ai.router, prefix="/api/ai", tags=["AI Advisor"])


@app.get("/")
def root_redirect():
    return {"message": "Welcome to Growz API. Access health check at /api/v1/health and docs at /api/v1/docs"}
