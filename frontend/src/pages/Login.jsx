import { FaGoogle } from "react-icons/fa";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, loginWithGoogle } from "../auth/firebaseAuth";
import { getFirebaseErrorMessage } from "../utils/firebaseErrors";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await loginUser(email, password);
            navigate("/chat");
        }
        catch (err) {
            setError(getFirebaseErrorMessage(err.code));
        }

        finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError("");

        try {

            await loginWithGoogle();
            navigate("/chat");
        }

        catch (err) {
            setError(getFirebaseErrorMessage(err.code));
        }
    };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background spotlights */}
      <div className="absolute top-1/10 left-1/2 -translate-x-1/2 w-110 h-110 bg-purple-400/20 rounded-full blur-[140px] pointer-events-none"></div>
      
      <div className="w-full max-w-md glass-panel rounded-3xl p-8 md:p-10 shadow-2xl border border-white/35 flex flex-col justify-center relative z-10 animate-page-transition">
        
        {/* Branding Logo */}
        <div className="flex items-center gap-2.5 justify-center mb-6">
          <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 via-purple-500 to-pink-500 flex items-center justify-center shadow border border-white/40">
            <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
            </svg>
          </div>
          <span className="text-lg font-black tracking-tight bg-gradient-to-r from-slate-900 to-purple-900 bg-clip-text text-transparent">
            ONGC Chatbot
          </span>
        </div>

        <h2 className="text-2xl font-extrabold text-slate-800 text-center tracking-tight mb-1">
          Welcome Back
        </h2>

        <p className="text-xs text-slate-500 text-center mb-6">
          Login to access your enterprise workspaces
        </p>

        {error && (
          <div className="mb-5 bg-red-50 text-red-600 border border-red-200/50 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm text-center">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block mb-1.5 font-bold text-slate-600 text-[10px] uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full bg-white/40 border border-white/40 focus:border-purple-400 focus:bg-white/60 focus:ring-0 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none transition duration-150 shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block mb-1.5 font-bold text-slate-600 text-[10px] uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/40 border border-white/40 focus:border-purple-400 focus:bg-white/60 focus:ring-0 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none transition duration-150 shadow-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg hover:shadow-purple-500/10 text-white font-bold py-3 rounded-xl transition duration-200 active:scale-[0.98] disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed cursor-pointer text-xs flex items-center justify-center"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="my-5 flex items-center">
          <div className="flex-1 border-t border-purple-200/30"></div>
          <span className="px-3 text-[10px] font-bold text-slate-400 tracking-widest">
            OR
          </span>
          <div className="flex-1 border-t border-purple-200/30"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full border border-white/40 bg-white/40 hover:bg-white/60 transition py-2.5 rounded-xl flex justify-center items-center gap-2 text-xs font-semibold shadow-sm cursor-pointer"
        >
          <FaGoogle className="text-red-500 text-sm" />
          Continue with Google
        </button>

        <p className="mt-6 text-center text-xs text-slate-500">
          Don't have an account?
          <Link
            to="/register"
            className="text-purple-600 hover:text-purple-700 font-bold ml-1.5 transition"
          >
            Register here
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;