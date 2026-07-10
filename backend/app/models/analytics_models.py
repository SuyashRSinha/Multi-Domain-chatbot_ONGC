from pydantic import BaseModel


class AnalyticsCardResponse(BaseModel):

    total_users: int

    total_conversations: int

    total_messages: int

    total_documents: int


class DomainUsage(BaseModel):

    domain: str

    count: int


class TopQuestion(BaseModel):

    question: str

    count: int


class DailyUsage(BaseModel):

    date: str

    conversations: int