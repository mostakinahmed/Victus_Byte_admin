import React, { useState, useMemo, useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiRefreshCcw,
  FiPlus,
  FiUser,
  FiClock,
} from "react-icons/fi";
import { DataContext } from "@/Context Api/ApiContext";
import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import SalesStatusCards from "@/components/Sales/SalesStatusCards";

export default function Sales() {

  const { orderData, adminData } = useContext(DataContext);
  const navigate = useNavigate();
  const detailScrollRef = useRef(null);

  const [filter, setFilter] = useState({ orderId: "", soldBy: "" });

  // 1. DATA PROCESSING: Map orders to Staff Names or "Online"
  const processedSales = useMemo(() => {
    return orderData.map((order) => {
      const staff = adminData.find((a) => a.adminID === order.mode);
      return {
        ...order,
        staffName: staff ? staff.fullName : "Online",
        staffRole: staff ? staff.role : "System",
        isOnline: !staff,
      };
    });
  }, [orderData, adminData]);

  // 2. FILTER LOGIC: Handles ID search, Staff Filter, and Online Filter
  const filteredSales = useMemo(() => {
    return processedSales.filter((s) => {
      const orderMatch = s.order_id
        .toLowerCase()
        .includes(filter.orderId.toLowerCase());

      let staffMatch = true;
      if (filter.soldBy === "online_platform") {
        staffMatch = s.isOnline;
      } else if (filter.soldBy !== "") {
        staffMatch = s.mode === filter.soldBy;
      }

      return orderMatch && staffMatch;
    });
  }, [processedSales, filter]);

  // 3. RESET SCROLL on change
  useEffect(() => {
    if (detailScrollRef.current) {
      detailScrollRef.current.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [filter]);

  return (
    <div className="mt-12 md:mt-0 font-sans min-h-screen pb-10 bg-slate-50/30">
      <Navbar pageTitle="Sales Architecture" />

      {/* Dynamic Status Cards */}
      <div className="px-2 md:px-0">
        <SalesStatusCards orderData={filteredSales} />
      </div>

      <div className="px-2 md:px-0 md:w-full flex flex-col md:flex-row justify-between items-center gap-4 mb-3 mt-4">
        <div className="flex gap-3 w-full md:w-auto">
          <BackButton />
          <button
            onClick={() => navigate(`/sales/new`)}
            className="flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-2 rounded text-sm font-bold hover:bg-indigo-600 transition-all shadow-lg flex-1 md:flex-none"
          >
            <FiPlus /> New Entry
          </button>
        </div>

        {/* Responsive Filter Bar */}
        <div className="bg-white flex flex-col md:flex-row items-stretch md:items-center px-2 py-2 md:py-1.5 border border-slate-200 rounded w-full md:w-auto gap-2 md:gap-0 ">
          {/* Search */}
          <div className="relative flex-1 md:flex-none">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <FiSearch size={16} />
            </div>
            <input
              type="text"
              placeholder="Search Order"
              value={filter.orderId}
              onChange={(e) =>
                setFilter({ ...filter, orderId: e.target.value })
              }
              className="w-full pl-9 pr-2 py-1.5 md:w-48 text-sm placeholder:font-normal placeholder:normal-case font-medium rounded border bg-slate-50 border-slate-200 uppercase focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          {/* Select & Reset */}
          <div className="flex items-center justify-between md:justify-start flex-1">
            <select
              value={filter.soldBy}
              onChange={(e) => setFilter({ ...filter, soldBy: e.target.value })}
              className="flex-1 md:flex-none py-1.5 outline-none  px-2 md:mx-2 text-sm font-medium bg-white rounded border border-slate-200   cursor-pointer min-w-[150px]"
            >
              <option value="" className="">
                All Sales
              </option>
              <option value="online_platform">Online Store</option>
              <optgroup label="Physical Staff" className="font-bold">
                {adminData.map((user) => (
                  <option key={user.adminID} value={user.adminID}>
                    {user.fullName} - {user.adminID}
                  </option>
                ))}
              </optgroup>
            </select>

            <button
              onClick={() => setFilter({ orderId: "", soldBy: "" })}
              className="p-2 md:px-4 text-green-600 cursor-pointer hover:text-rose-500 transition-colors border-l border-slate-100"
              title="Reset Filters"
            >
              <FiRefreshCcw size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Professional Table */}
      <div className="bg-white rounded border border-slate-200 overflow-hidden mx-2 md:mx-0">
        <div className="overflow-x-auto" ref={detailScrollRef}>
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
                  Sold By
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
              {[...filteredSales].reverse().map((sale) => (
                <tr
                  key={sale._id}
                  className="hover:bg-slate-100 transition-colors duration-150"
                >
                  <td className="px-4 py-2.5 text-sm font-medium text-indigo-600">
                    #{sale.order_id}
                  </td>
                  <td className="px-4 text-sm text-slate-800">
                    {sale.shipping_address.recipient_name}
                  </td>
                  <td className="px-4 text-sm  text-slate-800">
                    {sale.shipping_address.phone}
                  </td>
                  <td className="px-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white 
                        ${sale.staffName === "Online" ? "bg-slate-500" : sale.staffRole === "Moderator" ? "bg-amber-500" : "bg-indigo-600"}`}
                      >
                        {sale.staffName.charAt(0)}
                      </div>
                      <span
                        className={`text-sm ${sale.staffName === "Online" ? "text-slate-500 italic" : "text-slate-800"}`}
                      >
                        {sale.staffName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 text-center text-sm text-slate-800">
                    {sale.order_date.split(" ")[0]}
                  </td>
                  <td className="px-4 text-center">
                    <span className="text-[11px] font-medium text-slate-700 border border-slate-200 px-2 py-0.5 rounded bg-slate-50">
                      {sale.payment.method}
                    </span>
                  </td>
                  <td className="px-4 text-right text-sm font-bold text-slate-900">
                    ৳{sale.total_amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredSales.length === 0 && (
            <div className="p-20 text-center text-slate-400 text-sm font-medium uppercase tracking-widest">
              No matching sales records found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
