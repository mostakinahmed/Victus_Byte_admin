import api from "@/Context Api/api";
import { DataContext } from "@/Context Api/ApiContext";
import React, { useContext, useState } from "react";
import {
  FiX,
  FiSearch,
  FiTruck,
  FiSend,
  FiMapPin,
  FiLoader,
} from "react-icons/fi";
import { toast } from "react-hot-toast";

const LogisticsModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [processingId, setProcessingId] = useState(null); // Track specific loading order
  const { orderData, updateApi } = useContext(DataContext);

  if (!isOpen) return null;

  // Filter logic: Only show "Confirmed" orders and handle search by ID or Phone
  const displayOrders =
    orderData?.filter((order) => {
      // 1. Core Requirements: Must be Confirmed AND have no courier assigned yet
      const isReady =
        order.courier.delivery_status === "Confirmed" &&
        order.courier.name === "N/A";

      // 2. Search Requirements: Match ID or Phone
      const matchesSearch =
        order.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shipping_address.phone.includes(searchTerm);

      // Only return true if BOTH are met
      return isReady && matchesSearch;
    }) || [];

  const handleDispatch = async (orderId, method) => {
    if (method === "steadfast") {
      toast.error("Steadfast API is currently unavailable.");
      return;
    }

    setProcessingId(orderId); // Start loading animation for this row

    try {
      const payLoad = {
        "courier.name": "ByteXpress",
      };

      const res = await api.post(`/order/edit-order/${orderId}`, payLoad);

      if (res.data.success) {
        toast.success(`Order #${orderId} dispatched via ByteXpress`);
        if (updateApi) await updateApi(); // Refresh global data
      }
    } catch (error) {
      console.error("Dispatch Error:", error);
      toast.error("Failed to update order");
    } finally {
      setProcessingId(null); // Reset loading state
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-7xl h-full max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300 border border-slate-200">
        {/* Header Section */}
        <div className="px-6 py-4 border-b bg-slate-50 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-100">
              <FiTruck className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">
                Dispatch Command Center
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Logistics & Fulfillment
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-rose-50 rounded-full transition-all text-slate-400 hover:text-rose-500"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Search & Stats Bar */}
        <div className="px-6 py-4 bg-white border-b flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Order ID or Phone..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-100 border border-transparent rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Ready for Dispatch
              </p>
              <p className="text-xl font-black text-slate-800">
                {displayOrders.length}{" "}
                <span className="text-sm font-bold text-slate-400">Orders</span>
              </p>
            </div>
          </div>
        </div>

        {/* --- TABLE CONTAINER --- */}
        <div className="flex-1 overflow-auto bg-slate-50/30">
          <table className="w-full text-left whitespace-nowrap border-separate border-spacing-0">
            <thead>
              <tr className="bg-white sticky top-0 z-10 shadow-sm">
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 border-b">
                  Order Info
                </th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 border-b">
                  Recipient
                </th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 border-b">
                  Address
                </th>
                <th className="px-6 py-4 text-center text-[11px] font-black uppercase tracking-widest text-slate-400 border-b">
                  Amount
                </th>
                <th className="px-6 py-4 text-center text-[11px] font-black uppercase tracking-widest text-slate-400 border-b">
                  Delivery Fee
                </th>
                <th className="px-6 py-4 text-right text-[11px] font-black uppercase tracking-widest text-slate-400 border-b">
                  Dispatch Via
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {displayOrders.map((order) => (
                <tr
                  key={order.order_id}
                  className={`transition-colors ${processingId === order.order_id ? "bg-indigo-50/50" : "hover:bg-slate-50/80"}`}
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-black text-slate-800">
                      #{order.order_id}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      {order.order_date.split(" ")[0]}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-700">
                      {order.shipping_address.recipient_name}
                    </p>
                    <p className="text-[11px] font-black text-indigo-600">
                      {order.shipping_address.phone}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2 max-w-[250px]">
                      <FiMapPin
                        size={12}
                        className="text-slate-300 mt-1 shrink-0"
                      />
                      <p className="text-[12px] font-medium text-slate-500 leading-tight whitespace-normal line-clamp-2">
                        {order.shipping_address.address_line1}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <p className="text-sm font-black text-slate-900">
                      ৳{order.total_amount?.toLocaleString()}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className="text-[11px] font-black bg-rose-50 text-rose-600 px-2.5 py-1 rounded-lg border border-rose-100">
                      ৳{order.courier.delivery_charge}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Steadfast Button */}
                      <button
                        disabled={processingId !== null}
                        onClick={() =>
                          handleDispatch(order.order_id, "steadfast")
                        }
                        className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <FiSend size={12} />
                        <span>Steadfast</span>
                      </button>

                      {/* ByteXpress Button */}
                      <button
                        disabled={processingId !== null}
                        onClick={() => handleDispatch(order.order_id, "self")}
                        className="min-w-[125px] h-9 px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed border border-slate-700"
                      >
                        {processingId === order.order_id ? (
                          <>
                            <FiLoader size={14} className="animate-spin" />
                            <span>Processing</span>
                          </>
                        ) : (
                          <>
                            <FiTruck size={12} />
                            <span>ByteXpress</span>
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {displayOrders.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-20 text-center">
                    <p className="text-slate-400 font-bold italic">
                      No orders ready for dispatch found.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LogisticsModal;
