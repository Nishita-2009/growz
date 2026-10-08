from pydantic import BaseModel, Field
from typing import List, Optional

class AdvisorRequest(BaseModel):
    question: str = Field(..., description="User's business question", min_length=2)

class AdvisorResponse(BaseModel):
    question: str
    answer: str
    key_facts: List[str] = Field(default_factory=list)
    recommended_action: str
    related_opportunity_id: Optional[str] = None
    confidence: str = "high"

class RawGeminiAdvisorResponse(BaseModel):
    answer: str
    key_facts: List[str] = Field(default_factory=list)
    recommended_action: str
    related_opportunity_id: Optional[str] = None
    confidence: str = "high"
