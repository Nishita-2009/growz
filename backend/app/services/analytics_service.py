import uuid
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func, select, desc

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


def calculate_financial_metrics(db: Session, business_id: uuid.UUID) -> Dict[str, Any]:
    """
    Calculates total_revenue, total_expenses, net_profit, profit_margin,
    revenue_growth, expense_growth, average_order_value for a given business_id.
    """
    # 1. Total Revenue
    rev_stmt = select(func.coalesce(func.sum(Order.total_amount), 0.0)).where(
        Order.business_id == business_id
    )
    total_revenue = float(db.execute(rev_stmt).scalar() or 0.0)

    # 2. Total Expenses
    exp_stmt = select(func.coalesce(func.sum(Expense.amount), 0.0)).where(
        Expense.business_id == business_id
    )
    total_expenses = float(db.execute(exp_stmt).scalar() or 0.0)

    # 3. Net Profit & Margin
    net_profit = total_revenue - total_expenses
    profit_margin: Optional[float] = None
    if total_revenue > 0:
        profit_margin = round((net_profit / total_revenue) * 100, 2)

    # 4. Total Orders & Average Order Value (AOV)
    order_count_stmt = select(func.count(Order.id)).where(Order.business_id == business_id)
    total_orders = int(db.execute(order_count_stmt).scalar() or 0)

    average_order_value = 0.0
    if total_orders > 0:
        average_order_value = round(total_revenue / total_orders, 2)

    # 5. Period Comparison for Growth Rates (Current 30d vs Previous 30d)
    now = datetime.utcnow()
    curr_30_start = now - timedelta(days=30)
    prev_30_start = now - timedelta(days=60)

    curr_rev_stmt = select(func.coalesce(func.sum(Order.total_amount), 0.0)).where(
        Order.business_id == business_id,
        Order.order_date >= curr_30_start,
    )
    curr_rev = float(db.execute(curr_rev_stmt).scalar() or 0.0)

    prev_rev_stmt = select(func.coalesce(func.sum(Order.total_amount), 0.0)).where(
        Order.business_id == business_id,
        Order.order_date >= prev_30_start,
        Order.order_date < curr_30_start,
    )
    prev_rev = float(db.execute(prev_rev_stmt).scalar() or 0.0)

    revenue_growth: Optional[float] = None
    if prev_rev > 0:
        revenue_growth = round(((curr_rev - prev_rev) / prev_rev) * 100, 2)

    curr_exp_stmt = select(func.coalesce(func.sum(Expense.amount), 0.0)).where(
        Expense.business_id == business_id,
        Expense.expense_date >= curr_30_start,
    )
    curr_exp = float(db.execute(curr_exp_stmt).scalar() or 0.0)

    prev_exp_stmt = select(func.coalesce(func.sum(Expense.amount), 0.0)).where(
        Expense.business_id == business_id,
        Expense.expense_date >= prev_30_start,
        Expense.expense_date < curr_30_start,
    )
    prev_exp = float(db.execute(prev_exp_stmt).scalar() or 0.0)

    expense_growth: Optional[float] = None
    if prev_exp > 0:
        expense_growth = round(((curr_exp - prev_exp) / prev_exp) * 100, 2)

    return {
        "total_revenue": round(total_revenue, 2),
        "total_expenses": round(total_expenses, 2),
        "net_profit": round(net_profit, 2),
        "profit_margin": profit_margin,
        "revenue_growth": revenue_growth,
        "expense_growth": expense_growth,
        "average_order_value": average_order_value,
    }


