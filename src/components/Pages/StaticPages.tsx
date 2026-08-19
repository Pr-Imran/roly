import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  FileText, 
  Download, 
  ShieldCheck, 
  Leaf, 
  CheckCircle2, 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  Search, 
  Package, 
  ExternalLink,
  Award,
  Globe
} from 'lucide-react';

export const StaticPages: React.FC = () => {
  const { activePage, setActivePage, navigateToProduct, products, showToast } = useStore();
  const [stockQuery, setStockQuery] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Inquiry sent to Gor Factory S.A. customer support!', 'success');
    setContactName('');
    setContactEmail('');
    setContactMessage('');
  };

  return (
    <div className="w-full bg-[#fbfbfb] min-h-screen pb-20 font-sans">
      {/* 1. Catalogs & Lookbooks Page */}
      {activePage === 'catalogs' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Digital Lookbooks & PDF Downloads</span>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mt-1">Official Roly 2026 Catalogues</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              Browse and download high-resolution neutral and branded PDF catalogues for your promotional textile business.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'General Collection 2026', pages: '480 Pages', size: '48.2 MB', cover: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80' },
              { title: 'Roly WRK Workwear & Safety', pages: '196 Pages', size: '24.1 MB', cover: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80' },
              { title: 'Roly Sport & Performance', pages: '144 Pages', size: '18.5 MB', cover: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80' },
              { title: 'Roly Eco Sustainable Organic', pages: '98 Pages', size: '12.4 MB', cover: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=600&q=80' },
            ].map((cat, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs flex flex-col justify-between">
                <div className="aspect-[3/4] overflow-hidden bg-gray-100 relative">
                  <img src={cat.cover} alt={cat.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-black text-white text-[10px] font-bold px-2 py-1 rounded">
                    PDF
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">{cat.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{cat.pages} • {cat.size}</p>
                  </div>
                  <button
                    onClick={() => showToast(`Downloading ${cat.title} PDF`, 'info')}
                    className="mt-4 w-full py-2 bg-black hover:bg-neutral-800 text-white text-xs font-bold rounded flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Quality & Certifications Page */}
      {activePage === 'quality' && (
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Quality & Sustainability</span>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mt-1">European Certified Quality & Ethics</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              Gor Factory S.A. operates under the most stringent international social, environmental and textile safety certifications.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-800">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900">OEKO-TEX® Standard 100</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Guarantees that all Roly garments are free from harmful substances and safe for human skin, including sensitive infant apparel.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-800">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900">ISO 9001 & ISO 14001</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Certified quality management and environmental protection across the entire logistics chain at our central hub in Murcia/Alicante.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-800">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900">BSCI Social Compliance</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Audited ethical workplace conditions, fair wages, workplace safety, and zero tolerance for child or forced labor across all global manufacturing.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center text-amber-800">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Global Organic Textile Standard (GOTS)</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                All Roly ECO items utilize 100% certified organic cotton cultivated without toxic pesticides or GMO seeds.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Stock Live Search by Model / Color */}
      {activePage === 'stock_search' && (
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Real-Time Warehouse Stock</span>
            <h1 className="text-3xl font-black text-gray-900 mt-1">Live Stock Availability Finder</h1>
            <p className="text-xs text-gray-600 mt-1">Search any Roly model code (e.g. CA6681, CA6554, PO6632) for instant warehouse numbers.</p>
          </div>

          <div className="max-w-xl mx-auto flex items-center border-2 border-black rounded-lg overflow-hidden bg-white shadow-xs">
            <Search className="w-5 h-5 text-gray-400 ml-3 shrink-0" />
            <input
              type="text"
              placeholder="Search model code or garment name..."
              value={stockQuery}
              onChange={(e) => setStockQuery(e.target.value)}
              className="w-full px-3 py-3 text-sm font-bold outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products
              .filter(p => !stockQuery || p.modelCode.toLowerCase().includes(stockQuery.toLowerCase()) || p.name.toLowerCase().includes(stockQuery.toLowerCase()))
              .map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigateToProduct(p.modelCode)}
                  className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs hover:border-black cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <img src={p.images[0]} alt={p.name} className="w-14 h-14 object-cover rounded border border-gray-200" />
                    <div>
                      <span className="font-mono font-bold text-xs bg-black text-white px-1.5 py-0.5 rounded">{p.modelCode}</span>
                      <h4 className="font-bold text-sm text-gray-900 mt-1">{p.name}</h4>
                      <p className="text-xs text-gray-500">{p.colors.length} shades • {p.weightGsm} g/m²</p>
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <span className="text-emerald-700 font-bold font-mono block">In Stock</span>
                    <span className="text-gray-400 text-[11px]">View breakdown →</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 4. Contact & Gor Factory Headquarters Page */}
      {activePage === 'contact' && (
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Headquarters & Logistics</span>
                <h1 className="text-3xl font-black text-gray-900 mt-1">Gor Factory S.A.</h1>
                <p className="text-xs text-gray-600 mt-2">
                  Central distribution logistics platform with 45,000 m² automated warehouse and over 35 million garments in permanent stock.
                </p>
              </div>

              <div className="space-y-3 text-xs text-gray-700">
                <div className="flex items-start space-x-3 bg-white p-4 rounded-lg border border-gray-200">
                  <MapPin className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                  <div>
                    <strong className="block text-gray-900">Headquarters Address:</strong>
                    <span>Ctra. Santomera - Abanilla km 8.8, 30620 Fortuna, Murcia (Spain)</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-white p-4 rounded-lg border border-gray-200">
                  <Phone className="w-4 h-4 text-gray-500 shrink-0" />
                  <div>
                    <strong className="block text-gray-900">B2B Customer Care:</strong>
                    <span>+34 968 68 70 00 (Mon - Fri 08:00 to 19:00 CET)</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-white p-4 rounded-lg border border-gray-200">
                  <Mail className="w-4 h-4 text-gray-500 shrink-0" />
                  <div>
                    <strong className="block text-gray-900">Commercial Email:</strong>
                    <span>info@gorfactory.com / sales@roly.eu</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white p-8 rounded-xl border border-gray-200 shadow-xs">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Send Wholesale / Distributor Inquiry</h2>
              <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Company / Contact Name:</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full border border-gray-300 rounded p-2.5 outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Corporate Email:</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full border border-gray-300 rounded p-2.5 outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Message / Inquiry Details:</label>
                  <textarea
                    rows={5}
                    required
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Tell us about your distribution needs, customized embroidery project, or order tracking questions..."
                    className="w-full border border-gray-300 rounded p-2.5 outline-none focus:border-black"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-black hover:bg-neutral-800 text-white font-bold uppercase rounded-md flex items-center space-x-2 transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
