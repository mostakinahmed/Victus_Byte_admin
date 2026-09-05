import React, { useState, useMemo, useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiRefreshCcw,
  FiPlus,
  FiUser,
  FiEdit3,
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
    <div className="mt-12 md:mt-0 font-sans">
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
            className="flex items-center justify-center gap-2 bg-black text-white px-5 py-2 rounded text-sm font-bold hover:bg-brand transition-all shadow-lg flex-1 md:flex-none"
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
      <div className="bg-white rounded border pb-2 border-slate-200 mx-2 md:mx-0  overflow-hidden">
        {/* The container that defines the height and allows vertical scrolling */}
        <div
          className="md:h-[650px] overflow-y-auto overflow-x-auto relative"
          ref={detailScrollRef}
        >
          <table className="w-full text-left border-separate border-spacing-0 overflow-x-auto whitespace-nowrap">
            <thead className="sticky top-0 z-20">
              <tr>
                {[
                  "Ref ID",
                  "Customer Name",
                  "Contact",
                  "Sold By",
                  "Date",
                  "Delivery",
                  "Type",
                  "Method",
                  "Status",
                  "Revenue",
                ].map((header, index) => (
                  <th
                    key={header}
                    className={`p-4 text-[11px] font-black text-slate-500 uppercase tracking-widest bg-slate-50 border-b border-slate-200 
          ${index === 0 ? "text-left" : index === 9 ? "text-right" : "text-center"}`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white">
              {[...filteredSales].reverse().map((sale) => (
                <tr
                  key={sale._id}
                  className="hover:bg-indigo-50 group border-b-8 border-slate-100"
                >
                  {/* 1. Ref ID (Left) */}
                  <td className="pl-4 py-4 text-sm font-black text-[#1976d2]">
                    <div className="flex items-center gap-2">
                      <span>#{sale.order_id}</span>
                    </div>
                  </td>

                  {/* 2. Customer Name (Center) */}
                  <td className="px-4 text-sm text-slate-800 font-bold">
                    <span
                      className="block truncate max-w-[140px] mx-auto"
                      title={sale.shipping_address.recipient_name}
                    >
                      {sale.shipping_address.recipient_name?.toUpperCase()}
                    </span>
                  </td>

                  {/* 3. Contact (Center) */}
                  <td className="px-4 text-center text-sm text-slate-600 font-bold">
                    {sale.shipping_address.phone}
                  </td>

                  {/* 4. Sold By (Center) */}
                  <td className="px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-white shadow-sm
              ${sale.staffName === "Online" ? "bg-slate-400" : "bg-[#1976d2]"}`}
                      >
                        {sale.staffName?.charAt(0) || "U"}
                      </div>
                      <span className="text-[11px] font-black text-slate-700 uppercase tracking-tighter">
                        {sale.staffName}
                      </span>
                    </div>
                  </td>

                  {/* 5. Date (Center) */}
                  <td className="px-4 text-center text-[11px] font-black text-slate-500">
                    {sale.order_date?.split(" ")[0]}
                  </td>

                  {/* 6. Delivery Status (Center + Branded Colors) */}
                  <td className="px-4 text-center">
                    <span
                      className={`text-[11px] font-black uppercase px-2 py-1 rounded border 
            ${
              sale.courier.delivery_status === "Delivered"
                ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                : sale.courier.delivery_status === "Cancelled"
                  ? "bg-rose-50 border-rose-200 text-rose-600"
                  : "bg-indigo-50 border-indigo-100 text-[#1976d2]"
            }`}
                    >
                      {sale.courier.delivery_status}
                    </span>
                  </td>

                  {/* 7. Del Type (Center) */}
                  <td className="px-4 text-center">
                    <span className="text-[11px] font-black text-slate-500 uppercase border border-slate-200 px-2 py-1 rounded-full bg-white">
                      {sale.courier.del_type || "REG"}
                    </span>
                  </td>

                  {/* 8. Payout Method (Center) */}
                  <td className="px-4 text-center">
                    <span
                      className={`text-[11px] font-black px-2 py-0.5 rounded
            ${
              sale.courier.payment_method === "bKash"
                ? "text-pink-600 bg-pink-50"
                : sale.courier.payment_method === "Nagad"
                  ? "text-orange-600 bg-orange-50"
                  : "text-slate-500 bg-slate-100"
            }`}
                    >
                      {sale.courier.payment_method || "N/A"}
                    </span>
                  </td>

                  {/* 9. Payment Status (Center) */}
                  <td className="px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <span
                        className={`text-[10px] font-black uppercase px-3 py-1 rounded-full
              ${sale.courier.payment_status === "Paid" ? "bg-emerald-500 text-white" : "bg-amber-400 text- animate-pulse"}`}
                      >
                        {sale.courier.payment_status}
                      </span>
                    </div>
                  </td>

                  {/* 10. Revenue (Right) */}
                  <td className="px-4 text-right text-sm font-black text-slate-900 bg-slate-50/50 border-l border-slate-100">
                    <span className="text-[#1976d2] mr-0.5">৳</span>
                    {sale.total_amount?.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Empty State */}
          {filteredSales.length === 0 && (
            <div className="p-20 text-center text-slate-400 text-sm font-medium uppercase tracking-widest bg-white">
              No matching sales records found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
