// context/ApiContext.js
import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const DataContext = createContext();

export const ApiContext = ({ children }) => {
  const [productData, setProductData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [adminData, setAdminData] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Function to manually refresh API data when needed
  const updateApi = async () => {
    try {
      setLoading(true);
      const [productRes, categoryRes, adminRes, stockRes, orderRes] =
        await Promise.all([
          axios.get("https://api.victusbyte.com/api/product"),
          axios.get("https://api.victusbyte.com/api/category"),
          axios.get("https://api.victusbyte.com/api/user/admin/list"),
          axios.get("https://api.victusbyte.com/api/stock"),
          axios.get("https://api.victusbyte.com/api/order"),
        ]);

      setProductData(productRes.data);
      setCategoryData(categoryRes.data);
      setAdminData(adminRes.data);
      setStockData(stockRes.data);
      setOrderData(orderRes.data);
    } catch (err) {
      console.error("API fetch error:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Automatically fetch once when the component mounts
  useEffect(() => {
    updateApi();
  }, []);

  const contextValue = {
    productData,
    categoryData,
    adminData,
    stockData,
    orderData,
    loading,
    error,
    updateApi, // expose for manual refresh (like after adding product)
  };

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};
