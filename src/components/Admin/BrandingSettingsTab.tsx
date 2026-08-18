import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Sliders, Save, RotateCcw, Check, Sparkles, Building, Phone, Mail, DollarSign, Type, Globe } from 'lucide-react';

export const BrandingSettingsTab: React.FC = () => {
  const { siteSettings, updateSiteSettings, resetSiteSettings, showToast } = useStore();

  const [brandName, setBrandName] = useState(siteSettings.brandName);
  const [brandTagline, setBrandTagline] = useState(siteSettings.brandTagline);
  const [siteTitle, setSiteTitle] = useState(siteSettings.siteTitle);
  const [companyName, setCompanyName] = useState(siteSettings.companyName);
  const [taxId, setTaxId] = useState(siteSettings.taxId);
  const [address, setAddress] = useState(siteSettings.address);
  const [supportPhone, setSupportPhone] = useState(siteSettings.supportPhone);
  const [supportEmail, setSupportEmail] = useState(siteSettings.supportEmail);
  const [currency, setCurrency] = useState(siteSettings.currency);
  const [vatRate, setVatRate] = useState(siteSettings.vatRate);
  const [headerNotice, setHeaderNotice] = useState(siteSettings.headerNotice);
  const [heroHeadline, setHeroHeadline] = useState(siteSettings.heroHeadline);
  const [heroSubhead, setHeroSubhead] = useState(siteSettings.heroSubhead);
  const [heroDescription, setHeroDescription] = useState(siteSettings.heroDescription);
  const [footerDescription, setFooterDescription] = useState(siteSettings.footerDescription);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings({
      brandName,
      brandTagline,
      siteTitle,
      companyName,
      taxId,
      address,
      supportPhone,
      supportEmail,
      currency,
      vatRate: Number(vatRate),
      headerNotice,
      heroHeadline,
      heroSubhead,
      heroDescription,
      footerDescription,
    });
  };

  const handleReset = () => {
    if (window.confirm('Reset all branding texts to original default ROLY European wholesale standard?')) {
      resetSiteSettings();
      setBrandName('ROLY');
      setBrandTagline('European Standard in Promotional & Workwear Textiles');
      setSiteTitle('ROLY - B2B & B2C Textile Commerce Platform');
      setCompanyName('GOR FACTORY S.A.');
      setTaxId('ES-A78901234');
      setAddress('Ctra. Santomera - Abanilla km 8.8, 30620 Fortuna, Murcia (Spain)');
      setSupportPhone('+34 968 68 70 00');
      setSupportEmail('info@gorfactory.com');
      setCurrency('€');
      setVatRate(21);
      setHeaderNotice('Official Wholesale Distribution Hub • 24/48h European Logistics Dispatch');
      setHeroHeadline('The European Standard in Promotional & Workwear Textiles');
      setHeroSubhead('Official 2026 Wholesale & Multi-Vendor Collection');
      setHeroDescription('Discover over 200 high-performance apparel models with permanent 35M+ unit inventory at our central logistics hub.');
      setFooterDescription('ROLY is the registered brand of Gor Factory S.A., premier European manufacturer of promotional garments, sports apparel, corporate workwear, and high-visibility uniforms.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-950 rounded-xl p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-yellow-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sliders className="w-4 h-4" />
            <span>Super Admin Control Center</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">Site Branding & Description Customization</h2>
          <p className="text-xs text-neutral-300 mt-1 max-w-2xl">
            Customize the brand name, company credentials, hero descriptions, header announcements, tax rates, and footer text across the entire platform in real-time.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to ROLY Default</span>
          </button>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSave} className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
        
        {/* Section 1: Core Identity */}
        <div className="p-6 border-b border-neutral-200">
          <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900 flex items-center space-x-2 mb-4">
            <Type className="w-4 h-4 text-yellow-500" />
            <span>1. Brand Identity & Global Naming</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Main Brand Name:
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g. ROLY, TEXTILE PRO, MYBRAND"
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm font-bold text-neutral-900 outline-none focus:border-black"
                required
              />
              <p className="text-[10px] text-neutral-500 mt-1">Appears in header, logos, invoices, and titles.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Brand Tagline / Slogan:
              </label>
              <input
                type="text"
                value={brandTagline}
                onChange={(e) => setBrandTagline(e.target.value)}
                placeholder="e.g. European Standard in Promotional Textiles"
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-xs font-semibold text-neutral-900 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Site Browser Title:
              </label>
              <input
                type="text"
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 outline-none focus:border-black"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Hero & Homepage Copy */}
        <div className="p-6 border-b border-neutral-200 bg-neutral-50/50">
          <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900 flex items-center space-x-2 mb-4">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span>2. Homepage Hero & Headline Text</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Hero Main Headline:
              </label>
              <input
                type="text"
                value={heroHeadline}
                onChange={(e) => setHeroHeadline(e.target.value)}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-xs font-bold text-neutral-900 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Hero Sub-Headline:
              </label>
              <input
                type="text"
                value={heroSubhead}
                onChange={(e) => setHeroSubhead(e.target.value)}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 outline-none focus:border-black"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Hero Description Paragraph:
              </label>
              <textarea
                rows={2}
                value={heroDescription}
                onChange={(e) => setHeroDescription(e.target.value)}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 outline-none focus:border-black resize-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Header Top Announcement Notice:
              </label>
              <input
                type="text"
                value={headerNotice}
                onChange={(e) => setHeaderNotice(e.target.value)}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 outline-none focus:border-black"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Legal & Company Invoicing Details */}
        <div className="p-6 border-b border-neutral-200">
          <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900 flex items-center space-x-2 mb-4">
            <Building className="w-4 h-4 text-yellow-500" />
            <span>3. Legal Corporate & Invoicing Credentials</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Legal Company Name:
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="GOR FACTORY S.A."
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-xs font-bold text-neutral-900 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Tax CIF / VAT Number:
              </label>
              <input
                type="text"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                placeholder="ES-A78901234"
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-xs font-mono text-neutral-900 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Default VAT / Tax Rate (%):
              </label>
              <input
                type="number"
                value={vatRate}
                onChange={(e) => setVatRate(Number(e.target.value))}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-xs font-bold text-neutral-900 outline-none focus:border-black"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Headquarters Address:
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Support Phone:
              </label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Support Email:
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Currency Symbol:
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-xs font-bold text-neutral-900 outline-none focus:border-black bg-white"
              >
                <option value="€">€ (EUR)</option>
                <option value="$">$ (USD)</option>
                <option value="£">£ (GBP)</option>
                <option value="CHF">CHF (Swiss Franc)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Footer Description */}
        <div className="p-6 border-b border-neutral-200 bg-neutral-50/50">
          <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900 flex items-center space-x-2 mb-4">
            <Globe className="w-4 h-4 text-yellow-500" />
            <span>4. Footer Text & Brand Overview</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Footer Description Paragraph:
            </label>
            <textarea
              rows={3}
              value={footerDescription}
              onChange={(e) => setFooterDescription(e.target.value)}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 outline-none focus:border-black resize-none"
            />
          </div>
        </div>

        {/* Submit Bar */}
        <div className="p-6 bg-white flex items-center justify-end space-x-3">
          <button
            type="submit"
            className="px-6 py-3 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md flex items-center space-x-2 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4 text-yellow-400" />
            <span>Save All Site Settings</span>
          </button>
        </div>

      </form>

    </div>
  );
};
