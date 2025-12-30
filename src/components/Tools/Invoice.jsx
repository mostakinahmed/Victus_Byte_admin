import { useContext, useRef, useState } from "react";
import jsPDF from "jspdf";
import { useReactToPrint } from "react-to-print";
import autoTable from "jspdf-autotable";
import { DataContext } from "@/Context Api/ApiContext";
import {
  FiFileText,
  FiDownload,
  FiPrinter,
  FiSearch,
  FiHash,
  FiUser,
  FiCalendar,
} from "react-icons/fi";

export default function Invoice() {
  const { orderData } = useContext(DataContext);
  const [orderId, setOrderId] = useState(""); // Raw input value
  const [order, setOrder] = useState(null); // Generated order data
  const [error, setError] = useState(false); // Only true if search fails after click

  const receiptRef = useRef();

  // 1. Passive Input Handler (No checking logic here)
  const handleInputChange = (e) => {
    setOrderId(e.target.value);
    if (error) setError(false); // Clear error when user types new ID
  };

  // 2. Generate Logic (Only triggers on Button Click or Enter)
  const handleGenerate = () => {
    const trimmedId = orderId.trim();
    if (!trimmedId) {
      setOrder(null);
      return;
    }

    const foundOrder = orderData.find(
      (o) => o.order_id.toString() === trimmedId
    );

    if (foundOrder) {
      setOrder(foundOrder);
      setError(false);
    } else {
      setOrder(null);
      setError(true);
    }
  };

  // 3. Browser Print Handler
  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
    documentTitle: `Receipt_${order ? order.order_id : "Order"}`,
  });

  // 4. RESTORED ORIGINAL PDF DESIGN (Orange Header & Custom Branding)
  const handleDownload = () => {
    if (!order) return;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;

    // --- Logo Section ---
    const logoWidth = 135;
    const logoHeight = 60;
    // Ensure this path matches your public folder exactly
    doc.addImage("/logo final.png", "PNG", margin, 30, logoWidth, logoHeight);

    // --- Company Info (Restored Position) ---
    const rightX = pageWidth - margin - 200;
    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text("Victus-Byte HQ", rightX, 40);
    doc.text("123 Market Street", rightX, 55);
    doc.text("Dhaka, Bangladesh", rightX, 70);
    doc.text("Email: support@victusbyte.com", rightX, 85);
    doc.text("Phone: +880 1234 567890", rightX, 100);

    // --- Divider Line ---
    doc.setDrawColor(180);
    doc.line(margin, 110, pageWidth - margin, 110);

    // --- Title ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(`Receipt / Invoice`, margin, 140);

    // --- Receipt Info ---
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Order ID: #${order.order_id}`, margin, 160);
    doc.text(`Date: ${order.order_date}`, margin, 175);

    // --- Customer Info ---
    const customerY = 200;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Bill To:", margin, customerY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(
      `Name: ${order.shipping_address.recipient_name}`,
      margin,
      customerY + 18
    );
    doc.text(
      `Email: ${order.shipping_address.email || "Not Provided"}`,
      margin,
      customerY + 33
    );
    doc.text(
      `Phone: ${order.shipping_address.phone || "+880 0000 000000"}`,
      margin,
      customerY + 48
    );
    doc.text(
      `Address: ${order.shipping_address.address_line1}`,
      margin,
      customerY + 63
    );

    // --- Table Preparation ---
    const startTableY = customerY + 90;
    const tableColumn = ["Item", "SKU", "Quantity", "Price", "Total"];
    const tableRows = [];

    order.items.forEach((item) => {
      const total = item.product_price * item.quantity;
      tableRows.push([
        item.product_name,
        item.skuID || "N/A",
        item.quantity.toString(),
        `${item.product_price.toFixed(2)}`,
        `${total.toFixed(2)}`,
      ]);
    });

    const subtotal = order.items.reduce(
      (sum, item) => sum + item.product_price * item.quantity,
      0
    );

    // Financial Summary Rows
    tableRows.push([
      { content: "Delivery Fee :", colSpan: 4, styles: { halign: "right" } },
      `${order.shipping_cost.toFixed(2)}`,
    ]);
    tableRows.push([
      { content: "Discount :", colSpan: 4, styles: { halign: "right" } },
      `- ${order.discount.toFixed(2)}`,
    ]);
    tableRows.push([
      {
        content: "Total :",
        colSpan: 4,
        styles: { halign: "right", fontStyle: "bold" },
      },
      `${(subtotal + order.shipping_cost - order.discount).toFixed(2)}`,
    ]);

    // --- RESTORED ORIGINAL ORANGE STYLING ---
    autoTable(doc, {
      startY: startTableY,
      head: [tableColumn],
      body: tableRows,
      theme: "striped",
      headStyles: {
        fillColor: [255, 117, 31], // Your Original Orange
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
      },
      styles: {
        fontSize: 11,
        cellPadding: 6,
        valign: "middle",
        halign: "center",
      },
      columnStyles: {
        0: { halign: "left" },
        4: { halign: "right" },
      },
      margin: { left: 40, right: 40 },
    });

    // --- Footer ---
    const footerY = doc.internal.pageSize.height - 40;
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text(
      "Thank you for shopping with Victus-Byte! www.victusbyte.com",
      pageWidth / 2,
      footerY,
      { align: "center" }
    );

    doc.save(`receipt_${order.order_id}.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-50 ">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* --- SEARCH BAR: Passive Mode --- */}
        <div className="bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50 mb-8 border border-slate-100">
          <div className="flex flex-col lg:flex-row gap-2">
            <div className="relative flex-1 group">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="text"
                placeholder="Enter Order ID (e.g. OID1012023034045)__"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-transparent rounded-xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-500 transition-all"
                value={orderId}
                onChange={handleInputChange}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              />
            </div>
            <button
              className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-600 shadow-lg transition-all active:scale-[0.98]"
              onClick={handleGenerate}
            >
              Generate
            </button>
          </div>
        </div>

        {/* --- ERROR MESSAGE: Only after click --- */}
        {error && (
          <div className="mt-4 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-center animate-shake">
            <p className="text-xs font-black text-rose-600 uppercase tracking-widest">
              Error: Order Reference #{orderId} not found.
            </p>
          </div>
        )}

        {/* --- SCREEN DISPLAY RECEIPT --- */}
        {order && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div
              className="bg-white rounded-t-[32px] shadow overflow-hidden border border-slate-200 print:shadow-none"
              ref={receiptRef}
            >
              {/* Header */}
              <div className="bg-slate-900 px-10 py-3 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-500 rounded-2xl text-white shadow-xl shadow-indigo-500/20">
                    <FiFileText size={32} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-black tracking-tighter uppercase">
                      Official Receipt
                    </h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                      Identity Registry Sync
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">
                    Status
                  </p>
                  <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                    {order.payment?.status || "Verified"}
                  </span>
                </div>
              </div>

              <div className="px-10 py-5">
                {/* Meta Data */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 border-b border-slate-100 pb-2">
                  <div className="space-y-1">
                    <p className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <FiHash className="text-indigo-500" /> Reference ID
                    </p>
                    <p className="text-sm font-mono font-black text-slate-800">
                      #{order.order_id}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <FiUser className="text-indigo-500" /> Billed To
                    </p>
                    <p className="text-sm font-black text-slate-800 uppercase">
                      {order.shipping_address.recipient_name}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <FiCalendar className="text-indigo-500" /> Issue Date
                    </p>
                    <p className="text-sm font-bold text-slate-600">
                      {order.order_date}
                    </p>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-2xl border border-slate-100 mb-8">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          Description
                        </th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">
                          Qty
                        </th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">
                          Unit Price
                        </th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {order.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-6 py-4">
                            <span className="text-sm font-black text-slate-800 uppercase tracking-tight">
                              {item.product_name}
                            </span>
                            <p className="text-[9px] font-mono text-slate-400 uppercase">
                              {item.skuID}
                            </p>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="text-sm font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
                              x{item.quantity}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-sm text-slate-500">
                              ৳{item.product_price}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-sm font-black text-slate-900">
                              ৳{(item.product_price * item.quantity).toFixed(2)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="flex flex-col items-end gap-3 mt-10 pr-6">
                  <div className="w-full md:w-64 space-y-3">
                    <div className="flex justify-between text-slate-400">
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        Sub-Total
                      </span>
                      <span className="text-sm font-bold">
                        ৳
                        {order.items
                          .reduce(
                            (sum, item) =>
                              sum + item.product_price * item.quantity,
                            0
                          )
                          .toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-rose-500">
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        Discount
                      </span>
                      <span className="text-sm font-bold">
                        -৳{order.discount.toFixed(2)}
                      </span>
                    </div>
                    <div className="pt-4 border-t-2 border-slate-900 flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                          Grand Total
                        </p>
                        <p className="text-3xl font-black text-slate-900 tracking-tighter">
                          ৳{order.total_amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* --- ACTION BUTTONS --- */}
            <div className="flex justify-center gap-4 mt-8 pb-10">
              <button
                className="flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow active:scale-95"
                onClick={handlePrint}
              >
                <FiPrinter className="text-indigo-600" /> Print
              </button>
              <button
                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-indigo-700 shadow active:scale-95"
                onClick={handleDownload}
              >
                <FiDownload /> Download PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
