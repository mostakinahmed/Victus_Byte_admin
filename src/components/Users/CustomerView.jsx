import { DataContext } from "@/Context Api/ApiContext";
import React, { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowLeft,
  FiPackage,
  FiUser,
  FiPhone,
  FiMail,
  FiCalendar,
  FiMessageSquare,
  FiSend,
  FiCheckCircle,
  FiX,
} from "react-icons/fi";

export default function CustomerView({ user, goBack }) {
  const { orderData } = useContext(DataContext);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [smsMessage, setSmsMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sentStatus, setSentStatus] = useState(false);

  // Filter live orders for this specific customer
  const customerOrders =
    orderData?.filter((order) => order.customer_id === user.cID) || [];

  // SMS Handler
  const handleSendSms = async () => {
    if (!smsMessage) return;
    setIsSending(true);

    // Simulate API Call to your BulkSMSBD backend
    setTimeout(() => {
      setIsSending(false);
      setSentStatus(true);
      // Auto-close modal after success message
      setTimeout(() => {
        setSentStatus(false);
        setIsModalOpen(false);
        setSmsMessage("");
      }, 2000);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 relative">
      {/* 1. Header Section */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h2 className="text-[14px] font-black text-slate-800 uppercase tracking-[0.2em] flex items-center gap-3">
          <span className="w-1.5 h-5 bg-[#1976d2] rounded-full shadow-[0_0_10px_rgba(25,118,210,0.3)]"></span>
          Customer Profile
        </h2>
        <button
          onClick={goBack}
          className="flex items-center gap-2 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-[#1976d2] hover:bg-blue-50 transition-all bg-white rounded-xl border border-blue-100 shadow-sm active:scale-95 cursor-pointer"
        >
          <FiArrowLeft /> Back to Database
        </button>
      </div>

      {/* 2. User Info Card */}
      <div className="bg-white rounded border border-slate-100 p-8 shadow-sm flex flex-col lg:flex-row gap-10 items-start relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>

        <div className="flex flex-col items-center shrink-0 w-full lg:w-auto">
          <div className="relative">
            <img
              src={
                "https://7vgva7cju0vcfvwf.public.blob.vercel-storage.com/user.png" ||
                user.images
              }
              alt={user.userName}
              className="w-32 h-32 p-2 rounded-[2rem] object-cover shadow-xl border-4 border-white ring-1 ring-slate-100"
            />
            {user.isVerified && (
              <div className="absolute -bottom-2 -right-2 bg-[#1976d2] text-white p-2 rounded-2xl border-4 border-white shadow-lg">
                <FiCheckCircle size={16} />
              </div>
            )}
          </div>
          <div className="mt-6 text-center">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">
              {user.userName}
            </h3>
            <span className="text-[10px] font-black text-[#1976d2] uppercase tracking-[0.2em] bg-blue-50 px-3 py-1 rounded-full">
              {user.cID}
            </span>
          </div>

          {/* SMS Trigger Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-6 w-full bg-[#1976d2] hover:bg-[#1565c0] text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <FiMessageSquare /> Send Message
          </button>
        </div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-6 w-full">
          <InfoBlock
            label="Full Name"
            value={user.userName}
            icon={<FiUser />}
          />
          <InfoBlock
            label="Email Address"
            value={user.email}
            icon={<FiMail />}
          />
          <InfoBlock
            label="Phone Number"
            value={user.phone}
            icon={<FiPhone />}
            isBrand
          />
          <InfoBlock
            label="Account Status"
            value={user.isVerified ? "Verified" : "Unverified"}
            isStatus
          />
          <InfoBlock label="Gender" value={user.gender || "Not Specified"} />
          <InfoBlock
            label="Member Since"
            value={user.createdAt}
            icon={<FiCalendar />}
          />
        </div>
      </div>

      {/* 3. Order History Section */}
      <div className="space-y-5">
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <FiPackage className="text-[#1976d2]" /> Purchase History (
          {customerOrders.length})
        </h3>

        {customerOrders.length > 0 ? (
          <div className="overflow-hidden rounded border border-slate-100 shadow-sm bg-white">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-slate-100 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5">Order ID</th>
                  <th className="px-8 py-5">Date</th>
                  <th className="px-8 py-5">Amount</th>
                  <th className="px-8 py-5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customerOrders.map((ord) => (
                  <tr
                    key={ord._id}
                    className="hover:bg-blue-50/20 transition-colors"
                  >
                    <td className="px-8 py-3 font-bold text-slate-700">
                      {ord.order_id}
                    </td>
                    <td className="px-8 py-3 text-slate-500 font-medium">
                      {ord.order_date}
                    </td>
                    <td className="px-8 py-3 font-black text-slate-800 tracking-tight">
                      ৳{ord.total_amount}
                    </td>
                    <td className="px-8 py-3 text-center">
                      <span
                        className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border 
                        ${ord.status === "Completed" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-blue-50 text-[#1976d2] border-blue-100"}`}
                      >
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-slate-50/50 rounded-[2.5rem] p-16 text-center border-2 border-dashed border-slate-100 text-slate-400">
            No orders found.
          </div>
        )}
      </div>

      {/* --- SMS MODAL OVERLAY --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-[#1976d2]"></div>

              {!sentStatus ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                      <FiSend className="text-[#1976d2]" /> SMS to{" "}
                      {user.userName}
                    </h3>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="text-slate-300 hover:text-red-500 transition-colors cursor-pointer p-1"
                    >
                      <FiX size={20} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">
                      Message Content
                    </p>
                    <textarea
                      value={smsMessage}
                      onChange={(e) => setSmsMessage(e.target.value)}
                      placeholder="Type your customer alert here..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-[#1976d2] transition-all min-h-[140px] resize-none"
                    />
                  </div>

                  <button
                    onClick={handleSendSms}
                    disabled={isSending || !smsMessage}
                    className="w-full bg-[#1976d2] hover:bg-[#1565c0] text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-blue-200 disabled:bg-slate-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    {isSending ? "Sending Dispatch..." : "Confirm & Send SMS"}
                  </button>
                </div>
              ) : (
                <div className="py-10 text-center animate-in zoom-in duration-300">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-emerald-100">
                    <FiCheckCircle size={40} />
                  </div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                    SMS Sended Successfully
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-2 tracking-tighter">
                    Recipient: {user.phone}
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Sub-component for clean profile layout
function InfoBlock({ label, value, icon, isBrand, isStatus }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
        {icon} {label}
      </div>
      <p
        className={`text-sm tracking-tight ${isBrand ? "text-[#1976d2] font-black underline decoration-blue-500/20 underline-offset-4" : "text-slate-700 font-bold"} 
        ${isStatus ? (value === "Verified" ? "text-blue-600 bg-blue-50 px-2 py-0.5 rounded w-fit" : "text-slate-400") : ""}`}
      >
        {value}
      </p>
    </div>
  );
}
