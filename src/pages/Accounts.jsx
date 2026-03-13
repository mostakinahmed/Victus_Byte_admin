import React, { useContext, useMemo, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Clock,
  ArrowUpRight,
  RotateCcw,
  Banknote,
  Percent,
  Truck,
  Megaphone,
  Building2,
  ShoppingBag,
  Users,
  Coffee,
  XCircle,
  HelpCircle,
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

  const [transactions] = useState([
    {
      id: 1,
      date: "2023-10-24 10:30",
      type: "Income",
      category: "Product Sale",
      entity: "Mostakin Ahmed",
      method: "bKash",
      amount: 1250,
      ref: "#INV-8821",
    },
    {
      id: 2,
      date: "2023-10-24 11:15",
      type: "Expense",
      category: "Ad Spend",
      entity: "Facebook Ads",
      method: "City Bank",
      amount: 5000,
      ref: "#EXP-0041",
    },
    {
      id: 3,
      date: "2023-10-23 14:20",
      type: "Income",
      category: "Product Sale",
      entity: "Nayeem Islam",
      method: "COD",
      amount: 2100,
      ref: "#INV-8822",
    },
    {
      id: 4,
      date: "2023-10-23 16:45",
      type: "Expense",
      category: "Courier Fee",
      entity: "RedX",
      method: "Cash",
      amount: 120,
      ref: "#EXP-0042",
    },
  ]);

  const orders = [
    {
      oid: "ORD-2026-001",
      saleDate: "12 Mar 2026",
      items: [
        {
          sku: "VB-G502-09",
          pid: "P-101",
          pName: "Logitech G502 Mouse",
          webPrice: 4500,
          discount: 300,
          coupon: 100,
          sellingPrice: 4100,
          cost: 3200,
          profit: 900,
        },
        {
          sku: "VB-KBD-B05",
          pid: "P-205",
          pName: "Mechanical Keyboard",
          webPrice: 8500,
          discount: 500,
          coupon: 0,
          sellingPrice: 8000,
          cost: 6500,
          profit: 1500,
        },
      ],
    },
  ];

  //filteres order to maping profit
  const filteredSalesLedger = useMemo(() => {
    if (!orderData || !stockData) return [];

    const masterLedger = [];

    // 1. Loop through every Order
    orderData.forEach((order) => {
      // 2. Loop through every item in that order

      const numOrder = order.items.length;
      let rev = 0;
      order.items.forEach((item) => {
        // 3. Find the specific Stock document for this Product (PID)
        console.log(order);
        const productStock = stockData.find(
          (stock) => stock.pID === item.product_id,
        );

        if (productStock) {
          // 4. Find the specific SKU inside that stock that was sold with this OID
          const soldSKU = productStock.SKU.find(
            (sku) => sku.OID === order.order_id,
          );

          const sellingPrice = Math.round(
            item.product_price * item.quantity -
              ((order.coupon?.value || 0) / numOrder +
                (order.discount || 0) / numOrder),
          );
          rev = rev + sellingPrice;

          if (soldSKU) {
            // 5. Construct the Master Audit Object
            masterLedger.push({
              oid: order.order_id,
              sku: soldSKU.skuID,
              pid: item.product_id,
              pName: item.product_name || "Unknown Product",
              saleDate: order.order_date,
              webPrice: item.product_price, // Original price from product catalog
              discount: order.discount || 0, // Discount from order level
              coupon: order.coupon || 0, // Example coupon logic
              sellingPrice: sellingPrice || 0, // Price customer actually paid
              cost: soldSKU.cost, // Buying cost from Stock Schema
              profit: sellingPrice - soldSKU.cost || 0, // Real Net Profit
              comment: soldSKU.comment,
            });
          }
        }
      });

      setTotalRevenue(rev);
    });

    console.log(totalRevenue);

    return masterLedger;
  }, [orderData, stockData]);

  //tnet profit
  const netProfit = filteredSalesLedger
    .reduce((sum, item) => sum + item.profit, 0)
    .toLocaleString();

  const accountStats = [
    {
      title: "Total Revenue",
      value: "৳" + totalRevenue,
      icon: TrendingUp,
      color: "border-emerald-300 bg-emerald-50 text-emerald-700",
    },
    {
      title: "Total Expense",
      value: "৳ N",
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
      value: "৳ N",
      icon: Clock,
      color: "border-amber-300 bg-amber-50 text-amber-700",
    },
    {
      title: "Gateway Fees",
      value: "৳ N",
      icon: Percent,
      color: "border-slate-300 bg-slate-50 text-slate-700",
    },
    {
      title: "Refunds",
      value: "৳ N",
      icon: RotateCcw,
      color: "border-orange-300 bg-orange-50 text-orange-700",
    },
    {
      title: "Cash on Hand",
      value: "৳ N",
      icon: Banknote,
      color: "border-cyan-300 bg-cyan-50 text-cyan-700",
    },
  ];

  return (
    <div className=" flex flex-col">
      {/* ✅ TOP FIXED SECTION */}
      <div className="flex-shrink-0 sticky top-0 z-40 bg-white pb-3">
        <Navbar pageTitle={"Accounts"} />

        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-2 lg:gap-3">
          {accountStats.map(({ title, value, icon: Icon, color }, idx) => (
            <div
              key={idx}
              className={`border rounded p-3 md:px-4 flex flex-col justify-between  hover:shadow-md transition ${color}`}
            >
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-wider opacity-80">
                  {title}
                </h4>
                <Icon className="w-4 h-4 opacity-70" />
              </div>

              <p className="text-lg md:text-xl font-black mt-2">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ SCROLLABLE CONTENT SECTION */}

      <div className="flex-1 overflow-y-auto  py-4 md:py-6 space-y-6 custom-scrollbar">
        {/* --- ACTION BAR --- */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded border border-slate-200 shadow-xs">
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
        {/* --- THE EXPENSE MODAL --- */}
        {/* --- MAIN DASHBOARD CONTENT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT SIDE: Balances & Insights */}
          <div className="space-y-4">
            <div className="bg-white p-5 rounded border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold mb-4 uppercase text-slate-500 tracking-wider">
                Account Balances
              </h3>
              <div className="space-y-4">
                <BalanceItem
                  label="bKash Merchant"
                  amount="45,000"
                  color="bg-pink-500"
                />
                <BalanceItem
                  label="City Bank"
                  amount="62,300"
                  color="bg-blue-600"
                />
                <BalanceItem
                  label="Cash in Hand"
                  amount="5,500"
                  color="bg-emerald-500"
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-5 rounded text-white shadow-lg">
              <h3 className="text-sm opacity-80">
                Estimated Profit (This Month)
              </h3>
              <div className="text-3xl font-bold mt-1">৳84,200</div>
              <div className="mt-4 flex items-center gap-2 text-xs bg-white/20 w-fit px-2 py-1 rounded-full">
                <ArrowUpRight size={14} /> 24% higher than last month
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Unified Ledger Table */}
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
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                            t.type === "Income"
                              ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                              : "bg-rose-50 border-rose-100 text-rose-600"
                          }`}
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
        {/* --- EXPENSE MODAL --- */}
        {isExpenseModalOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all"
            onClick={(e) => {
              // Closes modal if you click the dark background (not the modal itself)
              if (e.target === e.currentTarget) setIsExpenseModalOpen(false);
            }}
          >
            {/* Dark Backdrop */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />

            {/* Modal Content */}
            <div className="bg-white w-full max-w-md rounded-xl shadow-2xl relative z-10 overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200">
              <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
                <div className="flex items-center gap-2 text-rose-600">
                  <TrendingDown size={20} />
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-widest">
                    Record Business Expense
                  </h3>
                </div>
                <button
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="text-slate-400 hover:text-rose-500 transition-colors"
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
                      className="w-full p-2.5 border rounded-lg text-sm bg-white outline-rose-500 transition-all"
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
                      className="w-full p-2.5 border rounded-lg text-sm bg-white outline-rose-500 disabled:bg-slate-50"
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
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Source
                    </label>
                    <select className="w-full p-2.5 border rounded-lg text-sm">
                      <option>Cash</option>
                      <option>City Bank</option>
                      <option>bKash Merchant</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Expenditure Note
                  </label>
                  <textarea
                    rows="2"
                    className="w-full p-2.5 border rounded-lg text-sm resize-none"
                    placeholder="Add details..."
                  ></textarea>
                </div>

                <button className="w-full bg-rose-600 text-white py-3.5 rounded-lg font-bold uppercase text-xs tracking-widest hover:bg-rose-700 shadow-lg shadow-rose-100 transition-all active:scale-[0.98]">
                  Confirm Transaction
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded border border-slate-200 shadow-xs overflow-hidden flex flex-col h-full">
          {/* Header Section */}
          <div className="p-4 border-b bg-[#1976d2] flex justify-between items-center">
            <h3 className="text-xs font-black text-white uppercase tracking-widest">
              Consolidated Sales Ledger
            </h3>

            <div className="flex items-center gap-2 px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-[10px] font-black uppercase tracking-tighter">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              Live Audit
            </div>
          </div>

          {/* Table Area */}
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
                {filteredSalesLedger.length > 0 ? (
                  filteredSalesLedger.map((row, index) => (
                    <tr
                      key={`${row.oid}-${row.sku}`}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-3 text-[13px] font-bold text-indigo-600 font-mono">
                        {row.oid}
                      </td>
                      <td className="p-3 text-[13px] font-bold text-slate-600 font-mono">
                        {row.sku}
                      </td>
                      <td className="p-3 text-[13px] font-semibold text-slate-500">
                        {row.pid}
                      </td>
                      <td className="p-3 text-[13px] font-bold text-slate-800 truncate max-w-[150px]">
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
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="11"
                      className="p-10 text-center text-slate-400 font-black uppercase tracking-widest opacity-30"
                    >
                      No Sales Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Dynamic Footer Summary */}
          <div className="p-3 border-t bg-slate-50 flex justify-between items-center px-6">
            <div className="flex gap-4">
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                Orders Analyzed: {orderData.length}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest mr-2">
                Accumulated Net Profit:
              </span>
              <span className="text-sm font-black text-emerald-600">
                ৳{netProfit}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded border border-slate-200 shadow-xs overflow-hidden flex flex-col h-full">
          {/* Header Section */}
          <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
              All Sales Details
            </h3>

            <div className="flex items-center gap-2 px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-[10px] font-black uppercase tracking-tighter">
              <span className="relative flex h-2 w-2">
                {/* The Animated Outer Ring */}
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                {/* The Solid Inner Circle */}
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              Live Audit
            </div>
          </div>

          {/* Table Area */}
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[1100px]">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="p-3 text-[12px] font-black text-slate-500 uppercase tracking-tighter">
                    OID
                  </th>
                  <th className="p-3 text-[12px] font-black text-slate-500 uppercase tracking-tighter">
                    SKU
                  </th>
                  <th className="p-3 text-[12px] font-black text-slate-500 uppercase tracking-tighter">
                    PID
                  </th>
                  <th className="p-3 text-[12px] font-black text-slate-500 uppercase tracking-tighter">
                    P-Name
                  </th>
                  <th className="p-3 text-[12px] font-black text-slate-500 uppercase tracking-tighter">
                    Sale Date
                  </th>
                  <th className="p-3 text-center text-[12px] font-black text-slate-400 uppercase tracking-tighter">
                    Web Price
                  </th>
                  <th className="p-3 text-center text-[12px] font-black text-rose-400 uppercase tracking-tighter">
                    Discount
                  </th>
                  <th className="p-3 text-center text-[12px] font-black text-orange-400 uppercase tracking-tighter">
                    Coupon
                  </th>
                  <th className="p-3 text-center text-[12px] font-black text-indigo-600 uppercase tracking-tighter">
                    Selling
                  </th>
                  <th className="p-3 text-center text-[12px] font-black text-slate-400 uppercase tracking-tighter">
                    Cost
                  </th>
                  <th className="p-3 text-right text-[12px] font-black text-emerald-600 uppercase tracking-tighter">
                    Profit
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <React.Fragment key={order.oid}>
                    {order.items.map((item, index) => (
                      <tr
                        key={item.sku}
                        className="hover:bg-slate-50 transition-colors border-t border-slate-100"
                      >
                        {/* OID - Only shows prominent color on the first item of the order */}
                        <td
                          className={`p-3 text-[13px] font-semibold ${index === 0 ? "text-indigo-600" : "text-slate-400 opacity-50"}`}
                        >
                          {order.oid}
                        </td>

                        <td className="p-3 text-[13px] font-semibold text-slate-600 font-mono uppercase">
                          {item.sku}
                        </td>
                        <td className="p-3 text-[13px] font-semibold text-slate-500">
                          {item.pid}
                        </td>
                        <td className="p-3 text-[13px] font-semibold text-slate-800">
                          {item.pName}
                        </td>
                        <td className="p-3 text-[13px] font-semibold text-slate-500">
                          {order.saleDate}
                        </td>
                        <td className="p-3 text-center text-[13px] font-semibold text-slate-600">
                          ৳{item.webPrice.toLocaleString()}
                        </td>
                        <td className="p-3 text-center text-[13px] font-semibold text-rose-500">
                          ৳{item.discount.toLocaleString()}
                        </td>
                        <td className="p-3 text-center text-[13px] font-semibold text-orange-500">
                          ৳{item.coupon.toLocaleString()}
                        </td>
                        <td className="p-3 text-center text-[13px] font-semibold text-indigo-600 bg-indigo-50/30">
                          ৳{item.sellingPrice.toLocaleString()}
                        </td>
                        <td className="p-3 text-center text-[13px] font-semibold text-slate-600">
                          ৳{item.cost.toLocaleString()}
                        </td>
                        <td className="p-3 text-right">
                          <span
                            className={`px-2 py-0.5 rounded font-black text-[14px] ${item.profit >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}
                          >
                            ৳{item.profit.toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Summary */}
          <div className="p-3 border-t bg-slate-50 flex justify-between items-center px-6">
            <div className="flex gap-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Revenue: ৳35,100
              </span>
              <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">
                Costs: ৳28,000
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">
                Total Net Profit:
              </span>
              <span className="text-sm font-black text-emerald-600">
                ৳7,100
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BalanceItem = ({ label, amount }) => (
  <div className="flex justify-between py-2 border-b last:border-none">
    <span className="text-sm text-slate-600">{label}</span>
    <span className="font-bold text-sm">৳{amount}</span>
  </div>
);

export default AccountsDashboard;
