import React, { useContext, useState, useEffect, useRef, useMemo } from "react";
import { Plus, Minus, ChevronDown, Check } from "lucide-react";
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
  FiChevronDown,
} from "react-icons/fi";

function generateOrderId() {
  const ms = Date.now().toString().slice(-4);
  const random = Math.floor(10 + Math.random() * 90).toString();
  return ms + random;
}

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
  const { productData, adminData, updateApi, customerData } =
    useContext(DataContext);

  const navigate = useNavigate();

  // Exact Model Schema Matching Screenshot
  const [order, setOrder] = useState({
    order_id: generateOrderId(),
    order_date: getOrderDateTime12h(),
    mode: null,
    customer_id: "",
    items: [
      {
        product_id: "",
        skuID: "",
        product_name: "",
        quantity: 1,
        product_price: 0,
        imei: "",
        discount: 0,
        product_comments: "",
      },
    ],
    subtotal: 0,
    total_amount: 0,
    shipping_address: {
      recipient_name: "",
      phone: "",
      address_line1: "",
      email: "",
    },
    courier: {
      name: "N/A",
      consignment_id: "N/A",
      delivery_status: "Pending",
      payment_status: "Pending",
      payment_method: "COD",
      del_type: "COD",
      total_cod_amount: 0,
      delivery_charge: 0,
      cod_fee: 0,
      cod_percent: 1,
    },
    discount: "", // Admin manual order discount input
  }); // States

  const [policeStationsList, setPoliceStationsList] = useState([]);
  const [stationSearch, setStationSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const [success, setSuccess] = useState(false);

  const [village, setVillage] = useState("");
  const [policeDistrict, setPoliceDistrict] = useState({
    police_station: "",
    district: "",
  });

  // Define filteredStations using useMemo
  const filteredStations = useMemo(() => {
    if (!policeStationsList || policeStationsList.length === 0) return [];
    if (!stationSearch || !stationSearch.trim()) {
      return policeStationsList.slice(0, 40);
    }

    const query = stationSearch.toLowerCase().trim();
    return policeStationsList
      .filter((item) => {
        const station = (item.police_station || "").toLowerCase();
        const district = (item.district || "").toLowerCase();
        return station.includes(query) || district.includes(query);
      })
      .slice(0, 40);
  }, [stationSearch, policeStationsList]);

  const handleSelectStation = (item) => {
    setPoliceDistrict({
      police_station: item.police_station,
      district: item.district,
    });

    setOrder((prev) => ({
      ...prev,
      shipping_address: {
        ...prev.shipping_address,
        address_line1: [village, item.police_station, item.district]
          .filter(Boolean)
          .join(", "),
      },
    }));

    setIsDropdownOpen(false);
    setStationSearch("");
  };

  useEffect(() => {
    setOrder((prev) => ({
      ...prev,
      shipping_address: {
        ...prev.shipping_address,
        address_line1: [
          village,
          policeDistrict.police_station,
          policeDistrict.district,
        ]
          .filter(Boolean)
          .join(", "),
      },
    }));
  }, [village, policeDistrict]);

  useEffect(() => {
    let isMounted = true;

    const fetchStations = async () => {
      try {
        const res = await axios.get(
          "https://api.victusbyte.com/api/steadfast/police-station",
        );

        // Log the exact structure in console to see the actual keys
        console.log("Steadfast API Raw Response:", res.data);

        let rawData = res.data;
        // Drill down if nested inside data, response, or result
        if (rawData?.data) rawData = rawData.data;
        if (rawData?.data) rawData = rawData.data; // in case of { status: 200, data: { data: [...] } }

        const flatList = [];

        // Helper function to extract a string or name
        const extractName = (val) => {
          if (!val) return "";
          if (typeof val === "string") return val.trim();
          if (typeof val === "object") {
            return (
              val.name ||
              val.police_station ||
              val.thana ||
              val.title ||
              val.station_name ||
              ""
            ).trim();
          }
          return String(val).trim();
        };

        if (Array.isArray(rawData)) {
          rawData.forEach((item) => {
            if (!item) return;

            const stationDirect =
              item.police_station ||
              item.thana ||
              item.station ||
              item.policeStation ||
              item.ps_name;

            const districtDirect =
              item.district ||
              item.district_name ||
              item.dist ||
              item.districtName;

            if (stationDirect && typeof stationDirect === "string") {
              flatList.push({
                police_station: stationDirect.trim(),
                district: (districtDirect || "N/A").trim(),
              });
              return;
            }

            // Case B: Item represents a District with a nested array of stations
            // Find which property contains the array
            let stationsArray = null;
            let districtName = districtDirect || item.name || item.title || "";

            for (const key of Object.keys(item)) {
              if (Array.isArray(item[key])) {
                stationsArray = item[key];
                break;
              }
            }

            if (stationsArray) {
              stationsArray.forEach((st) => {
                const name = extractName(st);
                if (name) {
                  flatList.push({
                    police_station: name,
                    district: districtName || "N/A",
                  });
                }
              });
            }
          });
        } else if (typeof rawData === "object" && rawData !== null) {
          // Case C: Dictionary structure: { "Dhaka": ["Mirpur", ...], "Chattogram": [...] }
          Object.entries(rawData).forEach(([distKey, val]) => {
            if (Array.isArray(val)) {
              val.forEach((st) => {
                const name = extractName(st);
                if (name) {
                  flatList.push({
                    police_station: name,
                    district: distKey.trim(),
                  });
                }
              });
            }
          });
        }

        console.log(
          "Extracted Stations Count:",
          flatList.length,
          flatList.slice(0, 5),
        );

        if (isMounted) {
          setPoliceStationsList(flatList);
        }
      } catch (err) {
        console.error("Failed to load police stations:", err);
      }
    };

    fetchStations();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle customer autofill
  const handleCustomerPhone = (phone) => {
    const customer = customerData?.find((c) => c.phone === phone);
    setOrder((prev) => ({
      ...prev,
      customer_id: customer ? customer.cID : "",
      shipping_address: {
        ...prev.shipping_address,
        phone,
        recipient_name: customer?.userName || "",
        address_line1: customer?.address || "",
        email: customer?.email || "",
      },
    }));
  };

  // Product updates
  const handleItemChange = (idx, field, value) => {
    const items = [...order.items];
    if (field === "product_id") {
      items[idx][field] = value;
      const product = productData?.find((p) => p.pID === value);
      if (product) {
        const resolvedPrice =
          typeof product.price === "object"
            ? product.price.selling || 0
            : Number(product.price) || 0;

        items[idx] = {
          ...items[idx],
          product_id: product.pID,
          product_name: product.name,
          product_comments: product.comments || "",
          product_price: resolvedPrice,
          skuID: product.skuID || product.sku || "",
          imei: product.imei || "",
          discount: Number(product.discount || 0),
        };
      }
    } else if (
      field === "quantity" ||
      field === "product_price" ||
      field === "discount"
    ) {
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
        {
          product_id: "",
          skuID: "",
          product_name: "",
          quantity: 1,
          product_price: 0,
          imei: "",
          discount: 0,
          product_comments: "",
        },
      ],
    }));

  const removeItem = (idx) => {
    const items = order.items.filter((_, i) => i !== idx);
    setOrder((prev) => ({ ...prev, items }));
  };

  // Auto calculate totals
  useEffect(() => {
    const subtotal = order.items.reduce((sum, item) => {
      const unitPrice =
        typeof item.product_price === "object"
          ? Number(item.product_price?.selling || 0)
          : Number(item.product_price || 0);

      const itemDiscount = Number(item.discount || 0);
      const effectivePrice = Math.max(0, unitPrice - itemDiscount);

      return sum + effectivePrice * (Number(item.quantity) || 1);
    }, 0);

    const shipping = Number(order.courier.delivery_charge || 0);
    const manualDiscount = Number(order.discount || 0);
    const total_amount = Math.max(0, subtotal + shipping - manualDiscount);

    setOrder((prev) => ({
      ...prev,
      subtotal,
      total_amount,
      courier: {
        ...prev.courier,
        total_cod_amount: total_amount > 0 ? total_amount : 0,
      },
    }));
  }, [order.items, order.courier.delivery_charge, order.discount]);

  // Handle shipping/discount
  const handleShippingChange = (e) => {
    const value = e.target.value === "" ? "" : Number(e.target.value);
    setOrder((prev) => ({
      ...prev,
      courier: {
        ...prev.courier,
        delivery_charge: value,
      },
    }));
  };

  const handleDiscountChange = (e) => {
    const value = e.target.value === "" ? "" : Number(e.target.value);
    setOrder((prev) => ({ ...prev, discount: value }));
  };

  console.log(order);

  // Submit order
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!order.mode) {
      MySwal.fire({
        icon: "error",
        title: "Missing Saler ID",
        text: "Please select an admin before saving the order.",
        confirmButtonColor: "#4f46e5",
      });
      return;
    }

    const manualDiscount = Number(order.discount || 0);

    // Validate village and police station/district
    if (!village.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Village Required",
        text: "Please enter the village name.",
      });
      return;
    }

    if (!policeDistrict.police_station || !policeDistrict.district) {
      Swal.fire({
        icon: "warning",
        title: "Location Required",
        text: "Please select a police station and district.",
      });
      return;
    }

    // Structure model strictly according to MongoDB screenshot
    const orderToSubmit = {
      order_id: String(order.order_id),
      order_date: order.order_date,
      // Coupon Object with value = price and others null
      coupon:
        manualDiscount > 0
          ? {
              couponID: "manual",
              value: manualDiscount,
              minTK: null,
            }
          : null,
      mode: String(order.mode),
      customer_id: order.customer_id,
      items: order.items.map((item) => ({
        product_id: item.product_id,
        skuID: item.skuID || "",
        product_name: item.product_name,
        quantity: Number(item.quantity),
        product_price:
          typeof item.product_price === "object"
            ? Number(item.product_price.selling || 0)
            : Number(item.product_price || 0),
        imei: item.imei || "",
        discount: Number(item.discount || 0),
      })),
      subtotal: Number(order.subtotal),
      total_amount: Number(order.total_amount),
      shipping_address: {
        recipient_name: order.shipping_address.recipient_name,
        phone: order.shipping_address.phone,
        address_line1: order.shipping_address.address_line1,
        email: order.shipping_address.email,
      },
      courier: {
        name: order.courier.name,
        consignment_id: order.courier.consignment_id,
        delivery_status: order.courier.delivery_status,
        payment_status: order.courier.payment_status,
        payment_method: order.courier.payment_method,
        del_type: order.courier.del_type,
        total_cod_amount: Number(
          order.courier.total_cod_amount || order.total_amount,
        ),
        delivery_charge: Number(order.courier.delivery_charge || 0),
        cod_fee: Number(order.courier.cod_fee || 0),
        cod_percent: Number(order.courier.cod_percent || 1),
      },
    };

    MySwal.fire({
      title: (
        <p className="text-xl font-semibold text-blue-600">Processing...</p>
      ),
      html: (
        <p className="text-gray-600">Please wait while we create your order.</p>
      ),
      allowOutsideClick: false,
      didOpen: () => MySwal.showLoading(),
    });

    try {
      const res = await axios.post(
        "https://api.victusbyte.com/api/order/create-order",
        orderToSubmit,
      );

      const finalId = res.data?.order?.order_id || order.order_id || "N/A";

      MySwal.hideLoading();
      MySwal.update({
        icon: "success",
        title: (
          <p className="text-green-600 text-xl font-bold">Order Created ✅</p>
        ),
        html: (
          <div className="text-center">
            <p className="text-gray-700">
              Order <b className="text-indigo-600">#{finalId}</b> created
              successfully!
            </p>
          </div>
        ),
        showConfirmButton: true,
        confirmButtonText: "Done",
        buttonsStyling: false,
        customClass: {
          confirmButton:
            "bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors",
        },
      });

      if (updateApi) updateApi();
      handleNewSale();
    } catch (error) {
      MySwal.hideLoading();
      const errorMsg = error.response?.data?.message || "Failed to save order.";

      MySwal.fire({
        icon: "error",
        title: "Save Failed",
        text: errorMsg,
      });
      console.error("Error saving order:", error);
    }
  };

  // Reset form
  function handleNewSale() {
    setOrder({
      order_id: generateOrderId(),
      order_date: getOrderDateTime12h(),
      mode: null,
      customer_id: "",
      items: [
        {
          product_id: "",
          skuID: "",
          product_name: "",
          quantity: 1,
          product_price: 0,
          imei: "",
          discount: 0,
          product_comments: "",
        },
      ],
      subtotal: 0,
      total_amount: 0,
      shipping_address: {
        recipient_name: "",
        phone: "",
        address_line1: "",
        email: "",
      },
      courier: {
        name: "N/A",
        consignment_id: "N/A",
        delivery_status: "Pending",
        payment_status: "Pending",
        payment_method: "COD",
        del_type: "COD",
        total_cod_amount: 0,
        delivery_charge: 0,
        cod_fee: 0,
        cod_percent: 1,
      },
      discount: "",
    });
    setSuccess(false);
  }

  return (
    <div className="max-w-full mx-auto relative mt-12 md:mt-0">
      <Navbar pageTitle="Create New Sale" />
      <form
        onSubmit={handleSubmit}
        className="space-y- bg-white shadow rounded"
      >
        {/* 🧾 Order Info */}
        <div className="bg-white pb-2 overflow-hidden">
          <div className="px-6 py-2 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-indigo-600 rounded-full"></div>
              <h3 className="font-bold text-slate-800 text-base md:uppercase tracking-wider">
                Order Information
              </h3>
            </div>
          </div>

          <div className="p-4">
            <div className="grid -mt-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Order ID */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">
                  Order ID
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    value={"OID - " + order.order_id}
                    readOnly
                    className="w-full bg-slate-100/70 border border-slate-300 text-slate-700 font-medium font-mono text-sm px-4 py-2 rounded cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Date & Time */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">
                  Date & Placement
                </label>
                <input
                  type="text"
                  value={order.order_date}
                  readOnly
                  className="w-full bg-slate-100/70 border border-slate-300 text-slate-600 text-sm px-4 py-2 rounded cursor-not-allowed"
                />
              </div>

              {/* Status Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">
                  Order Status
                </label>
                <div className="relative">
                  <select
                    value={order.courier.delivery_status}
                    onChange={(e) =>
                      setOrder({
                        ...order,
                        courier: {
                          ...order.courier,
                          delivery_status: e.target.value,
                        },
                      })
                    }
                    className="w-full appearance-none bg-white border border-slate-300 text-slate-700 text-sm px-4 py-2 rounded focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none cursor-pointer"
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
                <label className="text-xs font-bold text-slate-500 uppercase tracking ml-1">
                  Channel / Mode / Saler ID
                </label>
                <div className="relative">
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="text-blue-600" size={18} />
                    </div>

                    <select
                      value={order.mode || ""}
                      onChange={(e) =>
                        setOrder({ ...order, mode: e.target.value })
                      }
                      className="block w-full pl-10 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded appearance-none border bg-white"
                    >
                      <option value="">Select Saler</option>
                      {adminData?.map((admin) => (
                        <option key={admin.adminID} value={admin.adminID}>
                          {admin.fullName} ({admin.adminID})
                        </option>
                      ))}
                    </select>
                  </div>
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

        {/* Customer Info */}
        <div className="relative z-40 bg-white pb-2 border border-slate-200 overflow-visible transition-all">
          <div className="px-6 py-2 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-indigo-600 rounded-full"></div>
              <h3 className="font-bold text-slate-800 text-base md:uppercase tracking-wider">
                Customer Information
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 p-5">
            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">
                Phone Number
              </label>

              <input
                type="text"
                value={order.shipping_address.phone || ""}
                onChange={(e) => handleCustomerPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Recipient Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">
                Recipient Name
              </label>

              <input
                type="text"
                value={order.shipping_address.recipient_name || ""}
                onChange={(e) =>
                  setOrder((prev) => ({
                    ...prev,
                    shipping_address: {
                      ...prev.shipping_address,
                      recipient_name: e.target.value,
                    },
                  }))
                }
                placeholder="Customer name"
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Village */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">
                Village
              </label>

              <input
                type="text"
                value={village || ""}
                required
                onChange={(e) => setVillage(e.target.value)}
                placeholder="Enter village / area"
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Police Station + District Dropdown */}
            <div className="relative z-50 space-y-1.5" ref={dropdownRef}>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">
                Police Station / District
              </label>

              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="w-full flex items-center justify-between gap-2 border border-slate-300 rounded px-3 py-2 text-sm text-left outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <span className="truncate">
                  {policeDistrict.police_station && policeDistrict.district
                    ? `${policeDistrict.police_station}, ${policeDistrict.district}`
                    : "Select Police Station & District"}
                </span>

                <ChevronDown
                  size={16}
                  className={`shrink-0 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-1 z-[999] bg-white border border-slate-300 rounded shadow-xl overflow-hidden">
                  <div className="p-2 border-b border-slate-100">
                    <input
                      type="text"
                      value={stationSearch}
                      onChange={(e) => setStationSearch(e.target.value)}
                      placeholder="Search police station or district..."
                      autoFocus
                      className="w-full border border-slate-200 rounded px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="max-h-60 overflow-y-auto">
                    {filteredStations.length > 0 ? (
                      filteredStations.map((item, idx) => {
                        const isSelected =
                          order.shipping_address.police_station ===
                            item.police_station &&
                          order.shipping_address.district === item.district;

                        return (
                          <button
                            key={`${item.police_station}-${item.district}-${idx}`}
                            type="button"
                            onClick={() => handleSelectStation(item)}
                            className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-left hover:bg-blue-50 ${
                              isSelected
                                ? "bg-blue-50 text-blue-700 font-semibold"
                                : "text-slate-700"
                            }`}
                          >
                            <span>
                              {item.police_station}, {item.district}
                            </span>

                            {isSelected && (
                              <Check
                                size={16}
                                className="shrink-0 text-blue-600"
                              />
                            )}
                          </button>
                        );
                      })
                    ) : (
                      <p className="px-3 py-4 text-sm text-slate-500 text-center">
                        No police station found.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">
                Email Address
              </label>

              <input
                type="email"
                value={order.shipping_address.email || ""}
                onChange={(e) =>
                  setOrder((prev) => ({
                    ...prev,
                    shipping_address: {
                      ...prev.shipping_address,
                      email: e.target.value,
                    },
                  }))
                }
                placeholder="customer@example.com"
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 📦 Product List Section */}
        <div className="mt-2 z-0 bg-white overflow-hidden">
          <div className="px-6 py-2 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
              <h3 className="font-bold text-slate-800 text-base uppercase tracking-wider">
                Line Items
              </h3>
            </div>
            <span className="text-xs font-bold text-blue-700 px-2 py-1 rounded">
              {order.items.length} {order.items.length === 1 ? "Item" : "Items"}
            </span>
          </div>

          <div className="space-y-4">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="relative  group grid grid-cols-1 lg:grid-cols-12 gap-4 items-start p-4 rounded-xl border border-slate-100 bg-slate-50/30 transition-all"
              >
                {/* Product ID & Name */}
                <div className="lg:col-span-4 space-y-3">
                  <div className="space-y-1.5">
                    <label className="flex text-xs font-bold text-slate-500 uppercase tracking-tight gap-1 ml-1">
                      <FiHash /> Product ID
                    </label>
                    <input
                      type="text"
                      placeholder="PID-XXXX"
                      required
                      value={item.product_id}
                      onChange={(e) =>
                        handleItemChange(idx, "product_id", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-300 text-slate-700 text-sm rounded focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="flex text-xs font-bold text-slate-500 uppercase tracking-tight ml-1 gap-1">
                      <FiPackage /> Product Name
                    </label>
                    <input
                      type="text"
                      placeholder="Full product name..."
                      value={item.product_name}
                      onChange={(e) =>
                        handleItemChange(idx, "product_name", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-300 text-slate-700 text-sm rounded focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium"
                      required
                    />
                  </div>
                </div>

                {/* Price & Quantity */}
                <div className="lg:col-span-3 grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">
                      Unit Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                        ৳
                      </span>
                      <input
                        type="number"
                        disabled
                        value={
                          typeof item.product_price === "object"
                            ? item.product_price.selling
                            : item.product_price
                        }
                        onChange={(e) =>
                          handleItemChange(idx, "product_price", e.target.value)
                        }
                        className="w-full pl-7 pr-3 py-2 bg-white border border-slate-300 text-slate-700 text-sm rounded focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-semibold"
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
                      className="w-full px-3 py-2 bg-white border border-slate-300 text-slate-700 text-sm rounded focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-center"
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
                    className="w-full px-3 py-2 bg-emerald-50/30 border border-emerald-200 text-slate-700 text-sm rounded focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all italic"
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

                {/* Line Total Badge */}
                <div className="absolute top-2 right-2 hidden group-hover:block transition-all">
                  <span className="text-[10px] font-bold bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded shadow-sm">
                    Line Total: ৳
                    {(
                      Math.max(
                        0,
                        (typeof item.product_price === "object"
                          ? item.product_price.selling
                          : item.product_price) - (item.discount || 0),
                      ) * item.quantity
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}

            {/* Add Item Button */}
            <button
              type="button"
              onClick={addItem}
              className="md:w-1/4 w-full mb-5 bg-green-100 md:mb-0 md:mx-auto py-2 border-2 border-dashed border-slate-300 rounded-full flex items-center justify-center gap-2 text-slate-500 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all font-bold text-sm uppercase tracking-widest"
            >
              <FiPlus size={18} /> Add New Line Item
            </button>
          </div>
        </div>

        {/* 💳 Payment & Shipping Summary Section */}
        <div className="mt-2  bg-white overflow-hidden">
          <div className="px-6 py-2 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-6 bg-amber-500 rounded-full"></div>
              <h3 className="font-bold text-slate-800 text-base uppercase tracking-wider">
                Logistics & Settlement
              </h3>
            </div>
          </div>

          <div className="p-4">
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
                    value={order.courier.delivery_charge}
                    onChange={handleShippingChange}
                    className="w-full pl-8 pr-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm rounded focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none font-semibold"
                  />
                </div>
              </div>

              {/* Discount / Coupon Value */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">
                  <FiPercent className="text-rose-500" /> Discount (Coupon)
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
                    className="w-full pl-8 pr-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm rounded focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all outline-none font-semibold"
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
                    value={order.courier.del_type}
                    onChange={(e) =>
                      setOrder({
                        ...order,
                        courier: {
                          ...order.courier,
                          del_type: e.target.value,
                          payment_method: e.target.value,
                        },
                      })
                    }
                    className="w-full appearance-none bg-white border border-slate-300 text-slate-700 text-sm pl-4 pr-10 py-2 rounded focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none cursor-pointer font-medium"
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
                    value={order.courier.payment_status}
                    onChange={(e) =>
                      setOrder({
                        ...order,
                        courier: {
                          ...order.courier,
                          payment_status: e.target.value,
                        },
                      })
                    }
                    className={`w-full appearance-none border text-sm pl-4 pr-10 py-2 rounded focus:ring-4 transition-all outline-none cursor-pointer font-bold uppercase tracking-wide
              ${
                order.courier.payment_status === "Completed"
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
        <div className="mt-10 p-4 mb-20">
          <div className="bg-slate-900 rounded p-6 shadow-xl">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
              {/* Financial Breakdown */}
              <div className="flex flex-wrap gap-6 md:gap-12">
                <div className="space-y-1">
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                    Subtotal
                  </p>
                  <p className="text-white md:text-xl text-lg font-medium">
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
                  <p className="text-slate-300 md:text-xl text-lg font-medium">
                    {Number(order.courier.delivery_charge || 0) > 0 && (
                      <span className="text-emerald-400">
                        +{order.courier.delivery_charge}
                      </span>
                    )}
                    {Number(order.discount || 0) > 0 && (
                      <span className="text-rose-400 ml-2">
                        -{order.discount}
                      </span>
                    )}
                    {!order.courier.delivery_charge &&
                      !order.discount &&
                      "0.00"}
                  </p>
                </div>

                <div className="space-y-1 border-l border-slate-700 pl-6 md:pl-12">
                  <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
                    Grand Total
                  </p>
                  <p className="text-indigo-400 md:text-4xl text-2xl font-black tracking-tight">
                    ৳
                    {order.total_amount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 md:px-6 px-2 py-3.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl font-bold transition-all border border-transparent hover:border-slate-700"
                >
                  <FiXCircle size={18} />
                  <span className="text-sm md:text-md">Discard</span>
                </button>

                <button
                  type="submit"
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 md:px-10 px-2 md:py-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-black shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] group"
                >
                  <FiSave size={18} />
                  <span className="hidden md:block"> SAVE ORDER</span>
                  <span className="md:hidden text-sm md:text-md">SAVE</span>
                  <FiArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </div>
          </div>

          <p className="text-center text-slate-500 text-[10px] mt-6 uppercase tracking-[0.3em] font-medium">
            Review all line items before finalizing the transaction
          </p>
        </div>
      </form>
    </div>
  );
};

export default AdminSaleFull;
