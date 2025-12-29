import React, { useContext, useState, useEffect } from "react";
import { Plus, Minus } from "lucide-react";
import Navbar from "../Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { DataContext } from "@/Context Api/ApiContext";
import axios from "axios";
import { FaSpinner, FaCheckCircle, FaRegCopy } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);
import {
  FiPhone,
  FiUser,
  FiMapPin,
  FiMail,
  FiPackage,
  FiPlus,
  FiTrash2,
  FiTag,
  FiHash,
  FiTruck,
  FiPercent,
  FiCreditCard,
  FiActivity,
  FiSave,
  FiXCircle,
  FiArrowRight,
} from "react-icons/fi";

// Mock DB data
const mockCustomers = [
  {
    id: "CUS-0001",
    phone: "01711111111",
    name: "Rahim Uddin",
    address: "House 12, Road 5",
  },
  {
    id: "CUS-0002",
    phone: "01722222222",
    name: "Karim Ahmed",
    address: "House 45, Road 12",
  },
];

// ✅ Utility: Generate Order ID
function generateOrderId() {
  const timestamp = Date.now().toString().slice(-5);
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `OID25${timestamp}${randomNum}`;
}

// ✅ Utility: Format date & time (12-hour)
function getOrderDateTime12h() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const hoursStr = String(hours).padStart(2, "0");
  return `${year}-${month}-${day}   ${hoursStr}:${minutes} ${ampm}`;
}

