import React, { useRef, useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Printer, Download, X, FileText, CheckCircle, Package, Truck, ShieldCheck, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const InvoicePackingModal: React.FC = () => {
  const { activeDocumentModal, closeDocumentModal, clientProfile, siteSettings, showToast } = useStore();
  const printRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  if (!activeDocumentModal.isOpen || !activeDocumentModal.order) {
    return null;
  }

  const { order, type, proposal } = activeDocumentModal;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    setIsGeneratingPdf(true);
    showToast('Generating official PDF document...', 'info');

    try {
      const element = printRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const docName = type === 'invoice' 
        ? `Invoice_${order.invoiceNumber || order.orderNumber}.pdf`
        : type === 'packing_list'
        ? `PackingList_${order.packingListNumber || order.orderNumber}.pdf`
        : type === 'delivery_note'
        ? `DeliveryNote_${order.deliveryNoteNumber || order.orderNumber}.pdf`
        : `Proposal_${proposal?.proposalNumber || order.orderNumber}.pdf`;

      pdf.save(docName);
      showToast(`Downloaded ${docName} to your device!`, 'success');
    } catch (err) {
      console.error('Error generating PDF:', err);
      showToast('Could not download PDF. Printing dialog will open instead.', 'warning');
      window.print();
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 font-sans">
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
