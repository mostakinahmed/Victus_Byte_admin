import { useContext, useState } from "react";
import Navbar from "../components/Navbar";
import Invoice from "../components/Tools/Invoice";
import SalesReport from "../components/Tools/ReportGen";
import SerialGenerator from "@/components/Tools/SerialGenerator";

export default function Users() {
  const [activeTab, setActiveTab] = useState("invoice");

  return (
    <div className="mt-12 md:mt-0">
      <Navbar pageTitle="Tools" />
      <div className="bg-white shadow-lg  p-3 w-full mx-auto">
        {/* Buttons */}
        <div className="flex justify-center  lg:mb-0 mb-2">
          <button
            onClick={() => setActiveTab("invoice")}
            className={`lg:px-25 px-9  lg:py-2 py-1  font-medium ${
              activeTab === "invoice"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Invoice
          </button>

          <button
            onClick={() => setActiveTab("serial")}
            className={`lg:px-19 px-4  text-md ${
              activeTab === "admin"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Serial Generator
          </button>

          <button
            onClick={() => setActiveTab("admin")}
            className={`lg:px-19 px-4  text-md ${
              activeTab === "admin"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Sales Report
          </button>
        </div>

        {/* Conditional Content */}
        <div className=" min-h-screen">
          {activeTab === "invoice" && <Invoice />}
               {activeTab === "serial" && <SerialGenerator />}
          {activeTab === "admin" && <SalesReport />}
        </div>
      </div>
    </div>
  );
}
