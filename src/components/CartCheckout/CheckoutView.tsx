import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Truck, CreditCard, ShieldCheck, CheckCircle2, Building, MapPin, ArrowRight } from 'lucide-react';
import { Order } from '../../types';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    clearCart,
    cartTotal,
    cartItemCount,
    addresses,
    clientProfile,
    orders,
    setOrders,
    setTrackedOrderId,
    setActivePage,
    showToast,
    openDocumentModal,
    commerceSettings,
    siteSettings,
  } = useStore();

  const [selectedAddressId, setSelectedAddressId] = useState(addresses[0]?.id || 'addr-1');
  const enabledShippingMethods = commerceSettings.shippingMethods.filter((method) => method.enabled);
  const enabledPaymentMethods = commerceSettings.paymentMethods.filter((method) => method.enabled);
  const [shippingMethod, setShippingMethod] = useState(enabledShippingMethods[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState(enabledPaymentMethods[0]?.id || '');
  const [poReference, setPoReference] = useState(`${commerceSettings.orderPrefix}-PO-${Math.floor(100000 + Math.random() * 900000)}`);
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];
  const selectedShipping = enabledShippingMethods.find((method) => method.id === shippingMethod) || enabledShippingMethods[0];
  const selectedPayment = enabledPaymentMethods.find((method) => method.id === paymentMethod) || enabledPaymentMethods[0];
  const subtotal = cartTotal;
  const shippingCost = selectedShipping ? (selectedShipping.freeAbove > 0 && subtotal >= selectedShipping.freeAbove ? 0 : selectedShipping.price) : 0;
  const paymentFee = selectedPayment ? subtotal * (selectedPayment.feePercent / 100) : 0;
  const taxRate = siteSettings.vatRate / 100;
  const taxableAmount = subtotal + shippingCost + paymentFee;
  const taxAmount = commerceSettings.taxInclusivePricing ? taxableAmount - (taxableAmount / (1 + taxRate)) : taxableAmount * taxRate;
  const total = commerceSettings.taxInclusivePricing ? taxableAmount : taxableAmount + taxAmount;

  const handleConfirmOrder = async () => {
    if (!selectedAddress || !selectedShipping || !selectedPayment) {
      showToast('A delivery address, shipping method and payment method are required', 'warning');
      return;
    }
    if (commerceSettings.requireTermsAcceptance && !termsAccepted) {
      showToast('Please accept the sales terms before placing the order', 'warning');
      return;
    }
    if (selectedPayment.type === 'gateway' && !selectedPayment.credentialsConfigured) {
      showToast(`${selectedPayment.provider} server credentials have not been configured by an administrator`, 'warning');
      return;
    }
    setIsSubmitting(true);
    await new Promise((res) => setTimeout(res, 900));

    const newOrderNumber = `#4020${Math.floor(60000 + Math.random() * 30000)}`;
    const newDeliveryNumber = `#8221${Math.floor(3000 + Math.random() * 9000)}`;
    const newInvoiceNumber = `INV-2026-0${Math.floor(9000 + Math.random() * 900)}`;
    const newPackingList = `PL-2100${Math.floor(23000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: newOrderNumber,
      deliveryNoteNumber: newDeliveryNumber,
      invoiceNumber: newInvoiceNumber,
      packingListNumber: newPackingList,
      reference: poReference,
      date: new Date().toLocaleDateString('en-US'),
      status: 'Processing',
      paymentStatus: selectedPayment.type === 'invoice' ? 'Pending 30 Days' : selectedPayment.type === 'gateway' ? 'Paid' : 'Pending Payment',
      paymentMethodId: selectedPayment.id,
      paymentMethodName: selectedPayment.name,
      notes: orderNotes,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US'),
      items: [...cart],
      subtotal,
      taxRate,
      taxAmount,
      shippingCost,
      paymentFee,
      total,
      shippingAddress: selectedAddress,
      billingAddress: addresses[0],
      carrier: selectedShipping.carrier,
      trackingNumber: `GLS-ES-${Math.floor(800000000 + Math.random() * 100000000)}`,
      totalBoxes: Math.ceil(cartItemCount / 50),
      totalPacks: Math.ceil(cartItemCount / 10),
      totalPieces: cartItemCount,
      grossWeightKg: Math.round(cartItemCount * 0.16 * 10) / 10,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setTrackedOrderId(newOrder.id);
    clearCart();
    setIsSubmitting(false);
    showToast(`Order ${newOrder.orderNumber} successfully transmitted to warehouse!`, 'success');
    setActivePage('order_tracking');
  };

  return (
    <div className="w-full bg-[#fbfbfb] min-h-screen pb-20 font-sans">
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 uppercase tracking-tight">
            Checkout & Wholesale Order Transmission
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Form */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Step 1: Delivery Address */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs space-y-4 text-xs">
              <div className="flex items-center space-x-2 font-bold text-sm text-gray-900 border-b border-gray-100 pb-3">
                <MapPin className="w-4 h-4 text-gray-700" />
                <span>1. Select Delivery Destination Hub</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                      selectedAddressId === addr.id ? 'border-black bg-gray-50/80 shadow-xs' : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-gray-900">{addr.title}</span>
                        <input
                          type="radio"
                          name="deliveryAddress"
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                          className="accent-black"
                        />
                      </div>
                      <p className="font-semibold text-gray-700">{addr.companyName}</p>
                      <p className="text-gray-500">{addr.street}</p>
                      <p className="text-gray-500">{addr.postalCode} {addr.city}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Step 2: Shipping Method */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs space-y-4 text-xs">
              <div className="flex items-center space-x-2 font-bold text-sm text-gray-900 border-b border-gray-100 pb-3">
                <Truck className="w-4 h-4 text-gray-700" />
                <span>2. Logistics & Carrier Method</span>
              </div>

              <div className="space-y-2">
                {[
                  ...enabledShippingMethods,
                ].map((ship) => {
                  const methodCost = ship.freeAbove > 0 && subtotal >= ship.freeAbove ? 0 : ship.price;
                  return (
                  <label
                    key={ship.id}
                    className={`flex items-center justify-between p-3.5 rounded-lg border cursor-pointer transition-all ${
                      shippingMethod === ship.id ? 'border-black bg-gray-50 shadow-xs' : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === ship.id}
                        onChange={() => setShippingMethod(ship.id)}
                        className="accent-black"
                      />
                      <div>
                        <p className="font-bold text-gray-900">{ship.name}</p>
                        <p className="text-[11px] text-gray-500">{ship.description} · {ship.estimatedDays}</p>
                      </div>
                    </div>
                    <span className="font-bold text-emerald-600 font-mono">{methodCost === 0 ? 'FREE' : `${methodCost.toFixed(2)} ${siteSettings.currency}`}</span>
                  </label>
                )})}
                {enabledShippingMethods.length === 0 && <p className="rounded-lg bg-amber-50 p-4 text-amber-800">No delivery method is enabled. Ask an administrator to configure shipping.</p>}
              </div>
            </div>

            {/* Step 3: Payment Terms */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs space-y-4 text-xs">
              <div className="flex items-center space-x-2 font-bold text-sm text-gray-900 border-b border-gray-100 pb-3">
                <CreditCard className="w-4 h-4 text-gray-700" />
                <span>3. B2B Commercial Payment Terms</span>
              </div>

              <div className="space-y-2">
                {[
                  ...enabledPaymentMethods,
                ].map((pay) => (
                  <label
                    key={pay.id}
                    className={`flex items-center justify-between p-3.5 rounded-lg border cursor-pointer transition-all ${
                      paymentMethod === pay.id ? 'border-black bg-gray-50 shadow-xs' : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === pay.id}
                        onChange={() => setPaymentMethod(pay.id)}
                        className="accent-black"
                      />
                      <div>
                        <p className="font-bold text-gray-900">{pay.name}</p>
                        <p className="text-[11px] text-gray-500">{pay.description}{pay.feePercent > 0 ? ` · ${pay.feePercent}% fee` : ''}</p>
                        {pay.type === 'gateway' && !pay.credentialsConfigured && <p className="mt-1 text-[10px] font-bold text-amber-700">Awaiting server credential setup</p>}
                      </div>
                    </div>
                  </label>
                ))}
                {enabledPaymentMethods.length === 0 && <p className="rounded-lg bg-amber-50 p-4 text-amber-800">No payment method is enabled. Ask an administrator to configure payments.</p>}
              </div>
            </div>

            {/* Step 4: Notes */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs text-xs space-y-3">
              <label className="block font-bold text-gray-900 uppercase">
                Special Delivery Instructions / Warehouse Notes:
              </label>
              <textarea
                rows={2}
                placeholder="e.g., Deliver during morning dock hours (09:00 - 13:00). Tail-lift truck required."
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="w-full border border-gray-300 rounded p-2.5 outline-none focus:border-black"
              />
            </div>
          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4 text-xs">
              <h3 className="font-bold text-sm text-gray-900 uppercase tracking-tight border-b border-gray-100 pb-3">
                Final Order Summary
              </h3>

              <div className="space-y-2 text-gray-600">
                <div className="flex justify-between">
                  <span>Ordered Models:</span>
                  <span className="font-bold text-gray-900">{cart.length} references</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Garments:</span>
                  <span className="font-bold text-gray-900 font-mono">{cartItemCount} pcs</span>
                </div>
                <div className="flex justify-between">
                  <span>Net Amount:</span>
                  <span className="font-bold text-gray-900 font-mono">{subtotal.toFixed(2)} {siteSettings.currency}</span>
                </div>
                <div className="flex justify-between"><span>Shipping:</span><span className="font-bold text-gray-900 font-mono">{shippingCost === 0 ? 'FREE' : `${shippingCost.toFixed(2)} ${siteSettings.currency}`}</span></div>
                {paymentFee > 0 && <div className="flex justify-between"><span>Payment fee:</span><span className="font-bold text-gray-900 font-mono">{paymentFee.toFixed(2)} {siteSettings.currency}</span></div>}
                <div className="flex justify-between">
                  <span>VAT ({siteSettings.vatRate}%){commerceSettings.taxInclusivePricing ? ' included' : ''}:</span>
                  <span className="font-bold text-gray-900 font-mono">{taxAmount.toFixed(2)} {siteSettings.currency}</span>
                </div>
              </div>

              <div className="pt-3 border-t-2 border-black flex justify-between items-baseline">
                <span className="font-bold text-sm text-gray-900">TOTAL TO INVOICE:</span>
                <span className="text-2xl font-black font-mono text-gray-900">
                  {total.toFixed(2)} {siteSettings.currency}
                </span>
              </div>

              {commerceSettings.requireTermsAcceptance && <label className="flex cursor-pointer items-start gap-2 rounded-md bg-neutral-50 p-3 text-[11px] leading-4"><input type="checkbox" checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)} className="mt-0.5 accent-black" /><span>I accept the sales, delivery, returns and payment terms for this order.</span></label>}

              <button
                disabled={isSubmitting || cart.length === 0 || enabledShippingMethods.length === 0 || enabledPaymentMethods.length === 0}
                onClick={handleConfirmOrder}
                className="w-full py-4 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Transmitting to Logistics...</span>
                ) : (
                  <>
                    <span>CONFIRM & TRANSMIT ORDER</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[10px] text-gray-400 text-center">
                By confirming, you accept Gor Factory S.A. B2B wholesale sales conditions.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
