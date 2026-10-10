
import axios from "axios";
import React, {
  createContext,
  useEffect,
  useState,
} from "react";
import api from "../Context Api/api.js";
import Cookies from "js-cookie";

export const DataContext = createContext();

// Sort products by newest first
const sortProductsLatestFirst = (products) => {
  if (!Array.isArray(products)) return [];

  const getProductTimestamp = (product) => {
    // Prefer product creation date
    const date =
      product?.createdAt ||
      product?.created_at ||
      product?.createdOn ||
      product?.created_on;

    if (date) {
      const timestamp = new Date(date).getTime();

      if (Number.isFinite(timestamp)) {
        return timestamp;
      }
    }

    // Fallback: MongoDB ObjectId creation timestamp
    if (
      typeof product?._id === "string" &&
      /^[a-f\d]{24}$/i.test(product._id)
    ) {
      return parseInt(product._id.substring(0, 8), 16) * 1000;
    }

    return 0;
  };

  return [...products].sort(
    (a, b) => getProductTimestamp(b) - getProductTimestamp(a),
  );
};

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

    // Reset private data
    setAdminData([]);
    setStockData([]);
    setOrderData([]);
    setCategoryData([]);
    setCustomerData([]);
    setTransactonData([]);

    try {
      setLoading(true);
      setError(null);

      // Fetch private data only when a token exists
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

        if (results[0].status === "fulfilled") {
          setAdminData(results[0].value.data);
        }

        if (results[1].status === "fulfilled") {
          setStockData(results[1].value.data);
        }

        if (results[2].status === "fulfilled") {
          setOrderData(results[2].value.data);
        }

        if (results[3].status === "fulfilled") {
          setCategoryData(results[3].value.data);
        }

        // Only productData is sorted newest first
        if (results[4].status === "fulfilled") {
          const responseData = results[4].value.data;

          // Support both an array response and { data: [...] }
          const products = Array.isArray(responseData)
            ? responseData
            : Array.isArray(responseData?.data)
              ? responseData.data
              : Array.isArray(responseData?.products)
                ? responseData.products
                : [];

          setProductData(sortProductsLatestFirst(products));
        } else {
          console.error(
            "Failed to fetch products:",
            results[4].reason,
          );
        }

        if (results[5].status === "fulfilled") {
          setCouponData(results[5].value.data?.data || []);
        }

        if (results[6].status === "fulfilled") {
          setCustomerData(results[6].value.data.data);
        }

        if (results[7].status === "fulfilled") {
          setTransactonData(results[7].value.data.data);
        }

        const allRejected = results.every(
          (result) => result.status === "rejected",
        );

        if (allRejected) {
          console.error(
            "All private API calls failed. Possible token expiration.",
          );
          setError("Failed to load data. Please check your session.");
        }
      }
    } catch (err) {
      console.error("General Context Error:", err);
      setError(err.message || "Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updateApi();
  }, []);

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
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};
