import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiMessageSquare, FiRefreshCw, FiAlertTriangle } from "react-icons/fi";

const SmsBalanceCard = () => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchBalance = async () => {
    setLoading(true);
    setError(false);
    try {
      // Calling the backend route we created
      const { data } = await axios.get(
        "https://api.victusbyte.com/api/order/sms-balance",
      );
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

  // Calculate roughly how many SMS are left (at 0.35 TK per SMS)
  const smsLeft = balance ? Math.floor(parseFloat(balance) / 0.35) : 0;
  const isLow = balance && parseFloat(balance) < 10;

  return (
    <div
      className={`p-5 rounded shadow-sm border ${isLow ? "border-red-200 bg-red-50" : "border-gray-100 bg-white"} max-w-sm`}
    >
      <div className="flex justify-between items-start mb-3">
        <div
          className={`p-3 rounded-lg ${isLow ? "bg-red-500 text-white" : "bg-blue-600 text-white"}`}
        >
          <FiMessageSquare size={20} />
        </div>
        <button
          onClick={fetchBalance}
          className="text-gray-500 hover:text-blue-600 transition-colors"
          title="Refresh Balance"
        >
          <FiRefreshCw size={24}  className={loading ? "animate-spin" : ""} />
        </button>
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

      <div className="mt-4 pt-3 border-t border-dashed border-gray-300">
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
  );
};

export default SmsBalanceCard;
