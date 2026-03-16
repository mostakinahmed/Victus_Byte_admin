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

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [mainCat, setMainCat] = useState("");
  const [subCat, setSubCat] = useState("");
  const [totalRevenue, setTotalRevenue] = useState(0);

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

          if (order.status === "Shipped" || order.status === "Confirmed") {
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
            });
          }
        }
      });
    });

    return { filteredSalesLedger: masterLedger, revenueAccumulator: rev };
  }, [orderData, stockData]);

  console.log(filteredSalesLedger);
  // Safe side-effect to update state for the UI cards
  useEffect(() => {
    setTotalRevenue(revenueAccumulator);
  }, [revenueAccumulator]);

  const netProfit = useMemo(
    () =>
      filteredSalesLedger
        .reduce((sum, item) => sum + item.profit, 0)
        .toLocaleString(),
    [filteredSalesLedger],
  );

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
      title: "Net Profit",
      value: "৳" + netProfit,
      icon: Wallet,
      color: "border-indigo-300 bg-indigo-50 text-indigo-700",
    },
    {
      title: "Pending COD",
      value: "৳ 0",
      icon: Clock,
      color: "border-amber-300 bg-amber-50 text-amber-700",
    },
    {
      title: "Gateway Fees",
      value: "৳ 0",
      icon: Percent,
      color: "border-slate-300 bg-slate-50 text-slate-700",
    },
    {
      title: "Refunds",
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
      <div className="flex-shrink-0 md:sticky top-0 z-40 bg-white pb-3">
        <Navbar pageTitle={"Accounts"} />
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-2 lg:gap-3">
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

      <div className="flex-1 overflow-y-auto py-4 space-y-4 custom-scrollbar">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded border border-slate-300">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-slate-800">
              Financial Ledger
            </h2>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs font-medium bg-slate-100 rounded hover:bg-slate-200">
                This Month
              </button>
              <button className="px-3 py-1 text-xs font-medium bg-white border rounded hover:bg-slate-50">
                Export PDF
              </button>
            </div>
          </div>
          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded font-bold text-sm transition-all shadow-md active:scale-95"
          >
            <TrendingDown size={16} /> Log New Expense
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-3">
            <div className="bg-white p-5 rounded border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold mb-4 uppercase text-slate-500 tracking-wider">
                Account Balances
              </h3>
              <div className="space-y-4">
                <BalanceItem label="bKash Merchant" amount="45,000" />
                <BalanceItem label="City Bank" amount="62,300" />
                <BalanceItem label="Cash in Hand" amount="5,500" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-5 rounded text-white shadow-lg">
              <h3 className="text-sm opacity-80">
                Estimated Profit (This Month)
              </h3>
              <div className="text-3xl font-bold mt-1">৳{monthlyNetProfit}</div>
              <div className="mt-4 flex items-center gap-2 text-xs bg-white/20 w-fit px-2 py-1 rounded-full">
                <ArrowUpRight size={14} /> Tracking Healthy
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded border border-slate-200 shadow-sm overflow-hidden flex flex-col h-fit">
            <div className="p-4 border-b bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest">
                Recent Transactions
              </h3>
              <span className="text-[10px] text-slate-400 font-medium italic">
                Auto-syncing active
              </span>
            </div>
            <div className="overflow-auto max-h-[600px] custom-scrollbar">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-slate-50 z-10 border-b">
                  <tr className="text-[10px] uppercase text-slate-500 font-bold">
                    <th className="p-4">Details</th>
                    <th className="p-4 text-center">Category</th>
                    <th className="p-4 text-center">Method</th>
                    <th className="p-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.map((t) => (
                    <tr
                      key={t.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="font-bold text-sm text-slate-800">
                          {t.entity}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono uppercase tracking-tighter">
                          {t.ref} • {t.date}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${t.type === "Income" ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-rose-50 border-rose-100 text-rose-600"}`}
                        >
                          {t.category}
                        </span>
                      </td>
                      <td className="p-4 text-center text-xs font-semibold text-slate-600">
                        {t.method}
                      </td>
                      <td
                        className={`p-4 text-right font-black ${t.type === "Income" ? "text-emerald-600" : "text-rose-600"}`}
                      >
                        {t.type === "Income" ? "+" : "-"} ৳
                        {t.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

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
          <div className="overflow-x-auto custom-scrollbar">
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
                  <th className="p-3 text-center text-[12px] font-black text-orange-400 uppercase">
                    Coupon
                  </th>
                  <th className="p-3 text-center text-[12px] font-black text-indigo-600 uppercase">
                    Selling
                  </th>
                  <th className="p-3 text-center text-[12px] font-black text-slate-400 uppercase">
                    Cost
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
                    <td className="p-3 text-center text-[13px] font-semibold text-rose-500">
                      ৳{row.discount}
                    </td>
                    <td className="p-3 text-center text-[13px] font-semibold text-orange-500">
                      ৳{row.coupon}
                    </td>
                    <td className="p-3 text-center text-[13px] font-black text-indigo-600 bg-indigo-50/20">
                      ৳{row.sellingPrice}
                    </td>
                    <td className="p-3 text-center text-[13px] font-semibold text-slate-600">
                      ৳{row.cost}
                    </td>
                    <td className="p-3 text-right">
                      <span
                        className={`px-2 py-0.5 rounded font-black text-[14px] ${row.profit >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}
                      >
                        ৳{row.profit}
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
                ৳{netProfit}
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
