from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_business
from app.models.models import Business
from app.schemas.analytics import BusinessAnalytics
from app.services.analytics_service import generate_business_analytics

router = APIRouter()


@router.get("/overview", response_model=BusinessAnalytics, status_code=status.HTTP_200_OK)
def get_analytics_overview(
    db: Session = Depends(get_db),
    business: Business = Depends(get_current_business),
):
    """
    Returns deterministic business analytics calculated from PostgreSQL data for the active Business context.
    """
    try:
        analytics = generate_business_analytics(db=db, business=business)
        return analytics
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to calculate business analytics: {str(err)}"
        )
