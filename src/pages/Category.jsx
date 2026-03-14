import { useContext } from "react";
import Navbar from "../components/Navbar";
import CategoryList from "../components/Category/CategoryList";
import { DataContext } from "../Context Api/ApiContext";
import AddCategory from "../components/Category/AddCategory";
import { TopCategory } from "@/components/Category/TopCategory";
import { FiGrid, FiActivity, FiLayers, FiZap } from "react-icons/fi";

export default function Category() {
  const { categoryData, loading } = useContext(DataContext);

  return (
    <div className="mt-12 md:mt-0 font-sans">
      <Navbar pageTitle="Category Management" />

      {/* --- DASHBOARD HEADER --- */}
      <div className=" mx-auto ">
        {/* --- MAIN INTEGRATED GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
          {/* LEFT: Main List (Takes 7/12) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded border border-slate-200  overflow-hidden min-h-[75vh]">
              <div className="bg-[#1976d2] border-b border-slate-100 px-5 py-3">
                <h3 className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <FiZap className="" /> Category List
                </h3>
              </div>
              <div className="p-2 md:p-4">
                {loading ? (
                  <div className="py-20 text-center text-slate-300 font-black uppercase text-[10px] animate-pulse">
                    Syncing...
                  </div>
                ) : (
                  <CategoryList data={categoryData} />
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Tools (Takes 5/12) - Stays Compact */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {/* Quick Creation Card */}
            <div className="bg-white rounded border border-slate-200  overflow-hidden">
              <div className="bg-[#1976d2] border-b border-slate-100 px-5 py-3">
                <h3 className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <FiZap className="" /> New category
                </h3>
              </div>
              <div className="p-4 scale-95 origin-top">
                {" "}
                {/* Scale down for compactness */}
                <AddCategory />
              </div>
            </div>

            {/* Featured Management Card */}
            <div className="bg-white rounded border border-slate-200 overflow-hidden">
              <div className="bg-[#1976d2] border-b border-slate-100 px-5 py-3">
                <h3 className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <FiZap className="" /> Featured category
                </h3>
              </div>
              <div className="p-4 scale-95 origin-top">
                {" "}
                {/* Scale down for compactness */}
                <TopCategory />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
