import uuid
import datetime
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from fastapi.testclient import TestClient

from app.main import app
from app.db.session import Base, get_db
from app.models.models import Business, Customer, Product, Order, OrderItem, Expense, InventoryRecord, MarketingRecord
from app.services.analytics_service import generate_business_analytics
from app.services.growth_score_service import calculate_growth_score, DEFAULT_CATEGORY_WEIGHTS
from app.services.opportunity_service import detect_opportunities

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_intelligence.db"
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


def test_growth_score_healthy_business(db: Session):
    """Test 1: Growth Score with healthy business data"""
    biz = Business(name="Healthy Biz", business_type="Retail")
    db.add(biz)
    db.commit()
    db.refresh(biz)

    now = datetime.datetime.utcnow()
    o1 = Order(business_id=biz.id, order_date=now - datetime.timedelta(days=45), total_amount=1000.0)
    o2 = Order(business_id=biz.id, order_date=now - datetime.timedelta(days=10), total_amount=2000.0)
    e1 = Expense(business_id=biz.id, expense_date=now - datetime.timedelta(days=10), amount=500.0)
    c1 = Customer(business_id=biz.id, name="Cust 1", email="c1@test.com")
    c2 = Customer(business_id=biz.id, name="Cust 2", email="c2@test.com")
    p1 = Product(business_id=biz.id, name="Prod 1", current_stock=50)
    m1 = MarketingRecord(business_id=biz.id, date=now, channel="Google Ads", spend=200.0, revenue=800.0, conversions=10, leads=50)

    db.add_all([o1, o2, e1, c1, c2, p1, m1])
    db.commit()

    analytics = generate_business_analytics(db, biz)

    growth_res = calculate_growth_score(analytics)

    assert growth_res["overall_score"] is not None
    assert growth_res["overall_score"] >= 70.0
    assert growth_res["data_status"] in ["sufficient_data", "insufficient_data"]
    assert growth_res["categories_available"] >= 5


def test_growth_score_declining_revenue(db: Session):
    """Test 2: Growth Score with declining revenue"""
    biz = Business(name="Declining Biz", business_type="Retail")
    db.add(biz)
    db.commit()
    db.refresh(biz)

    now = datetime.datetime.utcnow()
    o1 = Order(business_id=biz.id, order_date=now - datetime.timedelta(days=45), total_amount=5000.0)
    o2 = Order(business_id=biz.id, order_date=now - datetime.timedelta(days=10), total_amount=1000.0)
    db.add_all([o1, o2])
    db.commit()

    analytics = generate_business_analytics(db, biz)
    growth_res = calculate_growth_score(analytics)

    rev_cat = next(c for c in growth_res["categories"] if c["category"] == "Revenue Growth")
    assert rev_cat["status"] == "critical"
    assert rev_cat["score"] < 50.0


def test_growth_score_negative_profit(db: Session):
    """Test 3: Growth Score with negative profit"""
    biz = Business(name="Loss Biz", business_type="Retail")
    db.add(biz)
    db.commit()
    db.refresh(biz)

    now = datetime.datetime.utcnow()
    o1 = Order(business_id=biz.id, order_date=now - datetime.timedelta(days=5), total_amount=1000.0)
    e1 = Expense(business_id=biz.id, expense_date=now - datetime.timedelta(days=5), amount=2500.0)
    db.add_all([o1, e1])
    db.commit()

    analytics = generate_business_analytics(db, biz)
    growth_res = calculate_growth_score(analytics)

    prof_cat = next(c for c in growth_res["categories"] if c["category"] == "Profitability")
    assert prof_cat["status"] == "critical"
    assert prof_cat["score"] < 50.0


def test_growth_score_low_retention(db: Session):
    """Test 4: Growth Score with low retention"""
    biz = Business(name="Churn Biz", business_type="Retail")
    db.add(biz)
    db.commit()
    db.refresh(biz)

    custs = [Customer(business_id=biz.id, name=f"Cust {i}", email=f"c{i}@churn.com") for i in range(10)]
    db.add_all(custs)
    db.commit()

    analytics = generate_business_analytics(db, biz)
    growth_res = calculate_growth_score(analytics)

    ret_cat = next(c for c in growth_res["categories"] if c["category"] == "Customer Retention")
    assert ret_cat["score"] <= 35.0


