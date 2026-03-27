import React, { useContext, useMemo, useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Clock,
  ArrowUpRight,
  RotateCcw,
  Banknote,
  Percent,
  XCircle,
  PlusCircle,
  ShoppingCart,
  X,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import { DataContext } from "@/Context Api/ApiContext";
import FinancialLedger from "@/components/Accounts/Financialedger";
import axios from "axios";

const AccountsDashboard = () => {
  const { orderData, stockData, updateApi, transactonData } =
    useContext(DataContext);

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [transactions, setTransactions] = useState([]);

  // 1. Create the Refresh Function
  const handleRefresh = () => {
    // If your Context API has a function to re-fetch data, call it here:
    if (updateApi) {
      updateApi();
    } else {
      console.log("Refreshing data from server...");
    }
  };

  // CORE CALCULATION LOGIC
  const { filteredSalesLedger, revenueAccumulator } = useMemo(() => {
    if (!orderData || !stockData)
      return { filteredSalesLedger: [], revenueAccumulator: 0 };

    const masterLedger = [];
    let rev = 0;

    orderData.forEach((order) => {
      const numItems = order.items?.length || 1;
      const couponShare = (order.coupon?.value || 0) / numItems;

      // ✅ Keep track of SKUs already added to this specific order's ledger
      const usedSkuIDs = new Set();

      if (order.courier.payment_status === "Paid") {
        order.items?.forEach((item) => {
          const productStock = stockData.find(
            (stock) => stock.pID === item.product_id,
          );

          if (productStock) {
            // ✅ FIND logic change: Look for SKU matching OID AND NOT already used in this loop
            const soldSKU = productStock.SKU?.find(
              (sku) => sku.OID === order.order_id && !usedSkuIDs.has(sku.skuID),
            );

            const itemDiscount = item.discount || 0;

            const sellingPrice = Math.round(
              item.product_price - (itemDiscount + couponShare),
            );

            if (order.courier.payment_status === "Paid") {
              rev += sellingPrice;
            }

            if (soldSKU) {
              // ✅ Mark this SKU as "used" so the next duplicate item skips it
              usedSkuIDs.add(soldSKU.skuID);

              masterLedger.push({
                oid: order.order_id,
                sku: soldSKU.skuID,
                pid: item.product_id,
                pName: item.product_name || "Unknown Product",
                saleDate: order.order_date,
                webPrice: item.product_price,
                discount: itemDiscount,
                coupon: Math.round(couponShare),
                sellingPrice: sellingPrice,
                cost: soldSKU.cost,
                profit: sellingPrice - soldSKU.cost,
                comment: soldSKU.comment,
                courier: order.courier,
              });
            }
          }
        });
      }
    });

    return { filteredSalesLedger: masterLedger, revenueAccumulator: rev };
  }, [orderData, stockData]);

  // Safe side-effect to update state for the UI cards
  useEffect(() => {
    setTotalRevenue(revenueAccumulator);
  }, [revenueAccumulator]);

  const grossProfit = useMemo(
    () =>
      filteredSalesLedger.reduce(
        (sum, item) => sum + (Number(item.profit) || 0),
        0,
      ),
    [filteredSalesLedger],
  );

  const totalPurchaseCost = useMemo(
    () =>
      filteredSalesLedger.reduce(
        (sum, item) => sum + (Number(item.cost) || 0),
        0,
      ),
    [filteredSalesLedger],
  );

  const netProfit = grossProfit - totalExpense;

  //total stock in
  const totalStockValue = useMemo(() => {
    // safety check for the data
    if (!stockData || !Array.isArray(stockData)) return 0;

    return stockData.reduce((totalValue, product) => {
      // 1. Look inside the SKU array for this product
      const productStockValue = (product.SKU || []).reduce((sum, sku) => {
        // 2. Only add the cost if status is true (meaning it's currently in stock)
        if (sku.status === true) {
          return sum + (Number(sku.cost) || 0);
        }

        return sum;
      }, 0);

      // 3. Add this product's stock value to the grand total
      return totalValue + productStockValue;
    }, 0);
  }, [stockData]);

  //total account receiveable
  const accountsReceivable = useMemo(() => {
    if (!orderData || !Array.isArray(orderData)) return 0;

    return orderData.reduce((total, order) => {
      // 1. Check the nested courier status
      // Note: Using .toLowerCase() to handle 'Confirmed' or 'confirmed' safely
      const isConfirmed =
        order.courier?.delivery_status?.toLowerCase() === "confirmed";

      if (isConfirmed) {
        // 2. Calculate: Total Amount - Delivery Charge
        const totalAmount = Number(order.total_amount) || 0;
        const deliveryCharge = Number(order.courier?.delivery_charge) || 0;

        const receivableBalance = totalAmount - deliveryCharge;

        return total + receivableBalance;
      }

      return total;
    }, 0);
  }, [orderData]);

  // --- FETCH SUMMARY DATA ---

  //total invested money
  const totalInvestment = useMemo(() => {
    // 1. Safety check: if transactions is empty or not an array, return 0
    if (!transactonData || !Array.isArray(transactonData)) return 0;

    // 2. Filter for investments and sum the amounts
    return transactonData
      .filter((item) => item.type === "investment")
      .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [transactonData]);

  const monthlyNetProfit = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return filteredSalesLedger
      .filter((item) => {
        const itemDate = new Date(item.saleDate);
        return (
          itemDate.getMonth() === currentMonth &&
          itemDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, item) => sum + item.profit, 0)
      .toLocaleString();
  }, [filteredSalesLedger]);

  const accountStats = [
    {
      title: "Total Revenue",
      value: "৳" + totalRevenue.toLocaleString(),
      icon: TrendingUp,
      color: "border-emerald-300 bg-emerald-50 text-emerald-700",
    },
    {
      title: "Total Expense",
      value: "৳ 0",
      icon: TrendingDown,
      color: "border-rose-300 bg-rose-50 text-rose-700",
    },
    {
      title: "Accounts Receivable",
      value: "৳ 0",
      icon: Clock,
      color: "border-amber-300 bg-amber-50 text-amber-700",
    },
    {
      title: "Net Profit",
      value: "৳",
      icon: Wallet,
      color: "border-indigo-300 bg-indigo-50 text-indigo-700",
    },

    {
      title: "Total Stock/Asset",
      value: "৳ 0",
      icon: Percent,
      color: "border-slate-300 bg-slate-50 text-slate-700",
    },
    {
      title: "Capital",
      value: "৳ 0",
      icon: RotateCcw,
      color: "border-orange-300 bg-orange-50 text-orange-700",
    },
    {
      title: "Cash on Hand",
      value: "৳ 0",
      icon: Banknote,
      color: "border-cyan-300 bg-cyan-50 text-cyan-700",
    },
  ];

  return (
    <div className="flex flex-col mt-11 md:mt-0">
      <div className="flex-shrink-0 md:sticky top-0 z-40">
        <Navbar pageTitle={"Accounts"} />
        <div className="hidden grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-2 lg:gap-3">
          {accountStats.map(({ title, value, icon: Icon, color }, idx) => (
            <div
              key={idx}
              className={`border rounded px-3 py-2 md:px-4 flex flex-col justify-between hover:shadow-md transition ${color}`}
            >
              <div className="flex items-center justify-between -mb-2">
                <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-wider opacity-80">
                  {title}
                </h4>
                <Icon className="w-4 h-4 opacity-70" />
              </div>
              <p className="text-lg md:text-lg font-black mt-2">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto  space-y-4 custom-scrollbar">
        <div className=" md:flex  md:justify-between">
          <div class="max-w-4xl p-4 bg-white border border-slate-200 rounded font-sans">
            <div class="flex items-center justify-between pb-3 mb-1 border-b border-slate-100">
              <div>
                <h2 class="text-xs font-bold tracking-widest text-slate-500 uppercase">
                  Total Capital
                </h2>
                <p class="text-2xl font-extrabold text-slate-900 leading-none mt-1.5">
                  ৳0.00
                </p>
              </div>
              <div class="p-3 bg-indigo-50 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-6 h-6 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div class="px-4  transition-all border-l-4 bg-slate-50 border-emerald-500 rounded-r-xl hover:shadow-md">
                <span class="text-[10px] font-bold uppercase text-slate-500">
                  Cash Asset
                </span>
                <p class="mt-1 text-xl font-bold text-emerald-700">৳0.00</p>
              </div>

              <div class="px-4  transition-all border-l-4 bg-slate-50 border-blue-500 rounded-r-xl hover:shadow-md">
                <span class="text-[10px] font-bold uppercase text-slate-500">
                  Stock In
                </span>
                <p class="mt-1 text-xl font-bold text-blue-700">
                  ৳{totalStockValue}
                </p>
              </div>

              <div class="px-4  transition-all border-l-4 bg-slate-50 border-amber-500 rounded-r-xl hover:shadow-md">
                <span class="text-[10px] font-bold uppercase text-slate-500">
                  A/C Receivable
                </span>
                <p class="mt-1 text-xl font-bold text-amber-700">
                  ৳{accountsReceivable}
                </p>
              </div>

              <div class="px-4  transition-all border-l-4 bg-slate-50 border-indigo-500 rounded-r-xl hover:shadow-md">
                <span class="text-[10px] font-bold uppercase text-slate-500">
                  Equity Capital
                </span>
                <p class="mt-1 text-xl font-bold text-indigo-700">৳{totalInvestment}</p>
              </div>
            </div>
          </div>

          <div class="p-4 mt-3 md:mt-0 bg-white border border-slate-200 font-sans">
            <div class="flex items-center justify-between pb-3 mb-1 border-b border-slate-100">
              <div>
                <h2 class="text-xs font-bold tracking-widest text-slate-500 uppercase">
                  Net Profit
                </h2>
                <p class="text-2xl font-extrabold text-teal-600 leading-none mt-1.5">
                  ৳{netProfit}.00
                </p>
              </div>
              <div class="p-3 bg-teal-50 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-6 h-6 text-teal-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <div class="px-4  transition-all border-l-4 bg-slate-50 border-blue-500 rounded-r-xl hover:shadow-md">
                <span class="text-[10px] font-bold uppercase text-slate-500">
                  Total Revenue
                </span>
                <div class="flex items-baseline gap-2 mt-1">
                  <p class="text-xl font-bold text-blue-700">৳{totalRevenue}</p>
                </div>
              </div>

              <div class="px-4 transition-all border-l-4 bg-slate-50 border-orange-500 rounded-r-xl hover:shadow-md">
                <span class="text-[10px] font-bold uppercase text-slate-500">
                  Purchase Cost
                </span>
                <div class="flex items-baseline gap-2 mt-1">
                  <p class="text-xl font-bold text-orange-700">
                    ৳{totalPurchaseCost}
                  </p>
                </div>
              </div>

              <div class="px-4  transition-all border-l-4 bg-slate-50 border-emerald-500 rounded-r-xl hover:shadow-md">
                <span class="text-[10px] font-bold uppercase text-slate-500">
                  Gross Profit
                </span>
                <div class="flex items-baseline gap-2 mt-1">
                  <p class="text-xl font-bold text-emerald-700">
                    ৳{grossProfit}
                  </p>
                </div>
              </div>

              <div class="px-4  transition-all border-l-4 bg-slate-50 border-rose-500 rounded-r-xl hover:shadow-md">
                <span class="text-[10px] font-bold uppercase text-slate-500">
                  Total Expense
                </span>
                <div class="flex items-baseline gap-2 mt-1">
                  <p class="text-xl font-bold text-rose-700">৳{totalExpense}</p>
                </div>
              </div>

              <div class="px-4  transition-all border-l-4 bg-slate-50 border-slate-400 rounded-r-xl hover:shadow-md">
                <span class="text-[10px] font-bold uppercase text-slate-500">
                  Profit Margin
                </span>
                <p class="mt-1 text-xl font-bold text-slate-700">0.0%</p>
              </div>
            </div>
          </div>

          <div className="hidden bg-white w-1/4 px-5 pt-2 rounded border border-slate-200">
            <h3 className="text-sm font-bold border-b uppercase text-slate-500 tracking-wider">
              Account Balances
            </h3>
            <div className="space-y-1">
              <BalanceItem label="bKash Merchant" amount="45,000" />
              <BalanceItem label="City Bank" amount="62,300" />
              <BalanceItem label="Cash in Hand" amount="5,500" />
            </div>
          </div>

          <div className="hidden bg-gradient-to-br w-1/4 from-indigo-600 to-violet-700 p-5 rounded text-white shadow-lg">
            <h3 className="text-sm opacity-80">
              Estimated Profit (This Month)
            </h3>
            <div className="text-3xl font-bold mt-1">৳{monthlyNetProfit}</div>
            <div className="mt-4 flex items-center gap-2 text-xs bg-white/20 w-fit px-2 py-1 rounded-full">
              <ArrowUpRight size={14} /> Tracking Healthy
            </div>
          </div>
        </div>

        <FinancialLedger onRefresh={handleRefresh} />
        {/* --- SALES LEDGER TABLE --- */}
        <div className="bg-white rounded border border-slate-200 shadow-xs overflow-hidden flex flex-col h-full">
          <div className="p-4 border-b bg-[#1976d2] flex justify-between items-center">
            <h3 className="text-xs font-black text-white uppercase tracking-widest">
              Consolidated Sales Ledger
            </h3>
            <div className="flex items-center gap-2 px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-[10px] font-black uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              Live Audit
            </div>
          </div>
          <div className="overflow-x-auto whitespace-nowrap">
            <table className="w-full text-left border-collapse min-w-[1200px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-3 text-[12px] font-black text-slate-500 uppercase">
                    OID
                  </th>
                  <th className="p-3 text-[12px] font-black text-slate-500 uppercase">
                    SKU
                  </th>
                  <th className="p-3 text-[12px] font-black text-slate-500 uppercase">
                    PID
                  </th>
                  <th className="p-3 text-[12px] font-black text-slate-500 uppercase">
                    P-Name
                  </th>
                  <th className="p-3 text-[12px] font-black text-slate-500 uppercase">
                    Date
                  </th>
                  <th className="p-3 text-center text-[12px] font-black text-slate-400 uppercase">
                    Web Price
                  </th>
                  <th className="p-3 text-center text-[12px] font-black text-rose-400 uppercase">
                    Discount
                  </th>
                  <th className="p-3 text-center text-[12px] font-black text-rose-400 uppercase"></th>
                  <th className="p-3 text-center text-[12px] font-black text-orange-400 uppercase">
                    Coupon
                  </th>
                  <th className="p-3 text-center text-[12px] font-black text-indigo-600 uppercase">
                    Selling
                  </th>
                  <th className=" text-center text-[17px] font-black text-indigo-600 uppercase"></th>
                  <th className="p-3 text-center text-[12px] font-black text-slate-500 uppercase">
                    Purchase
                  </th>
                  <th className="p-3 text-center text-[12px] font-black text-orange-600 uppercase">
                    Pay. Status
                  </th>
                  <th className="p-3 text-center text-[12px] font-black text-orange-600  uppercase">
                    Pay. Method
                  </th>
                  <th className="p-3 text-center text-[12px] font-black text-orange-600  uppercase">
                    Status
                  </th>
                  <th className="p-3 text-right text-[12px] font-black text-emerald-600 uppercase">
                    Profit
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSalesLedger.map((row) => (
                  <tr
                    key={`${row.oid}-${row.sku}`}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-3 text-[13px] font-bold text-indigo-600">
                      {row.oid}
                    </td>
                    <td className="p-3 text-[13px] font-bold text-slate-600">
                      {row.sku}
                    </td>
                    <td className="p-3 text-[13px] font-semibold text-slate-500">
                      {row.pid}
                    </td>
                    <td className="p-3 text-[13px] font-bold text-slate-600 truncate max-w-[150px]">
                      {row.pName}
                    </td>
                    <td className="p-3 text-[13px] font-semibold text-slate-500">
                      {row.saleDate}
                    </td>
                    <td className="p-3 text-center text-[13px] font-semibold text-slate-600">
                      ৳{row.webPrice}
                    </td>
                    <td className="p-3 text-center border-l text-[13px] font-semibold text-rose-500">
                      ৳{row.discount}
                    </td>
                    <td className="p-3 text-center text-[17px] font-semibold text-rose-500">
                      +
                    </td>
                    <td className="p-3 text-center text-[13px] font-semibold text-orange-500">
                      ৳{row.coupon}
                    </td>
                    <td className="p-3 text-center border-l text-[13px] font-black text-indigo-600 bg-indigo-50/20">
                      ৳{row.sellingPrice}
                    </td>
                    <td className="p-3 text-center text-[17px] font-black text-indigo-600 bg-indigo-50/20">
                      -
                    </td>
                    <td className="p-3 text-center text-[13px] font-semibold text-slate-600">
                      ৳{row.cost}
                    </td>

                    <td className="p-3 border-l text-center text-[13px]  text-white  ">
                      <span className="bg-green-600 p-1 px-3 font-bold  rounded-2xl">
                        {row.courier.payment_status}
                      </span>
                    </td>
                    <td className="p-3 text-center text-[13px] font-semibold text-slate-600">
                      <span className="px-3 p-1 bg-amber-600 text-white rounded-2xl">
                        {" "}
                        {row.courier.payment_method}
                      </span>
                    </td>
                    <td className="p-3 text-center  border-r text-[13px] font-semibold text-slate-600">
                      <span className="px-3 bg-slate-800 p-1 text-white rounded-2xl">
                        {" "}
                        {row.courier.delivery_status}
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      <span
                        className={`px-3 p-1 rounded font-black text-[15px] ${row.profit >= 0 ? "bg-emerald-200 text-emerald-800" : "bg-rose-100 text-rose-700"}`}
                      >
                        ৳ {row.profit}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 border-t bg-slate-50 flex justify-between items-center px-6">
            <span className="text-[11px] font-black text-slate-500 uppercase">
              Orders Analyzed: {orderData?.length || 0}
            </span>
            <div className="text-right">
              <span className="text-[11px] font-black text-slate-500 uppercase mr-2">
                Life-time Net Profit:
              </span>
              <span className="text-sm font-black text-emerald-600">
                ৳{grossProfit}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BalanceItem = ({ label, amount }) => (
  <div className="flex justify-between py-2 border-b last:border-none text-black">
    <span className="text-sm text-slate-600">{label}</span>
    <span className="font-bold text-sm">৳{amount}</span>
  </div>
);

export default AccountsDashboard;
