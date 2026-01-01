import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { FiList, FiPlus, FiBarChart2 } from "react-icons/fi";

import Navbar from "../components/Navbar";

const dailyData = [
  { day: "Mon", sales: 1200 },
  { day: "Tue", sales: 1900 },
  { day: "Wed", sales: 1500 },
  { day: "Thu", sales: 2100 },
  { day: "Fri", sales: 1800 },
  { day: "Sat", sales: 2500 },
  { day: "Sun", sales: 1700 },
];

const monthlyData = [
  { month: "Jan", revenue: 15000 },
  { month: "Feb", revenue: 18000 },
  { month: "Mar", revenue: 22000 },
  { month: "Apr", revenue: 20000 },
  { month: "May", revenue: 26000 },
  { month: "Jun", revenue: 24000 },
  { month: "Jul", revenue: 29000 },
];

export default function Sales() {
  const Navigate = useNavigate();
  return (
    <div className=" space-y-2">
      <Navbar pageTitle="Sales Overview" />
      <div className="flex flex-col sm:flex-row mb-2">
        {/* ✅ Optimized Sales Action Bar */}
        <div className="flex items-center gap-3">
          {/* Secondary Action: View Records */}
          <button
            onClick={() => Navigate(`/sales/all-sales`)}
            className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-100 transition-all active:scale-95 group shadow-sm"
          >
            <FiList
              className="text-slate-400 group-hover:text-indigo-600 transition-colors"
              size={16}
            />
            All Sales
          </button>

          {/* Primary Action: Transaction Entry */}
          <button
            onClick={() => Navigate(`/sales/new`)}
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-600 shadow-xl shadow-slate-200 transition-all active:scale-95 group"
          >
            <div className="p-1 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
              <FiPlus size={14} />
            </div>
            Create New Sale
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div className="bg-white shadow-md rounded p-5 border border-gray-100">
          <h3 className="text-gray-500 text-sm">Today's Sales</h3>
          <p className="text-2xl font-bold text-blue-600">৳ 2,100</p>
          <p className="text-green-600 text-sm">▲ +12% from yesterday</p>
        </div>
        <div className="bg-white shadow-md rounded p-5 border border-gray-100">
          <h3 className="text-gray-500 text-sm">This Week</h3>
          <p className="text-2xl font-bold text-blue-600">৳ 13,400</p>
          <p className="text-green-600 text-sm">▲ +8% vs last week</p>
        </div>
        <div className="bg-white shadow-md rounded p-5 border border-gray-100">
          <h3 className="text-gray-500 text-sm">This Month</h3>
          <p className="text-2xl font-bold text-blue-600">৳ 28,900</p>
          <p className="text-red-500 text-sm">▼ -3% vs last month</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {/* Daily Line Chart */}
        <div className="bg-white shadow-md rounded p-4 border border-gray-100">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">
            Daily Sales
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#2563eb"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Revenue Bar Chart */}
        <div className="bg-white shadow-md rounded p-4 border border-gray-100">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">
            Monthly Revenue
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#10b981" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-md rounded p-4 border border-gray-100 overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Recent Sales
        </h2>
        <table className="min-w-full text-sm text-left border-t border-gray-200 table-auto whitespace-nowrap">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                id: "#1001",
                name: "Rafi Ahmed",
                amount: "৳ 1,200",
                date: "2025-10-15",
                status: "Paid",
              },
              {
                id: "#1002",
                name: "Sara Rahman",
                amount: "৳ 900",
                date: "2025-10-15",
                status: "Pending",
              },
              {
                id: "#1003",
                name: "Tanvir Hasan",
                amount: "৳ 1,800",
                date: "2025-10-14",
                status: "Paid",
              },
            ].map((sale) => (
              <tr key={sale.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{sale.id}</td>
                <td className="p-3">{sale.name}</td>
                <td className="p-3 text-blue-600">{sale.amount}</td>
                <td className="p-3">{sale.date}</td>
                <td
                  className={`p-3 font-semibold ${
                    sale.status === "Paid"
                      ? "text-green-600"
                      : "text-yellow-500"
                  }`}
                >
                  {sale.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
