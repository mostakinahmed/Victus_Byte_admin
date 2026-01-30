import React, { useContext, useState } from "react";
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
    /* ✅ Refined Container: White surface with subtle shadow and border */
    <div className="flex justify-between items-center bg-white border-b border-slate-200 md:px-6 px-2 md:py-4 py-2 sticky top-0 z-[80] transition-all duration-300 mb-3 shadow mt-1">
      {/* --- Left Side: Dynamic Page Context --- */}
      <div className="flex items-center gap-3">
        <div className="w-1 h-8 bg-indigo-600 rounded-full hidden lg:block" />
        <div>
          <h1 className=" lg:text-2xl text-sm font-black text-slate-800 tracking-tighter uppercase line-clamp-1">
            {pageTitle || "Command Center"}
          </h1>
          <p className="hidden lg:block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] -mt-1">
            Victus-Byte Management v2.0
          </p>
        </div>
      </div>

      {/* --- Right Side: System Actions & Identity --- */}
      <div className="flex items-center gap-4  lg:gap-6">
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="p-2 rounded-full hover:bg-gray-100 cursor-pointer transition-colors disabled:opacity-50"
          aria-label="Refresh data"
        >
          <RefreshCw
            size={22}
            className={`text-blue-600 ${isLoading ? "animate-spin" : ""}`}
          />
        </button>

        {/* Live Broadcast Indicator */}
        <a
          href="https://victusbyte.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-2 py-1 bg-rose-50 rounded-full border border-rose-100 group transition-all"
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
        <button className=" hidden md:flex relative p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
          <FiBell size={20} />
          <span className="absolute top-2 right-2.5 inline-block w-2 h-2 bg-indigo-600 rounded-full border-2 border-white"></span>
        </button>

        {/* --- User Identity Block --- */}
        <div
          className="group flex items-center gap-3 pl-4 border-l border-slate-100 cursor-pointer"
          onClick={toggleAdminPopup}
        >
          <div className="hidden md:flex flex-col items-end text-right">
            <span className="text-xs font-black text-slate-800 uppercase tracking-tighter leading-none mb-1">
              {user.fullName || "Admin"}
            </span>
            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest leading-none">
              {user.userName}
            </span>
          </div>

          <div className="relative">
            <img
              className="w-10 h-10 lg:w-11 lg:h-11 rounded-2xl border-2 border-slate-100 group-hover:border-indigo-500 transition-all object-cover shadow-sm"
              src={
                user.images ||
                "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
              }
              alt="User"
            />
            <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-lg shadow-sm">
              <FiChevronDown
                size={12}
                className="text-slate-400 group-hover:text-indigo-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- Admin Profile Modal (Restored with your custom logic) --- */}
      {showPopup && user && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-500"
            onClick={() => setShowPopup(false)}
          />

          {/* Modal Container: Landscape Orientation */}
          <div className="relative bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] w-full ml-12 max-w-[300px] md:max-w-[650px]  flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-300 border border-white/20">
            {/* Left Panel: Identity Branding */}
            <div className="relative w-full md:w-[240px] bg-slate-900 flex flex-col items-center justify-center p-8 overflow-hidden">
              {/* Abstract Background Decoration */}
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-500 rounded-full blur-3xl"></div>
              </div>

              {/* Avatar with Ping Status */}
              <div className="relative z-10">
                <img
                  src={
                    user.images ||
                    "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
                  }
                  className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] border-4 border-slate-800 shadow-2xl object-cover bg-slate-800"
                  alt="Profile"
                />
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 border-[6px] border-slate-900 w-8 h-8 rounded-full shadow-lg flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></span>
                </div>
              </div>

              <div className="mt-6 text-center z-10">
                <h2 className="text-white text-lg font-black tracking-tight uppercase leading-tight">
                  {user.fullName}
                </h2>
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full border border-white/5">
                  <FiShield className="text-indigo-400" size={10} />
                  <span className="text-[10px] font-black text-white/90 uppercase tracking-widest">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Panel: Data Grid */}
            <div className="flex-1 py-8 px-4 flex flex-col justify-between bg-white relative">
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-5 right-5 text-slate-600  p-2 hover:text-red-500 hover:bg-slate-100 rounded-xl transition-all"
              >
                <FiX size={24} />
              </button>

              {/* Identity Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                {[
                  {
                    icon: <FiAtSign />,
                    label: "Identification",
                    value: `@${user.userName}`,
                  },
                  {
                    icon: <FiCreditCard />,
                    label: "Access ID",
                    value: user.adminID,
                    mono: true,
                  },
                  {
                    icon: <FiMail />,
                    label: "Secure Email",
                    value: user.email,
                  },
                  { icon: <FiPhone />, label: "Contact", value: user.phone },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2 text-indigo-500/50">
                      {React.cloneElement(item.icon, { size: 12 })}
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {item.label}
                      </p>
                    </div>
                    <p
                      className={`text-xs md:text-sm  font-bold text-slate-800 truncate ${item.mono ? "font-mono text-indigo-600" : ""}`}
                    >
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Actions: Integrated into bottom of right panel */}
              <div className="mt-10 flex items-center justify-center pt-6 border-t border-slate-50">
               
                <button
                  onClick={() => logout()}
                  className="group flex items-center gap-3 bg-slate-900 text-white pl-5 pr-2 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-rose-600 transition-all active:scale-95 overflow-hidden"
                >
                  Logout Session
                  <div className="bg-white/10 p-2 rounded-xl group-hover:bg-white/20 transition-colors">
                    <FiLogOut size={14} />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
