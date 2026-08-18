import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, ShoppingBag, FileText, ChevronRight } from 'lucide-react';

export const CartView: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    cartTotal,
    cartItemCount,
    displayPrices,
    setActivePage,
    navigateToProduct,
  } = useStore();

  const [orderReference, setOrderReference] = useState('');
  const [isVatExempt, setIsVatExempt] = useState(false);

  const subtotal = cartTotal;
  const taxAmount = isVatExempt ? 0 : subtotal * 0.21;
  const grandTotal = subtotal + taxAmount;

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center font-sans">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your B2B Cart is Empty</h2>
        <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
          Browse our wholesale catalog of over 200 apparel and textile models with instant stock availability.
        </p>
        <button
          onClick={() => setActivePage('category')}
          className="px-6 py-3 bg-black text-white text-xs font-bold uppercase rounded-md hover:bg-neutral-800 transition-colors"
        >
          Explore Roly Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#fbfbfb] min-h-screen pb-20 font-sans">
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 uppercase tracking-tight">
            Wholesale Order Cart ({cartItemCount} pieces)
          </h1>
          <button
            onClick={clearCart}
            className="text-xs text-red-600 hover:underline font-semibold"
          >
            Clear entire cart
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-gray-100 pb-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-gray-900">{item.productName}</span>
                        <span className="text-xs font-mono font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-xs">
                          {item.modelCode}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                        <span className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: item.colorHex }} />
                        <span>{item.colorName}</span>
                        {item.customization && (
                          <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-xs">
                            Custom: {item.customization.technique}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex sm:flex-col justify-between items-end">
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase">Applied Rate</span>
                      <span className="text-xs font-bold font-mono text-gray-900">{item.unitPrice.toFixed(2)} €/pc</span>
                    </div>
                    <button
                      onClick={() => removeFromCart(idx)}
                      className="text-gray-400 hover:text-red-600 transition-colors p-1"
                      title="Remove product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Size breakdown matrix rows */}
                <div className="pt-3">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                    Size Quantity Breakdown:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(item.sizeBreakdown).map(([sz, qty]) => (
                      <div key={sz} className="flex items-center space-x-1.5 bg-gray-50 border border-gray-200 rounded px-2.5 py-1 text-xs">
                        <span className="font-bold text-gray-900">{sz}:</span>
                        <input
                          type="number"
                          min="0"
                          value={qty}
                          onChange={(e) => updateCartItemQuantity(idx, sz, parseInt(e.target.value, 10) || 0)}
                          className="w-14 bg-white border border-gray-300 rounded px-1.5 py-0.5 text-center font-bold font-mono text-xs"
                        />
                        <span className="text-[10px] text-gray-400">pcs</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center text-xs">
                  <span className="text-gray-500">
                    Item Total: <strong>{item.totalQuantity} pieces</strong>
                  </span>
                  <span className="font-mono font-bold text-sm text-gray-900">
                    {item.totalPrice.toFixed(2)} €
                  </span>
                </div>
              </div>
            ))}

            {/* Client Internal Order Reference */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 text-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <label className="font-semibold text-gray-700">Internal Client Order Reference / Project Code:</label>
              <input
                type="text"
                placeholder="e.g. SUMMER-CAMPAIGN-2026"
                value={orderReference}
                onChange={(e) => setOrderReference(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1.5 w-full sm:w-64 outline-none focus:border-black font-semibold"
              />
            </div>
          </div>

          {/* Right Order Summary Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4 text-xs">
              <h3 className="font-bold text-sm text-gray-900 uppercase tracking-tight border-b border-gray-100 pb-3">
                Order Financial Summary
              </h3>

              <div className="space-y-2 text-gray-600">
                <div className="flex justify-between">
                  <span>Total Ordered Quantity:</span>
                  <span className="font-bold text-gray-900 font-mono">{cartItemCount} pcs</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal Net:</span>
                  <span className="font-bold text-gray-900 font-mono">{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Standard Pallet Logistics:</span>
                  <span className="text-emerald-600 font-bold">FREE (B2B Wholesale)</span>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-gray-600">Intra-EU VAT Exemption (VIES):</span>
                    <input
                      type="checkbox"
                      checked={isVatExempt}
                      onChange={(e) => setIsVatExempt(e.target.checked)}
                      className="accent-black rounded"
                    />
                  </label>
                </div>

                <div className="flex justify-between">
                  <span>VAT / IVA (21%):</span>
                  <span className="font-mono font-bold text-gray-900">{taxAmount.toFixed(2)} €</span>
                </div>
              </div>

              <div className="pt-3 border-t-2 border-black flex justify-between items-baseline">
                <span className="font-bold text-sm text-gray-900">Total Order Amount:</span>
                <span className="text-2xl font-black font-mono text-gray-900">
                  {grandTotal.toFixed(2)} €
                </span>
              </div>

              <button
                onClick={() => setActivePage('checkout')}
                className="w-full py-3.5 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-[10px] text-gray-400 space-y-1 text-center">
                <p>• SEPA B2B Direct Debit 30 Days Terms Applied</p>
                <p>• Fast dispatch from Alicante Logistics Hub</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
