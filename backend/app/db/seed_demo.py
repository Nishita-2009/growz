import uuid
import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.models import (
    Business,
    Customer,
    Product,
    Order,
    OrderItem,
    Expense,
    InventoryRecord,
    MarketingRecord
)

DEMO_BUSINESS_NAME = "Nish Cafe"

def seed_demo_business(db: Session) -> Business:
    """
    Seeds a realistic, fully populated 6-month demo dataset for 'Nish Cafe' (Restaurant in Hyderabad).
    Uses standard SQLAlchemy models and executes within PostgreSQL.
    """
    stmt = select(Business).where(Business.name == DEMO_BUSINESS_NAME)
    existing = db.execute(stmt).scalars().first()
    if existing:
        return existing

    now = datetime.utcnow()

    # Create Nish Cafe Business
    demo_biz = Business(
        id=uuid.uuid4(),
        name=DEMO_BUSINESS_NAME,
        business_type="Restaurant",
        created_at=now - timedelta(days=180),
        updated_at=now
    )
    db.add(demo_biz)
    db.flush()

    # 1. Seed Menu Items / Products
    products_data = [
        {"name": "Specialty Filter Coffee", "sku": "BEV-001", "category": "Beverages", "price": 150.0, "cost": 45.0, "stock": 12.0},
        {"name": "Hyderabadi Chicken Biryani", "sku": "MAI-001", "category": "Main Course", "price": 380.0, "cost": 160.0, "stock": 85.0},
        {"name": "Paneer Butter Masala", "sku": "MAI-002", "category": "Main Course", "price": 310.0, "cost": 120.0, "stock": 45.0},
        {"name": "Butter Naan (2 pcs)", "sku": "BRE-001", "category": "Breads", "price": 90.0, "cost": 25.0, "stock": 18.0},
        {"name": "Chicken 65 Starter", "sku": "STA-001", "category": "Starters", "price": 290.0, "cost": 110.0, "stock": 60.0},
        {"name": "Masala Dosa", "sku": "BRE-002", "category": "Breakfast", "price": 140.0, "cost": 40.0, "stock": 95.0},
        {"name": "Veg Fried Rice", "sku": "MAI-003", "category": "Main Course", "price": 240.0, "cost": 80.0, "stock": 70.0},
        {"name": "Fresh Lime Soda", "sku": "BEV-002", "category": "Beverages", "price": 110.0, "cost": 25.0, "stock": 120.0},
        {"name": "Gulab Jamun (2 pcs)", "sku": "DES-001", "category": "Desserts", "price": 130.0, "cost": 40.0, "stock": 5.0},
        {"name": "Triple Chocolate Brownie", "sku": "DES-002", "category": "Desserts", "price": 190.0, "cost": 65.0, "stock": 40.0},
    ]

    products = []
    for p in products_data:
        prod = Product(
            id=uuid.uuid4(),
            business_id=demo_biz.id,
            name=p["name"],
            sku=p["sku"],
            category=p["category"],
            selling_price=p["price"],
            cost_price=p["cost"],
            current_stock=p["stock"],
            created_at=now - timedelta(days=180)
        )
        db.add(prod)
        products.append(prod)
    db.flush()

    # 2. Seed Customer Records (~600 customers)
    first_names = ["Rahul", "Ananya", "Priya", "Vikram", "Sneha", "Karthik", "Rohan", "Divya", "Aditya", "Meera", "Arjun", "Kavya", "Siddharth", "Pooja", "Varun", "Neha", "Aman", "Ritu", "Deepak", "Tanvi", "Amit", "Nisha", "Gautam", "Swati", "Nikhil"]
    last_names = ["Sharma", "Reddy", "Varma", "Rao", "Kulkarni", "Nair", "Verma", "Joshi", "Gupta", "Deshmukh", "Chowdhury", "Patel", "Singh", "Kumar", "Iyer", "Mehta", "Bhat", "Kapoor", "Saxena", "Agarwal"]
    locations = ["Jubilee Hills, Hyderabad", "Banjara Hills, Hyderabad", "HITECH City, Hyderabad", "Gachibowli, Hyderabad", "Madhapur, Hyderabad", "Kondapur, Hyderabad"]

    customers = []
    rng = random.Random(42)
    for i in range(600):
        fn = first_names[i % len(first_names)]
        ln = last_names[(i * 3) % len(last_names)]
        name = f"{fn} {ln}"
        email = f"{fn.lower()}.{ln.lower()}{i+10}@example.com"
        phone = f"+91 98{i:08d}"[:14]
        loc = locations[i % len(locations)]
        c_type = "Regular" if i % 3 == 0 else ("VIP" if i % 10 == 0 else "Standard")
        created_dt = now - timedelta(days=rng.randint(1, 180))

        cust = Customer(
            id=uuid.uuid4(),
            business_id=demo_biz.id,
            name=name,
            email=email,
            phone=phone,
            location=loc,
            customer_type=c_type,
            created_at=created_dt
        )
        db.add(cust)
        customers.append(cust)
    db.flush()

    # 3. Seed Orders & Order Items (6 Months, ~1200 orders)
    start_date = now - timedelta(days=180)
    order_counter = 1001

    for day_offset in range(180):
        current_date = start_date + timedelta(days=day_offset)
        daily_order_count = rng.randint(5, 9)

        for _ in range(daily_order_count):
            customer = rng.choice(customers)
            num_items = rng.randint(2, 4)
            chosen_products = rng.sample(products, num_items)

            total_amount = 0.0
            order_items = []

            for prod in chosen_products:
                qty = rng.randint(1, 3)
                unit_p = prod.selling_price
                line_total = round(qty * unit_p, 2)
                total_amount += line_total

                item = OrderItem(
                    id=uuid.uuid4(),
                    quantity=float(qty),
                    unit_price=unit_p,
                    total_amount=line_total,
                    product_id=prod.id
                )
                order_items.append(item)

            order_dt = current_date.replace(
                hour=rng.randint(10, 21),
                minute=rng.randint(0, 59)
            )

            order = Order(
                id=uuid.uuid4(),
                business_id=demo_biz.id,
                customer_id=customer.id,
                order_date=order_dt,
                order_number=f"ORD-{order_counter}",
                total_amount=round(total_amount, 2),
                payment_status="Paid",
                created_at=order_dt
            )
            db.add(order)
            db.flush()

            for item in order_items:
                item.order_id = order.id
                db.add(item)

            order_counter += 1

    # 4. Seed Monthly Expenses (6 Months)
    expense_categories = [
        ("Rent & Premises", "Monthly Lease for Jubilee Hills Property", 85000.0),
        ("Staff Salaries", "Monthly Payroll for 12 Cafe & Kitchen Staff", 185000.0),
        ("Raw Ingredients & Supplies", "Bulk Procurement - Coffee Beans, Spices & Produce", 215000.0),
        ("Utilities & Electricity", "Commercial Electricity, Gas & Water Bills", 38000.0),
        ("Delivery Platform Commissions", "Zomato & Swiggy Platform Commissions", 48000.0),
        ("Packaging & Disposables", "Eco-friendly Takeaway Containers & Bags", 28000.0),
        ("Digital Marketing & Ads", "Instagram & Google Local Promotions", 42000.0),
        ("Equipment Maintenance", "Coffee Machine & Refrigerator Servicing", 15000.0),
    ]

    for month_i in range(6):
        m_date = now - timedelta(days=30 * (5 - month_i))
        for cat, desc, base_amt in expense_categories:
            variance = rng.uniform(0.95, 1.05)
            amt = round(base_amt * variance, 2)
            exp = Expense(
                id=uuid.uuid4(),
                business_id=demo_biz.id,
                expense_date=m_date,
                category=cat,
                description=desc,
                amount=amt,
                created_at=m_date
            )
            db.add(exp)

    # 5. Seed Inventory Records
    for prod in products:
        rec = InventoryRecord(
            id=uuid.uuid4(),
            business_id=demo_biz.id,
            product_id=prod.id,
            date=now - timedelta(days=15),
            quantity=prod.current_stock,
            movement_type="Stock Audit / Restock",
            reference="INIT-STOCK-2026",
            created_at=now - timedelta(days=15)
        )
        db.add(rec)

    # 6. Seed Marketing Records (6 Months across 4 channels)
    marketing_channels = [
        ("Instagram", 18000.0, 140, 45, 62000.0),
        ("Google Search Ads", 14000.0, 95, 32, 48000.0),
        ("WhatsApp Business", 5000.0, 80, 40, 35000.0),
        ("Facebook Ads", 8000.0, 50, 15, 18000.0),
    ]

    for month_i in range(6):
        m_date = now - timedelta(days=30 * (5 - month_i))
        for channel, base_spend, base_leads, base_conv, base_rev in marketing_channels:
            var = rng.uniform(0.92, 1.08)
            mk_rec = MarketingRecord(
                id=uuid.uuid4(),
                business_id=demo_biz.id,
                date=m_date,
                channel=channel,
                spend=round(base_spend * var, 2),
                leads=int(base_leads * var),
                conversions=int(base_conv * var),
                revenue=round(base_rev * var, 2),
                created_at=m_date
            )
            db.add(mk_rec)

    db.commit()
    db.refresh(demo_biz)
    return demo_biz
