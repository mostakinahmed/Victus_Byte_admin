import { DataContext } from "@/Context Api/ApiContext";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FiStar,
  FiPlus,
  FiSearch,
  FiX,
  FiTrash2,
  FiLayers,
  FiCheck,
} from "react-icons/fi";

export const TopCategory = () => {
  const { updateApi, categoryData } = useContext(DataContext);

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  //submit top category
  const submit = async (catID, action) => {
    setShowModal(false);

    try {
      Swal.fire({
        title: "Processing...",
        text: "Please wait while we update the product status.",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const data = {
        catID: catID,
        action: action,
      };

      console.log(data);

      await axios.patch("https://fabribuzz.onrender.com/api/category", {
        data,
      });

      updateApi();

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Status updated successfully!",
        timer: 1000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update status. Please try again.",
      });
    }
  };

  return (
    <div className="relative max-w-2xl mx-auto mt-8 animate-in fade-in duration-500">
      {/* Header & Add Button */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
            <FiStar size={18} />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">
              Homepage Highlights
            </h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase">
              Featured categories on storefront
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white py-2 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-slate-200 active:scale-95"
        >
          <FiPlus size={14} /> Add Category
        </button>
      </div>

      {/* Main List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-tighter w-16 text-center">
                  Ref
                </th>
                <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                  Identity
                </th>
                <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-tighter text-center">
                  Status
                </th>
                <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-tighter text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {categoryData
                .filter((data) => data.topCategory === true)
                .map((item, index) => (
                  <tr
                    key={item.catID}
                    className="hover:bg-slate-50 transition-colors group"
                  >
                    <td className="p-4 text-sm font-mono font-bold text-slate-400 text-center">
                      {(index + 1).toString().padStart(2, "0")}
                    </td>
                    <td className="px-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-700 tracking-tight">
                          {item.catName}
                        </span>
                        <span className="text-[11px] font-mono text-indigo-500 font-bold">
                          {item.catID}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-black uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        Featured
                      </span>
                    </td>
                    <td className="px-4 text-right">
                      <button
                        onClick={() => submit(item.catID, false)}
                        className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="Remove from featured"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🔍 Add Top Category Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-[60] p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 rounded-xl text-white">
                  <FiLayers size={18} />
                </div>
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                  Catalog Picker
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Modal Search */}
            <div className="p-6">
              <div className="relative mb-4 group">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Search by name or reference ID..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:font-medium placeholder:text-slate-400"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Search Results */}
              <div className="h-72 overflow-y-auto rounded-xl border border-slate-100 custom-scrollbar">
                {categoryData
                  .filter(
                    (p) =>
                      (p.catName.toLowerCase().includes(search.toLowerCase()) ||
                        p.catID.toLowerCase().includes(search.toLowerCase())) &&
                      p.topCategory === false
                  )
                  .map((item) => (
                    <div
                      key={item.catID}
                      className="p-4 border-b border-slate-50 flex justify-between items-center hover:bg-indigo-50/30 transition-colors"
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-700 uppercase tracking-tight">
                          {item.catName}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {item.catID}
                        </span>
                      </div>
                      <button
                        onClick={() => submit(item.catID, true)}
                        className="flex items-center gap-1.5 bg-white border border-slate-200 text-indigo-600 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all"
                      >
                        <FiCheck /> Select
                      </button>
                    </div>
                  ))}
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="mt-6 w-full py-3 text-[11px] font-black text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl uppercase tracking-widest transition-colors"
              >
                Finished Selection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
