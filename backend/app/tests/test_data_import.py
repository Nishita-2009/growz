import io
import pandas as pd
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_valid_csv_upload():
    csv_content = (
        "Order Date,Customer Name,Product,Qty,Price,Total\n"
        "2026-09-01,Ananya Sharma,Keyboard,1,4500,4500\n"
        "2026-09-02,Rahul Verma,Mouse,2,1200,2400\n"
    )
    files = {"file": ("sales.csv", io.BytesIO(csv_content.encode("utf-8")), "text/csv")}
    response = client.post("/api/data/upload", files=files, data={"data_type": "Orders & Sales"})
    
    assert response.status_code == 200
    data = response.json()
    assert data["filename"] == "sales.csv"
    assert data["row_count"] == 2
    assert data["column_count"] == 6
    assert "Customer Name" in data["columns"]
    assert data["detected_data_type"] in ["orders", "Orders & Sales"]
    assert data["column_mapping"]["Customer Name"] == "customer"
    assert data["validation_summary"]["valid_rows"] == 2


def test_valid_xlsx_upload():
    df = pd.DataFrame({
        "Customer Name": ["Sneha Reddy", "Vikram Singh"],
        "Email": ["sneha@example.com", "vikram@example.com"],
        "Total Orders": [5, 2]
    })
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine="openpyxl") as writer:
        df.to_excel(writer, index=False)
    output.seek(0)

    files = {"file": ("customers.xlsx", output, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")}
    response = client.post("/api/data/upload", files=files, data={"data_type": "customers"})

    assert response.status_code == 200
    data = response.json()
    assert data["filename"] == "customers.xlsx"
    assert data["row_count"] == 2
    assert data["detected_data_type"] == "customers"
    assert data["column_mapping"]["Customer Name"] == "customer"


def test_unsupported_file_format():
    files = {"file": ("script.exe", io.BytesIO(b"binary payload"), "application/octet-stream")}
    response = client.post("/api/data/upload", files=files)

    assert response.status_code == 400
    assert "Unsupported file format" in response.json()["detail"]


def test_empty_csv_upload():
    files = {"file": ("empty.csv", io.BytesIO(b""), "text/csv")}
    response = client.post("/api/data/upload", files=files)

    assert response.status_code == 400
    assert "completely empty" in response.json()["detail"]


def test_missing_columns_warning():
    csv_content = (
        "RandomCol1,RandomCol2\n"
        "Value1,Value2\n"
    )
    files = {"file": ("random.csv", io.BytesIO(csv_content.encode("utf-8")), "text/csv")}
    response = client.post("/api/data/upload", files=files, data={"data_type": "orders"})

    assert response.status_code == 200
    data = response.json()
    assert len(data["validation_summary"]["missing_required_columns"]) > 0
    assert data["status"] == "warning"


def test_messy_dataset_with_warnings():
    csv_content = (
        "Customer Name,Order Date,Product,Qty,Price,Total\n"
        "Ananya,2026-09-01,Keyboard,1,4500,4500\n"
        ",2026-09-01,Mouse,-1,1200,-1200\n"  # missing name and negative qty
    )
    files = {"file": ("messy.csv", io.BytesIO(csv_content.encode("utf-8")), "text/csv")}
    response = client.post("/api/data/upload", files=files, data={"data_type": "orders"})

    assert response.status_code == 200
    data = response.json()
    assert data["validation_summary"]["warning_rows"] > 0
    assert len(data["validation_summary"]["warnings"]) > 0


def test_automatic_column_detection():
    csv_content = (
        "client_name,purchase_date,item_name,quantity,unit_price,amount\n"
        "Rohan,2026-09-05,Laptop Stand,1,1800,1800\n"
    )
    files = {"file": ("auto_detect.csv", io.BytesIO(csv_content.encode("utf-8")), "text/csv")}
    response = client.post("/api/data/upload", files=files)

    assert response.status_code == 200
    data = response.json()
    mapping = data["column_mapping"]
    assert mapping["client_name"] == "customer"
    assert mapping["purchase_date"] == "order_date"
    assert mapping["item_name"] == "product"
    assert mapping["quantity"] == "quantity"
    assert mapping["unit_price"] == "unit_price"
    assert mapping["amount"] == "order_total"
