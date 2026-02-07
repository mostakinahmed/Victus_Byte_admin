import { useContext, useState } from "react";
import Navbar from "../components/Navbar";
import { div } from "framer-motion/client";
import AdminRegistration from "../components/Users/AdminRegistration";
import AdminList from "../components/Users/AdminList";
import CustomerList from "../components/Users/CustomerList";
import SystemPersonnel from "@/components/Users/EmployeeCard";

export default function Users() {
  const [activeTab, setActiveTab] = useState("system");

  return (
    <div className="mt-12 md:mt-0 font-sans">
      <Navbar pageTitle="User Management" />
      <div className="bg-white shadow-lg  p-3 w-full mx-auto">
        {/* Buttons */}
        {/* Main Container */}
        <div className="flex flex-col lg:flex-row justify-between md:justify-center items-start w-full gap-4 mb-4">
          {/* Left Side: System & Customer */}
          <div className="flex flex-row lg:flex-row w-full lg:w-auto gap-2">
            <button
              onClick={() => setActiveTab("system")}
              className={`flex-1 lg:w-40 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "system"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              System User
            </button>
            <button
              onClick={() => setActiveTab("customer")}
              className={`flex-1 lg:w-40 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "customer"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Customer
            </button>
          </div>

          {/* Right Side: Admin Actions */}
          <div className="flex flex-row w-full lg:w-auto gap-2">
            <button
              onClick={() => setActiveTab("admin")}
              className={`flex-1 lg:w-40 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "admin"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Admin List
            </button>

            <button
              onClick={() => setActiveTab("addAdmin")}
              // Note: Removed lg:hidden so it's visible on large screens too,
              // unless you specifically want it hidden there.
              className={`flex-1 lg:w-40 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "addAdmin"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              + New Admin
            </button>
          </div>
        </div>

        {/* Conditional Content */}
        <div className=" min-h-screen">
          {activeTab === "admin" && <AdminList />}

          {activeTab === "customer" && <CustomerList />}

          {activeTab === "addAdmin" && <AdminRegistration />}
          {activeTab === "system" && <SystemPersonnel />}
        </div>
      </div>
    </div>
  );
}
