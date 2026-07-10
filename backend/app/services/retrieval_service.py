from app.services.embedding_service import EmbeddingService


class RetrievalService:

    def __init__(self):

        self.embedding_service = EmbeddingService()

    def retrieve(
            self,
            question,
            domain,
            n_results=6
    ):

        collection = self.embedding_service.get_collection(
            domain
        )

        print(
            f"\nCollection: {domain}"
        )

        print(
            f"Chunks Count: {collection.count()}"
        )

        embedding = self.embedding_service.generate_embedding(
            question
        )

        results = collection.query(

            query_embeddings=[embedding],

            n_results=n_results

        )

        print("\n====== RESULT ======")
        print(results)
        print("====================\n")

        retrieved = []

        documents = results.get(
            "documents",
            [[]]
        )[0]

        metadatas = results.get(
            "metadatas",
            [[]]
        )[0]

        distances = results.get(
            "distances",
            [[]]
        )[0]

        for doc, meta, distance in zip(

            documents,
            metadatas,
            distances

        ):

            print(
                f"{meta.get('source', 'unknown')} "
                f"Chunk {meta.get('chunk', 'N/A')} "
                f"Distance={distance}"
            )

            retrieved.append({

                "document": doc,

                "metadata": meta,

                "distance": distance

            })

        print("\n====== FILTERED ======")

        for item in retrieved:

            print(

                f"{item['metadata'].get('source', 'unknown')} "
                f"- "
                f"{item['metadata'].get('chunk', 'N/A')} "
                f"- "
                f"{item['distance']}"

            )

        print("======================\n")

        return retrieved