def test_growth_score_insufficient_data(db: Session):
    """Test 5: Growth Score with empty business (insufficient data)"""
    biz = Business(name="Empty Biz", business_type="Retail")
    db.add(biz)
    db.commit()
    db.refresh(biz)

    analytics = generate_business_analytics(db, biz)
    growth_res = calculate_growth_score(analytics)

    assert growth_res["overall_score"] is None
    assert growth_res["data_status"] in ["insufficient_data", "no_data"]
    assert growth_res["categories_available"] == 0


def test_weight_normalization():
    """Test 6: Dynamic weight normalization when categories are missing"""
    mock_analytics = {
        "data_status": "insufficient_data",
        "financial": {"total_revenue": 1000.0, "total_expenses": 500.0, "net_profit": 500.0, "profit_margin": 50.0, "revenue_growth": None},
        "customers": {"total_customers": 0, "new_customers": 0, "repeat_customers": 0, "repeat_customer_rate": 0.0},
        "sales": {"total_orders": 5, "total_units_sold": 5, "average_order_value": 200.0},
        "inventory": {"total_products": 0, "low_stock_products": 0, "out_of_stock_products": 0},
        "marketing": {"marketing_spend": 0.0, "roas": 0.0, "conversion_rate": 0.0}
    }

    res = calculate_growth_score(mock_analytics)
    assert res["overall_score"] is not None
    assert 0.0 <= res["overall_score"] <= 100.0


def test_revenue_opportunity(db: Session):
    """Test 7: Revenue opportunity detection"""
    biz = Business(name="Rev Opp Biz", business_type="Retail")
    db.add(biz)
    db.commit()
    db.refresh(biz)

    now = datetime.datetime.utcnow()
    o1 = Order(business_id=biz.id, order_date=now - datetime.timedelta(days=45), total_amount=10000.0)
    o2 = Order(business_id=biz.id, order_date=now - datetime.timedelta(days=5), total_amount=2000.0)
    db.add_all([o1, o2])
    db.commit()

    analytics = generate_business_analytics(db, biz)
    growth_res = calculate_growth_score(analytics)
    opps = detect_opportunities(analytics, growth_res)

    rev_opp = next((o for o in opps if o["id"] == "opp_revenue_declining"), None)
    assert rev_opp is not None
    assert rev_opp["category"] == "Revenue Growth"
    assert "evidence" in rev_opp


def test_profitability_opportunity(db: Session):
    """Test 8: Profitability opportunity detection"""
    biz = Business(name="Profit Opp Biz", business_type="Retail")
    db.add(biz)
    db.commit()
    db.refresh(biz)

    now = datetime.datetime.utcnow()
    o1 = Order(business_id=biz.id, order_date=now - datetime.timedelta(days=5), total_amount=1000.0)
    e1 = Expense(business_id=biz.id, expense_date=now - datetime.timedelta(days=5), amount=1200.0)
    db.add_all([o1, e1])
    db.commit()

    analytics = generate_business_analytics(db, biz)
    growth_res = calculate_growth_score(analytics)
    opps = detect_opportunities(analytics, growth_res)

    prof_opp = next((o for o in opps if o["id"] == "opp_profitability_margin"), None)
    assert prof_opp is not None
    assert prof_opp["priority"] == "critical"


def test_retention_opportunity(db: Session):
    """Test 9: Retention opportunity detection"""
    biz = Business(name="Ret Opp Biz", business_type="Retail")
    db.add(biz)
    db.commit()
    db.refresh(biz)

    custs = [Customer(business_id=biz.id, name=f"C{i}", email=f"c{i}@ret.com") for i in range(10)]
    db.add_all(custs)
    db.commit()

    analytics = generate_business_analytics(db, biz)
    growth_res = calculate_growth_score(analytics)
    opps = detect_opportunities(analytics, growth_res)

    ret_opp = next((o for o in opps if o["id"] == "opp_customer_retention_low"), None)
    assert ret_opp is not None


