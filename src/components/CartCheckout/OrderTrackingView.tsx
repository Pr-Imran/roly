import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle2, Truck, Package, Clock, FileText, Printer, Download, ArrowLeft } from 'lucide-react';

export const OrderTrackingView: React.FC = () => {
  const { trackedOrderId, orders, openDocumentModal, setActivePage, setClientAreaTab, setDocumentSubTab } = useStore();

  const order = orders.find((o) => o.id === trackedOrderId) || orders[0];

  const milestones = [
    { title: 'Order Received & Registered', date: order.date, desc: 'Validated by Gor Factory ERP system', done: true },
    { title: 'Warehouse Picking in Alicante Hub', date: order.date, desc: `Packing ${order.totalBoxes || 12} cartons from central automated racks`, done: true },
    { title: 'Quality Control & Logistics Packing', date: order.date, desc: 'Barcode labeling & Weight verification', done: order.status !== 'Pending' },
    { title: 'Handed Over to Carrier (GLS EuroFreight)', date: 'In Progress', desc: `Tracking ID: ${order.trackingNumber}`, done: order.status === 'Dispatched' || order.status === 'Delivered' || order.status === 'Invoiced' },
    { title: 'Delivered at Client Destination Hub', date: 'Expected 24/48h', desc: order.shippingAddress.street, done: order.status === 'Delivered' || order.status === 'Invoiced' },
  ];

  return (
    <div className="w-full bg-[#fbfbfb] min-h-screen pb-20 font-sans">
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setActivePage('client_area');
                setClientAreaTab('documents');
                setDocumentSubTab('orders');
              }}
              className="text-xs text-gray-500 hover:text-black flex items-center space-x-1 font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Client Area</span>
            </button>
          </div>
          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full">
            Status: {order.status}
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-8 space-y-6">
        {/* Header Card */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order Confirmation & Tracking</span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 font-mono mt-0.5">
              {order.orderNumber}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Client Ref: <strong>{order.reference}</strong> • Date: {order.date} • Total: <strong className="text-gray-900">{order.total.toFixed(2)} €</strong>
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => openDocumentModal('packing_list', order)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-md flex items-center space-x-1.5 transition-colors"
            >
              <Package className="w-3.5 h-3.5" />
              <span>View Packing List</span>
            </button>

            <button
              onClick={() => openDocumentModal('invoice', order)}
              className="px-4 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-bold rounded-md flex items-center space-x-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Generate & Print Invoice</span>
            </button>
          </div>
        </div>

        {/* Live Milestone Tracker */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-xs space-y-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Logistics Fulfillment Timeline</h2>

          <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
            {milestones.map((ms, i) => (
              <div key={i} className="relative flex items-start space-x-4">
                <div className={`absolute -left-6 sm:-left-8 top-0.5 w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center text-white text-xs ${
                  ms.done ? 'bg-black shadow-xs' : 'bg-gray-300'
                }`}>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <div className="flex items-center space-x-2">
                    <p className="font-bold text-sm text-gray-900">{ms.title}</p>
                    <span className="text-[10px] text-gray-400 font-mono">{ms.date}</span>
                  </div>
                  <p className="text-gray-500 mt-0.5">{ms.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ordered Items Breakdown */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-xs text-xs space-y-4">
          <h2 className="font-bold text-sm text-gray-900 uppercase tracking-wider">Package Contents ({order.totalPieces} pieces)</h2>
          <div className="divide-y divide-gray-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src={item.image} alt={item.productName} className="w-12 h-12 object-cover rounded border border-gray-200" />
                  <div>
                    <span className="font-bold text-gray-900 block">{item.productName}</span>
                    <span className="text-gray-500">{item.colorName} • {item.totalQuantity} pcs total</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-sm text-gray-900">{item.totalPrice.toFixed(2)} €</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
