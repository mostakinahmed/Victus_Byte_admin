import { DataContext } from "@/Context Api/ApiContext";
import React, { useContext, useState } from "react";
import {
  FiX,
  FiSearch,
  FiTruck,
  FiSend,
  FiCheckCircle,
  FiPackage,
  FiMapPin,
} from "react-icons/fi";

const LogisticsModal = ({ isOpen, onClose, onSendToCourier }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingId, setLoadingId] = useState(null);
  const { orderData, updateApi } = useContext(DataContext);

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
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-slate-200">
                {orderData
                  .filter(
                    (order) => order.courier.delivery_status === "Confirmed",
                  ) // Only show Confirmed orders
                  .map((order) => (
                    <tr
                      key={order.order_id}
                      className="hover:bg-slate-100 transition-colors group border-b border-slate-100"
                    >
                      {/* Order Identity */}
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="text-sm font-black text-slate-800 tracking-tight leading-none mb-1">
                              #{order.order_id}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                              {order.order_date.split(" ")[0]}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Customer Info */}
                      <td className="px-6 py-3">
                        <p className="text-sm font-bold text-slate-700 leading-none mb-1">
                          {order.shipping_address.recipient_name}
                        </p>
                        <p className="text-[11px] font-black text-[#1976d2] ">
                          {order.shipping_address.phone}
                        </p>
                      </td>

                      {/* Shipping Location */}
                      <td className="px-6 py-3">
                        <div className="flex items-start gap-2 max-w-[280px]">
                          <FiMapPin
                            size={12}
                            className="text-slate-300 mt-0.5 shrink-0"
                          />
                          <p className="text-[12px] font-medium text-slate-500 leading-tight whitespace-normal line-clamp-2">
                            {order.shipping_address.address_line1}
                          </p>
                        </div>
                      </td>

                      {/* COD Amount */}
                      <td className="px-6 py-3 text-center">
                        <p className="text-sm font-black text-slate-900">
                          ৳{order.total_amount?.toLocaleString()}
                        </p>
                      </td>

                      {/* Courier Fees */}
                      <td className="px-6 py-3 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className="text-[11px] font-black bg-rose-50 text-rose-600 px-2 py-1 rounded border border-rose-100">
                            ৳{order.courier.delivery_charge}
                          </span>
                        </div>
                      </td>

                      {/* --- COMPACT ACTION ROW --- */}
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {/* Steadfast Button */}
                          <button
                            onClick={() => handleSteadfastDispatch(order)}
                            className="group h-8 bg-[#1976d2] hover:bg-indigo-700 text-white px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm flex items-center gap-2 border border-white/10 cursor-pointer"
                          >
                            <FiSend
                              size={11}
                              className="group-hover:translate-x-0.5 transition-transform"
                            />
                            <span>Steadfast</span>
                          </button>

                          {/* Self Delivery Button */}
                          <button
                            onClick={() => handleSelfDispatch(order)}
                            className="group h-8 bg-slate-800 hover:bg-slate-900 text-white px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border border-slate-700 flex items-center gap-2 cursor-pointer"
                          >
                            <FiTruck
                              size={11}
                              className="group-hover:text-indigo-400"
                            />
                            <span>Self</span>
                          </button>
                        </div>
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
