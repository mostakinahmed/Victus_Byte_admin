import React, { useContext, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ChevronDown } from "lucide-react";
import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "@/Context Api/ApiContext";
import axios from "axios";
import { FaSpinner, FaCheckCircle, FaRegCopy } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

const OrderList = () => {
  const { productData, orderData, updateApi } = useContext(DataContext);

  const navigate = useNavigate();
  const [filter, setFilter] = useState({ orderId: "", pid: "" });
  const [selectedStatus, setSelectedStatus] = useState("All Orders");
  const [statusOpen, setStatusOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [showDetails, setShowDetails] = useState(null);
  const [actionBtn, setActionBtn] = useState(null);
  const [skuInputs, setSkuInputs] = useState({});
  const [currentOrder, setCurrentOrder] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const statuses = [
    "All Orders",
    "Pending",
    "Confirmed",
    "Shipped",
    "Completed",
    "Cancelled",
  ];

  //for highlight selection
  const handleRowClick = (order) => {
    setSelectedOrderId(order.order_id);
    handleClickOrder(order);
  };

  // Filter orders based on status, date, and search
  const filteredOrders = orderData.filter((order) => {
    const statusMatch =
      selectedStatus === "All Orders" || order.status === selectedStatus;

    const dateMatch = startDate
      ? new Date(order.order_date).toDateString() === startDate.toDateString()
      : true;

    const orderIdMatch = filter.orderId
      ? order.order_id.toLowerCase().includes(filter.orderId.toLowerCase())
      : true;

    return statusMatch && dateMatch && orderIdMatch;
  });

  //filter product data for showing image
  let data = [];
  if (showDetails && showDetails.items) {
    data = showDetails.items.map((item) =>
      productData.find((p) => p.pID === item.product_id)
    );
  }

  console.log(data);
  

  //handle click order
  const handleClickOrder = (order) => {
    setShowDetails(order);

    if (order.status === "Pending") {
      setActionBtn("Confirmed");
    } else if (order.status === "Confirmed") {
      setActionBtn("Shipped");
    } else if (order.status === "Shipped") {
      setActionBtn("Delivered");
    } else if (order.status === "Delivered") {
      setActionBtn("Completed");
    } else {
      setActionBtn(null);
    }
  };

  // Reset all filters
  const handleReset = () => {
    setSelectedStatus("All Orders");
    setStartDate(null);
    setFilter({ orderId: "", pid: "" });
    setShowDetails(null);
    setSelectedOrderId(null);
  };

  // handle SKU input changes
  const handleSkuChange = (product_id, value) => {
    setSkuInputs((prev) => ({
      ...prev,
      [product_id]: value,
    }));
  };

  //backend handle
  const submitBtn = async (e) => {
    e.preventDefault();

    let skuArray = [];

    if (actionBtn === "Shipped") {
      // Convert skuInputs object to array of { product_id, skuID }
      skuArray = Object.entries(skuInputs)
        .filter(([_, skuID]) => skuID && skuID.trim() !== "") // remove empty SKUs
        .map(([product_id, skuID]) => ({
          product_id,
          skuID: skuID.trim(),
        }));

      if (skuArray.length === 0) {
        // No SKU provided, handle as needed
        alert("Please enter  SKU before shipping!");
        return;
      }
    }

    MySwal.fire({
      title: (
        <p className="text-xl font-semibold text-blue-600">Processing...</p>
      ),
      html: (
        <p className="text-gray-600">Please wait while we update your order.</p>
      ),
      allowOutsideClick: false,
      didOpen: () => {
        MySwal.showLoading();
      },
      customClass: {
        popup: "w-[300px] h-[200px] p-4", // 👈 controls alert size
        title: "text-lg font-bold",
        htmlContainer: "text-sm text-gray-600",
      },
    });

    const orderId = showDetails.order_id;
    let updatedData = {};
    //MAKE DATA
    if (actionBtn === "Confirmed") {
      updatedData = {
        status: "Confirmed",
      };
    } else if (actionBtn === "Shipped") {
      updatedData = {
        status: "Shipped",
        items: skuArray,
      };
    } else if (actionBtn === "Delivered") {
      updatedData = {
        status: "Completed",
        payment: {
          status: "Paid",
        },
      };
    }

    const res = await axios.patch(
      `https://fabribuzz.onrender.com/api/order/update/${orderId}`,
      updatedData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    //update api
    updateApi();

    // Update success message
    MySwal.hideLoading();
    MySwal.update({
      icon: "success",
      title: (
        <p className="text-green-600 text-xl font-bold">Order {actionBtn} ✅</p>
      ),
      html: (
        <p className="text-gray-700">
          Order <b>#{showDetails.order_id || "123"}</b> has been successfully
          updated!
        </p>
      ),
      showConfirmButton: true,
      confirmButtonText: "OK",
      customClass: {
        confirmButton:
          "bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg",
      },
      buttonsStyling: false,
    });

    setShowDetails(null);
  };

  return (
    <div className="bg-white min-h-screen p-3">
      {/* Filters */}
      <div className="w-full flex flex-col gap-3 lg:flex-row lg:items-center mb-3">
        {/* Status Dropdown */}
        <div className="relative w-full lg:w-52">
          <button
            onClick={() => setStatusOpen(!statusOpen)}
            className="w-full flex justify-between items-center bg-white border border-gray-300 rounded px-4 py-1 text-gray-700 font-medium hover:shadow-md transition-all"
          >
            {selectedStatus}
            <ChevronDown
              className={`w-5 h-5 transition-transform  ${
                statusOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          {statusOpen && (
            <div className="absolute w-full lg:w-52 mt-2 bg-white border border-gray-400 rounded shadow-lg overflow-hidden z-10">
              {statuses.map((status) => (
                <div
                  key={status}
                  onClick={() => {
                    setSelectedStatus(status);
                    setStatusOpen(false);
                  }}
                  className={`px-4 py-1 cursor-pointer hover:bg-gray-200 transition ${
                    selectedStatus === status
                      ? "bg-gray-100 text-blue-600 font-semibold"
                      : ""
                  }`}
                >
                  {status}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Calendar */}

        <div className="w-full lg:w-55 relative">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            placeholderText="Select Date"
            className="w-full px-4 py-1 border border-gray-300 bg-white rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
            dateFormat="dd/MM/yyyy"
          />
          <Calendar className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Order ID Search */}
        <div className="w-full lg:w-55">
          <input
            type="text"
            placeholder="Order ID"
            value={filter.orderId}
            onChange={(e) => setFilter({ ...filter, orderId: e.target.value })}
            className="w-full px-4 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Reset Button */}
        <div className="w-full ml-1 lg:w-auto">
          <button
            onClick={handleReset}
            className="w-full lg:w-auto px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Reset All
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="md:flex gap-3">
        {/* left side */}
        <div className="lg:w-3/4 overflow-x-auto whitespace-nowrap mb-5 lg:mb-0 ">
          <div className="overflow-x-auto w-full">
            <table className="min-w-full table-fixed text-sm text-left border border-gray-200">
              <thead className="bg-blue-200">
                <tr className="">
                  <th className="px-4 py-2 border-b border-gray-300 text-gray-800 font-semibold">
                    Order ID
                  </th>
                  <th className="px-4 py-2 border-b border-gray-300 text-gray-800 font-semibold">
                    Customer Name
                  </th>
                  {/* <th className="px-4 py-2 border-b border-gray-300 text-gray-800 font-semibold">
                    Total Amount
                  </th> */}
                  <th className="px-4 py-2 border-b border-gray-300 text-gray-800 font-semibold">
                    Order Date
                  </th>
                  <th className="px-4 py-2 border-b border-gray-300 text-gray-800 font-semibold">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.length > 0 ? (
                  [...filteredOrders].reverse().map((order) => (
                    <tr
                      key={order.order_id}
                      onClick={() => handleRowClick(order)}
                      className={`cursor-pointer transition-colors duration-150 ${
                        selectedOrderId === order.order_id
                          ? "bg-blue-100"
                          : "hover:bg-gray-200"
                      }`}
                    >
                      <td className="px-4 py-2 border-b">{order.order_id}</td>
                      <td className="px-4 py-2 border-b">
                        {order.shipping_address.recipient_name}
                      </td>

                      <td className="px-4 py-2 border-b">{order.order_date}</td>
                      <td className="px-4 py-1 border-b">
                        <span
                          className={`px-2 py-1 rounded-full font-semibold text-white ${
                            order.status === "Pending"
                              ? "bg-yellow-500"
                              : order.status === "Confirmed"
                              ? "bg-blue-500"
                              : order.status === "Shipped"
                              ? "bg-purple-500"
                              : order.status === "Delivered"
                              ? "bg-green-500"
                              : order.status === "Cancelled"
                              ? "bg-red-500"
                              : "bg-gray-400"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center px-4 py-6 text-gray-500"
                    >
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* right side */}
        <div className=" w-full h-50  rounded">
          {showDetails ? (
            <h1 className="bg-green-200 p-[5px] text-center text-lg font-bold">
              Order Details -{" "}
              <span className="bg-white rounded-2xl px-1 text-black">
                {showDetails.order_id}
              </span>
            </h1>
          ) : (
            <h1 className="bg-green-200 p-[5px] text-center text-lg font-bold">
              Order Details
            </h1>
          )}

          {showDetails ? (
            <div className=" mx-auto relative">
              {/* Loader Overlay */}

              {/* Success Overlay */}

              {/* 1. Product Info Section */}
              <div className="bg-white border-l">
                {/* header */}
                <div className="flex border-b justify-between">
                  <h3 className="text-xl font-semibold mt-4 mx-4">
                    Product Info
                  </h3>
                  <h3
                    className={`lg:text-2xl font-bold rounded-xl px-3 my-2 text-white ${
                      showDetails.status === "Pending"
                        ? "bg-yellow-500"
                        : showDetails.status === "Confirmed"
                        ? "bg-blue-500"
                        : showDetails.status === "Shipped"
                        ? "bg-purple-500"
                        : showDetails.status === "Delivered"
                        ? "bg-green-500"
                        : showDetails.status === "Cancelled"
                        ? "bg-red-500"
                        : "bg-gray-400"
                    }`}
                  >
                    {showDetails.status}
                  </h3>
                </div>

                {/* Product multiple */}
                {showDetails.items.map((item, inx) => (
                  <div className="lg:flex w-full flex-col lg:flex-row p-4 rounded space-x-4 ">
                    <img
                      src={data[inx]?.images[0]}
                      alt="Product"
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1 space-y-1">
                      <p>
                        <span className="font-medium">Product ID:</span>
                        {item.product_id}
                      </p>

                      <p>
                        <span className="font-medium">Name:</span>{" "}
                        {item.product_name}
                      </p>

                      <p>
                        Comment:{" "}
                        <span className="font-medium bg-yellow-300 rounded-xl px-2">
                          {item.product_comments}
                        </span>{" "}
                      </p>
                    </div>
                    <div className="w-1/4">
                      <p>
                        <span className="font-medium">Quantity:</span> 1
                      </p>
                      <p>
                        <span className="font-medium">Price:</span>{" "}
                        {item.product_price}
                      </p>

                      {showDetails.status === "Confirmed" ? (
                        <div className="lg:flex w-full items-center gap-2">
                          <span className="mr- font-medium">SKUID:</span>
                          <input
                            type="text"
                            value={skuInputs[item.product_id] || ""} // controlled value
                            onChange={(e) =>
                              handleSkuChange(item.product_id, e.target.value)
                            }
                            className="bg-gray-50 lg:w-full text-lg px-2 border border-green-600 rounded"
                            required
                            placeholder="input sku id"
                          />
                        </div>
                      ) : (
                        <p>
                          SKU ID:{" "}
                          {item.skuID ? (
                            <span className="font-bold bg-green-300 px-2 rounded-3xl">
                              {item.skuID}
                            </span>
                          ) : (
                            <span className=" bg-red-200 px-2 rounded-3xl">
                              Not assigned
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* 2. Customer Info Section */}
              <div className="bg-white w-full p-4 mr-1 space-y-1 border-l">
                <h3 className="text-xl font-semibold border-b pb-1 mb-2 -mt-4">
                  Customer Info
                </h3>
                <div className="flex w-full flex-col lg:flex-row justify-between">
                  <div className="">
                    <p>
                      Customer ID:{" "}
                      {showDetails.customer_id ? (
                        <span className="font-medium">
                          {showDetails.customer_id}
                        </span>
                      ) : (
                        <span className="font-medium">Not Register</span>
                      )}
                    </p>
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {showDetails.shipping_address.recipient_name}
                    </p>
                    <p>
                      Phone:
                      <span className="font-medium bg-yellow-300 ml-1 px-2 rounded-xl ">
                        {showDetails.shipping_address.phone}
                      </span>
                    </p>
                  </div>
                  <div className="w-1/4">
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {showDetails.shipping_address.email}
                    </p>
                    <p>
                      <span className="font-medium">Discount:</span>{" "}
                      {showDetails.discount}
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. Payment & Address Section */}
              <div className="bg-white p-4 border-l -mt-5 space-y-1">
                <h3 className="text-xl font-semibold border-b pb-2 mb-2">
                  Payment & Shipping
                </h3>

                <div className="flex w-full flex-col lg:flex-row justify-between mr-6">
                  <div className="">
                    <p>
                      <span className="font-medium">Shipping Address:</span>{" "}
                      {showDetails.shipping_address.address_line1}
                    </p>
                    <p>
                      <span className="font-medium">Shipping Cost:</span>{" "}
                      {showDetails.shipping_cost}
                    </p>
                  </div>
                  <div className="w-1/4">
                    <p>
                      <span className="font-medium">Payment Method:</span>{" "}
                      {showDetails.payment.method}
                    </p>
                    <p>
                      <span className="font-medium">Payment Status:</span>{" "}
                      {showDetails.payment.status}
                    </p>
                  </div>
                </div>

                <div className="lg:flex justify-between -mt-2">
                  <div>
                    <p className="font-semibold text-lg mt-2 lg:-mb-3">
                      Total Amount: {showDetails.total_amount}
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold text-lg mt-2 lg:-mb-3">
                      Date: {showDetails.order_date}
                    </p>
                  </div>
                </div>
              </div>
              <div className="border-t flex pt-3 pb-3 lg:pb-0 gap-3 justify-end">
                <button className="bg-red-500 text-lg rounded hover:bg-red-700 text-white p-1 px-3">
                  cancel Order
                </button>
                {actionBtn && (
                  <button
                    type="button"
                    onClick={submitBtn}
                    className="bg-green-500 text-lg rounded hover:bg-green-700 text-white p-1 px-3"
                  >
                    {actionBtn}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center bg-yellow-100 h-full border border-yellow-300 text-yellow-800 rounded p-6 mt-10 shadow-sm">
              <h1 className="text-lg font-semibold mb-1">
                ⚠️ No Order Selected
              </h1>
              <p className="text-sm text-yellow-700">
                Please choose an order to view its details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
//order
export default OrderList;
