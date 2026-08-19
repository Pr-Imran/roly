import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Printer, Download, X, FileText, CheckCircle, Package, Truck, ShieldCheck, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';

export const InvoicePackingModal: React.FC = () => {
  const { activeDocumentModal, closeDocumentModal, clientProfile, siteSettings, showToast } = useStore();
  const printRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeDocumentModal();
    };
    document.addEventListener('keydown', closeOnEscape);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [closeDocumentModal]);

  if (!activeDocumentModal.isOpen || !activeDocumentModal.order) {
    return null;
  }

  const { order, type, proposal } = activeDocumentModal;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    showToast('Generating official PDF document...', 'info');

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const margin = 15;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const right = pageWidth - margin;
      let y = 18;

      const ensureSpace = (height: number) => {
        if (y + height <= pageHeight - 18) return;
        pdf.addPage();
        y = 18;
      };

      const writeWrapped = (text: string, x: number, maxWidth: number, lineHeight = 4) => {
        const lines = pdf.splitTextToSize(text || '-', maxWidth) as string[];
        pdf.text(lines, x, y);
        y += lines.length * lineHeight;
      };

      pdf.setProperties({
        title: getDocTitle(),
        subject: `${type.replace('_', ' ')} for order ${order.orderNumber}`,
        author: siteSettings.companyName,
        creator: siteSettings.brandName,
      });

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(22);
      pdf.text(siteSettings.brandName.toUpperCase(), margin, y);
      pdf.setFontSize(12);
      pdf.text(getDocTitle(), right, y, { align: 'right' });
      y += 7;
      pdf.setDrawColor(25, 25, 25);
      pdf.setLineWidth(0.7);
      pdf.line(margin, y, right, y);
      y += 6;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8.5);
      const companyLines = [siteSettings.companyName, siteSettings.address, `VAT / CIF: ${siteSettings.taxId}`, `${siteSettings.supportPhone} | ${siteSettings.supportEmail}`];
      companyLines.forEach((line) => { pdf.text(line, margin, y); y += 4; });
      const detailsTop = 31;
      pdf.text(`Order: ${order.orderNumber}`, right, detailsTop, { align: 'right' });
      pdf.text(`Reference: ${order.reference || '-'}`, right, detailsTop + 4, { align: 'right' });
      pdf.text(`Date: ${order.date}`, right, detailsTop + 8, { align: 'right' });
      y += 3;

      pdf.setFillColor(245, 245, 245);
      pdf.roundedRect(margin, y, pageWidth - (margin * 2), 31, 2, 2, 'F');
      const addressTop = y + 6;
      pdf.setFont('helvetica', 'bold');
      pdf.text('BILLED TO', margin + 4, addressTop);
      pdf.text('DELIVER TO', 108, addressTop);
      pdf.setFont('helvetica', 'normal');
      const billed = [clientProfile.company, `VAT: ${clientProfile.vatNumber}`, order.billingAddress.street, `${order.billingAddress.postalCode} ${order.billingAddress.city}, ${order.billingAddress.country}`];
      const delivered = [order.shippingAddress.companyName, order.shippingAddress.street, `${order.shippingAddress.postalCode} ${order.shippingAddress.city}, ${order.shippingAddress.country}`, `Carrier: ${order.carrier || '-'}`, `Tracking: ${order.trackingNumber || '-'}`];
      billed.forEach((line, index) => pdf.text(String(line), margin + 4, addressTop + 5 + (index * 4)));
      delivered.forEach((line, index) => pdf.text(String(line), 108, addressTop + 5 + (index * 4)));
      y += 38;

      const drawTableHeader = () => {
        pdf.setFillColor(30, 30, 30);
        pdf.rect(margin, y, pageWidth - (margin * 2), 8, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8);
        pdf.text('MODEL', margin + 2, y + 5);
        pdf.text('DESCRIPTION / COLOUR', 42, y + 5);
        pdf.text('SIZE BREAKDOWN', 112, y + 5);
        pdf.text('QTY', 170, y + 5, { align: 'right' });
        pdf.text('TOTAL', right - 2, y + 5, { align: 'right' });
        pdf.setTextColor(25, 25, 25);
        y += 8;
      };

      drawTableHeader();
      pdf.setFontSize(8);
      order.items.forEach((item) => {
        const sizes = Object.entries(item.sizeBreakdown).map(([size, quantity]) => `${size}:${quantity}`).join('  ');
        const descriptionLines = pdf.splitTextToSize(`${item.productName} / ${item.colorName}`, 64) as string[];
        const sizeLines = pdf.splitTextToSize(sizes || '-', 50) as string[];
        const rowHeight = Math.max(10, Math.max(descriptionLines.length, sizeLines.length) * 4 + 4);
        if (y + rowHeight > pageHeight - 32) {
          pdf.addPage();
          y = 18;
          drawTableHeader();
        }
        pdf.setFont('helvetica', 'bold');
        pdf.text(item.modelCode, margin + 2, y + 5);
        pdf.setFont('helvetica', 'normal');
        pdf.text(descriptionLines, 42, y + 5);
        pdf.text(sizeLines, 112, y + 5);
        pdf.text(String(item.totalQuantity), 170, y + 5, { align: 'right' });
        pdf.text(`${item.totalPrice.toFixed(2)} ${siteSettings.currency}`, right - 2, y + 5, { align: 'right' });
        pdf.setDrawColor(220, 220, 220);
        pdf.line(margin, y + rowHeight, right, y + rowHeight);
        y += rowHeight;
      });

      ensureSpace(45);
      y += 7;
      if (type === 'packing_list') {
        pdf.setFont('helvetica', 'bold');
        pdf.text(`PACKAGING: ${order.totalPieces} pieces | ${order.totalBoxes || 0} boxes | ${order.grossWeightKg} kg gross`, margin, y);
        y += 8;
      }
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Subtotal`, 145, y);
      pdf.text(`${order.subtotal.toFixed(2)} ${siteSettings.currency}`, right, y, { align: 'right' });
      y += 5;
      pdf.text('Shipping', 145, y);
      pdf.text(order.shippingCost === 0 ? 'FREE' : `${order.shippingCost.toFixed(2)} ${siteSettings.currency}`, right, y, { align: 'right' });
      y += 5;
      pdf.text(`VAT (${siteSettings.vatRate}%)`, 145, y);
      pdf.text(`${order.taxAmount.toFixed(2)} ${siteSettings.currency}`, right, y, { align: 'right' });
      y += 6;
      pdf.setLineWidth(0.5);
      pdf.line(143, y - 3, right, y - 3);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.text('TOTAL', 145, y + 2);
      pdf.text(`${order.total.toFixed(2)} ${siteSettings.currency}`, right, y + 2, { align: 'right' });
      y += 14;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      writeWrapped(`Payment: ${order.paymentMethodName || order.paymentStatus}. ${order.notes ? `Order notes: ${order.notes}` : ''}`, margin, 110);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Generated ${new Date().toLocaleString()} | ${siteSettings.companyName}`, margin, pageHeight - 10);

      const docName = type === 'invoice' 
        ? `Invoice_${order.invoiceNumber || order.orderNumber}.pdf`
        : type === 'packing_list'
        ? `PackingList_${order.packingListNumber || order.orderNumber}.pdf`
        : type === 'delivery_note'
        ? `DeliveryNote_${order.deliveryNoteNumber || order.orderNumber}.pdf`
        : `Proposal_${proposal?.proposalNumber || order.orderNumber}.pdf`;

      pdf.save(docName.replace(/[^a-zA-Z0-9._-]+/g, '_'));
      showToast(`Downloaded ${docName} to your device!`, 'success');
    } catch (err) {
      console.error('Error generating PDF:', err);
      showToast('Could not download the PDF. Please use Print instead.', 'warning');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const getDocTitle = () => {
    switch (type) {
      case 'invoice':
        return `TAX INVOICE ${order.invoiceNumber || 'INV-2026-08942'}`;
      case 'packing_list':
        return `PACKING LIST ${order.packingListNumber || 'PL-210021432'}`;
      case 'delivery_note':
        return `DELIVERY NOTE ${order.deliveryNoteNumber || 'DN-82212130'}`;
      case 'proposal':
        return `COMMERCIAL PROPOSAL ${proposal?.proposalNumber || 'PROP-2026-9042'}`;
      default:
        return 'COMMERCIAL DOCUMENT';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 font-sans"
      role="dialog"
      aria-modal="true"
      aria-label={getDocTitle()}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeDocumentModal();
      }}
    >
      <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full my-8 overflow-hidden border border-gray-200">
        
        {/* Top Control Bar (Hidden on Print) */}
        <div className="print:hidden bg-neutral-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-yellow-400 shrink-0" />
            <div>
              <h3 className="font-bold text-sm sm:text-base tracking-tight">{getDocTitle()}</h3>
              <p className="text-xs text-neutral-400">Order: {order.orderNumber} • Client: {clientProfile.company}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={closeDocumentModal}
              className="px-3.5 py-2 border border-neutral-700 hover:border-neutral-500 text-white text-xs font-bold rounded-md transition-colors"
            >
              Cancel
            </button>
            {/* Download PDF Button */}
            <button
              disabled={isGeneratingPdf}
              onClick={handleDownloadPdf}
              className="px-3.5 py-2 bg-white hover:bg-neutral-100 text-black text-xs font-bold rounded-md flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
              title="Download clean PDF to your device"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-emerald-600" />
                  <span>Download PDF</span>
                </>
              )}
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-bold rounded-md flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
              title="Open browser print dialog"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>

            <button
              onClick={closeDocumentModal}
              className="p-1.5 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-800 transition-colors cursor-pointer"
              aria-label="Close document"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div ref={printRef} className="p-8 sm:p-12 text-gray-900 bg-white text-xs leading-normal printable-document">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-black pb-6">
            <div>
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl font-black tracking-tighter text-black font-sans uppercase">
                  {siteSettings.brandName}
                </span>
                <span className="text-xs font-bold">®</span>
              </div>
              <p className="font-bold text-gray-800 text-xs mt-1">{siteSettings.companyName}</p>
              <p className="text-gray-600 text-[11px]">{siteSettings.address}</p>
              <p className="text-gray-600 text-[11px]">VAT / CIF: {siteSettings.taxId} • European Registered</p>
              <p className="text-gray-600 text-[11px]">Phone: {siteSettings.supportPhone} • Email: {siteSettings.supportEmail}</p>
            </div>

            <div className="text-right">
              <div className="inline-block bg-black text-white px-3 py-1 text-sm font-black uppercase tracking-wider rounded-xs mb-2">
                {type.replace('_', ' ')}
              </div>
              <p className="text-base font-bold text-gray-900 font-mono">
                {type === 'invoice' && (order.invoiceNumber || 'INV-2026-08942')}
                {type === 'packing_list' && (order.packingListNumber || 'PL-210021432')}
                {type === 'delivery_note' && (order.deliveryNoteNumber || '#82212130')}
                {type === 'proposal' && (proposal?.proposalNumber || 'PROP-2026-9042')}
              </p>
              <p className="text-gray-600 text-xs">Date: <span className="font-semibold text-gray-900">{order.date}</span></p>
              <p className="text-gray-600 text-xs">Order Ref: <span className="font-semibold text-gray-900">{order.reference || 'N/A'}</span></p>
              <p className="text-gray-600 text-xs">Order Nº: <span className="font-semibold text-gray-900 font-mono">{order.orderNumber}</span></p>
            </div>
          </div>

          {/* Addresses Grid */}
          <div className="grid grid-cols-2 gap-8 my-6 py-4 bg-gray-50/80 rounded-lg p-4 border border-gray-100">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Invoiced / Billed To:</p>
              <p className="font-bold text-sm text-gray-900">{clientProfile.company}</p>
              <p className="text-gray-700 font-mono text-xs">VAT / NIF: {clientProfile.vatNumber}</p>
              <p className="text-gray-600">{order.billingAddress.street}</p>
              <p className="text-gray-600">{order.billingAddress.postalCode} {order.billingAddress.city}</p>
              <p className="text-gray-600">{order.billingAddress.country}</p>
              <p className="text-gray-500 text-[11px]">Attn: {clientProfile.name} • Tel: {clientProfile.phone}</p>
            </div>

            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Delivery Destination:</p>
              <p className="font-bold text-sm text-gray-900">{order.shippingAddress.companyName}</p>
              <p className="text-gray-600">{order.shippingAddress.street}</p>
              <p className="text-gray-600">{order.shippingAddress.postalCode} {order.shippingAddress.city}</p>
              <p className="text-gray-600">{order.shippingAddress.country}</p>
              <div className="mt-2 text-[11px] text-gray-700 flex items-center space-x-2">
                <Truck className="w-3.5 h-3.5 text-gray-500" />
                <span>Carrier: <strong>{order.carrier || 'GLS Logistics EuroFreight'}</strong></span>
              </div>
              <p className="text-[11px] text-gray-500 font-mono">Tracking: {order.trackingNumber || 'GLS-ES-899421095'}</p>
            </div>
          </div>

          {/* Technical Logistics Summary for Packing List */}
          {type === 'packing_list' && (
            <div className="grid grid-cols-4 gap-3 bg-neutral-900 text-white p-3 rounded-md mb-6 text-center text-xs">
              <div>
                <p className="text-[10px] text-gray-400 uppercase">Total Pieces</p>
                <p className="font-bold text-base text-yellow-400">{order.totalPieces} pcs</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase">Total Boxes</p>
                <p className="font-bold text-base">{order.totalBoxes || 12} Cartons</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase">Gross Weight</p>
                <p className="font-bold text-base">{order.grossWeightKg || 184.5} kg</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase">Packaging Unit</p>
                <p className="font-bold text-base">Pallet Euro 1</p>
              </div>
            </div>
          )}

          {/* Items Table */}
          <table className="w-full text-left border-collapse my-4">
            <thead>
              <tr className="border-b border-gray-300 bg-gray-100 text-gray-700 text-[11px] font-bold uppercase">
                <th className="py-2.5 px-3">Item / Model</th>
                <th className="py-2.5 px-3">Description & Color</th>
                <th className="py-2.5 px-3 text-center">Sizes Breakdown</th>
                <th className="py-2.5 px-3 text-center">Total Pcs</th>
                <th className="py-2.5 px-3 text-right">Unit Price</th>
                <th className="py-2.5 px-3 text-right">Total Net</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-xs">
              {order.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="py-3 px-3 font-mono font-bold text-gray-900">
                    {item.modelCode}
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-semibold text-gray-900">{item.productName}</p>
                    <div className="flex items-center space-x-1.5 mt-0.5 text-gray-500 text-[11px]">
                      <span className="w-2.5 h-2.5 rounded-full border border-gray-300" style={{ backgroundColor: item.colorHex }} />
                      <span>{item.colorName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex flex-wrap justify-center gap-1">
                      {Object.entries(item.sizeBreakdown).map(([sz, qty]) => (
                        <span key={sz} className="inline-block bg-gray-100 px-1.5 py-0.5 rounded-xs text-[10px] font-mono">
                          {sz}: <strong>{qty}</strong>
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-gray-900">
                    {item.totalQuantity}
                  </td>
                  <td className="py-3 px-3 text-right font-mono">
                    {item.unitPrice.toFixed(2)} €
                  </td>
                  <td className="py-3 px-3 text-right font-bold font-mono text-gray-900">
                    {item.totalPrice.toFixed(2)} €
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Financial Totals & Tax Breakdown */}
          <div className="flex justify-between items-start pt-4 border-t-2 border-black mt-6">
            <div className="max-w-xs text-[11px] text-gray-600 space-y-1">
              <p className="font-bold text-gray-900 uppercase">Payment Conditions:</p>
              <p>• SEPA Direct Debit B2B (30 Days Net from Invoice)</p>
              <p>• Bank: Banco Santander S.A. ES89 0049 1500 0512 3456 7890</p>
              <p>• Goods travel under warranty ISO 9001:2015.</p>
              <div className="mt-4 flex items-center space-x-2 text-emerald-700">
                <ShieldCheck className="w-4 h-4" />
                <span className="font-semibold text-[10px]">OEKO-TEX Standard 100 & BSCI Certified</span>
              </div>
            </div>

            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal (Net):</span>
                <span className="font-mono font-semibold">{order.subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Standard Shipping:</span>
                <span className="font-mono">{order.shippingCost === 0 ? 'FREE (Wholesale Tier)' : `${order.shippingCost.toFixed(2)} €`}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>VAT / IVA ({siteSettings.vatRate}%):</span>
                <span className="font-mono font-semibold">{order.taxAmount.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-base font-black text-gray-900 border-t-2 border-black pt-2">
                <span>TOTAL AMOUNT:</span>
                <span className="font-mono text-lg">{order.total.toFixed(2)} €</span>
              </div>
            </div>
          </div>

          {/* Document Footer with Signature & Verification Code */}
          <div className="mt-12 pt-4 border-t border-gray-200 flex justify-between items-end text-[10px] text-gray-500">
            <div>
              <p>Electronic Hash: <span className="font-mono">SHA256:7f92a1c...99b2</span></p>
              <p>Generated & Downloaded on demand • Direct client-side PDF export</p>
            </div>
            <div className="text-center">
              <div className="w-36 border-b border-gray-400 pb-10 mb-1">
                <span className="text-[9px] text-gray-400">Authorized Logistics Signature</span>
              </div>
              <p className="font-semibold text-gray-700 uppercase">{siteSettings.companyName}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
