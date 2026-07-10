from app.services.embedding_service import EmbeddingService
from app.services.llm_service import LLMService

class SummaryService:

    def __init__(self):

        self.embedding_service = EmbeddingService()
        self.llm = LLMService()
    
    def generate_summary(
            self,
            domain: str,
            source_file: str,
    ):
        
        results = self.embedding_service.get_document_chunks(
            domain=domain,  
            source_file=source_file
        )

        documents = results["documents"]
        metadatas = results["metadatas"]

        if len(documents) == 0:
            return "No documents found for the specified domain and source file."
        
        chunks = []

        for document, metadata in zip(documents, metadatas):

            chunks.append({
                "chunk": metadata["chunk"],
                "content": document
            })

        chunks.sort(key=lambda x: x["chunk"])

        print("\n====== CHUNKS ======")
        chunk_summaries = []

        for chunk in chunks:

            print(f"summarizing chunk {chunk['chunk']}")

            prompt = f"""
You are an enterprise document summarizer.

Summarize ONLY the following section.

Keep only important information.

Section:

{chunk["content"]}

Summary:
"""
            summary = self.llm.generate(prompt)
            chunk_summaries.append(summary)
        
        print("\n====== CHUNK SUMMARIES ======")

        combined = "\n\n".join(chunk_summaries)

        final_prompt = f"""
You are an enterprise AI assistant.

Using the summaries below, create a professional report.

Use these headings:

1. Executive Summary

2. Key Topics

3. Important Policies

4. Important Numbers

5. Key Benefits

6. Conclusion

Summaries:

{combined}

Final Report:
"""
        final_summary = self.llm.generate(final_prompt)
        return final_summary
    