from pydantic import BaseModel

class ChatRequest(BaseModel):
    question: str
    domain: str

class ChatResponse(BaseModel):
    answer: str
    