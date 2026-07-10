from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.services.conversation_service import ConversationService

router = APIRouter()

service = ConversationService()

@router.post("/conversations/stream")
def stream_chat(request):

    generator = service.stream_chat(

        conversation_id=request.conversation_id,

        question=request.question,

        domain=request.domain

    )

    return StreamingResponse(

        generator,

        media_type="text/plain"

    )