def calculate_customer_metrics(db: Session, business_id: uuid.UUID) -> Dict[str, Any]:
    """
    Calculates total_customers, new_customers, repeat_customers,
    repeat_customer_rate, customer_revenue for a given business_id.
    """
    # 1. Total Customers
    tot_cust_stmt = select(func.count(Customer.id)).where(Customer.business_id == business_id)
    total_customers = int(db.execute(tot_cust_stmt).scalar() or 0)

    # 2. New Customers (Created in last 30 days)
    now = datetime.utcnow()
    curr_30_start = now - timedelta(days=30)
    new_cust_stmt = select(func.count(Customer.id)).where(
        Customer.business_id == business_id, Customer.created_at >= curr_30_start
    )
    new_customers = int(db.execute(new_cust_stmt).scalar() or 0)

    # 3. Ordering customers & Repeat Customers (> 1 order)
    cust_orders_stmt = (
        select(Order.customer_id, func.count(Order.id).label("order_count"))
        .where(Order.business_id == business_id, Order.customer_id.isnot(None))
        .group_by(Order.customer_id)
    )
    cust_orders = db.execute(cust_orders_stmt).all()

    total_ordering_customers = len(cust_orders)
    repeat_customers = sum(1 for row in cust_orders if row.order_count > 1)

    repeat_customer_rate = 0.0
    if total_ordering_customers > 0:
        repeat_customer_rate = round((repeat_customers / total_ordering_customers) * 100, 2)

    # 4. Total Customer Revenue
    cust_rev_stmt = select(func.coalesce(func.sum(Order.total_amount), 0.0)).where(
        Order.business_id == business_id, Order.customer_id.isnot(None)
    )
    customer_revenue = float(db.execute(cust_rev_stmt).scalar() or 0.0)

    return {
        "total_customers": total_customers,
        "new_customers": new_customers,
        "repeat_customers": repeat_customers,
        "repeat_customer_rate": repeat_customer_rate,
        "customer_revenue": round(customer_revenue, 2),
    }


def calculate_sales_metrics(db: Session, business_id: uuid.UUID) -> Dict[str, Any]:
    """
    Calculates total_orders, total_units_sold, average_order_value,
    top_products, sales_by_period for a given business_id.
    """
    # 1. Total Orders & Revenue
    rev_stmt = select(
        func.count(Order.id).label("order_count"),
        func.coalesce(func.sum(Order.total_amount), 0.0).label("total_revenue"),
    ).where(Order.business_id == business_id)
    row = db.execute(rev_stmt).one()
    total_orders = int(row.order_count or 0)
    total_revenue = float(row.total_revenue or 0.0)

    average_order_value = 0.0
    if total_orders > 0:
        average_order_value = round(total_revenue / total_orders, 2)

    # 2. Total Units Sold (sum of OrderItem quantity)
    units_stmt = (
        select(func.coalesce(func.sum(OrderItem.quantity), 0.0))
        .join(Order, OrderItem.order_id == Order.id)
        .where(Order.business_id == business_id)
    )
    total_units_sold = float(db.execute(units_stmt).scalar() or 0.0)

    # 3. Top Products by Sales Revenue
    top_prod_stmt = (
        select(
            Product.id.label("product_id"),
            Product.name.label("name"),
            func.coalesce(func.sum(OrderItem.quantity), 0.0).label("units_sold"),
            func.coalesce(func.sum(OrderItem.total_amount), 0.0).label("revenue"),
        )
        .join(OrderItem, Product.id == OrderItem.product_id)
        .where(Product.business_id == business_id)
        .group_by(Product.id, Product.name)
        .order_by(desc("revenue"))
        .limit(5)
    )
    top_prods_res = db.execute(top_prod_stmt).all()

    top_products = [
        {
            "product_id": str(r.product_id) if r.product_id else None,
            "name": r.name,
            "units_sold": round(float(r.units_sold), 2),
            "revenue": round(float(r.revenue), 2),
        }
        for r in top_prods_res
    ]

    # 4. Sales Breakdown by Period (e.g. Month or Date)
    orders = (
        db.execute(
            select(Order.order_date, Order.total_amount)
            .where(Order.business_id == business_id)
            .order_by(Order.order_date)
        )
        .all()
    )

    period_map: Dict[str, Dict[str, Any]] = {}
    for o_date, o_amt in orders:
        p_key = o_date.strftime("%Y-%m") if o_date else "Unknown"
        if p_key not in period_map:
            period_map[p_key] = {"period": p_key, "orders_count": 0, "revenue": 0.0}
        period_map[p_key]["orders_count"] += 1
        period_map[p_key]["revenue"] += float(o_amt or 0.0)

    sales_by_period = [
        {
            "period": v["period"],
            "orders_count": v["orders_count"],
            "revenue": round(v["revenue"], 2),
        }
        for v in period_map.values()
    ]

    return {
        "total_orders": total_orders,
        "total_units_sold": round(total_units_sold, 2),
        "average_order_value": average_order_value,
        "top_products": top_products,
        "sales_by_period": sales_by_period,
    }


