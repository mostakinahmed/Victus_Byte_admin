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
  FiChevronRight,
  FiChevronLeft,
} from "react-icons/fi";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // This state now ONLY controls the mobile expansion
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

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
    <div
      // Mobile: Width changes based on state (w-20 to w-64)
      // Desktop: Width is always fixed (lg:w-64)
      className={`fixed top-0 left-0 h-screen bg-slate-900 text-white shadow-2xl flex flex-col transition-all duration-300 z-[100] border-r border-slate-800 
      ${isMobileExpanded ? "w-64" : "w-13"} lg:w-64 lg:sticky`}
    >
      {/* --- MOBILE TOGGLE BUTTON (Hidden on Desktop) --- */}
      <button
        onClick={() => setIsMobileExpanded(!isMobileExpanded)}
        className="lg:hidden absolute -right-3 top-12 bg-indigo-600 text-white rounded-full p-1.5 border-2 border-slate-900 shadow-lg hover:bg-indigo-500 transition-all z-[110]"
      >
        {isMobileExpanded ? (
          <FiChevronLeft size={16} />
        ) : (
          <FiChevronRight size={16} />
        )}
      </button>

      {/* --- BRAND IDENTITY --- */}
      <div
        className={`p-6 flex items-center transition-all duration-300 ${
          isMobileExpanded
            ? "px-6"
            : "px-0 justify-center lg:justify-start lg:px-6"
        }`}
      >
        <div
          className="flex items-center gap-3 shrink-0"
          onClick={() => navigate("/")}
        >
          <div className="p-1 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/30">
            <FiLayers size={24} className="text-white" />
          </div>
          {/* Label hidden only on mobile-collapsed view */}
          <div
            className={`flex flex-col overflow-hidden transition-all duration-300 ${
              isMobileExpanded
                ? "w-32 opacity-100"
                : "w-0 opacity-0 lg:w-32 lg:opacity-100"
            }`}
          >
            <span className="text-sm font-black tracking-tighter uppercase whitespace-nowrap">
              Victus Byte
            </span>
            <span className="text-[8px] font-black text-indigo-400/60 uppercase tracking-widest">
              Admin OS
            </span>
          </div>
        </div>
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="flex-1 px-3 mt-8 space-y-2 overflow-y-auto no-scrollbar">
        {links.map((link) => {
          const isActive = location.pathname === link.path;

          return (
            <Link
              key={link.name}
              to={link.path}
              className={`group flex items-center p-3 rounded-xl transition-all duration-300 relative ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              } ${
                isMobileExpanded
                  ? "justify-start"
                  : "justify-center lg:justify-start"
              }`}
            >
              <div className="flex items-center shrink-0">
                <span
                  className={`text-xl transition-transform duration-300 ${
                    isActive ? "scale-110" : "group-hover:scale-110"
                  }`}
                >
                  {link.icon}
                </span>
              </div>

              {/* Text hidden only on mobile-collapsed view */}
              <span
                className={`ml-4 text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 overflow-hidden ${
                  isMobileExpanded
                    ? "w-32 opacity-100"
                    : "w-0 opacity-0 lg:w-32 lg:opacity-100"
                }`}
              >
                {link.name}
              </span>

              {/* Tooltip (Only visible on mobile-collapsed hover) */}
              {!isMobileExpanded && (
                <div className="lg:hidden absolute left-full ml-4 px-2 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl">
                  {link.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col  gap-3 justify-between items-center ">
        <div className="bg-green-200 w-full text-center py-1">
          <h3 className="text-sm font-medium text-slate-900 uppercase tracking-wider">
            Quick Actions
          </h3>
        </div>
        <div className="flex gap-2 pb-2">
          <button
            onClick={() =>
              window.open(
                "https://meghna.hostseba.com:2003/sessHOp6XIU8MpLJJDzw/mail/?_task=logout&_token=TOSAGw57ReHVzHwuJMkRKRxIzGCjSAPa",
                "_blank",
                "noopener,noreferrer",
              )
            }
            className="px-4  text-sm font-semibold cursor-pointer text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white hover:shadow-lg flex items-center gap-2"
          >
            E-mail Service
          </button>{" "}
          <button
            onClick={() =>
              window.open(
                " https://image.victusbyte.com/",
                "_blank",
                "noopener,noreferrer",
              )
            }
            className="px-4 py-2 text-sm font-medium cursor-pointer text-blue-600 bg-blue-50  hover:bg-blue-600 hover:text-white transition-colors"
          >
            Image Upload
          </button>
        </div>
      </div>

      {/* --- FOOTER STATUS --- */}
      <div
        className={`p-4 border-t border-slate-800 transition-all duration-300 ${
          isMobileExpanded ? "opacity-100" : "opacity-0 lg:opacity-100"
        }`}
      >
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              System Online
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
