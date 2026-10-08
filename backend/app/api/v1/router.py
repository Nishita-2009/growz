from fastapi import APIRouter
from app.api.v1.endpoints import health, users, data


api_router = APIRouter()
api_router.include_router(health.router, tags=["Health"])
api_router.include_router(users.router, tags=["Users"])
api_router.include_router(data.router, prefix="/data", tags=["Data Import"])
