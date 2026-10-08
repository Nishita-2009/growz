from fastapi import APIRouter
from app.api.v1.endpoints import health, users, data, analytics
from app.api import intelligence, ai

api_router = APIRouter()
api_router.include_router(health.router, tags=["Health"])
api_router.include_router(users.router, tags=["Users"])
api_router.include_router(data.router, prefix="/data", tags=["Data Import"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
api_router.include_router(intelligence.router, prefix="/intelligence", tags=["Intelligence"])
api_router.include_router(ai.router, prefix="/ai", tags=["AI Advisor"])

