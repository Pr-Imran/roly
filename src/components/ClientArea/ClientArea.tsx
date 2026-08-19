import React, { useState } from 'react';
import { useStore, ClientAreaTab, DocumentSubTab } from '../../context/StoreContext';
import { 
  Folder, 
  FileSpreadsheet, 
  Bell, 
  Star, 
  Megaphone, 
  MapPin, 
  Phone, 
  Settings, 
  Search, 
  X, 
  Download, 
  Printer, 
  Eye, 
  Calendar,
  CheckCircle,
  Clock,
  Building,
  CreditCard,
  Truck,
  Sparkles,
  Plus,
  Trash2,
  Edit2
} from 'lucide-react';

export const ClientArea: React.FC = () => {
  const {
    clientAreaTab,
    setClientAreaTab,
    documentSubTab,
    setDocumentSubTab,
    orders,
    proposals,
    stockNotices,
    addresses,
    clientProfile,
    favorites,
    openDocumentModal,
    showToast,
    navigateToProduct,
    setActivePage,
  } = useStore();

  // Search filter states
  const [filterDocNumber, setFilterDocNumber] = useState('');
  const [filterReference, setFilterReference] = useState('');
  const [filterFromDate, setFilterFromDate] = useState('2026-07-18');
  const [filterToDate, setFilterToDate] = useState('2026-08-18');
  const [selectedRowId, setSelectedRowId] = useState<string>('ord-1');

  // New stock notice modal
  const [newNoticeModel, setNewNoticeModel] = useState('CA6681');
  const [newNoticeColor, setNewNoticeColor] = useState('01 White');
  const [newNoticeSize, setNewNoticeSize] = useState('5XL');
  const [newNoticeQty, setNewNoticeQty] = useState(100);

  const resetFilters = () => {
    setFilterDocNumber('');
    setFilterReference('');
    setFilterFromDate('2026-07-18');
    setFilterToDate('2026-08-18');
    showToast('Filters reset', 'info');
  };

  const filteredOrders = orders.filter((ord) => {
    if (filterDocNumber && !ord.orderNumber.toLowerCase().includes(filterDocNumber.toLowerCase()) && !ord.deliveryNoteNumber?.toLowerCase().includes(filterDocNumber.toLowerCase()) && !ord.packingListNumber?.toLowerCase().includes(filterDocNumber.toLowerCase()) && !ord.invoiceNumber?.toLowerCase().includes(filterDocNumber.toLowerCase())) {
      return false;
    }
    if (filterReference && !ord.reference.toLowerCase().includes(filterReference.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="w-full bg-[#f8f8f8] min-h-[calc(100vh-140px)] pb-16 font-sans">
      {/* Black Title Bar matching screenshot */}
      <div className="bg-black text-white py-3 px-4 text-center">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Client area</h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Sidebar matching screenshot */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-md shadow-xs border border-gray-200 overflow-hidden">
              <nav className="flex flex-col">
                <button
                  onClick={() => setClientAreaTab('documents')}
                  className={`w-full text-left px-4 py-3 text-sm font-semibold flex items-center space-x-3 transition-colors border-b border-gray-100 ${
                    clientAreaTab === 'documents'
                      ? 'bg-[#e5e5e5] text-black font-bold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Folder className="w-4 h-4 text-gray-700" />
                  <span>Documents</span>
                </button>

                <button
                  onClick={() => setClientAreaTab('347_report')}
                  className={`w-full text-left px-4 py-3 text-sm font-semibold flex items-center space-x-3 transition-colors border-b border-gray-100 ${
                    clientAreaTab === '347_report'
                      ? 'bg-[#e5e5e5] text-black font-bold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4 text-gray-700" />
                  <span>347 report</span>
                </button>

                <button
                  onClick={() => setClientAreaTab('stock_notice')}
                  className={`w-full text-left px-4 py-3 text-sm font-semibold flex items-center space-x-3 transition-colors border-b border-gray-100 ${
                    clientAreaTab === 'stock_notice'
                      ? 'bg-[#e5e5e5] text-black font-bold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Bell className="w-4 h-4 text-gray-700" />
                  <span>Stock notice</span>
                </button>

                <button
                  onClick={() => setClientAreaTab('favourite_orders')}
                  className={`w-full text-left px-4 py-3 text-sm font-semibold flex items-center space-x-3 transition-colors border-b border-gray-100 ${
                    clientAreaTab === 'favourite_orders'
                      ? 'bg-[#e5e5e5] text-black font-bold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Star className="w-4 h-4 text-gray-700" />
                  <span>Favourite orders</span>
                </button>

                <button
                  onClick={() => setClientAreaTab('marketing')}
                  className={`w-full text-left px-4 py-3 text-sm font-semibold flex items-center space-x-3 transition-colors border-b border-gray-100 ${
                    clientAreaTab === 'marketing'
                      ? 'bg-[#e5e5e5] text-black font-bold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Megaphone className="w-4 h-4 text-gray-700" />
                  <span>Marketing</span>
                </button>

                <button
                  onClick={() => setClientAreaTab('addresses')}
                  className={`w-full text-left px-4 py-3 text-sm font-semibold flex items-center space-x-3 transition-colors border-b border-gray-100 ${
                    clientAreaTab === 'addresses'
                      ? 'bg-[#e5e5e5] text-black font-bold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-gray-700" />
                  <span>My addresses</span>
                </button>

                <button
                  onClick={() => setClientAreaTab('contact')}
                  className={`w-full text-left px-4 py-3 text-sm font-semibold flex items-center space-x-3 transition-colors border-b border-gray-100 ${
                    clientAreaTab === 'contact'
                      ? 'bg-[#e5e5e5] text-black font-bold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Phone className="w-4 h-4 text-gray-700" />
                  <span>Contact</span>
                </button>

                <button
                  onClick={() => setClientAreaTab('account_config')}
                  className={`w-full text-left px-4 py-3 text-sm font-semibold flex items-center space-x-3 transition-colors ${
                    clientAreaTab === 'account_config'
                      ? 'bg-[#e5e5e5] text-black font-bold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Settings className="w-4 h-4 text-gray-700" />
                  <span>Account configuration</span>
                </button>
              </nav>
            </div>

            {/* YOUROLY Button with signature gradient matching screenshot */}
            <div className="mt-4">
              <button
                onClick={() => setClientAreaTab('youroly')}
                className="w-full py-3.5 px-4 rounded-full font-black text-sm text-black tracking-wider shadow-md hover:opacity-95 transition-all transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                style={{
                  background: 'linear-gradient(90deg, #d4e157 0%, #4dd0e1 50%, #ef5350 100%)',
                }}
              >
                YOUROLY
              </button>
            </div>

            {/* B2B Credit Balance Quick Widget */}
            <div className="mt-4 bg-white p-4 rounded-md border border-gray-200 text-xs">
              <div className="flex items-center justify-between text-gray-500 mb-1">
                <span>Credit Limit:</span>
                <span className="font-mono font-bold text-gray-900">{clientProfile.creditLimit.toFixed(2)} €</span>
              </div>
              <div className="flex items-center justify-between text-gray-500 mb-2">
                <span>Available Credit:</span>
                <span className="font-mono font-bold text-emerald-600">{clientProfile.availableCredit.toFixed(2)} €</span>
              </div>
              <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${(clientProfile.availableCredit / clientProfile.creditLimit) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-2 text-center">Payment Term: 30 Days Net SEPA B2B</p>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 bg-white rounded-md shadow-xs border border-gray-200 p-6">
            {/* VIEW 1: DOCUMENTS */}
            {clientAreaTab === 'documents' && (
              <div>
                {/* Sub-Tabs matching screenshot: Proposals, Orders, Invoices, Expirations, Payments, Delivery notes, Packinglist */}
                <div className="flex items-center justify-between overflow-x-auto pb-4 border-b border-gray-200 text-base sm:text-lg text-gray-400 gap-4 sm:gap-6 font-medium whitespace-nowrap no-scrollbar">
                  <button
                    onClick={() => setDocumentSubTab('proposals')}
                    className={`cursor-pointer transition-colors ${
                      documentSubTab === 'proposals' ? 'text-black font-bold text-xl' : 'hover:text-gray-700'
                    }`}
                  >
                    Proposals
                  </button>

                  <button
                    onClick={() => setDocumentSubTab('orders')}
                    className={`cursor-pointer transition-colors ${
                      documentSubTab === 'orders' ? 'text-black font-bold text-xl' : 'hover:text-gray-700'
                    }`}
                  >
                    Orders
                  </button>

                  <button
                    onClick={() => setDocumentSubTab('invoices')}
                    className={`cursor-pointer transition-colors ${
                      documentSubTab === 'invoices' ? 'text-black font-bold text-xl' : 'hover:text-gray-700'
                    }`}
                  >
                    Invoices
                  </button>

                  <button
                    onClick={() => setDocumentSubTab('expirations')}
                    className={`cursor-pointer transition-colors ${
                      documentSubTab === 'expirations' ? 'text-black font-bold text-xl' : 'hover:text-gray-700'
                    }`}
                  >
                    Expirations
                  </button>

                  <button
                    onClick={() => setDocumentSubTab('payments')}
                    className={`cursor-pointer transition-colors ${
                      documentSubTab === 'payments' ? 'text-black font-bold text-xl' : 'hover:text-gray-700'
                    }`}
                  >
                    Payments
                  </button>

                  <button
                    onClick={() => setDocumentSubTab('delivery_notes')}
                    className={`cursor-pointer transition-colors ${
                      documentSubTab === 'delivery_notes' ? 'text-black font-bold text-xl' : 'hover:text-gray-700'
                    }`}
                  >
                    Delivery notes
                  </button>

                  <button
                    onClick={() => setDocumentSubTab('packing_list')}
                    className={`cursor-pointer transition-colors ${
                      documentSubTab === 'packing_list' ? 'text-black font-black text-xl border-b-2 border-black pb-1' : 'hover:text-gray-700'
                    }`}
                  >
                    Packinglist
                  </button>
                </div>

                {/* Filter Toolbar matching screenshot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end my-6">
                  {/* Field 1: Document number input */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {documentSubTab === 'packing_list' ? 'PackingList' : documentSubTab === 'invoices' ? 'Invoice Number' : documentSubTab === 'orders' ? 'Order Number' : 'Document Nº'}
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. 210021432"
                      value={filterDocNumber}
                      onChange={(e) => setFilterDocNumber(e.target.value)}
                      className="w-full bg-[#fbfbfb] border border-gray-300 rounded-xs px-3 py-2 text-xs focus:bg-white focus:border-black outline-none"
                    />
                  </div>

                  {/* Field 2: Reference input */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Reference:
                    </label>
                    <input
                      type="text"
                      placeholder="Referencia cliente"
                      value={filterReference}
                      onChange={(e) => setFilterReference(e.target.value)}
                      className="w-full bg-[#fbfbfb] border border-gray-300 rounded-xs px-3 py-2 text-xs focus:bg-white focus:border-black outline-none"
                    />
                  </div>

                  {/* Field 3: From date */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      From date:
                    </label>
                    <input
                      type="date"
                      value={filterFromDate}
                      onChange={(e) => setFilterFromDate(e.target.value)}
                      className="w-full bg-[#fbfbfb] border border-gray-300 rounded-xs px-3 py-2 text-xs focus:bg-white focus:border-black outline-none"
                    />
                  </div>

                  {/* Field 4: To date */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      To date:
                    </label>
                    <input
                      type="date"
                      value={filterToDate}
                      onChange={(e) => setFilterToDate(e.target.value)}
                      className="w-full bg-[#fbfbfb] border border-gray-300 rounded-xs px-3 py-2 text-xs focus:bg-white focus:border-black outline-none"
                    />
                  </div>

                  {/* Action buttons: Search & Clear (X) */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => showToast(`Filtered ${filteredOrders.length} documents`, 'info')}
                      className="flex-1 bg-black hover:bg-neutral-800 text-white font-bold text-xs py-2.5 px-4 rounded-full flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>SEARCH</span>
                    </button>
                    <button
                      onClick={resetFilters}
                      className="w-9 h-9 shrink-0 border border-gray-300 hover:border-black rounded-full flex items-center justify-center text-gray-600 hover:text-black transition-colors cursor-pointer text-xs font-bold"
                      title="Clear filters"
                    >
                      X
                    </button>
                  </div>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto">
                  {documentSubTab === 'packing_list' && (
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-[#f5f5f5] text-gray-700 font-semibold border-y border-gray-200">
                          <th className="py-3 px-3 w-8 text-center"></th>
                          <th className="py-3 px-4">Deliverynote</th>
                          <th className="py-3 px-4">Order</th>
                          <th className="py-3 px-4">Reference</th>
                          <th className="py-3 px-4">Date</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredOrders.map((ord) => (
                          <tr
                            key={ord.id}
                            onClick={() => setSelectedRowId(ord.id)}
                            className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                              selectedRowId === ord.id ? 'bg-gray-50/80 font-medium' : ''
                            }`}
                          >
                            <td className="py-3.5 px-3 text-center">
                              <input
                                type="radio"
                                name="selectedPacking"
                                checked={selectedRowId === ord.id}
                                onChange={() => setSelectedRowId(ord.id)}
                                className="w-4 h-4 accent-black cursor-pointer"
                              />
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                              {ord.deliveryNoteNumber || '#82212130'}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-gray-700">
                              {ord.orderNumber}
                            </td>
                            <td className="py-3.5 px-4 text-gray-600">
                              {ord.reference || '-'}
                            </td>
                            <td className="py-3.5 px-4 text-gray-700">
                              {ord.date}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openDocumentModal('packing_list', ord);
                                }}
                                className="inline-flex items-center space-x-1.5 text-xs font-bold text-black hover:text-red-600 transition-colors uppercase tracking-tight"
                              >
                                <Download className="w-4 h-4" />
                                <span>DOWNLOAD PACKING LIST</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {documentSubTab === 'invoices' && (
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-[#f5f5f5] text-gray-700 font-semibold border-y border-gray-200">
                          <th className="py-3 px-3 w-8 text-center"></th>
                          <th className="py-3 px-4">Invoice Nº</th>
                          <th className="py-3 px-4">Order</th>
                          <th className="py-3 px-4">Date</th>
                          <th className="py-3 px-4">Payment Status</th>
                          <th className="py-3 px-4 text-right">Total (€)</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredOrders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-3.5 px-3 text-center">
                              <input
                                type="radio"
                                name="selectedInvoice"
                                checked={selectedRowId === ord.id}
                                onChange={() => setSelectedRowId(ord.id)}
                                className="w-4 h-4 accent-black cursor-pointer"
                              />
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                              {ord.invoiceNumber || `INV-2026-${ord.id}`}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-gray-700">
                              {ord.orderNumber}
                            </td>
                            <td className="py-3.5 px-4 text-gray-700">{ord.date}</td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                ord.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {ord.paymentStatus}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono font-bold text-gray-900">
                              {ord.total.toFixed(2)} €
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => openDocumentModal('invoice', ord)}
                                className="inline-flex items-center space-x-1.5 text-xs font-bold text-black hover:text-red-600 uppercase"
                              >
                                <Printer className="w-4 h-4" />
                                <span>GENERATE & PRINT INVOICE</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {documentSubTab === 'orders' && (
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-[#f5f5f5] text-gray-700 font-semibold border-y border-gray-200">
                          <th className="py-3 px-4">Order Number</th>
                          <th className="py-3 px-4">Reference</th>
                          <th className="py-3 px-4">Date</th>
                          <th className="py-3 px-4">Articles</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Total Net</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredOrders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                              {ord.orderNumber}
                            </td>
                            <td className="py-3.5 px-4 text-gray-600">{ord.reference}</td>
                            <td className="py-3.5 px-4 text-gray-700">{ord.date}</td>
                            <td className="py-3.5 px-4">
                              <span className="font-semibold">{ord.totalPieces} pcs</span> ({ord.items.length} models)
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                                {ord.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono font-bold text-gray-900">
                              {ord.subtotal.toFixed(2)} €
                            </td>
                            <td className="py-3.5 px-4 text-right space-x-3">
                              <button
                                onClick={() => openDocumentModal('delivery_note', ord)}
                                className="font-bold text-black hover:text-red-600"
                              >
                                Delivery Note
                              </button>
                              <button
                                onClick={() => openDocumentModal('invoice', ord)}
                                className="font-bold text-black hover:text-red-600"
                              >
                                Invoice
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {documentSubTab === 'proposals' && (
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-[#f5f5f5] text-gray-700 font-semibold border-y border-gray-200">
                          <th className="py-3 px-4">Proposal Nº</th>
                          <th className="py-3 px-4">Reference</th>
                          <th className="py-3 px-4">Date</th>
                          <th className="py-3 px-4">Valid Until</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Amount</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {proposals.map((prop) => (
                          <tr key={prop.id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-gray-900">{prop.proposalNumber}</td>
                            <td className="py-3.5 px-4 text-gray-600">{prop.reference}</td>
                            <td className="py-3.5 px-4 text-gray-700">{prop.date}</td>
                            <td className="py-3.5 px-4 text-gray-700">{prop.validUntil}</td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                prop.status === 'Open' ? 'bg-amber-100 text-amber-800' : prop.status === 'Accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {prop.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono font-bold">{prop.total.toFixed(2)} €</td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => openDocumentModal('proposal', undefined, prop)}
                                className="font-bold text-black hover:text-red-600 uppercase"
                              >
                                View / Print Proposal
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {documentSubTab === 'delivery_notes' && (
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-[#f5f5f5] text-gray-700 font-semibold border-y border-gray-200">
                          <th className="py-3 px-4">Delivery Note Nº</th>
                          <th className="py-3 px-4">Order Nº</th>
                          <th className="py-3 px-4">Date</th>
                          <th className="py-3 px-4">Carrier</th>
                          <th className="py-3 px-4">Cartons / Weight</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredOrders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-gray-900">{ord.deliveryNoteNumber}</td>
                            <td className="py-3.5 px-4 font-mono text-gray-700">{ord.orderNumber}</td>
                            <td className="py-3.5 px-4 text-gray-700">{ord.date}</td>
                            <td className="py-3.5 px-4 text-gray-700">{ord.carrier}</td>
                            <td className="py-3.5 px-4 text-gray-700">{ord.totalBoxes} Cartons • {ord.grossWeightKg} kg</td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => openDocumentModal('delivery_note', ord)}
                                className="font-bold text-black hover:text-red-600 uppercase"
                              >
                                Download Delivery Note
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {documentSubTab === 'expirations' && (
                    <div className="p-8 text-center text-gray-600 text-xs">
                      <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="font-bold text-sm text-gray-800">Pending Expirations / Vencimientos</p>
                      <p className="mt-1">Next SEPA direct debit expiration: <span className="font-bold text-gray-900">08/30/2026</span> for amount <span className="font-bold text-gray-900">2,362.53 €</span></p>
                      <p className="text-gray-400 mt-2">All payments are synchronized with Banco Santander SEPA B2B Core.</p>
                    </div>
                  )}

                  {documentSubTab === 'payments' && (
                    <div className="p-8 text-center text-gray-600 text-xs">
                      <CreditCard className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                      <p className="font-bold text-sm text-gray-800">Payment History & Bank Reconciliations</p>
                      <p className="mt-1">All invoices for Q1 and Q2 2026 are fully reconciled with 0 pending discrepancies.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* VIEW 2: 347 REPORT */}
            {clientAreaTab === '347_report' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Model 347 Tax Statement (Spain & EU B2B)</h2>
                <p className="text-xs text-gray-500 mb-6">Annual declaration of operations with third parties exceeding €3,005.06.</p>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
                    <div>
                      <p className="font-bold text-sm text-gray-900">Tax Year: 2026</p>
                      <p className="text-xs text-gray-600">Company: {clientProfile.company} • NIF: {clientProfile.vatNumber}</p>
                    </div>
                    <button
                      onClick={() => showToast('Generated Model 347 PDF report', 'success')}
                      className="px-4 py-2 bg-black text-white text-xs font-bold rounded-md hover:bg-neutral-800 transition-colors"
                    >
                      Export Official 347 Summary
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div className="bg-white p-4 rounded-md border border-gray-200">
                      <p className="text-[11px] text-gray-500 uppercase">Q1 Operations</p>
                      <p className="text-base font-bold font-mono text-gray-900">14,280.00 €</p>
                    </div>
                    <div className="bg-white p-4 rounded-md border border-gray-200">
                      <p className="text-[11px] text-gray-500 uppercase">Q2 Operations</p>
                      <p className="text-base font-bold font-mono text-gray-900">18,940.50 €</p>
                    </div>
                    <div className="bg-white p-4 rounded-md border border-gray-200">
                      <p className="text-[11px] text-gray-500 uppercase">Q3 Operations</p>
                      <p className="text-base font-bold font-mono text-gray-900">8,210.00 €</p>
                    </div>
                    <div className="bg-white p-4 rounded-md border border-gray-200">
                      <p className="text-[11px] text-gray-500 uppercase">Q4 Forecast</p>
                      <p className="text-base font-bold font-mono text-gray-900">12,500.00 €</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center text-sm font-bold">
                    <span>Total Declared Volume with Gor Factory S.A.:</span>
                    <span className="text-lg font-mono text-emerald-700">41,430.50 €</span>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 3: STOCK NOTICE */}
            {clientAreaTab === 'stock_notice' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Stock Notices & Restock Alerts</h2>
                    <p className="text-xs text-gray-500">Subscribe to immediate notifications when out-of-stock garments arrive at Alicante Hub.</p>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                  <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">Create New Stock Alert Subscription</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="block text-gray-600 mb-1">Model Code:</label>
                      <input
                        type="text"
                        value={newNoticeModel}
                        onChange={(e) => setNewNoticeModel(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1">Color:</label>
                      <input
                        type="text"
                        value={newNoticeColor}
                        onChange={(e) => setNewNoticeColor(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1">Size:</label>
                      <input
                        type="text"
                        value={newNoticeSize}
                        onChange={(e) => setNewNoticeSize(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={() => showToast(`Subscribed to stock alert for ${newNoticeModel} (${newNoticeColor} / ${newNoticeSize})`, 'success')}
                        className="w-full bg-black text-white py-2 rounded font-bold hover:bg-neutral-800 transition-colors"
                      >
                        Subscribe Notice
                      </button>
                    </div>
                  </div>
                </div>

                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700 font-semibold border-b border-gray-200">
                      <th className="py-2.5 px-3">Model</th>
                      <th className="py-2.5 px-3">Product Name</th>
                      <th className="py-2.5 px-3">Color / Size</th>
                      <th className="py-2.5 px-3">Requested Qty</th>
                      <th className="py-2.5 px-3">Expected Inflow</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {stockNotices.map((sn) => (
                      <tr key={sn.id} className="hover:bg-gray-50">
                        <td className="py-3 px-3 font-mono font-bold text-gray-900">{sn.modelCode}</td>
                        <td className="py-3 px-3">{sn.productName}</td>
                        <td className="py-3 px-3">{sn.colorName} • <strong>{sn.size}</strong></td>
                        <td className="py-3 px-3 font-bold">{sn.quantityRequested} pcs</td>
                        <td className="py-3 px-3 text-gray-600">{sn.expectedDate}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            sn.status === 'Available' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {sn.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* VIEW 4: FAVOURITE ORDERS */}
            {clientAreaTab === 'favourite_orders' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Favourite Orders & Starred Models</h2>
                <p className="text-xs text-gray-500 mb-6">Quickly repeat recurrent wholesale production orders in 1 click.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {orders.map((ord) => (
                    <div key={ord.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-white transition-all shadow-2xs">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-mono font-bold text-sm text-gray-900">{ord.orderNumber}</span>
                          <p className="text-xs text-gray-500">{ord.reference}</p>
                        </div>
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      </div>
                      <div className="text-xs text-gray-600 space-y-1 my-3">
                        <p>Total items: <strong>{ord.totalPieces} pieces</strong> ({ord.items.length} items)</p>
                        <p>Net Amount: <strong className="font-mono">{ord.subtotal.toFixed(2)} €</strong></p>
                      </div>
                      <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                        <button
                          onClick={() => openDocumentModal('invoice', ord)}
                          className="text-xs text-gray-600 hover:text-black font-semibold"
                        >
                          View Invoice
                        </button>
                        <button
                          onClick={() => showToast(`Repeated order ${ord.orderNumber}! Items loaded to cart.`, 'success')}
                          className="px-3 py-1.5 bg-black text-white text-xs font-bold rounded-md hover:bg-neutral-800"
                        >
                          Repeat Order
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW 5: MARKETING */}
            {clientAreaTab === 'marketing' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Marketing Material & Media Assets</h2>
                <p className="text-xs text-gray-500 mb-6">High-resolution packshots, lookbooks, banners, unbranded technical sheets, and vector templates.</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <h3 className="font-bold text-sm text-gray-900 mb-1">2026 General Catalog</h3>
                    <p className="text-xs text-gray-500 mb-4">Complete collection with all color swatches (PDF 180MB)</p>
                    <button
                      onClick={() => showToast('Downloading 2026 General Catalog PDF...', 'info')}
                      className="w-full py-2 bg-black text-white text-xs font-bold rounded-md hover:bg-neutral-800"
                    >
                      Download (PDF)
                    </button>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <h3 className="font-bold text-sm text-gray-900 mb-1">Roly WRK Workwear Catalog</h3>
                    <p className="text-xs text-gray-500 mb-4">Certified High-vis, flame-retardant & industry wear</p>
                    <button
                      onClick={() => showToast('Downloading Roly WRK Catalog...', 'info')}
                      className="w-full py-2 bg-black text-white text-xs font-bold rounded-md hover:bg-neutral-800"
                    >
                      Download (PDF)
                    </button>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <h3 className="font-bold text-sm text-gray-900 mb-1">Neutral White-label Packshots</h3>
                    <p className="text-xs text-gray-500 mb-4">ZIP archive with unbranded mockups for distributors</p>
                    <button
                      onClick={() => showToast('Downloading White-label Packshots ZIP...', 'info')}
                      className="w-full py-2 bg-black text-white text-xs font-bold rounded-md hover:bg-neutral-800"
                    >
                      Download (ZIP)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 6: MY ADDRESSES */}
            {clientAreaTab === 'addresses' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">My Shipping & Billing Addresses</h2>
                    <p className="text-xs text-gray-500">Manage multiple logistics hubs and drop-shipping destination addresses.</p>
                  </div>
                  <button
                    onClick={() => showToast('Add address modal opened', 'info')}
                    className="px-3.5 py-2 bg-black text-white text-xs font-bold rounded-md hover:bg-neutral-800 flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Address</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="border border-gray-200 rounded-lg p-5 bg-white relative">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-sm text-gray-900">{addr.title}</span>
                        {addr.isDefaultDelivery && (
                          <span className="text-[10px] bg-black text-white font-semibold px-2 py-0.5 rounded-full">
                            Default Delivery
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-gray-700">{addr.companyName}</p>
                      <p className="text-xs text-gray-500 mt-1">{addr.street}</p>
                      <p className="text-xs text-gray-500">{addr.postalCode} {addr.city}, {addr.country}</p>
                      <p className="text-xs text-gray-500 mt-1">Contact: {addr.contactPerson} • {addr.phone}</p>

                      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end space-x-3 text-xs">
                        <button
                          onClick={() => showToast('Address updated', 'success')}
                          className="text-gray-600 hover:text-black font-semibold flex items-center space-x-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW 7: CONTACT */}
            {clientAreaTab === 'contact' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Direct Commercial & Technical Support</h2>
                <p className="text-xs text-gray-500 mb-6">Assigned sales representative and European logistics escalation line.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <h3 className="text-xs font-bold text-gray-400 uppercase mb-4">Assigned Sales Representative</h3>
                    <p className="text-lg font-bold text-gray-900">{clientProfile.salesRepresentative.name}</p>
                    <p className="text-xs text-gray-600 mt-1">{clientProfile.salesRepresentative.branch}</p>
                    <div className="mt-4 space-y-2 text-xs text-gray-700">
                      <p><strong>Email:</strong> {clientProfile.salesRepresentative.email}</p>
                      <p><strong>Direct Line:</strong> {clientProfile.salesRepresentative.phone}</p>
                      <p><strong>Skype ID:</strong> {clientProfile.salesRepresentative.skype}</p>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <h3 className="text-xs font-bold text-gray-400 uppercase mb-4">Central Headquarters (Murcia / Alicante)</h3>
                    <p className="text-base font-bold text-gray-900">GOR FACTORY, S.A.</p>
                    <p className="text-xs text-gray-600 mt-1">Ctra. Santomera - Abanilla, Km. 8.8, 30620 Fortuna, Murcia</p>
                    <div className="mt-4 space-y-2 text-xs text-gray-700">
                      <p><strong>Customer Service:</strong> +34 968 309 900</p>
                      <p><strong>Warehouse Logistics Dispatch:</strong> +34 968 309 912</p>
                      <p><strong>Opening Hours:</strong> Mon - Fri: 08:00 - 19:00 CET</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 8: ACCOUNT CONFIGURATION */}
            {clientAreaTab === 'account_config' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">B2B Account Configuration & Invoicing Profile</h2>
                <p className="text-xs text-gray-500 mb-6">Manage corporate tax information, electronic invoice recipient email, and password credentials.</p>

                <div className="space-y-4 max-w-xl text-xs">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Company Registered Legal Name:</label>
                    <input
                      type="text"
                      defaultValue={clientProfile.company}
                      className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">VAT / NIF Number (Intra-Community):</label>
                    <input
                      type="text"
                      defaultValue={clientProfile.vatNumber}
                      className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Invoice Notification Email:</label>
                    <input
                      type="email"
                      defaultValue={clientProfile.email}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Assigned B2B Discount Tier:</label>
                    <input
                      type="text"
                      readOnly
                      value={clientProfile.discountTier}
                      className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 font-bold text-gray-800"
                    />
                  </div>
                  <button
                    onClick={() => showToast('Account preferences saved', 'success')}
                    className="px-6 py-2.5 bg-black text-white font-bold rounded-md hover:bg-neutral-800 transition-colors"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {/* VIEW 9: YOUROLY */}
            {clientAreaTab === 'youroly' && (
              <div className="text-center py-10">
                <div
                  className="inline-block px-8 py-3 rounded-full text-black font-black text-xl tracking-wider mb-4 shadow-lg"
                  style={{
                    background: 'linear-gradient(90deg, #d4e157 0%, #4dd0e1 50%, #ef5350 100%)',
                  }}
                >
                  YOUROLY PROGRAMME
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-3">Your Personalized Loyalty & Custom Brand Experience</h2>
                <p className="text-xs text-gray-600 max-w-xl mx-auto mb-8 leading-relaxed">
                  As a Gold B2B partner, access custom relabelling, dedicated stock reservation, direct API synchronization with your e-commerce ERP, and volume rebate tiers.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto text-left text-xs">
                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                    <h3 className="font-bold text-sm text-gray-900 mb-2">Custom Relabelling</h3>
                    <p className="text-gray-600">Sewing of your own brand woven tags or heat-transfer neck prints before shipment.</p>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                    <h3 className="font-bold text-sm text-gray-900 mb-2">Automated API Stock Feed</h3>
                    <p className="text-gray-600">Real-time inventory webhook for your WooCommerce, Shopify, or custom ERP.</p>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                    <h3 className="font-bold text-sm text-gray-900 mb-2">Priority Express Dispatch</h3>
                    <p className="text-gray-600">Guaranteed same-day packing for orders confirmed before 16:00 CET.</p>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

    </div>
  );
};
