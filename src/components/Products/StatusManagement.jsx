import React, { useContext, useState } from "react";
import Navbar from "../Navbar";
import { DataContext } from "@/Context Api/ApiContext";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FiTag,
  FiShoppingBag,
  FiStar,
  FiZap,
  FiTruck,
  FiAlertCircle,
  FiSearch,
  FiX,
  FiPlus,
} from "react-icons/fi";

export const StatusManagement = () => {
  const { productData, updateApi } = useContext(DataContext);

  const [selected, setSelected] = useState("none");
  const [showModal, setShowModal] = useState(false);
  const [disModel, setDisModel] = useState(false);
  const [disModel2, setDisModel2] = useState(false);
  const [currData, setCurrData] = useState(null);
  const [search, setSearch] = useState("");
  const [discount, setDiscount] = useState("");

  // Filter selected category
  // -------------------------
  const filterData = productData.filter((item) => {
    if (selected === "isFeatured") return item.status.isFeatured;
    if (selected === "isFlashSale") return item.status.isFlashSale;
    if (selected === "discount") return item.price.discount;
    if (selected === "isBestSelling") return item.status.isBestSelling;
    if (selected === "isNewArrival") return item.status.isNewArrival;
    return false;
  });

  const titleMap = {
    none: "No Status Selected",
    isFeatured: "Featured Product",
    isFlashSale: "Flash Sale / Hot Deals",
    discount: "Discount Products",
    isBestSelling: "Best Selling Products",
    isNewArrival: "New Arrival Products",
  };

  // -------------------------
  // Submit function for status/discount
  // -------------------------
  const submit = async (productID, actionOrValue) => {
    setShowModal(false);
    setDisModel2(false);

    let value;
    // Detect if number (discount) or boolean (status)
    if (typeof actionOrValue === "number") {
      value = actionOrValue;
    } else {
      value = actionOrValue === "remove" ? false : true;
    }

    try {
      Swal.fire({
        title: "Processing...",
        text: "Please wait while we update the product status.",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const data = {
        pID: productID,
        key: selected,
        value,
      };

      await axios.patch("https://fabribuzz.onrender.com/api/product", data);

      updateApi();

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Status updated successfully!",
        timer: 1000,
        showConfirmButton: false,
      });

      setDiscount("");
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update status. Please try again.",
      });
    }
  };

  // -------------------------
  // Add Discount Modal
  // -------------------------
  const addDiscount = (data) => {
    setCurrData(data);
    setDisModel(false);
    setDisModel2(true);
  };

  return (
    <div>
      <Navbar pageTitle="Status Management" />

      <div className="space-y-6 animate-in fade-in duration-500">
        {/* --- 1. COMMAND TOOLBAR --- */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <div className="flex flex-col lg:flex-row items-center gap-4">
            {/* Category Selection */}
            <div className="w-full lg:w-1/3 group">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">
                Campaign Segment
              </label>
              <div className="relative">
                <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <select
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="none">Select Campaign Category...</option>
                  <option value="isFeatured">Featured Showcase</option>
                  <option value="isFlashSale">Flash Sale / Hot Deals</option>
                  <option value="discount">Price Reductions (Discount)</option>
                  <option value="isBestSelling">Best Selling Velocity</option>
                  <option value="isNewArrival">New Arrival Arrivals</option>
                </select>
              </div>
            </div>

            {/* Dynamic Title Display */}
            <div className="flex-1 w-full bg-slate-900 rounded-2xl px-6 py-3 flex items-center justify-center lg:justify-start gap-3 shadow-lg shadow-slate-200">
              <div className="p-2 bg-indigo-500 rounded-lg text-white animate-pulse">
                <FiZap size={18} />
              </div>
              <h1 className="font-black text-lg text-white uppercase tracking-tighter">
                {selected === "none"
                  ? "Campaign Control Center"
                  : titleMap[selected]}
              </h1>
            </div>

            {/* Action Buttons */}
            {selected !== "none" && (
              <button
                onClick={() =>
                  selected === "discount"
                    ? setDisModel(true)
                    : setShowModal(true)
                }
                className="w-full lg:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95"
              >
                <FiPlus />{" "}
                {selected === "discount" ? "Add Discount" : "Add Product"}
              </button>
            )}
          </div>
        </div>

        {/* --- 2. EMPTY STATE: NO SELECTION --- */}
        {selected === "none" && (
          <div className="flex flex-col items-center justify-center py-32 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-slate-200 shadow-sm mb-4">
              <FiShoppingBag size={40} />
            </div>
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">
              No Segment Selected
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-[250px] text-center font-medium leading-relaxed">
              Choose a campaign category from the toolbar above to manage
              specialized products.
            </p>
          </div>
        )}

        {/* --- 3. CAMPAIGN DATA TABLE --- */}
        {selected !== "none" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4">
            {filterData.length > 0 ? (
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead className="bg-slate-100 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-[12px] font-black text-slate-500 uppercase tracking-widest">
                      Reference ID
                    </th>
                    <th className="px-6 py-4 text-[12px] font-black text-slate-500 uppercase tracking-widest">
                      Product Information
                    </th>
                    <th className="px-6 py-4 text-[12px] font-black text-slate-500 uppercase tracking-widest">
                      Base Price
                    </th>
                    {selected === "discount" && (
                      <th className="px-6 py-4 text-[12px] font-black text-slate-500 uppercase tracking-widest">
                        Applied Discount
                      </th>
                    )}
                    <th className="px-6 py-4 text-[12px] font-black text-slate-500 uppercase tracking-widest text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filterData.map((item) => (
                    <tr
                      key={item.pID}
                      className="group hover:bg-slate-100 transition-colors"
                    >
                      <td className="px-6 py-2">
                        <span className="text-xs font-mono font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100 uppercase tracking-tighter">
                          #{item.pID}
                        </span>
                      </td>
                      <td className="px-6 py-2 text-sm font-black text-slate-700 uppercase tracking-tight">
                        {item.name}
                      </td>
                      <td className="px-6 py-2 text-sm font-bold text-slate-500">
                        ৳{item.price.selling}
                      </td>
                      {selected === "discount" && (
                        <td className="px-6 py-2">
                          <span className="text-xs font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
                            -৳{item.price.discount}
                          </span>
                        </td>
                      )}
                      <td className="px-6 py-2 text-center">
                        <button
                          onClick={() =>
                            submit(
                              item.pID,
                              selected === "discount" ? 0 : "remove"
                            )
                          }
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                          title="Remove from Segment"
                        >
                          <FiX size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-20 flex flex-col items-center justify-center opacity-40">
                <FiAlertCircle size={32} />
                <p className="text-[10px] font-black uppercase tracking-widest mt-2">
                  Zero records in this registry
                </p>
              </div>
            )}
          </div>
        )}

        {/* --- 4. MODALS (Unified Styling) --- */}
        {(showModal || disModel) && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                  {selected === "discount"
                    ? "Promotion Lookup"
                    : "Segment Picker"}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setDisModel(false);
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="p-6">
                <div className="relative mb-6 group">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600" />
                  <input
                    type="text"
                    placeholder="Search by name or ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                  />
                </div>

                <div className="max-h-64 overflow-y-auto rounded-2xl border border-slate-100 divide-y divide-slate-50 custom-scrollbar">
                  {productData
                    .filter(
                      (p) =>
                        (p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.pID.toLowerCase().includes(search.toLowerCase())) &&
                        (selected === "discount"
                          ? p.price.discount === 0
                          : p.status[selected] === false)
                    )
                    .map((item) => (
                      <div
                        key={item.pID}
                        className="p-4 flex justify-between items-center hover:bg-indigo-50/30 transition-colors"
                      >
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-slate-700 uppercase tracking-tight">
                            {item.name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            REF: {item.pID}
                          </span>
                        </div>
                        <button
                          onClick={() =>
                            selected === "discount"
                              ? addDiscount(item)
                              : submit(item.pID, true)
                          }
                          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
                        >
                          Add
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- 5. FINAL DISCOUNT APPLICATION MODAL --- */}
        {disModel2 && currData && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex justify-center items-center z-50 p-4">
            <div className="bg-white w-full max-w-sm rounded-[32px] shadow-2xl p-8 animate-in zoom-in-95 duration-300">
              <h2 className="text-lg font-black text-slate-900 mb-6 text-center uppercase tracking-widest">
                Apply Price Logic
              </h2>

              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl mb-8 border border-slate-100">
                <img
                  src={currData.images[0]}
                  alt={currData.name}
                  className="w-16 h-16 object-contain bg-white rounded-lg p-1 border shadow-sm"
                />
                <div>
                  <p className="text-xs font-black text-slate-800 uppercase tracking-tight leading-tight">
                    {currData.name}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">
                    MSRP: ৳{currData.price.selling}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Reduction Amount (৳)
                  </label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-black text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setDisModel2(false)}
                    className="flex-1 py-4 text-xs font-black text-slate-500 uppercase tracking-widest bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all"
                  >
                    Abort
                  </button>
                  <button
                    onClick={() => submit(currData.pID, discount)}
                    className="flex-[2] py-4 text-xs font-black text-white uppercase tracking-widest bg-emerald-600 hover:bg-emerald-700 rounded-2xl shadow-xl shadow-emerald-100 transition-all active:scale-95"
                  >
                    Commit Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusManagement;
