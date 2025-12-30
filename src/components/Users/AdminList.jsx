import { useContext, useState } from "react";
import { DataContext } from "@/Context Api/ApiContext";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import axios from "axios";
import UpdateAdmin from "./UpdateAdmin.jsx";
import {
  FiUsers,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiShield,
  FiActivity,
  FiAtSign,
  FiUser,
  FiMail,
  FiPhone,
  FiHash,
  FiKey,
} from "react-icons/fi";

const AdminList = () => {
  const { adminData, updateApi } = useContext(DataContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [editAdmin, setEditAdmin] = useState(null); // store the selected admin object
  const [loading, setLoading] = useState(false);

  // 🔹 Format timestamps nicely
  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // 🔹 Filter admins
  const filteredAdmins = adminData.filter(
    (admin) =>
      admin.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.phone?.includes(searchTerm) ||
      admin.adminID?.includes(searchTerm.toUpperCase())
  );

  // 🔹 Delete admin handler
  // const handleDelete = async (id) => {
  //   const confirmed = window.confirm(
  //     "Are you sure you want to delete this admin?"
  //   );
  //   if (!confirmed) return;

  //   try {
  //     setLoading(true);
  //     await axios.delete(
  //       `https://fabribuzz.onrender.com/api/user/admin/delete/${id}`
  //     );
  //     await updateApi(); // Refresh admin list after delete
  //   } catch (err) {
  //     console.error("Delete failed:", err);
  //     alert("Failed to delete admin. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
      {editAdmin ? (
        <UpdateAdmin user={editAdmin} back={() => setEditAdmin(null)} />
      ) : (
        <>
          {/* --- Dashboard Toolbar --- */}
          <div className="p-6 border-b border-slate-100 bg-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-900 rounded-xl text-white shadow-lg shadow-slate-200">
                  <FiShield size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-800 tracking-tight">
                    Identity Registry
                  </h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    Master Personnel Directory
                  </p>
                </div>
              </div>

              <div className="relative group w-full md:w-80">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Search by any attribute..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:font-medium placeholder:text-slate-300"
                />
              </div>
            </div>
          </div>

          {/* --- Atomized Table --- */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    S/N
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    Admin ID
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    Full Name
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    Username
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    Email
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    Role
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    Status
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    Last Active
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredAdmins.length > 0 ? (
                  filteredAdmins.map((admin, index) => (
                    <tr
                      key={admin.adminID}
                      className="group hover:bg-slate-50/50 transition-all"
                    >
                      {/* 1. S/N */}
                      <td className="px-6 py-3 text-sm font-mono font-bold text-slate-400 uppercase">
                        {(index + 1).toString().padStart(2, "0")}
                      </td>

                      {/* 2. Admin ID (Separate) */}
                      <td className="px-6 py-3">
                        <span className="flex items-center gap-1.5 text-[12px] font-mono font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">
                          <FiKey size={12} /> {admin.adminID}
                        </span>
                      </td>

                      {/* 3. Full Name (Separate) */}
                      <td className="px-6 py-3">
                        <span className="text-sm font-black text-slate-800 uppercase tracking-tight italic">
                          {admin.fullName}
                        </span>
                      </td>

                      {/* 4. Username (Separate) */}
                      <td className="px-6 py-3 text-xs font-bold text-slate-500 lowercase">
                        @{admin.userName}
                      </td>

                      {/* 5. Email (Separate) */}
                      <td className="px-6 py-3 text-xs font-medium text-slate-600">
                        {admin.email}
                      </td>

                      {/* 6. Phone (Separate) */}
                      <td className="px-6 py-3 text-xs font-mono font-bold text-slate-500 tracking-tighter">
                        {admin.phone}
                      </td>

                      {/* 7. Role (Separate) */}
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-indigo-600 tracking-widest bg-indigo-50/50 px-2 py-0.5 rounded border border-indigo-100">
                          <FiShield size={10} /> {admin.role}
                        </div>
                      </td>

                      {/* 8. Status (Separate) */}
                      <td className="px-6 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                            admin.status
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100 shadow-sm shadow-emerald-100"
                              : "bg-rose-50 text-rose-700 border-rose-100 shadow-sm shadow-rose-100"
                          }`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              admin.status
                                ? "bg-emerald-500 animate-pulse"
                                : "bg-rose-500"
                            }`}
                          />
                          {admin.status ? "Active" : "Suspended"}
                        </span>
                      </td>

                      {/* 9. Last Active (Separate) */}
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase">
                          <FiActivity size={12} className="text-slate-300" />
                          {formatDate(admin.lastLogin)}
                        </div>
                      </td>

                      {/* 10. Actions */}
                      <td className="px-6 py-3">
                        <div className="flex justify-center items-center gap-1">
                          <button
                            onClick={() => setEditAdmin(admin)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-100 transition-all"
                          >
                            <FiEdit2 size={14} />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-100 transition-all">
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="py-24 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <FiUsers size={40} className="text-slate-100" />
                        <p className="text-sm font-black text-slate-300 uppercase tracking-widest">
                          No entries in the identity ledger
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminList;
