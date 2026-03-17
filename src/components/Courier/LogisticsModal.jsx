import React, { useState } from "react";
import {
  FiX,
  FiSearch,
  FiTruck,
  FiSend,
  FiCheckCircle,
  FiPackage,
  FiMapPin,
} from "react-icons/fi";

const dummyOrders = [
  {
    order_id: "475891",
    order_date: "2026-03-17",
    customer: "Mamun or Rashid",
    total_amount: 44570,
    status: "Confirmed",
    shipping_address: {
      phone: "01712345678",
      address_line1: "House 12, Road 4, Dhanmondi, Dhaka City",
    },
    courier: {
      delivery_charge: 70, // Inside Dhaka
      cod_percent: 1,
      cash_status: "Pending",
      consignment_id: "N/A",
    },
  },
  {
    order_id: "475895",
    order_date: "2026-03-17",
    customer: "Ariful Islam",
    total_amount: 12500,
    status: "Confirmed",
    shipping_address: {
      phone: "01887654321",
      address_line1: "Miah Bari, Sonagazi, Feni",
    },
    courier: {
      delivery_charge: 130, // Outside Dhaka
      cod_percent: 1,
      cash_status: "Pending",
      consignment_id: "N/A",
    },
  },
  {
    order_id: "475899",
    order_date: "2026-03-17",
    customer: "Sultana Razia",
    total_amount: 8900,
    status: "Confirmed",
    shipping_address: {
      phone: "01911223344",
      address_line1: "Sector 7, Uttara, Dhaka City",
    },
    courier: {
      delivery_charge: 70,
      cod_percent: 1,
      cash_status: "Pending",
      consignment_id: "N/A",
    },
  },
];

const LogisticsModal = ({ isOpen, onClose, orders, onSendToCourier }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingId, setLoadingId] = useState(null);

  if (!isOpen) return null;

  // Filter only Confirmed orders and handle search
  const displayOrders =
    orders?.filter(
      (order) =>
        order.status === "Confirmed" &&
        (order.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.shipping_address.phone.includes(searchTerm)),
    ) || [];

  const handleSend = async (order) => {
    setLoadingId(order.order_id);
    await onSendToCourier(order); // Call the backend function passed via props
    setLoadingId(null);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative px-4 bg-slate-50 w-full max-w-7xl h-full max-h-[90vh] rounded shadow-xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Header Section */}
        <div className="bg-white  md:py-6 py-2 border-b flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
              <FiTruck className="text-white md:text-2xl" />
            </div>
            <div>
              <h2 className="md:text-2xl font-black text-slate-800 tracking-tight">
                Dispatch Command Center
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-rose-500"
          >
            <FiX size={28} />
          </button>
        </div>

        {/* Search & Stats Bar */}
        <div className=" py-4 bg-white border-b flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
            <input
              type="text"
              placeholder="Search ID or Customer Phone..."
              className="w-full pl-12 pr-4 py-2 bg-slate-300 placeholder:text-sm border-none rounded text-md font-medium focus:ring-2 focus:ring-indigo-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right flex md:flex-col gap-5 md:gap-0">
              <p className="text-[10px] font-black text-slate-400 uppercase">
                Ready for pickup
              </p>
              <p className="text-xl font-black -mt-2 md:-mt-0 text-slate-800">
                {displayOrders.length} Orders
              </p>
            </div>
            <div className="h-10 w-[1px] bg-slate-200" />
            <div className=" hidden md:flex items-center gap-2 px-4 py-2 bg-blue-200 border border-blue-100 rounded-xl">
              <img
                src="https://play-lh.googleusercontent.com/9OYsIvc-iKHte4jqVe-c4sA0vNL-tljBDVPguou6B-qdxQgSKpj8pZ7ZYh6MYEbawbo"
                className="w-5 h-5 grayscale opacity-70"
                alt="steadfast"
              />
              <span className=" text-xs font-black text-blue-700 uppercase">
                Steadfast API Ready
              </span>
            </div>
          </div>
        </div>

        {/* --- TABLE CONTAINER --- */}
        <div className="flex-1 overflow-auto py-3">
          <div className="bg-white border border-slate-200 rounded overflow-hidden">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              {/* Table Head */}
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">
                  <th className="px-6 py-4">Order & Date</th>
                  <th className="px-6 py-4">Recipient Details</th>
                  <th className="px-6 py-4">Full Address</th>
                  <th className="px-6 py-4 text-center">COD Amount</th>
                  <th className="px-6 py-4 text-center">Delivery</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-slate-100">
                {[
                  {
                    id: "475891",
                    date: "17 Mar",
                    customer: "Mamun or Rashid",
                    phone: "01712345678",
                    address: "House 12, Road 4, Dhanmondi, Dhaka City",
                    cod: 44570,
                    charge: 70,
                  },
                  {
                    id: "475895",
                    date: "17 Mar",
                    customer: "Ariful Islam",
                    phone: "01887654321",
                    address: "Miah Bari, Sonagazi, Feni",
                    cod: 12500,
                    charge: 130,
                  },
                  {
                    id: "475899",
                    date: "17 Mar",
                    customer: "Sultana Razia",
                    phone: "01911223344",
                    address: "Sector 7, Uttara, Dhaka City",
                    cod: 8900,
                    charge: 70,
                  },
                ].map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-100 transition-colors group"
                  >
                    {/* Order Identity */}
                    <td className="px-6 py-1">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-[10px]">
                          #VB
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800 tracking-tight">
                            #{order.id}
                          </p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase">
                            {order.date}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Customer Info */}
                    <td className="px-6 py-1">
                      <p className="text-sm font-bold text-slate-700">
                        {order.customer}
                      </p>
                      <p className="text-[11px] font-medium text-indigo-500">
                        {order.phone}
                      </p>
                    </td>

                    {/* Shipping Location */}
                    <td className="px-6 py-1">
                      <div className="flex items-start gap-2 max-w-[280px]">
                        <FiMapPin
                          size={14}
                          className="text-slate-300 mt-0.5 shrink-0"
                        />
                        <p className="text-[13px] font-medium text-slate-500 leading-relaxed whitespace-normal line-clamp-2">
                          {order.address}
                        </p>
                      </div>
                    </td>

                    {/* COD Amount */}
                    <td className="px-6 py-1 text-center">
                      <p className="text-sm font-black text-slate-900">
                        ৳{order.cod.toLocaleString()}
                      </p>
                    </td>

                    {/* Courier Fees */}
                    <td className="px-6 py-1 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="text-[10px] font-black bg-rose-50 text-rose-600 px-2 py-0.5 rounded border border-rose-100">
                          -৳{order.charge}
                        </span>
                      </div>
                    </td>

                    {/* Single Dispatch Button */}
                    <td className="px-6 py-3 text-right">
                      <button className="bg-slate-900 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 active:scale-95 transition-all shadow-md shadow-slate-200 flex items-center gap-2 ml-auto">
                        <fiSend size={12} /> Send Steadfast
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      
      </div>
    </div>
  );
};

export default LogisticsModal;
