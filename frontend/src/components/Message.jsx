function Message({
    role,
    content,
    streaming
}) {
    const isAssistant = role === "assistant";

    return (
        <div
            className={`flex items-end gap-3 mb-6 ${
                isAssistant ? "justify-start" : "justify-end"
            }`}
        >
            {/* Avatar for Assistant */}
            {isAssistant && (
                <div className="flex-shrink-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 via-purple-500 to-pink-500 flex items-center justify-center shadow border border-white/40">
                        <svg className="w-5 h-5 text-white animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 3l8.5 4.9v9.8L12 21l-8.5-4.9V7.9z" />
                            <polyline points="12 3 12 12 20.5 7" />
                            <polyline points="12 12 3.5 7" />
                            <polyline points="12 12 12 21" />
                        </svg>
                    </div>
                </div>
            )}

            {/* Bubble */}
            <div
                className={`max-w-[70%] rounded-[20px] px-5 py-3.5 shadow-sm text-sm border transition duration-200 ${
                    isAssistant
                        ? "bg-white/60 backdrop-blur-md border-white/40 text-slate-800 rounded-bl-xs"
                        : "bg-gradient-to-tr from-purple-600 to-indigo-600 text-white border-purple-500 rounded-br-xs"
                }`}
            >
                <div className={`text-[10px] font-bold tracking-wider uppercase mb-1.5 opacity-60 ${
                    isAssistant ? "text-purple-900" : "text-purple-100"
                }`}>
                    {isAssistant ? "Assistant" : "You"}
                </div>

                {streaming && content === "" ? (
                    <div className="flex gap-1.5 py-1 items-center">
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></span>
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }}></span>
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}></span>
                    </div>
                ) : (
                    <div className="whitespace-pre-wrap leading-relaxed">
                        {content}
                    </div>
                )}
            </div>

            {/* Avatar for User */}
            {!isAssistant && (
                <div className="flex-shrink-0">
                    <div className="w-9 h-9 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center shadow text-slate-600 font-bold text-sm">
                        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Message;
