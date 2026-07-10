from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.models.conversation_model import StreamChatRequest

from app.models.conversation_model import (
    ConversationCreate,
    ChatRequest,
    ChatResponse,
    RenameConversationRequest
)

from app.services.conversation_service import ConversationService

router = APIRouter()

conversation_service = ConversationService()

@router.post(
    "/conversations"
)
def create_conversation(request: ConversationCreate):

    conversation_id = conversation_service.create_conversation(
        user_uid=request.user_uid,
        domain=request.domain,
        title=request.title
    )

    return {"conversation_id": conversation_id}

@router.get(
    "/conversations/{user_uid}"
)
def get_conversations(user_uid: str):

    return conversation_service.get_user_conversations(
        user_uid
    )

@router.get("/conversations/messages/{conversation_id}")
def get_messages(conversation_id: int):

    return conversation_service.get_messages(
        conversation_id
    )

@router.post(
    "/conversations/chat",
    response_model=ChatResponse
)
def chat(request: ChatRequest):

    answer = conversation_service.chat(

        conversation_id=request.conversation_id,

        question=request.question,

        domain=request.domain

    )

    return ChatResponse(

        answer=answer

    )

@router.put("/conversations/{conversation_id}")
def rename_conversation(

    conversation_id: int,

    request: RenameConversationRequest

):

    conversation_service.rename_conversation(

        conversation_id,

        request.title

    )

    return {

        "message": "Conversation renamed."

    }


@router.delete("/conversations/{conversation_id}")
def delete_conversation(conversation_id: int):

    conversation_service.delete_conversation(
        conversation_id
    )

    return {

        "message": "Conversation deleted."

    }


@router.post("/conversations/chat/stream")
def stream_chat(request: StreamChatRequest):
    
    generator = conversation_service.stream_chat(
        conversation_id=request.conversation_id,
        question=request.question,
        domain=request.domain
    )

    return StreamingResponse(
        generator,
        media_type="text/plain"
    )
