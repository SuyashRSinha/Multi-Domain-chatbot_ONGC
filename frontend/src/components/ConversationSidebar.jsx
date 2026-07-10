import { useState } from "react";

import {
    renameConversation,
    deleteConversation
} from "../services/conversationService";

function ConversationSidebar({
    conversations,
    selectedConversation,
    setSelectedConversation,
    createNewConversation,
    loadConversations
}) {
    const [editingId, setEditingId] = useState(null);
    const [newTitle, setNewTitle] = useState("");

    const handleRename = async (conversationId) => {
        if (!newTitle.trim()) {
            setEditingId(null);
            return;
        }

        try {
            await renameConversation(
                conversationId,
                newTitle
            );
            await loadConversations();
            setEditingId(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (conversationId) => {
        const confirmDelete = window.confirm(
            "Delete this conversation?"
        );
        if (!confirmDelete) return;

        try {
            await deleteConversation(
                conversationId
            );
            await loadConversations();
            if (selectedConversation?.id === conversationId) {
                setSelectedConversation(null);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="w-68 border-r border-white/25 bg-white/15 flex flex-col min-h-0 backdrop-blur-md">
            {/* New Chat Button */}
            <button
                onClick={createNewConversation}
                className="m-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl py-2.5 font-bold hover:shadow-lg hover:shadow-purple-500/20 active:scale-[0.98] transition duration-200 cursor-pointer text-xs flex items-center justify-center gap-1.5"
            >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                New Chat
            </button>

            {/* Conversation List */}
            <div className="overflow-y-auto flex-1 px-2 space-y-1">
                {conversations.map((conversation) => (
                    <div
                        key={conversation.id}
                        className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl transition duration-150 cursor-pointer text-xs
                        ${selectedConversation?.id === conversation.id
                            ? "bg-white/40 border border-white/30 text-purple-900 font-bold shadow-sm"
                            : "text-slate-600 hover:bg-white/20 hover:text-slate-800 border border-transparent"
                        }`}
                    >
                        {editingId === conversation.id ? (
                            <input
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                onBlur={() => handleRename(conversation.id)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleRename(conversation.id);
                                    }
                                }}
                                autoFocus
                                className="border border-purple-300 rounded px-2 py-1 text-xs w-full bg-white outline-none focus:ring-1 focus:ring-purple-400"
                            />
                        ) : (
                            <div
                                className="flex-1 flex items-center gap-2 truncate pr-1"
                                onClick={() => setSelectedConversation(conversation)}
                                onDoubleClick={() => {
                                    setEditingId(conversation.id);
                                    setNewTitle(conversation.title);
                                }}
                            >
                                <svg className="w-4 h-4 text-slate-400 flex-shrink-0 group-hover:text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <span className="truncate">{conversation.title}</span>
                            </div>
                        )}

                        {editingId !== conversation.id && (
                            <div className="hidden group-hover:flex items-center gap-1.5 ml-2 flex-shrink-0">
                                <button
                                    onClick={() => {
                                        setEditingId(conversation.id);
                                        setNewTitle(conversation.title);
                                    }}
                                    className="p-1 hover:bg-purple-100 hover:text-purple-600 rounded transition cursor-pointer"
                                    title="Rename"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => handleDelete(conversation.id)}
                                    className="p-1 hover:bg-red-50 hover:text-red-600 rounded transition cursor-pointer"
                                    title="Delete"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ConversationSidebar;