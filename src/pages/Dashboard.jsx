import {
  FiPackage,
  FiShoppingCart,
  FiUsers,
  FiAlertTriangle,
  FiArrowUpRight,
  FiActivity,
  FiTarget,
  FiPlusCircle,
  FiBarChart2,
} from "react-icons/fi";
import FuzzyText from "@/components/FuzzyText";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      <Navbar pageTitle="System Overview" />

      {/* --- 1. KPI STRIP --- */}
      <div className="p-4 lg:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
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
            title="Active Users"
            value="12,045"
            trend="+5%"
            icon={<FiUsers />}
            color="blue"
          />
          <StatCard
            title="Critical Stock"
            value="08"
            trend="Needs Attention"
            icon={<FiAlertTriangle />}
            color="rose"
            isAlert
          />
        </div>

        {/* --- 2. COMMAND & ACTIVITY LAYER --- */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Visual & Brand Anchor */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-2 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <FiActivity className="text-indigo-500" /> Operational Flow
              </h3>
              <div className="flex gap-2">
                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                  Live Status
                </span>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200 relative overflow-hidden">
              <img
                src="/logo final.png"
                alt="Logo"
                className="h-16 w-auto  mix-blend-multiply opacity-20 grayscale mb-6"
              />
              <div className="hidden md:block ">
                <FuzzyText
                  baseIntensity={0.1}
                  hoverIntensity={0.4}
                  enableHover={true}
                  color="#94a3b8"
                >
                  VICTUS BYTE
                </FuzzyText>
              </div>
            </div>
          </div>

          {/* --- NEW: CONVERSION & ACTION CENTER --- */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                <FiTarget size={18} />
              </div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                Growth Center
              </h3>
            </div>

            <div className="space-y-6">
              {/* Revenue Summary */}
              <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-xl shadow-slate-200">
                <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                  Est. Revenue (MTD)
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <h4 className="text-2xl font-black tracking-tighter">
                    ৳ 4,82,900
                  </h4>
                  <span className="text-[10px] text-emerald-400 font-bold">
                    +2.4%
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
                  <div className="bg-indigo-500 h-full w-[65%] rounded-full"></div>
                </div>
                <p className="text-[9px] text-slate-500 mt-2 font-bold uppercase">
                  65% of monthly goal reached
                </p>
              </div>

              {/* Quick Action Buttons */}
              <div className="grid grid-cols-1 gap-3">
                <button className="flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl group hover:border-indigo-500 transition-all">
                  <div className="flex items-center gap-3">
                    <FiPlusCircle className="text-slate-400 group-hover:text-indigo-600" />
                    <span className="text-xs font-black text-slate-700 uppercase tracking-tighter">
                      Add New Product
                    </span>
                  </div>
                  <FiArrowUpRight className="text-slate-300 group-hover:text-indigo-600" />
                </button>

                <button className="flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl group hover:border-indigo-500 transition-all">
                  <div className="flex items-center gap-3">
                    <FiBarChart2 className="text-slate-400 group-hover:text-indigo-600" />
                    <span className="text-xs font-black text-slate-700 uppercase tracking-tighter">
                      Export Analytics
                    </span>
                  </div>
                  <FiArrowUpRight className="text-slate-300 group-hover:text-indigo-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

{
  /* Helper StatCard Component */
}
function StatCard({ title, value, trend, icon, color, isAlert }) {
  const colors = {
    indigo: "bg-indigo-500 shadow-indigo-100",
    emerald: "bg-emerald-500 shadow-emerald-100",
    blue: "bg-blue-500 shadow-blue-100",
    rose: "bg-rose-500 shadow-rose-100",
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div
          className={`p-3 rounded-2xl text-white shadow-lg ${colors[color]}`}
        >
          {icon}
        </div>
        <span
          className={`text-[10px] font-black uppercase tracking-tighter ${
            isAlert ? "text-rose-500 animate-pulse" : "text-emerald-500"
          }`}
        >
          {trend}
        </span>
      </div>
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
        {title}
      </h3>
      <p className="text-2xl font-black text-slate-800 tracking-tighter mt-1">
        {value}
      </p>
    </div>
  );
}
