import React, { useContext, useEffect, useState } from "react";
import {
  Package,
  Truck,
  Send,
  Clock,
  CheckCircle,
  RefreshCcw,
  Box,
  MapPin,
  Navigation,
  AlertCircle,
  DollarSign,
  TrendingUp,
  Receipt,
} from "lucide-react";
// Icons (Lucide or Feather)
import {
  FiSend,
  FiTruck,
  FiEdit3,
  FiMapPin,
  FiPackage,
  FiCreditCard,
  FiSave,
  FiX,
  FiHash,
  FiLock,
} from "react-icons/fi";
import Navbar from "@/components/Navbar";
import LogisticsModal from "@/components/Courier/LogisticsModal";
import { DataContext } from "@/Context Api/ApiContext";
import OrderEditModal from "../components/Order/EditOrder";

const TripleSyncDashboard = () => {
  const [isLogisticsOpen, setIsLogisticsOpen] = useState(false);
  const { orderData, updateApi } = useContext(DataContext);
  const [trig, setTrig] = useState(1);
  const [data, setData] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const calculateFinance = (total, delCharge, codPerc) => {
    const codCharge = total * (codPerc / 100);
    const organicMoney = total - delCharge - codCharge;
    return { codCharge, organicMoney };
  };

  //filter data
  useEffect(() => {
    // Use let because we are assigning the result of the filter
    let filtData = [];

    if (trig === 1) {
      // Standardizing to lowercase for safer matching
      filtData = orderData.filter(
        (o) => o.courier?.name?.toLowerCase() === "steadfast",
      );
    } else {
      filtData = orderData.filter(
        (o) => o.courier?.name?.toLowerCase() === "self",
      );
    }

    setData(filtData);
  }, [trig, orderData]); // Added orderData so the view updates after an Edit

  const handleOrderEdit = (order) => {
    setEditingOrder(order);
    setIsModalOpen(true);
  };
  return (
    <div className="bg-[#F1F5F9] font-sans mt-12 md:mt-0">
      <Navbar pageTitle={"Courier Management"} />

      <div className=" space-y-4">
        {/* 1. LOGISTICS STATUS CARDS (Matching your SalesStatusCards Design) */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-2 lg:gap-3">
          <MiniLogisticsCard
            title="Pickup Req."
            count={5}
            icon={Package}
            color="bg-slate-100 text-slate-700 border-slate-300"
          />
          <MiniLogisticsCard
            title="Picked"
            count={12}
            icon={Box}
            color="bg-blue-100 text-blue-700 border-blue-300"
          />
          <MiniLogisticsCard
            title="In Transit"
            count={24}
            icon={Navigation}
            color="bg-indigo-100 text-indigo-700 border-indigo-300"
          />
          <MiniLogisticsCard
            title="Out for Del."
            count={8}
            icon={MapPin}
            color="bg-purple-100 text-purple-700 border-purple-300"
          />
          <MiniLogisticsCard
            title="Delivered"
            count={142}
            icon={CheckCircle}
            color="bg-emerald-100 text-emerald-700 border-emerald-300"
          />
          <MiniLogisticsCard
            title="Returns"
            count={2}
            icon={AlertCircle}
            color="bg-red-100 text-red-700 border-red-300"
          />
        </div>

        {/* 2. BIG FINANCIAL STATUS CARDS (One Row - Compact Design) */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 lg:gap-3">
          <button
            onClick={() => setIsLogisticsOpen(true)}
            className="w-full cursor-pointer  bg-[#1976d2] border rounded p-3 border-indigo-400 transition-all duration-300 group outline-none"
          >
            <div className="flex items-center justify-between gap-4">
              {/* Compact Icon Box */}
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-600 group-hover:bg-slate-800 group-hover:text-white transition-all duration-500 shrink-0">
                <Truck
                  size={24}
                  className="group-hover:rotate-[-12deg] transition-transform"
                />
              </div>

              {/* Center Info - Now Horizontal */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-black text-white tracking-tighter">
                    14
                  </h3>
                  <p className="text-[10px] font-black text-white uppercase tracking-widest truncate">
                    Orders Ready{" "}
                    <span className="  text-indigo-500 group-hover:translate-x-1 transition-transform inline-block">
                      →
                    </span>
                  </p>
                </div>

                {/* Slim Progress Bar */}
                <div className="mt-1.5 w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black rounded-full transition-all duration-1000 ease-out"
                    style={{ width: "70%" }}
                  />
                </div>
              </div>

              {/* Action Status - Pulsing Dot Only */}
              <div className="flex flex-col items-end shrink-0">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                  <Send size={14} />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">
                    Sync
                  </span>
                </div>
              </div>
            </div>
          </button>

          <BigFinanceCard
            title="Gross Volume"
            value="৳1,48,520"
            icon={TrendingUp}
            color="bg-white border-slate-200"
            textColor="text-slate-900"
          />
          <BigFinanceCard
            title="Pathao Fees"
            value="৳2,140"
            icon={Receipt}
            color="bg-white border-slate-200"
            textColor="text-red-600"
          />

          <BigFinanceCard
            title="Pending COD"
            value="৳14,200"
            icon={Clock}
            color="bg-white border-slate-200"
            textColor="text-blue-600"
          />
          <BigFinanceCard
            title="Organic Money"
            value="৳1,44,895"
            icon={DollarSign}
            color="bg-emerald-600 border-emerald-700"
            textColor="text-white"
            isHighlight
          />
        </div>

        {/* 3. TRIPLE PORTION TABLE */}
        <div className="bg-white rounded  overflow-hidden shadow-xs">
          <div className="md:pr-5  border-b border-slate-100 flex justify-between items-center">
            <div className="flex bg-slate-100  rounded gap-2 md:w-1/5 w-full mb-4 border border-slate-200 shadow-inner">
              {/* Steadfast Dispatch Button */}
              <button
                onClick={() => setTrig(1)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 text-[10px] font-black uppercase tracking-widest transition-all duration-200 rounded cursor-pointer
      ${
        trig === 1
          ? "bg-[#1976d2] text-white shadow-lg shadow-indigo-200 scale-[1.02]"
          : "text-slate-600 hover:bg-white hover:text-[#1976d2]"
      }`}
              >
                <FiSend
                  size={12}
                  className={trig === 1 ? "animate-pulse" : ""}
                />
                <span>Steadfast</span>
              </button>

              {/* Self Delivery Button */}
              <button
                onClick={() => setTrig(2)} // Updated to 2 so you can toggle between states
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 text-[10px] font-black uppercase tracking-widest transition-all duration-200 rounded cursor-pointer
      ${
        trig === 2
          ? "bg-slate-800 text-white shadow-lg shadow-slate-300 scale-[1.02]"
          : "text-slate-600 hover:bg-white hover:text-slate-800"
      }`}
              >
                <FiTruck size={12} />
                <span>Self Delivery</span>
              </button>
            </div>

            <button className="text-slate-400 hover:text-orange-600 transition px-8">
              <RefreshCcw size={18} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse overflow-x-auto whitespace-nowrap">
              <thead>
                <tr className="bg-[#1976d2] text-[10px] font-black uppercase tracking-[0.2em] text-white border-b border-slate-200">
                  <th
                    colSpan="3"
                    className="px-6 py-4 border-r border-slate-200 text-center"
                  >
                    1. Internal Order
                  </th>
                  <th
                    colSpan="2"
                    className="px-6 py-4 border-r border-slate-200 text-center"
                  >
                    2. Courier Details
                  </th>
                  <th
                    colSpan={trig === 1 ? 5 : 6}
                    className="px-6 py-4 text-center w-full bg-emerald-200 text-emerald-700"
                  >
                    3. Financial Breakdown (Money)
                  </th>
                </tr>
                <tr className="text-[11px] font-bold text-slate-500 border-b border-slate-200 uppercase">
                  <th className="px-6 py-4">ID & Date</th>
                  <th className="px-6 py-4"> Date</th>
                  <th className="px-6 py-4 border-r border-slate-200">
                    Customer
                  </th>
                  <th className="px-6 py-4">Consignment</th>
                  <th className="px-6 py-4 border-r border-slate-200 text-center">
                    Delivery Status
                  </th>
                  <th className="px-6 py-4 border-r border-slate-200 text-center">
                    Payment Status
                  </th>
                  <th className="px-6 py-4 bg-emerald-50/20">COD Amount</th>
                  <th className="px-6 py-4 bg-emerald-50/20 text-red-500">
                    Del. Charge
                  </th>
                  <th className="px-6 py-4 bg-emerald-50/20 text-red-500">
                    COD Fee (1%)
                  </th>

                  {trig === 2 && (
                    <th className="px-6 py-4 bg-emerald-50/20 text-blue-600">
                      Update
                    </th>
                  )}

                  <th className="px-6 py-4 bg-emerald-600 text-white text-center">
                    Organic Money
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200  ">
                {data.map((o) => {
                  const fin = calculateFinance(
                    o.total_amount,
                    o.courier.delivery_charge,
                    o.courier.cod_percent,
                  );
                  return (
                    <tr
                      key={o.order_id}
                      className="hover:bg-slate-50 transition-colors text-sm"
                    >
                      <td className="px-6 py-4 font-bold text-slate-900">
                        #{o.order_id}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">
                        <div className="text-[11px] uppercase font-bold ">
                          {o.order_date}
                        </div>
                      </td>
                      <td className="px-6 py-4 border-r border-slate-200 font-bold text-slate-700 text-xs uppercase">
                        {o.shipping_address.recipient_name}
                      </td>
                      <td className="px-6 py-4 text-xs font-bold  uppercase">
                        #{o.courier.consignment_id}
                      </td>

                      {/* 1. Delivery Status Badge */}
                      <td className="px-6 py-4 border-r border-slate-200 text-center">
                        <span
                          className={`px-2 py-1.5 rounded text-[10px] font-black uppercase border transition-colors duration-200
    ${
      o.courier.delivery_status === "Delivered"
        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
        : "bg-blue-50 text-blue-600 border-blue-100"
    }`}
                        >
                          {o.courier.delivery_status}
                        </span>
                      </td>

                      {/* 2. Payment Status Badge */}
                      <td className="px-6 py-4 border-r border-slate-200 text-center">
                        <span
                          className={`px-2 py-1.5 rounded text-[10px] font-black uppercase border transition-colors duration-200
    ${
      o.courier.payment_status === "Paid"
        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
        : "bg-blue-50 text-blue-600 border-blue-100"
    }`}
                        >
                          {o.courier.payment_status}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-bold text-slate-800 text-xs bg-emerald-50/10">
                        ৳{o.total_amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 font-bold text-red-500 text-xs bg-emerald-50/10">
                        -৳{o.courier.delivery_charge}
                      </td>
                      <td className="px-6 py-4 font-bold text-red-500 text-xs bg-emerald-50/10">
                        -৳{fin.codCharge.toFixed(0)}
                      </td>
                      {trig == 2 && (
                        <td className="px-6 py-4 bg-slate-50/30  group">
                          <div className="flex items-center justify-center mr-4">
                            <button
                              onClick={() => handleOrderEdit(o)}
                              className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gray-100 text-slate-400 hover:text-[#1976d2] hover:border-[#1976d2] hover:shadow-lg hover:shadow-indigo-100 hover:bg-slate-200 cursor-pointer "
                              title="Edit Transaction"
                            >
                              {/* Background Hover Glow */}
                              <div className="absolute inset-0 rounded-xl bg-[#1976d2]/0 group-hover:bg-[#1976d2]/5 transition-colors" />

                              <FiEdit3 size={19} className="relative z-10" />
                            </button>
                          </div>
                        </td>
                      )}
                      <td className="px-6 py-4 bg-emerald-600 text-white text-center font-black ">
                        ৳{fin.organicMoney.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {isModalOpen && editingOrder && (
          <OrderEditModal
            order={editingOrder}
            onClose={() => {
              setIsModalOpen(false);
              setEditingOrder(null);
            }}
            updateAPI={updateApi}
            // onSave={handleUpdateSubmit}
          />
        )}

        <LogisticsModal
          isOpen={isLogisticsOpen}
          onClose={() => setIsLogisticsOpen(false)}
        />
      </div>
    </div>
  );
};

// --- COMPACT HELPERS (Same as SalesStatusCards Style) ---

const MiniLogisticsCard = ({ title, count, icon: Icon, color }) => (
  <div
    className={`border ${color} p-3 rounded h-16 flex items-center justify-between shadow-xs transition-all hover:brightness-95`}
  >
    <div>
      <h4 className="text-[11px] font-black uppercase tracking-tight opacity-80 leading-none">
        {title}
      </h4>
      <p className="text-xl font-black mt-1">{count}</p>
    </div>
    <Icon className="w-5 h-5 opacity-40" />
  </div>
);

const BigFinanceCard = ({
  title,
  value,
  icon: Icon,
  color,
  textColor,
  isHighlight,
}) => (
  <div
    className={`border ${color} p-4 rounded flex items-center justify-between  h-18`}
  >
    <div>
      <h4
        className={`text-[10px] font-black uppercase tracking-widest leading-none ${isHighlight ? "text-emerald-100" : "text-slate-500"}`}
      >
        {title}
      </h4>
      <p className={`text-xl font-black mt-2 tracking-tighter ${textColor}`}>
        {value}
      </p>
    </div>
    <Icon
      className={`w-6 h-6 ${isHighlight ? "text-emerald-300" : "text-slate-300"}`}
    />
  </div>
);

export default TripleSyncDashboard;
