import io
import math
import re
from typing import Any, Dict, List, Optional
import pandas as pd
from app.schemas.data_import import UploadedDataResponse, ValidationSummary

MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024  # 20 MB

# Flexible Keyword patterns for column auto-detection
KEYWORD_MAPPINGS = {
    "product": [
        "product", "product_name", "item", "item_name", "title", "offering", "description"
    ],
    "customer": [
        "customer", "customer_name", "client", "client_name", "buyer", "shopper", "contact_name", "full_name", "name"
    ],
    "order_date": [
        "date", "order_date", "purchase_date", "transaction_date", "created_at", "invoice_date", "time"
    ],
    "quantity": [
        "qty", "quantity", "units", "items_count", "count", "volume"
    ],
    "unit_price": [
        "price", "unit_price", "selling_price", "rate", "cost_per_unit"
    ],
    "order_total": [
        "total", "amount", "order_total", "sales", "revenue", "grand_total", "net_amount"
    ],
    "expense": [
        "expense", "expense_amount", "spending", "payout"
    ],
    "category": [
        "category", "type", "segment", "class", "group"
    ],
    "sku": [
        "sku", "code", "item_code", "product_id", "barcode"
    ],
    "email": [
        "email", "email_address", "mail"
    ],
    "phone": [
        "phone", "mobile", "contact", "telephone"
    ],
    "vendor": [
        "vendor", "supplier", "payee", "merchant"
    ]
}

DATA_TYPE_SIGNATURES = {
    "orders": ["order_date", "customer", "product", "quantity", "unit_price", "order_total"],
    "customers": ["customer", "email", "phone", "city", "order_total"],
    "products": ["product", "sku", "category", "unit_price", "expense"],
    "expenses": ["expense", "category", "vendor", "order_date", "order_total"],
    "inventory": ["sku", "product", "quantity", "vendor", "unit_price"],
    "marketing": ["category", "ad_spend", "clicks", "impressions", "conversions"]
}


def read_uploaded_file(file_bytes: bytes, filename: str) -> pd.DataFrame:
    """
    Inspects, validates size, and parses CSV, XLSX, or XLS file into a pandas DataFrame.
    """
    if len(file_bytes) == 0:
        raise ValueError("Uploaded file is completely empty.")

    if len(file_bytes) > MAX_FILE_SIZE_BYTES:
        raise ValueError(f"File size exceeds maximum allowed limit of {MAX_FILE_SIZE_BYTES // (1024 * 1024)} MB.")

    ext = filename.lower().split(".")[-1]

    try:
        if ext == "csv":
            try:
                df = pd.read_csv(io.BytesIO(file_bytes), encoding="utf-8")
            except UnicodeDecodeError:
                df = pd.read_csv(io.BytesIO(file_bytes), encoding="latin-1")
        elif ext in ["xlsx", "xls"]:
            df = pd.read_excel(io.BytesIO(file_bytes))
        else:
            raise ValueError(f"Unsupported file format '.{ext}'. Growz currently supports .csv, .xlsx, and .xls files.")
    except Exception as err:
        if isinstance(err, ValueError):
            raise err
        raise ValueError(f"Failed to parse file '.{ext}': {str(err)}")

    if df.empty or len(df.columns) == 0:
        raise ValueError("Uploaded file contains no readable data or column headers.")

    # Clean header strings
    df.columns = [str(col).strip() for col in df.columns]
    return df


def detect_columns(df: pd.DataFrame) -> List[str]:
    """Returns list of column names."""
    return [str(col) for col in df.columns]


def auto_map_columns(columns: List[str], data_type: Optional[str] = None) -> Dict[str, str]:
    """Flexible keyword matcher mapping uploaded headers to Growz target fields."""
    mapping = {}

    for col in columns:
        cleaned = re.sub(r"[^a-zA-Z0-9_]", "_", str(col).lower()).strip("_")
        matched_target = None

        # 1. Pass 1: Exact keyword match
        for target_field, keywords in KEYWORD_MAPPINGS.items():
            if cleaned in keywords:
                matched_target = target_field
                break

        # 2. Pass 2: Partial keyword match
        if not matched_target:
            for target_field, keywords in KEYWORD_MAPPINGS.items():
                if any(kw in cleaned for kw in keywords if kw != "name"):
                    matched_target = target_field
                    break

        mapping[col] = matched_target if matched_target else col.lower()

    return mapping


