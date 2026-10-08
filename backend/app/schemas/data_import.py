from typing import Any, Optional
from pydantic import BaseModel, Field


class ValidationSummary(BaseModel):
    total_rows: int = Field(..., description="Total number of rows detected in the file")
    valid_rows: int = Field(..., description="Number of valid rows ready for processing")
    warning_rows: int = Field(0, description="Number of rows with minor non-blocking warnings")
    error_rows: int = Field(0, description="Number of rows with critical errors")
    missing_required_columns: list[str] = Field(default_factory=list, description="List of missing expected columns")
    warnings: list[str] = Field(default_factory=list, description="Non-blocking warning messages")
    errors: list[str] = Field(default_factory=list, description="Blocking error messages")


class ColumnMappingResponse(BaseModel):
    column_mapping: dict[str, str] = Field(
        ..., description="Dictionary mapping uploaded raw column name to Growz standardized target field"
    )


class UploadedDataResponse(BaseModel):
    filename: str
    file_size: int
    detected_data_type: str  # "customers", "orders", "products", "expenses", "inventory", "marketing", or "unknown"
    row_count: int
    column_count: int
    columns: list[str]
    preview_rows: list[dict[str, Any]]
    validation_summary: ValidationSummary
    column_mapping: dict[str, str]
    status: str  # "ready", "needs_review", "warning", "error"
