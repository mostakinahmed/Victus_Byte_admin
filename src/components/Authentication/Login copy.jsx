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
      if (err?.status === 403) setErrorInfo("Account Suspended");
      else if (err?.status === 404)
        setErrorInfo("Access Denied: Identity not found");
      else if (err?.status === 401) setErrorInfo("Invalid Credentials");
      else setErrorInfo("System Error: Try again");
    } finally {
      setLoginLoading(false);
    }
  };

  /* -------- Initial Auth Loading -------- */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="mt-6 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">
          Initializing System...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/40 to-slate-100 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[420px] bg-white/90 backdrop-blur-xl rounded-3xl 
        shadow-[0_30px_80px_-20px_rgba(0,0,0,0.15)] border border-slate-200 
        overflow-hidden relative"
      >
        {/* -------- Login Loading Overlay -------- */}
        <AnimatePresence>
          {loginLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-white/70 backdrop-blur-md flex flex-col items-center justify-center"
            >
              <FiLoader className="text-4xl text-indigo-600 animate-spin" />
              <motion.p
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="mt-4 text-[10px] font-black text-indigo-600 uppercase tracking-widest"
              >
                Authenticating...
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* -------- Header -------- */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-8 py-6 flex items-center justify-between relative">
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-500/30">
              <FiShield size={20} />
            </div>
            <div>
              <h1 className="text-lg font-black text-white uppercase tracking-tight">
                Admin Gateway
              </h1>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                Authorized Access Only
              </p>
            </div>
          </div>

          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
        </div>

        {/* -------- Body -------- */}
        <div className="p-10">
          {/* Logo */}
          <div className="flex justify-center -mt-6 mb-8">
            <img
              src="/logo final.png"
              alt="Logo"
              className="h-16 w-auto opacity-90"
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Admin Email
              </label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500" />
                <input
                  type="email"
                  name="email"
                  autoFocus
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="admin@victusbyte.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-300 rounded 
                  text-sm font-medium text-slate-700 outline-none 
                  focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 
                  hover:border-slate-400 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Secure Password
              </label>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3.5 bg-white border border-slate-200 rounded
                  text-sm font-semibold text-slate-700 outline-none 
                  focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 
                  hover:border-slate-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorInfo && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-rose-50 border border-rose-100 flex items-center gap-3"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <p className="text-[11px] font-black uppercase text-rose-600">
                  {errorInfo}
                </p>
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 
              hover:from-indigo-700 hover:to-indigo-600 text-white rounded-2xl 
              font-black text-[11px] uppercase tracking-[0.25em] 
              shadow-[0_20px_40px_-15px_rgba(79,70,229,0.6)] 
              transition-all active:scale-[0.97] disabled:opacity-50"
            >
              Sign In to Terminal
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex justify-center">
          <p className="text-[9px] font-semibold text-slate-400 tracking-widest">
            Victus Byte Security Protocol © {new Date().getFullYear()}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
