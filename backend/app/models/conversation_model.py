from pydantic import BaseModel
from datetime import datetime


class ConversationCreate(BaseModel):

    user_uid: str
    domain: str
    title: str


class ConversationResponse(BaseModel):

    id: int
    user_uid: str
    domain: str
    title: str
    created_at: datetime
    updated_at: datetime


class MessageCreate(BaseModel):

    conversation_id: int
    role: str
    content: str


class MessageResponse(BaseModel):

    id: int
    conversation_id: int
    role: str
    content: str
    created_at: datetime

class ChatRequest(BaseModel):
    conversation_id: int
    question: str
    domain: str

class ChatResponse(BaseModel):
    answer: str

class RenameConversationRequest(BaseModel):
    title: str

class StreamChatRequest(BaseModel):
    conversation_id: int
    question: str
    domain: str