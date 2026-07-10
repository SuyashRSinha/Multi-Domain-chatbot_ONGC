from datetime import datetime

from pydantic import BaseModel


class DomainStats(BaseModel):

    domain: str
    count: int


class RecentConversation(BaseModel):

    id: int
    title: str
    created_at: datetime


class DashboardResponse(BaseModel):

    total_conversations: int
    total_messages: int
    total_documents: int
    documents_per_domain: list[DomainStats]
    recent_conversations: list[RecentConversation]