import React, { useContext, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ChevronDown, Check, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "@/Context Api/ApiContext";
import axios from "axios";
import { FaSpinner, FaCheckCircle, FaRegCopy } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);
import {
  FiCalendar,
  FiSearch,
  FiRefreshCcw,
  FiPackage,
  FiUser,
  FiCreditCard,
  FiTruck,
  FiCopy,
  FiSlash,
  FiCheckCircle,
  FiPhone,
  FiMail,
  FiHash,
  FiClock,
} from "react-icons/fi";

const OrderList = () => {
  const { productData, orderData, updateApi } = useContext(DataContext);

  const navigate = useNavigate();
  const [filter, setFilter] = useState({ orderId: "", pid: "" });
  const [selectedStatus, setSelectedStatus] = useState("All Orders");
  const [statusOpen, setStatusOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [showDetails, setShowDetails] = useState(null);
  const [actionBtn, setActionBtn] = useState(null);
  const [skuInputs, setSkuInputs] = useState({});
  const [currentOrder, setCurrentOrder] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const statuses = [
    "All Orders",
    "Pending",
    "Confirmed",
    "Shipped",
    "Completed",
    "Cancelled",
  ];

  //for highlight selection
  const handleRowClick = (order) => {
    setSelectedOrderId(order.order_id);
    handleClickOrder(order);
  };

  // Filter orders based on status, date, and search
  const filteredOrders = orderData.filter((order) => {
    const statusMatch =
      selectedStatus === "All Orders" || order.status === selectedStatus;

    const dateMatch = startDate
      ? new Date(order.order_date).toDateString() === startDate.toDateString()
      : true;

    const orderIdMatch = filter.orderId
      ? order.order_id.toLowerCase().includes(filter.orderId.toLowerCase())
      : true;

    return statusMatch && dateMatch && orderIdMatch;
  });

  //filter product data for showing image
  let data = [];
  if (showDetails && showDetails.items) {
    data = showDetails.items.map((item) =>
      productData.find((p) => p.pID === item.product_id)
    );
  }

  console.log(data);

  //handle click order
  const handleClickOrder = (order) => {
    setShowDetails(order);

    if (order.status === "Pending") {
      setActionBtn("Confirmed");
    } else if (order.status === "Confirmed") {
      setActionBtn("Shipped");
    } else if (order.status === "Shipped") {
      setActionBtn("Delivered");
    } else if (order.status === "Delivered") {
      setActionBtn("Completed");
    } else {
      setActionBtn(null);
    }
  };

  // Reset all filters
  const handleReset = () => {
    setSelectedStatus("All Orders");
    setStartDate(null);
    setFilter({ orderId: "", pid: "" });
    setShowDetails(null);
    setSelectedOrderId(null);
  };

  // handle SKU input changes
  const handleSkuChange = (product_id, value) => {
    setSkuInputs((prev) => ({
      ...prev,
      [product_id]: value,
    }));
  };

  //backend handle
  const submitBtn = async (e) => {
    e.preventDefault();

    let skuArray = [];

    if (actionBtn === "Shipped") {
      // Convert skuInputs object to array of { product_id, skuID }
      skuArray = Object.entries(skuInputs)
        .filter(([_, skuID]) => skuID && skuID.trim() !== "") // remove empty SKUs
        .map(([product_id, skuID]) => ({
          product_id,
          skuID: skuID.trim(),
        }));

      if (skuArray.length === 0) {
        // No SKU provided, handle as needed
        alert("Please enter  SKU before shipping!");
        return;
      }
    }

    MySwal.fire({
      title: (
        <p className="text-xl font-semibold text-blue-600">Processing...</p>
      ),
      html: (
        <p className="text-gray-600">Please wait while we update your order.</p>
      ),
      allowOutsideClick: false,
      didOpen: () => {
        MySwal.showLoading();
      },
      customClass: {
        popup: "w-[300px] h-[200px] p-4", // 👈 controls alert size
        title: "text-lg font-bold",
        htmlContainer: "text-sm text-gray-600",
      },
    });

    const orderId = showDetails.order_id;
    let updatedData = {};
    //MAKE DATA
    if (actionBtn === "Confirmed") {
      updatedData = {
        status: "Confirmed",
      };
    } else if (actionBtn === "Shipped") {
      updatedData = {
        status: "Shipped",
        items: skuArray,
      };
    } else if (actionBtn === "Delivered") {
      updatedData = {
        status: "Completed",
        payment: {
          status: "Paid",
        },
      };
    }

    const res = await axios.patch(
      `https://fabribuzz.onrender.com/api/order/update/${orderId}`,
      updatedData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    //update api
    updateApi();

    // Update success message
    MySwal.hideLoading();
    MySwal.update({
      icon: "success",
      title: (
        <p className="text-green-600 text-xl font-bold">Order {actionBtn} ✅</p>
      ),
      html: (
        <p className="text-gray-700">
          Order <b>#{showDetails.order_id || "123"}</b> has been successfully
          updated!
        </p>
      ),
      showConfirmButton: true,
      confirmButtonText: "OK",
      customClass: {
        confirmButton:
          "bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg",
      },
      buttonsStyling: false,
    });

    setShowDetails(null);
  };

  return (
    <div className="bg-white min-h-screen p-3">
      {/* Filters */}
      <div className="w-full flex flex-col gap-3 lg:flex-row lg:items-center mb-3">
        {/* Professional Status Dropdown */}
        <div className="relative w-full lg:w-56 group">
          {/* Label - Adds to industry feel */}

          <button
            onClick={() => setStatusOpen(!statusOpen)}
            className={`w-full flex justify-between items-center bg-white border rounded-lg px-4 py-2.5 text-sm font-bold transition-all duration-200 outline-none
      ${
        statusOpen
          ? "border-indigo-500 ring-4 ring-indigo-500/10 shadow-sm"
          : "border-slate-200 text-slate-700 hover:border-slate-300 hover:shadow-sm"
      }`}
          >
            <div className="flex items-center gap-2">
              {/* Dynamic Status Dot */}
              <span
                className={`w-2 h-2 rounded-full ${
                  selectedStatus === "Pending"
                    ? "bg-amber-400"
                    : selectedStatus === "Confirmed"
                    ? "bg-blue-500"
                    : selectedStatus === "Shipped"
                    ? "bg-indigo-500"
                    : "bg-emerald-500"
                }`}
              ></span>
              {selectedStatus}
            </div>

            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                statusOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {statusOpen && (
            <>
              {/* Transparent Click-away overlay */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setStatusOpen(false)}
              ></div>

              <div className="absolute left-0 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl shadow-slate-200/50 overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-100 origin-top">
                <div className="p-1.5 space-y-0.5">
                  {statuses.map((status) => (
                    <div
                      key={status}
                      onClick={() => {
                        setSelectedStatus(status);
                        setStatusOpen(false);
                      }}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all group/item
                ${
                  selectedStatus === status
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-1.5 h-1.5 text-2xl rounded-full opacity-60 group-hover/item:opacity-100 ${
                            status === "Pending"
                              ? "bg-amber-400"
                              : status === "Confirmed"
                              ? "bg-blue-500"
                              : status === "Shipped"
                              ? "bg-indigo-500"
                              : "bg-emerald-500"
                          }`}
                        ></span>
                        <span className="text-sm font-semibold">{status}</span>
                      </div>

                      {selectedStatus === status && (
                        <Check className="w-3.5 h-3.5 text-indigo-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Professional Calendar Section */}
        <div className="w-full lg:w-60 relative group">
          {/* Industry Standard Label */}

          <div className="relative">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              placeholderText="DD / MM / YYYY"
              className="w-full pl-4 pr-11 py-2.5 bg-white border border-slate-200 text-sm font-bold text-slate-700 rounded-lg shadow-sm outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 hover:border-slate-300 cursor-pointer placeholder:text-slate-300 placeholder:font-normal"
              dateFormat="dd / MM / yyyy"
              // This wrapper ensures the calendar popup looks clean
              calendarClassName="border-slate-200 shadow-xl rounded-xl font-sans"
            />

            {/* Calendar Icon - Positioned perfectly within the padded input */}
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
              <FiCalendar size={18} />
            </div>
          </div>
        </div>

        {/* Order ID Search */}

        {/* Professional Order ID Search */}
        <div className="w-full lg:w-64 relative group">
          {/* Label - Consistent with Date and Status */}
          <div className="relative">
            {/* Search Icon */}
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-200">
              <FiSearch size={18} />
            </div>

            <input
              type="text"
              placeholder="Enter Order ID..."
              value={filter.orderId}
              onChange={(e) =>
                setFilter({ ...filter, orderId: e.target.value })
              }
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 text-sm font-bold text-slate-700 rounded-lg shadow-sm outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 hover:border-slate-300 placeholder:text-slate-300 placeholder:font-normal"
            />
          </div>
        </div>

        {/* Professional Reset Button */}
        <div className="w-full lg:w-auto self-end pb-0.5">
          {" "}
          {/* Aligns with inputs that have labels */}
          <button
            onClick={handleReset}
            className="w-full lg:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-500 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all duration-200 active:scale-95 group shadow-sm"
          >
            <FiRefreshCcw
              size={14}
              className="group-hover:rotate-[-45deg] transition-transform duration-300"
            />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="md:flex gap-3">
        {/* Left Side: Order Table */}
        <div className="lg:w-3/4 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-5 lg:mb-0">
          <div className="overflow-x-auto w-full">
            <table className="min-w-full table-auto text-left border-collapse">
              {/* Table Header */}
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200">
                  <th className="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Order Reference
                  </th>
                  <th className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Customer
                  </th>
                  <th className="px-2 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Placement Date
                  </th>
                  <th className="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">
                    Fulfillment Status
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.length > 0 ? (
                  [...filteredOrders].reverse().map((order) => {
                    const isSelected = selectedOrderId === order.order_id;

                    return (
                      <tr
                        key={order.order_id}
                        onClick={() => handleRowClick(order)}
                        className={`group cursor-pointer transition-all duration-200 ${
                          isSelected ? "bg-indigo-50" : "hover:bg-slate-100"
                        }`}
                      >
                        {/* Order ID with Monospace font */}
                        <td className="px-6 py-2">
                          <div className="flex items-center gap-3">
                            {isSelected && (
                              <div className="w-1 h-4 bg-indigo-600 rounded-full" />
                            )}
                            <span className="font-mono font-bold text-sm text-indigo-600 tracking-tight">
                              #{order.order_id}
                            </span>
                          </div>
                        </td>

                        {/* Customer Name */}
                        <td className="px-4 py-2">
                          <span className="text-sm font-semibold text-slate-700">
                            {order.shipping_address.recipient_name}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-2 py-2">
                          <span className="text-xs font-medium text-slate-500">
                            {order.order_date}
                          </span>
                        </td>

                        {/* Modern Status Pills */}
                        <td className="px-6 py-2 text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                              order.status === "Pending"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : order.status === "Confirmed"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : order.status === "Shipped"
                                ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                : order.status === "Delivered"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-rose-50 text-rose-700 border-rose-200"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                order.status === "Pending"
                                  ? "bg-amber-400"
                                  : order.status === "Confirmed"
                                  ? "bg-blue-400"
                                  : order.status === "Shipped"
                                  ? "bg-indigo-400"
                                  : order.status === "Delivered"
                                  ? "bg-emerald-400"
                                  : "bg-rose-400"
                              }`}
                            />
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <p className="text-sm font-medium">
                          No transactions match your filters
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* right side */}

        {/* 📑 Right Side: Industry-Standard Order Details View */}
        <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full min-h-[700px]">
          {/* Header: Reference & Status Pill */}
          <div className="bg-slate-50 border-b border-slate-200 px-5 py-3">
            {showDetails ? (
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Order Detail View
                  </p>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-slate-900 font-mono tracking-tighter">
                      #{showDetails.order_id}
                    </h2>
                 
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm ${
                      showDetails.status === "Pending"
                        ? "bg-amber-50 text-amber-600 border-amber-200"
                        : showDetails.status === "Confirmed"
                        ? "bg-blue-50 text-blue-600 border-blue-200"
                        : showDetails.status === "Shipped"
                        ? "bg-purple-50 text-purple-600 border-purple-200"
                        : showDetails.status === "Delivered"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                        : "bg-rose-50 text-rose-600 border-rose-200"
                    }`}
                  >
                    {showDetails.status}
                  </span>
                  <div className="flex items-center gap-1 text-[12px] text-slate-400 font-medium">
                    <FiClock size={10} /> {showDetails.order_date}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-2 flex items-center justify-center gap-2 text-slate-400 uppercase text-xs font-bold tracking-widest">
                <FiPackage /> Order Detail View
              </div>
            )}
          </div>

          {showDetails ? (
            <div className="flex-1 overflow-y-auto p-6 space-y-3 scrollbar-hide">
              {/* 📦 1. Product Info Section - Modern Logistics Style */}
              <section className="space-y-6 -mt-3">
                <div className="flex items-center justify-between pb-2 border-b-2 border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-600 rounded-lg shadow-sm shadow-indigo-200">
                      <FiPackage className="text-white" size={14} />
                    </div>
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      Inventory Manifest
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    {showDetails.items.length} Units
                  </span>
                </div>

                <div className="space-y-4">
                  {showDetails.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px] before:bg-slate-200 hover:before:bg-indigo-500 before:rounded-full before:transition-colors transition-all"
                    >
                      <div className="flex flex-col md:flex-row gap-4">
                        {/* Product Image with subtle shadow */}
                        <div className="relative shrink-0">
                          <img
                            src={data[idx]?.images[0]}
                            alt="prod"
                            className="w-20 h-20 object-contain rounded-2xl border border-slate-100 bg-white shadow-sm p-1"
                          />
                          <div className="absolute -top-2 -right-2 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md border-2 border-white">
                            x{item.quantity || 1}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* Header: Name & Price */}
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="text-base font-black text-slate-800 leading-tight">
                                {item.product_name}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[13px] font-mono font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                                  ID: {item.product_id}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-black text-slate-900 leading-none">
                                ৳{item.product_price}
                              </p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                                MSRP Verified
                              </p>
                            </div>
                          </div>

                          {/* Modern Data Grid for SKU & Comments */}
                          <div className="grid grid-cols-2 gap-3 mt-3">
                            {/* Comment Block */}
                            <div className="p-2.5 rounded-xl bg-indigo-50/50 border border-indigo-100/50">
                              <p className="text-[12px] font-black text-indigo-400 uppercase tracking-tighter mb-1">
                                User Specifications
                              </p>
                              <p className="text-[13px] font-bold text-indigo-900">
                                {item.product_comments ||
                                  "No specifics provided"}
                              </p>
                            </div>

                            {/* SKU Block */}
                            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                              <p className="text-[12px] font-black text-slate-500 uppercase tracking-tighter mb-1">
                                Fulfillment Status
                              </p>
                              {showDetails.status === "Confirmed" ? (
                                <div className="relative group/input">
                                  <input
                                    type="text"
                                    value={skuInputs[item.product_id] || ""}
                                    onChange={(e) =>
                                      handleSkuChange(
                                        item.product_id,
                                        e.target.value
                                      )
                                    }
                                    className="w-full text-[13px] font-black px-2 py-1 bg-white border border-slate-200 rounded shadow-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:font-normal placeholder:text-slate-300"
                                    placeholder="Assign SKU..."
                                  />
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5">
                                  {item.skuID ? (
                                    <span className="text-[14px] font-mono font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">
                                      #{item.skuID}
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-bold text-rose-400 flex items-center gap-1 uppercase tracking-tighter">
                                      <div className="w-1 h-1 bg-rose-400 rounded-full animate-pulse" />{" "}
                                      Pending SKU
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 👤 2. Customer Info Section */}
              <section className="space-y-2">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <FiUser className="text-indigo-500" />
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                    Customer Details
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <p className="text-[12px] font-black text-slate-400 uppercase tracking-tighter mb-1">
                        Customer ID
                      </p>
                      <p className="text-[12px] font-bold text-slate-700">
                        {showDetails.customer_id || "Guest / Unregistered"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[12px] font-black text-slate-400 uppercase tracking-tighter mb-1">
                        Contact Phone
                      </p>
                      <p className="text-sm font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg w-fit flex items-center gap-1">
                        <FiPhone size={12} />{" "}
                        {showDetails.shipping_address.phone}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4 text-right">
                    <div>
                      <p className="text-[12px] font-black text-slate-400 uppercase tracking-tighter mb-1">
                        Full Name
                      </p>
                      <p className="text-sm font-bold text-slate-900">
                        {showDetails.shipping_address.recipient_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-[12px] font-black text-slate-400 uppercase tracking-tighter mb-1">
                        Email Address
                      </p>
                      <p className="text-sm font-medium text-slate-500 flex items-center justify-end gap-1">
                        <FiMail size={12} />{" "}
                        {showDetails.shipping_address.email || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 🚚 3. Payment & Shipping Summary */}
              <section className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl space-y-5">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <FiTruck className="text-indigo-400" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-300">
                    Logistics & Settlement
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="max-w-[150px]">
                      <p className="text-[12px] font-black text-slate-500 uppercase">
                        Shipping Address
                      </p>
                      <p className="text-[12px] font-medium text-slate-300 leading-tight">
                        {showDetails.shipping_address.address_line1}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[12px] font-black text-slate-500 uppercase">
                        Shipping Cost
                      </p>
                      <p className="text-sm font-bold text-white">
                        ৳{showDetails.shipping_cost}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/5">
                    <div>
                      <p className="text-[12px] font-black text-slate-500 uppercase">
                        Payment Info
                      </p>
                      <p className="text-sm font-bold text-indigo-300 uppercase">
                        {showDetails.payment.method} /{" "}
                        {showDetails.payment.status}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[12px] font-black text-slate-500 uppercase">
                        Applied Discount
                      </p>
                      <p className="text-sm font-bold text-rose-400">
                        -৳{showDetails.discount || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-end border-t border-white/10">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">
                      Final Total Amount
                    </p>
                    <p className="text-3xl font-black text-white">
                      ৳{showDetails.total_amount}
                    </p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <div className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/20">
                      VERIFIED
                    </div>
                    <p className="text-[12px] font-bold text-slate-500 italic">
                      {showDetails.order_date}
                    </p>
                  </div>
                </div>
              </section>

              {/* 🧾 Bottom Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button className="flex-1 flex items-center justify-center gap-2 bg-white text-rose-600 border border-rose-200 text-xs font-black py-3 rounded-xl hover:bg-rose-600 hover:text-white transition-all duration-300 shadow-sm">
                  <FiSlash /> CANCEL ORDER
                </button>
                {actionBtn && (
                  <button
                    type="button"
                    onClick={submitBtn}
                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white text-xs font-black py-3 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95 uppercase tracking-widest"
                  >
                    <FiCheckCircle /> {actionBtn}
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* ⚠️ Empty State */
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-slate-50/50">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-300 shadow-sm border border-slate-100 mb-4">
                <FiPackage size={32} />
              </div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                No Selection
              </h3>
              <p className="text-xs text-slate-400 mt-2 max-w-[200px] mx-auto">
                Select an order from the list to view its complete profile and
                manage fulfillment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
//order
export default OrderList;