def calculate_inventory_metrics(db: Session, business_id: uuid.UUID) -> Dict[str, Any]:
    """
    Calculates total_products, total_stock, low_stock_products,
    out_of_stock_products, inventory_value for a given business_id.
    """
    products = (
        db.execute(
            select(Product.current_stock, Product.cost_price, Product.selling_price).where(
                Product.business_id == business_id
            )
        )
        .all()
    )

    total_products = len(products)
    total_stock = 0.0
    low_stock_products = 0
    out_of_stock_products = 0
    inventory_value = 0.0

    for stock, cost, price in products:
        s = float(stock or 0.0)
        c = float(cost) if cost is not None else float(price or 0.0)
        total_stock += s

        if s <= 0:
            out_of_stock_products += 1
        elif 0 < s <= 10:
            low_stock_products += 1

        if s > 0:
            inventory_value += s * c

    return {
        "total_products": total_products,
        "total_stock": round(total_stock, 2),
        "low_stock_products": low_stock_products,
        "out_of_stock_products": out_of_stock_products,
        "inventory_value": round(inventory_value, 2),
    }


def calculate_marketing_metrics(db: Session, business_id: uuid.UUID) -> Dict[str, Any]:
    """
    Calculates marketing_spend, leads, conversions, conversion_rate,
    marketing_revenue, roas for a given business_id.
    """
    mkt_stmt = select(
        func.coalesce(func.sum(MarketingRecord.spend), 0.0).label("spend"),
        func.coalesce(func.sum(MarketingRecord.leads), 0).label("leads"),
        func.coalesce(func.sum(MarketingRecord.conversions), 0).label("conversions"),
        func.coalesce(func.sum(MarketingRecord.revenue), 0.0).label("revenue"),
    ).where(MarketingRecord.business_id == business_id)

    row = db.execute(mkt_stmt).one()
    spend = float(row.spend or 0.0)
    leads = int(row.leads or 0)
    conversions = int(row.conversions or 0)
    revenue = float(row.revenue or 0.0)

    conversion_rate = 0.0
    if leads > 0:
        conversion_rate = round((conversions / leads) * 100, 2)

    roas = 0.0
    if spend > 0:
        roas = round(revenue / spend, 2)

    return {
        "marketing_spend": round(spend, 2),
        "leads": leads,
        "conversions": conversions,
        "conversion_rate": conversion_rate,
        "marketing_revenue": round(revenue, 2),
        "roas": roas,
    }


def generate_business_analytics(db: Session, business: Business) -> Dict[str, Any]:
    """
    Generates complete BusinessAnalytics object for a Business scoped strictly by business_id.
    Determines data_status ('sufficient_data', 'insufficient_data', 'no_data').
    """
    financial = calculate_financial_metrics(db, business.id)
    customers = calculate_customer_metrics(db, business.id)
    sales = calculate_sales_metrics(db, business.id)
    inventory = calculate_inventory_metrics(db, business.id)
    marketing = calculate_marketing_metrics(db, business.id)

    # Determine data_status deterministically
    total_records = (
        sales["total_orders"]
        + int(financial["total_expenses"] > 0)
        + inventory["total_products"]
    )

    if total_records == 0:
        data_status = "no_data"
    elif financial["revenue_growth"] is None or sales["total_orders"] < 2:
        data_status = "insufficient_data"
    else:
        data_status = "sufficient_data"

    return {
        "business_id": str(business.id),
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "data_status": data_status,
        "financial": financial,
        "customers": customers,
        "sales": sales,
        "inventory": inventory,
        "marketing": marketing,
    }
