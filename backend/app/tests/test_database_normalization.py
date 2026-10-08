import datetime
import io
import uuid
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, select
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

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_norm.db"

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


# 1. DATABASE CONNECTION TEST
def test_database_connection():
    db = TestingSessionLocal()
    try:
        result = db.execute(select(1)).scalar()
        assert result == 1
    finally:
        db.close()


# 2. MIGRATION & SCHEMA CREATION TEST
def test_schema_tables_exist():
    db = TestingSessionLocal()
    try:
        # Querying tables directly using SQLAlchemy models
        assert db.query(Business).count() == 0
        assert db.query(Customer).count() == 0
        assert db.query(Product).count() == 0
        assert db.query(Order).count() == 0
        assert db.query(OrderItem).count() == 0
        assert db.query(Expense).count() == 0
        assert db.query(InventoryRecord).count() == 0
        assert db.query(MarketingRecord).count() == 0
    finally:
        db.close()


# 3. CREATING A BUSINESS TEST
def test_create_business():
    db = TestingSessionLocal()
    try:
        biz = Business(name="Apex Retail Store", business_type="E-commerce")
        db.add(biz)
        db.commit()
        db.refresh(biz)

        assert isinstance(biz.id, uuid.UUID)
        assert biz.name == "Apex Retail Store"
        assert biz.business_type == "E-commerce"
    finally:
        db.close()


# 4. CREATING A CUSTOMER TEST
def test_create_customer():
    db = TestingSessionLocal()
    try:
        biz = Business(name="Customer Test Biz")
        db.add(biz)
        db.commit()

        cust = Customer(
            business_id=biz.id,
            name="Ananya Sharma",
            email="ananya@example.com",
            phone="+919876543210",
            location="Bengaluru",
            customer_type="Retail",
        )
        db.add(cust)
        db.commit()
        db.refresh(cust)

        assert cust.business_id == biz.id
        assert cust.name == "Ananya Sharma"
        assert len(biz.customers) == 1
    finally:
        db.close()


# 5. CREATING A PRODUCT TEST
def test_create_product():
    db = TestingSessionLocal()
    try:
        biz = Business(name="Product Test Biz")
        db.add(biz)
        db.commit()

        prod = Product(
            business_id=biz.id,
            name="Wireless Headphones",
            sku="WH-100",
            category="Electronics",
            selling_price=2999.0,
            cost_price=1500.0,
            current_stock=50,
        )
        db.add(prod)
        db.commit()
        db.refresh(prod)

        assert prod.business_id == biz.id
        assert prod.selling_price == 2999.0
        assert len(biz.products) == 1
    finally:
        db.close()


# 6. CREATING AN ORDER WITH ORDER ITEMS TEST
def test_create_order_with_items():
    db = TestingSessionLocal()
    try:
        biz = Business(name="Order Test Biz")
        db.add(biz)
        db.commit()

        cust = Customer(business_id=biz.id, name="Rahul Verma")
        prod = Product(business_id=biz.id, name="Mechanical Keyboard", selling_price=4500.0)
        db.add_all([cust, prod])
        db.commit()

        order = Order(
            business_id=biz.id,
            customer_id=cust.id,
            order_date=datetime.datetime.utcnow(),
            order_number="ORD-1001",
            total_amount=9000.0,
            payment_status="paid",
        )
        db.add(order)
        db.commit()

        item = OrderItem(
            order_id=order.id,
            product_id=prod.id,
            quantity=2.0,
            unit_price=4500.0,
            total_amount=9000.0,
        )
        db.add(item)
        db.commit()
        db.refresh(order)

        assert len(order.order_items) == 1
        assert order.order_items[0].product_id == prod.id
        assert order.total_amount == 9000.0
    finally:
        db.close()


