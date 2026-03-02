import React, { useState } from "react";
import { FaEdit, FaTrash, FaSearch, FaEye } from "react-icons/fa";
import CustomerView from "./CustomerView";

const CustomerList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("list");
  const [selectedAdmin, setSelectedAdmin] = useState(null); // <-- store selected admin

  const adminData = [
{
      id: "A001",
      fullName: "Mostakin Ahmed",
      username: "mostakin",
      email: "mostakin@example.com",
      phone: "+8801789001234",
      role: "Super Admin",
      status: "Active",
      createdAt: "2025-10-01",
      lastLogin: "2025-10-18 14:32",
    },
    {
      id: "A002",
      fullName: "Rafiul Islam",
      username: "rafiul",
      email: "rafiul@example.com",
      phone: "+8801790005678",
      role: "Admin",
      status: "Active",
      createdAt: "2025-09-25",
      lastLogin: "2025-10-20 09:15",
    },
    {
      id: "A003",
      fullName: "Nusrat Jahan",
      username: "nusrat",
      email: "nusrat@example.com",
      phone: "+8801876003344",
      role: "Moderator",
      status: "Inactive",
      createdAt: "2025-08-12",
      lastLogin: "2025-09-30 18:45",
    },
    {
      id: "A004",
      fullName: "Sajid Hasan",
      username: "sajid",
      email: "sajid@example.com",
      phone: "+8801754002233",
      role: "Admin",
      status: "Active",
      createdAt: "2025-07-05",
      lastLogin: "2025-10-19 21:10",
    },
    {
      id: "A005",
      fullName: "Farzana Akter",
      username: "farzana",
      email: "farzana@example.com",
      phone: "+8801998007890",
      role: "Editor",
      status: "Active",
      createdAt: "2025-09-14",
      lastLogin: "2025-10-17 10:05",
    },
    {
      id: "A006",
      fullName: "Tareq Rahman",
      username: "tareq",
      email: "tareq@example.com",
      phone: "+8801711005566",
      role: "Support",
      status: "Suspended",
      createdAt: "2025-06-10",
      lastLogin: "2025-08-29 12:30",
    },
    {
      id: "A007",
      fullName: "Mim Chowdhury",
      username: "mimc",
      email: "mimc@example.com",
      phone: "+8801817009988",
      role: "Admin",
      status: "Active",
      createdAt: "2025-08-30",
      lastLogin: "2025-10-18 16:25",
    },
    {
      id: "A008",
      fullName: "Hasan Mahmud",
      username: "hasan",
      email: "hasan@example.com",
      phone: "+8801788001112",
      role: "Editor",
      status: "Active",
      createdAt: "2025-09-10",
      lastLogin: "2025-10-19 19:50",
    },
    {
      id: "A009",
      fullName: "Sadia Khatun",
      username: "sadiak",
      email: "sadiak@example.com",
      phone: "+8801979003344",
      role: "Moderator",
      status: "Inactive",
      createdAt: "2025-07-18",
      lastLogin: "2025-09-25 08:55",
    },
    {
      id: "A010",
      fullName: "Arif Hossain",
      username: "arifh",
      email: "arifh@example.com",
      phone: "+8801702006677",
      role: "Support",
      status: "Active",
      createdAt: "2025-10-02",
      lastLogin: "2025-10-20 11:47",
    },
  ];

  const filteredAdmins = adminData.filter(
    (admin) =>
      admin.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.phone.includes(searchTerm) ||
      admin.id.includes(searchTerm.toUpperCase())
  );

  return (
    <div className="bg-white rounded  ">
      {/* Header + Search */}
      {activeTab === "list" && (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-3">
          <h2 className="text-xl font-semibold text-gray-700">Customer List</h2>
          <div className="relative w-full md:w-64">
            <FaSearch className="absolute left-3 top-3 text-gray-300" />
            <input
              type="text"
              placeholder="username || phone || ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        {/* Admin Table */}
        {activeTab === "list" && (
          <table className="w-full border border-gray-200 text-sm text-left whitespace-nowrap">
            <thead className="bg-gray-200 text-gray-700 uppercase text-xs whitespace-nowrap">
              <tr>
                <th className="py-3 px-4 border-b">User ID</th>
                <th className="py-3 px-4 border-b">Full Name</th>
                <th className="py-3 px-4 border-b">Username</th>
                <th className="py-3 px-4 border-b">Email</th>
                <th className="py-3 px-4 border-b">Phone</th>
                <th className="py-3 px-4 border-b">Role</th>
                <th className="py-3 px-4 border-b">Status</th>
                <th className="py-3 px-4 border-b">Created</th>
                <th className="py-3 px-4 border-b">Last Login</th>
                <th className="py-3 px-4 border-b text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.length > 0 ? (
                filteredAdmins.map((admin) => (
                  <tr
                    key={admin.id}
                    className="hover:bg-gray-100 transition duration-150"
                  >
                    <td className="py-3 px-4 border-b">{admin.id}</td>
                    <td className="py-3 px-4 border-b">{admin.fullName}</td>
                    <td className="py-3 px-4 border-b">{admin.username}</td>
                    <td className="py-3 px-4 border-b">{admin.email}</td>
                    <td className="py-3 px-4 border-b">{admin.phone}</td>
                    <td className="py-3 px-4 border-b">{admin.role}</td>
                    <td
                      className={`py-3 px-4 border-b font-medium ${
                        admin.status === "Active"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {admin.status}
                    </td>
                    <td className="py-3 px-4 border-b">{admin.createdAt}</td>
                    <td className="py-3 px-4 border-b">{admin.lastLogin}</td>
                    <td className="py-1 px-4 border-b text-center space-x-3">
                      <button
                        onClick={() => {
                          setSelectedAdmin(admin); // <-- set selected admin
                          setActiveTab("view"); // <-- switch tab
                        }}
                        className="text-blue-500 hover:text-blue-700 text-xl"
                      >
                        <FaEye />
                      </button>
                      <button className="text-yellow-500 hover:text-yellow-700 text-xl">
                        <FaEdit />
                      </button>
                      <button className="text-red-500 hover:text-red-700 text-xl">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="10"
                    className="text-center py-4 text-gray-500 italic"
                  >
                    No matching admins found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* CustomerView */}
      {activeTab === "view" && (
        <CustomerView
          user={selectedAdmin}
          goBack={() => setActiveTab("list")}
        />
      )}
    </div>
  );
};

export default CustomerList;
