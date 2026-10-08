from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_business
from app.models.models import Business
from app.schemas.intelligence import IntelligenceOverviewResponse
from app.services.analytics_service import generate_business_analytics
from app.services.growth_score_service import calculate_growth_score
from app.services.opportunity_service import detect_opportunities

router = APIRouter()


@router.get("/overview", response_model=IntelligenceOverviewResponse, status_code=status.HTTP_200_OK)
def get_intelligence_overview(
    db: Session = Depends(get_db),
    business: Business = Depends(get_current_business),
):
    """
    Returns deterministic Growth Score and detected business opportunities
    calculated from PostgreSQL analytics for the active Business context.
    """
    try:
        # 1. Fetch deterministic analytics from analytics service
        analytics_data = generate_business_analytics(db=db, business=business)

        # Convert Pydantic model to dict if needed for processing
        if isinstance(analytics_data, dict):
            analytics_dict = analytics_data
        elif hasattr(analytics_data, "model_dump"):
            analytics_dict = analytics_data.model_dump()
        else:
            analytics_dict = analytics_data.dict()

        # 2. Calculate Growth Score
        growth_score = calculate_growth_score(analytics=analytics_dict)

        # 3. Detect Opportunities
        opportunities = detect_opportunities(
            analytics=analytics_dict,
            growth_score_res=growth_score
        )

        return {
            "growth_score": growth_score,
            "opportunities": opportunities
        }
    except Exception as err:
        print(f"INTELLIGENCE ROUTER ERROR: {err}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to calculate intelligence overview: {str(err)}"
        )

