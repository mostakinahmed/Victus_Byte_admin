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
        <div className="flex justify-center w-full lg:mb-0 mb-2 pb-5">
          <button
            onClick={() => setActiveTab("system")}
            className={`lg:px-15 px-4  lg:py-2 py-1  font-medium ${
              activeTab === "system"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            System User
          </button>
          <button
            onClick={() => setActiveTab("customer")}
            className={`lg:px-15 px-4  lg:py-2 py-1  font-medium ${
              activeTab === "customer"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Customer
          </button>

          <button
            onClick={() => setActiveTab("admin")}
            className={`lg:px-19 px-4 text-md ${
              activeTab === "admin"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Admin
          </button>
          <button
            onClick={() => setActiveTab("addAdmin")}
            className={` lg:px-9 px-1 hidden lg:flex justify-center items-center font-medium line-clamp-1 ${
              activeTab === "addAdmin"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Add New Admin
          </button>
          <button
            onClick={() => setActiveTab("addAdmin")}
            className={` lg:px-9 w-1/3 px-1 lg:hidden font-medium  ${
              activeTab === "addAdmin"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            New-Admin
          </button>
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
