import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateInvoicePDF = (order, filePath) => {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });

  doc.pipe(fs.createWriteStream(filePath));

  // Load DejaVu font that supports ₹ symbol
  const fontPath = path.resolve('fonts', 'DejaVuSans-Bold.ttf');
  doc.registerFont('DejaVu', fontPath);
  doc.font('DejaVu');

  // Colors - Premium theme
  const primaryColor = '#1F2937';   // Dark Gray
  const accentColor = '#4F46E5';    // Indigo
  const lightBg = '#F9FAFB';
  const borderColor = '#E5E7EB';
  const textColor = '#374151';
  const rupeeSymbol = '₹';

  // ===== Header =====
  doc.fillColor(accentColor)
     .fontSize(26)
     .text('INVOICE', 50, 50, { align: 'center' });

  doc.fillColor(textColor)
     .fontSize(11)
     .text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`, 400, 60, { align: 'right' });

  // ===== Company Info =====
  const companyTop = 100;

  // Company Details - Left
  doc.fontSize(12)
     .fillColor(textColor)
     .text('wellplayed Pvt Ltd', 50, companyTop)
     .text('khopcha, street 420, Noida', 50, companyTop + 15)
     .text('Uttar Pradesh, 201301, India', 50, companyTop + 30)
     .text('Phone: +91 9192939495', 50, companyTop + 45)
     .text('Email: info@wellplayed.com', 50, companyTop + 60);

  // Invoice Info - Right
  doc.fillColor(accentColor)
     .fontSize(12)
     .text(`Invoice #: INV-${order._id.toString().slice(-6)}`, 280, companyTop)
     .fillColor(textColor)
     .text(`Order ID: ${order._id}`, 280, companyTop + 20)
     .text(`Status: ${order.status.toUpperCase()}`, 280, companyTop + 40);

  // ===== Customer Details =====
  const customerTop = companyTop + 90;
  doc.fillColor(accentColor)
     .fontSize(14)
     .text('Bill To:', 50, customerTop);

  doc.fillColor(textColor)
     .fontSize(12)
     .text(`${order.user.fullName || 'N/A'}`, 50, customerTop + 20)
     .text(`${order.user.email}`, 50, customerTop + 35);

  // ===== Table Header =====
  const tableTop = customerTop + 70;
  const tableLeft = 50;
  const tableWidth = 500;

  doc.rect(tableLeft, tableTop, tableWidth, 30)
     .fillColor(lightBg)
     .fill();

  doc.fillColor(textColor)
     .font('DejaVu')
     .fontSize(12)
     .text('S.No', tableLeft + 10, tableTop + 10, { width: 40 })
     .text('Item', tableLeft + 60, tableTop + 10, { width: 200 })
     .text('Price', tableLeft + 270, tableTop + 10, { width: 70, align: 'right' })
     .text('Qty', tableLeft + 350, tableTop + 10, { width: 50, align: 'center' })
     .text('Total', tableLeft + 410, tableTop + 10, { width: 80, align: 'right' });

  // ===== Table Rows =====
  let currentY = tableTop + 30;
  let subtotal = 0;

  order.items.forEach((item, index) => {
    const itemTotal = item.product.price * item.quantity;
    subtotal += itemTotal;

    if (index % 2 === 0) {
      doc.rect(tableLeft, currentY, tableWidth, 25)
         .fillColor('#FFFFFF')
         .fill();
    }

    doc.fillColor(textColor)
       .fontSize(11)
       .text(index + 1, tableLeft + 10, currentY + 8, { width: 40 })
       .text(item.product.title, tableLeft + 60, currentY + 8, { width: 200 })
       .text(`${rupeeSymbol}${item.product.price.toFixed(2)}`, tableLeft + 270, currentY + 8, { width: 70, align: 'right' })
       .text(item.quantity, tableLeft + 350, currentY + 8, { width: 50, align: 'center' })
       .text(`${rupeeSymbol}${itemTotal.toFixed(2)}`, tableLeft + 410, currentY + 8, { width: 80, align: 'right' });

    currentY += 25;
  });

  // Table borders
  doc.rect(tableLeft, tableTop, tableWidth, currentY - tableTop)
     .strokeColor(borderColor)
     .stroke();

  const columnPositions = [90, 340, 400, 460];
  columnPositions.forEach(pos => {
    doc.moveTo(pos, tableTop)
       .lineTo(pos, currentY)
       .stroke();
  });

  for (let y = tableTop + 30; y < currentY; y += 25) {
    doc.moveTo(tableLeft, y)
       .lineTo(tableLeft + tableWidth, y)
       .strokeColor('#f1f5f9')
       .stroke();
  }

  // ===== Summary Section with GST =====
  const summaryTop = currentY + 30;
  const summaryLeft = tableLeft + 300;

  const gstAmount = subtotal * 0.18;
  const totalWithGST = subtotal + gstAmount;

  doc.rect(summaryLeft, summaryTop, 250, 100)
     .fillColor(lightBg)
     .fill()
     .strokeColor(borderColor)
     .stroke();

  doc.font('DejaVu').fillColor(textColor).fontSize(12);

  doc.text('Subtotal:', summaryLeft + 20, summaryTop + 15)
     .text(`${rupeeSymbol}${subtotal.toFixed(2)}`, summaryLeft + 150, summaryTop + 15, {
       align: 'right',
       width: 80,
     });

  doc.text('GST (18%):', summaryLeft + 20, summaryTop + 35)
     .text(`${rupeeSymbol}${gstAmount.toFixed(2)}`, summaryLeft + 150, summaryTop + 35, {
       align: 'right',
       width: 80,
     });

  doc.fillColor(accentColor)
     .fontSize(14)
     .font('DejaVu')
     .text('Total Amount:', summaryLeft + 20, summaryTop + 60)
     .text(`${rupeeSymbol}${totalWithGST.toFixed(2)}`, summaryLeft + 150, summaryTop + 60, {
       align: 'right',
       width: 80,
     });

  // ===== Footer =====
  const footerY = summaryTop + 120;
  doc.fillColor(accentColor)
     .fontSize(10)
     .text('Thank you for your business!', 50, footerY, { align: 'center', width: 500 })
     .text('This is a computer-generated invoice.', 50, footerY + 15, { align: 'center', width: 500 });

  doc.end();
};
