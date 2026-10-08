import re
import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional
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
    MarketingRecord,
)


def parse_date(val: Any) -> Optional[datetime]:
    if val is None or val == "":
        return None
    if isinstance(val, datetime):
        return val
    str_val = str(val).strip()
    for fmt in [
        "%Y-%m-%d",
        "%Y/%m/%d",
        "%d-%m-%Y",
        "%d/%m/%Y",
        "%Y-%m-%d %H:%M:%S",
        "%Y-%m-%dT%H:%M:%S",
        "%m/%d/%Y",
    ]:
        try:
            return datetime.strptime(str_val, fmt)
        except ValueError:
            continue
    try:
        # Fallback pandas parse string if possible
        import pandas as pd
        parsed = pd.to_datetime(str_val, errors="coerce")
        if not pd.isna(parsed):
            return parsed.to_pydatetime()
    except Exception:
        pass
    return None


def parse_float(val: Any) -> Optional[float]:
    if val is None or val == "":
        return None
    try:
        # Remove currency symbols or commas if present
        clean_str = re.sub(r"[^\d.-]", "", str(val))
        if not clean_str:
            return None
        f = float(clean_str)
        import math
        if math.isnan(f) or math.isinf(f):
            return None
        return f
    except (ValueError, TypeError):
        return None


def parse_int(val: Any) -> Optional[int]:
    f = parse_float(val)
    if f is None:
        return None
    return int(f)


def parse_str(val: Any) -> Optional[str]:
    if val is None:
        return None
    s = str(val).strip()
    if not s or s.lower() in ["nan", "null", "none", "n/a"]:
        return None
    return s


def get_row_value(row: Dict[str, Any], mapping: Dict[str, str], target_field: str) -> Any:
    """Helper to extract raw cell value from row given the column mapping."""
    # First check if any column maps directly to target_field
    for col_name, mapped_target in mapping.items():
        if mapped_target == target_field and col_name in row:
            val = row[col_name]
            if val is not None and not (isinstance(val, float) and (val != val)):  # NaN check
                return val

    # Fallback direct lookup
    for key, val in row.items():
        if key.lower().replace(" ", "_") == target_field:
            return val

    return None


