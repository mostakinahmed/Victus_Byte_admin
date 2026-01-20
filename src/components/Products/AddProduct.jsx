import React, { useContext, useState, useEffect } from "react";
import Navbar from "../Navbar";
import { DataContext } from "@/Context Api/ApiContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const AddProduct = () => {
  const { updateApi, categoryData, loading } = useContext(DataContext);
  const navigate = useNavigate();

  const [specification, setSpecification] = useState([]);
  const [specValues, setSpecValues] = useState({});
  const [keywordInput, setKeywordInput] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    brandName: "",
    price: { selling: "" },
    stock: "",
    images: [""],
    description: "",
    category: "",
    keywords: [], // Array for search tags
  });

  // Load specifications when category changes
  useEffect(() => {
    const selectedCat = formData.category;
    const category = categoryData.find((cat) => cat.catID === selectedCat);

    if (category) {
      setSpecification(category.specifications);
      const newSpecs = {};
      category.specifications.forEach((spec) => {
        newSpecs[spec] = [{ key: "", value: "" }];
      });
      setSpecValues(newSpecs);
    } else {
      setSpecification([]);
      setSpecValues({});
    }
  }, [formData.category, categoryData]);

  // -------------------
  // KEYWORD HANDLERS
  // -------------------
  const addKeyword = () => {
    const val = keywordInput.trim();
    if (val && !formData.keywords.includes(val)) {
      setFormData((prev) => ({
        ...prev,
        keywords: [...prev.keywords, val],
      }));
      setKeywordInput("");
    }
  };

  const handleKeywordKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addKeyword();
    }
  };

  const removeKeyword = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((_, index) => index !== indexToRemove),
    }));
  };

  // -------------------
  // FORM HANDLERS
  // -------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      price: { ...prev.price, [name]: Number(value) },
    }));
  };

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

  const handleSpecChange = (spec, index, field, value) => {
    setSpecValues((prev) => {
      const updated = { ...prev };
      updated[spec][index][field] = value;
      return updated;
    });
  };

  const addSpecRow = (spec) => {
    setSpecValues((prev) => {
      const updated = { ...prev };
      updated[spec].push({ key: "", value: "" });
      return updated;
    });
  };

  const removeSpecRow = (spec, index) => {
    setSpecValues((prev) => {
      const updated = { ...prev };
      updated[spec] = updated[spec].filter((_, i) => i !== index);
      return updated;
    });
  };

  // -------------------
  // SUBMIT LOGIC
  // -------------------
  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanedSpecs = {};
    Object.keys(specValues).forEach((spec) => {
      const validRows = specValues[spec].filter(
        (row) => row.key.trim() !== "" && row.value.trim() !== "",
      );
      if (validRows.length) cleanedSpecs[spec] = validRows;
    });

    const finalData = {
      ...formData,
      images: formData.images.filter((img) => img.trim() !== ""),
      specifications: cleanedSpecs,
    };

    saveData(finalData);
  };

  const saveData = async (data) => {
    try {
      Swal.fire({
        title: "Saving Product...",
        text: "Uploading data and keywords",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      console.log(data);

      const productRes = await axios.post(
        "https://api.victusbyte.com/api/product",
        data,
      );
      const { pID, sID } = productRes.data;
      updateApi();

      await axios.post("https://api.victusbyte.com/api/stock/create-stock", {
        pID,
        sID,
      });

      Swal.close();
      Swal.fire({
        icon: "success",
        title: "Success!",
        timer: 1500,
        showConfirmButton: false,
      });
      resetForm();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save product.",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      brandName: "",
      price: { selling: "" },
      stock: "",
      images: [""],
      description: "",
      category: "",
      keywords: [],
    });
    setKeywordInput("");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar pageTitle="Add New Product" />

      <div className="mx-auto flex flex-col md:flex-row ">
        <div className="relative w-full mx-auto bg-white shadow-2xl rounded overflow-hidden border border-gray-200">
          <form onSubmit={handleSubmit}>
            <div className="lg:flex">
              {/* LEFT SECTION: General Info */}
              <div className="lg:w-[550px] border-r border-gray-100 p-6 space-y-6">
                <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
                  General Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Product Details
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Product Name"
                      className="mt-1 p-3 border rounded w-full focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>

                  <input
                    type="text"
                    name="brandName"
                    value={formData.brandName}
                    onChange={handleChange}
                    placeholder="Brand Name"
                    className="p-3 border rounded w-full focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />

                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <label className="text-xs font-bold text-blue-600 uppercase">
                      Selling Price (BDT)
                    </label>
                    <input
                      type="number"
                      name="selling"
                      value={formData.price.selling}
                      onChange={handlePriceChange}
                      placeholder="0.00"
                      className="mt-1 p-2 border rounded w-full font-bold text-lg"
                      required
                    />
                  </div>

                  {/* KEYWORD SECTION */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-2">
                      Search Keywords (SEO)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        onKeyDown={handleKeywordKeyDown}
                        placeholder="e.g. powerbank"
                        className="flex-1 p-2 border rounded text-sm outline-blue-500"
                      />
                      <button
                        type="button"
                        onClick={addKeyword}
                        className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold"
                      >
                        Add
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.keywords.map((word, idx) => (
                        <span
                          key={idx}
                          className="flex items-center gap-1 bg-white border border-blue-300 text-blue-700 px-2 py-1 rounded-md text-xs font-medium shadow-sm"
                        >
                          {word}
                          <button
                            type="button"
                            onClick={() => removeKeyword(idx)}
                            className="text-red-400 hover:text-red-600 font-bold ml-1"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* IMAGES */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Image Gallery (URLs)
                    </label>
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          value={img}
                          onChange={(e) => updateImage(idx, e.target.value)}
                          placeholder="https://..."
                          className="p-2 border rounded flex-1 text-sm"
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
                    onChange={handleChange}
                    placeholder="Short Description..."
                    className="p-3 border rounded w-full h-24 text-sm"
                  />

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="p-3 border rounded w-full bg-slate-100 font-semibold text-gray-700 border-gray-300"
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

              {/* RIGHT SECTION: Specifications */}
              <div className="flex-1 p-6 bg-gray-50">
                <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">
                  Specifications
                </h2>
                {specification.length ? (
                  <div className="space-y-6">
                    {specification.map((spec, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <label className="font-bold text-blue-700">
                            {spec}
                          </label>
                          <button
                            type="button"
                            onClick={() => addSpecRow(spec)}
                            className="text-[10px] bg-gray-800 text-white px-2 py-1 rounded uppercase tracking-wider font-bold"
                          >
                            Add Row
                          </button>
                        </div>
                        {specValues[spec]?.map((row, i) => (
                          <div key={i} className="flex gap-2 mb-2">
                            <input
                              type="text"
                              value={row.key}
                              onChange={(e) =>
                                handleSpecChange(spec, i, "key", e.target.value)
                              }
                              placeholder="Feature"
                              className="p-2 border rounded flex-1 text-xs"
                            />
                            <input
                              type="text"
                              value={row.value}
                              onChange={(e) =>
                                handleSpecChange(
                                  spec,
                                  i,
                                  "value",
                                  e.target.value,
                                )
                              }
                              placeholder="Value"
                              className="p-2 border rounded flex-1 text-xs"
                            />
                            {specValues[spec].length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeSpecRow(spec, i)}
                                className="text-red-400 font-bold px-1"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-gray-400 border-2 border-dashed rounded-xl">
                    <p className="font-medium italic">
                      Please select a category to load specifications
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* FORM FOOTER */}
            <div className="bg-gray-100 px-6 py-4 flex justify-end gap-4 border-t">
              <button
                type="button"
                onClick={() => navigate("/products")}
                className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-gray-600 font-semibold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-10 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
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
