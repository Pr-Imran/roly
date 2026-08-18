import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Users, Plus, Star, ShieldCheck, CheckCircle2, XCircle, AlertCircle, DollarSign, Building, Mail, Phone, Globe, ExternalLink } from 'lucide-react';
import { Vendor } from '../../types';

export const VendorsTab: React.FC = () => {
  const { vendors, addVendor, updateVendorStatus, siteSettings, showToast } = useStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Spain');
  const [commissionRate, setCommissionRate] = useState(8.0);
  const [rating, setRating] = useState(4.8);

  const handleCreateVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      showToast('Vendor name and email are required', 'warning');
      return;
    }

    addVendor({
      name,
      code: code || `VEN-${Math.floor(10 + Math.random() * 90)}`,
      email,
      phone: phone || '+34 900 000 000',
      country,
      rating: Number(rating),
      commissionRate: Number(commissionRate),
      status: 'active',
    });

    setIsAddModalOpen(false);
    setName('');
    setCode('');
    setEmail('');
    setPhone('');
  };

  const totalMarketplaceSales = vendors.reduce((sum, v) => sum + v.totalSales, 0);
  const totalPlatformCommissions = vendors.reduce((sum, v) => sum + (v.totalSales * v.commissionRate / 100), 0);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-neutral-900 text-white rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-yellow-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Super Admin Multi-Vendor Ecosystem</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">Vendor & Supplier Network</h2>
          <p className="text-xs text-neutral-300 mt-1 max-w-xl">
            Oversee certified textile manufacturers, garment customizers, and distribution hubs across Europe with automated commission splits.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs uppercase tracking-wider rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Vendor</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs">
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Active Vendors</p>
          <p className="text-2xl font-black text-neutral-900 mt-1">{vendors.length} Partners</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">100% European OEKO-TEX Standard</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs">
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Total Vendor Volume</p>
          <p className="text-2xl font-black text-neutral-900 mt-1 font-mono">{totalMarketplaceSales.toLocaleString()} {siteSettings.currency}</p>
          <p className="text-[11px] text-neutral-500 mt-1">Across 4 Central Warehouses</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs">
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Platform Commissions</p>
          <p className="text-2xl font-black text-yellow-600 mt-1 font-mono">{totalPlatformCommissions.toLocaleString(undefined, { maximumFractionDigits: 2 })} {siteSettings.currency}</p>
          <p className="text-[11px] text-neutral-500 mt-1">Avg Commission: 7.4%</p>
        </div>
      </div>

      {/* Vendors Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between">
          <h3 className="font-black text-xs uppercase tracking-wider text-neutral-800">
            Registered Wholesale Vendors & Customizers
          </h3>
          <span className="text-xs text-neutral-500 font-semibold">{vendors.length} Vendors</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-100/70 text-neutral-700 font-bold uppercase text-[11px]">
                <th className="py-3 px-4">Vendor / Hub</th>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Country</th>
                <th className="py-3 px-4 text-center">Products</th>
                <th className="py-3 px-4 text-right">Total Sales</th>
                <th className="py-3 px-4 text-center">Commission</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {vendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-neutral-900">{vendor.name}</div>
                    <div className="text-[11px] text-neutral-500 flex items-center space-x-2 mt-0.5">
                      <span>{vendor.email}</span>
                      <span>•</span>
                      <span>{vendor.phone}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-neutral-700">
                    {vendor.code}
                  </td>
                  <td className="py-3.5 px-4 text-neutral-700">
                    {vendor.country}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-neutral-900">
                    {vendor.totalProducts}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-neutral-900">
                    {vendor.totalSales.toLocaleString()} {siteSettings.currency}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-block bg-yellow-100 text-yellow-900 font-bold px-2 py-0.5 rounded text-[11px]">
                      {vendor.commissionRate}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      vendor.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : vendor.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {vendor.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      {vendor.status !== 'active' && (
                        <button
                          onClick={() => updateVendorStatus(vendor.id, 'active')}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded cursor-pointer"
                          title="Activate Vendor"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                      {vendor.status === 'active' && (
                        <button
                          onClick={() => updateVendorStatus(vendor.id, 'suspended')}
                          className="p-1 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                          title="Suspend Vendor"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Vendor Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="font-black text-sm uppercase tracking-wider text-neutral-900">
                Register New Wholesale Vendor
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-neutral-400 hover:text-black p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateVendor} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Company / Hub Name:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Valencia Textile Works"
                  className="w-full border border-neutral-300 rounded px-3 py-2 text-neutral-900 font-semibold outline-none focus:border-black"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Vendor Code:</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. VTW-05"
                    className="w-full border border-neutral-300 rounded px-3 py-2 font-mono outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Country:</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Spain, Portugal, etc."
                    className="w-full border border-neutral-300 rounded px-3 py-2 outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Contact Email:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="b2b@vendor.com"
                    className="w-full border border-neutral-300 rounded px-3 py-2 outline-none focus:border-black"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Contact Phone:</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+34 960 000 000"
                    className="w-full border border-neutral-300 rounded px-3 py-2 outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Commission Rate (%):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                    className="w-full border border-neutral-300 rounded px-3 py-2 font-bold outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Quality Rating (1-5):</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full border border-neutral-300 rounded px-3 py-2 font-bold outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-200 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-neutral-600 hover:text-black font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-black hover:bg-neutral-800 text-white font-bold rounded cursor-pointer"
                >
                  Register Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
