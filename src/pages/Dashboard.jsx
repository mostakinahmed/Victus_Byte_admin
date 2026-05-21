"use client";

import {
  FiPackage,
  FiShoppingCart,
  FiAlertTriangle,
  FiUsers,
  FiTrendingUp,
} from "react-icons/fi";

import Navbar from "../components/Navbar";
import SmsBalanceCard from "@/components/SmsBalanceCard";
import SmsMonitor from "@/components/SmsMonitor";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Dashboard() {
  // ============================
  // CHART DATA
  // ============================
  const salesData = [
    { name: "Jan", sales: 400 },
    { name: "Feb", sales: 900 },
    { name: "Mar", sales: 700 },
    { name: "Apr", sales: 1200 },
    { name: "May", sales: 1500 },
    { name: "Jun", sales: 1800 },
  ];

  const pieData = [
    { name: "Delivered", value: 65 },
    { name: "Pending", value: 20 },
    { name: "Cancelled", value: 15 },
  ];

  const COLORS = ["#10B981", "#F59E0B", "#EF4444"];

  return (
    <div className="min-h-screen bg-slate-100 pb-10 mt-12 md:mt-0">
      {/* NAVBAR */}
      <Navbar pageTitle="System Overview" />

      {/* MAIN CONTAINER */}
      <div className="py-4 lg:py-6 space-y-5">
        {/* =====================================
            KPI CARDS
        ===================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">
          <StatCard
            title="Total Inventory"
            value="1,240"
            trend="+12%"
            icon={<FiPackage />}
            color="indigo"
          />

          <StatCard
            title="Monthly Orders"
            value="856"
            trend="+18%"
            icon={<FiShoppingCart />}
            color="emerald"
          />

          <StatCard
            title="Total Users"
            value="12,045"
            trend="+5%"
            icon={<FiUsers />}
            color="blue"
          />

          <StatCard
            title="Revenue"
            value="$24.5K"
            trend="+22%"
            icon={<FiTrendingUp />}
            color="purple"
          />

          
            <SmsBalanceCard />
          
        </div>

        {/* =====================================
            CHART SECTION
        ===================================== */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* SALES CHART */}
          <div className="xl:col-span-2 bg-white rounded border border-slate-200 p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Sales Analytics
                </h2>

                <p className="text-sm text-slate-400">
                  Monthly sales overview
                </p>
              </div>

              <button className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 transition text-white text-sm font-semibold">
                Export
              </button>
            </div>

            <div className="h-[300px] md:h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient
                      id="salesGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#6366F1"
                        stopOpacity={0.4}
                      />

                      <stop
                        offset="95%"
                        stopColor="#6366F1"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="name" />

                  <YAxis />

                  <Tooltip />

                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#6366F1"
                    fillOpacity={1}
                    fill="url(#salesGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PIE CHART */}
          <div className="bg-white rounded border border-slate-200 p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-5">
              Order Status
            </h2>

            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3 mt-4">
              {pieData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: COLORS[index],
                      }}
                    />

                    <span className="text-sm text-slate-600">
                      {item.name}
                    </span>
                  </div>

                  <span className="font-bold text-slate-700">
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =====================================
            SMS SECTION
        ===================================== */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
         

          {/* SMS MONITOR */}
          <div className="bg-white rounded border border-slate-200 p-5 shadow-sm overflow-hidden">
            <SmsMonitor />
          </div>
        </div>
      </div>
    </div>
  );
}

// =====================================
// KPI CARD COMPONENT
// =====================================
function StatCard({
  title,
  value,
  trend,
  icon,
  color,
  isAlert,
}) {
  const colors = {
    indigo: "bg-indigo-500",
    emerald: "bg-emerald-500",
    blue: "bg-blue-500",
    rose: "bg-rose-500",
    purple: "bg-purple-500",
  };

  return (
    <div className="bg-white p-4 rounded border border-slate-200 shadow-sm hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-5">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl ${colors[color]}`}
        >
          {icon}
        </div>

        <span
          className={`text-xs font-black uppercase tracking-wider ${
            isAlert
              ? "text-rose-500 animate-pulse"
              : "text-emerald-500"
          }`}
        >
          {trend}
        </span>
      </div>

      <h3 className="text-xs uppercase tracking-widest text-slate-400 font-bold">
        {title}
      </h3>

      <p className="text-2xl font-black text-slate-800 mt-2">
        {value}
      </p>
    </div>
  );
}