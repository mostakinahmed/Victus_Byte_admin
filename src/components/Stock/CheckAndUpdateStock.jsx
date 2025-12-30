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
} from "react-icons/fi"; // Feather search icon
import { FaSpinner, FaCheckCircle } from "react-icons/fa";
import axios from "axios";

export default function CheckAndUpdateStock() {
  const { productData, stockData, updateApi } = useContext(DataContext);

  const [searchId, setSearchId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(false);
  const [currentStock, setCurrentStock] = useState(false);
  const [currentSKU, setCurrentSKU] = useState(false);
  const [toggle, setToggle] = useState(true);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    skuID: "",
    comment: "",
  });

  //take all from to one state variable
  const handleFormDataChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value, // update only the changed field
    }));
  };

  //handle Form Data change
  const handleSearch = () => {
    // First, try to find by Product ID
    let foundProduct = productData.find((p) => p.pID === searchId);
    let foundStock = null;

    // If not found by Product ID, try to find by SKU ID
    if (!foundProduct) {
      const foundStockItem = stockData.find((stock) =>
        Object.values(stock.SKU).some((sku) => sku.skuID === searchId)
      );

      if (foundStockItem) {
        foundProduct = productData.find((p) => p.pID === foundStockItem.pID);
        foundStock = foundStockItem.SKU;
      }
    } else {
      // Found by Product ID, get stock
      foundStock = stockData.find(
        (stock) => stock.pID === foundProduct.pID
      ).SKU;
    }

    if (foundProduct && foundStock) {
      setCurrentStock(foundStock);
      setSelectedProduct(foundProduct);

      // Directly find the SKU from the stock we just got
      const selectSKU = Object.values(foundStock).find(
        (s) => s.skuID === searchId
      );
      setCurrentSKU(selectSKU || null);
    } else {
      setCurrentStock(false);
      setSelectedProduct(false);
      setCurrentSKU(false);
    }
  };

  //Show SKU DATA - Search
  const handleSelectSKU = (skuID) => {
    const selectSKU = Object.values(currentStock).find(
      (s) => s.skuID === skuID
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

  //add stock button
  const addStock = async (e) => {
    e.preventDefault();

    try {
      // setSubmitLoader(true);
      setSuccess(true);
      const data = {
        pID: selectedProduct.pID,
        skuID: formData.skuID,
        comment: formData.comment,
      };

      const res = await axios.post(
        "https://fabribuzz.onrender.com/api/stock/add-stock",
        data
      );
      updateApi();
      setFormData({ skuID: "", comment: "" });
      setSuccess(false);
    } catch (error) {
      console.error("Error adding stock:", error);
    } finally {
      setSuccess(false);
    }
  };

  //find total, available, sold
  const totalStock = Object.keys(currentStock).length;
  const availableStock = Object.values(currentStock).filter(
    (item) => item.status === true
  ).length;

  return (
    <div className="md:flex border-t min-h-screen mt-3">
      {/* Left Panel: Professional Inventory Lookup */}
      <div className="border-r border-slate-200 md:w-1/2 bg-white overflow-hidden shadow-sm flex flex-col">
        {/* Header Section */}
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Inventory Lookup
            </h2>
          </div>
        </div>

        <div className="p-5">
          {/* Search Interaction Group */}
          <div className="flex items-end gap-3 mb-6">
            <div className="flex-1 space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Catalog Search
              </label>
              <div className="relative group">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Enter Product-ID or SKU-ID..."
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
            <button
              onClick={handleSearch}
              className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-slate-200 flex items-center gap-2"
            >
              <FiZap size={14} /> Search
            </button>
          </div>

          {selectedProduct ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Product Details Header & Action */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest border-l-4 border-indigo-500 pl-3">
                  Product Profile
                </h3>
                <button
                  onClick={() => setToggle(false)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-indigo-600 font-black text-[10px] uppercase tracking-widest bg-indigo-50 hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100"
                >
                  <FiEdit3 /> Add Stock
                </button>
              </div>

              {/* Info Container */}
              <div className="space-y-6">
                <div className="flex gap-6 items-start">
                  {/* High-End Image Frame */}
                  <div className="relative shrink-0">
                    <img
                      src={selectedProduct.images[0]}
                      alt={selectedProduct.name}
                      className="w-36 h-36 object-contain rounded-2xl border-2 border-slate-50 bg-white shadow-sm p-2"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white text-[9px] font-black px-2 py-1 rounded shadow-lg border-2 border-white uppercase">
                      Original
                    </div>
                  </div>

                  {/* Core Specs */}
                  <div className="flex-1 space-y-3 pt-1">
                    <h2 className="text-xl font-black text-slate-900 leading-tight">
                      {selectedProduct.name}
                    </h2>

                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <FiHash className="text-slate-300" />
                        <span className="text-slate-400 font-medium">UID:</span>
                        <span className="font-mono text-slate-800">
                          {selectedProduct.pID}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <FiPackage className="text-slate-300" />
                        <span className="text-slate-400 font-medium">
                          Category:
                        </span>
                        <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                          {selectedProduct.category}
                        </span>
                      </div>
                    </div>

                    {/* Financial Metrics Cards */}
                    <div className="flex gap-3 pt-3">
                      <div className="flex-1 p-3 bg-slate-900 rounded-2xl shadow-md">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">
                          Selling Price
                        </p>
                        <p className="text-lg font-black text-white">
                          ৳{selectedProduct.price.selling}
                        </p>
                      </div>
                      <div className="flex-1 p-3 bg-indigo-50 rounded-2xl border border-indigo-100">
                        <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">
                          Live Stock
                        </p>
                        <p className="text-lg font-black text-indigo-700">
                          50{" "}
                          <span className="text-[10px] font-medium opacity-60">
                            Units
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technical Specifications Section */}
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-3">
                    <FiActivity className="text-slate-400" />
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Hardware Configuration
                    </p>
                  </div>
                  <ul className="grid grid-cols-2 gap-3">
                    {["8GB RAM", "128GB Storage", "5000mAh Battery"].map(
                      (spec, i) => (
                        <li
                          key={i}
                          className="text-xs font-bold text-slate-700 flex items-center gap-2"
                        >
                          <div className="w-1 h-1 bg-indigo-400 rounded-full" />{" "}
                          {spec}
                        </li>
                      )
                    )}
                  </ul>
                </div>

                {/* System Metadata */}
                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <div className="flex gap-4">
                    <div className="text-[9px] font-bold text-slate-400 uppercase">
                      Created{" "}
                      <span className="text-slate-600 ml-1">2025-10-05</span>
                    </div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase">
                      Last Update{" "}
                      <span className="text-slate-600 ml-1">2025-10-07</span>
                    </div>
                  </div>
                  <div className="text-[9px] font-black text-emerald-500 uppercase flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />{" "}
                    Data Sync Active
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Empty Selection State */
            <div className="mt-4 p-12 flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-2xl border-dashed">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-200 shadow-sm mb-4">
                <FiPackage size={32} />
              </div>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
                Product Info Required
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                Search via Product ID to populate details
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Middle Panel */}
      {/* 📊 Middle Panel: Professional SKU Ledger */}
      <div className="md:w-1/2 mt-2 md:mt-0 border-r border-slate-200 bg-white  overflow-hidden shadow-sm flex flex-col h-full">
        {/* Section Header */}
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Inventory Assets (SKUs)
            </h2>
          </div>
        </div>

        {/* 📈 Stat Bar: Modern Flat Look */}
        {currentStock && (
          <div className="px-5 pt-5 pb-2">
            <div className="grid grid-cols-3 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 text-center border-r border-slate-100">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Total
                </h4>
                <p className="text-xl font-black text-slate-900">
                  {totalStock}
                </p>
              </div>
              <div className="p-4 text-center border-r border-slate-100 bg-emerald-50/30">
                <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">
                  Available
                </h4>
                <p className="text-xl font-black text-emerald-600">
                  {availableStock}
                </p>
              </div>
              <div className="p-4 text-center bg-rose-50/30">
                <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">
                  Out
                </h4>
                <p className="text-xl font-black text-rose-500">
                  {totalStock - availableStock}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 📋 SKU List Table */}
        <div className="flex-1 p-5">
          {!currentStock ? (
            <div className="h-40 flex flex-col items-center justify-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-slate-400">
              <FiActivity className="mb-2 opacity-50" size={24} />
              <p className="text-[10px] font-black uppercase tracking-widest">
                Awaiting Catalog Selection
              </p>
            </div>
          ) : (
            <div className="h-[600px] overflow-y-auto rounded-xl border border-slate-100 custom-scrollbar">
              <table className="w-full border-collapse">
                <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      SKU Reference
                    </th>
                    <th className="py-3 px-4 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Availability
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {Object.values(currentStock)
                    .reverse()
                    .map((sku) => {
                      const isSelected = currentSKU?.skuID === sku.skuID;
                      return (
                        <tr
                          key={sku.skuID}
                          className={`group cursor-pointer transition-all duration-200 ${
                            isSelected ? "bg-indigo-50" : "hover:bg-slate-50"
                          }`}
                          onClick={() => {
                            handleSelectSKU(sku.skuID);
                            setToggle(true);
                          }}
                        >
                          <td className="py-3 px-4 flex items-center gap-3">
                            {isSelected && (
                              <div className="w-1 h-4 bg-indigo-600 rounded-full" />
                            )}
                            <span
                              className={`text-sm font-mono font-bold tracking-tighter ${
                                isSelected
                                  ? "text-indigo-600"
                                  : "text-slate-600"
                              }`}
                            >
                              {sku.skuID}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border shadow-sm ${
                                sku.status
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                  : "bg-rose-50 text-rose-700 border-rose-100"
                              }`}
                            >
                              {sku.status ? (
                                <FiCheckCircle />
                              ) : (
                                <FiMinusCircle />
                              )}
                              {sku.status ? "In Stock" : "Sold Out"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel */}

      {/* 🛠️ Right Panel: Stock Overview & Control */}
      <div className="md:w-1/2 bg-white overflow-hidden shadow-sm border border-slate-200 flex flex-col h-full">
        {/* Dynamic Section Header */}
        <div
          className={`px-5 py-4 border-b ${
            toggle
              ? "bg-slate-50/50 border-slate-100"
              : "bg-indigo-50/30 border-indigo-100"
          }`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`w-1.5 h-6 rounded-full ${
                toggle ? "bg-slate-400" : "bg-indigo-600"
              }`}
            ></div>
            <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">
              {toggle ? "Inventory Profile" : "Asset Intake"}
            </h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {toggle ? (
            <div className="">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <FiFileText className="text-slate-400" />
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                    SKU Ledger Details
                  </h3>
                </div>

                {currentSKU ? (
                  <div className="space-y-6">
                    {/* Detailed Data Rows */}
                    <div className="space-y-4">
                      {[
                        {
                          label: "Asset ID",
                          value: currentSKU.skuID,
                          mono: true,
                        },
                        {
                          label: "Current Status",
                          value: currentSKU.status
                            ? "In Stock / Active"
                            : "Sold / Inactive",
                          status: currentSKU.status,
                        },
                        {
                          label: "Linked Order (OID)",
                          value: currentSKU.OID || "Unlinked / NULL",
                          highlight: !!currentSKU.OID,
                        },
                      ].map((row, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-baseline group"
                        >
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                            {row.label}
                          </span>
                          <div className="flex-1 border-b border-dotted border-slate-200 mx-2 h-1 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                          <span
                            className={`text-sm font-bold ${
                              row.mono
                                ? "font-mono text-indigo-600"
                                : row.status === true
                                ? "text-emerald-600"
                                : row.status === false
                                ? "text-rose-500"
                                : row.highlight
                                ? "text-indigo-600"
                                : "text-slate-400"
                            }`}
                          >
                            {row.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Enhanced Comment Box */}
                    <div className="mt-8">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                        Administrative Notes
                      </p>
                      <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                        <p className="text-xs font-medium text-slate-600 leading-relaxed italic">
                          "
                          {currentSKU.comment ||
                            "No historical comments recorded for this asset."}
                          "
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-10 flex flex-col items-center justify-center p-12 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                    <FiActivity size={32} className="text-slate-300 mb-2" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                      Select an SKU to view profile
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ➕ Add Stock Form */
            <div className="relative p-6 animate-in fade-in slide-in-from-right-4 duration-300">
              {/* Modern Loader Overlay */}
              {success && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-md z-30 transition-all duration-500">
                  <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-indigo-200 border border-slate-100 flex flex-col items-center">
                    <div className="relative">
                      <FaSpinner className="text-indigo-600 text-5xl animate-spin mb-4" />
                      <FiPlusCircle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-400 text-xl" />
                    </div>
                    <p className="text-slate-800 font-black text-sm uppercase tracking-widest">
                      Processing...
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">
                      Updating Master Catalog
                    </p>
                  </div>
                </div>
              )}

              <div
                className={`space-y-6 ${
                  success ? "blur-sm opacity-50 pointer-events-none" : ""
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <FiPlusCircle className="text-indigo-500" />
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                    Intake New Asset
                  </h3>
                </div>

                <form onSubmit={addStock} className="space-y-5">
                  <div className="space-y-4">
                    {/* SKU Input */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        Asset Reference (SKU-ID)
                      </label>
                      <input
                        type="text"
                        name="skuID"
                        value={formData.skuID}
                        onChange={handleFormDataChange}
                        placeholder="e.g. SN-90231-X"
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-mono"
                      />
                    </div>

                    {/* Comment Input */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        Technical Specifications / Notes
                      </label>
                      <textarea
                        placeholder="Describe variant, condition, or source..."
                        rows={6}
                        name="comment"
                        value={formData.comment}
                        onChange={handleFormDataChange}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all leading-relaxed"
                      ></textarea>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setToggle(true)}
                      className="flex-1 flex items-center justify-center gap-2 bg-white text-rose-500 border border-rose-100 px-5 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-rose-50 transition-all active:scale-95"
                    >
                      <FiXCircle size={14} /> Discard
                    </button>
                    <button
                      type="submit"
                      className="flex-[2] flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
                    >
                      <FiCheckCircle size={14} /> Commit to Stock
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
