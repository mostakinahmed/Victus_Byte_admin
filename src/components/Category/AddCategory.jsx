import React, { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Layers } from "lucide-react";
import { DataContext } from "@/Context Api/ApiContext";
import { FiHash, FiTag, FiImage } from "react-icons/fi";
import api from "@/Context Api/api";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const AddCategory = () => {
  const { updateApi } = useContext(DataContext);

  const [category, setCategory] = useState({
    catID: "",
    catName: "",
    catIcon: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const val = name === "catID" ? value.toUpperCase() : value;
    setCategory({ ...category, [name]: val });
  };

  const resetForm = () => {
    setCategory({ catID: "", catName: "", catIcon: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      MySwal.fire({
        title: "Saving...",
        allowOutsideClick: false,
        didOpen: () => MySwal.showLoading(),
      });

      await api.post("/category", category);
      updateApi();
      resetForm();

      MySwal.fire({
        icon: "success",
        title: "Saved!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Check fields",
      });
    }
  };

  return (
    <div className="w-full font-sans animate-in fade-in duration-500">
      {/* --- COMPACT HEADER --- */}
      <div className="flex items-center gap-2 mb-4 px-1">
        <div className="p-1.5 bg-[#1976d2]/10 text-[#1976d2] rounded-lg">
          <Layers size={16} />
        </div>
        <h2 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">
          New Architecture
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Row 1: ID and Name together if space allows, or stacked for compactness */}
        <div className="grid grid-cols-1 gap-3">
          {/* ID Input */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
              <FiHash /> ID
            </label>
            <Input
              type="text"
              name="catID"
              value={category.catID}
              onChange={handleChange}
              placeholder="C-101"
              required
              className="h-10 text-sm rounded placeholder:font-normal border-slate-200 bg-slate-50/50 focus:border-[#1976d2] focus:ring-0 transition-all font-medium"
            />
          </div>

          {/* Name Input */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
              <FiTag /> Name
            </label>
            <Input
              type="text"
              name="catName"
              value={category.catName}
              onChange={handleChange}
              placeholder="Electronics"
              required
              className="h-10 text-sm rounded border-slate-200 placeholder:font-normal bg-slate-50/50 focus:border-[#1976d2] focus:ring-0 transition-all font-bold"
            />
          </div>

          {/* Icon URL Input */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
              <FiImage /> Visual URL
            </label>
            <div className="relative group">
              <Input
                type="text"
                name="catIcon"
                value={category.catIcon}
                onChange={handleChange}
                placeholder="https://..."
                required
                className="h-10 text pl-10 rounded border border-slate-200 bg-slate-50 transition-all"
              />
              <div className="absolute left-1.5 top-1/2 -translate-y-1/2 h-6 w-6 bg-white rounded border border-slate-100 flex items-center justify-center overflow-hidden">
                {category.catIcon ? (
                  <img
                    src={category.catIcon}
                    alt=""
                    className="h-4 w-4 object-contain"
                  />
                ) : (
                  <FiImage className="text-slate-300" size={12} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex justify-center">
          <Button
            type="submit"
            className="w-2/7 h-10 text-[11px] font-black uppercase tracking-widest rounded-lg bg-slate-900 text-white hover:bg-[#1976d2] transition-all active:scale-95 "
          >
            Save Entry
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;
