import React, { useState } from "react";
import {
  FiShield,
  FiAtSign,
  FiMail,
  FiPhone,
  FiCreditCard,
  FiMoreVertical,
  FiSearch,
  FiUserPlus,
  FiFilter,
  FiActivity,
} from "react-icons/fi";

const SystemPersonnel = () => {
  // --- DUMMY DATA HANDSHAKE ---
  const [employees] = useState([
    {
      adminID: "VB-AD-1001",
      fullName: "Imran Hossain",
      userName: "imran_victus",
      email: "imran@victusbyte.com",
      phone: "+880 1712-345678",
      role: "Admin",
      status: "Active",
      images:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    },
    {
      adminID: "VB-MOD-2005",
      fullName: "Sumaiya Akhter",
      userName: "sumaiya_mod",
      email: "sumaiya@victusbyte.com",
      phone: "+880 1822-998877",
      role: "Moderator",
      status: "Active",
      images:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    },
    {
      adminID: "VB-AD-1002",
      fullName: "Tanvir Ahmed",
      userName: "tanvir_dev",
      email: "tanvir@victusbyte.com",
      phone: "+880 1911-554433",
      role: "Admin",
      status: "Active",
      images:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    },
    {
      adminID: "VB-MOD-2009",
      fullName: "Ayesha Siddiqua",
      userName: "ayesha_vibes",
      email: "ayesha@victusbyte.com",
      phone: "+880 1633-112233",
      role: "Moderator",
      status: "Away",
      images:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = employees.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.adminID.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className=" bg-[#F8FAFC] min-h-screen font-sans">
      {/* --- DASHBOARD HEADER --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-3 md:gap-6 gap-2">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mt-0.5">
              <FiActivity className="text-emerald-500" size={18} />
              <p className="text-slate-400 font-bold text-[13px] uppercase tracking-[0.2em]">
                {employees.length} Active System User
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search ID or Name..."
              className="pl-11 pr-4 py-2 bg-white border placeholder:font-medium border-slate-300 rounded-2xl w-full sm:w-72 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-bold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* --- EMPLOYEE BADGE GRID --- */}
      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-4 gap-4">
        {filteredUsers.map((user) => {
          const isAdmin = user.role === "Admin";

          return (
            <div
              key={user.adminID}
              className="bg-white rounded-[24px] border border-slate-100 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-500 overflow-hidden group relative max-h-[180px]"
            >
              {/* Thin Top Accent */}
              <div
                className={`h-1 w-full ${isAdmin ? "bg-slate-900" : "bg-indigo-600"}`}
              ></div>

              <div className="flex flex-row h-full ">
                {/* --- LEFT PANEL: COMPACT IDENTITY --- */}
                <div
                  className={`md:w-[120px] w-[80px] flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-500 ${isAdmin ? "bg-[#0F172A]" : "bg-[#4F46E5]"}`}
                >
                  <div className="relative z-10">
                    <img
                      src={user.images}
                      className="md:w-24 md:h-24 w-18 h-18 rounded-2xl object-cover border-2 border-white/10 shadow-lg group-hover:scale-105 transition-transform"
                      alt={user.fullName}
                    />
                    {/* Compact Status Indicator */}
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-[#0F172A] rounded-full ${user.status === "Active" ? "bg-emerald-500" : "bg-amber-500"}`}
                    >
                      <span className="absolute inset-0 rounded-full bg-inherit animate-ping opacity-40"></span>
                    </div>
                  </div>

                  <div className="mt-3 px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg border border-white/5">
                    <p className="md:text-[10px] text-[8px] font-black text-white uppercase tracking-widest leading-none">
                      {user.role}
                    </p>
                  </div>
                </div>

                {/* --- RIGHT PANEL: SLIM DATA --- */}
                <div className="flex-1 md:p-4  mb-2 md:mb-0 ml-1 md:ml-0 mt-3 md:mt-0 px-1 relative flex flex-col">
                  {/* Primary Info */}
                  <div className="mb-2">
                    <h3 className="md:text-xl  -mt-2 font-black text-slate-900 uppercase tracking-tighter truncate w-[90%]">
                      {user.fullName}
                    </h3>
                    <p className="text-indigo-600 font-black text-[11px] uppercase tracking-widest opacity-70">
                      @{user.userName}
                    </p>
                  </div>

                  {/* Horizontal Data Grid */}
                  <div className="">
                    {[
                      {
                        icon: <FiCreditCard />,
                        label: "ID",
                        value: user.adminID,
                        mono: true,
                      },
                      { icon: <FiMail />, label: "Mail", value: user.email },
                      { icon: <FiPhone />, label: "Phone", value: user.phone },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-2 min-w-0 ${i === 0 ? "col-span-2 border-b border-slate-50 pb-1" : "col-span-1"}`}
                      >
                        <div className="text-slate-500">
                          {React.cloneElement(item.icon, { size: 13 })}
                        </div>
                        <div className="min-w-0">
                          <p
                            className={`text-[14px] font-medium text-slate-600  ${item.mono ? "font-mono" : ""}`}
                          >
                            {item.value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- EMPTY SEARCH STATE --- */}
      {filteredUsers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] border-2 border-dashed border-slate-200 mt-10">
          <div className="p-6 bg-slate-50 rounded-3xl text-slate-300 mb-4">
            <FiFilter size={48} />
          </div>
          <h3 className="text-slate-900 font-black uppercase tracking-tight text-lg">
            Identity Not Found
          </h3>
          <p className="text-slate-400 font-medium text-sm">
            No personnel matches your current query
          </p>
        </div>
      )}
    </div>
  );
};

export default SystemPersonnel;
