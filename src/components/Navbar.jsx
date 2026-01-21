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

export default function Navbar({ pageTitle }) {
  const { user, logout } = useContext(AuthContext);
  const [showPopup, setShowPopup] = useState(false);

  const toggleAdminPopup = () => {
    setShowPopup((prev) => !prev);
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
      <div className="flex items-center gap-4 lg:gap-6">
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
        <div className="fixed ml-12 inset-0 flex items-center justify-center z-[100] p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowPopup(false)}
          />

          {/* Modal Container: Max width reduced for mobile (max-w-[280px]) */}
          <div className="relative bg-white rounded-[24px] sm:rounded-[32px] shadow-2xl w-full max-w-[280px] sm:max-w-[320px] overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header: Height reduced from 28 to 20 for mobile compactness */}
            <div className="bg-slate-900 h-20 sm:h-28 relative">
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-3 right-3 text-white/50 hover:text-white bg-white/10 p-1.5 rounded-lg transition-all"
              >
                <FiX size={16} />
              </button>
            </div>

            {/* Avatar Section: Scaled down slightly for mobile */}
            <div className="flex justify-center -mt-10 sm:-mt-14 relative">
              <img
                src={
                  user.images ||
                  "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
                }
                className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl border-4 border-white shadow-xl object-cover bg-white"
                alt="Profile"
              />
              <div className="absolute -bottom-1 right-1/3 translate-x-1/2 bg-emerald-500 border-2 sm:border-4 border-white w-4 h-4 sm:w-6 sm:h-6 rounded-full shadow-lg">
                <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75"></span>
              </div>
            </div>

            {/* Content Section: Padding reduced for mobile */}
            <div className="px-5 sm:px-8 pt-3 pb-6 sm:pb-8 text-center">
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight uppercase">
                {user.fullName}
              </h2>
              <p className="text-[9px] font-black text-indigo-600 mb-4 sm:mb-6 uppercase tracking-[0.2em] flex items-center justify-center gap-1.5">
                <FiShield size={10} /> System Administrator
              </p>

              {/* Identity Details: Tighter spacing (space-y-3 instead of 4) */}
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {[
                  {
                    icon: <FiAtSign />,
                    label: "Username",
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
                  <div
                    key={i}
                    className="flex items-center gap-3 sm:gap-4 text-left"
                  >
                    <div className="p-1.5 sm:p-2 bg-slate-50 rounded-lg sm:rounded-xl text-slate-400">
                      {/* Scale icon down for mobile */}
                      {React.cloneElement(item.icon, { size: 14 })}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[7px] sm:text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                        {item.label}
                      </p>
                      <p
                        className={`text-[11px] sm:text-xs font-bold text-slate-700 truncate ${item.mono ? "font-mono" : ""}`}
                      >
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Modal Actions */}
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={() => setShowPopup(false)}
                  className="flex-1 py-2 sm:py-3 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => logout()}
                  className="flex-[2] flex items-center justify-center gap-2 bg-rose-600 text-white py-2 sm:py-3 rounded-xl sm:rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-rose-100 hover:bg-rose-700 transition-all active:scale-95"
                >
                  <FiLogOut size={12} /> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
