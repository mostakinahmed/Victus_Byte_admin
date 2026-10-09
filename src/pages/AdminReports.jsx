import React, { useState, useContext, useMemo } from "react";
import { DataContext } from "../Context Api/ApiContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // <-- FIXED IMPORT METHOD
import Navbar from "@/components/Navbar";

export default function AdminReports() {
  const { orderData, stockData, productData } = useContext(DataContext);

  const [reportType, setReportType] = useState("orders"); // 'orders', 'products', 'stock'

  // Filter States
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [stockTypeFilter, setStockTypeFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // 1. DYNAMIC DATA FILTERING LOGIC
  const filteredData = useMemo(() => {
    if (reportType === "orders") {
      let list = Array.isArray(orderData) ? orderData : [];
      if (startDate && endDate) {
        list = list.filter(
          (item) => item.order_date >= startDate && item.order_date <= endDate,
        );
      }
      if (statusFilter !== "ALL") {
        list = list.filter(
          (item) => item.courier?.delivery_status === statusFilter,
        );
      }
      if (searchQuery) {
        list = list.filter(
          (item) =>
            item.order_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.shipping_address?.recipient_name
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()),
        );
      }
      return list;
    }

    if (reportType === "products") {
      let list = Array.isArray(productData) ? productData : [];
      if (categoryFilter !== "ALL") {
        list = list.filter(
          (item) =>
            item.category?.toLowerCase() === categoryFilter.toLowerCase(),
        );
      }
      if (searchQuery) {
        list = list.filter(
          (item) =>
            item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.pID?.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      }
      return list;
    }

    if (reportType === "stock") {
      let list = Array.isArray(stockData) ? stockData : [];
      if (stockTypeFilter === "AVAILABLE") {
        list = list.filter((s) => s.SKU?.some((sku) => sku.status === true));
      } else if (stockTypeFilter === "STOCK_OUT") {
        list = list.filter(
          (s) =>
            !s.SKU ||
            s.SKU.length === 0 ||
            s.SKU.every((sku) => sku.status === false),
        );
      } else if (stockTypeFilter === "SPECIFIC" && searchQuery) {
        list = list.filter(
          (s) =>
            s.pID?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.sID?.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      }
      return list;
    }

    return [];
  }, [
    reportType,
    orderData,
    productData,
    stockData,
    startDate,
    endDate,
    statusFilter,
    categoryFilter,
    stockTypeFilter,
    searchQuery,
  ]);

  // 2. ROBUST CLIENT-SIDE PDF GENERATOR & DOWNLOADER
  // 2. ROBUST CLIENT-SIDE PDF GENERATOR & DOWNLOADER
  const handleDownloadPDF = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // --- HEADER SECTION ---
    // Left Side: Store Branding / Name (Placeholder for Logo image base64 if available)
    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42);
    try {
      doc.addImage("/logo/only shop.png", "PNG", 14, 10, 40, 10);
    } catch (error) {
      // Fallback text if logo fails to load
      doc.setFontSize(16);
      doc.setTextColor(15, 23, 42);
      doc.text("VICTUS BYTE", 14, 18);
    }

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text("Official Management & Audit Report", 14, 24);

    // Right Side: Dynamic Recipient / Filter Details (If searching for a specific customer/order)
    if (reportType === "orders" && searchQuery) {
      doc.setFontSize(10);
      doc.setTextColor(30, 41, 59);
      doc.text(`Customer: ${searchQuery}`, pageWidth - 14, 14, {
        align: "right",
      });
      doc.text(
        `   Phone: ${filteredData[0]?.shipping_address?.phone}`,
        pageWidth - 14,
        19,
        {
          align: "right",
        },
      );
    }
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Report Type: ${reportType.toUpperCase()}`, pageWidth - 14, 24, {
      align: "right",
    });

    // Divider Line
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 28, pageWidth - 14, 28);

    let tableColumn = [];
    let tableRows = [];

    if (reportType === "orders") {
      tableColumn = [
        "Order ID",
        "Date",
        "Recipient",
        "Items Summary",
        "Status",
        "Total",
      ];
      filteredData.forEach((order) => {
        const itemsText =
          order.items
            ?.map((i) => `${i.quantity}x ${i.product_name}`)
            .join(", ") || "";

        // Fixed first 10 characters for the date string
        const formattedDate = order.order_date
          ? order.order_date.substring(0, 10)
          : "N/A";

        tableRows.push([
          order.order_id,
          formattedDate, // <--- Using the cleaned 10-char date here
          order.shipping_address?.recipient_name || "N/A",
          itemsText,
          order.courier?.delivery_status || "Pending",
          `${(order.total_amount || 0).toFixed(2)}`,
        ]);
      });

      autoTable(doc, {
        startY: 34,
        head: [tableColumn],
        body: tableRows,
        theme: "grid",
        headStyles: { fillColor: [234, 88, 12] },
        styles: { fontSize: 8, cellPadding: 3 },
        // --- ADD THIS COLUMN STYLES CONFIG ---
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 20 },
          2: { cellWidth: 35 },
          3: { cellWidth: 70 },
          4: { cellWidth: 20 },
          5: { cellWidth: 20 },
        },
      });
    } else if (reportType === "products") {
      tableColumn = ["PID", "Name", "Brand", "Category ID", "Price", "SID"];
      filteredData.forEach((p) => {
        tableRows.push([
          p.pID,
          p.name,
          p.brandName || "N/A",
          p.category || "N/A",
          `${p.price?.selling || 0}`,
          p.stock || "0",
        ]);
      });

      autoTable(doc, {
        startY: 34,
        head: [tableColumn],
        body: tableRows,
        theme: "grid",
        headStyles: { fillColor: [234, 88, 12] },
        styles: { fontSize: 8, cellPadding: 3 },
      });
    } else if (reportType === "stock") {
      tableColumn = [
        "Stock ID",
        "Product ID",
        "SKU ID",
        "Cost",
        "Status",
        "Comment",
      ];
      filteredData.forEach((s) => {
        if (s.SKU && Array.isArray(s.SKU)) {
          s.SKU.forEach((sku) => {
            if (stockTypeFilter === "AVAILABLE" && !sku.status) return;
            if (stockTypeFilter === "STOCK_OUT" && sku.status) return;

            tableRows.push([
              s.sID,
              s.pID,
              sku.skuID,
              `${sku.cost || 0}`,
              sku.status ? "Active" : "Inactive",
              sku.comment || "N/A",
            ]);
          });
        }
      });

      autoTable(doc, {
        startY: 34,
        head: [tableColumn],
        body: tableRows,
        theme: "grid",
        headStyles: { fillColor: [234, 88, 12] },
        styles: { fontSize: 8, cellPadding: 3 },
      });
    }

    // --- FOOTER SECTION (Generation Timestamp) ---
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      // Bottom Left: Timestamp
      doc.text(
        `Generated On: ${new Date().toLocaleString()}`,
        14,
        doc.internal.pageSize.getHeight() - 10,
      );
      // Bottom Right: Page Numbering
      doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth - 14,
        doc.internal.pageSize.getHeight() - 10,
        { align: "right" },
      );
    }

    doc.save(`victus-byte-${reportType}-report-${Date.now()}.pdf`);
  };

  return (
    <div className=" mx-auto">
      <Navbar pageTitle="Report Management" />
      <div className="bg-white rounded border border-slate-200 p-4">
        {/* Section Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-6">
          {/* Tabs */}
          <div className="inline-flex items-center gap-2 p-1 bg-slate-100 border border-slate-300 rounded w-fit shadow-xs">
            {["orders", "products", "stock"].map((type) => (
              <button
                key={type}
                onClick={() => {
                  setReportType(type);
                  setSearchQuery("");
                }}
                className={`px-5 py-2 rounded text-sm font-semibold capitalize transition-all duration-200 cursor-pointer ${
                  reportType === type
                    ? "bg-black text-white shadow-xs border border-slate-200"
                    : "text-slate-800 hover:text-slate-900 hover:bg-white/70"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownloadPDF}
            className="group h-10 inline-flex items-center justify-center gap-2 px-4 rounded bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-y-0.5"
            >
              <path d="M12 3v12" />
              <path d="m7 10 5 5 5-5" />
              <path d="M5 21h14" />
            </svg>

            <span>Download PDF</span>

            <span className="ml-1 px-2 py-0.5 rounded-md bg-white/10 text-xs font-semibold">
              {filteredData.length}
            </span>
          </button>
        </div>

        {/* Advanced Filter Toolbar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 bg-slate-100 p-4 rounded-xl border border-slate-200/60">
          {reportType === "orders" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  Search ID / Customer
                </label>
                <input
                  type="text"
                  placeholder="Order ID or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-2 text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-2 text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-2 text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  Delivery Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-2 text-sm outline-none focus:border-blue-500"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </>
          )}

          {reportType === "products" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  Search Product
                </label>
                <input
                  type="text"
                  placeholder="Product name or pID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  Filter by Category
                </label>
                <input
                  type="text"
                  placeholder="e.g. Smartphones (or ALL)"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </>
          )}

          {reportType === "stock" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  Stock Mode
                </label>
                <select
                  value={stockTypeFilter}
                  onChange={(e) => setStockTypeFilter(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm outline-none focus:border-blue-500"
                >
                  <option value="ALL">All Stock Records</option>
                  <option value="AVAILABLE">Available Stock Only</option>
                  <option value="STOCK_OUT">Stock Out / Inactive</option>
                  <option value="SPECIFIC">Specific Product (pID)</option>
                </select>
              </div>

              {stockTypeFilter === "SPECIFIC" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                    Enter Product ID (pID)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. PROD-101"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Live Preview Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
            Live Preview Table ({filteredData.length} records)
          </div>
          <div className="h-130 overflow-y-auto">
            <table className="w-full text-left border-collapse text-sm  whitespace-nowrap overflow-x-auto">
              <thead className="bg-slate-50 text-slate-600 sticky top-0 border-b border-slate-200">
                <tr>
                  <th className="p-3 font-semibold">Primary ID</th>
                  <th className="p-3 font-semibold">Name / Details</th>
                  <th className="p-3 font-semibold">Category / SKU</th>
                  <th className="p-3 font-semibold">Status/ Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50">
                      <td className="p-3 font-medium text-slate-800">
                        {item.order_id || item.pID || item.sID || "N/A"}
                      </td>
                      <td className="p-3 text-slate-600">
                        {item.name ||
                          item.shipping_address?.recipient_name ||
                          (item.SKU
                            ? `${item.SKU.length} SKU Variants`
                            : "N/A")}
                      </td>
                      <td className="p-3 text-slate-600">
                        {item.category ||
                          item.order_date ||
                          (item.SKU
                            ? item.SKU.map((s) => s.skuID).join(", ")
                            : "N/A")}
                      </td>
                      <td className="p-3 text-slate-600">
                        {item.total_amount
                          ? `${item.total_amount}`
                          : item.price?.selling
                            ? `${item.price.selling}`
                            : item.courier?.delivery_status || "Active Stock"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="p-6 text-center text-slate-400 italic"
                    >
                      No matching records found. Adjust your filters above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
