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
} from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";
import api from "@/Context Api/api";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function CheckAndUpdateStock() {
  const { productData, stockData, updateApi } = useContext(DataContext);

  const [searchId, setSearchId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(false);
  const [currentStock, setCurrentStock] = useState(false);
  const [currentSKU, setCurrentSKU] = useState(false);
  const [toggle, setToggle] = useState(true);
  const [success, setSuccess] = useState(false);

  // ✅ Updated FormData to include cost and selling_price
  const [formData, setFormData] = useState({
    skuID: "",
    comment: "",
    cost: "",
    selling_price: "",
  });

  // Automatically update selling_price when a product is selected
  useEffect(() => {
    if (selectedProduct) {
      setFormData((prev) => ({
        ...prev,
        selling_price: selectedProduct.price.selling,
      }));
    }
  }, [selectedProduct]);

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

  // ✅ Modified Add Stock Logic
  const addStock = async (e) => {
    if (e) e.preventDefault();

    if (!selectedProduct?.pID || !formData.skuID || !formData.cost) {
      return Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "SKU ID and Buying Cost are required for asset intake.",
      });
    }

    try {
      setSuccess(true);

      const data = {
        pID: selectedProduct.pID,
        skuID: formData.skuID,
        cost: Number(formData.cost),
        selling_price: Number(formData.selling_price),
        comment: formData.comment || "Standard Intake",
      };

      const res = await api.post("/stock/add-stock", data);

      await updateApi();
      // Reset form but keep the selling price of the current product for the next intake
      setFormData({
        skuID: "",
        comment: "",
        cost: "",
        selling_price: selectedProduct.price.selling,
      });
    } catch (error) {
      console.error("Error adding stock:", error);
      const status = error.response?.status;
      const errorMsg =
        error.response?.data?.message || "Check your connection.";

      Swal.fire({
        icon: "error",
        title: status === 403 ? "Access Denied" : "Update Failed",
        text: errorMsg,
      });
    } finally {
      setSuccess(false);
    }
  };

  const totalStock = Object.keys(currentStock).length;
  const availableStock = Object.values(currentStock).filter(
    (item) => item.status === true,
  ).length;

  const calculatedProfit = (formData.selling_price || 0) - (formData.cost || 0);

  return (
    <div className="md:flex border-t min-h-screen md:mt-3 font-sans">
      {/* Left Panel */}
      <div className="border-r border-slate-200 md:w-1/2 bg-white overflow-hidden shadow-sm flex flex-col">
        <div className="md:px-5 px-2 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
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
                  placeholder="Product-ID or SKU-ID..."
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border uppercase border-slate-300 rounded-xl text-md font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
            <button
              onClick={handleSearch}
              className="bg-slate-900 mt-2 md:mt-0 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-600 transition-all active:scale-95 flex items-center gap-2"
            >
              <FiZap size={14} /> Search
            </button>
          </div>

          {selectedProduct ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest border-l-4 border-indigo-500 pl-3">
                  Product Profile
                </h3>
                <button
                  onClick={() => setToggle(false)}
                  className="flex items-center gap-2 md:px-4 px-2 py-2 rounded-lg text-indigo-600 font-black text-[10px] uppercase tracking-widest bg-indigo-100 hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100"
                >
                  <FiEdit3 /> Add Stock
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex gap-6 items-start">
                  <div className="relative shrink-0">
                    <img
                      src={selectedProduct.images[0]}
                      alt={selectedProduct.name}
                      className="w-30 h-30 object-contain rounded-2xl border-2 border-slate-50 bg-white shadow-sm p-2"
                    />
                  </div>

                  <div className="flex-1 space-y-3 pt-1">
                    <h2 className="md:text-lg font-medium text-slate-900 leading-tight">
                      {selectedProduct.name}
                    </h2>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <FiHash className="text-slate-300" />
                        <span className="font-mono text-slate-800">
                          {selectedProduct.pID}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <FiPackage className="text-slate-300" />
                        <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                          {selectedProduct.category}
                        </span>
                      </div>
                    </div>
                    <div className="bg-slate-900 rounded-2xl p-3 shadow-md">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        Selling Price
                      </p>
                      <p className="text-lg font-black text-white">
                        ৳ {selectedProduct.price.selling}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 p-12 flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-2xl border-dashed text-slate-400">
              <FiPackage size={32} className="mb-4 opacity-20" />
              <p className="text-[10px] font-black uppercase tracking-widest">
                Search Required
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Middle Panel */}
      <div className="md:w-1/2 mt-2 md:mt-0 border-r border-slate-200 bg-white flex flex-col h-full overflow-hidden shadow-sm">
        <div className="md:px-5 px-2 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
            <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">
              Inventory Assets (SKUs)
            </h2>
          </div>
        </div>

        {currentStock && (
          <div className="md:px-5 px-2 pt-5 pb-2 grid grid-cols-3 gap-0 border-b border-slate-100">
            <div className="p-4 text-center border-r">
              <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                Total
              </h4>
              <p className="text-xl font-black text-slate-900">{totalStock}</p>
            </div>
            <div className="p-4 text-center border-r bg-emerald-50/30">
              <h4 className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                Available
              </h4>
              <p className="text-xl font-black text-emerald-600">
                {availableStock}
              </p>
            </div>
            <div className="p-4 text-center bg-rose-50/30 text-rose-500">
              <h4 className="text-[9px] font-black uppercase tracking-widest">
                Out
              </h4>
              <p className="text-xl font-black">
                {totalStock - availableStock}
              </p>
            </div>
          </div>
        )}

        <div className="flex-1 p-5 overflow-y-auto custom-scrollbar">
          {currentStock ? (
            <table className="w-full">
              <thead className="sticky top-0 bg-white border-b">
                <tr>
                  <th className="py-3 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    SKU ID
                  </th>
                  <th className="py-3 text-right text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {Object.values(currentStock)
                  .reverse()
                  .map((sku) => (
                    <tr
                      key={sku.skuID}
                      className={`cursor-pointer hover:bg-slate-50 ${currentSKU?.skuID === sku.skuID ? "bg-indigo-50" : ""}`}
                      onClick={() => {
                        handleSelectSKU(sku.skuID);
                        setToggle(true);
                      }}
                    >
                      <td className="py-3 text-sm font-bold text-slate-700">
                        {sku.skuID}
                      </td>
                      <td className="py-3 text-right">
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${sku.status ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}
                        >
                          {sku.status ? "In Stock" : "Sold"}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-20 opacity-20">
              <FiActivity size={40} className="mx-auto" />
            </div>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div className="md:w-1/2 bg-white flex flex-col border border-slate-200 shadow-sm">
        <div
          className={`md:px-5 px-2 py-4 border-b ${toggle ? "bg-slate-50/50" : "bg-indigo-50/30 border-indigo-200"}`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`w-1.5 h-6 rounded-full ${toggle ? "bg-slate-400" : "bg-indigo-600"}`}
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
                <div className="flex justify-between border-b pb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase">
                    SKU Reference
                  </span>
                  <span className="text-sm font-mono font-bold text-indigo-600">
                    {currentSKU.skuID}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase">
                    Unit Cost
                  </span>
                  <span className="text-sm font-bold">
                    ৳ {currentSKU.cost || 0}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase">
                    Sale Profit
                  </span>
                  <span
                    className={`text-sm font-bold ${currentSKU.profit >= 0 ? "text-emerald-600" : "text-rose-500"}`}
                  >
                    ৳ {currentSKU.profit || 0}
                  </span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border italic text-xs text-slate-500">
                  "{currentSKU.comment || "No logs available."}"
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-[10px] font-black uppercase text-slate-300 tracking-widest">
                Select an SKU to view details
              </div>
            )
          ) : (
            <div className="relative animate-in fade-in slide-in-from-right-4 duration-300">
              {success && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md z-30 rounded-3xl">
                  <FaSpinner className="text-indigo-600 text-4xl animate-spin mb-2" />
                  <p className="text-[10px] font-black uppercase tracking-widest">
                    Processing
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
                    required
                    className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Buying Cost (৳)
                    </label>
                    <input
                      type="number"
                      name="cost"
                      value={formData.cost}
                      onChange={handleFormDataChange}
                      required
                      className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-rose-500/10 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Selling Price (৳)
                    </label>
                    <input
                      type="number"
                      name="selling_price"
                      value={formData.selling_price}
                      onChange={handleFormDataChange}
                      required
                      className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 transition-all"
                    />
                  </div>
                </div>

                <div className="bg-slate-900 rounded-xl p-4 flex justify-between items-center text-white border border-slate-800">
                  <div>
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                      Estimated Profit
                    </p>
                    <p
                      className={`text-lg font-black ${calculatedProfit >= 0 ? "text-emerald-400" : "text-rose-400"}`}
                    >
                      ৳ {calculatedProfit.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                      Margin
                    </p>
                    <p className="text-xs font-bold">
                      {formData.selling_price > 0
                        ? (
                            (calculatedProfit / formData.selling_price) *
                            100
                          ).toFixed(1)
                        : 0}
                      %
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Technical Notes
                  </label>
                  <textarea
                    rows={3}
                    name="comment"
                    value={formData.comment}
                    onChange={handleFormDataChange}
                    className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  ></textarea>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setToggle(true)}
                    className="flex-1 bg-white text-rose-500 border border-rose-100 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 transition-all"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] bg-indigo-600 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
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
  );
}
