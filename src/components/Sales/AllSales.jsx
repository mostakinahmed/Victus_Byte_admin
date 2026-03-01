import React, { useState, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import BackButton from "../BackButton";
import {
  FiSearch,
  FiRefreshCcw,
  FiPlus,
  FiUser,
  FiClock,
} from "react-icons/fi";
import SalesStatusCards from "./SalesStatusCards";
import { DataContext } from "@/Context Api/ApiContext";

export default function Sales() {
  const { orderData, adminData } = useContext(DataContext);
  const navigate = useNavigate();

  const [filter, setFilter] = useState({ orderId: "", soldBy: "" });

  // 1. LINK ORDERS TO STAFF NAMES
  // We map the 'mode' (adminID) to the actual 'fullName' from adminData
  const processedSales = useMemo(() => {
    return orderData.map((order) => {
      const staff = adminData.find((a) => a.adminID === order.mode);
      return {
        ...order,
        staffName: staff ? staff.fullName : "Unknown Staff",
        staffRole: staff ? staff.role : "N/A",
      };
    });
  }, [orderData, adminData]);

  // 2. FILTER LOGIC
  const filteredSales = useMemo(() => {
    return processedSales.filter((s) => {
      const orderMatch = s.order_id
        .toLowerCase()
        .includes(filter.orderId.toLowerCase());
      const staffMatch = filter.soldBy === "" || s.mode === filter.soldBy;
      return orderMatch && staffMatch;
    });
  }, [processedSales, filter]);

  console.log(filteredSales);

  return (
    <div className="mt-12 md:mt-0 font-sans min-h-screen pb-10">
      <Navbar pageTitle="Sales Architecture" />

      {/* Pass filtered data to cards so they update when you filter by staff */}
      <SalesStatusCards orderData={filteredSales} />

      <div className=" md:w-full flex flex-col md:flex-row justify-between items-center gap-4 mb-3">
        <div className="flex gap-3">
          <BackButton />
          <button
            onClick={() => navigate(`/sales/new`)}
            className="flex items-center w-full gap-2 bg-slate-900 text-white px-4 py-2 rounded text-sm font-bold hover:bg-indigo-600 transition-all shadow-lg "
          >
            <FiPlus /> New Entry
          </button>
        </div>

        {/* Professional Filter Bar */}
        <div className="bg-white flex flex-col md:flex-row items-stretch md:items-center mt-1 px-2 py-2 md:py-1.5 border border-slate-200 rounded w-full md:w-auto gap-2 md:gap-0">
          {/* Search Input Container */}
          <div className="relative flex-1 md:flex-none">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <FiSearch size={16} />
            </div>
            <input
              type="text"
              placeholder="Order ID..."
              value={filter.orderId}
              onChange={(e) =>
                setFilter({ ...filter, orderId: e.target.value })
              }
              className="w-full pl-9 pr-2 py-1.5 md:w-48 text-sm font-medium rounded border bg-slate-50 border-slate-200 uppercase focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          {/* Select & Reset Group */}
          <div className="flex items-center justify-between md:justify-start flex-1">
            <select
              value={filter.soldBy}
              onChange={(e) => setFilter({ ...filter, soldBy: e.target.value })}
              className="flex-1 md:flex-none py-1.5 md:px-4 px-2 md:mx-2 text-sm font-medium bg-white border-l-0 md:border-l border-slate-200 outline-none text-slate-7700 cursor-pointer min-w-[140px]"
            >
              <option value="">All Members</option>
              {adminData.map((user) => (
                <option key={user.adminID} value={user.adminID}>
                  {user.fullName} ({user.role})
                </option>
              ))}
            </select>

            <button
              onClick={() => setFilter({ orderId: "", soldBy: "" })}
              className="p-2 md:px-3 text-slate-400 hover:text-rose-500 transition-colors border-l border-slate-100 flex items-center justify-center"
              title="Reset Filters"
            >
              <FiRefreshCcw size={18} className="md:size-[18px] size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Ref ID
                </th>
                <th className="p-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="p-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="p-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Staff Member
                </th>
                <th className="p-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-center">
                  Date
                </th>
                <th className="p-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-center">
                  Method
                </th>
                <th className="p-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-right">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSales.map((sale) => (
                <tr
                  key={sale._id}
                  className="hover:bg-slate-50 transition-colors duration-150"
                >
                  {/* 1. Reference */}
                  <td className="p-4 text-sm font-medium text-indigo-600">
                    #{sale.order_id}
                  </td>

                  {/* 2. Customer Name */}
                  <td className="p-4 text-sm font-medium text-slate-700">
                    {sale.shipping_address.recipient_name}
                  </td>

                  {/* 3. Phone */}
                  <td className="p-4 text-sm font-medium text-slate-500">
                    {sale.shipping_address.phone}
                  </td>

                  {/* 4. Staff Member */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${sale.staffRole === "Moderator" ? "bg-amber-500" : "bg-indigo-600"}`}
                      >
                        {sale.staffName.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        {sale.staffName}
                      </span>
                    </div>
                  </td>

                  {/* 5. Date */}
                  <td className="p-4 text-center text-sm font-medium text-slate-500">
                    {sale.order_date.split(" ")[0]}
                  </td>

                  {/* 6. Payment Method */}
                  <td className="p-4 text-center">
                    <span className="text-[11px] font-medium text-slate-500 border border-slate-200 px-2 py-0.5 rounded bg-slate-50">
                      {sale.payment.method}
                    </span>
                  </td>

                  {/* 7. Amount */}
                  <td className="p-4 text-right text-sm font-bold text-slate-900">
                    ৳{sale.total_amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {filteredSales.length === 0 && (
            <div className="p-20 text-center">
              <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">
                No Sales Data Available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
