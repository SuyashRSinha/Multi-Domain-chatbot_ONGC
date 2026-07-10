import { useState } from "react";

function ConversationRow({

    conversation,

    selectedConversation,

    setSelectedConversation,

    onRename,

    onDelete

}) {

    const [editing, setEditing] = useState(false);

    const [title, setTitle] = useState(conversation.title);

    const saveRename = () => {

        if (!title.trim()) return;

        onRename(conversation.id, title);

        setEditing(false);

    };

    return (

        <div
            className={`group flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-slate-100 ${
                selectedConversation?.id === conversation.id
                    ? "bg-blue-100"
                    : ""
            }`}
        >

            {
                editing ? (

                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={saveRename}
                        onKeyDown={(e) => {

                            if (e.key === "Enter") {

                                saveRename();

                            }

                        }}
                        autoFocus
                        className="border rounded px-2 py-1 text-sm w-full"
                    />

                ) : (

                    <div
                        className="flex-1"
                        onClick={() =>
                            setSelectedConversation(conversation)
                        }
                    >

                        💬 {conversation.title}

                    </div>

                )
            }

            <div className="hidden group-hover:flex gap-2 ml-2">

                <button
                    onClick={() => setEditing(true)}
                >
                    ✏
                </button>

                <button
                    onClick={() => onDelete(conversation.id)}
                >
                    🗑
                </button>

            </div>

        </div>

    );

}

export default ConversationRow;