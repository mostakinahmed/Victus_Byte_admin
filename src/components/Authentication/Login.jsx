import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context Api/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
  // --- AUTH LOGIC ---
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa]">
        <div className="w-12 h-12 border-4 border-[#1976d2] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-5 font-sans leading-relaxed">
      <div className="w-full max-w-[400px]">
        <div className="bg-white rounded-lg px-10 pt-12 pb-9 shadow-[0_2px_4px_rgba(0,0,0,0.1),0_8px_16px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.12),0_12px_28px_rgba(0,0,0,0.15)] transition-all duration-300 relative overflow-hidden">
          {/* LOGO & HEADER */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6 group cursor-pointer">
              <div className="relative w-14 h-14">
                <div className="absolute inset-0 rounded-full bg-[#1976d2] shadow-[0_2px_4px_rgba(25,118,210,0.3)] transition-transform duration-300 group-hover:scale-110"></div>
                <div className="absolute top-2 left-2 w-10 h-10 rounded-full bg-[#2196f3] shadow-[0_1px_3px_rgba(33,150,243,0.3)] transition-transform duration-300 group-hover:scale-115"></div>
                <div className="absolute top-4 left-4 w-6 h-6 rounded-full bg-[#64b5f6] shadow-[0_1px_2px_rgba(100,181,246,0.3)] transition-transform duration-300 group-hover:scale-120"></div>
              </div>
            </div>
            <h2 className="text-[#212121] text-2xl font-normal mb-2 tracking-[0.15px]">
              Sign in
            </h2>
            <p className="text-[#757575] text-sm">
              to continue to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* EMAIL */}
            <div className="relative group">
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="peer w-full bg-transparent border-b-2 border-[#e0e0e0] py-4 pb-2 text-base outline-none transition-colors focus:border-[#1976d2] z-10 relative"
                placeholder=" "
              />
              <label className="absolute left-0 top-4 text-[#757575] text-base transition-all duration-200 pointer-events-none origin-left peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-[#1976d2] peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-75 z-20">
                Email
              </label>
              <div className="absolute bottom-0 left-0 h-0.5 bg-[#1976d2] w-0 transition-all duration-300 peer-focus:w-full z-30"></div>
            </div>

            {/* PASSWORD */}
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="peer w-full bg-transparent border-b-2 border-[#e0e0e0] py-4 pb-2 pr-14 text-base outline-none transition-colors focus:border-[#1976d2] z-10 relative"
                placeholder=" "
              />
              <label className="absolute left-0 top-4 text-[#757575] text-base transition-all duration-200 pointer-events-none origin-left peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-[#1976d2] peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-75 z-20">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 text-[#757575] hover:text-[#1976d2] transition-colors z-40"
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
              <div className="absolute bottom-0 left-0 h-0.5 bg-[#1976d2] w-0 transition-all duration-300 peer-focus:w-full z-30"></div>
            </div>

            {/* ERROR INFO */}
            {errorInfo && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-xs font-bold uppercase tracking-tight"
              >
                {errorInfo}
              </motion.div>
            )}

            {/* SUBMIT */}
            <button
              disabled={loginLoading}
              className="w-full bg-[#1976d2] text-white py-3 rounded shadow-[0_2px_4px_rgba(0,0,0,0.2)] hover:bg-[#1565c0] active:scale-95 transition-all uppercase font-medium tracking-wider min-h-[48px] flex items-center justify-center disabled:opacity-50"
            >
              {loginLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* DIVIDER & SOCIALS */}
          <div className="relative text-center my-6 before:content-[''] before:absolute before:top-1/2 before:left-0 before:right-0 before:h-[1px] before:bg-[#e0e0e0] before:-translate-y-1/2">
            <span className="relative bg-white px-4 text-[#757575] text-sm">
              or
            </span>
          </div>

          <div className="text-center ">
            <p className="text-slate-500 text-[11px] uppercase tracking-widest font-bold mb-1">
              Access Issues?
            </p>
            <p className="text-slate-600 text-xs leading-relaxed">
              
              Contact{" "}
              <span className="text-[#1976d2] font-semibold">
                System Administrator
              </span>{" "}
              for support.
            </p>
          </div>
     
         
        </div>
      </div>
    </div>
  );
}
