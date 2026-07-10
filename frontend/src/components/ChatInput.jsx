import { useRef } from "react";
import { stopStreaming } from "../services/chatStreamService";

function ChatInput({
    question,
    setQuestion,
    askQuestion,
    handleKeyDown,
    loading,
    onUploadFile,
}) {
    const fileInputRef = useRef(null);

    return (
        <div className="glass-input-container rounded-full py-2 px-3.5 flex items-center gap-3 w-full shadow-lg">
            {/* Hidden File Input for in-input document uploads */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                        onUploadFile(e.target.files[0]);
                    }
                    // Reset input so uploading the same file again triggers change event
                    e.target.value = "";
                }}
                accept=".pdf,.doc,.docx,.txt,.csv"
                className="hidden"
            />

            {/* Left Control: Attach */}
            <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-full hover:bg-white/20 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer flex-shrink-0"
                title="Attach files"
            >
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>

            {/* Input Field */}
            <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                disabled={loading}
                className="flex-1 bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm py-1 px-1 focus:ring-0 focus:border-transparent"
            />

            {/* Right Controls: Audio wave & Send */}
            <div className="flex items-center gap-2.5 flex-shrink-0">
                {/* Audio wave icon */}
                <button 
                    type="button"
                    className="p-2 rounded-full hover:bg-white/20 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer"
                    title="Voice search"
                >
                    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <line x1="4" y1="10" x2="4" y2="14" />
                        <line x1="8" y1="6" x2="8" y2="18" />
                        <line x1="12" y1="3" x2="12" y2="21" />
                        <line x1="16" y1="8" x2="16" y2="16" />
                        <line x1="20" y1="11" x2="20" y2="13" />
                    </svg>
                </button>

                {/* Circular Gradient Send/Stop Button */}
                <button
                    type="button"
                    onClick={loading ? stopStreaming : askQuestion}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md transition duration-200 cursor-pointer ${
                        loading
                            ? "bg-red-500 hover:bg-red-600 shadow-red-500/25 animate-pulse"
                            : "bg-gradient-to-tr from-purple-600 via-purple-500 to-pink-500 hover:shadow-purple-500/20 hover:scale-105"
                    }`}
                >
                    {loading ? (
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <rect x="4" y="4" width="16" height="16" rx="2" />
                        </svg>
                    ) : (
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
}

export default ChatInput;