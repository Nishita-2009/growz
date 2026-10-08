from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

# Type aliases and models requested
PreviewRow = Dict[str, Any]


class ColumnMapping(BaseModel):
    mapping: Dict[str, str] = Field(
        ..., description="Dictionary mapping uploaded raw column name to Growz standardized target field"
    )


class ValidationSummary(BaseModel):
    total_rows: int = Field(..., description="Total number of rows detected in the file")
    valid_rows: int = Field(..., description="Number of valid rows ready for processing")
    warning_rows: int = Field(0, description="Number of rows with minor non-blocking warnings")
    error_rows: int = Field(0, description="Number of rows with critical errors")
    missing_required_columns: List[str] = Field(default_factory=list, description="List of missing expected columns")
    warnings: List[str] = Field(default_factory=list, description="Non-blocking warning messages")
    errors: List[str] = Field(default_factory=list, description="Blocking error messages")


class UploadedDataResponse(BaseModel):
    filename: str
    file_size: int
    detected_data_type: str  # "customers", "orders", "products", "expenses", "inventory", "marketing"
    row_count: int
    column_count: int
    columns: List[str]
    preview_rows: List[PreviewRow]
    validation_summary: ValidationSummary
    column_mapping: Dict[str, str]
    status: str  # "ready", "needs_review", "warning", "error"


class ImportRequest(BaseModel):
    data_type: str
    rows: List[Dict[str, Any]]
    column_mapping: Dict[str, str] = Field(default_factory=dict)


class NormalizedImportResponse(BaseModel):
    business_id: str
    business_name: str
    data_type: str
    imported_count: int
    skipped_count: int
    missing_fields_report: List[str] = Field(default_factory=list)
