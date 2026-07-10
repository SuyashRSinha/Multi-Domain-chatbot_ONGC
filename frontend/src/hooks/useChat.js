import { useRef, useState } from "react";
import { streamChat }
    from "../services/chatStreamService";

export function useChat(domain) {

    const [messages,
        setMessages] = useState([
            {
                role: "assistant",
                content:
                    "Hello! I'm your multi-domain enterprise chatbot. How can I assist you today?"
            }
        ]);

    const [loading,
        setLoading] =
        useState(false);

    const abortControllerRef =
        useRef(null);

    const askQuestion = async (
        conversationId,
        question
    ) => {

        if (!question.trim()) {
            return;
        }

        if (!conversationId) {
            return;
        }

        const assistantId =
            Date.now();

        setMessages(prev => [

            ...prev,

            {
                id:
                    Date.now() + 1,
                role: "user",
                content:
                    question
            },

            {
                id:
                    assistantId,
                role:
                    "assistant",
                content: "",
                streaming: true
            }

        ]);

        setLoading(true);

        abortControllerRef.current =
            new AbortController();

        try {

            await streamChat(

                conversationId,

                question,

                domain,

                chunk => {

                    setMessages(prev =>
                        prev.map(
                            message => {

                                if (
                                    message.id ===
                                    assistantId
                                ) {

                                    return {

                                        ...message,

                                        content:
                                            message.content +
                                            chunk

                                    };
                                }

                                return message;

                            }
                        )
                    );

                },

                abortControllerRef.current
                    .signal
            );

            setMessages(prev =>
                prev.map(
                    message => {

                        if (
                            message.id ===
                            assistantId
                        ) {

                            return {
                                ...message,
                                streaming:
                                    false
                            };
                        }

                        return message;

                    }
                )
            );

        } catch (error) {

            if (
                error.name ===
                "AbortError"
            ) {

                console.log(
                    "Streaming stopped."
                );

            } else {

                console.error(error);

                setMessages(prev =>
                    prev.map(
                        message => {

                            if (
                                message.id ===
                                assistantId
                            ) {

                                return {

                                    ...message,

                                    role:
                                        "assistant",

                                    content:
                                        "Unable to generate response.",

                                    streaming:
                                        false
                                };
                            }

                            return message;

                        }
                    )
                );
            }

        } finally {

            setLoading(false);

            abortControllerRef.current =
                null;
        }
    };

    const stopStreaming = () => {

        if (
            abortControllerRef.current
        ) {

            abortControllerRef.current
                .abort();
        }
    };

    return {

        messages,

        setMessages,

        loading,

        askQuestion,

        stopStreaming
    };
}