def test_marketing_opportunity(db: Session):
    """Test 10: Marketing opportunity detection (High ROAS scale opportunity)"""
    biz = Business(name="Mkt Opp Biz", business_type="Retail")
    db.add(biz)
    db.commit()
    db.refresh(biz)

    now = datetime.datetime.utcnow()
    m1 = MarketingRecord(business_id=biz.id, date=now, channel="Meta Ads", spend=500.0, revenue=2500.0, conversions=25, leads=100)
    db.add(m1)
    db.commit()

    analytics = generate_business_analytics(db, biz)
    growth_res = calculate_growth_score(analytics)
    opps = detect_opportunities(analytics, growth_res)

    mkt_opp = next((o for o in opps if o["id"] == "opp_marketing_scale_roas"), None)
    assert mkt_opp is not None
    assert mkt_opp["priority"] == "high"


def test_inventory_opportunity(db: Session):
    """Test 11: Inventory opportunity detection (Out of stock)"""
    biz = Business(name="Inv Opp Biz", business_type="Retail")
    db.add(biz)
    db.commit()
    db.refresh(biz)

    p1 = Product(business_id=biz.id, name="Out Product", current_stock=0)
    p2 = Product(business_id=biz.id, name="Low Product", current_stock=2)
    db.add_all([p1, p2])
    db.commit()

    analytics = generate_business_analytics(db, biz)
    growth_res = calculate_growth_score(analytics)
    opps = detect_opportunities(analytics, growth_res)

    out_opp = next((o for o in opps if o["id"] == "opp_inventory_out_of_stock"), None)
    assert out_opp is not None
    assert out_opp["category"] == "Inventory"


def test_opportunity_deduplication():
    """Test 12: Opportunity deduplication by (category, problem)"""
    mock_analytics = {
        "financial": {"total_revenue": 1000.0, "revenue_growth": -15.0, "net_profit": 50.0, "profit_margin": 5.0, "total_expenses": 950.0},
        "customers": {"total_customers": 10, "repeat_customer_rate": 10.0, "repeat_customers": 1},
        "inventory": {"total_products": 5, "low_stock_products": 2, "out_of_stock_products": 1},
        "marketing": {"marketing_spend": 1000.0, "roas": 0.5, "conversion_rate": 1.0, "marketing_revenue": 500.0},
        "sales": {"total_orders": 10}
    }

    growth_res = calculate_growth_score(mock_analytics)
    opps = detect_opportunities(mock_analytics, growth_res)

    categories_and_problems = [(o["category"], o["problem"]) for o in opps]
    assert len(categories_and_problems) == len(set(categories_and_problems))


def test_intelligence_business_isolation(db: Session):
    """Test 13: Business isolation for Intelligence engine"""
    biz_a = Business(name="Biz Intelligence A", business_type="Retail")
    biz_b = Business(name="Biz Intelligence B", business_type="Services")
    db.add_all([biz_a, biz_b])
    db.commit()

    prods_a = [Product(business_id=biz_a.id, name=f"Prod A{i}", current_stock=0) for i in range(5)]
    prods_b = [Product(business_id=biz_b.id, name=f"Prod B{i}", current_stock=50) for i in range(5)]
    db.add_all(prods_a + prods_b)
    db.commit()

    analytics_a = generate_business_analytics(db, biz_a)
    analytics_b = generate_business_analytics(db, biz_b)

    opps_a = detect_opportunities(analytics_a, calculate_growth_score(analytics_a))
    opps_b = detect_opportunities(analytics_b, calculate_growth_score(analytics_b))

    assert any(o["id"] == "opp_inventory_out_of_stock" for o in opps_a)
    assert not any(o["id"] == "opp_inventory_out_of_stock" for o in opps_b)


def test_intelligence_api_endpoint(db: Session):
    """Test 14: GET /api/intelligence/overview endpoint test"""
    client = TestClient(app)

    biz = Business(name="API Intelligence Biz", business_type="Tech")
    db.add(biz)
    db.commit()

    now = datetime.datetime.utcnow()
    o1 = Order(business_id=biz.id, order_date=now, total_amount=1500.0)
    db.add(o1)
    db.commit()

    headers = {"X-Business-ID": str(biz.id)}

    response = client.get("/api/intelligence/overview", headers=headers)
    assert response.status_code == 200

    data = response.json()
    assert "growth_score" in data
    assert "opportunities" in data
    assert "overall_score" in data["growth_score"]
