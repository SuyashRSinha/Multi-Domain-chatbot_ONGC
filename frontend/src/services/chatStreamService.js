let controller = null;
export function stopStreaming() {

    if (controller) {

        controller.abort();
    }
}

export async function streamChat(

    conversationId,

    question,

    domain,

    onChunk

) {

    const response = await fetch(

        "http://localhost:8000/api/v1/conversations/chat/stream",

        {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                conversation_id: conversationId,

                question,

                domain

            })

        }

    );

    if (!response.ok) {

        throw new Error("Streaming request failed.");

    }

    const reader = response.body.getReader();

    const decoder = new TextDecoder();

    while (true) {

        const { done, value } = await reader.read();

        if (done) break;

        onChunk(

            decoder.decode(

                value,

                {

                    stream: true

                }

            )

        );

    }

    controller = null;

}