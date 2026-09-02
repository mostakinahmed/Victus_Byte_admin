import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FiDownload } from "react-icons/fi";

// Compress logo with high quality
const compressImage = (src, maxSize = 1000, quality = 0.92) => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Resize only if the image is larger than maxSize
      if (width > maxSize || height > maxSize) {
        const ratio = Math.min(maxSize / width, maxSize / height);

        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");

      // Better quality image rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // White background for PNG transparency
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);

      ctx.drawImage(img, 0, 0, width, height);

      // Convert PNG to high-quality JPEG
      resolve(canvas.toDataURL("image/jpeg", quality));
    };

    img.onerror = (error) => reject(error);

    img.src = src;
  });
};

export default function Invoice({ order, close }) {
  if (!order) return null;

  // Financial calculations
  const subtotal = order.items.reduce(
    (sum, item) =>
      sum + Number(item.product_price || 0) * Number(item.quantity || 1),
    0,
  );

  let totalDiscount = order.items.reduce(
    (sum, item) => sum + (Number(item.discount) || 0),
    0,
  );

  totalDiscount += Number(order.coupon?.value) || 0;

  const handleDownload = async () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
      compress: true,
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;

    // Add compressed high-quality logo
    try {
      const compressedLogo = await compressImage(
        "/logo/logo tp 1.png",
        1000,
        0.92,
      );

      doc.addImage(
        compressedLogo,
        "JPEG",
        margin,
        5,
        110,
        110,
        undefined,
        "SLOW",
      );
    } catch (e) {
      console.error("Logo loading failed:", e);

      doc.setFontSize(22);
      doc.setTextColor(255, 117, 31);
      doc.text("VICTUS BYTE", margin, 65);
    }

    // Company information
    const rightX = pageWidth - margin - 200;

    doc.setFontSize(10);
    doc.setTextColor(80);

    doc.text("Victus-Byte HQ", rightX, 35);
    doc.text("123 Market Street", rightX, 50);
    doc.text("Dhaka, Bangladesh", rightX, 65);
    doc.text("Email: support@victusbyte.com", rightX, 80);

    // Hotline
    doc.setFont("helvetica", "normal");
    doc.text("Hotline: ", rightX, 95);

    const hotlineWidth = doc.getTextWidth("Hotline: ");

    doc.setFont("helvetica", "bold");
    doc.text("09611-342936", rightX + hotlineWidth, 95);

    // Header line
    doc.setDrawColor(180);
    doc.line(margin, 110, pageWidth - margin, 110);

    // Invoice title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);

    doc.text("Receipt / Invoice", margin, 140);

    // Order information
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    doc.text(`Order ID: #${order.order_id}`, margin, 160);
    doc.text(`Date: ${order.order_date}`, margin, 175);

    // Customer information
    const customerY = 200;

    doc.setFont("helvetica", "bold");
    doc.text("Bill To:", margin, customerY);

    doc.setFont("helvetica", "normal");

    doc.text(
      `Name: ${order?.shipping_address?.recipient_name || "N/A"}`,
      margin,
      customerY + 18,
    );

    doc.text(
      `Email: ${order?.shipping_address?.email || "Not Provided"}`,
      margin,
      customerY + 33,
    );

    doc.text(
      `Phone: ${order?.shipping_address?.phone || "N/A"}`,
      margin,
      customerY + 48,
    );

    doc.text(
      `Address: ${order?.shipping_address?.address_line1 || "N/A"}`,
      margin,
      customerY + 63,
    );

    // Product table rows
    const tableRows = order.items.map((item) => {
      const quantity = Number(item.quantity || 1);
      const price = Number(item.product_price || 0);

      return [
        item.product_name || "N/A",
        item.skuID || "N/A",
        quantity.toString(),
        price.toFixed(2),
        (price * quantity).toFixed(2),
      ];
    });

    // Delivery Fee
    tableRows.push([
      {
        content: "Delivery Fee :",
        colSpan: 4,
        styles: {
          halign: "right",
        },
      },
      Number(order?.courier?.delivery_charge || 0).toFixed(2),
    ]);

    // Discount
    tableRows.push([
      {
        content: "Discount :",
        colSpan: 4,
        styles: {
          halign: "right",
        },
      },
      `- ${totalDiscount.toFixed(2)}`,
    ]);

    // Total
    tableRows.push([
      {
        content: "Total :",
        colSpan: 4,
        styles: {
          halign: "right",
          fontStyle: "bold",
        },
      },
      Number(order.total_amount || 0).toFixed(2),
    ]);

    // Generate product table
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

      styles: {
        fontSize: 10,
        cellPadding: 5,
      },

      columnStyles: {
        0: {
          halign: "left",
        },

        4: {
          halign: "right",
        },
      },

      margin: {
        left: margin,
        right: margin,
      },
    });

    // Footer
    const footerY = doc.internal.pageSize.height - 40;

    doc.setFontSize(10);
    doc.setTextColor(120);

    doc.text(
      "Thank you for shopping with Victus-Byte! www.victusbyte.com",
      pageWidth / 2,
      footerY,
      {
        align: "center",
      },
    );

    // Save PDF
    doc.save(`VictusByte_Inv_${order.order_id}.pdf`);

    // Close invoice
    close?.(null);
  };

  return (
    <div className="bg-slate-100 p-4 min-h-screen flex flex-col items-center">
      {/* Download Button */}
      <div className="flex gap-4 mb-3">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 bg-[#FF751F] text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-[#e6671a] shadow-xl transition-all active:scale-95 cursor-pointer"
        >
          <FiDownload size={18} />
          Download PDF Invoice
        </button>
      </div>

      {/* Invoice Preview */}
      <div className="bg-white w-full max-w-[800px] shadow-2xl rounded-sm p-12 font-sans border border-slate-200 mb-6 overflow-hidden">
        {/* Header */}
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

        {/* Invoice Info */}
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
              {order.shipping_address?.recipient_name || "N/A"}
            </p>

            <p>
              <span className="font-semibold">Email:</span>{" "}
              {order.shipping_address?.email || "Not Provided"}
            </p>

            <p>
              <span className="font-semibold">Phone:</span>{" "}
              {order.shipping_address?.phone || "N/A"}
            </p>

            <p>
              <span className="font-semibold">Address:</span>{" "}
              {order.shipping_address?.address_line1 || "N/A"}
            </p>
          </div>
        </div>

        {/* Product Table */}
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

                <td className="py-4 px-4 text-center">{item.quantity || 1}</td>

                <td className="py-4 px-4 text-center">
                  ৳{Number(item.product_price || 0).toFixed(2)}
                </td>

                <td className="py-4 px-4 text-right font-bold">
                  ৳
                  {(
                    Number(item.product_price || 0) * Number(item.quantity || 1)
                  ).toFixed(2)}
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
                ৳{Number(order?.courier?.delivery_charge || 0).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-slate-500 text-sm">
              <span>Discount:</span>

              <span className="font-mono text-rose-500">
                - ৳{totalDiscount.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-lg font-black text-[#FF751F] pt-3 border-t border-slate-100">
              <span>TOTAL:</span>

              <span className="font-mono italic">
                ৳{Number(order.total_amount || 0).toFixed(2)}
              </span>
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
