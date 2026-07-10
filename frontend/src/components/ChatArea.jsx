import { useEffect, useRef } from "react";
import Message from "./Message";

function ChatArea({ messages }) {

    const bottomRef = useRef(null);

    useEffect(() => {

        bottomRef.current?.scrollIntoView({

            behavior: "smooth"

        });

    }, [messages]);

    return (

        <div
            className="
                flex-1
                overflow-y-auto
                px-2
                py-4
                space-y-5
                bg-transparent
            "
        >

            {

                messages.map(

                    (message, index) => (

                        <Message

                            key={index
                            }

                            role={
                                message.role
                            }

                            content={
                                message.content
                            }
                            streaming={
                                message.streaming
                            }

                        />

                    )

                )

            }

            <div ref={bottomRef}></div>

        </div>

    );

}

export default ChatArea;