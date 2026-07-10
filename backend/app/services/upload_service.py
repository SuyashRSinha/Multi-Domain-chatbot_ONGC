import threading
from pathlib import Path
from app.utils.pdf_loader import load_pdf
from app.utils.chunking import create_chunks
from app.services.embedding_service import EmbeddingService
import shutil
from app.services.document_summary_service import DocumentSummaryService
from app.services.summary_cache_service import SummaryCacheService
from app.services.summary_status_service import SummaryStatusService
import traceback
from app.services.ocr_service import OCRService
import os
import json
from app.repositories.document_repository import DocumentRepository


class UploadService:

    def __init__(self):

        self.base_dir = Path(__file__).resolve().parents[2]

        self.upload_root = self.base_dir / "uploads"
        self.embedding_service = EmbeddingService()
        self.summary_service = DocumentSummaryService()
        self.summary_cache = SummaryCacheService()
        self.summary_status = SummaryStatusService()
        self.ocr_service = OCRService()
        self.document_repository = DocumentRepository()

    def save_file(self, file, domain):

        domain_folder = self.upload_root / domain

        domain_folder.mkdir(
            parents=True,
            exist_ok=True
        )

        file_path = domain_folder / file.filename

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        return str(file_path)
    
    def extract_text(self, file_path):

        text = load_pdf(file_path)
        if len(text.strip()) >=100:
            print("Text extracted from PDF successfully.")
            return text
        print("\nScanned PDF detected. Running OCR...\n")
        result = self.ocr_service.extract_text(file_path)
        print(f"OCR Used : {result['ocr_used']}")
        print(f"OCR Confidence : {result['ocr_confidence']}")
        print(f"Processing Status : {result['processing_status']}")

        self.save_metadata(
            file_path=file_path,
            ocr_used=result["ocr_used"],
            ocr_confidence=result["ocr_confidence"],
            processing_status=result["processing_status"]
        )
        return result["text"]
    
    def create_chunks(self, text):

        chunks = create_chunks(text)
        return chunks
    
    def store_embeddings(
            self,
            chunks,
            domain,
            source_file,
            user_uid
    ):
        
        self.embedding_service.delete_document(
            domain=domain,
            source_file=source_file
        )
        
        self.embedding_service.store_chunks(
            chunks=chunks,
            domain=domain,
            source_file=source_file
        )

    def _background_summary_worker(
            self,
            domain: str,
            source_file: str
    ):
        
        print("Background worker entered")
        
        try:

            print(f"Starting summary generation for {source_file}...")

            summary = self.summary_service.generate_summary(
                domain=domain,
                source_file=source_file
            )

            print("generate_summary() returned succesfully")

            print("saving summary to cache...")

            self.summary_cache.save_summary(
                domain=domain,
                source_file=source_file,
                summary=summary
            )

            print("Summary saved to cache successfully.")

            self.summary_status.set_ready(
                domain=domain,
                source_file=source_file
            )

            print(f"Summary generation completed for {source_file}.")
        
        
        except Exception as e:

            print(e)
            traceback.print_exc()

            self.summary_status.set_failed(
                domain=domain,
                source_file=source_file
            )


    def generate_and_cache_summary(
            self,
            domain: str,
            source_file: str,
    ):
        
        print("inside generate_and_cache_summary()")
        
        self.summary_status.set_processing(
            domain=domain,
            source_file=source_file
        )

        print("status set to processing")

        thread = threading.Thread(
            target=self._background_summary_worker,
            args=(domain, source_file),
            daemon=True
        )

        print("Starting background thread for summary generation...")

        thread.start()

        print("Background thread started for summary generation")

    def save_metadata(
            self,
            file_path,
            ocr_used,
            ocr_confidence,
            processing_status

    ):
        
        metadata = {
            "ocr_used": ocr_used,
            "ocr_confidence": ocr_confidence,
            "processing_status": processing_status
        }

        metadata_path = os.path.splitext(file_path)[0] + ".metadata.json"

        with open(metadata_path, "w") as file:

            json.dump(
                metadata,
                file,
                indent=4    


            )
        
    def save_document_record(
        self,
        filename,
        domain,
        user_uid
    ):

        self.document_repository.save_document(
             filename=filename,
             domain=domain,
             user_email=user_uid
        )
       