import { FiBell, FiUser } from "react-icons/fi";
import { AuthContext } from "../Context Api/AuthContext";
import { useContext, useState } from "react";
import { img } from "framer-motion/client";
import { AiOutlineEye } from "react-icons/ai";
import { RiBroadcastLine } from "react-icons/ri";

export default function Navbar({ pageTitle }) {
  const { user, logout } = useContext(AuthContext);
  const [showPopup, setShowPopup] = useState(false);

  const toggleAdminPopup = () => {
    setShowPopup((prev) => !prev);
  };

  return (
    <div className="flex justify-between items-center bg-gray-800 text-white px-4 py-2 shadow-5xl rounded mb-2">
      {/* Page Title */}
      <div className="hidden lg:flex justify-between items-center bg- text-2xl text-white rounded ">
        {pageTitle}
      </div>
      <div className="lg:hidden flex justify-between items-center text-xl font-semibold py-2 rounded truncate">
        {pageTitle}
      </div>

      {/* Right side: Search, Notifications, User */}
      <div className="flex items-center gap-5">
        {/* Notification Icon */}
        <a
          href="https://victusbyte.top"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-2xl"
        >
          <RiBroadcastLine className="text-red-600 animate-pulse" size={26} />
        </a>

        <button className="hidden lg:flex relative p-2 rounded hover:bg-gray-100">
          <FiBell size={20} />
          <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={toggleAdminPopup}
        >
          {/* <div className="-mt-4 flex flex-col items-center hover:text-blue-600">
            <span className="hidden -mb-1 lg:flex  -bold text-lg">Admin</span>
            <span className="-mb-7 hidden lg:flex text-sm text-blue-400 ">
              {user.userName}
            </span>
          </div> */}
          <div
            className="bg-gray-700 hidden md:flex border border-gray-600  hover:bg-gray-800 transition-all duration-300 
                 justify-center items-center flex-col text-gray-300 h-9 w-32 rounded cursor-pointer"
          >
            <div className="font-semibold  text-sm mt-2 border-b border-gray-900 w-full text-center">
              Admin
            </div>
            <div className="text-xs text-gray-400 mb-2">{user.userName}</div>
          </div>

          <img
            className="w-10 h-10 lg:w-11 lg:h-11 rounded-full border-blue-600 border-2"
            src={
              user.images
                ? user.images
                : "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80"
            }
            alt="User"
          />
        </div>
      </div>

      {/* Admin Popup */}
      {showPopup && user && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Blurred white background */}
          <div className="absolute inset-0 bg-white/40 backdrop-blur-md"></div>

          {/* Popup content */}
          <div className="relative bg-white rounded shadow-xl lg:w-96 w-85 max-w-full text-left z-10 overflow-hidden">
            {/* Header */}
            <div className="flex  items-center justify-between bg-gray-800 text-white p-4">
              <h2 className="text-lg font-semibold">Admin Profile</h2>
              <button
                onClick={() => setShowPopup(false)}
                className="text-white cursor-pointer font-bold text-3xl hover:text-green-500"
              >
                ✕
              </button>
            </div>

            {/* Avatar */}
            <div className="flex  justify-center -mt-12">
              <img
                src={
                  user.images ||
                  "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
                }
                alt={user.fullName}
                className="w-26 h-26  rounded-full border-4 border-white shadow-md"
              />
            </div>

            {/* Profile info */}
            <div className="p-6">
              <table className="w-full text-gray-700">
                <tbody>
                  <tr className="border-b py-2">
                    <td className="font-medium py-2">Full Name</td>
                    <td className="py-2">: {user.fullName}</td>
                  </tr>
                  <tr className="border-b py-2">
                    <td className="font-medium py-2">Username</td>
                    <td className="py-2">: @{user.userName}</td>
                  </tr>
                  <tr className="border-b py-2">
                    <td className="font-medium py-2">ID</td>
                    <td className="py-2">: {user.adminID}</td>
                  </tr>
                  <tr className="border-b py-2">
                    <td className="font-medium py-2">Role</td>
                    <td className="py-2 text-green-600 text-md font-bold">
                      :{user.role ? " Admin" : "User"}
                    </td>
                  </tr>
                  <tr className="border-b py-2">
                    <td className="font-medium py-2">Email</td>
                    <td className="py-2">: {user.email}</td>
                  </tr>
                  <tr className="border-b py-2">
                    <td className="font-medium py-2">Phone</td>
                    <td className="py-2">: {user.phone}</td>
                  </tr>

                  <tr className="border-b py-2">
                    <td className="font-medium py-2">Created At</td>
                    <td className="py-2">
                      {new Date(user.createdAt).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Close Button */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => logout()}
                  className="bg-red-500 text-white cursor-pointer text-lg px-6 py-1 rounded-sm hover:bg-red-600 transition-all"
                >
                  Logout
                </button>

                {/* <button
                  onClick={() => setShowPopup(false)}
                  className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition-all"
                >
                  Close
                </button> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
