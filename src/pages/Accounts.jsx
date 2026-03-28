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

            let sellingPrice = 0;

            const codFee = order.courier.delivery_charge * (1 / 100);
            if (order.courier.name === "ByteXpress") {
              sellingPrice = Math.round(
                item.product_price - (itemDiscount + couponShare),
              );
            } else {
              sellingPrice = Math.round(
                (item.product_price - (itemDiscount + couponShare)) * 0.99 -
                  codFee,
              );
            }

            if (order.courier.payment_status === "Paid") {
              rev += sellingPrice;
            }

            if (soldSKU) {
              //  Mark this SKU as "used" so the next duplicate item skips it
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

  //for calculate profit
  const totalSoldPurchaseCost = useMemo(
    () =>
      filteredSalesLedger.reduce(
        (sum, item) => sum + (Number(item.cost) || 0),
        0,
      ),
    [filteredSalesLedger],
  );

  //total invested money
  const totalPurchase = useMemo(() => {
    if (!transactonData || !Array.isArray(transactonData)) return 0;

    // 2. Filter for investments and sum the amounts
    return transactonData
      .filter((item) => item.type === "purchase")
      .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [transactonData]);

  //total stock in
  const totalStockValue = useMemo(() => {
    // safety check for the data
    if (!stockData || !Array.isArray(stockData)) return 0;

    return stockData.reduce((totalValue, product) => {
      // 1. Look inside the SKU array for this product
      const productStockValue = (product.SKU || []).reduce((sum, sku) => {
        // 2. Only add the cost if status is true (meaning it's currently in stock)
        if (sku.status === true || sku.status === false) {
          return sum + (Number(sku.cost) || 0);
        }

        return sum;
      }, 0);

      // 3. Add this product's stock value to the grand total
      return totalValue + productStockValue;
    }, 0);
  }, [stockData]);

  //total stock in
  const totalStockInValue = useMemo(() => {
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
      // Correct Logic: Status is NOT Pending AND status is NOT Delivered
      const isConfirmed =
        order.courier?.delivery_status?.toLowerCase() !== "pending" &&
        order.courier?.delivery_status?.toLowerCase() !== "delivered";

      if (isConfirmed) {
        let receivableBalance = 0;

        // 2. Calculate: Total Amount - Delivery Charge
        if (order.courier.name === "steadfast") {
          const totalAmount = Number(order.total_amount) || 0;
          const deliveryCharge = Number(order.courier?.delivery_charge) || 0;
          const finalTotal = totalAmount * 0.99;
          receivableBalance = finalTotal - deliveryCharge;
        } else {
          const totalAmount = Number(order.total_amount) || 0;
          const deliveryCharge = Number(order.courier?.delivery_charge) || 0;

          receivableBalance = totalAmount - deliveryCharge;
        }

        return total + receivableBalance;
      }

      return total;
    }, 0);
  }, [orderData]);

  // --- FETCH SUMMARY DATA ---

  //total invested money
  const totalInvestment = useMemo(() => {
    if (!transactonData || !Array.isArray(transactonData)) return 0;

    // 2. Filter for investments and sum the amounts
    return transactonData
      .filter((item) => item.type === "investment")
      .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [transactonData]);

  //total invested money
  const totalExpense = useMemo(() => {
    if (!transactonData || !Array.isArray(transactonData)) return 0;

    // 2. Filter for investments and sum the amounts
    return transactonData
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [transactonData]);

  const netProfit = grossProfit - totalExpense;

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

  //calculate current cash
  const currentCash =
    totalInvestment + totalRevenue - (totalExpense + totalPurchase);

  return (
    <div className=" mt-11 md:mt-0">
      <div className=" md:sticky top-0 z-40">
        <Navbar pageTitle={"Accounts"} />
      </div>

      <div className="flex flex-col xl:flex-row gap-3 mt-4 xl:justify-between items-stretch">
        <div class="max-w-xl p-4 bg-white border border-slate-200 rounded font-sans">
          <div class="flex items-center justify-between pb-3 mb-1 border-b border-slate-100">
            <div>
              <h2 class="text-xs font-bold tracking-widest text-slate-500 uppercase">
                Total Capital
              </h2>
              <p class="text-2xl font-extrabold text-slate-900 leading-none mt-1.5">
                ৳{totalStockInValue + accountsReceivable}
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

          <div class="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-4">
            <div class="px-4  transition-all border-l-4 bg-slate-50 border-emerald-500 rounded-r-xl hover:shadow-md">
              <span class="text-[10px] font-bold uppercase text-slate-500">
                Cash Asset
              </span>
              <p class="mt-1 text-xl font-bold text-emerald-700">
                ৳{currentCash.toLocaleString(0)}
              </p>
            </div>

            <div class="px-4  transition-all border-l-4 bg-slate-50 border-blue-500 rounded-r-xl hover:shadow-md">
              <span class="text-[10px] font-bold uppercase text-slate-500">
                Stock In
              </span>
              <p class="mt-1 text-xl font-bold text-blue-700">
                ৳{totalStockInValue.toLocaleString()}
              </p>
            </div>

            <div class="px-4  transition-all border-l-4 bg-slate-50 border-amber-500 rounded-r-xl hover:shadow-md">
              <span class="text-[10px] font-bold uppercase text-slate-500">
                A/C Receivable
              </span>
              <p class="mt-1 text-xl font-bold text-amber-700">
                ৳{accountsReceivable.toLocaleString()}
              </p>
            </div>

            <div class="px-4  transition-all border-l-4 bg-slate-50 border-indigo-500 rounded-r-xl hover:shadow-md">
              <span class="text-[10px] font-bold uppercase text-slate-500">
                Equity Capital
              </span>
              <p class="mt-1 text-xl font-bold text-indigo-700">
                ৳{totalInvestment.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div class=" mt-3 md:mt-0 bg-white border border-slate-200 font-sans">
          {/* Main Header: Total Capital Flow */}

          <div className="w-full bg-white border border-slate-100 rounded  overflow-hidden flex flex-col h-full font-sans">
            {/* Header with Glassmorphism feel */}
            <div className="px-3 py-2 bg-slate-800 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-emerald-500 rounded text-white">
                  <ShoppingCart size={14} />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-100">
                  Inventory Assets
                </h3>
              </div>
              <span className="text-[10px] font-bold text-slate-900 bg-white px-2 py-0.5 rounded-full border border-white/20">
                Real-time
              </span>
            </div>

            {/* Main Stats Area */}
            <div className="flex-1 px-4 flex flex-col justify-center ">
              <div className="flex items-center justify-between gap-4">
                {/* Current Stock (S) */}
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    In-Stock Value
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-emerald-600">
                      ৳
                    </span>
                    <p className="text-2xl font-black text-slate-800 tracking-tight">
                      {totalStockValue.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Modern Divider */}
                <div className="flex flex-col items-center gap-1 opacity-50">
                  <div className="h-4 w-[1px] bg-slate-900"></div>
                  <span className="text-xl font-black text-slate-900">=</span>
                  <div className="h-4 w-[1px] bg-slate-900"></div>
                </div>

                {/* Total Purchase (T) */}
                <div className="flex-1 text-right">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Total Sourcing
                  </span>
                  <div className="flex items-baseline justify-end gap-1">
                    <span className="text-sm font-bold text-blue-600">৳</span>
                    <p className="text-2xl font-black text-slate-800 tracking-tight">
                      {totalPurchase.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 ">
                {/* The Warning/Success Circle */}
                <div className="relative flex h-3 w-3 mt-1.5">
                  {totalStockValue === totalPurchase ? (
                    // GREEN PING: Perfectly Balanced (S = T)
                    <>
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </>
                  ) : (
                    // RED PING: Discrepancy Found (S != T)
                    <>
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                    </>
                  )}
                </div>

                {/* Optional: Small Label to show the state */}
                <span
                  className={`text-[10px] mt-1.5 font-black uppercase tracking-widest ${
                    totalStockValue === totalPurchase
                      ? "text-emerald-600"
                      : "text-rose-600"
                  }`}
                >
                  {totalStockValue === totalPurchase
                    ? "Balanced"
                    : "Audit Alert - missing Stock"}
                </span>
              </div>
            </div>
          </div>

          {/* 2. Product Purchase (Productive Cost) */}
          <div class="px-4 transition-all border-l-4 bg-slate-50 border-blue-500 rounded-r-xl hover:shadow-md">
            <div className="bg-red-500 w-full h-full"></div>
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
                <p class="text-xl font-bold text-blue-700">
                  ৳{totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>

            <div class="px-4 transition-all border-l-4 bg-slate-50 border-orange-500 rounded-r-xl hover:shadow-md">
              <span class="text-[10px] font-bold uppercase text-slate-500">
                Purchase Cost
              </span>
              <div class="flex items-baseline gap-2 mt-1">
                <p class="text-xl font-bold text-orange-700">
                  ৳{totalSoldPurchaseCost.toLocaleString()}
                </p>
              </div>
            </div>

            <div class="px-4  transition-all border-l-4 bg-slate-50 border-emerald-500 rounded-r-xl hover:shadow-md">
              <span class="text-[10px] font-bold uppercase text-slate-500">
                Gross Profit
              </span>
              <div class="flex items-baseline gap-2 mt-1">
                <p class="text-xl font-bold text-emerald-700">
                  ৳{grossProfit.toLocaleString()}
                </p>
              </div>
            </div>

            <div class="px-4  transition-all border-l-4 bg-slate-50 border-rose-500 rounded-r-xl hover:shadow-md">
              <span class="text-[10px] font-bold uppercase text-slate-500">
                Total Expense
              </span>
              <div class="flex items-baseline gap-2 mt-1">
                <p class="text-xl font-bold text-rose-700">
                  ৳{totalExpense.toLocaleString()}
                </p>
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
      </div>

      <FinancialLedger onRefresh={handleRefresh} />
      {/* --- SALES LEDGER TABLE --- */}
      <div className="bg-white mt-4 rounded border border-slate-200 shadow-xs overflow-hidden flex flex-col h-full">
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
  );
};

const BalanceItem = ({ label, amount }) => (
  <div className="flex justify-between py-2 border-b last:border-none text-black">
    <span className="text-sm text-slate-600">{label}</span>
    <span className="font-bold text-sm">৳{amount}</span>
  </div>
);

export default AccountsDashboard;
