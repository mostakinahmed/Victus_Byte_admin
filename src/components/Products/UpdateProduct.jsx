import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import { DataContext } from "@/Context Api/ApiContext";
import Swal from "sweetalert2";
import api from "@/Context Api/api";
import {
  FiSave,
  FiX,
  FiInfo,
  FiLayers,
  FiTrash2,
  FiHash,
  FiEdit3,
  FiImage,
  FiType,
  FiTag,
  FiPlus,
} from "react-icons/fi";

const UpdateProduct = () => {
  const { updateApi, categoryData } = useContext(DataContext);
  const location = useLocation();
  const navigate = useNavigate();

  const product = location.state?.product;

  const [formData, setFormData] = useState({
    name: "",
    brandName: "",
    price: { selling: "" },
    images: [""],
    description: "",
    category: "",
    keywords: [],
    colors: [],
  });

  const [customSpecs, setCustomSpecs] = useState([
    { groupName: "", fields: [{ key: "", value: "" }] },
  ]);
  const [keywordInput, setKeywordInput] = useState("");
  const [colorInput, setColorInput] = useState("");

  useEffect(() => {
    if (!product) {
      navigate("/products");
      return;
    }

    setFormData({
      name: product.name || "",
      brandName: product.brandName || "",
      price: { selling: product.price?.selling || "" },
      images: product.images?.length ? product.images : [""],
      description: product.description || "",
      category: product.category || "",
      keywords: product.keywords || [],
      colors: product.colors || [],
    });

    if (product.specifications) {
      const specArray = Object.keys(product.specifications).map((key) => ({
        groupName: key,
        fields: product.specifications[key].map((f) => ({
          key: f.key,
          value: f.value,
        })),
      }));
      setCustomSpecs(
        specArray.length > 0
          ? specArray
          : [{ groupName: "", fields: [{ key: "", value: "" }] }],
      );
    }
  }, [product, navigate]);

  // --- Handlers ---
  const addTag = (type, input, setInput) => {
    const val = input.trim();
    if (val && !formData[type].includes(val)) {
      setFormData({ ...formData, [type]: [...formData[type], val] });
      setInput("");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formattedSpecs = {};
    customSpecs.forEach((group) => {
      if (group.groupName.trim()) {
        const validFields = group.fields.filter(
          (f) => f.key.trim() && f.value.trim(),
        );
        if (validFields.length > 0)
          formattedSpecs[group.groupName] = validFields;
      }
    });

    try {
      Swal.fire({ title: "Updating...", didOpen: () => Swal.showLoading() });
      await api.post(`/product/update/${product.pID}`, {
        ...formData,
        images: formData.images.filter((img) => img.trim() !== ""),
        specifications: formattedSpecs,
      });
      updateApi();
      Swal.fire({
        icon: "success",
        title: "Product Updated",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate("/products");
    } catch (err) {
      Swal.fire({ icon: "error", title: "Update Failed" });
    }
  };

  return (
    <div className=" pb-2 mt-12 md:mt-0">
      <Navbar pageTitle={`Modify: ${formData.name}`} />

      <div className=" md:px-0 mt-3">
        <form
          onSubmit={handleUpdate}
          className="bg-white shadow rounded overflow-hidden border border-slate-200"
        >
          <div className="lg:flex">
            {/* --- LEFT SECTION: GENERAL INFORMATION --- */}
            <div className="lg:w-[620px] border-r border-slate-200 p-3 space-y-2">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                <div className="p-2 bg-indigo-600 rounded-lg text-white">
                  <FiEdit3 size={20} />
                </div>
                <h2 className="md:text-xl font-bold text-slate-800 tracking-tight">
                  General Information
                </h2>
              </div>

              <div className="space-y-6">
                {/* 1. Name & Brand Group */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-slate-600 uppercase md:tracking-widest tracking-wider ml-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 bg-slate-50 border text-sm border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-700"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Product Name"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-slate-600 uppercase md:tracking-widest tracking-wider ml-1">
                      Brand
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 bg-slate-50 border text-sm border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-700"
                      value={formData.brandName}
                      onChange={(e) =>
                        setFormData({ ...formData, brandName: e.target.value })
                      }
                      placeholder="e.g. Victus Byte"
                      required
                    />
                  </div>
                </div>

                {/* 2. Pricing & Category */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-2 flex flex-col md:flex-row bg-emerald-50 md:gap-3 rounded border border-emerald-200">
                    <label className="md:w-2/3 w-auto text-[13px] flex justify-center items-center font-medium text-emerald-600  md:tracking-widest">
                      Selling Price
                    </label>
                    <div className="flex items-center ml-8 md:ml-0 gap-1 md:mt-1 ">
                      <span className="text-lg font-medium text-emerald-700">
                        ৳
                      </span>
                      <input
                        type="number"
                        className="md:w-full bg-transparent md:text-xl font-medium text-emerald-900 outline-none"
                        value={formData.price.selling}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            price: { selling: Number(e.target.value) },
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-slate-600 uppercase md:tracking-widest tracking-wider ml-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full p-2 bg-slate-50 border text-sm border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-700"
                      required
                    >
                      <option value="">Choose Category</option>
                      {categoryData.map((cat) => (
                        <option key={cat.catID} value={cat.catID}>
                          {cat.catName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 3. SEO Keywords */}
                <div className="bg-slate-50 p-3 rounded border border-slate-200">
                  <label className="text-[12px] font-medium text-slate-600 uppercase md:tracking-widest tracking-wider ml-1">
                    Search Keywords (SEO)
                  </label>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      className="flex-1 p-2 bg-white border border-slate-300 rounded text-sm outline-none focus:border-indigo-500"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      placeholder="Enter tag..."
                    />
                    <button
                      type="button"
                      onClick={() =>
                        addTag("keywords", keywordInput, setKeywordInput)
                      }
                      className="bg-slate-900 cursor-pointer text-white px-5 rounded font-bold text-xs uppercase"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap md:gap-2 gap-1">
                    {formData.keywords.map((tag, i) => (
                      <span
                        key={i}
                        className="md:px-3 md:py-1.5 px-2 py-1 bg-white border border-slate-200 rounded-lg md:text-sm text-xs font-medium text-slate-700 flex items-center gap-2"
                      >
                        {tag}{" "}
                        <FiX
                          className="cursor-pointer text-rose-500"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              keywords: formData.keywords.filter(
                                (_, idx) => idx !== i,
                              ),
                            })
                          }
                        />
                      </span>
                    ))}
                  </div>
                </div>

                {/* 4. Color Options */}
                <div className="bg-slate-50 p-3 rounded border border-slate-200">
                  <label className="text-[11px] font-medium text-slate-600 uppercase md:tracking-widest tracking-wider ml-1">
                    Color Variations
                  </label>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      className="flex-1 p-2 bg-white border border-slate-300 rounded text-sm outline-none focus:border-emerald-500"
                      value={colorInput}
                      onChange={(e) => setColorInput(e.target.value)}
                      placeholder="Midnight Black..."
                    />
                    <button
                      type="button"
                      onClick={() =>
                        addTag("colors", colorInput, setColorInput)
                      }
                      className="bg-emerald-600 cursor-pointer text-white px-5 rounded font-bold text-xs uppercase"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {formData.colors.map((color, i) => (
                      <span
                        key={i}
                        className="md:px-3 md:py-1.5 px-2 py-1 bg-emerald-50 border border-emerald-200 rounded-lg md:text-sm text-xs font-medium text-emerald-800 flex items-center gap-2"
                      >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: color.toLowerCase() }}
                        />{" "}
                        {color}
                        <FiX
                          className="cursor-pointer text-rose-500"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              colors: formData.colors.filter(
                                (_, idx) => idx !== i,
                              ),
                            })
                          }
                        />
                      </span>
                    ))}
                  </div>
                </div>

                {/* 5. Image Management */}
                <div className="space-y-3 bg-slate-50 rounded p-3 border border-slate-200">
                  <label className="text-[11px] font-medium text-slate-600 uppercase tracking-widest ml-1">
                    Asset Gallery (URLs)
                  </label>
                  <div className="grid grid-cols-4 gap-2 mt-1 mb-3">
                    {formData.images.map(
                      (url, i) =>
                        url && (
                          <div key={i} className="relative group">
                            <img
                              src={url}
                              className="w-16 h-16 object-cover rounded-lg border border-slate-200"
                              alt="thumb"
                            />
                          </div>
                        ),
                    )}
                  </div>
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                        value={img}
                        onChange={(e) => {
                          const updated = [...formData.images];
                          updated[idx] = e.target.value;
                          setFormData({ ...formData, images: updated });
                        }}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            images: formData.images.filter((_, i) => i !== idx),
                          })
                        }
                        className="text-rose-400 hover:text-rose-600"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        images: [...formData.images, ""],
                      })
                    }
                    className="text-[11px] font-black text-indigo-600 uppercase tracking-widest hover:underline"
                  >
                    + New Image Slot
                  </button>
                </div>

                {/* 6. Description */}
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-600 uppercase tracking-widest ml-1">
                    Description
                  </label>
                  <textarea
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded h-48 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-600 leading-relaxed"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Provide a detailed technical summary..."
                    required
                  />
                </div>
              </div>
            </div>

            {/* --- RIGHT SECTION: DYNAMIC SPECIFICATIONS (Keep your previous logic) --- */}
            <div className="flex-1 p-3 bg-slate-50/50">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                    <FiLayers size={20} />
                  </div>
                  <h2 className="md:text-xl font-bold text-slate-800">
                    Specification
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setCustomSpecs([
                      ...customSpecs,
                      { groupName: "", fields: [{ key: "", value: "" }] },
                    ])
                  }
                  className="bg-indigo-600 text-white md:px-6 px-3 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest cursor-pointer hover:bg-indigo-700 transition-all"
                >
                  + Add Spec Section
                </button>
              </div>

              <div className="space-y-6">
                {customSpecs.map((group, gIdx) => (
                  <div
                    key={gIdx}
                    className="bg-white p-3 rounded border border-slate-250 relative transition-all"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setCustomSpecs(customSpecs.filter((_, i) => i !== gIdx))
                      }
                      className="absolute top-6 right-6 text-slate-600 hover:text-rose-500 transition-colors"
                    >
                      <FiTrash2 size={18} />
                    </button>

                    <div className="mb-6">
                      <label className="text-[11px] font-medium text-indigo-700 uppercase tracking-[0.2em] mb-1 block">
                        Group Module Name
                      </label>
                      <input
                        type="text"
                        className="w-full font-medium  text-slate-700 border-b placeholder:font-normal border-slate-300 pb-2 outline-none focus:border-indigo-500 transition-all bg-transparent"
                        value={group.groupName}
                        onChange={(e) => {
                          const updated = [...customSpecs];
                          updated[gIdx].groupName = e.target.value;
                          setCustomSpecs(updated);
                        }}
                        placeholder="Heading Name"
                      />
                    </div>

                    <div className="space-y-3">
                      {group.fields.map((f, fIdx) => (
                        <div key={fIdx} className="flex gap-3 items-center w-full">
                          <input
                            type="text"
                            className="flex-1 p-2 w-1/2 bg-slate-50 border placeholder:font-normal border-slate-200 rounded text-sm font-medium text-slate-700 outline-none focus:bg-white focus:border-indigo-200 transition-all"
                            placeholder="key"
                            value={f.key}
                            onChange={(e) => {
                              const updated = [...customSpecs];
                              updated[gIdx].fields[fIdx].key = e.target.value;
                              setCustomSpecs(updated);
                            }}
                          />
                          <input
                            type="text"
                            className="flex-1 p-2 w-1/2 bg-slate-50 border placeholder:font-normal border-slate-200 rounded text-sm font-medium text-slate-700 outline-none focus:bg-white focus:border-indigo-200 transition-all"
                            placeholder="value"
                            value={f.value}
                            onChange={(e) => {
                              const updated = [...customSpecs];
                              updated[gIdx].fields[fIdx].value = e.target.value;
                              setCustomSpecs(updated);
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...customSpecs];
                              updated[gIdx].fields = updated[
                                gIdx
                              ].fields.filter((_, i) => i !== fIdx);
                              setCustomSpecs(updated);
                            }}
                            className="text-slate-600 text-xl placeholder:font-normal cursor-pointer hover:text-rose-400"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...customSpecs];
                          updated[gIdx].fields.push({ key: "", value: "" });
                          setCustomSpecs(updated);
                        }}
                        className="text-[10px] font-black text-indigo-600 uppercase tracking-wider flex items-center gap-1 mt-4 hover:underline"
                      >
                        + Add Attribute Row
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="bg-slate-900 md:p-8 p-2 mt-4 flex md:justify-end justify-between px-4 md:px-0 items-center gap-6">
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="text-slate-400 cursor-pointer font-bold  md:text-sm text-xs  hover:text-white transition-all uppercase tracking-widest"
            >
              Discard Changes
            </button>
            <button
              type="submit"
              className="bg-indigo-600 text-white md:px-14 px-3 md:py-4 py-2 md:mr-5  rounded-2xl font-black md:text-sm text-xs uppercase tracking-[0.1em] flex items-center gap-3 hover:bg-indigo-500 shadow-2xl shadow-indigo-500/20 active:scale-95 transition-all"
            >
              <FiSave size={18} /> Save Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
