import React from "react";
import {
  FiBell,
  FiUser,
  FiX,
  FiAtSign,
  FiShield,
  FiMail,
  FiPhone,
  FiCalendar,
  FiLogOut,
  FiCreditCard,
} from "react-icons/fi";
import { AuthContext } from "../Context Api/AuthContext";
import { useContext, useState } from "react";
import { img } from "framer-motion/client";
import { AiOutlineEye } from "react-icons/ai";
import { RiBroadcastLine } from "react-icons/ri";

export default function Navbar({ pageTitle }) {
  const { user, logout } = useContext(AuthContext);
  const [showPopup, setShowPopup] = useState(false);

  const toggleAdminPopup = () => {
    setShowPopup((prev) => !prev);
  };

  return (
    <div className="flex justify-between items-center bg-gray-800 text-white px-4 py-2 shadow-5xl rounded mb-2">
      {/* Page Title */}
      <div className="hidden lg:flex justify-between items-center bg- text-2xl text-white rounded ">
        {pageTitle}
      </div>
      <div className="lg:hidden flex justify-between items-center text-xl font-semibold py-2 rounded truncate">
        {pageTitle}
      </div>

      {/* Right side: Search, Notifications, User */}
      <div className="flex items-center gap-5">
        {/* Notification Icon */}
        <a
          href="https://victusbyte.top"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-2xl"
        >
          <RiBroadcastLine className="text-red-600 animate-pulse" size={26} />
        </a>

        <button className="hidden lg:flex relative p-2 rounded hover:bg-gray-100">
          <FiBell size={20} />
          <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={toggleAdminPopup}
        >
          {/* <div className="-mt-4 flex flex-col items-center hover:text-blue-600">
            <span className="hidden -mb-1 lg:flex  -bold text-lg">Admin</span>
            <span className="-mb-7 hidden lg:flex text-sm text-blue-400 ">
              {user.userName}
            </span>
          </div> */}
          <div
            className="bg-gray-700 hidden md:flex border border-gray-600  hover:bg-gray-800 transition-all duration-300 
                 justify-center items-center flex-col text-gray-300 h-9 w-32 rounded cursor-pointer"
          >
            <div className="font-semibold  text-sm mt-2 border-b border-gray-900 w-full text-center">
              Admin
            </div>
            <div className="text-xs text-gray-400 mb-2">{user.userName}</div>
          </div>

          <img
            className="w-10 h-10 lg:w-11 lg:h-11 rounded-full border-blue-600 border-2"
            src={
              user.images
                ? user.images
                : "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80"
            }
            alt="User"
          />
        </div>
      </div>

      {/* Admin Popup */}

      {/* 👤 Industry Standard Admin Profile Modal */}
      {showPopup && user && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
          {/* High-End Glass Overlay */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowPopup(false)}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header: Indigo Gradient */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 h-32 relative">
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Avatar Section */}
            <div className="flex justify-center -mt-16 relative">
              <div className="relative group">
                <img
                  src={
                    user.images ||
                    "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
                  }
                  alt={user.fullName}
                  className="w-32 h-32 rounded-3xl border-4 border-white shadow-xl object-cover bg-white"
                />
                <div
                  className="absolute -bottom-2 -right-2 bg-emerald-500 border-4 border-white w-6 h-6 rounded-full shadow-lg"
                  title="Active Session"
                >
                  <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75"></span>
                </div>
              </div>
            </div>

            {/* Profile info */}
            <div className="px-8 pt-6 pb-8 text-center">
              <h2 className="text-xl font-black text-slate-800 tracking-tight">
                {user.fullName}
              </h2>
              <p className="text-sm font-bold text-indigo-600 mb-6 uppercase tracking-widest flex items-center justify-center gap-1.5">
                <FiShield size={12} />{" "}
                {user.role ? "System Administrator" : "Standard User"}
              </p>

              {/* Info Grid */}
              <div className="space-y-4 text-left">
                {[
                  {
                    icon: <FiAtSign />,
                    label: "Username",
                    value: `@${user.userName}`,
                  },
                  {
                    icon: <FiCreditCard />,
                    label: "Admin ID",
                    value: user.adminID,
                    mono: true,
                  },
                  {
                    icon: <FiMail />,
                    label: "Email Address",
                    value: user.email,
                  },
                  {
                    icon: <FiPhone />,
                    label: "Contact Phone",
                    value: user.phone,
                  },
                  {
                    icon: <FiCalendar />,
                    label: "Joined Platform",
                    value: new Date(user.createdAt).toLocaleDateString(
                      "en-GB",
                      { day: "2-digit", month: "short", year: "numeric" }
                    ),
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      {React.cloneElement(item.icon, { size: 16 })}
                    </div>
                    <div className="flex-1 border-b border-slate-50 pb-1.5">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        {item.label}
                      </p>
                      <p
                        className={`text-sm font-bold text-slate-700 ${
                          item.mono ? "font-mono" : ""
                        }`}
                      >
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Actions */}
              <div className="mt-10 pt-6 border-t border-slate-100 flex gap-3">
                <button
                  onClick={() => setShowPopup(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-500 text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                >
                  Close
                </button>
                <button
                  onClick={() => logout()}
                  className="flex-1 flex items-center justify-center gap-2 bg-rose-50 text-rose-600 border border-rose-100 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all shadow-lg shadow-rose-100 active:scale-95"
                >
                  <FiLogOut size={16} /> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
