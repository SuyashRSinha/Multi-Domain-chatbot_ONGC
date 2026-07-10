import { useEffect, useState } from "react";

import {
    createConversation,
    getConversations,
    getMessages,
    renameConversation,
    deleteConversation
} from "../services/conversationService";

import { generateTitle } from "../utils/chatTitle";

export function useConversationManager(
    currentUser,
    domain,
    setMessages
) {
    const [conversations, setConversations] = useState([]);

    const [selectedConversation,
        setSelectedConversation] = useState(null);

    const loadConversations = async () => {

        if (!currentUser) return;

        try {

            const data =
                await getConversations(
                    currentUser.uid
                );

            setConversations(data);

        } catch (error) {

            console.error(error);

        }
    };

    useEffect(() => {

        loadConversations();

    }, [currentUser]);

    const createNewConversation = async () => {

        try {

            const title =
                generateTitle(domain);

            const response =
                await createConversation(
                    currentUser.uid,
                    domain,
                    title
                );

            const conversation = {
                id: response.conversation_id,
                title,
                domain,
                isNew: true
            };

            await loadConversations();

            setSelectedConversation(
                conversation
            );

            setMessages([
                {
                    role: "assistant",
                    content:
                        "Hello! I'm your multi-domain enterprise chatbot. How can I assist you today?"
                }
            ]);

            return conversation;

        } catch (error) {

            console.error(error);

            return null;
        }
    };

    useEffect(() => {

        if (!selectedConversation) {
            return;
        }

        if (
            selectedConversation.isNew
        ) {
            return;
        }

        const loadConversation =
            async () => {

                try {

                    const data =
                        await getMessages(
                            selectedConversation.id
                        );

                    if (
                        data.length === 0
                    ) {

                        setMessages([
                            {
                                role:
                                    "assistant",
                                content:
                                    "Hello! I'm your multi-domain enterprise chatbot. How can I assist you today?"
                            }
                        ]);

                        return;
                    }

                    const formatted =
                        data.map(
                            message => ({
                                role:
                                    message.role,
                                content:
                                    message.content
                            })
                        );

                    setMessages(
                        formatted
                    );

                } catch (error) {

                    console.error(error);

                }

            };

        loadConversation();

    }, [selectedConversation]);

    const renameSelectedConversation =
        async (
            conversationId,
            title
        ) => {

            try {

                await renameConversation(
                    conversationId,
                    title
                );

                await loadConversations();

            } catch (error) {

                console.error(error);

            }
        };

    const deleteSelectedConversation =
        async (
            conversationId
        ) => {

            try {

                await deleteConversation(
                    conversationId
                );

                await loadConversations();

                if (
                    selectedConversation?.id ===
                    conversationId
                ) {

                    setSelectedConversation(
                        null
                    );

                    setMessages([
                        {
                            role:
                                "assistant",
                            content:
                                "Hello! I'm your multi-domain enterprise chatbot. How can I assist you today?"
                        }
                    ]);
                }

            } catch (error) {

                console.error(error);

            }
        };

    return {
        conversations,
        selectedConversation,
        setSelectedConversation,
        createNewConversation,
        renameSelectedConversation,
        deleteSelectedConversation,
        loadConversations
    };
}