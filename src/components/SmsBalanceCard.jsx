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
import ManualSMS from "./ManualSMS";

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
      {isModalOpen && <ManualSMS onClose={(val) => setIsModalOpen(val)} />}
    </>
  );
};

export default SmsBalanceCard;
