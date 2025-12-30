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
    specifications: [""],
  });

  // Handle text input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  // Handle specification field change
  const handleSpecChange = (index, value) => {
    const newSpecs = [...category.specifications];
    newSpecs[index] = value;
    setCategory({ ...category, specifications: newSpecs });
  };

  // Add specification field
  const addSpecification = () => {
    setCategory({
      ...category,
      specifications: [...category.specifications, ""],
    });
  };

  // Remove specification field
  const removeSpecification = (index) => {
    const newSpecs = category.specifications.filter((_, i) => i !== index);
    setCategory({ ...category, specifications: newSpecs });
  };

  // Reset form fields
  const resetForm = () => {
    setCategory({
      catID: "",
      catName: "",
      specifications: [""],
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoader(true);
    setSuccess(false);

    try {
      await axios.post("https://fabribuzz.onrender.com/api/category", category);
      setSuccess(true);
      updateApi();
    } catch (error) {
      console.error("Error submitting category:", error);
      alert("Failed to save category!");
      setSubmitLoader(false);
    }
  };

  return (
    <div className="relative max-w-lg mx-auto mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="border-slate-200 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden relative z-10 bg-white">
        {/* Header: Clean & Professional */}
        <div className="bg-slate-50 border-b border-slate-100 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200">
              <Layers size={22} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">
                Create Architecture
              </h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                Define new product categories
              </p>
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
                  placeholder="e.g., ARCH-902"
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
                  placeholder="e.g., Wearable Technology"
                  required
                  className="rounded-xl border-slate-200 h-11 font-bold text-slate-700 bg-slate-50/50 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:font-medium placeholder:text-slate-300"
                />
              </div>

              {/* Specifications List */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  <Cpu size={12} /> Technical Attributes
                </label>

                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
                  {category.specifications.map((spec, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 group animate-in slide-in-from-right-2"
                    >
                      <div className="flex-1 relative">
                        <Input
                          type="text"
                          value={spec}
                          onChange={(e) =>
                            handleSpecChange(index, e.target.value)
                          }
                          placeholder={`Attribute ${index + 1}`}
                          required
                          className="rounded-xl border-slate-200 h-10 font-medium text-sm text-slate-600 bg-white focus:border-indigo-500 transition-all"
                        />
                      </div>
                      {category.specifications.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          onClick={() => removeSpecification(index)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  onClick={addSpecification}
                  variant="outline"
                  className="w-full mt-2 flex justify-center border-dashed border-2 border-slate-200 rounded-xl py-6 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all text-[10px] font-black uppercase tracking-widest"
                >
                  <Plus className="h-4 w-4 mr-2" /> Append Attribute
                </Button>
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
