import { useContext, useState } from "react";
import { AuthContext } from "../../Context Api/AuthContext.jsx";
import { FaSpinner, FaCheckCircle } from "react-icons/fa";
import axios from "axios";
import { DataContext } from "@/Context Api/ApiContext.jsx";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
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

  const extra = () => {
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
        popup: "w-[300px] h-[200px] p-4 lg:ml-45", // 👈 controls alert size
        title: "text-lg font-bold",
        htmlContainer: "text-sm text-gray-600",
      },
    });

    // const res = await axios.patch(
    //   `https://fabribuzz.onrender.com/api/order/update/${orderId}`,
    //   updatedData,
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );

    //update api
    // updateApi();

    // Update success message
    MySwal.hideLoading();
    MySwal.update({
      icon: "success",
      title: <p className="text-green-600 text-xl font-bold">Order ✅</p>,
      html: (
        <div className="text-gray-700 mt-2 mb-4">
          Order <b>#123</b> has been successfully updated!
        </div>
      ),
      showConfirmButton: true,
      confirmButtonText: "OK",
      customClass: {
        popup: "ml-45",
        confirmButton:
          "bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg",
      },
      buttonsStyling: false,
    });
  };

  console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isConfirmed) {
      setError("Please confirm to create the admin account.");
      return;
    }

    try {
      setError("");
      MySwal.fire({
        title: (
          <p className="text-xl font-semibold text-blue-600">Processing...</p>
        ),
        html: (
          <p className="text-gray-600">Please wait while we create Admin.</p>
        ),
        allowOutsideClick: false,
        didOpen: () => {
          MySwal.showLoading();
        },
        customClass: {
          popup: "w-[300px] h-[200px] p-4 lg:ml-45",
          title: "text-lg font-bold",
          htmlContainer: "text-sm text-gray-600",
        },
      });

      const data = formData;
      const res = await axios.post(
        "https://api.victusbyte.com/api/user/admin/signup",
        data,
      );

      if (res.status === 201) {
        updateApi(); // refresh admin list
        console.log("Success:", res.data);
        setError("");

        // reset confirmation
        setIsConfirmed(false);
        // Update success message
        MySwal.hideLoading();
        MySwal.update({
          icon: "success",
          title: (
            <p className="text-green-600 text-xl font-bold">Admin Created ✅</p>
          ),
          html: (
            <div className="text-gray-700 mt-2 mb-4">
              Admin <b>#{formData.fullName}</b> has been successfully updated!
            </div>
          ),
          showConfirmButton: true,
          confirmButtonText: "OK",
          customClass: {
            popup: "ml-45",
            confirmButton:
              "bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg",
          },
          buttonsStyling: false,
        });
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

        //update api
        updateApi();
      }
    } catch (err) {
      MySwal.hideLoading();
      MySwal.update({
        icon: "success",
        title: <p className="text-green-600 text-xl font-bold">Failled ✅</p>,
        html: (
          <div className="text-gray-700 mt-2 mb-4">
            Admin <b>#{formData.fullName}</b> can't updated!
          </div>
        ),
        showConfirmButton: true,
        confirmButtonText: "OK",
        customClass: {
          popup: "ml-45",
          confirmButton:
            "bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg",
        },
        buttonsStyling: false,
      });
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to register admin. Please try again.");
      }
    }
  };

  return (
    <div className="w-full lg:max-w-xl mx-auto lg:mt-3 bg-white">
      <h2 className="lg:text-2xl text-xl  font-bold mb-4 lg:mt-10 mt-5 text-center bg-gray-200 p-2 rounded">
        Register New Admin
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Mostakin Ahmed"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Username</label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="mostakin111111"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="admin@victusbyte.com"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="+880123456789"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="••••••••"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">
              Profile Picture URL
            </label>
            <input
              type="text"
              name="images"
              value={formData.images}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="https://example.com/avatar.jpg"
              required
            />
          </div>
        </div>

        {/* Security & Login Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="Admin">Admin</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Moderator">Moderator</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Status</label>
            <select
              name="status"
              value={formData.status ? "Active" : "Suspended"}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Confirmation Checkbox */}
        <div className="flex items-center gap-3">
          <input
            required
            type="checkbox"
            id="confirmAdmin"
            checked={isConfirmed}
            onChange={() => setIsConfirmed(!isConfirmed)}
            className="w-4 h-4"
          />
          <label htmlFor="confirmAdmin" className="text-gray-700">
            I confirm that I want to create a new admin account
          </label>
        </div>

        {/* Error message */}
        {error && (
          <div className="text-red-600 font-medium bg-red-100 p-2 rounded">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 w-full py-2 rounded hover:bg-blue-700 transition-all font-medium"
          >
            Register Admin
          </button>
        </div>
      </form>
    </div>
  );
}
