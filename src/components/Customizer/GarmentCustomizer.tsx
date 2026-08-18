import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Sparkles, Upload, Type, Layers, Check, ShoppingBag, Info, Sliders, RefreshCw } from 'lucide-react';

export const GarmentCustomizer: React.FC = () => {
  const { products, addToCart, showToast, setActivePage } = useStore();

  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [selectedColor, setSelectedColor] = useState(products[0].colors[0]);
  const [placement, setPlacement] = useState<'chest_center' | 'left_breast' | 'full_back' | 'sleeve'>('left_breast');
  const [technique, setTechnique] = useState<'embroidery' | 'screen_print' | 'dtf_transfer' | 'sublimation'>('embroidery');
  const [customText, setCustomText] = useState('ACME CORP');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [textSize, setTextSize] = useState(24);
  const [logoUploaded, setLogoUploaded] = useState<string | null>(null);
  const [totalCustomQty, setTotalCustomQty] = useState(100);

  const techniques = [
    { id: 'embroidery', name: 'High-Density Embroidery', costPerUnit: 1.85, setupFee: 25.00, desc: 'Premium stitched thread for polos, jackets & caps' },
    { id: 'screen_print', name: 'Screen Printing (1-4 Colors)', costPerUnit: 0.95, setupFee: 30.00, desc: 'High-volume durable ink for t-shirts & bags' },
    { id: 'dtf_transfer', name: 'DTF Full Color Digital Transfer', costPerUnit: 1.40, setupFee: 15.00, desc: 'Ultra-vibrant gradients & photorealistic prints' },
    { id: 'sublimation', name: 'Polyester Sublimation', costPerUnit: 1.10, setupFee: 20.00, desc: 'Breathable zero-feel ink for technical sportswear' },
  ];

  const currentTech = techniques.find(t => t.id === technique) || techniques[0];
  const garmentUnitPrice = totalCustomQty >= selectedProduct.boxQuantity ? selectedProduct.priceBox : selectedProduct.pricePack;
  const unitTotal = garmentUnitPrice + currentTech.costPerUnit;
  const batchTotal = (unitTotal * totalCustomQty) + currentTech.setupFee;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setLogoUploaded(reader.result as string);
        showToast('Logo mockup uploaded to garment preview', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCustomizedToCart = () => {
    addToCart({
      productId: selectedProduct.id,
      modelCode: selectedProduct.modelCode,
      productName: `${selectedProduct.name} (Customized: ${currentTech.name})`,
      image: selectedProduct.images[0],
      colorName: selectedColor.name,
      colorHex: selectedColor.hex,
      sizeBreakdown: {
        M: Math.floor(totalCustomQty * 0.4),
        L: Math.floor(totalCustomQty * 0.4),
        XL: totalCustomQty - Math.floor(totalCustomQty * 0.8),
      },
      totalQuantity: totalCustomQty,
      unitPrice: unitTotal,
      totalPrice: batchTotal,
      customization: {
        technique: currentTech.name,
        placement,
        customText,
        logoUrl: logoUploaded || undefined,
        additionalCostPerUnit: currentTech.costPerUnit,
      }
    });
    setActivePage('cart');
  };

  return (
    <div className="w-full bg-[#fbfbfb] min-h-screen pb-20 font-sans">
      <div className="bg-neutral-900 text-white py-6 px-4 sm:px-8 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-yellow-400 font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Roly Customizer Studio & Print Simulator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Garment Customization & Printing Lab</h1>
          </div>
          <div className="text-xs text-neutral-400 text-right">
            <span>Minimum Custom Order: </span>
            <strong className="text-white">25 pieces</strong>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Visual Interactive Garment Canvas */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-xs flex flex-col items-center">
            <div className="relative w-full max-w-md aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center p-6">
              <img
                src={selectedProduct.images[0]}
                alt="garment"
                className="w-full h-full object-contain filter drop-shadow-md"
              />

              {/* Placement Visual Overlay Target */}
              <div
                className={`absolute transition-all duration-300 flex items-center justify-center border-2 border-dashed border-yellow-400/80 bg-black/20 backdrop-blur-2xs p-2 rounded-sm ${
                  placement === 'left_breast' ? 'top-28 left-28 w-24 h-16' :
                  placement === 'chest_center' ? 'top-32 left-1/2 -translate-x-1/2 w-44 h-28' :
                  placement === 'full_back' ? 'top-28 left-1/2 -translate-x-1/2 w-52 h-48' :
                  'top-36 left-12 w-20 h-16'
                }`}
              >
                {logoUploaded ? (
                  <img src={logoUploaded} alt="custom-logo" className="max-w-full max-h-full object-contain" />
                ) : (
                  <span
                    className="font-bold text-center select-none truncate drop-shadow-md"
                    style={{ color: textColor, fontSize: `${textSize}px` }}
                  >
                    {customText}
                  </span>
                )}
              </div>
            </div>

            <div className="w-full mt-4 flex items-center justify-between text-xs text-gray-500">
              <span>Preview Model: <strong>{selectedProduct.modelCode} ({selectedColor.name})</strong></span>
              <span>Placement: <strong className="uppercase">{placement.replace('_', ' ')}</strong></span>
            </div>
          </div>

          {/* Control Settings & Technique Pricing */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-xs space-y-5 text-xs">
              
              {/* Step 1: Select Garment Model */}
              <div>
                <label className="block font-bold text-gray-900 uppercase mb-2">1. Select Garment Model</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {products.slice(0, 6).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedProduct(p);
                        setSelectedColor(p.colors[0]);
                      }}
                      className={`p-2 rounded-lg border text-left transition-all ${
                        selectedProduct.id === p.id ? 'border-black bg-gray-50 font-bold' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="font-mono text-[10px] text-gray-400 block">{p.modelCode}</span>
                      <span className="text-gray-900 truncate block">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Placement */}
              <div>
                <label className="block font-bold text-gray-900 uppercase mb-2">2. Print / Embroidery Placement</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'left_breast', label: 'Left Breast' },
                    { id: 'chest_center', label: 'Center Chest' },
                    { id: 'full_back', label: 'Full Back' },
                    { id: 'sleeve', label: 'Right Sleeve' },
                  ].map((pos) => (
                    <button
                      key={pos.id}
                      onClick={() => setPlacement(pos.id as any)}
                      className={`py-2 px-3 rounded-lg border font-semibold text-center transition-all ${
                        placement === pos.id ? 'bg-black text-white border-black' : 'bg-gray-50 text-gray-700 border-gray-200'
                      }`}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Technique & Pricing */}
              <div>
                <label className="block font-bold text-gray-900 uppercase mb-2">3. Printing / Customization Technique</label>
                <div className="space-y-2">
                  {techniques.map((t) => (
                    <label
                      key={t.id}
                      onClick={() => setTechnique(t.id as any)}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                        technique === t.id ? 'border-black bg-gray-50/80 shadow-xs' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="technique"
                          checked={technique === t.id}
                          onChange={() => setTechnique(t.id as any)}
                          className="accent-black"
                        />
                        <div>
                          <p className="font-bold text-gray-900">{t.name}</p>
                          <p className="text-[11px] text-gray-500">{t.desc}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-gray-900">+{t.costPerUnit.toFixed(2)} €/pc</span>
                        <span className="text-[10px] text-gray-400 block">Setup: {t.setupFee.toFixed(2)} €</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Step 4: Text or Upload Logo */}
              <div>
                <label className="block font-bold text-gray-900 uppercase mb-2">4. Client Artwork / Text</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-500 mb-1">Custom Lettering:</label>
                    <input
                      type="text"
                      value={customText}
                      onChange={(e) => {
                        setCustomText(e.target.value);
                        setLogoUploaded(null);
                      }}
                      className="w-full border border-gray-300 rounded px-3 py-2 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">Or Upload Vector / PNG Logo:</label>
                    <label className="flex items-center justify-center space-x-2 border border-dashed border-gray-300 hover:border-black rounded px-3 py-2 bg-gray-50 cursor-pointer text-gray-700">
                      <Upload className="w-4 h-4" />
                      <span>{logoUploaded ? 'Change File' : 'Upload Logo'}</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Step 5: Quantity Slider */}
              <div className="pt-2 border-t border-gray-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-gray-900 uppercase">Order Quantity:</span>
                  <span className="font-mono font-bold text-sm text-black">{totalCustomQty} pieces</span>
                </div>
                <input
                  type="range"
                  min="25"
                  max="1000"
                  step="25"
                  value={totalCustomQty}
                  onChange={(e) => setTotalCustomQty(parseInt(e.target.value, 10))}
                  className="w-full accent-black cursor-pointer"
                />
              </div>

              {/* Financial Calculation Box */}
              <div className="bg-neutral-900 text-white p-5 rounded-xl space-y-3">
                <div className="space-y-1.5 text-[11px] text-neutral-300 border-b border-neutral-800 pb-3">
                  <div className="flex justify-between">
                    <span>Garment Base Price ({selectedProduct.modelCode}):</span>
                    <span className="font-mono">{garmentUnitPrice.toFixed(2)} €/pc</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{currentTech.name} Application:</span>
                    <span className="font-mono">+{currentTech.costPerUnit.toFixed(2)} €/pc</span>
                  </div>
                  <div className="flex justify-between text-yellow-400 font-semibold">
                    <span>Technical Screen / Punch Setup Fee:</span>
                    <span className="font-mono">{currentTech.setupFee.toFixed(2)} € (One-time)</span>
                  </div>
                </div>

                <div className="flex justify-between items-end pt-1">
                  <div>
                    <p className="text-[10px] text-neutral-400">Total Customized Production:</p>
                    <p className="text-2xl font-black font-mono text-yellow-400">{batchTotal.toFixed(2)} €</p>
                    <p className="text-[10px] text-neutral-400 font-mono">({unitTotal.toFixed(2)} €/pc effective unit price)</p>
                  </div>

                  <button
                    onClick={handleAddCustomizedToCart}
                    className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-bold uppercase rounded-lg shadow-md flex items-center space-x-2 transition-all cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add Customized Batch</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