# 7. CREATING AN EXPENSE TEST
def test_create_expense():
    db = TestingSessionLocal()
    try:
        biz = Business(name="Expense Test Biz")
        db.add(biz)
        db.commit()

        exp = Expense(
            business_id=biz.id,
            expense_date=datetime.datetime.utcnow(),
            category="Utilities",
            description="Office Internet Bill",
            amount=1499.0,
        )
        db.add(exp)
        db.commit()
        db.refresh(exp)

        assert exp.business_id == biz.id
        assert exp.amount == 1499.0
        assert len(biz.expenses) == 1
    finally:
        db.close()


# 8. BUSINESS_ID MULTI-TENANT ISOLATION TEST
def test_business_id_isolation():
    db = TestingSessionLocal()
    try:
        biz_a = Business(name="Business Alpha")
        biz_b = Business(name="Business Beta")
        db.add_all([biz_a, biz_b])
        db.commit()

        # Add records to Business A
        cust_a = Customer(business_id=biz_a.id, name="Customer Alpha")
        prod_a = Product(business_id=biz_a.id, name="Product Alpha", selling_price=100.0)
        exp_a = Expense(business_id=biz_a.id, expense_date=datetime.datetime.utcnow(), amount=500.0)

        # Add records to Business B
        cust_b = Customer(business_id=biz_b.id, name="Customer Beta")
        prod_b = Product(business_id=biz_b.id, name="Product Beta", selling_price=200.0)
        exp_b = Expense(business_id=biz_b.id, expense_date=datetime.datetime.utcnow(), amount=1200.0)

        db.add_all([cust_a, prod_a, exp_a, cust_b, prod_b, exp_b])
        db.commit()

        # Strict tenant isolation queries
        a_customers = db.query(Customer).filter(Customer.business_id == biz_a.id).all()
        b_customers = db.query(Customer).filter(Customer.business_id == biz_b.id).all()

        assert len(a_customers) == 1
        assert a_customers[0].name == "Customer Alpha"
        assert len(b_customers) == 1
        assert b_customers[0].name == "Customer Beta"

        # Verify Business A cannot access Business B's expenses
        a_expenses = db.query(Expense).filter(Expense.business_id == biz_a.id).all()
        assert len(a_expenses) == 1
        assert a_expenses[0].amount == 500.0
        assert all(exp.business_id != biz_b.id for exp in a_expenses)
    finally:
        db.close()


# 9. END-TO-END DATA NORMALIZATION & PERSISTENCE IMPORT TEST
def test_full_normalization_import_pipeline():
    csv_content = (
        "Order Date,Customer Name,Product,Qty,Price,Total\n"
        "2026-09-01,Ananya Sharma,Keyboard,1,4500,4500\n"
        "2026-09-02,Rahul Verma,Mouse,2,1200,2400\n"
    )

    # 1. Upload & parse
    upload_res = client.post(
        "/api/data/upload",
        files={"file": ("sales.csv", io.BytesIO(csv_content.encode("utf-8")), "text/csv")},
        data={"data_type": "orders"},
    )
    assert upload_res.status_code == 200
    upload_data = upload_res.json()
    assert upload_data["status"] == "ready"

    # 2. Confirm import and normalize into DB
    import_payload = {
        "data_type": upload_data["detected_data_type"],
        "rows": upload_data["preview_rows"],
        "column_mapping": upload_data["column_mapping"],
    }
    import_res = client.post("/api/data/import", json=import_payload)
    assert import_res.status_code == 201
    imported_info = import_res.json()

    assert imported_info["imported_count"] == 2
    assert imported_info["skipped_count"] == 0

    # 3. Verify PostgreSQL / DB records stored
    db = TestingSessionLocal()
    try:
        biz_id = uuid.UUID(imported_info["business_id"])
        db_orders = db.query(Order).filter(Order.business_id == biz_id).all()
        db_customers = db.query(Customer).filter(Customer.business_id == biz_id).all()
        db_products = db.query(Product).filter(Product.business_id == biz_id).all()

        assert len(db_orders) == 2
        assert len(db_customers) == 2
        assert len(db_products) == 2

        customer_names = [c.name for c in db_customers]
        assert "Ananya Sharma" in customer_names
        assert "Rahul Verma" in customer_names
    finally:
        db.close()
