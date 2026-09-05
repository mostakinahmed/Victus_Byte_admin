import { DataContext } from "@/Context Api/ApiContext";
import React, { useContext, useEffect, useState } from "react";
import {
  FiSearch,
  FiList,
  FiBox,
  FiPackage,
  FiZap,
  FiEdit3,
  FiHash,
  FiCheckCircle,
  FiMinusCircle,
  FiActivity,
  FiPlusCircle,
  FiFileText,
  FiXCircle,
  FiDollarSign,
  FiTag,
} from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";
import api from "@/Context Api/api";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Navbar from "@/components/Navbar";

const MySwal = withReactContent(Swal);

export default function CheckAndUpdateStock() {
  const { productData, stockData, updateApi } = useContext(DataContext);

  const [searchId, setSearchId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(false);
  const [currentStock, setCurrentStock] = useState(false);
  const [currentSKU, setCurrentSKU] = useState(false);
  const [toggle, setToggle] = useState(true);
  const [success, setSuccess] = useState(false);

  // ✅ Removed selling_price from formData
  const [formData, setFormData] = useState({
    skuID: "",
    comment: "",
    cost: "",
  });

  const handleFormDataChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    let foundProduct = productData.find((p) => p.pID === searchId);
    let foundStock = null;

    if (!foundProduct) {
      const foundStockItem = stockData.find((stock) =>
        Object.values(stock.SKU).some((sku) => sku.skuID === searchId),
      );

      if (foundStockItem) {
        foundProduct = productData.find((p) => p.pID === foundStockItem.pID);
        foundStock = foundStockItem.SKU;
      }
    } else {
      foundStock = stockData.find(
        (stock) => stock.pID === foundProduct.pID,
      ).SKU;
    }

    if (foundProduct && foundStock) {
      setCurrentStock(foundStock);
      setSelectedProduct(foundProduct);
      const selectSKU = Object.values(foundStock).find(
        (s) => s.skuID === searchId,
      );
      setCurrentSKU(selectSKU || null);
    } else {
      setCurrentStock(false);
      setSelectedProduct(false);
      setCurrentSKU(false);
    }
  };

  const handleSelectSKU = (skuID) => {
    const selectSKU = Object.values(currentStock).find(
      (s) => s.skuID === skuID,
    );
    setCurrentSKU(selectSKU);
  };

  useEffect(() => {
    if (selectedProduct && stockData) {
      const updatedStock =
        stockData.find((stock) => stock.pID === selectedProduct.pID)?.SKU ||
        false;
      setCurrentStock(updatedStock);
    }
  }, [stockData, selectedProduct]);

  // ✅ Updated addStock: Only sends pID, skuID, cost, and comment
  const addStock = async (e) => {
    if (e) e.preventDefault();

    if (!selectedProduct?.pID || !formData.skuID || !formData.cost) {
      return Swal.fire({
        icon: "warning",
        title: "Incomplete Data",
        text: "SKU ID and Buying Cost are required for asset intake.",
      });
    }

    try {
      setSuccess(true);
      const data = {
        pID: selectedProduct.pID,
        skuID: formData.skuID,
        cost: Number(formData.cost),
        comment: formData.comment || "Manual Intake",
      };

      await api.post("/stock/add-stock", data);
      await updateApi();
      setFormData({ skuID: "", comment: "", cost: "" });
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Check your internet connection.";
      Swal.fire({ icon: "error", title: "Intake Failed", text: errorMsg });
    } finally {
      setSuccess(false);
    }
  };

  const totalStock = Object.keys(currentStock).length;
  const availableStock = Object.values(currentStock).filter(
    (item) => item.status === true,
  ).length;

  return (
    <>
      <Navbar pageTitle="Stock Management" />
      <div className="md:flex border-t  md:mt-3 font-sans">
        {/* LEFT PANEL */}
        <div className="border-r border-slate-200 md:w-1/2 bg-white overflow-hidden shadow-sm flex flex-col">
          <div className="md:px-5 px-2 py-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-6 bg-brand rounded-full"></div>
              <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">
                Inventory Lookup
              </h2>
            </div>
          </div>

          <div className="md:p-5 p-2">
            <div className="md:flex items-end gap-3 mb-6">
              <div className="flex-1 space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  Catalog Search
                </label>
                <div className="relative group">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input
                    type="text"
                    placeholder="PID or SKU..."
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 placeholder:font-medium bg-slate-50 border uppercase border-slate-300 rounded text-md font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  />
                </div>
              </div>
              <button
                onClick={handleSearch}
                className="bg-black mt-2 md:mt-0 text-white px-6 py-2.5 rounded font-bold text-sm hover:bg-brand transition-all shadow-lg flex items-center gap-2"
              >
                <FiZap /> Search
              </button>
            </div>

            {selectedProduct ? (
              <div className="animate-in fade-in duration-300 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest border-l-4 border-indigo-500 pl-3">
                    Product Profile
                  </h3>
                  <button
                    onClick={() => setToggle(false)}
                    className="px-4 py-2 rounded text-white font-black text-[10px] uppercase bg-black border border-indigo-100 hover:bg-brand  transition-all"
                  >
                    Add Stock
                  </button>
                </div>
                <div className="flex gap-6 items-start">
                  <img
                    src={selectedProduct.images[0]}
                    alt=""
                    className="w-28 h-28 object-contain rounded border-2 border-slate-50 bg-white  p-2"
                  />
                  <div className="flex-1 space-y-3 pt-1">
                    <h2 className="text-lg font-medium text-slate-900 leading-tight">
                      {selectedProduct.name}
                    </h2>
                    <div className="bg-slate-900 rounded-2xl p-3 shadow-md">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        MSRP / Default Price
                      </p>
                      <p className="text-lg font-black text-white">
                        ৳ {selectedProduct.price.selling}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-10 p-12 text-center border-2 border-dashed rounded-2xl text-slate-300 uppercase font-black text-[10px] tracking-widest">
                Select Product to Begin
              </div>
            )}
          </div>
        </div>

        {/* MIDDLE PANEL */}
        <div className="md:w-1/2 border-r border-slate-200 bg-white flex flex-col h-full overflow-hidden shadow-sm">
          <div className="md:px-5 px-2 py-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-6 bg-brand rounded-full"></div>
              <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">
                Inventory Assets
              </h2>
            </div>
          </div>

          {currentStock && (
            <div className="p-4 grid grid-cols-3 gap-2 border-b">
              <div className="bg-slate-100 p-3 rounded-xl text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase">
                  Total
                </p>
                <p className="text-lg font-black">{totalStock}</p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-xl text-center">
                <p className="text-[9px] font-black text-emerald-600 uppercase">
                  Available
                </p>
                <p className="text-lg font-black text-emerald-600">
                  {availableStock}
                </p>
              </div>
              <div className="bg-rose-100 p-3 rounded-xl text-center">
                <p className="text-[9px] font-black text-rose-500 uppercase">
                  Out
                </p>
                <p className="text-lg font-black text-rose-500">
                  {totalStock - availableStock}
                </p>
              </div>
            </div>
          )}

          <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
            {currentStock ? (
              <table className="w-full">
                <thead className="sticky top-0 bg-white border-b">
                  <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="py-3 text-left">SKU ID</th>
                    <th className="py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.values(currentStock)
                    .reverse()
                    .map((sku) => (
                      <tr
                        key={sku.skuID}
                        onClick={() => {
                          handleSelectSKU(sku.skuID);
                          setToggle(true);
                        }}
                        className={`cursor-pointer hover:bg-slate-50 ${currentSKU?.skuID === sku.skuID ? "bg-indigo-50" : ""}`}
                      >
                        <td className="py-3 text-sm font-bold text-slate-700 uppercase font-mono">
                          {sku.skuID}
                        </td>
                        <td className="py-3 text-right">
                          <span
                            className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${sku.status ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}
                          >
                            {sku.status ? "Active" : "Sold"}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-20 opacity-10">
                <FiActivity size={40} className="mx-auto" />
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="md:w-1/2 bg-white flex flex-col border-slate-200 shadow-sm border overflow-hidden">
          <div
            className={`md:px-5 px-2 py-4 border-b ${toggle ? "bg-slate-50" : "bg-indigo-50/30 border-indigo-200"}`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-1.5 h-6 rounded-full ${toggle ? "bg-slate-400" : "bg-brand"}`}
              ></div>
              <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">
                {toggle ? "Asset Profile" : "Stock Intake"}
              </h2>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {toggle ? (
              currentSKU ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FiFileText className="text-indigo-600" />
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                      Financial & ID Ledger
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <DetailRow label="Asset ID" value={currentSKU.skuID} mono />
                    <DetailRow
                      label="Order ID (OID)"
                      value={currentSKU.OID || "N/A"}
                      highlight={!!currentSKU.OID}
                    />
                    <div className="border-t pt-3 mt-3 grid grid-cols-2 gap-4">
                      <FinancialBox
                        label="Buying Cost"
                        value={currentSKU.cost}
                        icon={<FiDollarSign />}
                        color="text-rose-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mt-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Internal Remarks
                    </p>
                    <div className="bg-slate-50 border p-4 rounded-xl italic text-xs text-slate-600 leading-relaxed">
                      "
                      {currentSKU.comment ||
                        "No historical logs for this asset."}
                      "
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 text-[10px] font-black uppercase text-slate-300 tracking-widest">
                  Select SKU to View Financials
                </div>
              )
            ) : (
              <div className="relative animate-in fade-in slide-in-from-right-4">
                {success && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-30">
                    <FaSpinner className="text-indigo-600 text-4xl animate-spin mb-2" />
                    <p className="text-[10px] font-black uppercase tracking-widest">
                      Recording...
                    </p>
                  </div>
                )}

                <form onSubmit={addStock} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Asset Reference (SKU-ID)
                    </label>
                    <input
                      type="text"
                      name="skuID"
                      value={formData.skuID.toUpperCase()}
                      onChange={handleFormDataChange}
                      placeholder="SN-XXXX"
                      required
                      maxLength={14}
                      className="w-full bg-slate-50 uppercase border rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Acquisition Cost (Buying ৳)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                        ৳
                      </span>
                      <input
                        type="number"
                        name="cost"
                        value={formData.cost}
                        onChange={handleFormDataChange}
                        placeholder="0"
                        required
                        className="w-full bg-slate-50 pl-8 pr-4 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-400 transition-all"
                      />
                    </div>
                    <p className="text-[9px] text-slate-400 mt-1 font-medium italic">
                      * Selling price & profit will be updated automatically
                      during the checkout phase.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Intake Note
                    </label>
                    <textarea
                      placeholder="Vendor details, condition..."
                      rows={4}
                      name="comment"
                      value={formData.comment}
                      onChange={handleFormDataChange}
                      className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    ></textarea>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setToggle(true)}
                      className="flex-1 bg-white text-rose-500 border border-rose-200 py-3 rounded font-black text-[12px] uppercase tracking-widest hover:bg-rose-50 transition-all"
                    >
                      Discard
                    </button>
                    <button
                      type="submit"
                      className="flex-[2] bg-black text-white/90 py-3 rounded font-black text-[12px] uppercase tracking-widest hover:bg-brand shadow-lg shadow-indigo-100 transition-all"
                    >
                      Confirm Intake
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ✅ CLEANER UI COMPONENTS
const DetailRow = ({ label, value, mono, highlight }) => (
  <div className="flex justify-between items-baseline group">
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">
      {label}
    </span>
    <div className="flex-1 border-b border-dotted border-slate-200 mx-2 h-1 opacity-50"></div>
    <span
      className={`text-sm font-bold ${mono ? "font-mono text-indigo-600" : highlight ? "text-indigo-600" : "text-slate-800"}`}
    >
      {value}
    </span>
  </div>
);

const FinancialBox = ({ label, value, icon, color }) => (
  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
    <div className="flex items-center gap-1.5 mb-1 opacity-60">
      {icon}
      <span className="text-[9px] font-black text-slate-500 uppercase">
        {label}
      </span>
    </div>
    <p className={`text-sm font-black ${color}`}>
      ৳ {value?.toLocaleString() || 0}
    </p>
  </div>
);
