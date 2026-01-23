import Navbar from "@/components/Navbar";
import React, { useState, useMemo } from "react";

export default function CourierDashboard() {
  const [couriers, setCouriers] = useState([
    {
      id: "C-1001",
      name: "Sundar Courier",
      phone: "01700-111222",
      area: "Dhaka",
      charge: 80,
    },
    {
      id: "C-1002",
      name: "FastX Delivery",
      phone: "01800-333444",
      area: "Chattogram",
      charge: 120,
    },
  ]);

  const [orders, setOrders] = useState([
    {
      orderId: "ORD-5001",
      customer: "Rahim",
      phone: "01911-000111",
      address: "Mirpur, Dhaka",
      total: 1450,
      status: "Pending",
      courierId: "C-1001",
    },
    {
      orderId: "ORD-5002",
      customer: "Karim",
      phone: "01622-888777",
      address: "Pahartali, Chattogram",
      total: 2990,
      status: "Processing",
      courierId: "",
    },
  ]);

  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    area: "",
    charge: "",
  });
  const [editId, setEditId] = useState(null);

  const courierMap = useMemo(() => {
    const map = {};
    couriers.forEach((c) => (map[c.id] = c));
    return map;
  }, [couriers]);

  const generateId = () => `C-${Date.now().toString().slice(-5)}`;

  const submitCourier = () => {
    if (!form.name || !form.phone) return alert("Name & phone required");

    if (editId) {
      setCouriers((prev) =>
        prev.map((c) =>
          c.id === editId ? { ...c, ...form, charge: +form.charge } : c,
        ),
      );
      setEditId(null);
    } else {
      setCouriers((prev) => [
        { id: generateId(), ...form, charge: +form.charge },
        ...prev,
      ]);
    }

    setForm({ name: "", phone: "", area: "", charge: "" });
  };

  const deleteCourier = (id) => {
    if (!confirm("Delete courier?")) return;
    setCouriers((prev) => prev.filter((c) => c.id !== id));
    setOrders((prev) =>
      prev.map((o) => (o.courierId === id ? { ...o, courierId: "" } : o)),
    );
  };

  return (
    <div className="min-h-screen bg-gray-100  mt-12 md:mt-0">
      <Navbar />
      <div className=" mx-auto space-y-6">
       

        {/* TOP SECTION */}
        <div className="grid md:w-2/3 md:grid-cols-2 gap-6">
          {/* FORM */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editId ? "Edit Courier" : "Add Courier"}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <input
                className="input"
                placeholder="Courier Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                className="input"
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <input
                className="input"
                placeholder="Area"
                value={form.area}
                onChange={(e) => setForm({ ...form, area: e.target.value })}
              />
              <input
                type="number"
                className="input"
                placeholder="Charge"
                value={form.charge}
                onChange={(e) => setForm({ ...form, charge: e.target.value })}
              />
            </div>

            <button
              onClick={submitCourier}
              className="mt-4 w-full bg-black text-white py-2 rounded-lg"
            >
              {editId ? "Update Courier" : "Add Courier"}
            </button>
          </div>

          {/* COURIER LIST */}
          <div className="bg-white rounded-xl shadow p-6 overflow-auto">
            <h2 className="text-xl font-semibold mb-4">Courier List</h2>
            <table className="w-full text-sm overflow-x-auto whitespace-nowrap">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2">Area</th>
                  <th className="p-2">Charge</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {couriers.map((c) => (
                  <tr key={c.id} className="border-t">
                    <td className="p-2 font-medium">{c.name}</td>
                    <td className="p-2">{c.area}</td>
                    <td className="p-2">৳{c.charge}</td>
                    <td className="p-2 space-x-5">
                      <button
                        onClick={() => {
                          setEditId(c.id);
                          setForm(c);
                        }}
                        className="text-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCourier(c.id)}
                        className="text-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="bg-white rounded-xl shadow p-6 overflow-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <h2 className="text-xl font-semibold">Orders</h2>

            {/* SEARCH (Order ID / Phone) */}
            <div className="flex gap-2 w-full md:w-auto">
              <input
                className="input md:w-56"
                placeholder="Search Order ID or Phone"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                onClick={() => setSearch("")}
                className="px-5 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-100"
              >
                Clear
              </button>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="p-2">Order</th>
                <th className="p-2">Customer</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Total</th>
                <th className="p-2">Status</th>
                <th className="p-2">Courier</th>
              </tr>
            </thead>
            <tbody>
              {orders
                .filter(
                  (o) =>
                    o.orderId.toLowerCase().includes(search.toLowerCase()) ||
                    o.phone?.includes(search),
                )
                .map((o) => (
                  <tr key={o.orderId} className="border-t">
                    <td className="p-2 font-medium">{o.orderId}</td>
                    <td className="p-2">{o.customer}</td>
                    <td className="p-2">{o.phone}</td>
                    <td className="p-2">৳{o.total}</td>
                    <td className="p-2">{o.status}</td>
                    <td className="p-2">
                      <select
                        className="border rounded px-2 py-1"
                        value={o.courierId}
                        onChange={(e) =>
                          setOrders((prev) =>
                            prev.map((x) =>
                              x.orderId === o.orderId
                                ? { ...x, courierId: e.target.value }
                                : x,
                            ),
                          )
                        }
                      >
                        <option value="">Unassigned</option>
                        {couriers.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tailwind helper */}
      <style>{`
        .input{border:1px solid #e5e7eb;padding:8px;border-radius:8px;width:100%;}
      `}</style>
    </div>
  );
}
