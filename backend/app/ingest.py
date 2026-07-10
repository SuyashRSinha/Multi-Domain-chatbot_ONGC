import os

from app.services.document_service import process_document
from app.services.embedding_service import EmbeddingService

embedding_service = EmbeddingService()

BASE_PATH = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "..",
        "..",
        "knowledge_base"
    )
)

for domain in os.listdir(BASE_PATH):

    domain_path = os.path.join(BASE_PATH, domain)

    if not os.path.isdir(domain_path):
        continue

    collection_name = f"{domain.lower()}_documents"

    collection = embedding_service.get_collection(
        collection_name
    )

    # -------------------------------
    # Get already indexed documents
    # -------------------------------
    existing = collection.get()

    existing_sources = set()

    if existing["metadatas"]:
        existing_sources = {
            meta["source"]
            for meta in existing["metadatas"]
        }

    print(f"\nIndexing {domain}...")

    for root, _, files in os.walk(domain_path):

        for file in files:

            if not file.lower().endswith((".pdf", ".docx")):
                continue

            file_path = os.path.join(root, file)

            result = process_document(
                file_path,
                collection_name
            )
            chunks = result["chunks"]
            metadata = result["metadata"]

            # -------------------------------
            # Skip duplicate documents
            # -------------------------------
            if metadata["source"] in existing_sources:

                print(f"Skipping {metadata['source']} (already indexed)")

                continue

            embeddings = embedding_service.generate_embeddings(
                chunks
            )

            for i, chunk in enumerate(chunks):
                chunk_metadata = metadata.copy()
                chunk_metadata["chunk"] = i + 1
                collection.add(
                    ids=[f"{metadata['source']}_{i}"],
                    documents=[chunk],
                    embeddings=[embeddings[i]],
                    metadatas=[chunk_metadata]
                )

            print(f"Indexed: {metadata['source']} ({len(chunks)} chunks)")

print("\nAll documents indexed successfully!")