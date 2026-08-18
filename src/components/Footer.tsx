import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, Truck, Clock, Phone, Mail, MapPin, Award, CheckCircle2 } from 'lucide-react';
import { CATEGORIES } from '../data/mockProducts';

export const Footer: React.FC = () => {
  const { setActivePage, navigateToCategory, setAdminTab } = useStore();

  return (
    <footer className="bg-neutral-950 text-white font-sans border-t border-neutral-800 text-xs">
      {/* Service Highlights Bar */}
      <div className="border-b border-neutral-800 py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-yellow-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <strong className="block text-white text-sm">24/48h European Delivery</strong>
              <span className="text-gray-400 text-[11px]">Direct dispatch from central automated hub</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-yellow-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <strong className="block text-white text-sm">Oeko-Tex Standard 100</strong>
              <span className="text-gray-400 text-[11px]">Certified safe textiles & non-toxic dyes</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-yellow-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <strong className="block text-white text-sm">35+ Million Garments</strong>
              <span className="text-gray-400 text-[11px]">Permanent stock ready in Alicante hub</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-yellow-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <strong className="block text-white text-sm">B2B Volume Tiering</strong>
              <span className="text-gray-400 text-[11px]">Unit, pack, and pallet wholesale discounts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <span className="text-2xl font-black tracking-tight text-white block">ROLY</span>
            <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
              ROLY is the registered brand of <strong>Gor Factory S.A.</strong>, one of Europe's premier textile manufacturers specializing in promotional garments, sports apparel, corporate workwear, and high-visibility work uniforms.
            </p>
            <div className="text-[11px] text-gray-500 space-y-1">
              <p>Gor Factory S.A. • Ctra. Santomera - Abanilla km 8.8, 30620 Fortuna, Murcia (Spain)</p>
              <p>B2B Support: +34 968 68 70 00 • info@gorfactory.com</p>
            </div>
          </div>

          {/* Col 2: Catalog Collections */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Collections</h4>
            <ul className="space-y-1.5 text-gray-400">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => navigateToCategory(cat.slug)}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Customer Service & B2B */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">B2B Client Services</h4>
            <ul className="space-y-1.5 text-gray-400">
              <li>
                <button onClick={() => setActivePage('client_area')} className="hover:text-white transition-colors">
                  Customer Portal & Invoices
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('customizer')} className="hover:text-white transition-colors">
                  Garment Customizer Studio
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('stock_search')} className="hover:text-white transition-colors">
                  Real-time Stock Search
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('catalogs')} className="hover:text-white transition-colors">
                  2026 PDF Catalogues
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('quality')} className="hover:text-white transition-colors">
                  Quality & OEKO-TEX®
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: ERP Admin & Legal */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Control & Systems</h4>
            <ul className="space-y-1.5 text-gray-400">
              <li>
                <button
                  onClick={() => {
                    setActivePage('admin');
                    setAdminTab('dashboard');
                  }}
                  className="text-red-400 hover:text-red-300 font-bold transition-colors"
                >
                  Admin ERP Panel →
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActivePage('admin');
                    setAdminTab('db_setup');
                  }}
                  className="text-sky-400 hover:text-sky-300 font-semibold transition-colors"
                >
                  MySQL Database Setup
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('contact')} className="hover:text-white transition-colors">
                  Contact & Hub Location
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500 text-[11px]">
          <p>© 2026 GOR FACTORY S.A. All rights reserved. ROLY is a registered trademark.</p>
          <div className="flex space-x-4">
            <span className="hover:text-gray-300 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-gray-300 cursor-pointer">Cookie Settings</span>
            <span>•</span>
            <span className="hover:text-gray-300 cursor-pointer">Wholesale Legal Notice</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
