import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import api from "../Context Api/api.js";
import Cookies from "js-cookie";

export const DataContext = createContext();

export const ApiContext = ({ children }) => {
  const [productData, setProductData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [couponData, setCouponData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [adminData, setAdminData] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [transactonData, setTransactonData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const updateApi = async () => {
    const token = Cookies.get("token");

    // Reset private data only (Keep public data or reset all if you prefer)
    setAdminData([]);
    setStockData([]);
    setOrderData([]);
    setCategoryData([]);
    setCustomerData([]);
    setTransactonData([]);

    try {
      setLoading(true);
      setError(null);

      // 2. PRIVATE DATA (Only try if token exists)
      if (token) {
        const results = await Promise.allSettled([
          api.get("/user/admin/list"),
          api.get("/stock"),
          api.get("/order"),
          api.get("/category"),
          api.get("/product"),
          api.get("/coupon/admin/all"),
          api.get("/customer/list"),
          api.get("/transaction"),
        ]);

        // Safely set data for each promise result
        if (results[0].status === "fulfilled")
          setAdminData(results[0].value.data);
        if (results[1].status === "fulfilled")
          setStockData(results[1].value.data);
        if (results[2].status === "fulfilled")
          setOrderData(results[2].value.data);
        if (results[3].status === "fulfilled")
          setCategoryData(results[3].value.data);
        if (results[4].status === "fulfilled")
          setProductData(results[4].value.data);
        if (results[5].status === "fulfilled")
          setCouponData(results[5].value.data?.data || []);
        if (results[6].status === "fulfilled")
          setCustomerData(results[6].value.data.data);

        if (results[7].status === "fulfilled")
          setTransactonData(results[7].value.data.data);

        // Check if all failed (Optional: show error if user is logged in but can't see anything)
        const allRejected = results.every((res) => res.status === "rejected");
        if (allRejected)
          console.error(
            "All private API calls failed. Possible token expiration.",
          );
      }
    } catch (err) {
      console.error("General Context Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ CRITICAL FIX: Run whenever the cookie changes
  useEffect(() => {
    updateApi();
  }, [Cookies.get("token")]);


  
  const contextValue = {
    productData,
    categoryData,
    adminData,
    couponData,
    customerData,
    stockData,
    orderData,
    transactonData,
    loading,
    error,
    updateApi,
  };

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};
