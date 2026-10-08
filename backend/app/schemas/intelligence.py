from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class CategoryScore(BaseModel):
    category: str
    score: Optional[float] = None
    status: str  # "excellent", "healthy", "attention", "critical", "insufficient_data"
    data_status: str  # "sufficient", "insufficient_data"
    explanation: str


class GrowthScoreResponse(BaseModel):
    overall_score: Optional[float] = None
    data_status: str  # "sufficient_data", "insufficient_data", "no_data"
    categories_available: int
    categories_missing: int
    confidence: float  # 0.0 to 1.0
    categories: List[CategoryScore] = Field(default_factory=list)


class OpportunityItem(BaseModel):
    id: str
    title: str
    category: str
    priority: str  # "critical", "high", "medium", "low"
    problem: str
    evidence: str
    reasoning: str
    recommended_action: str
    expected_impact: str
    difficulty: str  # "easy", "moderate", "hard"
    confidence: float  # 0.0 to 1.0
    related_module: str


class IntelligenceOverviewResponse(BaseModel):
    growth_score: GrowthScoreResponse
    opportunities: List[OpportunityItem] = Field(default_factory=list)
