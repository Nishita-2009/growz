import datetime
import uuid
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.db.session import Base, get_db
from app.models.models import (
    Business,
    Customer,
    Product,
    Order,
    OrderItem,
    Expense,
    InventoryRecord,
    MarketingRecord,
)
from app.services.analytics_service import (
    calculate_financial_metrics,
    calculate_customer_metrics,
    calculate_sales_metrics,
    calculate_inventory_metrics,
    calculate_marketing_metrics,
    generate_business_analytics,
)

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_analytics.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


@pytest.fixture(autouse=True)
def setup_db():
    app.dependency_overrides[get_db] = override_get_db
    with engine.begin() as conn:
        Base.metadata.create_all(bind=conn)
    yield
    with engine.begin() as conn:
        Base.metadata.drop_all(bind=conn)
    app.dependency_overrides.clear()


client = TestClient(app)


# Helper to create deterministic seed data
def seed_business_data(db):
    biz = Business(name="Analytics Test Business", business_type="Retail")
    db.add(biz)
    db.commit()
    db.refresh(biz)

    # Customers
    cust1 = Customer(business_id=biz.id, name="Alice Smith", email="alice@example.com")
    cust2 = Customer(business_id=biz.id, name="Bob Jones", email="bob@example.com")
    db.add_all([cust1, cust2])
    db.commit()

    # Products
    prod1 = Product(
        business_id=biz.id,
        name="Laptop Stand",
        sku="LS-01",
        selling_price=1500.0,
        cost_price=800.0,
        current_stock=15.0,
    )
    prod2 = Product(
        business_id=biz.id,
        name="Wireless Mouse",
        sku="WM-02",
        selling_price=800.0,
        cost_price=400.0,
        current_stock=5.0,  # Low stock (<= 10)
    )
    prod3 = Product(
        business_id=biz.id,
        name="USB Hub",
        sku="UH-03",
        selling_price=500.0,
        cost_price=200.0,
        current_stock=0.0,  # Out of stock
    )
    db.add_all([prod1, prod2, prod3])
    db.commit()

    now = datetime.datetime.utcnow()

    # Current period order (within 30 days)
    order1 = Order(
        business_id=biz.id,
        customer_id=cust1.id,
        order_date=now - datetime.timedelta(days=5),
        order_number="ORD-001",
        total_amount=3000.0,
    )
    # Current period second order for cust1 (repeat customer)
    order2 = Order(
        business_id=biz.id,
        customer_id=cust1.id,
        order_date=now - datetime.timedelta(days=10),
        order_number="ORD-002",
        total_amount=1600.0,
    )
    # Previous period order (35 days ago, for growth baseline comparison)
    order3 = Order(
        business_id=biz.id,
        customer_id=cust2.id,
        order_date=now - datetime.timedelta(days=35),
        order_number="ORD-003",
        total_amount=2000.0,
    )

    db.add_all([order1, order2, order3])
    db.commit()

    item1 = OrderItem(order_id=order1.id, product_id=prod1.id, quantity=2.0, unit_price=1500.0, total_amount=3000.0)
    item2 = OrderItem(order_id=order2.id, product_id=prod2.id, quantity=2.0, unit_price=800.0, total_amount=1600.0)
    item3 = OrderItem(order_id=order3.id, product_id=prod1.id, quantity=1.0, unit_price=1500.0, total_amount=1500.0)
    db.add_all([item1, item2, item3])

    # Expenses
    exp1 = Expense(
        business_id=biz.id,
        expense_date=now - datetime.timedelta(days=5),
        category="Rent",
        description="Office space",
        amount=1600.0,
    )
    exp2 = Expense(
        business_id=biz.id,
        expense_date=now - datetime.timedelta(days=40),
        category="Marketing",
        description="Ad spend",
        amount=1000.0,
    )
    db.add_all([exp1, exp2])

    # Marketing Record
    mkt = MarketingRecord(
        business_id=biz.id,
        date=now - datetime.timedelta(days=5),
        channel="Meta Ads",
        spend=500.0,
        leads=100,
        conversions=10,
        revenue=2500.0,
    )
    db.add(mkt)

    db.commit()
    return biz


# 1. FINANCIAL CALCULATIONS TEST
def test_financial_calculations():
    db = TestingSessionLocal()
    try:
        biz = seed_business_data(db)
        fin = calculate_financial_metrics(db, biz.id)

        # Total revenue = 3000 + 1600 + 2000 = 6600.0
        assert fin["total_revenue"] == 6600.0
        # Total expenses = 1600 + 1000 = 2600.0
        assert fin["total_expenses"] == 2600.0
        # Net profit = 6600 - 2600 = 4000.0
        assert fin["net_profit"] == 4000.0
        # AOV = 6600 / 3 = 2200.0
        assert fin["average_order_value"] == 2200.0
    finally:
        db.close()


# 2. REVENUE GROWTH TEST
def test_revenue_growth():
    db = TestingSessionLocal()
    try:
        biz = seed_business_data(db)
        fin = calculate_financial_metrics(db, biz.id)

        # Current 30d revenue = order1 (3000) + order2 (1600) = 4600.0
        # Prev 30d revenue = order3 (2000)
        # Growth = ((4600 - 2000) / 2000) * 100 = 130.0%
        assert fin["revenue_growth"] == 130.0
    finally:
        db.close()


