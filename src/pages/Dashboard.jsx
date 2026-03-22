import { FiPackage, FiShoppingCart, FiAlertTriangle } from "react-icons/fi";
import FuzzyText from "@/components/FuzzyText";
import Navbar from "../components/Navbar";
import SmsBalanceCard from "@/components/SmsBalanceCard";
import SmsMonitor from "@/components/SmsMonitor";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStations = async () => {1
      try {
        const response = await axios.get(
          "https://portal.packzy.com/api/v1/police_stations",
          {
            headers: {
              "Api-Key": "gmao1fp9rnox99dypl04ncaa9prloriw", // Replace with real key
              "Secret-Key": "1h0hytifi9ikwcgfpalhqaee", // Replace with real key
              "Content-Type": "application/json",
            },
          },
        );

        // Successfully setting the data
        setStations(response.data);
        setLoading(false);
      } catch (err) {
        console.error(
          "Steadfast API Error:",
          err.response?.data || err.message,
        );
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  console.log(stations);

  return (
    <div className="  pb-10 mt-12 md:mt-0">
      <Navbar pageTitle="System Overview" />

      {/* --- 1. KPI STRIP --- */}
      <div className="">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-4">
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
          {/* <StatCard
            title="Active Users"
            value="12,045"
            trend="+5%"
            icon={<FiUsers />}
            color="blue"
          /> */}
          <StatCard
            title="SMS Balance"
            value="08"
            trend="Needs Attention"
            icon={<FiAlertTriangle />}
            color="rose"
            isAlert
          />
          <SmsBalanceCard />
        </div>

        <div>
          <SmsMonitor />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, icon, color, isAlert }) {
  const colors = {
    indigo: "bg-indigo-500 ",
    emerald: "bg-emerald-500",
    blue: "bg-blue-500 ",
    rose: "bg-rose-500 ",
  };

  return (
    <div className="bg-white md:p-5 p-3 rounded border border-slate-200  transition-all group">
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
