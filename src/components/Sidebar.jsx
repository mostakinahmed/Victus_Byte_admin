import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiBox,
  FiArchive,
  FiShoppingCart,
  FiUsers,
  FiFileText,
  FiTrendingUp,
  FiGrid,
  FiMenu,
  FiX,
  FiUser,
  FiLayers
} from "react-icons/fi";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: "Dashboard", path: "/", icon: <FiHome /> },
    { name: "Products", path: "/products", icon: <FiBox /> },
    { name: "Category", path: "/category", icon: <FiGrid /> },
    { name: "Stock", path: "/stock", icon: <FiArchive /> },
    { name: "Orders", path: "/orders", icon: <FiShoppingCart /> },
    { name: "Sales", path: "/sales", icon: <FiTrendingUp /> },
    { name: "Accounts", path: "/accounts", icon: <FiUser /> },
    { name: "Users", path: "/users", icon: <FiUsers /> },
    { name: "Tools", path: "/tools", icon: <FiFileText /> },
  ];

  return (
    <>
      {/* --- 📱 MOBILE HEADER --- */}
      <div className="lg:hidden bg-slate-900 text-white p-4 flex justify-between items-center border-b border-slate-800 sticky top-0 z-[60]">
        <div className="flex items-center gap-2" onClick={() => navigate("/")}>
          <img className="h-8 w-8 object-contain" src="/logo.png" alt="Logo" />
          <span className="text-sm font-black uppercase tracking-tighter text-indigo-500">Victus Byte</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-slate-800 rounded-xl text-indigo-400 active:scale-95 transition-all"
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* --- 🖥️ MAIN SIDEBAR --- */}
      <div
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-slate-900 text-white shadow-2xl flex flex-col transition-all duration-300 z-[100] border-r border-slate-800
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Brand Identity Section */}
        <div className="p-8 pb-4 flex flex-col items-center lg:items-start group cursor-pointer" onClick={() => navigate("/")}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-500/20 group-hover:rotate-12 transition-transform duration-500">
               <img className="h-8 w-8 object-contain brightness-0 invert" src="/logo.png" alt="Logo" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tighter uppercase leading-none">Victus Byte</span>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Admin OS v2</span>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 mt-8 space-y-1 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4">Core Registry</p>
          
          {links.map((link) => {
            const isActive =
              location.pathname === link.path ||
              (link.path !== "/" && location.pathname.startsWith(link.path));
            
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`group flex items-center justify-between p-3 rounded-2xl transition-all duration-300 relative ${
                  isActive 
                    ? "bg-indigo-600/10 text-white" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-3 z-10">
                  <span className={`text-lg transition-colors duration-300 ${isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"}`}>
                    {link.icon}
                  </span>
                  <span className={`text-xs font-black uppercase tracking-widest transition-all ${isActive ? "translate-x-1" : "group-hover:translate-x-1"}`}>
                    {link.name}
                  </span>
                </div>

                {/* Active Pill Indicator */}
                {isActive && (
                  <div className="absolute right-2 w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.8)] animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer: System Status */}
        <div className="p-6 border-t border-slate-800">
          <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-800">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Master Node: Active</span>
             </div>
             <p className="text-[9px] text-slate-600 font-bold mt-1 ml-4 uppercase tracking-tighter">Syncing data 1.2s</p>
          </div>
        </div>
      </div>

      {/* --- Overlay for mobile --- */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm lg:hidden z-[90] animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}