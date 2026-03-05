import { useContext, useState } from "react";
import { DataContext } from "@/Context Api/ApiContext.jsx";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import api from "@/Context Api/api.js";
import { 
  FiUser, FiAtSign, FiMail, FiPhone, 
  FiLock, FiImage, FiShield, FiActivity 
} from "react-icons/fi";

const MySwal = withReactContent(Swal);

export default function AdminRegistration() {
  const { updateApi } = useContext(DataContext);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    images: "",
    phone: "",
    password: "",
    role: "Admin",
    status: true,
  });

  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "status") {
      setFormData({ ...formData, [name]: value === "Active" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isConfirmed) {
      setError("Please confirm the authorization to proceed.");
      return;
    }

    try {
      setError("");
      MySwal.fire({
        title: <p className="text-lg font-black text-slate-800 uppercase tracking-widest">Processing</p>,
        html: <p className="text-xs font-bold text-slate-500 uppercase">Synchronizing Ledger...</p>,
        allowOutsideClick: false,
        didOpen: () => { MySwal.showLoading(); },
        customClass: {
          popup: "rounded-[2rem] border-none shadow-2xl",
          loader: "text-[#1976d2]"
        },
      });

      const res = await api.post("/user/admin/signup", formData);

      if (res.status === 201) {
        updateApi();
        setIsConfirmed(false);
        MySwal.hideLoading();
        MySwal.update({
          icon: "success",
          iconColor: "#1976d2",
          title: <p className="text-lg font-black text-slate-800 uppercase tracking-widest">Success ✅</p>,
          html: (
            <div className="text-xs font-bold text-slate-500 uppercase mt-2">
              Admin <b className="text-[#1976d2]">{formData.fullName}</b> has been registered.
            </div>
          ),
          showConfirmButton: true,
          confirmButtonText: "Acknowledge",
          customClass: {
            popup: "rounded-[2rem]",
            confirmButton: "bg-[#1976d2] hover:bg-[#1565c0] text-white font-black px-8 py-3 rounded-xl uppercase text-[10px] tracking-widest",
          },
          buttonsStyling: false,
        });
        
        setFormData({
          fullName: "", userName: "", email: "",
          images: "", phone: "", password: "",
          role: "Admin", status: true,
        });
      }
    } catch (err) {
      MySwal.hideLoading();
      MySwal.update({
        icon: "error",
        title: <p className="text-lg font-black text-rose-600 uppercase tracking-widest">Failed ❌</p>,
        html: <div className="text-xs font-bold text-slate-500 uppercase mt-2">Registration process interrupted.</div>,
        showConfirmButton: true,
        confirmButtonText: "Retry",
        customClass: {
          popup: "rounded-[2rem]",
          confirmButton: "bg-rose-500 hover:bg-rose-600 text-white font-black px-8 py-3 rounded-xl uppercase text-[10px] tracking-widest",
        },
        buttonsStyling: false,
      });
      setError(err.response?.data?.message || "Internal server failure.");
    }
  };

  return (
    <div className="w-full lg:max-w-2xl mx-auto lg:mt-6 mb-10 bg-white border border-slate-100 rounded p-8 shadow animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-8 justify-center lg:justify-start">
        <span className="w-1.5 h-6 bg-[#1976d2] rounded-full"></span>
        <h2 className="text-[14px] font-black text-slate-800 uppercase tracking-[0.3em]">
          Register New Admin
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputBlock label="Full Name" icon={<FiUser />} name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Mostakin Ahmed" />
          <InputBlock label="Username" icon={<FiAtSign />} name="userName" value={formData.userName} onChange={handleChange} placeholder="mostakin11" />
          <InputBlock label="Email" icon={<FiMail />} type="email" name="email" value={formData.email} onChange={handleChange} placeholder="admin@victusbyte.com" />
          <InputBlock label="Phone" icon={<FiPhone />} name="phone" value={formData.phone} onChange={handleChange} placeholder="+880123456789" />
          <InputBlock label="Password" icon={<FiLock />} type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" />
          <InputBlock label="Profile Image URL" icon={<FiImage />} name="images" value={formData.images} onChange={handleChange} placeholder="https://..." />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <SelectBlock label="Role" icon={<FiShield />} name="role" value={formData.role} onChange={handleChange} options={["Admin", "Super Admin", "Moderator"]} />
          <SelectBlock label="Status" icon={<FiActivity />} name="status" value={formData.status ? "Active" : "Suspended"} onChange={handleChange} options={["Active", "Suspended"]} />
        </div>

        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <input
            required
            type="checkbox"
            id="confirmAdmin"
            checked={isConfirmed}
            onChange={() => setIsConfirmed(!isConfirmed)}
            className="w-5 h-5 rounded-md border-slate-300 text-[#1976d2] focus:ring-[#1976d2] transition-all cursor-pointer"
          />
          <label htmlFor="confirmAdmin" className="text-[10px] font-black text-slate-500 uppercase tracking-wide cursor-pointer">
            I certify that this administrative account creation is authorized.
          </label>
        </div>

        {error && (
          <div className="text-rose-600 font-black text-[10px] uppercase bg-rose-50 p-3 rounded-xl border border-rose-100 flex items-center gap-2">
            <FiAlertCircle /> {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-slate-900 hover:bg-[#1976d2] text-white py-4 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] transition-all shadow-xl shadow-blue-900/10 active:scale-95"
        >
          Dispatch Registration
        </button>
      </form>
    </div>
  );
}

// Reusable Input Component
const InputBlock = ({ label, icon, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1976d2] transition-colors">
        {icon}
      </div>
      <input
        {...props}
        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-[#1976d2] transition-all placeholder:text-slate-300"
      />
    </div>
  </div>
);

// Reusable Select Component
const SelectBlock = ({ label, icon, options, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
        {icon}
      </div>
      <select
        {...props}
        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-[#1976d2] transition-all appearance-none cursor-pointer"
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  </div>
);