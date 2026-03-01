import React from "react";
import {
  Package,
  CheckCircle,
  Truck,
  ShoppingBag,
  CalendarDays,
  XCircle,
  Layers,
} from "lucide-react";

const SalesStatusCards = ({ orderData }) => {
  // Helpers for date calculations
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  const getCountForLastDays = (days) => {
    const cutoff = new Date();
    cutoff.setDate(now.getDate() - days);
    
    return orderData.filter((order) => {
      const orderDate = new Date(order.order_date.split(" ")[0]);
      return orderDate >= cutoff && orderDate <= now;
    }).length;
  };

  // 1. Today's Filter
  const todaysCount = orderData.filter((order) => {
    return order.order_date.split(" ")[0] === todayStr;
  }).length;

  // 2. Range Filters
  const last7Days = getCountForLastDays(7);
  const last15Days = getCountForLastDays(15);
  const last30Days = getCountForLastDays(30);

  // 3. Status Filters
  const cancelledCount = orderData.filter(
    (order) => order.status === "Cancelled"
  ).length;

  const allCount = orderData.length;

  const orderStats = [
    {
      title: "Today's Orders",
      count: todaysCount,
      icon: CalendarDays,
      color: "bg-indigo-100 text-indigo-700 border-indigo-300",
    },
    {
      title: "Last 7 Days",
      count: last7Days,
      icon: Package,
      color: "bg-yellow-100 text-yellow-700 border-yellow-300",
    },
    {
      title: "Last 15 Days",
      count: last15Days,
      icon: CheckCircle,
      color: "bg-blue-100 text-blue-700 border-blue-300",
    },
    {
      title: "Last 30 Days",
      count: last30Days,
      icon: Truck,
      color: "bg-purple-100 text-purple-700 border-purple-300",
    },
    {
      title: "Total Sales",
      count: allCount,
      icon: ShoppingBag,
      color: "bg-green-100 text-green-700 border-green-300",
    },
    {
      title: "Return Order",
      count: 0, // Keep at 0 as per your request or add return logic
      icon: Layers,
      color: "bg-gray-100 text-gray-700 border-gray-300",
    },
    {
      title: "Total Cancelled",
      count: cancelledCount,
      icon: XCircle,
      color: "bg-red-100 text-red-700 border-red-300",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-7 xl:grid-cols-7 gap-2 lg:gap-3 mb-2">
      {orderStats.map(({ title, count, icon: Icon, color }, idx) => (
        <div
          key={idx}
          className={`border ${color} md:p-4 p-3 rounded h-18 flex items-center justify-between`}
        >
          <div>
            <h4 className="text-sm font-medium mt-1 text-gray-700">{title}</h4>
            <p className="md:text-2xl text-xl font-bold mt-1">{count}</p>
          </div>
          <Icon className="w-7 h-7 opacity-80" />
        </div>
      ))}
    </div>
  );
};

export default SalesStatusCards;