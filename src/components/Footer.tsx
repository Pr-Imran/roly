import React from 'react';
import { ArrowUp, Mail, Phone } from 'lucide-react';
import { ActivePage, useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { siteSettings, navigateToCategory, navigateToProduct, setActivePage, currentUser } = useStore();

  const navigate = (target: string) => {
    const [kind, value] = target.split(':');
    if (kind === 'category' && value) navigateToCategory(value);
    if (kind === 'product' && value) navigateToProduct(value);
    if (kind === 'page' && value) setActivePage(value as ActivePage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-auto bg-[#111] text-white">
      <div className="mx-auto grid max-w-[1500px] gap-10 px-6 py-14 sm:px-10 lg:grid-cols-[1.3fr_2.7fr] lg:py-20">
        <div>
          {siteSettings.logoUrl ? (
            <img src={siteSettings.logoUrl} alt={siteSettings.brandName} className="h-8 max-w-40 object-contain brightness-0 invert" />
          ) : (
            <div className="text-3xl font-black tracking-[-0.08em]">{siteSettings.brandName}</div>
          )}
          <p className="mt-5 max-w-sm text-xs leading-6 text-neutral-400">{siteSettings.footerDescription}</p>
          <div className="mt-6 space-y-2 text-xs text-neutral-300">
            <a href={`tel:${siteSettings.supportPhone}`} className="flex items-center gap-2 hover:text-white"><Phone className="h-3.5 w-3.5" />{siteSettings.supportPhone}</a>
            <a href={`mailto:${siteSettings.supportEmail}`} className="flex items-center gap-2 hover:text-white"><Mail className="h-3.5 w-3.5" />{siteSettings.supportEmail}</a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {siteSettings.footerColumns.map((column) => (
            <div key={column.id}>
              <h3 className="border-b border-neutral-700 pb-3 text-xs font-semibold tracking-wide">{column.title}</h3>
              <div className="mt-4 grid gap-2.5">
                {column.links.filter((link) => link.visible && (link.target !== 'page:admin' || currentUser.role === 'super_admin')).map((link) => (
                  <button key={link.id} type="button" onClick={() => navigate(link.target)} className="text-left text-xs text-neutral-400 transition hover:text-white">
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-neutral-800">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-3 px-6 py-5 text-[10px] text-neutral-500 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <span>© {new Date().getFullYear()} {siteSettings.companyName}. {siteSettings.footerCopyrightText}</span>
          <span>{siteSettings.address}</span>
        </div>
      </div>

      <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-5 right-5 z-30 rounded-sm border border-neutral-300 bg-white p-3 text-black shadow-lg" aria-label="Back to top">
        <ArrowUp className="h-4 w-4" />
      </button>
    </footer>
  );
};
