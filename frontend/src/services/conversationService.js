import api from "./api";

export async function createConversation(userUid, domain, title) {

    const response = await api.post(
        "/conversations",
        {
            user_uid: userUid,
            domain,
            title
        }
    );
    
    return response.data;
}

export async function getConversations(userUid) {

    const response = await api.get(
        `/conversations/${userUid}`
    );

    return response.data;
}

export async function getMessages(conversationId) {

    const response = await api.get(
        `/conversations/messages/${conversationId}`
    );

    return response.data;
}

export async function sendMessage(
    conversationId,
    question,
    domain
) {

    const response = await api.post(
        "/conversations/chat",
        {
            conversation_id: conversationId,
            question,
            domain
        }
    );

    return response.data;
}

export async function renameConversation(
    conversationId,
    title
) {

    await api.put(
        `/conversations/${conversationId}`,
        { title }
    );

}

export async function deleteConversation(
    conversationId
) {

    await api.delete(
        `/conversations/${conversationId}`
    );

}