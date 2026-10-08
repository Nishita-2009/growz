from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_business
from app.models.models import Business
from app.schemas.advisor import AdvisorRequest, AdvisorResponse
from app.services.advisor_service import ask_advisor
from app.ai.provider import AIProviderError

router = APIRouter()

@router.post("/advisor", response_model=AdvisorResponse)
def get_advisor_advice(
    request: AdvisorRequest,
    db: Session = Depends(get_db),
    current_business: Business = Depends(get_current_business)
):
    try:
        return ask_advisor(db, current_business, request)
    except AIProviderError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while processing your request."
        )
