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

const expenseCategories = {
  Logistics: [
    "Courier Fees",
    "Packaging Materials",
    "Return Shipping (RTO)",
    "Warehouse Labor",
  ],
  Marketing: [
    "Facebook Ads",
    "Google Ads",
    "Influencer Payment",
    "Product Photography",
  ],
  Operations: [
    "Office Rent",
    "Utility Bills (Net/Elec)",
    "Software/SaaS",
    "Stationery",
  ],
  Sourcing: ["Product Purchase", "Import Duty", "Factory Transport"],
  Miscellaneous: ["Tea/Snacks", "Rickshaw/Uber", "Others"],
};

const AccountsDashboard = () => {
  const { orderData, stockData } = useContext(DataContext);

  // Modal visibility states
  const [isInvestmentModalOpen, setIsInvestmentModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const [mainCat, setMainCat] = useState("");
  const [subCat, setSubCat] = useState("");
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  // Mock static data for non-automated stats
  const [transactions] = useState([
    {
      id: 1,
      date: "2026-03-12 10:30",
      type: "Income",
      category: "Product Sale",
      entity: "Mostakin Ahmed",
      method: "bKash",
      amount: 4100,
      ref: "#INV-8821",
    },
    {
      id: 2,
      date: "2026-03-13 11:15",
      type: "Expense",
      category: "Ad Spend",
      entity: "Facebook Ads",
      method: "City Bank",
      amount: 5000,
      ref: "#EXP-0041",
    },
  ]);

  // --- CORE CALCULATION LOGIC ---
  // const { filteredSalesLedger, revenueAccumulator } = useMemo(() => {
  //   if (!orderData || !stockData)
  //     return { filteredSalesLedger: [], revenueAccumulator: 0 };

  //   const masterLedger = [];
  //   let rev = 0;

  //   orderData.forEach((order) => {
  //     const numItems = order.items?.length || 1;

  //     order.items?.forEach((item) => {
  //       const productStock = stockData.find(
  //         (stock) => stock.pID === item.product_id,
  //       );

  //       if (productStock) {
  //         const soldSKU = productStock.SKU?.find(
  //           (sku) => sku.OID === order.order_id,
  //         );

  //         // Calculate per-unit price: (Item Price) - (Global Discount / Number of Units) - (Coupon / Number of Units)
  //         const discountShare = (order.discount || 0) / numItems;
  //         const couponShare = (order.coupon?.value || 0) / numItems;
  //         const sellingPrice = Math.round(
  //           item.product_price - (discountShare + couponShare),
  //         );

  //         // Sum revenue for confirmed/shipped orders
  //         if (order.status === "Shipped" || order.status === "Confirmed") {
  //           rev += sellingPrice;
  //         }

  //         if (soldSKU) {
  //           masterLedger.push({
  //             oid: order.order_id,
  //             sku: soldSKU.skuID,
  //             pid: item.product_id,
  //             pName: item.product_name || "Unknown Product",
  //             saleDate: order.order_date,
  //             webPrice: item.product_price,
  //             discount: Math.round(discountShare),
  //             coupon: Math.round(couponShare),
  //             sellingPrice: sellingPrice,
  //             cost: soldSKU.cost,
  //             profit: sellingPrice - soldSKU.cost,
  //             comment: soldSKU.comment,
  //           });
  //         }
  //       }
  //     });
  //   });

  //   return { filteredSalesLedger: masterLedger, revenueAccumulator: rev };
  // }, [orderData, stockData]);

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
                <h2 class="text-xs font-bold tracking-widest text-slate-400 uppercase">
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
                <p class="mt-1 text-xl font-bold text-indigo-700">৳0.00</p>
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

        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded border border-slate-300">
          <div className="flex items-center md:gap-4">
            <h2 className="text-lg font-bold mr-1 text-slate-800">
              Financial Ledger
            </h2>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs font-medium bg-slate-100 rounded hover:bg-slate-200 transition-colors">
                This Month
              </button>
              <button className="px-3 py-1 text-xs font-medium bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">
                Export PDF
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-6">
            {/* 1. Invested Money (Capital Inflow) */}
            <button
              onClick={() => setIsInvestmentModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2 rounded font-bold text-sm transition-all shadow-sm active:scale-95"
            >
              <PlusCircle size={16} /> Add Investment
            </button>

            {/* 2. Purchase Product Cost (Productive Cost / COGS) */}
            <button
              onClick={() => setIsPurchaseModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-[#1976d2] hover:bg-blue-700 text-white px-6 py-2 rounded font-bold text-sm transition-all shadow-sm active:scale-95"
            >
              <ShoppingCart size={16} /> Product Purchase
            </button>

            {/* 3. Non-Productive Expense (OPEX) */}
            <button
              onClick={() => setIsExpenseModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded font-bold text-sm transition-all shadow-sm active:scale-95"
            >
              <TrendingDown size={16} /> Log New Expense
            </button>
          </div>
        </div>

        {isInvestmentModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="bg-emerald-600 p-4 flex justify-between items-center text-white">
                <h3 className="font-bold flex items-center gap-2">
                  <PlusCircle size={20} /> Add Investment Money
                </h3>
                <button
                  onClick={() => setIsInvestmentModalOpen(false)}
                  className="hover:bg-emerald-700 p-1 rounded"
                >
                  <X size={20} />
                </button>
              </div>

              <form className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Investor Name / Source
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Owner Capital"
                    className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Investment Amount (৳)
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-emerald-500 outline-none font-mono text-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
                    defaultValue={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors mt-2"
                >
                  Confirm Investment
                </button>
              </form>
            </div>
          </div>
        )}

        {isPurchaseModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="bg-[#1976d2] p-4 flex justify-between items-center text-white">
                <h3 className="font-bold flex items-center gap-2">
                  <ShoppingCart size={20} /> Product Purchase Cost
                </h3>
                <button
                  onClick={() => setIsPurchaseModalOpen(false)}
                  className="hover:bg-blue-700 p-1 rounded"
                >
                  <X size={20} />
                </button>
              </div>

              <form className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Supplier / Product Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Samsung Galaxy S24 Batch"
                    className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                      Unit Cost (৳)
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      placeholder="1"
                      className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Total Bill (৳)
                  </label>
                  <input
                    type="number"
                    disabled
                    className="w-full p-2 bg-slate-100 border border-slate-300 rounded font-bold text-blue-700"
                    placeholder="Auto-calculated"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#1976d2] hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors mt-2"
                >
                  Log Purchase Cost
                </button>
              </form>
            </div>
          </div>
        )}

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

      {/* --- EXPENSE MODAL --- */}
      {isExpenseModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={(e) =>
            e.target === e.currentTarget && setIsExpenseModalOpen(false)
          }
        >
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl relative z-10 overflow-hidden border border-slate-200">
            <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
              <div className="flex items-center gap-2 text-rose-600">
                <TrendingDown size={20} />
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-widest">
                  Record Expense
                </h3>
              </div>
              <button
                onClick={() => setIsExpenseModalOpen(false)}
                className="text-slate-400 hover:text-rose-500"
              >
                <XCircle size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Main Category
                  </label>
                  <select
                    className="w-full p-2.5 border rounded-lg text-sm bg-white"
                    value={mainCat}
                    onChange={(e) => {
                      setMainCat(e.target.value);
                      setSubCat("");
                    }}
                  >
                    <option value="">Select...</option>
                    {Object.keys(expenseCategories).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Sub Category
                  </label>
                  <select
                    className="w-full p-2.5 border rounded-lg text-sm bg-white"
                    disabled={!mainCat}
                    value={subCat}
                    onChange={(e) => setSubCat(e.target.value)}
                  >
                    <option value="">Select...</option>
                    {mainCat &&
                      expenseCategories[mainCat].map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Amount (৳)
                  </label>
                  <input
                    type="number"
                    className="w-full p-2.5 border rounded-lg text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Source
                  </label>
                  <select className="w-full p-2.5 border rounded-lg text-sm">
                    <option>Cash</option>
                    <option>City Bank</option>
                  </select>
                </div>
              </div>
              <button className="w-full bg-rose-600 text-white py-3.5 rounded-lg font-bold uppercase text-xs tracking-widest">
                Confirm Transaction
              </button>
            </div>
          </div>
        </div>
      )}
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
