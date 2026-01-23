import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiBox,
  FiGrid,
  FiArchive,
  FiShoppingCart,
  FiTrendingUp,
  FiUser,
  FiUsers,
  FiFileText,
  FiLayers,
  FiMenu,
  FiX,
  FiChevronDown,
} from "react-icons/fi";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false); // ✅ Added state for Services

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
    { name: "Courier", path: "/courier", icon: <FiFileText /> },
  ];

  return (
    <>
      {/* --- MOBILE TOP HEADER --- */}
      <div className="lg:hidden fixed top-0 left-0 w-full h-12 bg-slate-900 border-b border-slate-800 z-[120] flex items-center px-4 justify-between">
        <div className="flex items-center gap-3" onClick={() => navigate("/")}>
          <div className="p-1.5 bg-indigo-600 rounded-lg shadow-lg">
            <FiLayers size={20} className="text-white" />
          </div>
          <span className="text-white text-xs font-black uppercase tracking-widest">
            Victus OS
          </span>
        </div>
        <button
          onClick={() => setIsMobileExpanded(!isMobileExpanded)}
          className="p-2  text-white"
        >
          {isMobileExpanded ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* --- SIDEBAR --- */}
      <div
        className={`fixed top-0 left-0 h-screen bg-slate-900 text-white flex flex-col transition-all duration-300 z-[100] border-r border-slate-800 
        ${isMobileExpanded ? "w-64" : "w-13"} lg:w-64 lg:sticky md:mt-16 mt-12 lg:mt-0`}
      >
        {/* --- BRAND IDENTITY (Desktop) --- */}
        <div
          className="hidden lg:flex p-6 items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="p-1 bg-indigo-600 rounded-xl">
            <FiLayers size={24} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black uppercase tracking-tighter">
              Victus Byte
            </span>
          </div>
        </div>

        {/* --- NAVIGATION --- */}
        <nav className="flex-1 px-3 mt-5 lg:mt-4 md:space-y-2 space-y-4 overflow-y-auto no-scrollbar">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileExpanded(false)}
                className={`group flex items-center p-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                } ${isMobileExpanded ? "justify-start" : "justify-center lg:justify-start"}`}
              >
                <span className="text-xl shrink-0">{link.icon}</span>
                <span
                  className={`ml-4 text-[11px] font-black uppercase tracking-widest transition-all duration-300 
                  ${isMobileExpanded ? "w-32 opacity-100 block" : "w-0 opacity-0 hidden lg:block lg:w-32 lg:opacity-100"}`}
                >
                  {link.name}
                </span>
              </Link>
            );
          })}

          {/* --- SERVICES CLICKABLE DROPDOWN --- */}
          <div className="relative mt-6 border border-slate-700 rounded-2xl">
            <button
              onClick={() => setIsServicesOpen(!isServicesOpen)} // ✅ Toggle on click
              className={`flex items-center p-3 bg-slate-800/30 text-slate-400 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all w-full
              ${isMobileExpanded ? "justify-between px-4" : "justify-center lg:justify-between lg:px-4"}`}
            >
              <div className="flex items-center gap-2">
                <FiFileText size={18} className="shrink-0" />
                <span
                  className={`${isMobileExpanded ? "block" : "hidden lg:block"}`}
                >
                  Services
                </span>
              </div>
              <FiChevronDown
                className={`transition-transform duration-300 ${isServicesOpen ? "rotate-180" : ""} ${isMobileExpanded ? "block" : "hidden lg:block"}`}
              />
            </button>

            {/* Action Links */}
            {isServicesOpen && (
              <div
                className={`absolute md:static z-50 bg-slate-800/30  rounded-2xl border border-slate-700 overflow-hidden mt-4
                ${isMobileExpanded ? "left-0 w-full" : "left-14 top-0 w-40 lg:left-0 lg:w-full"}`}
              >
                <div className="p-2 space-y-2">
                  <button
                    onClick={() => {
                      window.open("https://image.victusbyte.com/");
                      setIsServicesOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 text-[10px]   cursor-pointer tracking-wider font-black text-slate-400 hover:bg-slate-700/30 bg-slate-800 hover:text-blue-600 rounded-2xl uppercase"
                  >
                    IMAGES Upload
                  </button>
                  <button
                    onClick={() => {
                      window.open(
                        "https://meghna.hostseba.com:2003/sessHOp6XIU8MpLJJDzw/mail/?_task=logout&_token=TOSAGw57ReHVzHwuJMkRKRxIzGCjSAPa",
                      );
                      setIsServicesOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 text-[10px]  cursor-pointer bg-slate-800 tracking-wider font-black text-slate-400 hover:bg-slate-700/30 hover:text-blue-600 rounded-2xl uppercase"
                  >
                    E-MAIL Service
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* --- SYSTEM STATUS --- */}
        <div
          className={`p-4 border-t border-slate-800 transition-all ${isMobileExpanded ? "block" : "hidden lg:block"}`}
        >
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* --- MOBILE OVERLAY --- */}
      {isMobileExpanded && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[90]"
          onClick={() => {
            setIsMobileExpanded(false);
            setIsServicesOpen(false);
          }}
        />
      )}
    </>
  );
}
