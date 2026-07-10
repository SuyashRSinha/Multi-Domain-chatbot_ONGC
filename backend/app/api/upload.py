from fastapi import APIRouter, UploadFile, File, Form, HTTPException

from app.models.document_models import UploadResponse
from app.services.upload_service import UploadService

router = APIRouter()

upload_service = UploadService()

ALLOWED_DOMAINS = [
    "hr_documents",
    "ongc_documents",
    "technical_documents",
    "training_documents",
    "finance_documents",
    "legal_documents",
    "marketing_documents",
    "medical_documents"
]


@router.post(
    "/upload",
    response_model=UploadResponse
)
async def upload_document(
    file: UploadFile = File(...),
    domain: str = Form(...),
    user_uid: str = Form(...)
):

    
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported for upload."
        )
    
    if domain not in ALLOWED_DOMAINS:
        raise HTTPException(
            status_code=400,
            detail="Invalid domain."
        )

    saved_path = upload_service.save_file(
        file=file,
        domain=domain
    )

    text = upload_service.extract_text(saved_path)

    if not text.strip():
        raise HTTPException(
            status_code=400,
            detail="No readable text found. This appears to be a scanned PDF. OCR support will be added in a future version."
        )

    chunks = upload_service.create_chunks(text)

    upload_service.store_embeddings(
        chunks=chunks,
        domain=domain,
        source_file=file.filename,
        user_uid=user_uid
    )

    upload_service.save_document_record(
        filename=file.filename,
        domain=domain,
        user_uid=user_uid
    )

    upload_service.generate_and_cache_summary(
        domain=domain,
        source_file=file.filename
    )

    return UploadResponse(
        message="File uploaded and indexed successfully.",
        filename=file.filename,
        domain=domain
    )