import pytest
import json
from unittest.mock import MagicMock, patch
from fastapi.testclient import TestClient
from app.main import app
from app.models.models import Business, Customer, Order, OrderItem
from app.schemas.advisor import AdvisorRequest, AdvisorResponse
from app.services.advisor_service import ask_advisor, build_business_context
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.db.session import Base, get_db
from app.ai.provider import BaseAIProvider, AIProviderError
from app.ai.gemini_provider import GeminiProvider

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_ai.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

@pytest.fixture
def db():
    app.dependency_overrides[get_db] = override_get_db
    with engine.begin() as conn:
        Base.metadata.create_all(bind=conn)
    session = TestingSessionLocal()
    yield session
    session.close()
    with engine.begin() as conn:
        Base.metadata.drop_all(bind=conn)
    app.dependency_overrides.clear()

@pytest.fixture
def test_business(db: Session):
    biz = Business(name="Test AI Biz", business_type="Retail")
    db.add(biz)
    db.commit()
    db.refresh(biz)
    return biz

class MockSuccessAIProvider(BaseAIProvider):
    def generate_business_advice(self, prompt: str, system_instruction: str = None) -> str:
        return json.dumps({
            "answer": "Focus on boosting customer retention by introducing targeted loyalty offers.",
            "key_facts": ["Repeat customer rate is currently 18.0%.", "Total revenue is $15,000.00."],
            "recommended_action": "Launch a targeted retention campaign for top 20% buyers.",
            "related_opportunity_id": "opp-retention-01",
            "confidence": "high"
        })

class MockMalformedAIProvider(BaseAIProvider):
    def generate_business_advice(self, prompt: str, system_instruction: str = None) -> str:
        return "This is not valid json text at all!"

class MockErrorAIProvider(BaseAIProvider):
    def generate_business_advice(self, prompt: str, system_instruction: str = None) -> str:
        raise AIProviderError("Gemini API rate limit exceeded")

def test_advisor_request_validation():
    req = AdvisorRequest(question="What should I focus on?")
    assert req.question == "What should I focus on?"
    with pytest.raises(Exception):
        AdvisorRequest(question="")

def test_missing_api_key_raises_error():
    with patch("app.core.config.settings.GEMINI_API_KEY", None):
        with pytest.raises(AIProviderError) as exc_info:
            GeminiProvider(api_key="")
        assert "Gemini API Key is missing" in str(exc_info.value)

def test_build_business_context(db: Session, test_business: Business):
    analytics = {
        "financials": {"data_status": "sufficient_data", "total_revenue": 1000.0, "total_expenses": 500.0, "net_profit": 500.0, "profit_margin": 50.0, "revenue_growth": 10.0, "average_order_value": 50.0},
        "customers": {"data_status": "sufficient_data", "total_customers": 10, "new_customers": 5, "repeat_customers": 5, "repeat_customer_rate": 50.0, "customer_revenue": 1000.0},
        "sales": {"data_status": "no_data"},
        "inventory": {"data_status": "no_data"},
        "marketing": {"data_status": "no_data"}
    }
    growth_score = {"overall_score": 85, "confidence": 0.8, "categories": [{"category": "Revenue Growth", "score": 85, "status": "healthy"}]}
    opportunities = [{"id": "opp-1", "title": "Test Opp", "priority": "high", "problem": "Test Problem", "evidence": "Test Evidence", "recommended_action": "Test Action"}]

    ctx = build_business_context(test_business, analytics, growth_score, opportunities)

    assert ctx["business"]["name"] == test_business.name
    assert ctx["financial"]["revenue"] == 1000.0
    assert "sales" not in ctx  # no_data omitted
    assert ctx["intelligence"]["overall_growth_score"] == 85

def test_successful_advisor_response(db: Session, test_business: Business):
    req = AdvisorRequest(question="What should I focus on this month?")
    mock_provider = MockSuccessAIProvider()

    res = ask_advisor(db, test_business, req, ai_provider=mock_provider)

    assert res.question == "What should I focus on this month?"
    assert "retention" in res.answer.lower()
    assert len(res.key_facts) == 2
    assert res.related_opportunity_id == "opp-retention-01"
    assert res.confidence == "high"

def test_malformed_gemini_response_graceful_handling(db: Session, test_business: Business):
    req = AdvisorRequest(question="How to grow?")
    mock_provider = MockMalformedAIProvider()

    res = ask_advisor(db, test_business, req, ai_provider=mock_provider)

    assert res.question == "How to grow?"
    assert "unstructured response" in res.answer
    assert res.confidence == "medium"

def test_gemini_provider_failure(db: Session, test_business: Business):
    req = AdvisorRequest(question="How to grow?")
    mock_provider = MockErrorAIProvider()

    with pytest.raises(AIProviderError) as exc_info:
        ask_advisor(db, test_business, req, ai_provider=mock_provider)
    assert "rate limit exceeded" in str(exc_info.value)

def test_insufficient_business_data_advisor(db: Session):
    biz = Business(name="Empty Biz AI", business_type="Retail")
    db.add(biz)
    db.commit()

    req = AdvisorRequest(question="Any advice?")
    mock_provider = MockSuccessAIProvider()

    res = ask_advisor(db, biz, req, ai_provider=mock_provider)
    assert res.answer is not None

def test_advisor_api_endpoint(db: Session, test_business: Business):
    payload = {"question": "What should I focus on this month?"}
    client = TestClient(app)

    with patch("app.services.advisor_service.GeminiProvider") as mock_gemini_cls:
        instance = mock_gemini_cls.return_value
        instance.generate_business_advice.return_value = json.dumps({
            "answer": "Focus on sales growth.",
            "key_facts": ["Revenue is $5,000"],
            "recommended_action": "Run a promo campaign",
            "related_opportunity_id": None,
            "confidence": "high"
        })

        response = client.post(
            "/api/ai/advisor",
            json=payload,
            headers={"X-Business-ID": str(test_business.id)}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["question"] == "What should I focus on this month?"
        assert data["answer"] == "Focus on sales growth."
        assert data["recommended_action"] == "Run a promo campaign"
