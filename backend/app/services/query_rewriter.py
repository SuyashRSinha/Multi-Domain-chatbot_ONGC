from app.services.llm_service import LLMService


class QueryRewriter:

    def __init__(self):

        self.llm = LLMService()

    def rewrite(
        self,
        history: str,
        question: str
    ):

        prompt = f"""
You are an enterprise RAG query rewriting assistant.

Your ONLY job is to convert follow-up questions into standalone questions.

Rules:
1. If the current question is already complete and understandable by itself, return it EXACTLY as it is.
2. Do NOT paraphrase.
3. Do NOT improve grammar.
4. Do NOT summarize.
5. Do NOT answer the question.
6. Only replace pronouns such as:
   - it
   - they
   - this
   - that
   - these
   - those
7. Return ONLY the rewritten question.
8. Do not include explanations or quotation marks.

Conversation History:
{history}

Current Question:
{question}

Standalone Question:
"""

        rewritten = self.llm.generate(prompt)

        return rewritten.strip()