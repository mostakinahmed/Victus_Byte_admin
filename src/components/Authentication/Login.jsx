import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../Context Api/AuthContext";
import {
  FiLoader,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiShield,
} from "react-icons/fi";

export default function Login() {
  const { login, loading } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loginLoading, setLoginLoading] = useState(false);
  const [errorInfo, setErrorInfo] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setErrorInfo("");

    try {
      await login(formData.email, formData.password);
      navigate("/");
    } catch (err) {
      if (err.status === 403) setErrorInfo("suspended");
      else if (err.status === 404)
        setErrorInfo("Access Denied: Identity not found.");
      else if (err.status === 401)
        setErrorInfo("Invalid Credentials: Check email or password.");
      else setErrorInfo("System Error: Protocol failed. Try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-6 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">
          Initializing System...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[420px] bg-white rounded-[32px] shadow-2xl shadow-slate-200 border border-slate-200 overflow-hidden relative"
      >
        {/* --- Loading Overlay --- */}
        <AnimatePresence>
          {loginLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center"
            >
              <FiLoader className="text-4xl text-indigo-600 animate-spin" />
              <p className="mt-4 text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                Authenticating...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- Secure Header --- */}
        <div className="bg-slate-900 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500 rounded-lg text-white shadow-lg shadow-indigo-500/20">
              <FiShield size={20} />
            </div>
            <div>
              <h1 className="text-lg font-black text-white tracking-tight uppercase">
                Admin Gateway
              </h1>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">
                Authorized Access Only
              </p>
            </div>
          </div>
          <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
        </div>

        <div className="p-10">
          {/* Logo Section */}
          <div className="flex flex-col items-center -mt-5 mb-15">
            <img
              src="/logo final.png"
              alt="Logo"
              className="h-16 w-auto mix-blend-multiply grayscale contrast-125 opacity-80"
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Admin Email
              </label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="name@victusbyte.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-300 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-300"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Secure Password
              </label>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-300 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {/* Error States */}
            {errorInfo && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-xl border flex items-center gap-3 ${
                  errorInfo === "suspended"
                    ? "bg-amber-50 border-amber-100"
                    : "bg-rose-50 border-rose-100"
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    errorInfo === "suspended" ? "bg-amber-500" : "bg-rose-500"
                  }`}
                />
                <p
                  className={`text-[11px] font-black uppercase tracking-tight ${
                    errorInfo === "suspended"
                      ? "text-amber-700"
                      : "text-rose-600"
                  }`}
                >
                  {errorInfo === "suspended"
                    ? "Access Revoked: Account Suspended"
                    : errorInfo}
                </p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              Sign In to Terminal
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex justify-center">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
            Victus Byte Security Protocol © {new Date().getFullYear()}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