def detect_data_type(df: pd.DataFrame, provided_data_type: Optional[str] = None) -> str:
    """Classifies file into customers, orders, products, expenses, inventory, or marketing."""
    valid_types = ["customers", "orders", "products", "expenses", "inventory", "marketing"]

    if provided_data_type:
        p_lower = provided_data_type.lower()
        if p_lower in valid_types:
            return p_lower
        if "order" in p_lower or "sale" in p_lower:
            return "orders"
        if "customer" in p_lower:
            return "customers"
        if "product" in p_lower:
            return "products"
        if "expense" in p_lower:
            return "expenses"
        if "inventory" in p_lower or "stock" in p_lower:
            return "inventory"
        if "market" in p_lower:
            return "marketing"

    columns = [str(col) for col in df.columns]
    mapped = auto_map_columns(columns)
    mapped_targets = set(mapped.values())

    best_type = "orders"
    max_matches = 0

    for d_type, target_fields in DATA_TYPE_SIGNATURES.items():
        matches = len(set(target_fields).intersection(mapped_targets))
        if matches > max_matches:
            max_matches = matches
            best_type = d_type

    return best_type


def sanitize_val(val: Any) -> Any:
    """Sanitizes floats, ints, NaN, and Inf values for JSON compatibility."""
    if val is None or pd.isna(val):
        return None
    if isinstance(val, (float, int)):
        if math.isnan(val) or math.isinf(val):
            return None
    return val


def generate_preview(df: pd.DataFrame, max_rows: int = 10) -> List[Dict[str, Any]]:
    """Generates preview rows formatted as dicts."""
    preview_df = df.head(max_rows)
    records = preview_df.to_dict(orient="records")

    sanitized_records = []
    for record in records:
        sanitized = {str(k): sanitize_val(v) for k, v in record.items()}
        sanitized_records.append(sanitized)

    return sanitized_records


def validate_data(df: pd.DataFrame, data_type: str, mapping: Dict[str, str]) -> ValidationSummary:
    """Performs data quality checks (missing columns, missing values, duplicates, negative numbers)."""
    total_rows = len(df)
    warnings = []
    errors = []
    missing_required_cols = []

    required_by_type = {
        "orders": ["order_date", "product", "quantity", "unit_price"],
        "customers": ["customer"],
        "products": ["product", "unit_price"],
        "expenses": ["expense", "order_total"],
        "inventory": ["sku", "quantity"],
        "marketing": ["category", "ad_spend"]
    }

    reqs = required_by_type.get(data_type, [])
    mapped_targets = set(mapping.values())

    for req in reqs:
        if req not in mapped_targets:
            missing_required_cols.append(req)

    if missing_required_cols:
        warnings.append(f"Missing recommended standard fields: {', '.join(missing_required_cols)}")

    null_cells = int(df.isnull().sum().sum())
    if null_cells > 0:
        warnings.append(f"Detected {null_cells} missing values across data cells.")

    dup_count = int(df.duplicated().sum())
    if dup_count > 0:
        warnings.append(f"Found {dup_count} duplicate rows in dataset.")

    numeric_cols = df.select_dtypes(include=["number"]).columns
    neg_count = 0
    for col in numeric_cols:
        neg_count += int((df[col] < 0).sum())
    if neg_count > 0:
        warnings.append(f"Found {neg_count} negative values in numeric columns.")

    warning_rows = min(int(null_cells + dup_count + neg_count), total_rows)
    error_rows = 0
    valid_rows = max(total_rows - error_rows, 0)

    return ValidationSummary(
        total_rows=total_rows,
        valid_rows=valid_rows,
        warning_rows=warning_rows,
        error_rows=error_rows,
        missing_required_columns=missing_required_cols,
        warnings=warnings,
        errors=errors
    )


def build_import_summary(
    filename: str,
    file_size: int,
    df: pd.DataFrame,
    provided_data_type: Optional[str] = None
) -> UploadedDataResponse:
    """Orchestrates processing pipeline and constructs UploadedDataResponse."""
    columns = detect_columns(df)
    detected_data_type = detect_data_type(df, provided_data_type)
    column_mapping = auto_map_columns(columns, detected_data_type)
    preview_rows = generate_preview(df, max_rows=10)
    validation_summary = validate_data(df, detected_data_type, column_mapping)

    status = "ready"
    if validation_summary.errors:
        status = "error"
    elif validation_summary.warnings:
        status = "warning"

    return UploadedDataResponse(
        filename=filename,
        file_size=file_size,
        detected_data_type=detected_data_type,
        row_count=len(df),
        column_count=len(columns),
        columns=columns,
        preview_rows=preview_rows,
        validation_summary=validation_summary,
        column_mapping=column_mapping,
        status=status
    )
