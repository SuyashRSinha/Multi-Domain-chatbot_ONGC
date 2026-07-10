import os
from pathlib import Path

from app.utils.pdf_loader import load_pdf
from app.utils.docx_loader import load_docx
from app.utils.chunking import create_chunks
from app.utils.metadata import build_metadata

from app.services.embedding_service import EmbeddingService
from app.services.ocr_service import OCRService


def process_document(file_path: str, domain: str):

    ocr_service = OCRService()

    extension = os.path.splitext(file_path)[1].lower()

    ocr_used = False
    ocr_confidence = 0
    processing_status = "Completed"

    if extension == ".pdf":

        text = load_pdf(file_path)

        if len(text.strip()) < 100:

            print("\nScanned PDF detected. Running OCR...\n")

            result = ocr_service.extract_text(file_path)

            text = result["text"]

            ocr_used = result["ocr_used"]

            ocr_confidence = result["ocr_confidence"]

            processing_status = result["processing_status"]

    elif extension == ".docx":

        text = load_docx(file_path)

    else:

        raise Exception("Unsupported file type")

    chunks = create_chunks(text)

    metadata = build_metadata(domain, file_path)

    metadata["ocr_used"] = ocr_used

    metadata["ocr_confidence"] = ocr_confidence

    metadata["processing_status"] = processing_status

    return {

        "chunks": chunks,

        "metadata": metadata,

        "ocr_used": ocr_used,

        "ocr_confidence": ocr_confidence,

        "processing_status": processing_status

    }

class DocumentService:

    def __init__(self):

        self.upload_root = (
            Path(__file__).resolve().parents[2] / "uploads"
        )

        self.embedding_service = EmbeddingService()

    def list_documents(self):
        
        import json

        documents = []

        if not self.upload_root.exists():

            return documents
        for domain_folder in self.upload_root.iterdir():
            if not domain_folder.is_dir():
                continue

            for file in domain_folder.iterdir():
                if not file.is_file():
                    continue

                if file.name.endswith(".metadata.json") or file.suffix == ".json":
                    continue

                metadata_file = file.with_suffix(".metadata.json")

                metadata = {
                    "ocr_used": False,
                    "ocr_confidence": 0,
                    "processing_status": "Not available"
                }

                if metadata_file.exists():
                    with open(metadata_file, "r") as f:
                        metadata = json.load(f)
                    
                documents.append({
                    "filename": file.name,
                    "domain": domain_folder.name,
                    "ocr_used": metadata.get("ocr_used", False),
                    "ocr_confidence": metadata.get("ocr_confidence", 0),
                    "processing_status": metadata.get("processing_status", "Not available")
                })

        return documents

    def delete_document(

        self,
        domain: str,
        filename: str

    ):

        file_path = self.upload_root / domain / filename

        if not file_path.exists():

            return False

        file_path.unlink()

        self.embedding_service.delete_document(

            domain=domain,

            source_file=filename

        )

        return True