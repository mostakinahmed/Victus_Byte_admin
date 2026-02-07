import React, { useContext, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus, CheckCircle, Loader2, Layers, Cpu } from "lucide-react";
import axios from "axios";
import { FaSpinner, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { DataContext } from "@/Context Api/ApiContext";
import { FiHash, FiTag } from "react-icons/fi";
import api from "@/Context Api/api";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

const AddCategory = () => {
  const navigate = useNavigate();

  const { updateApi } = useContext(DataContext);
  const [submitLoader, setSubmitLoader] = useState(false);
  const [success, setSuccess] = useState(false);

  const [category, setCategory] = useState({
    catID: "",
    catName: "",
  });

  // Handle text input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  // Reset form fields
  const resetForm = () => {
    setCategory({
      catID: "",
      catName: "",
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Show loading state
      MySwal.fire({
        title: "Saving...",
        allowOutsideClick: false,
        didOpen: () => MySwal.showLoading(),
      });

      const res = await api.post("/category", category);
      updateApi();
      resetForm();
      // Success Alert
      MySwal.fire({
        icon: "success",
        title: "Success!",
        text: "Category has been added to Victus Byte.",
        timer: 2000,
      });
    } catch (error) {
      // Error Alert
      MySwal.fire({
        icon: "error",
        title: "Failed ❌",
        text: error.response?.data?.message || "Could not save category",
      });
    }
  };

  return (
    <div className="relative max-w-lg mx-auto md:mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="border-slate-200 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden relative z-10 bg-white">
        {/* Header: Clean & Professional */}
        <div className="bg-slate-50 border-b border-slate-100 md:p-6 p-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200">
              <Layers size={22} />
            </div>
            <div>
              <h2 className="md:text-xl  font-black text-slate-800">
                Create Architecture
              </h2>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          {/* 📝 Professional Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Category ID */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  <FiHash /> Internal Reference ID
                </label>
                <Input
                  type="text"
                  name="catID"
                  value={category.catID.toUpperCase()}
                  onChange={handleChange}
                  placeholder="C0902"
                  required
                  className="rounded border-slate-200 h-10 font-medium text-slate-800 bg-slate-50/50 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:font-medium placeholder:text-slate-300"
                />
              </div>

              {/* Category Name */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest ml-1">
                  <FiTag /> Manifest Name
                </label>
                <Input
                  type="text"
                  name="catName"
                  value={category.catName}
                  onChange={handleChange}
                  placeholder="Wearable Technology"
                  required
                  className="rounded border-slate-200 h-10 font-medium text-slate-800 bg-slate-50/50 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:font-medium placeholder:text-slate-300"
                />
              </div>
            </div>

            {/* Submit Section */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-12 text-xs font-black uppercase tracking-widest rounded-xl bg-slate-900 text-white hover:bg-indigo-600 shadow-lg shadow-slate-200 transition-all active:scale-95"
              >
                Finalize & Save
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCategory;
