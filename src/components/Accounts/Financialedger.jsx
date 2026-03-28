import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  PlusCircle,
  ShoppingCart,
  TrendingDown,
  ClipboardList,
  X,
  XCircle,
  Search,
} from "lucide-react";

const FinancialLedger = ({ onRefresh }) => {
  // Modal States
  const [isInvestmentModalOpen, setIsInvestmentModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Form Data & Helper States (Same as previous)
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    reference: "",
  });
  const [purchaseCalc, setPurchaseCalc] = useState({ unit: "", qty: 1 });
  const [expenseCats, setExpenseCats] = useState({
    main: "",
    sub: "",
    method: "Cash",
  });

  const expenseCategories = {
    Operating: ["Rent", "Electricity", "Internet", "Salary"],
    Marketing: ["Facebook Ads", "Printing", "Giveaway"],
    Logistics: ["Packaging", "Delivery Return Fee", "Conveyance"],
    Miscellaneous: ["Tea/Snacks", "Others"],
  };

  // --- FETCH SUMMARY DATA ---
  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://api.victusbyte.com/api/transaction",
      );
      if (res.data.success) {
        setTransactions(res.data.data);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch when Summary Modal opens
  useEffect(() => {
    if (isSummaryModalOpen) fetchSummary();
  }, [isSummaryModalOpen]);

  // --- UNIFIED SUBMIT ---
  const handleSubmit = async (targetType) => {
    if (loading) return;
    setLoading(true);
    try {
      let finalPayload = {
        type: targetType,
        title: formData.title,
        amount: Number(formData.amount),
        reference: formData.reference || "N/A",
      };

      if (targetType === "purchase") {
        finalPayload.amount =
          Number(purchaseCalc.unit) * Number(purchaseCalc.qty);
        finalPayload.reference = `Qty: ${purchaseCalc.qty} @ ৳${purchaseCalc.unit}`;
      } else if (targetType === "expense") {
        finalPayload.title = `${expenseCats.main}: ${expenseCats.sub}`;
        finalPayload.reference = `Paid via ${expenseCats.method}`;
      }

      const res = await axios.post(
        "https://api.victusbyte.com/api/transaction/add",
        finalPayload,
      );
      if (res.data.success) {
        setIsInvestmentModalOpen(false);
        setIsPurchaseModalOpen(false);
        setIsExpenseModalOpen(false);
        setFormData({ title: "", amount: "", reference: "" });
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter Logic for Summary
  const filteredList = transactions.filter(
    (t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.type.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-4 mt-4">
      {/* HEADER ACTION BAR */}
      <div className="flex flex-col xl:flex-row gap-4 justify-between items-center bg-white p-4 rounded border border-slate-300 shadow-xs">
        <h2 className="text-lg font-bold text-slate-800 tracking-tight">
          Financial Ledger
        </h2>
        <div className="grid grid-cols-2 sm:flex gap-4 w-full md:w-auto">
          <button
            onClick={() => setIsInvestmentModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-2 rounded font-bold text-sm shadow-sm active:scale-95 transition-all"
          >
            <PlusCircle size={14} /> Investment
          </button>
          <button
            onClick={() => setIsPurchaseModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-[#1976d2] text-white px-6 py-2 rounded font-bold text-sm shadow-sm active:scale-95 transition-all"
          >
            <ShoppingCart size={14} /> Purchase
          </button>
          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-rose-600 text-white px-6 py-2 rounded font-bold text-sm shadow-sm active:scale-95 transition-all"
          >
            <TrendingDown size={14} /> Expense
          </button>
          <button
            onClick={() => setIsSummaryModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-slate-800 text-white px-6 py-2 rounded font-bold text-sm shadow-sm active:scale-95 transition-all"
          >
            <ClipboardList size={14} /> Summary
          </button>
        </div>
      </div>

      {/* --- ALL INPUT MODALS (REMAIN THE SAME AS PREVIOUS CODE) --- */}

      {isInvestmentModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-emerald-600 p-4 flex justify-between text-white font-bold uppercase text-[10px] tracking-widest">
              <span className="flex items-center gap-2">
                <PlusCircle size={16} /> Add Capital Investment
              </span>
              <X
                className="cursor-pointer hover:rotate-90 transition-transform"
                onClick={() => setIsInvestmentModalOpen(false)}
              />
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase">
                  Investor Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Owner Capital"
                  className="w-full p-2.5 border rounded-lg mt-1 outline-none focus:ring-2 focus:ring-emerald-500"
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase">
                  Amount (৳)
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full p-2.5 border rounded-lg mt-1 font-bold text-lg"
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                />
              </div>
              <button
                disabled={loading}
                onClick={() => handleSubmit("investment")}
                className={`w-full bg-emerald-600 text-white py-3.5 rounded-xl font-bold uppercase text-xs tracking-widest transition-all ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-emerald-700 active:scale-95"}`}
              >
                {loading ? "Processing..." : "Confirm Investment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- PURCHASE MODAL --- */}
      {isPurchaseModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-[#1976d2] p-4 flex justify-between text-white font-bold uppercase text-[10px] tracking-widest">
              <span className="flex items-center gap-2">
                <ShoppingCart size={16} /> Inventory Sourcing
              </span>
              <X
                className="cursor-pointer hover:rotate-90 transition-transform"
                onClick={() => setIsPurchaseModalOpen(false)}
              />
            </div>
            <div className="p-6 space-y-4">
              <input
                type="text"
                placeholder="Supplier / Batch Name"
                className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Unit Cost"
                  className="p-2.5 border rounded-lg outline-none"
                  onChange={(e) =>
                    setPurchaseCalc({ ...purchaseCalc, unit: e.target.value })
                  }
                />
                <input
                  type="number"
                  placeholder="Qty"
                  className="p-2.5 border rounded-lg outline-none"
                  value={purchaseCalc.qty}
                  onChange={(e) =>
                    setPurchaseCalc({ ...purchaseCalc, qty: e.target.value })
                  }
                />
              </div>
              <div className="p-4 bg-blue-50 text-blue-700 font-black flex justify-between rounded-xl border border-blue-100">
                <span className="text-[10px] uppercase">Total Bill:</span>
                <span className="text-lg">
                  ৳
                  {(
                    Number(purchaseCalc.unit) * purchaseCalc.qty
                  ).toLocaleString()}
                </span>
              </div>
              <button
                disabled={loading}
                onClick={() => handleSubmit("purchase")}
                className={`w-full bg-[#1976d2] text-white py-3.5 rounded-xl font-bold uppercase text-xs tracking-widest transition-all ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700 active:scale-95"}`}
              >
                {loading ? "Processing..." : "Log Purchase Cost"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- EXPENSE MODAL --- */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-4 border-b bg-slate-50 flex justify-between items-center text-rose-600 font-bold uppercase text-[10px] tracking-widest">
              <span className="flex items-center gap-2">
                <TrendingDown size={16} /> Record Operational Expense
              </span>
              <XCircle
                className="cursor-pointer text-slate-300 hover:text-rose-500"
                onClick={() => setIsExpenseModalOpen(false)}
              />
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <select
                  className="p-2.5 border rounded-lg text-sm bg-white"
                  onChange={(e) =>
                    setExpenseCats({
                      ...expenseCats,
                      main: e.target.value,
                      sub: "",
                    })
                  }
                >
                  <option value="">Category</option>
                  {Object.keys(expenseCategories).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <select
                  className="p-2.5 border rounded-lg text-sm bg-white"
                  disabled={!expenseCats.main}
                  onChange={(e) =>
                    setExpenseCats({ ...expenseCats, sub: e.target.value })
                  }
                >
                  <option value="">Sub-Category</option>
                  {expenseCats.main &&
                    expenseCategories[expenseCats.main].map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Amount (৳)"
                  className="p-2.5 border rounded-lg text-sm font-bold"
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                />
                <select
                  className="p-2.5 border rounded-lg text-sm bg-white"
                  onChange={(e) =>
                    setExpenseCats({ ...expenseCats, method: e.target.value })
                  }
                >
                  <option>Cash</option>
                  <option>City Bank</option>
                </select>
              </div>
              <button
                disabled={loading}
                onClick={() => handleSubmit("expense")}
                className={`w-full bg-rose-600 text-white py-3.5 rounded-xl font-bold uppercase text-xs tracking-widest transition-all ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-rose-700 active:scale-95"}`}
              >
                {loading ? "Processing..." : "Confirm Expense"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- SUMMARY MODAL --- */}
      {isSummaryModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-5xl h-[70vh] overflow-hidden shadow-2xl flex flex-col border border-slate-200">
            {/* Header */}
            <div className="p-4 bg-slate-800 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <ClipboardList size={20} className="text-indigo-400" />
                <h3 className="font-bold text-sm uppercase tracking-widest">
                  Transaction Summary
                </h3>
              </div>
              <button
                onClick={() => setIsSummaryModalOpen(false)}
                className="hover:bg-slate-700 p-1 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Sub-Header / Search */}
            <div className="p-4 border-b bg-slate-50 flex flex-col sm:flex-row justify-between gap-4">
              <div className="relative w-full sm:w-64">
                <Search
                  className="absolute left-3 top-2.5 text-slate-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className="w-full pl-10 pr-4 py-2 bg-white border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Records Found:
                </span>
                <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-black">
                  {filteredList.length}
                </span>
              </div>
            </div>

            {/* Table Area */}
            <div className="flex-1 overflow-auto custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead className="sticky top-0 bg-slate-100 z-10 shadow-sm">
                  <tr>
                    <th className="p-4 text-[11px] font-black text-slate-500 uppercase">
                      Date
                    </th>
                    <th className="p-4 text-[11px] font-black text-slate-500 uppercase">
                      Type
                    </th>
                    <th className="p-4 text-[11px] font-black text-slate-500 uppercase">
                      Title / Name
                    </th>
                    <th className="p-4 text-[11px] font-black text-slate-500 uppercase">
                      Reference
                    </th>
                    <th className="p-4 text-right text-[11px] font-black text-slate-500 uppercase">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="p-20 text-center text-slate-400 font-bold animate-pulse"
                      >
                        Loading Ledger...
                      </td>
                    </tr>
                  ) : filteredList.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="p-20 text-center text-slate-400 font-bold"
                      >
                        No transactions found
                      </td>
                    </tr>
                  ) : (
                    filteredList.map((t) => (
                      <tr
                        key={t._id}
                        className="hover:bg-slate-100 transition-colors"
                      >
                        <td className="px-4 text-xs text-slate-600 font-medium">
                          {new Date(t.date || t.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4">
                          <span
                            className={`px-2 py-1 rounded text-[11px] font-black uppercase tracking-tighter ${
                              t.type === "investment"
                                ? "bg-emerald-100 text-emerald-600"
                                : t.type === "purchase"
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-rose-100 text-rose-600"
                            }`}
                          >
                            {t.type}
                          </span>
                        </td>
                        <td className="px-4 text-sm font-semibold text-slate-700">
                          {t.title}
                        </td>
                        <td className="px-4 text-[12px] font-semibold text-slate-600 italic">
                          {t.reference}
                        </td>
                        <td
                          className={`px-4 py-2 text-right font-black text-sm ${
                            t.type === "investment"
                              ? "text-emerald-600"
                              : "text-slate-800"
                          }`}
                        >
                          {t.type === "investment" ? "+" : "-"} ৳
                          {t.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer Summary */}
            <div className="p-4 bg-slate-50 border-t flex justify-end gap-6">
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase">
                  Net Flow
                </p>
                <p className="text-lg font-black text-slate-800">
                  ৳
                  {transactions
                    .reduce(
                      (acc, curr) =>
                        curr.type === "investment"
                          ? acc + curr.amount
                          : acc - curr.amount,
                      0,
                    )
                    .toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialLedger;
