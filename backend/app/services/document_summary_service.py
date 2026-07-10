from app.services.embedding_service import EmbeddingService
from app.services.llm_service import LLMService


class DocumentSummaryService:

    def __init__(self):

        self.embedding_service = EmbeddingService()
        self.llm = LLMService()

    def generate_summary(
        self,
        domain: str,
        source_file: str
    ):

        results = self.embedding_service.get_document_chunks(
            domain=domain,
            source_file=source_file
        )

        documents = results["documents"]
        metadatas = results["metadatas"]

        if not documents:
            return "No document found."

        chunks = []

        for document, metadata in zip(documents, metadatas):
            chunks.append({
                "chunk": metadata["chunk"],
                "content": document
            })

        chunks.sort(key=lambda x: x["chunk"])

        batch_size = 5

        partial_summaries = []

        for i in range(0, len(chunks), batch_size):

            batch = chunks[i:i + batch_size]

            batch_text = "\n\n".join(
                chunk["content"]
                for chunk in batch
            )

            prompt = f"""
You are an enterprise document summarizer.

Summarize the following document section.

Keep only important information.

Document:

{batch_text}

Summary:
"""

            summary = self.llm.generate(prompt)

            partial_summaries.append(summary)

        combined = "\n\n".join(partial_summaries)

        final_prompt = f"""
You are an enterprise AI assistant.

Create a professional executive summary using the partial summaries below.

Include:

1. Executive Summary

2. Key Topics

3. Important Policies

4. Important Numbers

5. Conclusion

Partial Summaries:

{combined}

Final Summary:
"""

        return self.llm.generate(final_prompt)