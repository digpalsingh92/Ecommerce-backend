import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateInvoicePDF = (order, filePath) => {
  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text("Invoice", { align: "center" });
  doc.moveDown();

  doc.fontSize(14).text(`Order ID: ${order._id}`);
  doc.text(`User: ${order.user.fullName || order.user.email}`);
  doc.text(`Status: ${order.status}`);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
  doc.moveDown();

  doc.fontSize(16).text("Items:");
  order.items.forEach((item, index) => {
    doc.fontSize(12).text(
      `${index + 1}. ${item.product.title} - ₹${item.product.price} x ${item.quantity}`
    );
  });

  doc.moveDown();
  doc.fontSize(14).text(`Total Amount: ₹${order.totalAmount}`, { align: "right" });

  doc.end();
};
