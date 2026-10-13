
import React, { useMemo, useState } from "react";
import { FaEdit, FaTrash, FaSearch, FaInbox } from "react-icons/fa";

const CategoryList = ({ data = [], onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return data;

    return data.filter(
      (cat) =>
        (cat.catName || "").toLowerCase().includes(term) ||
        String(cat.catID || "").toLowerCase().includes(term)
    );
  }, [data, searchTerm]);

  return (
    <section className="flex h-[700px] w-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white font-sans">
      {/* Header */}
      <div className="flex shrink-0 flex-col gap-4 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div>
          <h2 className="text-base font-semibold text-slate-800">
            Categories
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage your product categories.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <FaSearch
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search categories..."
            aria-label="Search categories"
            className="h-9 w-full rounded-md border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
          />
        </div>
      </div>

      {/* Scrollable Table */}
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full min-w-[540px] border-collapse text-left">
          <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="w-16 px-5 py-3 text-xs font-semibold text-slate-500">
                #
              </th>

              <th className="px-4 py-3 text-xs font-semibold text-slate-500">
                Category ID
              </th>

              <th className="px-4 py-3 text-xs font-semibold text-slate-500">
                Category Name
              </th>

              <th className="w-24 px-4 py-3 text-right text-xs font-semibold text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {filteredData.length > 0 ? (
              filteredData.map((cat, index) => (
                <tr
                  key={cat.catID}
                  className="transition-colors hover:bg-slate-50"
                >
                  <td className="px-5 py-3.5 text-sm text-slate-500">
                    {String(index + 1).padStart(2, "0")}
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="font-mono text-sm text-slate-600">
                      {cat.catID}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="text-sm font-medium text-slate-800">
                      {cat.catName}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit?.(cat)}
                        title="Edit category"
                        aria-label={`Edit ${cat.catName}`}
                        className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                      >
                        <FaEdit size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete?.(cat)}
                        title="Delete category"
                        aria-label={`Delete ${cat.catName}`}
                        className="rounded-md p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                      >
                        <FaTrash size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-16 text-center">
                  <FaInbox
                    size={24}
                    className="mx-auto mb-3 text-slate-300"
                  />

                  <p className="text-sm font-medium text-slate-700">
                    No categories found
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {searchTerm
                      ? "Try a different search term."
                      : "Categories will appear here when available."}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Fixed Footer */}
      <div className="flex shrink-0 flex-col gap-1 border-t border-slate-200 bg-white px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">
          Showing{" "}
          <span className="font-medium text-slate-700">
            {filteredData.length}
          </span>{" "}
          of{" "}
          <span className="font-medium text-slate-700">
            {data.length}
          </span>{" "}
          categories
        </p>

        <p className="text-xs text-slate-400">
          Category Management
        </p>
      </div>
    </section>
  );
};

export default CategoryList;
