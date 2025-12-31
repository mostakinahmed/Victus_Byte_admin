import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.vfs;

export const generateProductPDF = async (productData) => {
  if (!productData || productData.length === 0) {
    alert("No product data available!");
    return;
  }

  async function getBase64ImageFromURL(url) {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  const base64Img = await getBase64ImageFromURL(
    "https://i.ibb.co/k2ZHf5WM/logo-full-final.png"
  );

  const tableBody = [
    [
      { text: "SL", bold: true, alignment: "center", margin: [0, 5, 0, 0] },
      {
        text: "Product_ID",
        bold: true,
        alignment: "left",
        margin: [0, 5, 0, 0],
      },
      {
        text: "Product Name",
        bold: true,
        alignment: "left",
        margin: [0, 5, 0, 0],
      },
      { text: "Cat_ID", bold: true, alignment: "left", margin: [0, 5, 0, 0] },
      { text: "Brand", bold: true, alignment: "left", margin: [0, 5, 0, 0] },
      {
        text: "Stock_ID",
        bold: true,
        alignment: "center",
        margin: [0, 5, 0, 0],
      },
      {
        text: "SKU List",
        bold: true,
        alignment: "center",
        margin: [0, 5, 0, 0],
      },
      {
        text: "U_Price",
        bold: true,
        alignment: "center",
        margin: [0, 5, 0, 0],
      },
      {
        text: "Total_V",
        bold: true,
        alignment: "center",
        margin: [0, 5, 0, 0],
      },
    ],
  ];

  productData.forEach((item, index) => {
    tableBody.push([
      {
        text: index + 1,
        alignment: "center",
        margin: [0, 5, 0, 5],
        color: "#111827",
      },
      {
        text: item.pID,
        alignment: "left",
        margin: [0, 5, 0, 5],
        color: "#111827",
      },
      {
        text: item.name,
        alignment: "left",
        margin: [0, 5, 0, 5],
        color: "#111827",
      },
      {
        text: item.category,
        alignment: "left",
        margin: [0, 5, 0, 5],
        color: "#111827",
      },
      {
        text: item.brandName,
        alignment: "left",
        margin: [0, 5, 0, 5],
        color: "#111827",
      },
      {
        text: item.stock?.toLocaleString() || 0,
        alignment: "center",
        margin: [0, 5, 0, 5],
        color: "#111827",
      },
      {
        text: "SKU123456789\nSKU325612534\nSKU896574213\nSKU123456789\nSKU325612534\nSKU896574213",
        alignment: "center",
        margin: [0, 5, 0, 1],
        color: "#111827",
      },
      {
        text: item.price.selling?.toLocaleString() || 0,
        alignment: "center",
        margin: [0, 5, 0, 5],
        color: "#111827",
      },
      {
        text: item.totalValue?.toLocaleString() || 0,
        alignment: "center",
        margin: [0, 5, 0, 5],
        color: "#111827",
      },
    ]);
  });

  const docDefinition = {
    pageSize: "A4",
    pageMargins: [20, 70, 20, 20],
    header: {
      columns: [
        { image: base64Img, width: 80, margin: [20, 15, 10, 0] },
        {
          text: "VICTUS BYTE - Stock Report",
          alignment: "center",
          fontSize: 16,
          bold: true,
          margin: [0, 25, 15, 0],
        },
      ],
    },
    footer: (currentPage, pageCount) => {
      const now = new Date();
      const formattedDate = now.toLocaleDateString(); // e.g., "11/24/2025"
      const formattedTime = now.toLocaleTimeString(); // e.g., "22:15:30"

      return {
        columns: [
          {
            text: `Generated on: ${formattedDate} ${formattedTime}`,
            alignment: "left",
            fontSize: 9,
            color: "#6B7280", // gray-400
          },
          {
            text: `Page ${currentPage} of ${pageCount}`,
            alignment: "right",
            fontSize: 9,
            color: "#6B7280", // gray-400
          },
        ],
        margin: [20, 0, 20, 0],
      };
    },

    content: [
      {
        table: {
          headerRows: 1,
          dontBreakRows: true,
          widths: [15, 40, "*", 30, 50, 40, 80, 40, 40],
          body: tableBody,
        },
        layout: "lightHorizontalLines",
        fontSize: 8,
      },
    ],
  };

  pdfMake.createPdf(docDefinition).download("Product_Stock_Report.pdf");
};
