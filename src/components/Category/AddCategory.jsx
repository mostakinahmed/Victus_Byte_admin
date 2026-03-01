import React, { useContext, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Layers } from "lucide-react";
import { DataContext } from "@/Context Api/ApiContext";
import { FiHash, FiTag, FiSmile } from "react-icons/fi"; // Added FiSmile for icon label
import api from "@/Context Api/api";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

const AddCategory = () => {
  const { updateApi } = useContext(DataContext);

  const [category, setCategory] = useState({
    catID: "",
    catName: "",
    catIcon: "", // Default icon
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  const resetForm = () => {
    setCategory({
      catID: "",
      catName: "",
      catIcon: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      MySwal.fire({
        title: "Saving Architecture...",
        allowOutsideClick: false,
        didOpen: () => MySwal.showLoading(),
      });

      // Sending catID, catName, and catIcon to backend
      const res = await api.post("/category", category);
      updateApi();
      resetForm();

      MySwal.fire({
        icon: "success",
        title: "Success!",
        text: "Category has been added to Victus Byte.",
        timer: 2000,
      });
    } catch (error) {
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
        <div className="bg-slate-50 border-b border-slate-100 md:p-6 p-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200">
              <Layers size={22} />
            </div>
            <div>
              <h2 className="md:text-xl font-black text-slate-800 uppercase tracking-tight">
                Create Architecture
              </h2>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Internal Reference ID */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  <FiHash /> ID
                </label>
                <Input
                  type="text"
                  name="catID"
                  value={category.catID.toUpperCase()}
                  onChange={handleChange}
                  placeholder="C0902"
                  required
                  className="rounded border-slate-300 h-10 font-medium text-slate-800 bg-slate-50/50 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                />
              </div>

              {/* Manifest Name */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  <FiTag /> Name
                </label>
                <Input
                  type="text"
                  name="catName"
                  value={category.catName}
                  onChange={handleChange}
                  placeholder=""
                  required
                  className="rounded border-slate-300 h-10 font-medium text-slate-800 bg-slate-50/50 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                />
              </div>

              {/* Icon Visual Identifier */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  <FiSmile /> Icon url
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    name="catIcon"
                    value={category.catIcon}
                    onChange={handleChange}
                    placeholder=""
                    required
                    className="rounded border-slate-300 h-10 pl-10 font-medium text-slate-800 bg-slate-50/50 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                  />
                  {/* Dynamic Icon Preview */}
                  <div className="absolute left-1 top-1/2 -translate-y-1/2 text-indigo-600 bg-white p-1">
                    <img src={category.catIcon} alt="" className="h-6 w-6" />
                  </div>
                </div>
                
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-12 text-xs font-black uppercase tracking-[0.2em] rounded-xl bg-slate-900 text-white hover:bg-indigo-600 shadow-xl transition-all active:scale-95"
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
