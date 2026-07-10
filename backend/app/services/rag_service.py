from app.repositories.conversation_repository import (
    ConversationRepository
)

from app.services.retrieval_service import (
    RetrievalService
)

from app.services.context_builder import (
    build_context
)

from app.services.prompt_builder import (
    build_prompt
)

from app.services.llm_service import (
    LLMService
)

from app.services.source_builder import (
    build_source
)

from app.services.history_formatter import (
    format_history
)

from app.services.query_rewriter import (
    QueryRewriter
)


class RAGService:

    def __init__(self):

        self.query_rewriter = QueryRewriter()

        self.repository = ConversationRepository()

        self.retrieval_service = RetrievalService()

        self.llm_service = LLMService()

    def ask(
            self,
            question: str,
            domain: str,
            conversation_id: int = None
    ):

        history = ""
        if conversation_id is not None:
            messages = self.repository.get_messages(
                conversation_id
            )
            history = format_history(messages)

        print("\n========== HISTORY ==========")
        print(history)
        print("=============================\n")

        if conversation_id is not None and history and self.needs_rewrite(question):

            rewritten_question = (
                self.query_rewriter.rewrite(
                    history=history,
                    question=question
                )
            )

        else:

            rewritten_question = question

        print("\n====== REWRITTEN QUESTION ======")
        print(rewritten_question)
        print("================================\n")

        results = self.retrieval_service.retrieve(
            question=rewritten_question,
            domain=domain,
            n_results=5
        )

        print("\n====== RETRIEVED CHUNKS ======")

        for i, item in enumerate(
                results,
                start=1
        ):

            print(f"\nChunk {i}")

            print(
                f"Distance : {item['distance']}"
            )

            print(
                item["document"][:400]
            )

        print("\n================================\n")

        if len(results) == 0:

            return (
                "I couldn't find this "
                "information in the "
                "uploaded documents."
            )

        context = build_context(results)

        sources = build_source(results)

        prompt = build_prompt(
            context=context,
            question=rewritten_question
        )

        answer = self.llm_service.generate(
            prompt
        )

        if sources:

            answer += "\n\nSources:\n"

            for source in sources:

                answer += (
                    f"- {source}\n"
                )

        return answer

    def needs_rewrite(
            self,
            question: str
    ):

        follow_up_words = {

            "it",
            "they",
            "this",
            "that",
            "these",
            "those",
            "he",
            "she",
            "him",
            "her",
            "his",
            "hers",
            "them",
            "its",
            "their",
            "theirs"

        }

        words = (
            question
            .lower()
            .replace("?", "")
            .split()
        )

        return any(

            word in follow_up_words

            for word in words

        )

    def stream_answer(
            self,
            conversation_id: int,
            question: str,
            domain: str
    ):

        messages = self.repository.get_messages(
            conversation_id
        )

        history = format_history(
            messages
        )

        if self.needs_rewrite(question):

            rewritten_question = (
                self.query_rewriter.rewrite(
                    history=history,
                    question=question
                )
            )

        else:

            rewritten_question = question

        results = (
            self.retrieval_service.retrieve(
                question=rewritten_question,
                domain=domain,
                n_results=5
            )
        )

        if len(results) == 0:

            response = (
                "I couldn't find this "
                "information in the "
                "uploaded documents."
            )

            yield response

            self.repository.save_message(
                conversation_id,
                "assistant",
                response
            )

            self.repository.update_last_activity(
                conversation_id
            )

            return

        context = build_context(
            results
        )

        prompt = build_prompt(
            context=context,
            question=rewritten_question
        )

        full_answer = ""

        for chunk in (
            self.llm_service
            .stream_generate(prompt)
        ):

            full_answer += chunk

            yield chunk

        sources = build_source(
            results
        )

        if sources:

            source_text = (
                "\n\nSources:\n"
            )

            for source in sources:

                source_text += (
                    f"- {source}\n"
                )

            full_answer += source_text

            yield source_text

        self.repository.save_message(
            conversation_id,
            "assistant",
            full_answer
        )

        self.repository.update_last_activity(
            conversation_id
        )