import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaSearch, FaInbox } from "react-icons/fa";
import { FiHash, FiLayers, FiActivity } from "react-icons/fi";

const CategoryList = ({ data = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    const filtered = data.filter(
      (cat) =>
        cat.catName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.catID.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, data]);

  return (
    <div className="bg-white  border border-slate-200 shadow-sm overflow-hidden">
      {/* --- Minimalist Header --- */}
      <div className="px-5 py-3 border-b border-slate-100 bg-white flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FiLayers size={16} className="text-indigo-600" />
          <h2 className="text-sm font-black text-slate-700 uppercase tracking-widest">
            Category Manifest
          </h2>
          <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">
            {filteredData.length} Total
          </span>
        </div>

        {/* 🔍 Compact Search */}
        <div className="relative group">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 text-xs transition-colors" />
          <input
            type="text"
            placeholder="Filter ID or Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-60 pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:font-medium"
          />
        </div>
      </div>

      {/* --- Single-Line High Density Table --- */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-2.5 text-[12px] font-black text-slate-400 uppercase tracking-tighter w-12 text-center">
                #
              </th>
              <th className="px-4 py-2.5 text-[12px] font-black text-slate-400 uppercase tracking-tighter w-32">
                Reference ID
              </th>
              <th className="px-4 py-2.5 text-[12px] font-black text-slate-400 uppercase tracking-tighter w-48">
                Category Name
              </th>
              <th className="px-4 py-2.5 text-[12px] font-black text-slate-400 uppercase tracking-tighter">
                Specifications Manifest
              </th>
              <th className="px-4 py-2.5 text-[12px] font-black text-slate-400 uppercase tracking-tighter w-24 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredData.length > 0 ? (
              filteredData.map((cat, index) => (
                <tr
                  key={cat.catID}
                  className="hover:bg-indigo-50 transition-colors group"
                >
                  <td className="px-4 py-2 text-[12px] font-mono text-slate-600 text-center">
                    {(index + 1).toString().padStart(2, "0")}
                  </td>

                  <td className="px-4 py-2">
                    <span className="flex items-center gap-1 text-[12px] font-mono font-bold text-indigo-600">
                      <FiHash size={10} className="text-indigo-400" />{" "}
                      {cat.catID}
                    </span>
                  </td>

                  <td className="px-4 py-2">
                    <p className="text-[12px] font-bold text-slate-700  truncate">
                      {cat.catName}
                    </p>
                  </td>

                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
                      {cat.specifications.map((spec, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1 shrink-0"
                        >
                          <span className="text-[10px] font-bold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-sm uppercase">
                            {spec}
                          </span>
                          {i < cat.specifications.length - 1 && (
                            <div className="w-1 h-1 bg-slate-200 rounded-full" />
                          )}
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="px-4 py-2">
                    <div className="flex justify-center items-center gap-1">
                      <button className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded transition-all">
                        <FaEdit size={12} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded transition-all">
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <FaInbox className="text-slate-200" size={24} />
                    <p className="text-[10px] font-black text-slate-400 uppercase">
                      No Data Found
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- Status Bar Footer --- */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-500 uppercase">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />{" "}
            Live Sync
          </div>
        </div>
     
      </div>
    </div>
  );
};

export default CategoryList;
