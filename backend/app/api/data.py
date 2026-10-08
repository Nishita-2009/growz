from typing import Optional
from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status
from app.schemas.data_import import UploadedDataResponse
from app.services.data_import_service import (
    MAX_FILE_SIZE_BYTES,
    build_import_summary,
    read_uploaded_file,
)

router = APIRouter()


@router.post("/upload", response_model=UploadedDataResponse, status_code=status.HTTP_200_OK)
async def upload_data(
    file: UploadFile = File(...),
    data_type: Optional[str] = Form(None),
):
    """
    Accepts business CSV, XLSX, or XLS files, inspects them, detects data types,
    validates rows, and returns structured data analysis.
    """
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Filename cannot be empty."
        )

    # Security: Sanitize filename (never use directly as a filesystem path)
    safe_filename = file.filename.replace("\\", "/").split("/")[-1]
    ext = safe_filename.lower().split(".")[-1]

    if ext not in ["csv", "xlsx", "xls"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '.{ext}'. Growz currently supports .csv, .xlsx, and .xls files."
        )

    try:
        file_bytes = await file.read()
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to read uploaded file payload: {str(err)}"
        )

    if len(file_bytes) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File size exceeds maximum allowed development limit of {MAX_FILE_SIZE_BYTES // (1024 * 1024)} MB."
        )

    try:
        df = read_uploaded_file(file_bytes, safe_filename)
        summary = build_import_summary(
            filename=safe_filename,
            file_size=len(file_bytes),
            df=df,
            provided_data_type=data_type,
        )
        return summary
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err)
        )
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred while processing the file: {str(err)}"
        )


from fastapi import Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_business
from app.models.models import Business
from app.schemas.data_import import ImportRequest, NormalizedImportResponse
from app.services.normalization_service import normalize_and_store_import


@router.post("/import", response_model=NormalizedImportResponse, status_code=status.HTTP_201_CREATED)
async def import_data(
    body: ImportRequest,
    db: Session = Depends(get_db),
    business: Business = Depends(get_current_business),
):
    """
    Normalizes validated rows and persists them into PostgreSQL under the active Business context.
    """
    if not body.rows:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No data rows provided for import."
        )

    try:
        result = normalize_and_store_import(
            db=db,
            business=business,
            data_type=body.data_type,
            rows=body.rows,
            column_mapping=body.column_mapping,
        )
        return result
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err)
        )
    except Exception as err:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to normalize and store imported records: {str(err)}"
        )
