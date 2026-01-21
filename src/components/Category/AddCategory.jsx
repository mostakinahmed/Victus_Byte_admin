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
    setSubmitLoader(true);
    setSuccess(false);

    try {
      await axios.post("https://api.victusbyte.com/api/category", category);
      setSuccess(true);
      updateApi();
    } catch (error) {
      console.error("Error submitting category:", error);
      alert("Failed to save category!");
      setSubmitLoader(false);
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
          {/* 🚀 Advanced Loader / Success Overlay */}
          {submitLoader && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-md z-20 transition-all duration-300">
              {!success ? (
                <div className="flex flex-col items-center animate-pulse">
                  <Loader2 className="text-indigo-600 h-12 w-12 animate-spin mb-4" />
                  <p className="text-slate-800 font-black text-xs uppercase tracking-widest">
                    Writing to Catalog...
                  </p>
                </div>
              ) : (
                <div className="p-8 flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="text-emerald-500 h-12 w-12" />
                  </div>
                  <p className="text-slate-900 font-black text-lg">
                    Creation Successful
                  </p>
                  <p className="text-slate-500 text-sm mb-6 font-medium">
                    The new category is now live in the manifest.
                  </p>
                  <Button
                    className="w-full bg-slate-900 text-white rounded-xl py-6 hover:bg-indigo-600 shadow-lg shadow-indigo-100 transition-all font-black text-xs uppercase tracking-widest"
                    onClick={() => {
                      resetForm();
                      setSubmitLoader(false);
                      setSuccess(false);
                      navigate("/category");
                    }}
                  >
                    Return to Manifest
                  </Button>
                </div>
              )}
            </div>
          )}

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
                  value={category.catID}
                  onChange={handleChange}
                  placeholder="Mobile-902"
                  required
                  className="rounded-xl border-slate-200 h-11 font-bold text-slate-700 bg-slate-50/50 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:font-medium placeholder:text-slate-300"
                />
              </div>

              {/* Category Name */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  <FiTag /> Manifest Name
                </label>
                <Input
                  type="text"
                  name="catName"
                  value={category.catName}
                  onChange={handleChange}
                  placeholder="Wearable Technology"
                  required
                  className="rounded-xl border-slate-200 h-11 font-bold text-slate-700 bg-slate-50/50 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:font-medium placeholder:text-slate-300"
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
