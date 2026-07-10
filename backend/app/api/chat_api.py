from fastapi import APIRouter
from app.models.chat_models import ChatRequest, ChatResponse
from app.services.rag_service import RAGService

router = APIRouter()
rag_service = RAGService()

@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):

    answer = rag_service.ask(
        question=request.question,
        domain=request.domain
    )

    return ChatResponse(
        answer=answer
    )