# 3. PROFIT MARGIN TEST
def test_profit_margin():
    db = TestingSessionLocal()
    try:
        biz = seed_business_data(db)
        fin = calculate_financial_metrics(db, biz.id)

        # Profit Margin = (4000 / 6600) * 100 = 60.61%
        assert fin["profit_margin"] == 60.61
    finally:
        db.close()


# 4. CUSTOMER METRICS & REPEAT CUSTOMER RATE TEST
def test_customer_metrics():
    db = TestingSessionLocal()
    try:
        biz = seed_business_data(db)
        cust = calculate_customer_metrics(db, biz.id)

        assert cust["total_customers"] == 2
        # Ordering customers: 2 (Alice: 2 orders, Bob: 1 order)
        # Repeat customers: 1 (Alice)
        assert cust["repeat_customers"] == 1
        # Repeat customer rate = (1 / 2) * 100 = 50.0%
        assert cust["repeat_customer_rate"] == 50.0
        assert cust["customer_revenue"] == 6600.0
    finally:
        db.close()


# 5. SALES METRICS TEST
def test_sales_metrics():
    db = TestingSessionLocal()
    try:
        biz = seed_business_data(db)
        sales = calculate_sales_metrics(db, biz.id)

        assert sales["total_orders"] == 3
        # Units sold = 2 + 2 + 1 = 5.0
        assert sales["total_units_sold"] == 5.0
        assert sales["average_order_value"] == 2200.0
        assert len(sales["top_products"]) >= 1
        # Top product by revenue is Laptop Stand (3000 + 1500 = 4500)
        assert sales["top_products"][0]["name"] == "Laptop Stand"
        assert sales["top_products"][0]["revenue"] == 4500.0
    finally:
        db.close()


# 6. INVENTORY METRICS TEST
def test_inventory_metrics():
    db = TestingSessionLocal()
    try:
        biz = seed_business_data(db)
        inv = calculate_inventory_metrics(db, biz.id)

        assert inv["total_products"] == 3
        # Stock = 15 + 5 + 0 = 20.0
        assert inv["total_stock"] == 20.0
        # Low stock (0 < stock <= 10) = Mouse (5) -> 1
        assert inv["low_stock_products"] == 1
        # Out of stock (stock <= 0) = USB Hub (0) -> 1
        assert inv["out_of_stock_products"] == 1
        # Value = (15 * 800) + (5 * 400) + (0 * 200) = 12000 + 2000 = 14000.0
        assert inv["inventory_value"] == 14000.0
    finally:
        db.close()


# 7. MARKETING METRICS TEST
def test_marketing_metrics():
    db = TestingSessionLocal()
    try:
        biz = seed_business_data(db)
        mkt = calculate_marketing_metrics(db, biz.id)

        assert mkt["marketing_spend"] == 500.0
        assert mkt["leads"] == 100
        assert mkt["conversions"] == 10
        # Conversion rate = (10 / 100) * 100 = 10.0%
        assert mkt["conversion_rate"] == 10.0
        assert mkt["marketing_revenue"] == 2500.0
        # ROAS = 2500 / 500 = 5.0
        assert mkt["roas"] == 5.0
    finally:
        db.close()


# 8. INSUFFICIENT-DATA HANDLING TEST
def test_insufficient_data_handling():
    db = TestingSessionLocal()
    try:
        # Create empty business with no orders or historical data
        empty_biz = Business(name="Empty Business", business_type="Service")
        db.add(empty_biz)
        db.commit()

        fin = calculate_financial_metrics(db, empty_biz.id)
        analytics = generate_business_analytics(db, empty_biz)

        assert fin["total_revenue"] == 0.0
        assert fin["profit_margin"] is None
        assert fin["revenue_growth"] is None
        assert fin["expense_growth"] is None
        assert analytics["data_status"] in ["no_data", "insufficient_data"]
    finally:
        db.close()


# 9. BUSINESS ISOLATION TEST
def test_analytics_business_isolation():
    db = TestingSessionLocal()
    try:
        biz_a = seed_business_data(db)
        biz_b = Business(name="Isolated Business B")
        db.add(biz_b)
        db.commit()

        fin_a = calculate_financial_metrics(db, biz_a.id)
        fin_b = calculate_financial_metrics(db, biz_b.id)

        assert fin_a["total_revenue"] == 6600.0
        assert fin_b["total_revenue"] == 0.0

        sales_b = calculate_sales_metrics(db, biz_b.id)
        assert sales_b["total_orders"] == 0
        assert len(sales_b["top_products"]) == 0
    finally:
        db.close()


# 10. ENDPOINT GET /api/analytics/overview TEST
def test_get_analytics_overview_endpoint():
    db = TestingSessionLocal()
    try:
        biz = seed_business_data(db)

        # Header override for active business selection mechanism
        headers = {"X-Business-ID": str(biz.id)}
        response = client.get("/api/analytics/overview", headers=headers)

        assert response.status_code == 200
        data = response.json()

        assert data["business_id"] == str(biz.id)
        assert data["financial"]["total_revenue"] == 6600.0
        assert data["financial"]["net_profit"] == 4000.0
        assert data["sales"]["total_orders"] == 3
        assert data["customers"]["total_customers"] == 2
        assert data["inventory"]["total_products"] == 3
        assert data["marketing"]["marketing_spend"] == 500.0
    finally:
        db.close()
