import { useContext, useState } from "react";
import Navbar from "../components/Navbar";
import AdminRegistration from "../components/Users/AdminRegistration";
import AdminList from "../components/Users/AdminList";
import CustomerList from "../components/Users/CustomerList";
import SystemPersonnel from "@/components/Users/EmployeeCard";

export default function Users() {
  const [activeTab, setActiveTab] = useState("system");

  return (
    <div className="mt-12 md:mt-0 font-sans">
      <Navbar pageTitle="User Management" />
      <div className=" shadow-xl p-4 w-full mx-auto rounded-xl border border-slate-100">
        
        {/* Main Navigation Container */}
        <div className="flex flex-col lg:flex-row justify-between md:justify-center items-start w-full gap-4 mb-6">
          
          {/* Left Side: System & Customer */}
          <div className="flex flex-row w-full lg:w-auto gap-3">
            <button
              onClick={() => setActiveTab("system")}
              className={`flex-1 lg:w-44 px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 ${
                activeTab === "system"
                  ? "bg-[#1976d2] text-white shadow-lg shadow-blue-200"
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-300"
              }`}
            >
              System User
            </button>
            <button
              onClick={() => setActiveTab("customer")}
              className={`flex-1 lg:w-44 px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 ${
                activeTab === "customer"
                  ? "bg-[#1976d2] text-white shadow-lg shadow-blue-200"
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-300"
              }`}
            >
              Customer
            </button>
          </div>

          {/* Right Side: Admin Actions */}
          <div className="flex flex-row w-full lg:w-auto gap-3">
            <button
              onClick={() => setActiveTab("admin")}
              className={`flex-1 lg:w-44 px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 ${
                activeTab === "admin"
                  ? "bg-[#1976d2] text-white shadow-lg shadow-blue-200"
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-300"
              }`}
            >
              Admin List
            </button>

            <button
              onClick={() => setActiveTab("addAdmin")}
              className={`flex-1 lg:w-44 px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 border-2 ${
                activeTab === "addAdmin"
                  ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200"
                  : "bg-white text-[#1976d2] border-[#1976d2] hover:bg-blue-50"
              }`}
            >
              + New Admin
            </button>
          </div>
        </div>

        {/* Conditional Content */}
        <div className="min-h-screen animate-in fade-in slide-in-from-bottom-2 duration-500">
          {activeTab === "admin" && <AdminList />}
          {activeTab === "customer" && <CustomerList />}
          {activeTab === "addAdmin" && <AdminRegistration />}
          {activeTab === "system" && <SystemPersonnel />}
        </div>
      </div>
    </div>
  );
}