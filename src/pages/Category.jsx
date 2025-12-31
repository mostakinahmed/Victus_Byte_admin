import { useContext, useState } from "react";
import Navbar from "../components/Navbar";
import CategoryList from "../components/Category/CategoryList";
import { DataContext } from "../Context Api/ApiContext";
import AddCategory from "../components/Category/AddCategory";
import { TopCategory } from "@/components/Category/TopCategory";
import { FiList, FiPlusSquare, FiAward, FiSettings } from "react-icons/fi";

export default function Category() {
  const { categoryData, productData, loading } = useContext(DataContext);

  const [activeTab, setActiveTab] = useState("catList");
  return (
    <div>
      <Navbar pageTitle="Category Management" />

      {/* 📑 Professional Category Control Panel */}
      <div className="bg-white border border-slate-200  overflow-hidden w-full mx-auto animate-in fade-in duration-500">
        {/* Modern Segmented Control Header */}
        <div className="p-4 bg-slate-50/50 ">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Tab Navigation */}
            <div className="flex bg-slate-200/60 p-1 rounded-2xl w-full lg:w-fit">
              {[
                {
                  id: "catList",
                  label: "Catalog List",
                  mobileLabel: "All",
                  icon: <FiList />,
                },
                {
                  id: "addCat",
                  label: "Add New Category",
                  mobileLabel: "Create",
                  icon: <FiPlusSquare />,
                },
                {
                  id: "topCategory",
                  label: "Top Categories",
                  mobileLabel: "Top",
                  icon: <FiAward />,
                },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-1 lg:flex-none items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                      isActive
                        ? "bg-white text-indigo-600 shadow-sm shadow-slate-200"
                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/40"
                    }`}
                  >
                    <span className="text-lg lg:text-base">{tab.icon}</span>
                    <span className="hidden lg:inline">{tab.label}</span>
                    <span className="lg:hidden">{tab.mobileLabel}</span>
                  </button>
                );
              })}
            </div>

          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-4  min-h-[70vh] bg-white">
          <div className="animate-in slide-in-from-bottom-2 duration-500">
            {activeTab === "catList" && <CategoryList data={categoryData} />}
            {activeTab === "addCat" && <AddCategory />}
            {activeTab === "topCategory" && <TopCategory />}
          </div>
        </div>

     
      </div>
    </div>
  );
}
