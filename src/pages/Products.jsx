import { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../Context Api/ApiContext";
import {
  FiPlus,
  FiGrid,
  FiSearch,
  FiEdit3,
  FiTrash2,
  FiTag,
  FiFilter,
} from "react-icons/fi";

export default function Products() {
  const { categoryData, productData, loading } = useContext(DataContext);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchId, setSearchId] = useState("");
  const [catList, setCatList] = useState([]);

  const productsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    if (productData.length && categoryData.length) {
      const formattedData = productData.map((element) => {
        const category = categoryData.find((c) => c.catID === element.category);
        return category
          ? `${element.category} - ${category.catName}`
          : element.category;
      });
      setCatList([...new Set(formattedData)]);
    }
  }, [productData, categoryData]);

  useEffect(() => {
    if (productData) {
      setProducts(Array.isArray(productData) ? productData : []);
    }
  }, [productData]);

  const filteredProducts = products
    .filter((p) => {
      if (categoryFilter === "All") return true;
      const filterID = categoryFilter.split(" - ")[0];
      return p.category === filterID;
    })
    .filter((p) => (searchId ? p.pID?.toString().includes(searchId) : true));

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <div className="">
      <Navbar pageTitle="Product Management" />

      {/* --- 1. COMMAND BAR: FILTERS & SEARCH --- */}
      <div className=" bg-white rounded border border-slate-200  p-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex flex-1 w-full gap-3">
            {/* Category Selector */}
            <div className="relative group flex-1 max-w-xs">
              <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
              >
                <option value="All">All Categories</option>
                {catList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Search ID */}
            <div className="relative group flex-1 max-w-sm">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="text"
                placeholder="Lookup by Product ID..."
                value={searchId}
                onChange={(e) => {
                  setSearchId(e.target.value.toUpperCase());
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="flex gap-3 w-full lg:w-auto">
            <button
              onClick={() => navigate("/products/status-management")}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition-all active:scale-95"
            >
              <FiGrid /> Status
            </button>
            <button
              onClick={() => navigate("/products/add-product")}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 shadow-xl shadow-slate-200 transition-all active:scale-95"
            >
              <FiPlus /> New Product
            </button>
          </div>
        </div>
      </div>

      {/* --- 2. DATA TABLE --- */}
      <div className="mx- mt-4 bg-white pb-5 rounded border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="bg-slate-100 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[12px] font-black text-slate-600 uppercase tracking-widest">
                  Image
                </th>
                <th className="px-6 py-4 text-[12px] font-black text-slate-600 uppercase tracking-widest">
                  Ref ID
                </th>
                <th className="px-6 py-4 text-[12px] font-black text-slate-600 uppercase tracking-widest">
                  Product Name
                </th>
                <th className="px-6 py-4 text-[12px] font-black text-slate-600 uppercase tracking-widest">
                  Brand
                </th>
                <th className="px-6 py-4 text-[12px] font-black text-slate-600 uppercase tracking-widest">
                  Category
                </th>
                <th className="px-6 py-4 text-[12px] font-black text-slate-600 uppercase tracking-widest">
                  Pricing (৳)
                </th>

                <th className="px-6 py-4 text-[12px] font-black text-slate-600 uppercase tracking-widest text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 ">
              {currentProducts.length > 0 ? (
                currentProducts.map((product, index) => (
                  <tr
                    key={product._id || index}
                    className="hover:bg-slate-100 transition-colors group"
                  >
                    <td className="px-6 py-1">
                      <div className="w-12 h-12  shadow-sm overflow-hidden">
                        <img
                          src={product.images[0]}
                          alt=""
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-1">
                      <span className="text-xs font-mono font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                        #{product.pID}
                      </span>
                    </td>
                    <td className="px-6 py-1">
                      <p className="text-sm font-black text-slate-800 uppercase tracking-tight truncate max-w-[200px]">
                        {product.name}
                      </p>
                    </td>
                    <td className="px-6 py-1">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">
                        {product.brandName}
                      </span>
                    </td>
                    <td className="px-6 py-1">
                      <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <FiTag className="text-indigo-400" /> {product.category}
                      </span>
                    </td>
                  
                  
                    <td className="px-6 py-1">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900">
                          ৳{product?.price?.selling}
                        </span>
                        {product?.price?.discount > 0 && (
                          <span className="text-[10px] font-bold text-rose-500 uppercase">
                            -{product?.price?.discount} Off
                          </span>
                        )}
                      </div>
                    </td>
              
                    <td className="px-6 py-1">
                      <div className="flex justify-center gap-2">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                          <FiEdit3 size={16} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center opacity-40">
                      <FiSearch size={40} className="mb-2" />
                      <p className="text-xs font-black uppercase tracking-widest">
                        No matching products found
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- 3. PAGINATION: FOOTER BAR --- */}
      {totalPages > 1 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 z-50 flex justify-center">
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200/50">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-800 disabled:opacity-30"
            >
              Prev
            </button>

            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-xl text-xs font-black transition-all ${
                    currentPage === i + 1
                      ? "bg-slate-900 text-white shadow-lg"
                      : "text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-800 disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
