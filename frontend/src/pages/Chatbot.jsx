import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import Header from "../components/Header";
import DomainSelector from "../components/DomainSelector";
import ChatArea from "../components/ChatArea";
import ChatInput from "../components/ChatInput";
import UploadDocument from "../components/UploadDocument";
import DocumentList from "../components/DocumentList";
import ConversationSidebar from "../components/ConversationSidebar";

import { useAuth } from "../contexts/AuthContext";

import { useChat } from "../hooks/useChat";
import { useDocuments } from "../hooks/useDocuments";
import { useConversationManager } from "../hooks/useConversationManager";
import { uploadDocument } from "../services/uploadService";

function Chatbot() {
    const { currentUser } = useAuth();
    const location = useLocation();

    const [domain, setDomain] = useState("hr_documents");
    const [question, setQuestion] = useState("");
    const [activeTab, setActiveTab] = useState("chat");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleUploadFile = async (file) => {
        if (!file) return;
        try {
            alert(`Uploading "${file.name}" to workspace...`);
            const response = await uploadDocument(file, domain, currentUser.uid);
            alert(`Success: ${response.message}`);
            loadDocuments();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.detail || "Upload failed.");
        }
    };

    // Handle initial redirection tab state if passed from dashboard
    useEffect(() => {
        if (location.state?.defaultTab && location.state.defaultTab !== activeTab) {
            setActiveTab(location.state.defaultTab);
        }
    }, [location.state, activeTab]);

    const {
        messages,
        setMessages,
        loading,
        askQuestion,
        stopStreaming
    } = useChat(domain);

    const {
        documents,
        loadDocuments
    } = useDocuments();

    const {
        conversations,
        selectedConversation,
        setSelectedConversation,
        createNewConversation,
        loadConversations
    } = useConversationManager(
        currentUser,
        domain,
        setMessages
    );

    const sendMessage = async () => {
        if (!question.trim()) {
            return;
        }

        let conversation = selectedConversation;

        if (!conversation) {
            conversation = await createNewConversation();
            if (!conversation) {
                return;
            }
            setSelectedConversation(conversation);
        }

        const currentQuestion = question;
        setQuestion("");

        await askQuestion(
            conversation.id,
            currentQuestion
        );
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !loading) {
            sendMessage();
        }
    };

    // Pre-populate input on pill clicks
    const handlePillClick = (text) => {
        setQuestion(text);
    };

    return (
        <div className="h-screen flex flex-col bg-transparent overflow-hidden">
            <Header activeTab={activeTab} setActiveTab={setActiveTab} />

            <main className="max-w-7xl w-full mx-auto px-6 py-4 flex-1 flex flex-col min-h-0 justify-center relative">
                {/* Chat Panel Container with smooth absolute transition */}
                <div className={`flex-1 min-h-0 flex flex-col transition-all duration-500 ease-in-out ${
                    activeTab === "chat" 
                        ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" 
                        : "opacity-0 translate-y-3 scale-98 pointer-events-none absolute inset-x-6 top-4 bottom-4"
                }`}>
                    <div className="glass-panel rounded-3xl flex-1 min-h-0 flex overflow-hidden shadow-2xl border border-white/30">
                        {/* Conversations Sidebar wrapper */}
                        <div className={`md:flex flex-col min-h-0 flex-shrink-0 w-68 border-r border-white/25 bg-white/15 backdrop-blur-md transition-all duration-300 ease-in-out ${
                            sidebarOpen 
                                ? "flex fixed md:relative z-30 left-0 top-0 bottom-0 h-full shadow-2xl bg-white/95 dark:bg-slate-950/95 border-r border-white/20" 
                                : "hidden md:flex"
                        }`}>
                            <ConversationSidebar
                                conversations={conversations}
                                selectedConversation={selectedConversation}
                                setSelectedConversation={setSelectedConversation}
                                createNewConversation={createNewConversation}
                                loadConversations={loadConversations}
                                onItemClick={() => setSidebarOpen(false)}
                            />
                        </div>

                        {/* Backdrop overlay for mobile */}
                        {sidebarOpen && (
                            <div 
                                className="md:hidden fixed inset-0 bg-black/40 z-20 backdrop-blur-sm transition-opacity duration-300"
                                onClick={() => setSidebarOpen(false)}
                            />
                        )}

                        {/* Chat Panel */}
                        <div className="flex-1 px-6 py-3.5 md:px-8 md:py-4 flex flex-col min-h-0 bg-white/10 relative">
                            {/* Domain Selector Cap */}
                            <div className="flex justify-between items-center mb-2.5 z-10 gap-3">
                                <div className="flex items-center gap-2">
                                    {/* Sidebar Mobile Toggle */}
                                    <button
                                        onClick={() => setSidebarOpen(!sidebarOpen)}
                                        className="md:hidden p-2 rounded-xl bg-white/20 hover:bg-white/40 border border-white/30 text-purple-900 dark:text-purple-300 cursor-pointer transition active:scale-95 flex items-center justify-center flex-shrink-0"
                                        title="Toggle conversation list"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                        </svg>
                                    </button>
                                    <DomainSelector
                                        domain={domain}
                                        setDomain={setDomain}
                                        documents={documents}
                                    />
                                </div>
                                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-white/40 dark:bg-white/10 border border-white/40 dark:border-white/10 px-3 py-0.5 rounded-full shadow-sm capitalize truncate max-w-[150px] sm:max-w-none">
                                    Domain: {domain.replace("_", " ")}
                                </div>
                            </div>

                            {/* Conditional main content area: Welcome Hero OR Chat History */}
                            {messages.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center my-auto max-w-2xl mx-auto z-10">
                                    {/* Logo */}
                                    <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-purple-500/30 mb-6">
                                        <svg className="w-10 h-10 text-white animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 3l8.5 4.9v9.8L12 21l-8.5-4.9V7.9z" />
                                            <polyline points="12 3 12 12 20.5 7" />
                                            <polyline points="12 12 3.5 7" />
                                            <polyline points="12 12 12 21" />
                                        </svg>
                                        <div className="absolute inset-0 rounded-full border-2 border-white/20 pointer-events-none pulse-glow"></div>
                                    </div>

                                    {/* Text header matching screenshot */}
                                    <h2 className="text-3.5xl font-extrabold text-slate-900 dark:text-white leading-tight mb-2 tracking-tight">
                                        Hi, I'm ONGC Chatbot
                                    </h2>
                                    <p className="text-base font-semibold text-slate-500 dark:text-slate-400 mb-8">
                                        How can I help you today?
                                    </p>

                                    {/* Bottom container for Input and pills */}
                                    <div className="w-full max-w-2xl">
                                        <ChatInput
                                            question={question}
                                            setQuestion={setQuestion}
                                            askQuestion={sendMessage}
                                            handleKeyDown={handleKeyDown}
                                            loading={loading}
                                            stopStreaming={stopStreaming}
                                            onUploadFile={handleUploadFile}
                                        />

                                        {/* Quick Action Pills matching screenshot */}
                                        <div className="flex flex-wrap items-center justify-center gap-2.5 mt-5">
                                            <button 
                                                onClick={() => handlePillClick("Explain this project details briefly.")}
                                                className="glass-pill hover:glass-pill-active px-4 py-2 text-xs font-semibold text-slate-600 rounded-full flex items-center gap-1.5 transition duration-200 cursor-pointer"
                                            >
                                                <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                                </svg>
                                                Fast
                                            </button>
                                            <button 
                                                onClick={() => handlePillClick("Generate a detailed summary report.")}
                                                className="glass-pill hover:glass-pill-active px-4 py-2 text-xs font-semibold text-slate-600 rounded-full flex items-center gap-1.5 transition duration-200 cursor-pointer"
                                            >
                                                <svg className="w-3.5 h-3.5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                </svg>
                                                In-depth
                                            </button>
                                            <button 
                                                onClick={() => handlePillClick("Analyze trends in the uploaded dataset.")}
                                                className="glass-pill hover:glass-pill-active px-4 py-2 text-xs font-semibold text-slate-600 rounded-full flex items-center gap-1.5 transition duration-200 cursor-pointer"
                                            >
                                                <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.033 1.41l-4.586 4.586a1 1 0 01-1.414 0L4.316 7.051a1 1 0 011.414-1.414l1.629 1.63 3.879-3.879a1 1 0 011.414-.38z" clipRule="evenodd" />
                                                    <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                                </svg>
                                                Analytical
                                            </button>
                                            <button 
                                                onClick={() => handlePillClick("Provide a holistic overview of documents.")}
                                                className="glass-pill hover:glass-pill-active px-4 py-2 text-xs font-semibold text-slate-600 rounded-full flex items-center gap-1.5 transition duration-200 cursor-pointer"
                                            >
                                                <svg className="w-3.5 h-3.5 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2H4a1 1 0 110-2V4zm3 1h6v4H7V5zm6 6H7v2h6v-2z" clipRule="evenodd" />
                                                </svg>
                                                Holistic
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col min-h-0 z-10">
                                    <ChatArea messages={messages} />
                                    <div className="mt-2">
                                        <ChatInput
                                            question={question}
                                            setQuestion={setQuestion}
                                            askQuestion={sendMessage}
                                            handleKeyDown={handleKeyDown}
                                            loading={loading}
                                            stopStreaming={stopStreaming}
                                            onUploadFile={handleUploadFile}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Training Tab Container with smooth absolute transition */}
                <div className={`flex-1 min-h-0 flex flex-col transition-all duration-500 ease-in-out ${
                    activeTab === "training" 
                        ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" 
                        : "opacity-0 translate-y-3 scale-98 pointer-events-none absolute inset-x-6 top-4 bottom-4"
                }`}>
                    {/* Training Data view (Side by side glass panels for laptop screen) */}
                    <div className="flex-1 min-h-0 flex flex-col gap-5">
                        {/* Domain Selector inside Data Section */}
                        <div className="flex justify-between items-center z-10 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2.5 rounded-2xl shadow-sm">
                            <DomainSelector
                                domain={domain}
                                setDomain={setDomain}
                                documents={documents}
                            />
                            <div className="text-xs font-semibold text-slate-500 bg-white/40 border border-white/40 px-3 py-1.5 rounded-full shadow-sm capitalize">
                                Domain: {domain.replace("_", " ")}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:flex-1 lg:min-h-0 overflow-y-auto lg:overflow-hidden pb-8 lg:pb-0">
                            <div className="lg:col-span-5 glass-panel rounded-3xl p-6 md:p-8 shadow-xl border border-white/30 overflow-y-auto">
                                <UploadDocument
                                    domain={domain}
                                    loadDocuments={loadDocuments}
                                />
                            </div>
                            <div className="lg:col-span-7 glass-panel rounded-3xl p-6 md:p-8 shadow-xl border border-white/30 flex flex-col min-h-0 overflow-hidden">
                                <DocumentList
                                    documents={documents}
                                    domain={domain}
                                    loadDocuments={loadDocuments}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Chatbot;