from sentence_transformers import SentenceTransformer
import chromadb
import uuid
from chromadb.config import Settings


class EmbeddingService:

    def __init__(self):

        self.model = SentenceTransformer(
            "all-MiniLM-L6-v2"
        )

        self.client = chromadb.PersistentClient(
            path="vector_store"
        )

    def generate_embedding(self, text: str):

        return self.model.encode(text).tolist()

    def generate_embeddings(self, chunks):

        return self.model.encode(chunks).tolist()

    def get_collection(self, domain: str):

        return self.client.get_or_create_collection(
            name=domain
        )
    
    def delete_document(
            self,
            domain: str,
            source_file: str
    ):
        
        collection = self.get_collection(domain)
        results = collection.get(
            where={
                "source": source_file
            }
        )

        ids = results["ids"]
        if ids:
            collection.delete(
                ids=ids
            )

    
    
    def store_chunks(
            self,
            chunks,
            domain,
            source_file
    ):
        
        collection = self.get_collection(domain)
        embeddings = self.generate_embeddings(chunks)

        ids = [
            str(uuid.uuid4())
            for _ in chunks
        ]

        metadatas = []
        for index in range(len(chunks)):
            metadatas.append({
                "source": source_file,
                "chunk": index + 1,
            })

        collection.add(
            ids=ids,
            documents=chunks,
            metadatas=metadatas,
            embeddings=embeddings
        )

    def delete_document(
            self,
            domain: str,
            source_file: str
    ):
        
        """
        Deletes all chunks associated with a specific source file in the specified domain's collection.
        """

        collection = self.get_collection(domain)
        
        collection.delete(
            where={
                "source": source_file
            }       
        )

    def get_document_chunks(
            self,
            domain: str,
            source_file: str
    ):
        
        """
        Retrieves all chunks associated with a specific source file in the specified domain's collection.
        """

        collection = self.get_collection(domain)
        
        results = collection.get(
            where={
                "source": source_file
            },
            include=["documents", "metadatas"]
        )

        return results

