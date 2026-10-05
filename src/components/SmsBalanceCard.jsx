import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FiMessageSquare,
  FiRefreshCw,
  FiAlertTriangle,
  FiX,
  FiSend,
} from "react-icons/fi";
import api from "@/Context Api/api";

const SmsBalanceCard = () => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  const fetchBalance = async () => {
    setLoading(true);
    setError(false);

    try {
      const { data } = await api.get("/order/sms-balance");
      setBalance(data.balance);
    } catch (err) {
      console.error("Balance fetch error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  // Handle sending the manual SMS
  const handleSendSms = async (e) => {
    e.preventDefault();
    if (!recipient || !message) return;

    setSending(true);
    setFeedback({ type: "", text: "" });

    try {
      // Adjust endpoint according to your backend route for sending manual sms
      await api.post("/order/send-manual-sms", {
        phone: recipient,
        message: message,
      });

      setFeedback({ type: "success", text: "SMS sent successfully!" });
      setRecipient("");
      setMessage("");
      fetchBalance(); // Refresh balance after sending

      setTimeout(() => {
        setIsModalOpen(false);
        setFeedback({ type: "", text: "" });
      }, 1500);
    } catch (err) {
      console.error("SMS send error:", err);
      setFeedback({
        type: "error",
        text: err.response?.data?.message || "Failed to send SMS. Try again.",
      });
    } finally {
      setSending(false);
    }
  };

  // Quick Template Injector
  const applyTemplate = (type) => {
    if (type === "payment") {
      setMessage(
        "Dear Customer, your payment is pending. Please complete it at your earliest convenience. Thank you!",
      );
    } else if (type === "shipping") {
      setMessage("Good news! Your order has been shipped and is on the way.");
    } else if (type === "custom") {
      setMessage("");
    }
  };

  // Calculate roughly how many SMS are left (at 0.35 TK per SMS)
  const smsLeft = balance ? Math.floor(parseFloat(balance) / 0.35) : 0;
  const isLow = balance && parseFloat(balance) < 10;
  const charCount = message.length;
  const smsSegments = Math.ceil(charCount / 160) || 1;

  const reset = () => {
    setMessage("");
    setRecipient("");
  };
  return (
    <>
      <div
        className={`p-5 rounded border ${isLow ? "border-red-200 bg-red-50" : "border-slate-400 bg-white"} max-w-sm`}
      >
        <div className="flex justify-between items-start mb-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-2 rounded transition-colors cursor-pointer"
            title="Send Manual SMS"
          >
            <FiSend size={14} /> Send SMS
          </button>
          <div className="flex items-center gap-2">
            {/* Open Modal Button */}

            <button
              onClick={fetchBalance}
              className="text-blue-600 hover:text-blue-800 cursor-pointer transition-colors p-1"
              title="Refresh Balance"
            >
              <FiRefreshCw
                size={20}
                className={loading ? "animate-spin" : ""}
              />
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">
            SMS Balance
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-800">
              ৳ {loading ? "..." : balance}
            </span>
            <span className="text-gray-500 text-sm font-normal">BDT</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-dashed border-gray-300">
          <div className="flex items-center justify-between text-md">
            <span className="text-gray-500">Approx. Messages Left:</span>
            <span
              className={`font-semibold ${isLow ? "text-red-600" : "text-green-600"}`}
            >
              {loading ? "..." : smsLeft} SMS
            </span>
          </div>

          {isLow && !loading && (
            <div className="mt-2 flex items-center gap-1 text-xs text-red-500 font-medium">
              <FiAlertTriangle /> Low balance! Please recharge soon.
            </div>
          )}
        </div>
      </div>

      {/* Manual SMS Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center bg-brand/90 px-5 py-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <FiMessageSquare className="text-white" size={18} />
                <h3 className="font-semibold text-white">Send Manual SMS</h3>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  reset();
                }}
                className="text-white cursor-pointer transition-colors"
              >
                <FiX size={22} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSendSms} className="p-5 space-y-4">
              {feedback.text && (
                <div
                  className={`p-3 text-sm rounded ${feedback.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}
                >
                  {feedback.text}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Recipient Phone Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 01700000000"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand text-md"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-gray-600 uppercase">
                    Message Templates
                  </label>
                  <div className="flex gap-2 text-sm">
                    <button
                      type="button"
                      onClick={() => applyTemplate("payment")}
                      className="text-blue-600 hover:underline cursor-pointer"
                    >
                      Payment
                    </button>
                    <span>|</span>
                    <button
                      type="button"
                      onClick={() => applyTemplate("shipping")}
                      className="text-blue-600 hover:underline cursor-pointer"
                    >
                      Shipping
                    </button>
                  </div>
                </div>
                <textarea
                  rows="4"
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand text-md resize-none"
                />
                <div className="flex justify-between items-center text-sm text-gray-500 mt-1">
                  <span>Characters: {charCount}</span>
                  <span>
                    Segments: {smsSegments} (approx. {smsSegments * 0.35} BDT)
                  </span>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    (setIsModalOpen(false), reset());
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="px-4 py-2 bg-brand hover:bg-brand text-white text-sm font-bold rounded flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
                >
                  <FiSend size={14} />
                  {sending ? "Sending..." : "Send SMS"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default SmsBalanceCard;
