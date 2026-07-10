from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from app.services.pdf_report_service import PDFReportService
from app.models.document_models import DocumentInfo, DeleteDocumentResponse
from app.services.document_service import DocumentService
from app.models.document_models import SummaryStatusResponse
from app.services.summary_status_service import SummaryStatusService


router = APIRouter()
document_service = DocumentService()
summary_status_service = SummaryStatusService()
pdf_report_service = PDFReportService()

@router.get(
    "/documents",
    response_model=list[DocumentInfo],
)

def list_documents():
    return document_service.list_documents()

@router.delete(
    "/documents",
    response_model=DeleteDocumentResponse,
)

def delete_document(
    domain: str,
    filename: str
):
    
    deleted = document_service.delete_document(
        domain=domain,
        filename=filename
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )
    
    return DeleteDocumentResponse(
        message="Document deleted successfully"
    )

@router.get(
    "/summary/status",
    response_model=SummaryStatusResponse,
)

def get_summary_status(
    domain: str,
    filename: str
):
    
    data = summary_status_service.get_status(
        domain=domain,
        source_file=filename
    )

    if data is None:
        return SummaryStatusResponse(
            status="not_found"
        )
    
    return SummaryStatusResponse(
        status=data["status"]
    )


@router.get("/summary/download")
def download_summary(
    domain: str,
    filename: str
):
    
    pdf_path = pdf_report_service.generate_pdf(
        domain=domain,
        source_file=filename
    )

    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        filename=filename.replace(
            ".pdf",
            "_summary.pdf"
        )
    )



