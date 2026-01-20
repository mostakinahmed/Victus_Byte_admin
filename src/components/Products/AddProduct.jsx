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
  const [formData, setFormData] = useState({
    name: "",
    brandName: "",
    price: { selling: "" }, // ✅ nested price
    stock: "",
    images: [""], // ✅ array for multiple images
    description: "",
    category: "",
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
  // GENERAL INPUT CHANGE
  // -------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Ignore images here
    if (name === "images") return;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // -------------------
  // PRICE INPUT CHANGE
  // -------------------
  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      price: { ...prev.price, [name]: Number(value) },
    }));
  };

  // -------------------
  // IMAGE HANDLERS
  // -------------------
  const addImageField = () => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, ""] }));
  };

  const updateImage = (index, value) => {
    const updated = [...formData.images];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, images: updated }));
  };

  const removeImage = (index) => {
    const updated = formData.images.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, images: updated }));
  };

  // -------------------
  // SPECIFICATIONS
  // -------------------
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
  // FORM SUBMIT
  // -------------------
  const handleSubmit = (e) => {
    e.preventDefault();

    // Clean spec values
    const cleanedSpecs = {};
    Object.keys(specValues).forEach((spec) => {
      const validRows = specValues[spec].filter(
        (row) => row.key.trim() !== "" && row.value.trim() !== "",
      );
      if (validRows.length) cleanedSpecs[spec] = validRows;
    });

    const finalData = {
      ...formData,
      images: formData.images.filter((img) => img.trim() !== ""), // remove empty
      specifications: cleanedSpecs,
    };

    console.log(finalData);
    saveData(finalData);
  };

  const saveData = async (data) => {
    try {
      // 1️⃣ Show processing alert
      Swal.fire({
        title: "Processing...",
        text: "Please wait while we save your product.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading(); // show spinner
        },
      });
      // 1️⃣ Save product
      const productRes = await axios.post(
        "https://api.victusbyte.com/api/product",
        data,
      );

      const { pID, sID } = productRes.data;
      updateApi(); // refresh context data

      axios
        .post("https://api.victusbyte.com/api/stock/create-stock", {
          pID,
          sID,
        })
        .then(() => {
          console.log("Stock created successfully");
          // 4️⃣ Close processing alert & show success
          Swal.close();
          Swal.fire({
            icon: "success",
            title: "Product Saved!",
            text: "Your product has been saved successfully.",
            timer: 1500,
            showConfirmButton: false,
          });
          resetForm();
        })
        .catch((err) => {
          console.error("Stock creation failed:", err);
        });
    } catch (error) {
      console.error("Error saving product:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save product. Please try again.",
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
    });
  };
  return (
    <div>
      <Navbar pageTitle="Add New Product" />

      <div className="mx-auto flex flex-col md:flex-row min-h-screen">
        <div className="relative w-full mx-auto bg-white shadow">
          <form onSubmit={handleSubmit}>
            <div className="gap-3 lg:flex rounded">
              {/* LEFT SECTION */}
              <div className="rounded lg:w-[800px] max-w-full">
                <h2 className="text-lg p-2 mb-2 rounded-t bg-blue-600 text-white font-semibold">
                  General Info
                </h2>

                <div className="px-2 space-y-4">
                  {/* Name */}
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Product Name"
                    className="p-2 border rounded w-full"
                    required
                  />

                  {/* Brand */}
                  <input
                    type="text"
                    name="brandName"
                    value={formData.brandName}
                    onChange={handleChange}
                    placeholder="Brand Name"
                    className="p-2 border rounded w-full"
                    required
                  />

                  {/* PRICE */}
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      name="selling"
                      value={formData.price.selling}
                      onChange={handlePriceChange}
                      placeholder="Selling Price"
                      className="p-2 border rounded"
                      required
                    />
                    {/* <input
                      type="number"
                      name="cost"
                      value={formData.price.cost}
                      onChange={handlePriceChange}
                      placeholder="Cost Price"
                      className="p-2 border rounded"
                      readOnly
                    />
                    <input
                      type="number"
                      name="discount"
                      value={formData.price.discount}
                      onChange={handlePriceChange}
                      placeholder="Discount"
                      className="p-2 border rounded"
                    /> */}
                  </div>

                  {/* STOCK */}
                  {/* <input
                    type="text"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="Stock Code"
                    className="p-2 border rounded w-full"
                  /> */}

                  {/* IMAGES */}
                  <div>
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={img}
                          onChange={(e) => updateImage(idx, e.target.value)}
                          placeholder={`Image URL ${idx + 1}`}
                          className="p-2 border rounded flex-1"
                        />
                        {formData.images.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="px-2 py-1 bg-red-500 text-white rounded"
                          >
                            −
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addImageField}
                      className="bg-gray-300 px-3 py-1 rounded"
                    >
                      + Add Image
                    </button>
                  </div>

                  {/* DESCRIPTION */}
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description"
                    className="p-2 border rounded w-full"
                  />
                </div>
                {/* CATEGORY */}
                <div className="px-2">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="p-2 border mt-4 rounded w-full bg-gray-200"
                    required
                  >
                    <option className="bg-gray-400" value="">
                      -- Select Category --
                    </option>
                    {!loading &&
                      categoryData.map((cat) => (
                        <option key={cat.catID} value={cat.catID}>
                          {cat.catID + " - " + cat.catName}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* RIGHT SECTION — SPECIFICATIONS */}
              <div className="rounded w-full mt-3 lg:mt-0">
                <h2 className="text-lg text-white py-2 px-2 rounded-t bg-blue-600 font-semibold">
                  Specification
                </h2>

                {specification.length ? (
                  <div className="py-2 space-y-3">
                    {specification.map((spec, idx) => (
                      <div key={idx} className="flex flex-col gap-1">
                        <div className="flex justify-between bg-gray-200 pl-2 mx-2">
                          <label>{spec}</label>
                          <button
                            type="button"
                            onClick={() => addSpecRow(spec)}
                            className="text-sm bg-gray-400 px-2 py-1"
                          >
                            + Add more
                          </button>
                        </div>

                        {specValues[spec]?.map((row, i) => (
                          <div
                            key={i}
                            className="lg:flex gap-3 mx-2 items-center"
                          >
                            <input
                              type="text"
                              value={row.key}
                              onChange={(e) =>
                                handleSpecChange(spec, i, "key", e.target.value)
                              }
                              placeholder="Key"
                              className="px-2 py-1 border rounded flex-1"
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
                              className="px-2 py-1 border rounded flex-1"
                            />
                            {specValues[spec].length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeSpecRow(spec, i)}
                                className="text-red-600 font-bold px-2"
                              >
                                −
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-72 bg-yellow-50">
                    <p className="text-yellow-700 font-semibold text-xl">
                      ⚠ Please select category ⚠
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="text-right flex justify-end px-2 mb-3 mt-3">
              <button
                type="button"
                onClick={() => navigate("/products")}
                className="px-3 py-1 bg-red-600 text-white rounded mr-2"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Save Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
