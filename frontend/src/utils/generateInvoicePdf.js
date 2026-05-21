import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import i18n from '../i18n';
import { COMPANY, formatInvoiceNumber, formatOrderDate } from '../constants/company';

/** Plain INR format for PDF (jsPDF fonts) */
const pdfPrice = (n) =>
  `Rs. ${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

/**
 * Generate and download a professional PDF invoice for an order.
 */
export const downloadOrderInvoicePdf = async (order) => {
  if (!order) return;

  const t = i18n.t.bind(i18n);
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  let y = margin;

  const invoiceNo = formatInvoiceNumber(order._id);
  const customerName = order.user?.name || t('invoice.customer');
  const customerEmail = order.user?.email || '';
  const addr = order.shippingAddress;

  doc.setFillColor(147, 51, 234);
  doc.rect(0, 0, pageWidth, 32, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(COMPANY.name, margin, 14);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(COMPANY.tagline, margin, 20);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(t('invoice.taxInvoice').toUpperCase(), pageWidth - margin, 12, { align: 'right' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(invoiceNo, pageWidth - margin, 18, { align: 'right' });
  doc.text(t('invoice.orderId', { id: order._id.slice(-8).toUpperCase() }), pageWidth - margin, 24, { align: 'right' });

  y = 40;
  doc.setTextColor(60, 60, 60);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(120, 120, 120);
  doc.text(t('invoice.billTo').toUpperCase(), margin, y);
  y += 5;
  doc.setFontSize(11);
  doc.setTextColor(30, 30, 30);
  doc.setFont('helvetica', 'bold');
  doc.text(customerName, margin, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  if (customerEmail) {
    doc.text(customerEmail, margin, y);
    y += 4;
  }
  [addr.street, `${addr.city}, ${addr.state} ${addr.zipCode}`, addr.country].forEach((line) => {
    doc.text(line, margin, y);
    y += 4;
  });

  let yRight = 40;
  const rightX = pageWidth - margin;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(120, 120, 120);
  doc.text(t('invoice.invoiceDetails').toUpperCase(), rightX, yRight, { align: 'right' });
  yRight += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(30, 30, 30);
  const details = [
    [`${t('invoice.orderDate')}:`, formatOrderDate(order.createdAt)],
    [`${t('invoice.payment')}:`, order.paymentMethod],
    [`${t('invoice.status')}:`, t(`orders.status.${order.status}`, order.status)],
  ];
  if (order.couponCode) details.push([`${t('invoice.coupon')}:`, order.couponCode]);
  details.forEach(([label, value]) => {
    doc.text(`${label} ${value}`, rightX, yRight, { align: 'right' });
    yRight += 5;
  });

  y = Math.max(y, yRight) + 6;

  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(
    `${COMPANY.address}, ${COMPANY.city} | ${COMPANY.email} | ${t('invoice.gstin')}: ${COMPANY.gstin}`,
    margin,
    y
  );
  y += 8;

  const tableBody = order.orderItems.map((item, i) => [
    i + 1,
    item.name,
    item.qty,
    pdfPrice(item.price),
    pdfPrice(item.price * item.qty),
  ]);

  autoTable(doc, {
    startY: y,
    head: [['#', t('invoice.product'), t('invoice.qty'), t('invoice.unitPrice'), t('invoice.amount')]],
    body: tableBody,
    theme: 'striped',
    headStyles: {
      fillColor: [249, 250, 251],
      textColor: [75, 85, 99],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: { fontSize: 9, textColor: [30, 30, 30] },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      2: { halign: 'center', cellWidth: 18 },
      3: { halign: 'right', cellWidth: 32 },
      4: { halign: 'right', cellWidth: 32 },
    },
    margin: { left: margin, right: margin },
  });

  y = doc.lastAutoTable.finalY + 10;

  const totalsX = pageWidth - margin - 70;
  const addTotalLine = (label, value, bold = false) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(bold ? 11 : 9);
    doc.setTextColor(bold ? 30 : 80, bold ? 30 : 80, bold ? 30 : 80);
    doc.text(label, totalsX, y);
    doc.text(value, pageWidth - margin, y, { align: 'right' });
    y += bold ? 7 : 5;
  };

  addTotalLine(`${t('invoice.subtotal')}:`, pdfPrice(order.itemsPrice));
  addTotalLine(
    `${t('invoice.shipping')}:`,
    order.shippingPrice === 0 ? t('common.free') : pdfPrice(order.shippingPrice)
  );
  addTotalLine(`${t('invoice.taxGst')}:`, pdfPrice(order.taxPrice));
  if (order.discountAmount > 0) {
    addTotalLine(`${t('invoice.discount')}:`, `-${pdfPrice(order.discountAmount)}`);
  }
  doc.setDrawColor(200, 200, 200);
  doc.line(totalsX, y - 2, pageWidth - margin, y - 2);
  addTotalLine(`${t('invoice.totalAmount')}:`, pdfPrice(order.totalPrice), true);

  y += 4;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(120, 120, 120);
  doc.text(t('invoice.thankYou'), pageWidth / 2, y, { align: 'center' });

  doc.save(`${invoiceNo}.pdf`);
};
