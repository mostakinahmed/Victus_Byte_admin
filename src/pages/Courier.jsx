import React, { useState } from "react";
import {
  Package,
  Truck,
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
import Navbar from "@/components/Navbar";

const TripleSyncDashboard = () => {
  const [orders] = useState([
    {
      order_id: "475891",
      order_date: "2026-03-14",
      total_amount: 44570,
      customer: "Mamun or Rashid",
      courier: {
        consignment_id: "6DB921",
        status: "Shipped",
        cash_status: "Pending",
        delivery_charge: 130,
        cod_percent: 1,
      },
    },
    {
      order_id: "475891",
      order_date: "2026-03-14",
      total_amount: 44570,
      customer: "Mamun or Rashid",
      courier: {
        consignment_id: "6DB921",
        status: "Shipped",
        cash_status: "Pending",
        delivery_charge: 130,
        cod_percent: 1,
      },
    },
    {
      order_id: "475891",
      order_date: "2026-03-14",
      total_amount: 44570,
      customer: "Mamun or Rashid",
      courier: {
        consignment_id: "6DB921",
        status: "Shipped",
        cash_status: "Pending",
        delivery_charge: 130,
        cod_percent: 1,
      },
    },
    {
      order_id: "475891",
      order_date: "2026-03-14",
      total_amount: 44570,
      customer: "Mamun or Rashid",
      courier: {
        consignment_id: "6DB921",
        status: "Shipped",
        cash_status: "Pending",
        delivery_charge: 130,
        cod_percent: 1,
      },
    },
  ]);

  const calculateFinance = (total, delCharge, codPerc) => {
    const codCharge = total * (codPerc / 100);
    const organicMoney = total - delCharge - codCharge;
    return { codCharge, organicMoney };
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
            title="COD Fees"
            value="৳1,485"
            icon={AlertCircle}
            color="bg-white border-slate-200"
            textColor="text-amber-600"
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
        <div className="bg-white rounded border border-slate-200 overflow-hidden shadow-xs">
          <div className="px-5 py-3 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">
              All Order Matrix
            </h2>
            <button className="text-slate-400 hover:text-orange-600 transition">
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
                    2. Pathao Logistics
                  </th>
                  <th
                    colSpan="5"
                    className="px-6 py-4 text-center bg-emerald-200 text-emerald-700"
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
                  <th className="px-6 py-4 bg-emerald-600 text-white text-center">
                    Organic Money
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200  ">
                {orders.map((o) => {
                  const fin = calculateFinance(
                    o.total_amount,
                    o.courier.delivery_charge,
                    o.courier.cod_percent,
                  );
                  return (
                    <tr
                      key={o.order_id}
                      className="hover:bg-slate-100 transition-colors text-sm"
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
                        {o.customer}
                      </td>
                      <td className="px-6 py-4 text-xs font-bold  uppercase">
                        #{o.courier.consignment_id}
                      </td>
                      <td className="px-6 py-4 border-r border-slate-200 text-center">
                        <span className="px-2 py-1.5 rounded bg-blue-50 text-blue-600 text-[10px] font-black uppercase border border-blue-100">
                          {o.courier.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 border-r border-slate-200 text-center">
                        <span className="px-2 py-1.5 rounded bg-blue-50 text-blue-600 text-[10px] font-black uppercase border border-blue-100">
                          {o.courier.cash_status}
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
