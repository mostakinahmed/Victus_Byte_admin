import { DataContext } from "@/Context Api/ApiContext";
import React, { useContext, useState } from "react";
import {
  FiMail,
  FiPhone,
  FiCreditCard,
  FiSearch,
  FiFilter,
  FiActivity,
  FiShield,
  FiUserCheck,
} from "react-icons/fi";

const SystemPersonnel = () => {
  const { adminData } = useContext(DataContext);
  const [searchTerm, setSearchTerm] = useState("");
  console.log(adminData);

  // Use live admindata if available, else fallback to empty array
  const personnel = adminData || [];

  // 1. Filter by Search Term
  const filteredUsers = personnel.filter(
    (user) =>
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.adminID?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // 2. Logic: ID starts with 45 = Admin, 15 = Moderator
  const admins = filteredUsers.filter((user) => user.adminID?.startsWith("45"));
  const moderators = filteredUsers.filter((user) =>
    user.adminID?.startsWith("15"),
  );

  const UserBadge = ({ user }) => {
    const isAdmin = user.adminID?.startsWith("45");

    return (
      <div className="bg-white rounded-[15px] border border-slate-300 hover:shadow-lg hover:translate-y-[-4px] transition-all duration-500 overflow-hidden group relative">
        {/* Brand Accent Line */}
        <div
          className={`h-1.5 w-full ${isAdmin ? "bg-slate-900" : "bg-[#1976d2]"}`}
        ></div>

        <div className="flex flex-row h-full">
          {/* Sidebar Section */}
          <div
            className={`w-[100px] md:w-[120px] flex flex-col items-center justify-center p-4 transition-colors duration-500 ${isAdmin ? "bg-slate-900" : "bg-[#1976d2]"}`}
          >
            <div className="relative">
              <img
                src={
                  user.images ||
                  "https://7vgva7cju0vcfvwf.public.blob.vercel-storage.com/user.png"
                }
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border-2 border-white/20 shadow-lg"
                alt={user.fullName}
              />
              {/* Online Status Dot */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-2 border-slate-900 rounded-full bg-emerald-500">
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-40"></span>
              </div>
            </div>
            <div className="mt-3 px-2 py-1 bg-white/10 backdrop-blur-md rounded-lg border border-white/10">
              <p className="text-[8px] md:text-[9px] font-black text-white uppercase tracking-[0.2em] leading-none">
                {isAdmin ? "Admin" : "Moderator"}
              </p>
            </div>
          </div>

          {/* Details Section */}
          <div className="flex-1 p-4 flex flex-col justify-center overflow-hidden">
            <div className="mb-3">
              <h3 className="text-base md:text-lg font-black text-slate-800 uppercase tracking-tighter truncate">
                {user.fullName}
              </h3>
              <p className="text-[#1976d2] font-black text-[10px] uppercase tracking-widest opacity-80">
                {isAdmin ? "System Controller" : "Content Monitor"}
              </p>
            </div>

            <div className="space-y-1.5">
              {[
                {
                  icon: <FiCreditCard />,
                  value: user.adminID,
                  color: "text-slate-400",
                },
                {
                  icon: <FiMail />,
                  value: user.email,
                  color: "text-slate-400",
                },
                {
                  icon: <FiPhone />,
                  value: user.phone,
                  color: "text-slate-400",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 overflow-hidden"
                >
                  <span className={item.color}>
                    {React.cloneElement(item.icon, { size: 12 })}
                  </span>
                  <p className="text-[12px] font-bold text-slate-600 truncate">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen p-4 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
        {/* Search Bar */}
        <div className="relative w-full lg:w-80">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID or Name..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl outline-none focus:ring-4 focus:ring-[#1976d2]/5 focus:border-[#1976d2] transition-all placeholder:font-medium text-xs font-black uppercase tracking-widest"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-16">
        {/* Administrators Section */}
        {admins.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="p-2 bg-slate-900 rounded-lg text-white">
                <FiShield size={16} />
              </div>
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">
                System Administrators{" "}
                <span className="text-slate-900 ml-2">({admins.length})</span>
              </h2>
              <div className="flex-1 h-[1px] bg-slate-200"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {admins.map((user) => (
                <UserBadge key={user.adminID} user={user} />
              ))}
            </div>
          </section>
        )}

        {/* Moderators Section */}
        {moderators.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="p-2 bg-[#1976d2] rounded-lg text-white">
                <FiUserCheck size={16} />
              </div>
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">
                System Moderators{" "}
                <span className="text-[#1976d2] ml-2">
                  ({moderators.length})
                </span>
              </h2>
              <div className="flex-1 h-[1px] bg-slate-200"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {moderators.map((user) => (
                <UserBadge key={user.adminID} user={user} />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="p-6 bg-slate-50 rounded-3xl text-slate-300 mb-4">
              <FiFilter size={48} />
            </div>
            <h3 className="text-slate-900 font-black uppercase tracking-widest text-sm">
              Identity Not Found
            </h3>
            <p className="text-slate-400 font-bold text-[10px] uppercase mt-2">
              Try searching by different criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemPersonnel;
