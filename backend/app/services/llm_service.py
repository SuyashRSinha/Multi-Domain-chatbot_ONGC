from ollama import chat


class LLMService:

    def __init__(self):

        self.model = "llama3"

    def generate(self, prompt: str):

        response = chat(
            model=self.model,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        return response["message"]["content"]
    
    def stream_generate(self, prompt: str):


        stream = chat(
            model=self.model,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            stream=True
        )

        for chunk in stream:
            yield chunk["message"]["content"]