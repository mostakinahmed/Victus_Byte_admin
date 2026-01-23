import React, { useContext, useState } from "react";
import Navbar from "../Navbar";
import { DataContext } from "@/Context Api/ApiContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const AddProduct = () => {
  const { updateApi, categoryData, loading } = useContext(DataContext);
  const navigate = useNavigate();

  // --- STATE FOR DYNAMIC SPECS ---
  const [customSpecs, setCustomSpecs] = useState([
    { groupName: "", fields: [{ key: "", value: "" }] },
  ]);

  const [keywordInput, setKeywordInput] = useState("");
  const [colorInput, setKeywordColorInput] = useState("");

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

  // -------------------
  // DYNAMIC SPEC HANDLERS
  // -------------------
  const addSpecGroup = () => {
    setCustomSpecs([
      ...customSpecs,
      { groupName: "", fields: [{ key: "", value: "" }] },
    ]);
  };

  const removeSpecGroup = (groupIndex) => {
    setCustomSpecs(customSpecs.filter((_, i) => i !== groupIndex));
  };

  const updateGroupName = (groupIndex, name) => {
    const updated = [...customSpecs];
    updated[groupIndex].groupName = name;
    setCustomSpecs(updated);
  };

  const addFieldRow = (groupIndex) => {
    const updated = [...customSpecs];
    updated[groupIndex].fields.push({ key: "", value: "" });
    setCustomSpecs(updated);
  };

  const updateField = (groupIndex, fieldIndex, field, value) => {
    const updated = [...customSpecs];
    updated[groupIndex].fields[fieldIndex][field] = value;
    setCustomSpecs(updated);
  };

  const removeFieldRow = (groupIndex, fieldIndex) => {
    const updated = [...customSpecs];
    updated[groupIndex].fields = updated[groupIndex].fields.filter(
      (_, i) => i !== fieldIndex,
    );
    setCustomSpecs(updated);
  };

  // -------------------
  // IMAGE HANDLERS
  // -------------------
  const updateImage = (index, value) => {
    const updated = [...formData.images];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, images: updated }));
  };

  const addImageField = () => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, ""] }));
  };

  const removeImage = (index) => {
    const updated = formData.images.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, images: updated }));
  };

  // -------------------
  // TAG HANDLERS (Keywords & Colors)
  // -------------------
  const addTag = (type, input, setInput) => {
    const val = input.trim();
    if (val && !formData[type].includes(val)) {
      setFormData((prev) => ({ ...prev, [type]: [...prev[type], val] }));
      setInput("");
    }
  };

  const removeTag = (type, index) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  // -------------------
  // SUBMIT LOGIC
  // -------------------
  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Manual Validation for custom parts
    if (formData.keywords.length === 0) {
      return Swal.fire(
        "Required",
        "Please add at least one Search Keyword",
        "warning",
      );
    }

    // 2. Format Specifications
    const formattedSpecs = {};
    customSpecs.forEach((group) => {
      if (group.groupName.trim()) {
        const validFields = group.fields.filter(
          (f) => f.key.trim() && f.value.trim(),
        );
        if (validFields.length > 0) {
          formattedSpecs[group.groupName] = validFields;
        }
      }
    });

    if (Object.keys(formattedSpecs).length === 0) {
      return Swal.fire(
        "Required",
        "Please add at least one Specification Section with Key/Value",
        "warning",
      );
    }

    const finalData = {
      ...formData,
      images: formData.images.filter((img) => img.trim() !== ""),
      specifications: formattedSpecs,
    };

    console.log(finalData);

    saveData(finalData);
  };

  const saveData = async (data) => {
    try {
      Swal.fire({
        title: "Saving...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });
      const res = await axios.post(
        "https://api.victusbyte.com/api/product",
        data,
      );
      updateApi();
      await axios.post("https://api.victusbyte.com/api/stock/create-stock", {
        pID: res.data.pID,
        sID: res.data.sID,
      });
      Swal.fire({
        icon: "success",
        title: "Product Saved!",
        timer: 1500,
        showConfirmButton: false,
      });
      resetForm();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error Saving Product" });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      brandName: "",
      price: { selling: "" },
      images: [""],
      description: "",
      category: "",
      keywords: [],
      colors: [],
    });
    setCustomSpecs([{ groupName: "", fields: [{ key: "", value: "" }] }]);
  };

  return (
    <div className="bg-gray-100 min-h-screen pb-10 mt-12 md:mt-0">
      <Navbar pageTitle="Add Product (Dynamic)" />

      <div className="mx-auto max-w-[1600px]">
        <div className="relative w-full mx-auto bg-white shadow rounded-xl overflow-hidden border border-gray-200">
          <form onSubmit={handleSubmit}>
            <div className="lg:flex">
              {/* LEFT: General Info & Attributes */}
              <div className="lg:w-[550px] border-r border-gray-100 md:p-6 p-2 md:space-y-6 space-y-2">
                <h2 className="md:text-xl  font-bold text-gray-800 border-b pb-2">
                  General Information
                </h2>

                <div className="md:space-y-4 space-y-2">
                  <input
                    type="text"
                    placeholder="Product Name"
                    className="p-2 border rounded w-full outline-blue-500"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Brand Name"
                    className="p-2 border rounded w-full outline-blue-500"
                    value={formData.brandName}
                    onChange={(e) =>
                      setFormData({ ...formData, brandName: e.target.value })
                    }
                    required
                  />

                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <label className="text-xs font-bold text-blue-600 uppercase">
                      Selling Price (BDT)
                    </label>
                    <input
                      type="number"
                      value={formData.price.selling}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: { selling: Number(e.target.value) },
                        })
                      }
                      placeholder="0.00"
                      className="mt-1 p-2 border rounded w-full font-bold "
                      required
                    />
                  </div>

                  {/* KEYWORDS */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-2 tracking-wide">
                      Search Keywords (SEO)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          (e.preventDefault(),
                          addTag("keywords", keywordInput, setKeywordInput))
                        }
                        placeholder="e.g. powerbank"
                        className="flex-1 p-2 border rounded text-sm outline-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          addTag("keywords", keywordInput, setKeywordInput)
                        }
                        className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.keywords.map((word, idx) => (
                        <span
                          key={idx}
                          className="bg-white border border-blue-200 text-blue-700 px-2 py-1 rounded text-xs font-medium flex items-center gap-1 shadow-sm"
                        >
                          {word}{" "}
                          <button
                            type="button"
                            onClick={() => removeTag("keywords", idx)}
                            className="text-red-400 font-bold ml-1"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* COLORS */}
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2 tracking-wide">
                      Available Colors
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={colorInput}
                        onChange={(e) => setKeywordColorInput(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          (e.preventDefault(),
                          addTag("colors", colorInput, setKeywordColorInput))
                        }
                        placeholder="e.g. Midnight Black"
                        className="flex-1 p-2 border rounded text-sm outline-slate-500"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          addTag("colors", colorInput, setKeywordColorInput)
                        }
                        className="bg-slate-700 text-white px-4 py-2 rounded text-sm font-bold"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.colors.map((color, idx) => (
                        <span
                          key={idx}
                          className="bg-white border border-slate-300 text-slate-700 px-2 py-1 rounded text-xs font-medium flex items-center gap-1 shadow-sm"
                        >
                          <span
                            className="w-2 h-2 rounded-full border border-gray-200"
                            style={{ backgroundColor: color.toLowerCase() }}
                          ></span>
                          {color}{" "}
                          <button
                            type="button"
                            onClick={() => removeTag("colors", idx)}
                            className="text-red-400 font-bold ml-1"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* IMAGES */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Image Gallery (URLs)
                    </label>
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          value={img}
                          onChange={(e) => updateImage(idx, e.target.value)}
                          placeholder="https://..."
                          className="p-2 border rounded flex-1 text-sm outline-blue-500"
                          required
                        />
                        {formData.images.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="text-red-500 px-2"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addImageField}
                      className="text-xs text-blue-600 font-bold hover:underline"
                    >
                      + Add more images
                    </button>
                  </div>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Short Description..."
                    className="p-3 border rounded w-full h-24 text-sm outline-blue-500"
                    required
                  />

                  <select
                    name="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="p-3 border rounded w-full bg-slate-100 font-semibold"
                    required
                  >
                    <option value="">-- Choose Category --</option>
                    {!loading &&
                      categoryData.map((cat) => (
                        <option key={cat.catID} value={cat.catID}>
                          {cat.catName}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* RIGHT: Dynamic Specifications */}
              <div className="flex-1 md:p-6 p-2 bg-gray-50">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="md:text-xl line-clamp-1 font-bold text-gray-800 border-b-2 border-blue-500 pb-1">
                     Specifications Dynamic
                  </h2>
                  <button
                    type="button"
                    onClick={addSpecGroup}
                    className="bg-green-600 ml-2 text-white md:px-5 px-2 py-2 rounded-lg hover:bg-green-700 shadow-lg shadow-green-100"
                  >
                    Add Section
                  </button>
                </div>

                <div className="space-y-6">
                  {customSpecs.map((group, gIdx) => (
                    <div
                      key={gIdx}
                      className="bg-white border border-gray-200 rounded-xl md:p-5 p-2 relative shadow-sm"
                    >
                      <button
                        type="button"
                        onClick={() => removeSpecGroup(gIdx)}
                        className="absolute top-3 right-3 text-red-400 hover:text-red-600 text-sm font-bold bg-red-50 px-2 py-1 rounded"
                      >
                        Delete
                      </button>

                      <div className="mb-4 pr-16">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          Section Title
                        </label>
                        <input
                          type="text"
                          value={group.groupName}
                          onChange={(e) =>
                            updateGroupName(gIdx, e.target.value)
                          }
                          placeholder="Battery & Power"
                          className="w-full p-2 mt-1 border rounded-lg font-bold text-gray-700 focus:ring-1 focus:ring-blue-400 outline-none"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        {group.fields.map((field, fIdx) => (
                          <div key={fIdx} className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Key (e.g. RAM)"
                              value={field.key}
                              onChange={(e) =>
                                updateField(gIdx, fIdx, "key", e.target.value)
                              }
                              className="flex-1 p-2 border rounded text-xs outline-blue-300"
                              required
                            />
                            <input
                              type="text"
                              placeholder="Value (e.g. 8GB)"
                              value={field.value}
                              onChange={(e) =>
                                updateField(gIdx, fIdx, "value", e.target.value)
                              }
                              className="flex-1 p-2 border rounded text-xs outline-blue-300"
                              required
                            />
                            {group.fields.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeFieldRow(gIdx, fIdx)}
                                className="text-red-400 font-bold px-1 text-lg"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addFieldRow(gIdx)}
                          className="text-[11px] bg-blue-50 text-blue-600 px-3 py-1 rounded font-bold mt-2"
                        >
                          + Add Row
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* FORM FOOTER (Now Inside the Form) */}
            <div className="bg-gray-100 md:px-6 px-2 py-4 flex justify-end gap-4 border-t">
              <button
                type="button"
                onClick={() => navigate("/products")}
                className="px-8 py-2 bg-white border border-gray-300 rounded-lg text-gray-600 font-bold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="md:px-12 px-3 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all transform active:scale-95"
              >
                Publish Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
