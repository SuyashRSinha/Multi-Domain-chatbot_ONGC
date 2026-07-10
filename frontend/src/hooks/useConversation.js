import { useEffect, useState } from "react";

import {

    createConversation,

    getConversations,

    getMessages,

    renameConversation,

    deleteConversation

} from "../services/conversationService";

import { generateTitle } from "../utils/chatTitle";

export function useConversation(

    currentUser,

    domain

) {

    const [conversations, setConversations] = useState([]);

    const [selectedConversation, setSelectedConversation] =
        useState(null);

    const [messages, setMessages] = useState([]);

    const loadConversations = async () => {

        if (!currentUser) return;

        try {

            const data = await getConversations(
                currentUser.uid
            );

            setConversations(data);

        }

        catch (error) {

            console.error(error);

        }

    };

    useEffect(() => {

        loadConversations();

    }, [currentUser]);

    const createNewConversation = async () => {

        const response = await createConversation(

            currentUser.uid,

            domain,

            generateTitle(domain)

        );

        await loadConversations();

        const newConversation = {

            id: response.conversation_id,

            title: generateTitle(domain),

            domain

        };

        setSelectedConversation(newConversation);

        setMessages([
            {
                role: "assistant",
                content:
                    "Hello! I'm your multi-domain enterprise chatbot. How can I assist you today?"
            }
        ]);
    };

    const openConversation = async (conversation) => {

        setSelectedConversation(conversation);

        const data = await getMessages(
            conversation.id
        );

        setMessages(

            data.map(message => ({

                role: message.role,

                content: message.content

            }))

        );

    };

    return {

        conversations,

        selectedConversation,

        setSelectedConversation,

        messages,

        setMessages,

        createNewConversation,

        openConversation,

        renameConversation,

        deleteConversation,

        reloadConversations: loadConversations

    };

}