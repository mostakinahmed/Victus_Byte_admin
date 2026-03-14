import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  PlusCircle,
  Ticket,
  ListChecks,
  Trash2,
  Power,
  BarChart3,
} from "lucide-react";
import { FiGrid, FiActivity, FiLayers, FiZap } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "@/Context Api/api";
import Navbar from "@/components/Navbar";
import { DataContext } from "@/Context Api/ApiContext";

const Offer = () => {
  const { couponData, orderData, updateApi } = useContext(DataContext);

  const [coupons, setCoupons] = useState([]);
  const [orders, setOrders] = useState([]); // New state for order handshake
  const [loading, setLoading] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    couponID: "",
    value: "",
    minTK: "",
    status: true,
  });

  useEffect(() => {
    // Only set the data if it actually exists (Safety Check)
    if (couponData) {
      setCoupons(couponData);
    }

    if (orderData) {
      setOrders(orderData);
    }
  }, [couponData, orderData]);

  const getUsageCount = (couponID) => {
    return orders.filter((order) => order.coupon?.couponID === couponID).length;
  };

  // 3. Handle Create Coupon
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post("https://api.victusbyte.com/api/coupon/create", {
        ...newCoupon,
        couponID: newCoupon.couponID.toUpperCase().trim(),
      });
      toast.success("Coupon created successfully!");
      setNewCoupon({ couponID: "", value: "", minTK: "", status: true });
      updateApi(); // Refresh both lists
    } catch (err) {
      toast.error(err.response?.data?.message || "Creation failed");
    } finally {
      setLoading(false);
    }
  };

  // 4. Toggle Status (Active/Inactive)
  // const toggleStatus = async (id, currentStatus) => {
  //   try {
  //     await axios.patch(`https://api.victusbyte.com/api/coupon/toggle/${id}`, {
  //       status: !currentStatus,
  //     });
  //     toast.success(`Coupon ${!currentStatus ? "Activated" : "Disabled"}`);
  //     updateApi();
  //   } catch (err) {
  //     toast.error("Update failed");
  //   }
  // };

  const toggleStatus = async (id, currentStatus) => {
    try {
      // Adding withCredentials if your backend uses sessions/cookies
      await axios.post(
        `https://api.victusbyte.com/api/coupon/toggle/${id}`,
        { status: !currentStatus },
        { withCredentials: true },
      );
      toast.success(`Coupon ${!currentStatus ? "Activated" : "Disabled"}`);
      updateApi();
    } catch (err) {
      // Better error logging to see what the server is saying
      console.error("CORS or Server Error:", err.response?.data || err.message);
      toast.error("Update failed");
    }
  };

  return (
    <div className=" mt-13 md:mt-0  font-inter">
      <Navbar pageTitle={"Offer & Coupon"} />

      {/* <Ticket className="text-orange-500" size={32} /> */}
      {/* TOP SECTION: Create & Active Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Create Coupon Form */}
        <div className="lg:col-span-2 bg-white p-6 rounded border border-slate-200 transition-all duration-300">
          <h2 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-3 uppercase tracking-widest">
            <div className="p-2 bg-[#1976d2]/10 text-[#1976d2] rounded-lg">
              <PlusCircle size={18} />
            </div>
            Create New Coupon
          </h2>

          <form
            onSubmit={handleCreate}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 items-end"
          >
            {/* Coupon ID */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-medium text-slate-600 uppercase tracking-widest ml-1">
                Coupon ID
              </label>
              <input
                type="text"
                placeholder="VICTUS500"
                className="px-3 py-2.5 border border-slate-400 rounded-xl bg-slate-50/50 focus:ring-4 focus:ring-[#1976d2]/10 focus:border-[#1976d2] outline-none uppercase text-xs font-bold transition-all placeholder:text-slate-300"
                value={newCoupon.couponID}
                onChange={(e) =>
                  setNewCoupon({ ...newCoupon, couponID: e.target.value })
                }
                required
              />
            </div>

            {/* Value */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-medium text-slate-600 uppercase tracking-widest ml-1">
                Value (TK)
              </label>
              <input
                type="number"
                placeholder="500"
                className="px-3 py-2.5 border border-slate-400 rounded-xl bg-slate-50/50 focus:ring-4 focus:ring-[#1976d2]/10 focus:border-[#1976d2] outline-none text-xs font-bold transition-all placeholder:text-slate-300"
                value={newCoupon.value}
                onChange={(e) =>
                  setNewCoupon({ ...newCoupon, value: e.target.value })
                }
                required
              />
            </div>

            {/* Min Purchase */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-medium text-slate-600  uppercase tracking-widest ml-1">
                Min Purchase
              </label>
              <input
                type="number"
                placeholder="2000"
                className="px-3 py-2.5 border border-slate-400 rounded-xl bg-slate-50/50 focus:ring-4 focus:ring-[#1976d2]/10 focus:border-[#1976d2] outline-none text-xs font-bold transition-all placeholder:text-slate-300"
                value={newCoupon.minTK}
                onChange={(e) =>
                  setNewCoupon({ ...newCoupon, minTK: e.target.value })
                }
                required
              />
            </div>

            {/* Submit Button */}
            <button
              disabled={loading}
              className="bg-slate-900 cursor-pointer hover:bg-[#1976d2] text-white text-[10px] font-black uppercase tracking-widest h-[42px] rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50"
            >
              {loading ? "Saving...." : "Save Offer"}
            </button>
          </form>
        </div>
        {/* Mini Active List Summary */}
        <div className="bg-slate-800 text-white p-6 rounded">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-green-400">
            <ListChecks size={20} /> Active Now
          </h2>
          <div className="space-y-2 max-h-[164px] px-7 overflow-y-auto scroll-auto ">
            {coupons
              .filter((c) => c.status)
              .map((c) => (
                <div
                  key={c._id}
                  className="flex justify-between items-center border-b border-slate-700 pb-2"
                >
                  <span className="font-mono text-orange-400 font-bold tracking-wider">
                    {c.couponID}
                  </span>
                  <span className="text-sm font-bold">৳{c.value} OFF</span>
                </div>
              ))}
            {coupons.filter((c) => c.status).length === 0 && (
              <p className="text-slate-500 text-sm">No active coupons</p>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: Full Table with Usage Handshake */}
      <div className="bg-white rounded  border border-slate-200 overflow-hidden">
        <div className="bg-[#1976d2] flex justify-between border-b border-slate-100 px-5 py-3">
          <h3 className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-2">
            <FiZap className="" /> Coupon List
          </h3>
          <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
            Total: {coupons.length}
          </span>
        </div>

        <div className="overflow-x-auto pb-5">
          <table className="w-full text-left border-collapse pb-5">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">
                  Coupon ID
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">
                  Discount
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">
                  Requirement
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center">
                  Uses
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">
                  Status
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => {
                const usage = getUsageCount(coupon.couponID);
                return (
                  <tr
                    key={coupon._id}
                    className="border-b  border-slate-100 hover:bg-slate-100 transition-colors group"
                  >
                    <td className="px-4 font-mono font-black text-slate-800">
                      {coupon.couponID}
                    </td>
                    <td className="px-4 font-medium text-green-600">
                      ৳{coupon.value}
                    </td>
                    <td className="px-4 text-slate-700 font-medium">
                      ৳{coupon.minTK}
                    </td>

                    {/* NEW: Usage Count Logic */}
                    <td className="px-4 text-center">
                      <div className="flex flex-col items-center">
                        <span
                          className={`text-lg font-black ${usage > 0 ? "text-orange-500" : "text-slate-300"}`}
                        >
                          {usage}
                        </span>
                        <span className="text-[9px] text-slate-400 font-medium uppercase">
                          Orders
                        </span>
                      </div>
                    </td>

                    <td className="px-4">
                      <span
                        className={`px-3 py-1  rounded-full text-[10px] font-black uppercase ${
                          coupon.status
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-red-100 text-red-700 border border-red-200"
                        }`}
                      >
                        {coupon.status ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="px-4">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() =>
                            toggleStatus(coupon._id, coupon.status)
                          }
                          className={`p-2 rounded-lg transition-all ${
                            coupon.status
                              ? "text-slate-400 hover:text-red-500 hover:bg-red-50"
                              : "text-green-500 hover:bg-green-50"
                          }`}
                        >
                          <Power size={18} />
                        </button>
                        <button className="text-slate-300 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {coupons.length === 0 && (
            <div className="p-10 text-center text-slate-400 font-bold">
              No coupons found in database.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Offer;
