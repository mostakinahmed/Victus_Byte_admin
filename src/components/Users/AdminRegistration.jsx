import { useContext, useState } from "react";
import { DataContext } from "@/Context Api/ApiContext.jsx";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import api from "@/Context Api/api.js";
import {
  FiUser,
  FiAtSign,
  FiMail,
  FiPhone,
  FiLock,
  FiImage,
  FiShield,
  FiActivity,
  FiAlertCircle,
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
        title: <p className="text-base font-normal text-black">Processing</p>,
        html: (
          <p className="text-sm font-normal text-black">
            Synchronizing Ledger...
          </p>
        ),
        allowOutsideClick: false,
        didOpen: () => {
          MySwal.showLoading();
        },
        customClass: {
          popup: "rounded-xl border-none shadow-xl",
          loader: "text-black",
        },
      });

      const res = await api.post("/user/admin/signup", formData);

      if (res.status === 201) {
        updateApi();
        setIsConfirmed(false);
        MySwal.hideLoading();
        MySwal.update({
          icon: "success",
          iconColor: "black",
          title: <p className="text-base font-normal text-black">Success ✅</p>,
          html: (
            <div className="text-sm font-normal text-black mt-2">
              Admin <b>{formData.fullName}</b> has been registered.
            </div>
          ),
          showConfirmButton: true,
          confirmButtonText: "Acknowledge",
          customClass: {
            popup: "rounded-xl",
            confirmButton:
              "bg-black text-white font-normal px-8 py-2 rounded-md text-sm",
          },
          buttonsStyling: false,
        });

        setFormData({
          fullName: "",
          userName: "",
          email: "",
          images: "",
          phone: "",
          password: "",
          role: "Admin",
          status: true,
        });
      }
    } catch (err) {
      MySwal.hideLoading();
      MySwal.update({
        icon: "error",
        title: <p className="text-base font-normal text-black">Failed ❌</p>,
        html: (
          <div className="text-sm font-normal text-black mt-2">
            Registration process interrupted.
          </div>
        ),
        showConfirmButton: true,
        confirmButtonText: "Retry",
        customClass: {
          popup: "rounded-xl",
          confirmButton:
            "bg-black text-white font-normal px-8 py-2 rounded-md text-sm",
        },
        buttonsStyling: false,
      });
      setError(err.response?.data?.message || "Internal server failure.");
    }
  };

  return (
    <div className="w-full lg:max-w-2xl mx-auto lg:mt-6 mb-10 bg-white  rounded-lg p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-8 justify-center lg:justify-start">
        <span className="w-1 h-6 bg-black rounded-full"></span>
        <h2 className="text-base font-normal text-black uppercase">
          Register New Admin
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputBlock
            label="Full Name"
            icon={<FiUser />}
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Mostakin Ahmed"
          />
          <InputBlock
            label="Username"
            icon={<FiAtSign />}
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            placeholder="mostakin11"
          />
          <InputBlock
            label="Email"
            icon={<FiMail />}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="admin@victusbyte.com"
          />
          <InputBlock
            label="Phone"
            icon={<FiPhone />}
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+880123456789"
          />
          <InputBlock
            label="Password"
            icon={<FiLock />}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
          />
          <InputBlock
            label="Profile Image URL"
            icon={<FiImage />}
            name="images"
            value={formData.images}
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <SelectBlock
            label="Role"
            icon={<FiShield />}
            name="role"
            value={formData.role}
            onChange={handleChange}
            options={["Admin", "Super Admin", "Moderator"]}
          />
          <SelectBlock
            label="Status"
            icon={<FiActivity />}
            name="status"
            value={formData.status ? "Active" : "Suspended"}
            onChange={handleChange}
            options={["Active", "Suspended"]}
          />
        </div>

        <div className="flex items-center gap-3 p-4 bg-white rounded-md border border-slate-400">
          <input
            required
            type="checkbox"
            id="confirmAdmin"
            checked={isConfirmed}
            onChange={() => setIsConfirmed(!isConfirmed)}
            className="w-4 h-4 rounded border-black text-black focus:ring-black transition-all cursor-pointer"
          />
          <label
            htmlFor="confirmAdmin"
            className="text-xs font-normal text-black cursor-pointer"
          >
            I certify that this administrative account creation is authorized.
          </label>
        </div>

        {error && (
          <div className="text-black font-normal text-xs bg-white p-3 rounded-md border border-black flex items-center gap-2">
            <FiAlertCircle /> {error}
          </div>
        )}

        <div className="flex justify-center">
          <button
            type="submit"
            className="w-2/4  bg-black hover:bg-gray-800 text-white py-3 rounded-md font-normal text-sm transition-all active:scale-95"
          >
            Register Admin
          </button>
        </div>
      </form>
    </div>
  );
}

const InputBlock = ({ label, icon, ...props }) => (
  <div className="space-y-1">
    <label className="text-xs font-normal text-black uppercase ml-1">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black transition-colors">
        {icon}
      </div>
      <input
        {...props}
        className="w-full pl-11 pr-4 py-2 bg-white border border-slate-400 rounded-md text-sm font-normal text-black outline-none focus:ring-1 focus:ring-black transition-all placeholder:text-gray-400"
      />
    </div>
  </div>
);

const SelectBlock = ({ label, icon, options, ...props }) => (
  <div className="space-y-1">
    <label className="text-xs font-normal text-black uppercase ml-1">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black pointer-events-none">
        {icon}
      </div>
      <select
        {...props}
        className="w-full pl-11 pr-4 py-2 bg-white border border-slate-400 rounded-md text-sm font-normal text-black outline-none focus:ring-1 focus:ring-black transition-all appearance-none cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  </div>
);