def normalize_and_store_import(
    db: Session,
    business: Business,
    data_type: str,
    rows: List[Dict[str, Any]],
    column_mapping: Dict[str, str],
) -> Dict[str, Any]:
    """
    Takes raw row dictionaries from uploaded file and normalizes them into
    SQLAlchemy models associated with the specified active Business.

    Enforces data integrity rule:
    Never silently invent missing business data. Missing required fields are flagged and reported.
    """
    imported_count = 0
    skipped_count = 0
    missing_fields_report: List[str] = []

    d_type = data_type.lower()

    if "customer" in d_type:
        for idx, row in enumerate(rows, start=1):
            name = parse_str(get_row_value(row, column_mapping, "customer")) or parse_str(
                get_row_value(row, column_mapping, "name")
            )
            if not name:
                missing_fields_report.append(f"Row {idx}: Customer name is missing. Skipped.")
                skipped_count += 1
                continue

            email = parse_str(get_row_value(row, column_mapping, "email"))
            phone = parse_str(get_row_value(row, column_mapping, "phone"))
            location = parse_str(get_row_value(row, column_mapping, "location")) or parse_str(
                get_row_value(row, column_mapping, "city")
            )
            customer_type = parse_str(get_row_value(row, column_mapping, "customer_type"))

            # Deduplicate per Business
            stmt = select(Customer).where(
                Customer.business_id == business.id, Customer.name == name
            )
            existing_cust = db.execute(stmt).scalars().first()

            if existing_cust:
                if email and not existing_cust.email:
                    existing_cust.email = email
                if phone and not existing_cust.phone:
                    existing_cust.phone = phone
                if location and not existing_cust.location:
                    existing_cust.location = location
            else:
                cust = Customer(
                    business_id=business.id,
                    name=name,
                    email=email,
                    phone=phone,
                    location=location,
                    customer_type=customer_type,
                )
                db.add(cust)
            imported_count += 1

    elif "product" in d_type:
        for idx, row in enumerate(rows, start=1):
            name = parse_str(get_row_value(row, column_mapping, "product")) or parse_str(
                get_row_value(row, column_mapping, "name")
            )
            if not name:
                missing_fields_report.append(f"Row {idx}: Product name is missing. Skipped.")
                skipped_count += 1
                continue

            sku = parse_str(get_row_value(row, column_mapping, "sku"))
            category = parse_str(get_row_value(row, column_mapping, "category"))
            selling_price = parse_float(get_row_value(row, column_mapping, "unit_price")) or parse_float(
                get_row_value(row, column_mapping, "selling_price")
            ) or 0.0
            cost_price = parse_float(get_row_value(row, column_mapping, "expense")) or parse_float(
                get_row_value(row, column_mapping, "cost_price")
            )
            stock = parse_float(get_row_value(row, column_mapping, "quantity")) or parse_float(
                get_row_value(row, column_mapping, "current_stock")
            ) or 0.0

            # Deduplicate per Business by SKU or Name
            existing_prod = None
            if sku:
                stmt = select(Product).where(
                    Product.business_id == business.id, Product.sku == sku
                )
                existing_prod = db.execute(stmt).scalars().first()

            if not existing_prod:
                stmt = select(Product).where(
                    Product.business_id == business.id, Product.name == name
                )
                existing_prod = db.execute(stmt).scalars().first()

            if existing_prod:
                if selling_price > 0:
                    existing_prod.selling_price = selling_price
                if cost_price is not None:
                    existing_prod.cost_price = cost_price
                if stock > 0:
                    existing_prod.current_stock += stock
            else:
                prod = Product(
                    business_id=business.id,
                    name=name,
                    sku=sku,
                    category=category,
                    selling_price=selling_price,
                    cost_price=cost_price,
                    current_stock=stock,
                )
                db.add(prod)
            imported_count += 1

    elif "expense" in d_type:
        for idx, row in enumerate(rows, start=1):
            exp_date = parse_date(get_row_value(row, column_mapping, "order_date")) or parse_date(
                get_row_value(row, column_mapping, "date")
            )
            amount = parse_float(get_row_value(row, column_mapping, "order_total")) or parse_float(
                get_row_value(row, column_mapping, "expense")
            )

            if not exp_date:
                missing_fields_report.append(f"Row {idx}: Expense date is missing. Skipped.")
                skipped_count += 1
                continue
            if amount is None:
                missing_fields_report.append(f"Row {idx}: Expense amount is missing. Skipped.")
                skipped_count += 1
                continue

            category = parse_str(get_row_value(row, column_mapping, "category"))
            vendor = parse_str(get_row_value(row, column_mapping, "vendor"))
            expense_item = parse_str(get_row_value(row, column_mapping, "expense"))
            desc = vendor or expense_item or f"Expense on {exp_date.strftime('%Y-%m-%d')}"

            exp = Expense(
                business_id=business.id,
                expense_date=exp_date,
                category=category,
                description=desc,
                amount=amount,
            )
            db.add(exp)
            imported_count += 1

    elif "order" in d_type or "sale" in d_type:
        for idx, row in enumerate(rows, start=1):
            order_date = parse_date(get_row_value(row, column_mapping, "order_date")) or parse_date(
                get_row_value(row, column_mapping, "date")
            )
            if not order_date:
                missing_fields_report.append(f"Row {idx}: Order date is missing. Skipped.")
                skipped_count += 1
                continue

            order_num = parse_str(get_row_value(row, column_mapping, "order_number")) or f"ORD-{idx:04d}"
            total_amt = parse_float(get_row_value(row, column_mapping, "order_total")) or parse_float(
                get_row_value(row, column_mapping, "amount")
            ) or 0.0

            # Match or create Customer
            cust_name = parse_str(get_row_value(row, column_mapping, "customer"))
            customer_id = None
            if cust_name:
                stmt = select(Customer).where(
                    Customer.business_id == business.id, Customer.name == cust_name
                )
                cust = db.execute(stmt).scalars().first()
                if not cust:
                    cust = Customer(
                        business_id=business.id,
                        name=cust_name,
                        email=parse_str(get_row_value(row, column_mapping, "email")),
                    )
                    db.add(cust)
                    db.flush()
                customer_id = cust.id

            order = Order(
                business_id=business.id,
                customer_id=customer_id,
                order_date=order_date,
                order_number=order_num,
                total_amount=total_amt,
                payment_status="paid",
            )
            db.add(order)
            db.flush()

            # Product & OrderItem
            prod_name = parse_str(get_row_value(row, column_mapping, "product"))
            if prod_name:
                qty = parse_float(get_row_value(row, column_mapping, "quantity")) or 1.0
                unit_price = parse_float(get_row_value(row, column_mapping, "unit_price")) or (
                    total_amt / qty if qty > 0 and total_amt > 0 else 0.0
                )
                item_total = total_amt if total_amt > 0 else (qty * unit_price)

                stmt = select(Product).where(
                    Product.business_id == business.id, Product.name == prod_name
                )
                prod = db.execute(stmt).scalars().first()
                if not prod:
                    prod = Product(
                        business_id=business.id,
                        name=prod_name,
                        selling_price=unit_price,
                        current_stock=0.0,
                    )
                    db.add(prod)
                    db.flush()

                order_item = OrderItem(
                    order_id=order.id,
                    product_id=prod.id,
                    quantity=qty,
                    unit_price=unit_price,
                    total_amount=item_total,
                )
                db.add(order_item)

            imported_count += 1

    elif "inventory" in d_type:
        for idx, row in enumerate(rows, start=1):
            rec_date = parse_date(get_row_value(row, column_mapping, "order_date")) or parse_date(
                get_row_value(row, column_mapping, "date")
            ) or datetime.utcnow()
            qty = parse_float(get_row_value(row, column_mapping, "quantity"))

            if qty is None:
                missing_fields_report.append(f"Row {idx}: Inventory quantity is missing. Skipped.")
                skipped_count += 1
                continue

            prod_name = parse_str(get_row_value(row, column_mapping, "product"))
            sku = parse_str(get_row_value(row, column_mapping, "sku"))
            product_id = None

            if prod_name or sku:
                stmt = select(Product).where(Product.business_id == business.id)
                if sku:
                    stmt = stmt.where(Product.sku == sku)
                elif prod_name:
                    stmt = stmt.where(Product.name == prod_name)
                prod = db.execute(stmt).scalars().first()
                if prod:
                    product_id = prod.id

            inv = InventoryRecord(
                business_id=business.id,
                product_id=product_id,
                date=rec_date,
                quantity=qty,
                movement_type="stock_update",
                reference=parse_str(get_row_value(row, column_mapping, "vendor")),
            )
            db.add(inv)
            imported_count += 1

    elif "marketing" in d_type:
        for idx, row in enumerate(rows, start=1):
            rec_date = parse_date(get_row_value(row, column_mapping, "order_date")) or parse_date(
                get_row_value(row, column_mapping, "date")
            ) or datetime.utcnow()
            channel = parse_str(get_row_value(row, column_mapping, "category")) or "General Marketing"
            spend = parse_float(get_row_value(row, column_mapping, "ad_spend")) or parse_float(
                get_row_value(row, column_mapping, "expense")
            ) or 0.0

            mkt = MarketingRecord(
                business_id=business.id,
                date=rec_date,
                channel=channel,
                spend=spend,
                leads=parse_int(get_row_value(row, column_mapping, "clicks")) or 0,
                conversions=parse_int(get_row_value(row, column_mapping, "conversions")) or 0,
                revenue=parse_float(get_row_value(row, column_mapping, "order_total")) or 0.0,
            )
            db.add(mkt)
            imported_count += 1

    else:
        raise ValueError(f"Unsupported normalization data type '{data_type}'.")

    db.commit()

    return {
        "business_id": str(business.id),
        "business_name": business.name,
        "data_type": data_type,
        "imported_count": imported_count,
        "skipped_count": skipped_count,
        "missing_fields_report": missing_fields_report,
    }
