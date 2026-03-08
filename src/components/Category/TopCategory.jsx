import { DataContext } from "@/Context Api/ApiContext";
import React, { useContext, useState } from "react";
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
import api from "@/Context Api/api";

export const TopCategory = () => {
  const { updateApi, categoryData } = useContext(DataContext);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const submit = async (catID, action) => {
    setShowModal(false);
    try {
      Swal.fire({
        title: "Processing...",
        didOpen: () => Swal.showLoading(),
      });

      const data = { catID, action };
      await api.patch("/category", data);
      updateApi();

      Swal.fire({
        icon: "success",
        title: "Updated",
        timer: 1000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({ icon: "error", title: "Failed" });
    }
  };

  return (
    <div className="relative w-full animate-in fade-in duration-500 font-sans">
      {/* --- COMPACT HEADER --- */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#1976d2]/10 text-[#1976d2] rounded-lg">
            <FiStar size={16} />
          </div>
          <h2 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">
            Featured
          </h2>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#1976d2] hover:bg-[#1565c0] text-white py-1.5 px-3 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm shadow-[#1976d2]/20"
        >
          <FiPlus className="inline mr-1" /> Add
        </button>
      </div>

      {/* --- COMPACT TABLE --- */}
      <div className="bg-white rounded border border-slate-200 overflow-hidden ">
        <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-slate-50 z-10 border-b border-slate-100">
              <tr>
                <th className="py-2 pl-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Category
                </th>
                <th className="py-2 px-2 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Icon
                </th>
                <th className="py-2 pr-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">
                  Del
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {categoryData
                .filter((data) => data.topCategory === true)
                .map((item, index) => (
                  <tr
                    key={item.catID}
                    className="hover:bg-slate-100 transition-colors group"
                  >
                    <td className="py-2 pl-4">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-slate-700 leading-tight">
                          {item.catName}
                        </span>
                        {/* <span className="text-[12px] font-bold text-[#1976d2] uppercase">
                          {item.catID}
                        </span> */}
                      </div>
                    </td>
                    <td className="px-2 py-2.5">
                      <div className="flex justify-center">
                        <div className="h-7 w-7 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center">
                          <img
                            src={item.catIcon}
                            alt=""
                            className="h-4 w-4 object-contain"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 pr-4 text-right">
                      <button
                        onClick={() => submit(item.catID, false)}
                        className="p-1.5 text-slate-400 cursor-pointer hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                      >
                        <FiTrash2 size={17} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- COMPACT MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[200] p-4">
          <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-[10px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <FiLayers className="text-[#1976d2]" /> Select To Feature
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="p-5">
              <div className="relative mb-3 group">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm group-focus-within:text-[#1976d2]" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#1976d2] transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="h-56 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
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
                      className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center hover:bg-white hover:border-[#1976d2]/30 transition-all"
                    >
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-700 uppercase">
                          {item.catName}
                        </span>
                        <span className="text-[8px] font-mono font-bold text-slate-400">
                          {item.catID}
                        </span>
                      </div>
                      <button
                        onClick={() => submit(item.catID, true)}
                        className="px-3 py-1 bg-white border border-slate-200 text-[#1976d2] rounded-lg text-[8px] font-black uppercase hover:bg-[#1976d2] hover:text-white transition-all"
                      >
                        Select
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #1976d2;
        }
      `}</style>
    </div>
  );
};
