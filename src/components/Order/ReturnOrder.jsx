import React, { useState, useContext } from "react";
import {
  FiX,
  FiSearch,
  FiCornerUpLeft,
  FiAlertCircle,
  FiCheck,
} from "react-icons/fi";
import api from "@/Context Api/api";
import { DataContext } from "@/Context Api/ApiContext";
import { toast } from "react-hot-toast";

const ReturnOrder = ({ isOpen, onClose }) => {
  const { updateApi } = useContext(DataContext);
  const [orderIdInput, setOrderIdInput] = useState("");
  const [foundOrder, setFoundOrder] = useState(null);
  const [comment, setComment] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // 1. Search for the order by ID
  const handleSearchOrder = async () => {
    if (!orderIdInput) return toast.error("Enter Order ID");
    setIsSearching(true);
    setFoundOrder(null);
    try {
      const res = await api.get(`/order/get-order/${orderIdInput}`);
      if (res.data.success) {
        setFoundOrder(res.data.data);
      } else {
        toast.error("Order not found");
      }
    } catch (err) {
      toast.error("Error finding order");
    } finally {
      setIsSearching(false);
    }
  };

  // 2. Process the Return
  const handleReturnSubmit = async () => {
    if (!comment) return toast.error("Please add a return reason/comment");
    setIsSubmitting(true);
    try {
      const payload = {
        "courier.delivery_status": "Returned",
        "courier.return_reason": comment,
        // Optional: Logic to restock items can be triggered here
      };

      const res = await api.post(
        `/order/edit-order/${foundOrder.order_id}`,
        payload,
      );

      if (res.data.success) {
        toast.success("Order marked as Returned");
        setFoundOrder(null);
        setOrderIdInput("");
        setComment("");
        updateApi();
        onClose();
      }
    } catch (err) {
      toast.error("Return failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b bg-rose-50 flex justify-between items-center">
          <div className="flex items-center gap-2 text-rose-600">
            <FiCornerUpLeft size={20} strokeWidth={3} />
            <h2 className="font-black uppercase text-xs tracking-widest">
              Return Processing
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-rose-100 rounded-full text-rose-400"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* OID Input Section */}
          <div className="relative">
            <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">
              Search Order ID
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ex: VB-1024"
                className="flex-1 px-4 py-2 bg-slate-100 border rounded-xl font-bold text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
              />
              <button
                onClick={handleSearchOrder}
                disabled={isSearching}
                className="bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-900 transition-all flex items-center gap-2"
              >
                {isSearching ? (
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <FiSearch />
                )}
                Search
              </button>
            </div>
          </div>

          {/* Order Details Preview */}
          {foundOrder && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 animate-in slide-in-from-top-2">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm font-black text-slate-800">
                    #{foundOrder.order_id}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400">
                    {foundOrder.shipping_address.recipient_name}
                  </p>
                </div>
                <span className="text-[10px] font-black bg-blue-100 text-blue-600 px-2 py-0.5 rounded uppercase">
                  {foundOrder.courier.delivery_status}
                </span>
              </div>
              <div className="text-[11px] text-slate-600 font-medium">
                Amount:{" "}
                <span className="font-bold text-slate-900">
                  ৳{foundOrder.total_amount}
                </span>
              </div>
            </div>
          )}

          {/* Comment & Submit Section */}
          {foundOrder && (
            <div className="space-y-4 pt-2 border-t border-dashed">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">
                  Return Reason / Note
                </label>
                <textarea
                  placeholder="Why is this product returning? (e.g. Customer Refused, Damaged)"
                  className="w-full p-3 bg-slate-50 border rounded-xl text-sm min-h-[80px] focus:ring-2 focus:ring-rose-500 outline-none"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              <button
                disabled={isSubmitting}
                onClick={handleReturnSubmit}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <FiCheck size={16} />
                )}
                Confirm Received Product
              </button>
            </div>
          )}

          {!foundOrder && !isSearching && (
            <div className="py-10 text-center text-slate-300">
              <FiAlertCircle size={40} className="mx-auto mb-2 opacity-20" />
              <p className="text-xs font-bold uppercase tracking-widest">
                Scan or enter ID to begin
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReturnOrder;
