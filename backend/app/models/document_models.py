from pydantic import BaseModel

class UploadResponse(BaseModel):
    message: str
    filename: str
    domain: str

class DocumentInfo(BaseModel):
    filename: str
    domain: str
    ocr_used: bool = False
    ocr_confidence: float = 0
    processing_status: str = "Not Available"
    
class DeleteDocumentResponse(BaseModel):
    message: str

class SummaryStatusResponse(BaseModel):
    status: str

    