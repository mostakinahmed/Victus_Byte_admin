import React, { useContext, useState } from "react";
import { FaEdit, FaTrash, FaSearch, FaEye } from "react-icons/fa";
import CustomerView from "./CustomerView";
import { DataContext } from "@/Context Api/ApiContext";

const CustomerList = () => {
  const { customerData } = useContext(DataContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("list");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Filter logic for live data
  const filteredCustomers =
    customerData?.filter(
      (customer) =>
        customer.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone?.includes(searchTerm) ||
        customer.cID?.toUpperCase().includes(searchTerm.toUpperCase()),
    ) || [];

  return (
    <div className="bg-white rounded-xl shadow-xs md:px-4 px-2">
      {/* 1. Header + Brand Search */}
      {activeTab === "list" && (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
          <h2 className="text-[14px] font-black text-slate-800 uppercase tracking-[0.2em] flex items-center gap-3">
            <span className="w-1.5 h-5 bg-[#1976d2] rounded-full"></span>
            Customer List
          </h2>
          <div className="relative w-full md:w-80">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
            <input
              type="text"
              placeholder="Search by username, phone, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-[#1976d2] focus:outline-none transition-all"
            />
          </div>
        </div>
      )}

      {/* 2. Customer Table */}
      {activeTab === "list" && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-slate-100 shadow-sm text-slate-500 uppercase text-[10px] font-black tracking-widest">
              <tr>
                <th className="py-4 px-4 border-b border-slate-100">User ID</th>
                <th className="py-4 px-4 border-b border-slate-100">
                  Full Name
                </th>
                <th className="py-4 px-4 border-b border-slate-100">Email</th>
                <th className="py-4 px-4 border-b border-slate-100">Phone</th>
                <th className="py-4 px-4 border-b border-slate-100">Status</th>
                <th className="py-4 px-4 border-b border-slate-100 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 ">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr
                    key={customer._id}
                    className="hover:bg-slate-100 transition-colors group"
                  >
                    <td className="py-2 px-4 font-bold text-[#1976d2]">
                      {customer.cID}
                    </td>
                    <td className="py-2 px-4 text-slate-800 font-medium">
                      {customer.userName}
                    </td>
                    <td className="py-2 px-4 text-slate-800">
                      {customer.email}
                    </td>
                    <td className="py-2 px-4 text-slate-800">
                      {customer.phone}
                    </td>
                    <td className="py-2 px-4">
                      {customer.isVerified ? (
                        <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-1 rounded uppercase  border border-emerald-100">
                          Verified
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-700 text-[9px] font-black px-2 py-1 rounded uppercase tracking-tighter border border-slate-200">
                          Unverified
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedCustomer(customer); // FIXED: Passing customer instead of admin
                            setActiveTab("view");
                          }}
                          className="p-2 text-slate-500 cursor-pointer hover:text-[#1976d2] hover:bg-white rounded-lg transition-all"
                        >
                          <FaEye size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-12 text-slate-400 italic text-xs"
                  >
                    No customers found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. Customer Detail View */}
      {activeTab === "view" && (
        <CustomerView
          user={selectedCustomer}
          goBack={() => setActiveTab("list")}
        />
      )}
    </div>
  );
};

export default CustomerList;
