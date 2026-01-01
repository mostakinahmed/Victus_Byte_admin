import { useContext, useState } from "react";
import Navbar from "../components/Navbar";
import { div } from "framer-motion/client";
import AdminRegistration from "../components/Users/AdminRegistration";
import AdminList from "../components/Users/AdminList";
import CustomerList from "../components/Users/CustomerList";
import { DataContext } from "@/Context Api/ApiContext";
import CheckAndUpdateStock from "@/components/Stock/CheckAndUpdateStock";
import {
  FiDatabase,
  FiAlertTriangle,
  FiArrowUpCircle,
  FiInfo,
} from "react-icons/fi";

export default function Users() {
  const { updateApi } = useContext(DataContext);
  // updateApi();
  const [activeTab, setActiveTab] = useState("checkStock");

  return (
    <div>
      <Navbar pageTitle="Stock Management" />

      {/* 📦 Professional Stock Control Center */}
      <div className="bg-white border border-slate-200 shadow rounded overflow-hidden w-full mx-auto animate-in fade-in duration-500">
        {/* Modern Segmented Control Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Tab Navigation: Pill Style */}
            <div className="flex bg-slate-200/60 p-1.5 rounded-2xl w-full lg:w-fit">
              {[
                {
                  id: "checkStock",
                  label: "Check & Update Stock",
                  mobileLabel: "Inventory",
                  icon: <FiDatabase />,
                },
                {
                  id: "customer",
                  label: "Stock Alerts & Requests",
                  mobileLabel: "Alerts",
                  icon: <FiAlertTriangle />,
                },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                const isAlert = tab.id === "customer"; // Logic for alert styling

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex flex-1 lg:flex-none items-center justify-center gap-3 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                      isActive
                        ? "bg-white text-indigo-600 shadow-lg shadow-slate-200"
                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/40"
                    }`}
                  >
                    <span
                      className={`text-base ${
                        isActive ? "text-indigo-600" : "text-slate-400"
                      }`}
                    >
                      {tab.icon}
                    </span>
                    <span className="hidden lg:inline">{tab.label}</span>
                    <span className="lg:hidden">{tab.mobileLabel}</span>

                    {/* Red dot for Alerts Tab to signal importance */}
                    {isAlert && (
                      <span className="absolute top-2 right-2 w-3 h-3 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Meta Indicators */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                  Database Engine
                </span>
                <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                  <FiArrowUpCircle /> Cloud Sync Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-4 lg:p-8 min-h-[75vh] bg-white">
          <div className="animate-in slide-in-from-bottom-3 duration-500">
            {activeTab === "checkStock" && (
              <div className="space-y-4">
              
                <CheckAndUpdateStock />
              </div>
            )}

            {activeTab === "customer" && (
              <div className="space-y-4">
                <CustomerList />
              </div>
            )}
          </div>
        </div>

        {/* Footer Control Info */}
        <div className="px-6 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            Authorized Access Only
          </p>
          <div className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-tighter">
            v3.4.1 Build
          </div>
        </div>
      </div>
    </div>
  );
}
