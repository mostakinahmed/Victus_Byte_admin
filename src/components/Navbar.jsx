import React, { useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiBell,
  FiX,
  FiAtSign,
  FiShield,
  FiMail,
  FiPhone,
  FiCalendar,
  FiLogOut,
  FiCreditCard,
  FiChevronDown,
} from "react-icons/fi";
import { AuthContext } from "../Context Api/AuthContext";
import { RiBroadcastLine } from "react-icons/ri";
import { RefreshCw } from "lucide-react";
import { DataContext } from "@/Context Api/ApiContext";

export default function Navbar({ pageTitle }) {
  const { updateApi } = useContext(DataContext);

  const { user, logout } = useContext(AuthContext);
  const [showPopup, setShowPopup] = useState(false);

  const toggleAdminPopup = () => {
    setShowPopup((prev) => !prev);
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      // Your API call logic here
      updateApi();
    } finally {
      // Slight delay so the user sees the spin
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  return (
    <div
      className="flex justify-between items-center bg-white border border-slate-300 border-b-2 md:px-6 px-2 md:py-3 py-1.5 sticky top-0 z-[80] transition-all duration-300 mb-3 mt-1"
      style={{ borderBottomColor: "#F66107" }}
    >
      {/* --- Left Side: Dynamic Page Context --- */}
      <div className="flex items-center gap-3">
        <div
          className="w-1 h-8 rounded-full hidden lg:block"
          style={{ backgroundColor: "#F66107" }}
        />
        <div>
          <h1 className="lg:text-xl text-sm font-black text-slate-800 tracking-tighter uppercase line-clamp-1">
            {pageTitle || "Command Center"}
          </h1>
        </div>
      </div>

      {/* --- Right Side: System Actions & Identity --- */}
      <div className="flex items-center gap-4 lg:gap-6">
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="p-2 rounded-full hover:bg-gray-100 cursor-pointer transition-colors disabled:opacity-50"
          aria-label="Refresh data"
        >
          <RefreshCw
            size={22}
            className={`${isLoading ? "animate-spin" : ""}`}
            style={{ color: "#F66107" }}
          />
        </button>

        {/* Live Broadcast Indicator */}
        <a
          href="https://victusbyte.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1 bg-rose-100 rounded-full border border-rose-100 group transition-all"
          title="Live Status"
        >
          <RiBroadcastLine
            className="text-rose-600 animate-pulse group-hover:scale-110 transition-transform"
            size={18}
          />
          <span className="hidden lg:block text-[10px] font-black text-rose-600 uppercase tracking-widest">
            Live
          </span>
        </a>

        {/* Notifications */}
        <button
          className="hidden md:flex relative p-2.5 text-slate-600 rounded-xl transition-all hover:bg-opacity-10"
          style={{ "--hover-color": "#F66107" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#F66107";
            e.currentTarget.style.backgroundColor = "#FDF2EC";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "";
            e.currentTarget.style.backgroundColor = "";
          }}
        >
          <FiBell size={20} />
          <span
            className="absolute top-2 right-2.5 inline-block w-2 h-2 rounded-full border-2 border-white"
            style={{ backgroundColor: "#F66107" }}
          ></span>
        </button>

        {/* --- User Identity Block --- */}
        <div
          className="group flex items-center gap-3 pl-4 border-l border-slate-300 cursor-pointer"
          onClick={toggleAdminPopup}
        >
          <div className="hidden md:flex flex-col items-end text-right">
            <span className="text-xs font-black text-slate-800 uppercase leading-none mb-1">
              {user?.fullName || "Admin"}
            </span>
            <span
              className="text-[10px] font-bold uppercase tracking-widest leading-none"
              style={{ color: "#F66107" }}
            >
              {user?.role}
            </span>
          </div>

          <div className="relative">
            <img
              className="w-10 h-10 lg:w-11 lg:h-11 rounded-2xl border border-slate-300 transition-all object-cover group-hover:border-[#F66107]"
              src={
                user?.images ||
                "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
              }
              alt="User"
            />
            <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-lg shadow-sm">
              <FiChevronDown
                size={12}
                className="text-slate-400 group-hover:text-[#F66107]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- Admin Profile Modal (Simple & Professional) --- */}
      <AnimatePresence>
        {showPopup && user && (
          <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setShowPopup(false)}
            />

            {/* Compact Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-xl shadow-xl w-full max-w-[340px] overflow-hidden border border-slate-200"
            >
              {/* Profile Header (Compact) */}
              <div className="p-5 flex items-center gap-4 bg-slate-800 border-b border-slate-100">
                <div className="relative shrink-0">
                  <img
                    src={
                      user.images ||
                      "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
                    }
                    className="w-14 h-14 rounded-lg object-cover border border-white shadow-sm"
                    alt="Avatar"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-50 rounded-full"></div>
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-bold text-white truncate">
                    {user.fullName}
                  </h2>
                  <p
                    className="text-[10px] font-black uppercase tracking-widest leading-tight"
                    style={{ color: "#F66107" }}
                  >
                    {user.role}
                  </p>
                </div>
                <button
                  onClick={() => setShowPopup(false)}
                  className="ml-auto p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <FiX size={18} />
                </button>
              </div>

              {/* Data List (Compact) */}
              <div className="p-2 space-y-0.5">
                {[
                  {
                    icon: <FiAtSign />,
                    label: "Username",
                    value: user.userName,
                  },
                  {
                    icon: <FiCreditCard />,
                    label: "Admin ID",
                    value: user.adminID,
                  },
                  { icon: <FiMail />, label: "Email", value: user.email },
                  { icon: <FiPhone />, label: "Contact", value: user.phone },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-all"
                  >
                    <div className="text-slate-400">
                      {React.cloneElement(item.icon, { size: 14 })}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter leading-none">
                        {item.label}
                      </p>
                      <p className="text-[15px] font-medium text-slate-700 truncate leading-tight">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Action (Compact) */}
              <div className="p-3 bg-slate-50/50 border-t border-slate-100">
                <button
                  onClick={() => logout()}
                  className="w-full flex cursor-pointer items-center justify-center gap-2 py-3 text-rose-600 hover:bg-rose-100 bg-rose-50 rounded-lg text-sm font-bold transition-colors active:scale-95"
                >
                  <FiLogOut size={14} />
                  Logout Session
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
