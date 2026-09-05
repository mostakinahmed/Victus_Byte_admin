import React, { useContext, useEffect, useRef, useState } from "react";
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
  FiMinusCircle,
  FiSlash,
  FiCheckCircle,
  FiPhone,
  FiMail,
  FiHash,
  FiClock,
  FiX,
  FiAlertCircle,
} from "react-icons/fi";
import api from "@/Context Api/api";
import OrderEditModal from "./EditOrder";
import Invoice from "../Tools/Invoice";

const OrderList = () => {
  const { productData, orderData, updateApi, stockData } =
    useContext(DataContext);

  const navigate = useNavigate();
  const [filter, setFilter] = useState({ orderId: "", phone: "" });
  const [selectedStatus, setSelectedStatus] = useState("All Orders");
  const [statusOpen, setStatusOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [showDetails, setShowDetails] = useState(null);
  const [actionBtn, setActionBtn] = useState(null);

  // ✅ LOGIC CHANGE: Keys are now 'idx' (position in array) instead of 'product_id'
  const [skuInputs, setSkuInputs] = useState({});
  const [imei1Inputs, setImei1Inputs] = useState({});
  const [skuStatus, setSkuStatus] = useState({});

  const [currentOrder, setCurrentOrder] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const statuses = [
    "All Orders",
    "Pending",
    "Confirmed",

    "Delivered",
    "Cancelled",
  ];

  const [isValid, setIsvalid] = useState(false);

  //for highlight selection
  const handleRowClick = (order) => {
    setSelectedOrderId(order.order_id);
    handleClickOrder(order);
  };

  // Filter orders based on status, date, and search
  const filteredOrders = orderData.filter((order) => {
    const statusMatch =
      selectedStatus === "All Orders" ||
      order.courier.delivery_status === selectedStatus;

    const dateMatch = startDate
      ? new Date(order.order_date).toDateString() === startDate.toDateString()
      : true;

    const orderIdMatch = filter.orderId
      ? order.order_id.toLowerCase().includes(filter.orderId.toLowerCase())
      : true;

    const phoneMatch = filter.phone
      ? order.shipping_address.phone
          .toLowerCase()
          .includes(filter.phone.toLowerCase())
      : true;

    return statusMatch && dateMatch && orderIdMatch && phoneMatch;
  });

  //filter product data for showing image
  let data = [];
  if (showDetails && showDetails.items) {
    data = showDetails.items.map((item) =>
      productData.find((p) => p.pID === item.product_id),
    );
  }

  // 1. Create the reference for the scrollable container
  const detailScrollRef = useRef(null);

  // 2. Reset scroll whenever showDetails changes (New order selected)
  useEffect(() => {
    if (detailScrollRef.current) {
      detailScrollRef.current.scrollTo({
        top: 0,
        behavior: "instant", // Use "smooth" if you want a sliding effect
      });
    }
    // Clear inputs when switching orders to avoid data ghosting
    setSkuInputs({});
    setImei1Inputs({});
  }, [showDetails?.order_id]); // Trigger only when the ID changes

  //handle click order
  const handleClickOrder = (order) => {
    setShowDetails(order);

    if (order.courier.delivery_status === "Pending") {
      setActionBtn("Confirmed");
    } else {
      setActionBtn("Courier Stage");
    }
  };

  // Reset all filters
  const handleReset = () => {
    setSelectedStatus("All Orders");
    setStartDate(null);
    setFilter({ orderId: "", phone: "" });
    setShowDetails(null);
    setSelectedOrderId(null);
  };

  // ✅ LOGIC CHANGE: Uses 'idx'
  const handleSkuChange = (index, value) => {
    setSkuInputs((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  useEffect(() => {
    const newStatus = {};
    if (!showDetails?.items) return;

    showDetails.items.forEach((item, idx) => {
      const enteredSku = skuInputs[idx]?.toUpperCase().trim();

      if (!enteredSku) {
        newStatus[idx] = "empty";
        return;
      }

      // 1. Find the stock item that contains this SKU
      const matchedStockItem = stockData?.find((stock) =>
        stock.SKU?.some((s) => s.skuID === enteredSku),
      );

      if (matchedStockItem) {
        // 2. Find the specific SKU object inside that stock item
        const specificSku = matchedStockItem.SKU.find(
          (s) => s.skuID === enteredSku,
        );

        // 3. Check the "Sold" status
        if (specificSku.status === true) {
          newStatus[idx] = "valid"; // Exists & Available
        } else {
          newStatus[idx] = "sold"; // Exists but Sold (status: false)
        }
      } else {
        newStatus[idx] = "invalid"; // Doesn't exist in system
      }
    });

    setSkuStatus(newStatus);
    const allValid = showDetails.items.every(
      (_, idx) => newStatus[idx] === "valid",
    );
    setIsvalid(allValid);
  }, [skuInputs, stockData, showDetails]);

  //backend handle
  const submitBtn = async (e) => {
    e.preventDefault();

    let skuArray = [];

    if (actionBtn === "Confirmed") {
      // LOGIC CHANGE: Map inputs using 'idx'
      skuArray = showDetails.items.map((item, idx) => {
        return {
          ...item, // Preserve existing data like product_comments
          skuID: (skuInputs[idx] || "").trim(),
          imei: (imei1Inputs[idx] || "").trim(),
        };
      });

      // Simple validation to ensure data is present before shipping
      const isMissingData = skuArray.some((item) => !item.skuID);
      if (isMissingData) {
        alert("Please enter Serial Number for all items before shipping!");
        return;
      }

      // Check for IMEI requirement before proceeding
      for (let i = 0; i < data.length; i++) {
        if (data[i]?.category === "C001") {
          if (!skuArray[i].imei || skuArray[i].imei.trim() === "") {
            alert(
              `Required: Please enter IMEI details for ${skuArray[i].product_name}!`,
            );
            return;
          }
        }
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
        popup: "w-[300px] h-[200px] p-4",
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
        items: skuArray, // This now contains the product_id, skuID, imei
      };
    }

    try {
      const res = await api.patch(`/order/update/${orderId}`, updatedData);

      if (res.status === 200 || res?.data?.success) {
        updateApi();
        try {
          setShowDetails(null);
          setSelectedOrderId(null);
          handleReset();
        } catch (innerError) {
          console.error("UI Refresh Error:", innerError);
        }
        MySwal.close();
      }
    } catch (error) {
      console.error("Full Catch Error:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Internal Server Error";
      MySwal.fire({
        icon: "error",
        title: "Update Failed",
        text: errorMsg,
      });
    }
  };

  const [editingOrder, setEditingOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOrderEdit = (order) => {
    setEditingOrder(order);
    setIsModalOpen(true);
  };

  // ... existing states
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Updated Handler
  const handleGenerateReceipt = (order) => {
    setSelectedInvoice(order);
  };

  //current product cat find

  return (
    <div className="bg-white md:p-0 p-1 md:mt-3 font-sans ">
      {/* Filters */}
      <div className="w-full flex flex-col gap-3 lg:flex-row lg:items-center mb-3">
        {/* Professional Status Dropdown */}
        <div className="relative w-full lg:w-56 group">
          <button
            onClick={() => setStatusOpen(!statusOpen)}
            className={`w-full flex justify-between items-center bg-white border rounded px-4 py-2 text-sm font-bold transition-all duration-200 outline-none
      ${
        statusOpen
          ? "border-indigo-500 ring-4 ring-indigo-500/10 shadow-sm"
          : "border-slate-300 text-slate-700 hover:border-slate-300"
      }`}
          >
            <div className="flex items-center gap-2">
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
          <div className="relative">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              placeholderText="DD / MM / YYYY"
              className="w-full pl-4 pr-11 py-2 bg-white border border-slate-300 text-sm font-bold text-slate-700 rounded outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 hover:border-slate-300 cursor-pointer placeholder:text-slate-400 placeholder:font-normal"
              dateFormat="dd / MM / yyyy"
              calendarClassName="border-slate-200 shadow-xl rounded-xl font-sans"
            />
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
              <FiCalendar size={18} />
            </div>
          </div>
        </div>

        {/* Order ID Search */}
        <div className="w-full lg:w-64 relative group">
          <div className="relative">
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
              className="w-full pl-11 pr-4 py-2 bg-white border border-slate-300 text-sm font-bold text-slate-700 rounded outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 hover:border-slate-300 placeholder:text-slate-400 placeholder:font-normal"
            />
          </div>
        </div>

        {/* Phone Search */}
        <div className="w-full lg:w-64 relative group">
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-200">
              <FiSearch size={18} />
            </div>
            <input
              type="text"
              placeholder="Phone Number..."
              value={filter.phone}
              onChange={(e) => setFilter({ ...filter, phone: e.target.value })}
              className="w-full pl-11 pr-4 py-2 bg-white border border-slate-300 text-sm font-bold text-slate-700 rounded outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 hover:border-slate-300 placeholder:text-slate-400 placeholder:font-normal"
            />
          </div>
        </div>

        {/* Professional Reset Button */}
        <div className="w-full lg:w-auto self-end pb-0.5">
          <button
            onClick={handleReset}
            className="w-full lg:w-auto flex items-center justify-center gap-2 px-6 py-2  border border-green-500 bg-green-50 text-slate-700 rounded font-bold text-xs uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all duration-200 active:scale-95 group"
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
      <div className="xl:flex xl:gap-3 ">
        {/* Left Side: Order Table */}
        <div className="lg:w-5/7 bg-white rounded md:max-h-165 max-h-90  overflow-auto border border-slate-300  mb-5 lg:mb-0">
          <div className="overflow-x-auto whitespace-nowrap ">
            <table className="min-w-full table-auto text-left border-collapse ">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200">
                  <th className="px-4 py-2 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-4 py-2 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-1 py-2 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    Placement Date
                  </th>
                  <th className="px-3 py-2 text-[11px] font-bold text-slate-600 uppercase tracking-wider text-center">
                    Delivery Status
                  </th>
                  <th className="px-2 pr-5 py-2 text-[11px] font-bold text-slate-600 uppercase tracking-[0.1em] text-center">
                    Invoice
                  </th>

                  <th className="px-2 pr-5 py-2 text-[11px] font-bold text-slate-600 uppercase tracking-[0.1em] text-center">
                    Edit
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredOrders.length > 0 ? (
                  [...filteredOrders].reverse().map((order) => {
                    const isSelected = selectedOrderId === order.order_id;

                    return (
                      <tr
                        key={order.order_id}
                        className={`group transition-all duration-200 ${
                          isSelected ? "bg-indigo-50" : "hover:bg-slate-100"
                        }`}
                      >
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-3">
                            {isSelected && (
                              <div className="w-1 h-4 bg-indigo-600 rounded-full" />
                            )}
                            <span
                              onClick={() => handleRowClick(order)}
                              className=" hover:underline font-medium text-sm cursor-pointer text-indigo-600 tracking-tight"
                            >
                              #{order.order_id}
                            </span>
                          </div>
                        </td>

                        <td className="px-1 py-2">
                          <span className="text-sm text-slate-800">
                            {order.shipping_address.recipient_name}
                          </span>
                        </td>

                        <td className="px-1 py-2">
                          <span className="text-xs  text-slate-700">
                            {order.order_date}
                          </span>
                        </td>

                        <td className="px-4 py-2 text-center">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium uppercase tracking-wider border ${
                              order.courier.delivery_status === "Pending"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : order.courier.delivery_status === "Confirmed"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : order.courier.delivery_status === "Shipped"
                                    ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                    : order.courier.delivery_status ===
                                        "Delivered"
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                      : "bg-rose-50 text-rose-700 border-rose-200"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                order.courier.delivery_status === "Pending"
                                  ? "bg-amber-400"
                                  : order.courier.delivery_status ===
                                      "Confirmed"
                                    ? "bg-blue-400"
                                    : order.courier.delivery_status ===
                                        "Shipped"
                                      ? "bg-indigo-400"
                                      : order.courier.delivery_status ===
                                          "Delivered"
                                        ? "bg-emerald-400"
                                        : "bg-rose-400"
                              }`}
                            />
                            {order.courier.delivery_status}
                          </span>
                        </td>
                        <td className="px-1 text-center">
                          <button
                            onClick={() => handleGenerateReceipt(order)}
                            className="p-2 text-slate-400 cursor-pointer hover:text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors duration-200 group"
                            title="Generate Receipt"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              {/* Receipt/Invoice Icon */}
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </button>
                        </td>
                        <td className="px-1 text-center">
                          <button
                            onClick={() => handleOrderEdit(order)}
                            className="p-2 text-slate-400 cursor-pointer hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 group"
                            title="Edit Item"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="py-12 text-center text-slate-400"
                    >
                      No transactions match your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {isModalOpen && editingOrder && (
          <OrderEditModal
            order={editingOrder}
            onClose={() => {
              setIsModalOpen(false);
              setEditingOrder(null);
            }}
            updateAPI={updateApi}
            // onSave={handleUpdateSubmit}
          />
        )}

        {/* RECEIPT MODAL */}
        {selectedInvoice && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 print:p-0 print:bg-white">
            <div className="bg-white rounded-2xl shadow-2xl relative max-w-4xl w-full max-h-[90vh] overflow-y-auto print:max-h-full print:shadow-none print:rounded-none">
              {/* Header Action Bar - Hidden during print */}
              <div className="sticky top-0 bg-white border-b border-slate-100 p-4 flex justify-between items-center z-10 print:hidden">
                <h3 className="font-black uppercase tracking-widest text-slate-800 text-sm">
                  Document Preview
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedInvoice(null)}
                    className="p-2 hover:bg-slate-100 rounded-full text-slate-500 cursor-pointer"
                  >
                    <FiX size={20} />
                  </button>
                </div>
              </div>

              {/* THE ACTUAL INVOICE COMPONENT */}
              <div className="p-4 md:p-8">
                <Invoice order={selectedInvoice} close={setSelectedInvoice} />
              </div>
            </div>
          </div>
        )}

        {/* right side */}
        <div className="w-full mt-4 xl:mt-0 bg-white xl:max-h-166 lg:max-h-140 max-h-150 rounded border border-slate-300  flex flex-col">
          <div className="bg-slate-50 border-b border-slate-200 md:px-3 px-2 py-3">
            {showDetails ? (
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">
                    Order Detail View
                  </p>
                  <div className="flex items-center gap-2">
                    <h2 className="md:text-xl font-semibold text-slate-900 ">
                      #{showDetails.order_id}
                    </h2>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`px-3 py-1 rounded-full text-[13px] font-black uppercase tracking-wider border  ${
                      showDetails.courier.delivery_status === "Pending"
                        ? "bg-amber-50 text-amber-600 border-amber-400"
                        : showDetails.courier.delivery_status === "Confirmed"
                          ? "bg-blue-50 text-blue-600 border-blue-400"
                          : showDetails.courier.delivery_status === "Shipped"
                            ? "bg-purple-50 text-purple-600 border-purple-400"
                            : showDetails.courier.delivery_status ===
                                "Delivered"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-400"
                              : "bg-rose-50 text-rose-600 border-rose-200"
                    }`}
                  >
                    {showDetails.courier.delivery_status}
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-2 flex items-center justify-center gap-2 text-slate-600 uppercase text-xs font-bold tracking-widest">
                <FiPackage /> Order Detail View
              </div>
            )}
          </div>

          {showDetails ? (
            <div
              ref={detailScrollRef}
              className="flex-1 overflow-y-auto md:p-3 p-2 mt-2 space-y-3 scrollbar-hide"
            >
              <div className="md:flex gap-10">
                <section className="space-y-6 w-full -mt-2">
                  <div className="flex items-center justify-between pb-2 border-b-2 border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 mt-2 md:mt-0 bg-indigo-600 rounded-lg shadow-sm shadow-indigo-200">
                        <FiPackage className="text-white" size={14} />
                      </div>
                      <h3 className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">
                        Inventory Manifest
                      </h3>
                    </div>
                    <span className="text-[11px] font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded">
                      {showDetails.items.length}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {showDetails.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="relative md:pl-6 pl-2 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px] before:bg-slate-200 hover:before:bg-indigo-500 before:rounded-full before:transition-colors transition-all"
                      >
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="relative shrink-0">
                            <img
                              src={data[idx]?.images[0]}
                              alt="prod"
                              className="w-24 h-24 object-contain rounded border border-slate-200 bg-white  p-1"
                            />
                            <div className="absolute -top-2 -right-2 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md border-2 border-white">
                              x{item.quantity || 1}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="text-base font-medium text-slate-800 leading-tight">
                                  {item.product_name}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[13px] font-medium text-slate-700  px-1.5 py-0.5 ">
                                    ID: {item.product_id}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-black text-slate-900 leading-none">
                                  ৳{item.product_price}
                                </p>
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-3 mt-3">
                              <div className="p-2.5 rounded bg-indigo-50 border border-indigo-200">
                                <p className="text-[12px] line-clamp-1 font-medium text-indigo-600 uppercase mb-1">
                                  User Specifications
                                </p>
                                <p className="text-[13px] font-medium text-indigo-900">
                                  {item.product_comments ||
                                    "No specifics provided"}
                                </p>
                              </div>

                              <div className="p-2.5 rounded bg-orange-50 border border-slate-300">
                                <div className="flex gap-5">
                                  <p className="text-[12px] font-medium text-slate-600 uppercase tracking mb-1">
                                    Serial Number
                                  </p>

                                  {isValid && skuStatus && skuStatus[idx] && (
                                    <div className="flex items-center gap-2 -mt-2">
                                      <div
                                        className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-500 border
                                        ${
                                          skuStatus[idx] === "valid"
                                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                            : skuStatus[idx] === "sold"
                                              ? "bg-amber-50 text-amber-600 border-amber-100"
                                              : "bg-rose-50 text-rose-600 border-rose-100"
                                        }
                                      `}
                                      >
                                        {skuStatus[idx] === "valid" ? (
                                          <FiCheckCircle
                                            size={16}
                                            className="animate-in fade-in zoom-in duration-300"
                                          />
                                        ) : skuStatus[idx] === "sold" ? (
                                          <FiMinusCircle
                                            size={16}
                                            className="animate-in fade-in zoom-in duration-300"
                                          />
                                        ) : (
                                          <FiAlertCircle
                                            size={16}
                                            className="animate-in fade-in zoom-in duration-300"
                                          />
                                        )}
                                      </div>
                                      <p
                                        className={`text-[10px] font-black uppercase tracking-tight hidden sm:block 
                                        ${
                                          skuStatus[idx] === "valid"
                                            ? "text-emerald-600"
                                            : skuStatus[idx] === "sold"
                                              ? "text-amber-600"
                                              : "text-rose-600"
                                        }
                                      `}
                                      >
                                        {skuStatus[idx] === "valid"
                                          ? "Ready"
                                          : skuStatus[idx] === "sold"
                                            ? "Already Sold"
                                            : "Invalid SKU"}
                                      </p>
                                    </div>
                                  )}
                                </div>

                                {showDetails.courier.delivery_status ===
                                "Pending" ? (
                                  <div className="relative group/input mt-2">
                                    <input
                                      type="text"
                                      value={skuInputs[idx] || ""}
                                      onChange={(e) =>
                                        handleSkuChange(
                                          idx,
                                          e.target.value.toUpperCase(),
                                        )
                                      }
                                      className="w-full text-[15px] uppercase tracking-wide font-semibold px-2 py-1 bg-white border border-slate-300 rounded shad outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:font-normal placeholder:text-slate-300"
                                    />
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1.5">
                                    {item.skuID ? (
                                      <span className="text-[14px] font-mono font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">
                                        {item.skuID}
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

                              <div className="p-2.5 rounded bg-red-50 border border-slate-300">
                                <p className="text-[12px] font-medium text-slate-600 uppercase mb-1">
                                  IMEI Number
                                </p>
                                {showDetails.courier.delivery_status ===
                                "Pending" ? (
                                  <div className="space-y-2">
                                    <div className="flex gap-2">
                                      <input
                                        type="text"
                                        maxlength={15}
                                        value={imei1Inputs[idx] || ""}
                                        onChange={(e) =>
                                          setImei1Inputs({
                                            ...imei1Inputs,
                                            [idx]: e.target.value,
                                          })
                                        }
                                        className="w-full text-[15px] tracking-wide font-semibold px-2 py-1 bg-white border border-slate-300 rounded  outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:font-normal placeholder:text-slate-300"
                                        placeholder="Only for mobile."
                                      />
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1.5">
                                    {item.imei ? (
                                      <span className="text-[14px] font-mono font-black bg-amber-200 text-emerald-700 px-2 py-0.5 rounded">
                                        #{item.imei}
                                      </span>
                                    ) : (
                                      <span className="text-[10px] font-bold text-rose-400 flex items-center gap-1 uppercase tracking-tighter">
                                        <div className="w-1 h-1 bg-rose-400 rounded-full animate-pulse" />{" "}
                                        Pending IMEI
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

                <section className="space-y-2 min-w-1/4 md:-mt-3 mt-2">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <FiUser className="text-indigo-500" />
                    <h3 className="text-xs mt-2 font-black text-slate-800 uppercase tracking-widest">
                      Customer Details
                    </h3>
                  </div>
                  <div className=" gap-4">
                    <div className="space-y-4">
                      <div>
                        <p className="text-[12px] font-medium text-slate-700 uppercase  mb-1">
                          Customer ID
                        </p>
                        <p className="text-[12px] font-medium uppercase">
                          {showDetails.customer_id || "Guest / Unregistered"}
                        </p>
                      </div>
                      <div className="mb-3">
                        <p className="text-[12px] font-medium text-slate-700 uppercase mb-1">
                          Contact Phone
                        </p>
                        <p className="md:text-[16px] font-bold text-slate-900 bg-emerald-300 px-2  rounded w-fit flex items-center gap-1">
                          <FiPhone size={17} />{" "}
                          {showDetails.shipping_address.phone}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4 ">
                      <div>
                        <p className="text-[12px] font-medium text-slate-600 uppercase mb-1">
                          Full Name
                        </p>
                        <p className="text-sm font-medium">
                          {showDetails.shipping_address.recipient_name}
                        </p>
                      </div>
                      <div className="">
                        <p className="text-[12px] font-medium text-slate-600 uppercase  mb-1">
                          Email Address
                        </p>
                        <p className="text-sm font-medium flex items-center gap-1">
                          <FiMail size={12} />{" "}
                          {showDetails.shipping_address.email || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <section className="bg-slate-900  rounded md:p-6 p-3 text-white space-y-5">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                    <FiTruck className="text-indigo-400" />
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-300">
                      Logistics & Settlement
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-300">
                      Saler ID: {showDetails.mode}
                    </h3>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="max-w-[150px]">
                      <p className="text-[12px] font-black text-slate-500 uppercase">
                        Shipping Address
                      </p>
                      <p className="text-[13px] font-medium text-slate-300 leading-tight">
                        {showDetails.shipping_address.address_line1}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[12px] font-black text-slate-500 uppercase">
                        Shipping Cost
                      </p>
                      <p className="text-sm font-bold text-white">
                        ৳{showDetails.courier.delivery_charge}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/5">
                    <div>
                      <p className="text-[12px] font-black text-slate-500 uppercase">
                        Payment Info
                      </p>
                      <p className="text-sm font-bold text-indigo-300 uppercase">
                        {showDetails.courier.del_type}-
                        {showDetails.courier.payment_method} -
                        {showDetails.courier.payment_status}
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
                    <p className="md:text-3xl text-xl font-black text-white">
                      ৳{showDetails.total_amount}
                    </p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <div className="bg-emerald-500/10 text-emerald-400 text-[12px] font-bold px-2 py-0.5 rounded border border-emerald-500/20">
                      Coupon: {showDetails.coupon?.couponID} -{" "}
                      {showDetails.coupon?.value}
                    </div>
                    <p className="text-[12px] font-bold text-slate-500 italic">
                      {showDetails.order_date}
                    </p>
                  </div>
                </div>
              </section>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button className="flex-1 flex items-center justify-center gap-2 bg-white text-rose-600 border border-rose-200 text-xs font-black py-3 rounded hover:bg-rose-600 hover:text-white transition-all duration-300 shadow-sm">
                  <FiSlash /> CANCEL ORDER
                </button>
                {showDetails?.courier.delivery_status === "Pending" && (
                  <button
                    type="button"
                    onClick={submitBtn}
                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white text-xs font-black py-3 rounded hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95 uppercase tracking-widest"
                  >
                    <FiCheckCircle size={16} /> CONFIRM ORDER
                  </button>
                )}
              </div>
            </div>
          ) : (
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

export default OrderList;
