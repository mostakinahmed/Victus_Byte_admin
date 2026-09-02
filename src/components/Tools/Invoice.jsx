import React, { useContext, useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DataContext } from "@/Context Api/ApiContext";
import { FiDownload, FiFileText } from "react-icons/fi";

export default function Invoice({ order, close }) {
  if (!order) return null;

  // Financial Calculations for UI and PDF Consistency
  const subtotal = order.items.reduce(
    (sum, item) => sum + item.product_price * (item.quantity || 1),
    0,
  );

  // Financial Calculations for UI and PDF Consistency
  let totalDiscount = order.items.reduce(
    (sum, item) => sum + (Number(item.discount) || 0),
    0,
  );
  totalDiscount = totalDiscount + order.coupon?.value || 0;

  const handleDownload = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;

    // --- PDF Logic (Your Refined Original) ---
    try {
      doc.addImage("/logo/logo tp 1.png", "PNG", margin, 5, 110, 110);
    } catch (e) {
      doc.setFontSize(22);
      doc.setTextColor(255, 117, 31);
      doc.text("VICTUS BYTE", margin, 65);
    }

    const rightX = pageWidth - margin - 200;
    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text("Victus-Byte HQ", rightX, 35);
    doc.text("123 Market Street", rightX, 50);
    doc.text("Dhaka, Bangladesh", rightX, 65);
    doc.text("Email: support@victusbyte.com", rightX, 80);

    //only for number
    doc.setFont("helvetica", "normal");
    doc.text("Hotline: ", rightX, 95);

    const hotlineWidth = doc.getTextWidth("Hotline: ");

    doc.setFont("helvetica", "bold");
    doc.text("09611-342936", rightX + hotlineWidth, 95);
    //------------------

    doc.setDrawColor(180);
    doc.line(margin, 110, pageWidth - margin, 110);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(`Receipt / Invoice`, margin, 140);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Order ID: #${order.order_id}`, margin, 160);
    doc.text(`Date: ${order.order_date}`, margin, 175);

    const customerY = 200;
    doc.setFont("helvetica", "bold");
    doc.text("Bill To:", margin, customerY);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Name: ${order?.shipping_address.recipient_name}`,
      margin,
      customerY + 18,
    );
    doc.text(
      `Email: ${order.shipping_address.email || "Not Provided"}`,
      margin,
      customerY + 33,
    );
    doc.text(
      `Phone: ${order.shipping_address.phone || "N/A"}`,
      margin,
      customerY + 48,
    );
    doc.text(
      `Address: ${order.shipping_address.address_line1}`,
      margin,
      customerY + 63,
    );

    const tableRows = order.items.map((item) => [
      item.product_name,
      item.skuID || "N/A",
      (item.quantity || 1).toString(),
      item.product_price.toFixed(2),
      (item.product_price * (item.quantity || 1)).toFixed(2),
    ]);

    tableRows.push([
      { content: "Delivery Fee :", colSpan: 4, styles: { halign: "right" } },
      order.courier.delivery_charge,
    ]);
    tableRows.push([
      { content: "Discount :", colSpan: 4, styles: { halign: "right" } },
      `- ${totalDiscount}`,
    ]);
    tableRows.push([
      {
        content: "Total :",
        colSpan: 4,
        styles: { halign: "right", fontStyle: "bold" },
      },
      order.total_amount,
    ]);

    autoTable(doc, {
      startY: customerY + 90,
      head: [["Item", "SKU", "Quantity", "Price", "Total"]],
      body: tableRows,
      theme: "striped",
      headStyles: {
        fillColor: [255, 117, 31],
        textColor: 255,
        halign: "center",
      },
      styles: { fontSize: 10, cellPadding: 5 },
      columnStyles: { 0: { halign: "left" }, 4: { halign: "right" } },
      margin: { left: 40, right: 40 },
    });

    const footerY = doc.internal.pageSize.height - 40;
    doc.setFontSize(11);
    doc.setTextColor(120);
    doc.text(
      "Thank you for shopping with Victus-Byte! www.victusbyte.com",
      pageWidth / 2,
      footerY,
      { align: "center" },
    );

    doc.save(`VictusByte_Inv_${order.order_id}.pdf`);
    close(null);
  };

  return (
    <div className="bg-slate-100 p-4 min-h-screen flex flex-col items-center">
      {/* Floating Action Header */}
      <div className="flex gap-4 mb-3">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 bg-[#FF751F] text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-[#e6671a] shadow-xl transition-all active:scale-95 cursor-pointer"
        >
          <FiDownload size={18} /> Download PDF Invoice
        </button>
      </div>

      {/* --- UI PREVIEW (Matches PDF Layout) --- */}
      <div className="bg-white w-full max-w-[800px] shadow-2xl rounded-sm p-12 font-sans border border-slate-200 mb-6 overflow-hidden">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <img
            src="/logo/logo tp.png"
            alt="Logo"
            className="w-48 object-contain"
          />
          <div className="text-right text-[12px] text-slate-500 leading-relaxed">
            <p className="font-bold text-slate-800 text-sm">Victus-Byte HQ</p>
            <p>123 Market Street</p>
            <p>Dhaka, Bangladesh</p>
            <p>support@victusbyte.com</p>
            <p>09611-342936</p>
          </div>
        </div>

        <hr className="border-slate-200 mb-8" />

        {/* Invoice Title & Meta */}
        <div className="mb-10">
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
            Receipt / Invoice
          </h2>
          <div className="mt-2 text-sm text-slate-600">
            <p>
              <span className="font-bold">Order ID:</span> #{order.order_id}
            </p>
            <p>
              <span className="font-bold">Date:</span> {order.order_date}
            </p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="mb-12">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">
            Bill To:
          </h3>
          <div className="text-sm text-slate-700 space-y-1">
            <p>
              <span className="font-semibold">Name:</span>{" "}
              {order.shipping_address.recipient_name}
            </p>
            <p>
              <span className="font-semibold">Email:</span>{" "}
              {order.shipping_address.email || "Not Provided"}
            </p>
            <p>
              <span className="font-semibold">Phone:</span>{" "}
              {order.shipping_address.phone}
            </p>
            <p>
              <span className="font-semibold">Address:</span>{" "}
              {order.shipping_address.address_line1}
            </p>
          </div>
        </div>

        {/* Table Section */}
        <table className="w-full text-sm mb-8 border-collapse">
          <thead>
            <tr className="bg-[#FF751F] text-white">
              <th className="py-3 px-4 text-left rounded-tl-md">Item</th>
              <th className="py-3 px-4 text-center">SKU</th>
              <th className="py-3 px-4 text-center">Qty</th>
              <th className="py-3 px-4 text-center">Price</th>
              <th className="py-3 px-4 text-right rounded-tr-md">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 border-b border-slate-200">
            {order.items.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-4 font-medium text-slate-800">
                  {item.product_name}
                </td>
                <td className="py-4 px-4 text-center text-slate-500 font-mono">
                  {item.skuID || "N/A"}
                </td>
                <td className="py-4 px-4 text-center">{item.quantity}</td>
                <td className="py-4 px-4 text-center">
                  ৳{item.product_price.toFixed(2)}
                </td>
                <td className="py-4 px-4 text-right font-bold">
                  ৳{(item.product_price * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Financial Summary */}
        <div className="flex justify-end">
          <div className="w-full max-w-[300px] space-y-3">
            <div className="flex justify-between text-slate-500 text-sm">
              <span>Delivery Fee:</span>
              <span className="font-mono text-slate-800">
                ৳{order.courier.delivery_charge}
              </span>
            </div>
            <div className="flex justify-between text-slate-500 text-sm">
              <span>Discount:</span>
              <span className="font-mono text-rose-500">
                - ৳{totalDiscount}
              </span>
            </div>
            <div className="flex justify-between text-lg font-black text-[#FF751F] pt-3 border-t border-slate-100">
              <span>TOTAL:</span>
              <span className="font-mono italic">৳{order.total_amount}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-dashed border-slate-200 text-center">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-[0.2em]">
            Thank you for shopping with Victus-Byte!
          </p>
          <p className="text-[10px] text-indigo-400 mt-1">www.victusbyte.com</p>
        </div>
      </div>
    </div>
  );
}
