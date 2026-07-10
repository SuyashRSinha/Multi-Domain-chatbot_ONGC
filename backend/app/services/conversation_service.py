from app.repositories.conversation_repository import ConversationRepository
from app.services.rag_service import RAGService


class ConversationService:

    def __init__(self):

        self.repository = ConversationRepository()

        self.rag_service = RAGService()


    def create_conversation(
        self,
        user_uid: str,
        domain: str,
        title: str
    ):

        return self.repository.create_conversation(
            user_uid=user_uid,
            domain=domain,
            title=title
        )


    def get_user_conversations(
        self,
        user_uid: str
    ):

        return self.repository.get_user_conversations(
            user_uid=user_uid
        )


    def get_messages(
        self,
        conversation_id: int
    ):

        return self.repository.get_messages(
            conversation_id
        )


    def rename_conversation(
        self,
        conversation_id: int,
        title: str
    ):

        self.repository.update_title(
            conversation_id,
            title
        )


    def delete_conversation(
        self,
        conversation_id: int
    ):

        self.repository.delete_conversation(
            conversation_id
        )

    def chat(
            self,
            conversation_id: int,
            question: str,
            domain: str
    ):
        
        self.repository.save_message(
            conversation_id,
            "user",
            question
        )

        messages = self.repository.get_messages(
            conversation_id 
        )

        if len(messages) == 1:
            title = question.strip()

            if len(title) > 40:
                title = title[:40] + "..."

            self.repository.update_title(
                conversation_id,
                title
            )

        answer = self.rag_service.ask(
             conversation_id=conversation_id,
             question=question,
             domain=domain
        )

        print("answer: ", answer)
        self.repository.save_message(
            conversation_id,
            "assistant",
            answer
        )

        self.repository.update_last_activity(
            conversation_id
        )

        return answer
    
    def stream_chat(
            self,
            conversation_id: int,
            question: str,
            domain: str
    ):
        
        self.repository.save_message(
            conversation_id,
            "user",
            question
        )

        messages = self.repository.get_messages(
            conversation_id 
         )
        
        if len(messages) == 1:
            title=question.strip()

            if len(title) > 40:
                title = title[:40] + "..."
            
            self.repository.update_title(
                conversation_id,
                title
            )
        
        
        for chunk in self.rag_service.stream_answer(
            conversation_id=conversation_id,
            question=question,
            domain=domain
        ):
            yield chunk