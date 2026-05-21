export default function RecentOrders() {
  const orders = [
    {
      id: "#1001",
      customer: "Rahim",
      status: "Delivered",
      amount: "$120",
    },
    {
      id: "#1002",
      customer: "Karim",
      status: "Pending",
      amount: "$80",
    },
    {
      id: "#1003",
      customer: "Sadia",
      status: "Processing",
      amount: "$210",
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h2 className="text-lg font-bold text-slate-700 mb-5">
        Recent Orders
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-slate-400 text-sm">
              <th className="pb-3">Order</th>
              <th className="pb-3">Customer</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Amount</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order, index) => (
              <tr
                key={index}
                className="border-t border-slate-100"
              >
                <td className="py-4 font-semibold">{order.id}</td>
                <td>{order.customer}</td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold
                    ${
                      order.status === "Delivered"
                        ? "bg-emerald-100 text-emerald-600"
                        : order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="font-bold">{order.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}