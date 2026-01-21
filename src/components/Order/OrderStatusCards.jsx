import React, { useContext } from "react";
import {
  Package,
  CheckCircle,
  Truck,
  ShoppingBag,
  CalendarDays,
  XCircle,
  Layers,
} from "lucide-react";
import { DataContext } from "@/Context Api/ApiContext";

const OrderStatusCards = () => {
  const { orderData } = useContext(DataContext);

  //filter all for count heading
  let allCount = orderData.length;

  const pendingCount = orderData.filter(
    (order) => order.status === "Pending"
  ).length;

  const confirmedCount = orderData.filter(
    (order) => order.status === "Confirmed"
  ).length;

  const shippedCount = orderData.filter(
    (order) => order.status === "Shipped"
  ).length;

  const deliveredCount = orderData.filter(
    (order) => order.status === "Completed"
  ).length;

  const cancelledCount = orderData.filter(
    (order) => order.status === "Cancelled"
  ).length;

  const today = new Date().toISOString().split("T")[0]; // "2025-11-12"
  const todaysCount = orderData.filter((order) => {
    const orderDate = order.order_date.split(" ")[0];
    return orderDate === today;
  }).length;

  // Example data — replace with your dynamic order counts later
  const orderStats = [
    {
      title: "Today's Orders",
      count: todaysCount,
      icon: CalendarDays,
      color: "bg-indigo-100 text-indigo-700 border-indigo-300",
    },
    {
      title: "Pending Orders",
      count: pendingCount,
      icon: Package,
      color: "bg-yellow-100 text-yellow-700 border-yellow-300",
    },
    {
      title: "Confirmed Orders",
      count: confirmedCount,
      icon: CheckCircle,
      color: "bg-blue-100 text-blue-700 border-blue-300",
    },
    {
      title: "Shipped Orders",
      count: shippedCount,
      icon: Truck,
      color: "bg-purple-100 text-purple-700 border-purple-300",
    },
    {
      title: "Delivered Orders",
      count: deliveredCount,
      icon: ShoppingBag,
      color: "bg-green-100 text-green-700 border-green-300",
    },
    {
      title: "Cancelled Orders",
      count: cancelledCount,
      icon: XCircle,
      color: "bg-red-100 text-red-700 border-red-300",
    },
    {
      title: "All Orders",
      count: allCount,
      icon: Layers,
      color: "bg-gray-100 text-gray-700 border-gray-300",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-7 xl:grid-cols-7 gap-2 lg:gap-3 mb-2">
      {orderStats.map(({ title, count, icon: Icon, color }, idx) => (
        <div
          key={idx}
          className={`border ${color} md:p-4 p-1 rounded h-18 shadow-sm flex items-center justify-between transition-transform hover:scale-105 hover:shadow-md`}
        >
          <div>
            <h4 className="text-sm font-medium mt-1 text-gray-600">{title}</h4>
            <p className="text-2xl font-bold mt-1">{count}</p>
          </div>
          <Icon className="w-7 h-7 opacity-80" />
        </div>
      ))}
    </div>
  );
};

export default OrderStatusCards;
