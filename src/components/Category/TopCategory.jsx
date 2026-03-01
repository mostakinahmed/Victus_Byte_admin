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
import * as Icons from "react-icons/fi"; 
import api from "@/Context Api/api";

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
      const res = await api.patch("/category", data);

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
    <div className="relative max-w-xl mx-auto mt-8 animate-in fade-in duration-500">
      {/* Header & Add Button */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
            <FiStar size={18} />
          </div>
          <div>
            <h2 className="md:text-sm text-xs font-black text-slate-800 uppercase tracking-widest">
              <span className="hidden md:block">Top category</span> 
            </h2>
           
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white py-2 md:px-4 px-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-slate-200 active:scale-95"
        >
          <FiPlus size={14} /> Add Category
        </button>
      </div>

{/* Main List Table */}
<div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
  <div className="overflow-x-auto">
    <table className="w-full text-left">
      <thead className="bg-slate-50/50 border-b border-slate-100">
        <tr>
          <th className="py-4 pl-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-16">
            Ref
          </th>
          <th className="py-4 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Architecture & Identity
          </th>
          <th className="py-4 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
            Visual
          </th>
          <th className="py-4 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
            Status
          </th>
          <th className="py-4 pr-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {categoryData
          .filter((data) => data.topCategory === true)
          .map((item, index) => {
            // Dynamically resolve the icon component
            const CategoryIcon = Icons[item.catIcon] || Icons.FiPackage;

            return (
              <tr
                key={item.catID}
                className="hover:bg-slate-50/80 transition-all duration-200 group"
              >
                {/* Reference Number */}
                <td className="py-4 pl-6 text-[11px] font-mono font-bold text-slate-400">
                  {(index + 1).toString().padStart(2, "0")}
                </td>

                {/* Identity Column */}
                <td className="px-4">
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-slate-800 leading-tight">
                      {item.catName}
                    </span>
                    <span className="text-[10px] font-mono font-medium text-indigo-500 uppercase">
                      ID: {item.catID}
                    </span>
                  </div>
                </td>

                {/* New Icon Column */}
                <td className="px-4">
                  <div className="flex justify-center">
                    <div className="p-2 bg-slate-100 text-slate-600 rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      <img src={item.catIcon} alt="" className="h-8 w-8" />
                    </div>
                  </div>
                </td>

                {/* Status Column */}
                <td className="px-4 text-center">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-tighter">
                    Featured
                  </span>
                </td>

                {/* Actions Column */}
                <td className="py-4 pr-6 text-right">
                  <div className="flex justify-end gap-2  transition-opacity">
                    <button
                      onClick={() => submit(item.catID, false)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all"
                      title="Remove from featured"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  </div>
</div>


      {/* 🔍 Add Top Category Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-[60] p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="md:p-6 p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
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
                className="text-slate-600 hover:text-slate-600 transition-colors"
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
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all  placeholder:text-slate-400"
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
                      p.topCategory === false,
                  )
                  .map((item) => (
                    <div
                      key={item.catID}
                      className="px-4 py-2 border-b border-slate-50 flex justify-between items-center hover:bg-indigo-50/30 transition-colors"
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
