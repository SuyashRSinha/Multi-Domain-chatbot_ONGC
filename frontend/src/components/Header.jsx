import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../auth/firebaseAuth";
import { useAuth } from "../contexts/AuthContext";

function Header({ activeTab, setActiveTab }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const [theme, setTheme] = useState(() => {
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  });

  const toggleTheme = () => {
    if (theme === "light") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setTheme("light");
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const handleTabClick = (tab) => {
    if (location.pathname !== "/chat") {
      navigate("/chat", { state: { defaultTab: tab } });
    } else if (setActiveTab) {
      setActiveTab(tab);
    }
  };

  const userEmail = currentUser?.email || "";
  const avatarLetter = userEmail ? userEmail.charAt(0).toUpperCase() : "?";

  return (
    <header className="glass-panel sticky top-0 z-50 text-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex justify-between items-center">
        
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/chat")}>
          <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <svg className="w-5 h-5 text-white animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3l8.5 4.9v9.8L12 21l-8.5-4.9V7.9z" />
              <polyline points="12 3 12 12 20.5 7" />
              <polyline points="12 12 3.5 7" />
              <polyline points="12 12 12 21" />
            </svg>
            <div className="absolute inset-0 rounded-full border border-white/20 pointer-events-none"></div>
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-purple-900 bg-clip-text text-transparent">
            ONGC Chatbot
          </span>
        </div>

        {/* Middle Links (Training Data, Instant Chat, etc.) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500">
          <button
            onClick={() => handleTabClick("training")}
            className={`transition-colors py-1 cursor-pointer ${
              activeTab === "training" && location.pathname === "/chat"
                ? "text-purple-600 border-b-2 border-purple-500 font-bold"
                : "hover:text-slate-800"
            }`}
          >
            Training Data
          </button>
          
          <button
            onClick={() => handleTabClick("chat")}
            className={`flex items-center gap-1.5 transition-colors py-1 cursor-pointer ${
              (activeTab === "chat" || location.pathname !== "/chat") && location.pathname === "/chat"
                ? "text-purple-600 border-b-2 border-purple-500 font-bold"
                : "hover:text-slate-800"
            }`}
          >
            {activeTab === "chat" && location.pathname === "/chat" && (
              <svg className="w-4 h-4 text-purple-500 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C8.8 12.1 8 10.61 8 9c0-2.21 1.79-4 4-4s4 1.79 4 4c0 1.61-.8 3.1-2.15 4.1z"/>
              </svg>
            )}
            Instant Chat
          </button>
        </nav>

        {/* Right Elements (Search capsule, Notifications, Profile) */}
        <div className="flex items-center gap-4">
          
          {/* Dashboard switch helper link */}
          {location.pathname !== "/dashboard" && (
            <button
              onClick={() => navigate("/dashboard")}
              className="text-xs font-semibold px-3 py-1.5 rounded-full border border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100 transition"
            >
              Dashboard
            </button>
          )}

          {/* Search Capsule */}
          <div className="hidden lg:flex items-center gap-2 bg-white/30 border border-white/40 rounded-full px-4 py-1.5 text-xs text-slate-700 w-48 shadow-inner">
            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent border-none outline-none w-full text-slate-800 placeholder-slate-500" 
            />
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-white/20 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition cursor-pointer"
            title="Toggle theme"
          >
            {theme === "dark" ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            )}
          </button>

          {/* Notification bell */}
          <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition relative cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-purple-500 rounded-full animate-ping"></span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 hover:opacity-95 focus:outline-none transition cursor-pointer"
            >
              <div className="w-8.5 h-8.5 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 text-white font-bold flex items-center justify-center text-sm shadow border border-white/50">
                {avatarLetter}
              </div>
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-3 w-64 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md rounded-2xl shadow-2xl text-slate-800 dark:text-slate-200 overflow-hidden z-50 border border-white/50 dark:border-slate-800/80 animate-page-transition">
                <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
                  <p className="font-bold text-sm text-purple-900 dark:text-purple-300 truncate capitalize">
                    {userEmail.split("@")[0]}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {userEmail}
                  </p>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-red-50/30 dark:hover:bg-red-950/20 transition font-semibold cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}

export default Header;