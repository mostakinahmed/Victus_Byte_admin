import { useContext, useState } from "react";
import { AuthContext } from "../../Context Api/AuthContext.jsx";
import { FaSpinner, FaCheckCircle } from "react-icons/fa";
import axios from "axios";
import { DataContext } from "@/Context Api/ApiContext.jsx";
import {
  FiUser,
  FiAtSign,
  FiMail,
  FiPhone,
  FiLock,
  FiImage,
  FiShield,
  FiActivity,
  FiArrowLeft,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

export default function UpdateAdmin({ back, user }) {
  const { updateApi, adminData } = useContext(DataContext);
  const [loading, setLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false); // new success state

  const [formData, setFormData] = useState({
    fullName: user.fullName || "",
    userName: user.userName || "",
    email: user.email || "",
    images: user.images || "",
    phone: user.phone || "",
    password: user.password || "",
    role: user.role || "Admin",
    status: user.status !== undefined ? user.status : true,
  });
  const [isConfirmed, setIsConfirmed] = useState(false);

  // handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "status") {
      // convert string to boolean
      setFormData({ ...formData, [name]: value === "Active" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isConfirmed) {
      setError("Please confirm to create the admin account.");
      return;
    }

    console.log(formData);

    try {
      setError("");
      setLoading(true);
      setFormVisible(false);
      const data = formData;

      const res = await axios.put(
        `https://fabribuzz.onrender.com/api/user/admin/update/${user._id}`,
        data
      );

      if (res.status === 200) {
        updateApi(); // refresh admin list
        //console.log("Success:", res.data);
        setError("");
        setLoading(false);
        // setFormVisible(true);

        setSuccess(true); // show success popup
        // reset confirmation
        setIsConfirmed(false);
        setFormData({
          // optionally reset form
          fullName: "",
          userName: "",
          email: "",
          images: "",
          phone: "",
          password: "",
          role: "Admin",
          status: true,
        });

        // optionally reset form or redirect
      }
    } catch (err) {
      setFormVisible(true);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to register admin. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen lg:max-w-2xl mx-auto lg:mt-6 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header: Identity Sync */}
      <div className="bg-slate-50 border-b border-slate-100 p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={back}
            className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-indigo-600 border border-transparent hover:border-slate-200 transition-all"
          >
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">
              Modify Credentials
            </h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Update system access & profile info
            </p>
          </div>
        </div>
        <div className="hidden md:block">
          <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
            System Protocol v2.0
          </span>
        </div>
      </div>

      <div className="p-8 relative">
        {/* 🚀 Advanced Loader Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-md flex items-center justify-center z-50 transition-all duration-300">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <FaSpinner className="text-indigo-600 text-5xl animate-spin" />
                <FiActivity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-400 text-xl" />
              </div>
              <p className="text-slate-800 font-black text-xs uppercase tracking-widest">
                Synchronizing Ledger...
              </p>
            </div>
          </div>
        )}

        {/* ✅ Success Protocol */}
        {success && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-lg flex items-center justify-center z-50 p-8 animate-in zoom-in-95 duration-300">
            <div className="max-w-xs w-full flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mb-6 border border-emerald-100 shadow-lg shadow-emerald-100/50">
                <FiCheckCircle className="text-emerald-500 text-4xl" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">
                Registry Updated
              </h3>
              <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">
                Admin credentials have been successfully updated in the master
                directory.
              </p>
              <button
                onClick={() => {
                  setSuccess(false);
                  back();
                }}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-indigo-600 shadow-xl shadow-indigo-100 transition-all active:scale-95"
              >
                Acknowledge & Return
              </button>
            </div>
          </div>
        )}

        {formVisible && (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Basic Profile */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
                <FiUser className="text-indigo-500" />
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Core Identification
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-tighter ml-1">
                    Full Name
                  </label>
                  <div className="relative group">
                    <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                      placeholder="Personnel Name"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-tighter ml-1">
                    Account Handle
                  </label>
                  <div className="relative group">
                    <FiAtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                      type="text"
                      name="userName"
                      value={formData.userName}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                      placeholder="username_identifier"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-tighter ml-1">
                    Corporate Email
                  </label>
                  <div className="relative group">
                    <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-tighter ml-1">
                    Secure Contact
                  </label>
                  <div className="relative group">
                    <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Security & Assets */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
                <FiLock className="text-indigo-500" />
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Security Protocols
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-tighter ml-1">
                    Change Keyphrase
                  </label>
                  <div className="relative group">
                    <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-tighter ml-1">
                    Avatar Resource URL
                  </label>
                  <div className="relative group">
                    <FiImage className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                      type="text"
                      name="images"
                      value={formData.images}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-tighter ml-1">
                    Clearance Role
                  </label>
                  <div className="relative">
                    <FiShield className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer appearance-none"
                    >
                      <option value="Admin">Admin / Level 1</option>
                      <option value="Super Admin">Super Admin / Level 2</option>
                      <option value="Moderator">Moderator / Guest</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-tighter ml-1">
                    Operational Status
                  </label>
                  <div className="relative">
                    <FiActivity className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                    <select
                      name="status"
                      value={formData.status ? "Active" : "Suspended"}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer appearance-none"
                    >
                      <option value="Active">Operational / Active</option>
                      <option value="Suspended">Suspended / Revoked</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirmation & Error */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
              <div className="flex items-center gap-3">
                <input
                  required
                  type="checkbox"
                  id="confirmAdmin"
                  checked={isConfirmed}
                  onChange={() => setIsConfirmed(!isConfirmed)}
                  className="w-5 h-5 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer"
                />
                <label
                  htmlFor="confirmAdmin"
                  className="text-[11px] font-bold text-slate-600 uppercase tracking-tight cursor-pointer"
                >
                  I certify these credential modifications are authorized.
                </label>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-rose-600 font-bold text-[10px] uppercase bg-rose-50 p-2 rounded-lg border border-rose-100">
                  <FiAlertCircle /> {error}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4 border-t border-slate-50">
              <button
                onClick={back}
                type="button"
                className="flex-1 py-4 text-rose-500 font-black text-[11px] uppercase tracking-widest rounded-2xl border border-rose-100 hover:bg-rose-50 transition-all"
              >
                Abort Sync
              </button>
              <button
                type="submit"
                className="flex-[2] py-4 bg-slate-900 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl hover:bg-indigo-600 shadow-xl shadow-slate-200 transition-all active:scale-95"
              >
                Update Ledger
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
