import React, { useContext, useState, useEffect } from "react";
import Navbar from "../Navbar";
import { DataContext } from "@/Context Api/ApiContext";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import api from "@/Context Api/api";
import { FiSave } from "react-icons/fi";

const UpdateProduct = () => {
  const { updateApi, categoryData, loading } = useContext(DataContext);
  const navigate = useNavigate();
  const location = useLocation();

  const product = location.state?.product;

  // --- STATE FOR DYNAMIC SPECS ---
  const [customSpecs, setCustomSpecs] = useState([
    { groupName: "", fields: [{ key: "", value: "" }] },
  ]);

  const [keywordInput, setKeywordInput] = useState("");
  const [colorInput, setKeywordColorInput] = useState("");
  const [folderId, setFolderId] = useState();
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    brandName: "",
    price: { selling: "" },
    images: [],
    description: "",
    category: "",
    keywords: [],
    colors: [],
  });

  // --- INITIALIZE FORM WITH EXISTING PRODUCT DATA ---
  useEffect(() => {
    if (!product) {
      navigate("/products");
      return;
    }

    setFormData({
      name: product.name || "",
      brandName: product.brandName || "",
      price: { selling: product.price?.selling || "" },
      images: product.images || [],
      description: product.description || "",
      category: product.category || "",
      keywords: product.keywords || [],
      colors: product.colors || [],
    });

    setFolderId(product.folderId || "");

    // Map existing specifications object back into array format for dynamic groups
    if (product.specifications) {
      const specArray = Object.keys(product.specifications).map((groupKey) => ({
        groupName: groupKey,
        fields: product.specifications[groupKey].map((f) => ({
          key: f.key,
          value: f.value,
        })),
      }));
      if (specArray.length > 0) {
        setCustomSpecs(specArray);
      }
    }
  }, [product, navigate]);

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
  // IMAGE UPLOAD & REMOVAL HANDLERS
  // -------------------
  const imageUrl = product?.images[0];
  // Split by "/upload/image/" and take the next part, then split by "/"
  const parts = imageUrl.split("/upload/image/");
  const fId = parts[1] ? parts[1].split("/")[0] : "";

  const handleImageUpload = async (e) => {
    setFolderId(fId);
    // Check file sizes (Max 500KB per image)
    const MAX_SIZE = 500 * 1024;
    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i];
      if (file.size > MAX_SIZE) {
        alert("Image exceeds 500KB! Please choose a smaller image.");
        e.target.value = "";
        return;
      }
    }

    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const uploadData = new FormData();
    files.forEach((file) => {
      uploadData.append("images", file);
    });

    try {
      setUploading(true);
      Swal.fire({
        title: "Uploading images...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const uploadResponse = await fetch(
        `https://api.victusbyte.com/api/upload/images?folderId=${encodeURIComponent(folderId)}`,
        {
          method: "POST",
          body: uploadData,
          credentials: "include",
        },
      );

      if (!uploadResponse.ok) {
        throw new Error("Image upload failed");
      }

      const uploadResult = await uploadResponse.json();
      const newImageUrls = uploadResult.images;

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImageUrls],
      }));

      Swal.close();
      Swal.fire({
        icon: "success",
        title: "Images Uploaded!",
        timer: 1000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Image upload error:", error);
      Swal.fire(
        "Upload Failed",
        "Unable to upload product images. Please try again.",
        "error",
      );
    } finally {
      e.target.value = "";
      setUploading(false);
    }
  };

  const removeImage = async (index) => {
    // Grab the image URL using the current index
    const imageUrlToDelete = formData.images[index];

    try {
      const result = await Swal.fire({
        title: "Delete image?",
        text: "This will remove the image file from server storage.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });

      if (!result.isConfirmed) return;

      Swal.fire({
        title: "Deleting...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      // Call backend delete route
      await api.delete(`/product/delete-image`, {
        data: { imageUrl: imageUrlToDelete },
      });

      // 🛑 FIX: Use prev.images to guarantee we filter the freshest state array
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        timer: 1000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Delete image error:", err);
      // Fallback: still remove from view
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
      Swal.close();
    }
  };
  // -------------------
  // SUBMIT UPDATE LOGIC
  // -------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.keywords.length === 0) {
      return Swal.fire(
        "Required",
        "Please add at least one Search Keyword",
        "warning",
      );
    }

    if (formData.images.length === 0) {
      return Swal.fire(
        "Required",
        "Please upload at least one product image",
        "warning",
      );
    }

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
      folderId,
      specifications: formattedSpecs,
    };

    try {
      Swal.fire({
        title: "Updating Product...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      await api.post(`/product/update/${product.pID}`, finalData);

      updateApi();

      Swal.fire({
        icon: "success",
        title: "Product Updated Successfully!",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate("/products");
    } catch (err) {
      console.error("Update error:", err);
      Swal.fire({ icon: "error", title: "Error Updating Product" });
    }
  };

  return (
    <div className="min-h-screen pb-10 mt-12 md:mt-0">
      <Navbar pageTitle={`Edit Product: ${formData.name || "Modify"}`} />

      <div className="mx-auto max-w-[1600px]">
        <div className="relative w-full mx-auto bg-white rounded overflow-hidden border border-gray-200">
          <form onSubmit={handleSubmit}>
            <div className="lg:flex">
              {/* LEFT: General Info & Attributes */}
              <div className="lg:w-[550px] border-r border-gray-100 md:p-6 p-2 md:space-y-6 space-y-2">
                <h2 className="md:text-xl font-bold text-gray-800 border-b pb-2">
                  General Information
                </h2>

                <div className="md:space-y-4 space-y-2">
                  <input
                    type="text"
                    placeholder="Product Name"
                    className="p-2 border rounded w-full focus:outline-none"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Brand Name"
                    className="p-2 border rounded w-full focus:outline-none"
                    value={formData.brandName}
                    onChange={(e) =>
                      setFormData({ ...formData, brandName: e.target.value })
                    }
                    required
                  />

                  <div
                    className="p-3 rounded-lg border"
                    style={{
                      backgroundColor: "#FDF2EC",
                      borderColor: "#F8CDB8",
                    }}
                  >
                    <label
                      className="text-xs font-bold uppercase"
                      style={{ color: "#F66107" }}
                    >
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
                      className="mt-1 p-2 border rounded w-full font-bold bg-white focus:outline-none"
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
                        placeholder="powerbank"
                        className="flex-1 p-2 border rounded text-sm outline-none"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          addTag("keywords", keywordInput, setKeywordInput)
                        }
                        className="text-white px-4 py-2 rounded text-sm font-bold transition-opacity hover:opacity-90 cursor-pointer"
                        style={{ backgroundColor: "#F66107" }}
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.keywords.map((word, idx) => (
                        <span
                          key={idx}
                          className="bg-white border px-2 py-1 rounded text-xs font-medium flex items-center gap-1 shadow-sm"
                          style={{ borderColor: "#F8CDB8", color: "#D35000" }}
                        >
                          {word}{" "}
                          <button
                            type="button"
                            onClick={() => removeTag("keywords", idx)}
                            className="text-red-400 font-bold ml-1 cursor-pointer"
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
                        placeholder="Midnight Black"
                        className="flex-1 p-2 border rounded text-sm outline-slate-500"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          addTag("colors", colorInput, setKeywordColorInput)
                        }
                        className="bg-black text-white px-4 py-2 rounded text-sm font-bold cursor-pointer"
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
                            className="text-red-400 font-bold ml-1 cursor-pointer"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* IMAGES & FOLDER ID */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                        Image Gallery (Max 500KB)
                      </label>
                      <input
                        className="w-40 border px-2 py-1 opacity-70 cursor-not-allowed border-slate-300 outline-none bg-slate-200 rounded text-sm font-medium text-slate-700"
                        type="text"
                        disabled
                        placeholder="Folder ID"
                        value={folderId || fId}
                        onChange={(e) => setFolderId(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {formData.images.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative border rounded-lg overflow-hidden bg-gray-50 aspect-square shadow-sm"
                        >
                          <img
                            src={img}
                            alt={`Product ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />

                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white text-lg flex items-center justify-center hover:bg-red-600 transition cursor-pointer shadow-md"
                          >
                            ×
                          </button>

                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-2 py-1">
                            Image {idx + 1}
                          </div>
                        </div>
                      ))}

                      {/* Add Image Uploader */}
                      <label
                        className={`aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#F66107] transition ${uploading ? "opacity-50 pointer-events-none" : ""}`}
                      >
                        <span className="text-3xl text-gray-400">+</span>
                        <span className="text-xs text-gray-500 mt-1 font-medium">
                          Add Image
                        </span>

                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Short Description..."
                    className="p-3 border rounded w-full h-24 text-sm outline-none"
                    required
                  />

                  <select
                    name="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="p-3 border rounded w-full bg-slate-100 font-semibold cursor-pointer"
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
              <div className="flex-1 md:p-6 p-2">
                <div className="flex justify-between items-center mb-6">
                  <h2
                    className="md:text-xl line-clamp-1 font-bold text-gray-800 border-b-2 pb-1"
                    style={{ borderColor: "#F66107" }}
                  >
                    Specifications Dynamic
                  </h2>
                  <button
                    type="button"
                    onClick={addSpecGroup}
                    className="bg-green-600 ml-2 text-white md:px-5 px-4 py-2 rounded-md hover:bg-green-700 shadow-lg shadow-green-100 cursor-pointer text-sm font-bold"
                  >
                    Add Section
                  </button>
                </div>

                <div className="space-y-6 md:w-2/3">
                  {customSpecs.map((group, gIdx) => (
                    <div
                      key={gIdx}
                      className="bg-slate-50 border border-gray-200 rounded md:p-5 p-2 relative"
                    >
                      <button
                        type="button"
                        onClick={() => removeSpecGroup(gIdx)}
                        className="absolute top-3 right-3 cursor-pointer text-red-500 hover:text-red-600 text-sm font-bold bg-red-50 px-2 py-1 rounded"
                      >
                        Delete
                      </button>

                      <div className="mb-4 pr-16">
                        <label className="text-[11px] text-slate-600 font-medium uppercase tracking-wide">
                          Section Title
                        </label>
                        <input
                          type="text"
                          value={group.groupName}
                          onChange={(e) =>
                            updateGroupName(gIdx, e.target.value)
                          }
                          placeholder="Key Feature"
                          className="w-full p-1.5 mt-1 px-2 bg-white border rounded font-medium text-gray-800 outline-none"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        {group.fields.map((field, fIdx) => (
                          <div
                            key={fIdx}
                            className="flex flex-col md:flex-row gap-2 items-center"
                          >
                            <input
                              type="text"
                              placeholder="key"
                              value={field.key}
                              onChange={(e) =>
                                updateField(gIdx, fIdx, "key", e.target.value)
                              }
                              className="flex-1 p-1.5 w-full bg-white border rounded text-sm outline-none"
                              required
                            />
                            <input
                              type="text"
                              placeholder="value"
                              value={field.value}
                              onChange={(e) =>
                                updateField(gIdx, fIdx, "value", e.target.value)
                              }
                              className="flex-1 p-1.5 w-full border bg-white rounded text-sm outline-none"
                              required
                            />
                            {group.fields.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeFieldRow(gIdx, fIdx)}
                                className="text-red-400 cursor-pointer font-bold px-1 text-lg"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addFieldRow(gIdx)}
                          className="text-[11px] cursor-pointer px-3 py-1 rounded font-bold mt-2"
                          style={{
                            backgroundColor: "#FDF2EC",
                            color: "#F66107",
                          }}
                        >
                          + Add Row
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* FORM FOOTER */}
            <div className="bg-gray-100 md:px-6 px-2 py-4 flex justify-end gap-4 border-t">
              <button
                type="button"
                onClick={() => navigate("/products")}
                className="px-8 py-2 bg-white border cursor-pointer border-gray-400 rounded-lg text-gray-700 font-bold hover:bg-gray-50 transition-all text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="md:px-12 px-3 py-2 text-white rounded-lg font-bold transition-all transform active:scale-95 shadow flex items-center gap-2 cursor-pointer text-sm"
                style={{ backgroundColor: "#F66107" }}
              >
                <FiSave size={16} /> Update Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;