const AdminSaleFull = () => {
  const { productData, updateApi } = useContext(DataContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [copied, setCopied] = useState(false);
  const [loader, setLoader] = useState(false);
  const [success, setSuccess] = useState(false);

  const [order, setOrder] = useState({
    order_id: generateOrderId(),
    customer_id: "",
    order_date: getOrderDateTime12h(),
    status: "Pending",
    mode: "Online",
    subtotal: 0,
    shipping_cost: "",
    discount: "",
    total_amount: 0,
    payment: { method: "COD", status: "Pending" },
    shipping_address: { recipient_name: "", phone: "", address_line1: "" },
    items: [
      { product_id: "", product_name: "", quantity: 1, product_price: 0 },
    ],
  });

  // ✅ Copy OID
  const handleCopy = () => {
    navigator.clipboard.writeText(order.order_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Handle customer autofill
  const handleCustomerPhone = (phone) => {
    const customer = mockCustomers.find((c) => c.phone === phone);
    setOrder((prev) => ({
      ...prev,
      customer_id: customer ? customer.id : "",
      shipping_address: {
        ...prev.shipping_address,
        phone,
        recipient_name: customer?.name || "",
        address_line1: customer?.address || "",
      },
    }));
  };

  // Product updates
  const handleItemChange = (idx, field, value) => {
    const items = [...order.items];
    if (field === "product_id") {
      items[idx][field] = value;
      const product = productData.find((p) => p.pID === value);
      if (product) {
        items[idx] = {
          ...items[idx],
          product_id: product.pID,
          product_name: product.name,
          product_comments: product.comments,
          product_price: product.price || 0,
        };
      }
    } else if (field === "quantity" || field === "product_price") {
      items[idx][field] = Number(value);
    } else {
      items[idx][field] = value;
    }
    setOrder((prev) => ({ ...prev, items }));
  };

  // Add/Remove products
  const addItem = () =>
    setOrder((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { product_id: "", product_name: "", quantity: 1, product_price: 0 },
      ],
    }));
  const removeItem = (idx) => {
    const items = order.items.filter((_, i) => i !== idx);
    setOrder((prev) => ({ ...prev, items }));
  };

  // Auto calculate totals
  useEffect(() => {
    const subtotal = order.items.reduce(
      (sum, i) => sum + i.product_price * i.quantity,
      0
    );
    const shipping = Number(order.shipping_cost || 0);
    const discount = Number(order.discount || 0);
    const total_amount = subtotal + shipping - discount;
    setOrder((prev) => ({ ...prev, subtotal, total_amount }));
  }, [order.items, order.shipping_cost, order.discount]);

  // Handle shipping/discount
  const handleShippingChange = (e) => {
    const value = e.target.value === "" ? "" : Number(e.target.value);
    setOrder((prev) => ({ ...prev, shipping_cost: value }));
  };
  const handleDiscountChange = (e) => {
    const value = e.target.value === "" ? "" : Number(e.target.value);
    setOrder((prev) => ({ ...prev, discount: value }));
  };

  // ✅ Submit order
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ----------------------------------
    MySwal.fire({
      title: (
        <p className="text-xl font-semibold text-blue-600">Processing...</p>
      ),
      html: (
        <p className="text-gray-600">Please wait while we create your order.</p>
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

    try {
      const res = await axios.post(
        "https://fabribuzz.onrender.com/api/order/create-order",
        order
      );

      // Update success message
      MySwal.hideLoading();
      MySwal.update({
        icon: "success",
        title: (
          <p className="text-green-600 text-xl font-bold">Order Created ✅</p>
        ),
        html: (
          <p className="text-gray-700">
            Order <b>#{res.data.order_id}</b> has been successfully updated!
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
      updateApi();
      handleNewSale();
    } catch (error) {
      console.error(
        "Error saving order:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // ✅ Create new order reset
  function handleNewSale() {
    setOrder({
      order_id: generateOrderId(),
      customer_id: "",
      order_date: getOrderDateTime12h(),
      status: "Pending",
      mode: "Online",
      subtotal: 0,
      shipping_cost: "",
      discount: "",
      total_amount: 0,
      payment: { method: "COD", status: "Pending" },
      shipping_address: {
        recipient_name: "",
        phone: "",
        address_line1: "",
        email: "",
      },
      items: [
        {
          product_id: "",
          product_name: "",
          quantity: 1,
          product_price: 0,
          product_comments: "",
        },
      ],
    });
    setSuccess(false);
  }

  return (
    <div className="max-w-full mx-auto relative">
      <Navbar pageTitle="Create New Sale" />
      {/* //data form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-2 min-h-screen bg-white shadow rounded p-2"
      >
        {/* 🧾 Order Info */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
          {/* Header Section */}
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-indigo-600 rounded-full"></div>
              <h3 className="font-bold text-slate-800 text-base uppercase tracking-wider">
                Order Information
              </h3>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Order ID - Read Only */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">
                  Order ID
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    value={order.order_id}
                    readOnly
                    className="w-full bg-slate-50 border border-slate-200 text-slate-600 font-mono text-sm px-4 py-2.5 rounded-lg cursor-not-allowed"
                  />
                  {/* Subtle "Locked" Icon could go here */}
                </div>
              </div>

              {/* Date & Time - Read Only */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">
                  Date & Placement
                </label>
                <input
                  type="text"
                  value={order.order_date}
                  readOnly
                  className="w-full bg-slate-50 border border-slate-200 text-slate-600 text-sm px-4 py-2.5 rounded-lg cursor-not-allowed"
                />
              </div>

              {/* Status Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">
                  Order Status
                </label>
                <div className="relative">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      setOrder({ ...order, status: e.target.value })
                    }
                    className="w-full appearance-none bg-white border border-slate-200 text-slate-700 text-sm px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none cursor-pointer"
                  >
                    <option value="Pending">🕒 Pending</option>
                    <option value="Confirmed">✅ Confirmed</option>
                    <option value="Shipped">📦 Shipped</option>
                    <option value="Delivered">🎉 Delivered</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Mode Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">
                  Channel / Mode
                </label>
                <div className="relative">
                  <select
                    value={order.Mode}
                    onChange={(e) =>
                      setOrder({ ...order, Mode: e.target.value })
                    }
                    className="w-full appearance-none bg-white border border-slate-200 text-slate-700 text-sm px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none cursor-pointer"
                  >
                    <option value="Online">🌐 Online Store</option>
                    <option value="Offline">🏢 POS / Offline</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Customer Info Section */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-8 transition-all hover:shadow-md">
          {/* Section Header */}
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
              <h3 className="font-bold text-slate-800 text-base uppercase tracking-wider">
                Customer Details
              </h3>
            </div>
            <span className="text-[10px] bg-blue-100 text-blue-700 font-black px-2 py-0.5 rounded-md uppercase">
              Shipping Recipient
            </span>
          </div>

          {/* Form Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <FiPhone size={16} />
                  </div>
                  <input
                    type="text"
                    placeholder="01XXXXXXXXX"
                    value={order.shipping_address.phone}
                    onChange={(e) => handleCustomerPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                    required
                  />
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">
                  Recipient Name <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <FiUser size={16} />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Rahim Uddin"
                    value={order.shipping_address.recipient_name}
                    onChange={(e) =>
                      setOrder({
                        ...order,
                        shipping_address: {
                          ...order.shipping_address,
                          recipient_name: e.target.value,
                        },
                      })
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                    required
                  />
                </div>
              </div>

              {/* Full Address */}
              <div className="space-y-1.5 lg:col-span-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">
                  Shipping Address
                </label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <FiMapPin size={16} />
                  </div>
                  <input
                    type="text"
                    placeholder="House, Road, Area..."
                    value={order.shipping_address.address_line1}
                    onChange={(e) =>
                      setOrder({
                        ...order,
                        shipping_address: {
                          ...order.shipping_address,
                          address_line1: e.target.value,
                        },
                      })
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <FiMail size={16} />
                  </div>
                  <input
                    type="email"
                    placeholder="customer@example.com"
                    value={order.shipping_address.email}
                    onChange={(e) =>
                      setOrder({
                        ...order,
                        shipping_address: {
                          ...order.shipping_address,
                          email: e.target.value,
                        },
                      })
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 📦 Product List */}
        {/* 📦 Product List Section */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-8">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
              <h3 className="font-bold text-slate-800 text-base uppercase tracking-wider">
                Line Items
              </h3>
            </div>
            <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2 py-1 rounded">
              {order.items.length} {order.items.length === 1 ? "Item" : "Items"}
            </span>
          </div>

          <div className="p-4 md:p-6 space-y-4">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="relative group grid grid-cols-1 lg:grid-cols-12 gap-4 items-start p-4 rounded-xl border border-slate-100 bg-slate-50/30 hover:bg-slate-50 hover:border-slate-200 transition-all"
              >
                {/* Product ID & Name */}
                <div className="lg:col-span-4 space-y-3">
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      <FiHash /> Product ID
                    </label>
                    <input
                      type="text"
                      placeholder="SKU-XXXX"
                      required
                      value={item.product_id}
                      onChange={(e) =>
                        handleItemChange(idx, "product_id", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      <FiPackage /> Product Name
                    </label>
                    <input
                      type="text"
                      placeholder="Full product title..."
                      value={item.product_name}
                      onChange={(e) =>
                        handleItemChange(idx, "product_name", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium"
                      required
                    />
                  </div>
                </div>

                {/* Price & Quantity */}
                <div className="lg:col-span-3 grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Unit Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                        $
                      </span>
                      <input
                        type="number"
                        value={item.product_price}
                        onChange={(e) =>
                          handleItemChange(idx, "product_price", e.target.value)
                        }
                        className="w-full pl-7 pr-3 py-2 bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-semibold"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Qty
                    </label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(idx, "quantity", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-center"
                      required
                    />
                  </div>
                </div>

                {/* Comments/Variants */}
                <div className="lg:col-span-4 space-y-1.5">
                  <label className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-1">
                    <FiTag /> Specifications / Variations
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Color: Black, Size: XL, Origin: USA..."
                    required
                    value={item.product_comments}
                    onChange={(e) =>
                      handleItemChange(idx, "product_comments", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-emerald-50/30 border border-emerald-100 text-slate-700 text-sm rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all italic"
                  />
                </div>

                {/* Remove Button */}
                <div className="lg:col-span-1 flex lg:justify-center items-center pt-6">
                  {order.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Remove Item"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  )}
                </div>

                {/* Line Total Badge (Optional but Industry Standard) */}
                <div className="absolute top-2 right-2 hidden group-hover:block transition-all">
                  <span className="text-[10px] font-bold bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded shadow-sm">
                    Line Total: $
                    {(item.product_price * item.quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}

            {/* Add Item Button */}
            <button
              type="button"
              onClick={addItem}
              className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center gap-2 text-slate-500 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all font-bold text-sm uppercase tracking-widest"
            >
              <FiPlus size={18} /> Add New Line Item
            </button>
          </div>
        </div>
        {/* 💳 Payment & Shipping Summary Section */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-8">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-6 bg-amber-500 rounded-full"></div>
              <h3 className="font-bold text-slate-800 text-base uppercase tracking-wider">
                Logistics & Settlement
              </h3>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Shipping Cost */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">
                  <FiTruck className="text-amber-500" /> Shipping Cost
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                    ৳
                  </span>
                  <input
                    type="number"
                    placeholder="0"
                    required
                    value={order.shipping_cost}
                    onChange={handleShippingChange}
                    className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none font-semibold"
                  />
                </div>
              </div>

              {/* Discount */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">
                  <FiPercent className="text-rose-500" /> Discount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                    ৳
                  </span>
                  <input
                    type="number"
                    placeholder="0"
                    required
                    value={order.discount}
                    onChange={handleDiscountChange}
                    className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all outline-none font-semibold text-rose-600"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">
                  <FiCreditCard className="text-indigo-500" /> Payment Method
                </label>
                <div className="relative">
                  <select
                    value={order.payment.method}
                    onChange={(e) =>
                      setOrder({
                        ...order,
                        payment: { ...order.payment, method: e.target.value },
                      })
                    }
                    className="w-full appearance-none bg-white border border-slate-200 text-slate-700 text-sm pl-4 pr-10 py-2.5 rounded-lg focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none cursor-pointer font-medium"
                  >
                    <option value="COD">💵 Cash on Delivery (COD)</option>
                    <option value="cash">💰 Cash</option>
                    <option value="card">💳 Card Payment</option>
                    <option value="bkash">📱 bKash</option>
                    <option value="nagad">📱 Nagad</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Payment Status */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">
                  <FiActivity className="text-slate-500" /> Payment Status
                </label>
                <div className="relative">
                  <select
                    value={order.payment.status}
                    onChange={(e) =>
                      setOrder({
                        ...order,
                        payment: { ...order.payment, status: e.target.value },
                      })
                    }
                    className={`w-full appearance-none border text-sm pl-4 pr-10 py-2.5 rounded-lg focus:ring-4 transition-all outline-none cursor-pointer font-bold uppercase tracking-wide
              ${
                order.payment.status === "Completed"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700 focus:ring-emerald-500/10 focus:border-emerald-500"
                  : "bg-amber-50 border-amber-200 text-amber-700 focus:ring-amber-500/10 focus:border-amber-500"
              }`}
                  >
                    <option value="Pending">🟠 Unpaid / Pending</option>
                    <option value="Completed">🟢 Paid / Completed</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 💰 Totals & Actions Section */}
        <div className="mt-10 mb-20">
          <div className="bg-slate-900 rounded-2xl p-6 md:p-8 shadow-xl">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
              {/* Detailed Financial Breakdown */}
              <div className="flex flex-wrap gap-6 md:gap-12">
                <div className="space-y-1">
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                    Subtotal
                  </p>
                  <p className="text-white text-xl font-medium">
                    ৳
                    {order.subtotal.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                    Adjustments
                  </p>
                  <p className="text-slate-300 text-xl font-medium">
                    {Number(order.shipping_cost || 0) > 0 && (
                      <span className="text-emerald-400">
                        +{order.shipping_cost}
                      </span>
                    )}
                    {Number(order.discount || 0) > 0 && (
                      <span className="text-rose-400 ml-2">
                        -{order.discount}
                      </span>
                    )}
                    {!order.shipping_cost && !order.discount && "0.00"}
                  </p>
                </div>

                <div className="space-y-1 border-l border-slate-700 pl-6 md:pl-12">
                  <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
                    Grand Total
                  </p>
                  <p className="text-indigo-400 text-4xl font-black tracking-tight">
                    ৳
                    {order.total_amount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>

              {/* 🧾 Action Buttons */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl font-bold transition-all border border-transparent hover:border-slate-700"
                >
                  <FiXCircle size={18} />
                  <span>Discard</span>
                </button>

                <button
                  type="submit"
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-10 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] group"
                >
                  <FiSave size={18} />
                  <span>SAVE ORDER</span>
                  <FiArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-center text-slate-400 text-[10px] mt-6 uppercase tracking-[0.3em] font-medium">
            Review all line items before finalizing the transaction
          </p>
        </div>
      </form>
    </div>
  );
};

export default AdminSaleFull;
