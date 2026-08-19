import React, { useState } from 'react';
import { Eye, EyeOff, FolderTree, Image, LayoutTemplate, Plus, Save, Trash2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CatalogCategory, HomeContentCard, HomeHeroSlide, HomeVideoSlide, SiteLinkItem, SiteSettings } from '../../types';
import { buildCategoryNavigation } from '../../data/mockProducts';

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));
const fieldClass = 'w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs outline-none focus:border-black';

export const SiteContentTab: React.FC = () => {
  const { siteSettings, updateSiteSettings, catalogCategories, setCatalogCategories } = useStore();
  const [draft, setDraft] = useState<SiteSettings>(() => clone(siteSettings));
  const [categoryDraft, setCategoryDraft] = useState<CatalogCategory[]>(() => clone(catalogCategories));

  const patchNav = (index: number, patch: Partial<SiteLinkItem>) => setDraft((current) => ({ ...current, headerNavigation: current.headerNavigation.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item) }));
  const patchHero = (index: number, patch: Partial<HomeHeroSlide>) => setDraft((current) => ({ ...current, heroSlides: current.heroSlides.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item) }));
  const patchVideo = (index: number, patch: Partial<HomeVideoSlide>) => setDraft((current) => ({ ...current, brandVideoSlides: current.brandVideoSlides.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item) }));
  const patchCards = (key: 'audienceCards' | 'latestBanners' | 'storyCards', index: number, patch: Partial<HomeContentCard>) => setDraft((current) => ({ ...current, [key]: current[key].map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item) }));

  const addCard = (key: 'audienceCards' | 'latestBanners' | 'storyCards') => setDraft((current) => ({
    ...current,
    [key]: [...current[key], { id: `${key}-${Date.now()}`, title: 'New content card', description: 'Add a useful description.', imageUrl: '', target: 'category:all', ctaLabel: 'DISCOVER' }],
  }));

  return (
    <form className="space-y-6" onSubmit={(event) => {
      event.preventDefault();
      const customLinks = draft.headerNavigation.filter((item) => item.source !== 'category' && !item.categoryId);
      setCatalogCategories(categoryDraft);
      updateSiteSettings({ ...draft, headerNavigation: [...buildCategoryNavigation(categoryDraft), ...customLinks] });
    }}>
      <div className="rounded-xl bg-gradient-to-r from-[#310d66] to-[#3d107f] p-6 text-white">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-purple-200"><LayoutTemplate className="h-4 w-4" /> Complete page control</div>
        <h2 className="mt-1 text-2xl font-black">Navigation, homepage media and footer</h2>
        <p className="mt-2 max-w-3xl text-xs leading-5 text-purple-100">Every repeating storefront element is editable here. Targets use <code>category:slug</code>, <code>product:CODE</code>, or <code>page:name</code>.</p>
      </div>

      <Section title="Categories and synchronized submenus" onAdd={() => setCategoryDraft((current) => [...current, { id: `category-${Date.now()}`, name: 'New category', slug: `new-category-${Date.now()}`, visible: true, subcategories: [] }])}>
        <div className="mb-4 flex items-start gap-3 rounded-lg border border-purple-200 bg-purple-50 p-4 text-xs text-purple-900">
          <FolderTree className="mt-0.5 h-4 w-4 shrink-0" />
          <p>Each category becomes a main menu. Its visible subcategories become the dropdown. Saving this page synchronizes both automatically.</p>
        </div>
        <div className="space-y-4">
          {categoryDraft.map((category, categoryIndex) => (
            <div key={category.id} className="rounded-lg border border-neutral-200 p-4">
              <div className="grid gap-2 sm:grid-cols-[1.2fr_1fr_42px_32px] sm:items-center">
                <input value={category.name} onChange={(event) => setCategoryDraft((current) => current.map((item, index) => index === categoryIndex ? { ...item, name: event.target.value } : item))} className={`${fieldClass} font-bold`} aria-label="Category name" />
                <input value={category.slug} onChange={(event) => setCategoryDraft((current) => current.map((item, index) => index === categoryIndex ? { ...item, slug: event.target.value.toLowerCase().replace(/[^a-z0-9_-]+/g, '-') } : item))} className={`${fieldClass} font-mono`} aria-label="Category slug" />
                <button type="button" onClick={() => setCategoryDraft((current) => current.map((item, index) => index === categoryIndex ? { ...item, visible: !item.visible } : item))} className={`flex h-9 items-center justify-center rounded border ${category.visible ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-neutral-300 text-neutral-400'}`} aria-label="Toggle category visibility">{category.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}</button>
                <button type="button" onClick={() => setCategoryDraft((current) => current.filter((_, index) => index !== categoryIndex))} className="text-red-600" aria-label="Delete category"><Trash2 className="h-4 w-4" /></button>
              </div>
              <div className="ml-0 mt-3 space-y-2 border-l-2 border-purple-100 pl-3 sm:ml-5">
                {category.subcategories.map((subcategory, subcategoryIndex) => (
                  <div key={subcategory.id} className="grid gap-2 sm:grid-cols-[1.2fr_1fr_42px_32px] sm:items-center">
                    <input value={subcategory.label} onChange={(event) => setCategoryDraft((current) => current.map((item, index) => index === categoryIndex ? { ...item, subcategories: item.subcategories.map((subitem, subindex) => subindex === subcategoryIndex ? { ...subitem, label: event.target.value } : subitem) } : item))} className={fieldClass} aria-label="Subcategory name" />
                    <input value={subcategory.slug} onChange={(event) => setCategoryDraft((current) => current.map((item, index) => index === categoryIndex ? { ...item, subcategories: item.subcategories.map((subitem, subindex) => subindex === subcategoryIndex ? { ...subitem, slug: event.target.value.toLowerCase().replace(/[^a-z0-9_-]+/g, '-') } : subitem) } : item))} className={`${fieldClass} font-mono`} aria-label="Subcategory slug" />
                    <button type="button" onClick={() => setCategoryDraft((current) => current.map((item, index) => index === categoryIndex ? { ...item, subcategories: item.subcategories.map((subitem, subindex) => subindex === subcategoryIndex ? { ...subitem, visible: !subitem.visible } : subitem) } : item))} className={`flex h-9 items-center justify-center rounded border ${subcategory.visible ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-neutral-300 text-neutral-400'}`} aria-label="Toggle subcategory visibility">{subcategory.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}</button>
                    <button type="button" onClick={() => setCategoryDraft((current) => current.map((item, index) => index === categoryIndex ? { ...item, subcategories: item.subcategories.filter((_, subindex) => subindex !== subcategoryIndex) } : item))} className="text-red-600" aria-label="Delete subcategory"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))}
                <button type="button" onClick={() => setCategoryDraft((current) => current.map((item, index) => index === categoryIndex ? { ...item, subcategories: [...item.subcategories, { id: `subcategory-${Date.now()}`, label: 'New submenu', slug: `new-submenu-${Date.now()}`, visible: true }] } : item))} className="mt-2 text-[11px] font-bold text-purple-700">+ Add submenu</button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Header navigation" onAdd={() => setDraft((current) => ({ ...current, headerNavigation: [...current.headerNavigation, { id: `nav-${Date.now()}`, label: 'New link', target: 'category:all', visible: true, source: 'custom' }] }))}>
        <div className="space-y-2">
          {draft.headerNavigation.map((item, index) => (
            <div key={item.id} className="grid gap-2 rounded-md bg-neutral-50 p-3 sm:grid-cols-[1fr_1.3fr_42px_32px] sm:items-center">
              <input value={item.label} onChange={(event) => patchNav(index, { label: event.target.value })} className={fieldClass} aria-label="Navigation label" />
              <input value={item.target} onChange={(event) => patchNav(index, { target: event.target.value })} className={`${fieldClass} font-mono`} aria-label="Navigation target" />
              <button type="button" onClick={() => patchNav(index, { visible: !item.visible })} className={`flex h-9 items-center justify-center rounded border ${item.visible ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-neutral-300 text-neutral-400'}`} aria-label="Toggle visibility">{item.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}</button>
              <button type="button" onClick={() => setDraft({ ...draft, headerNavigation: draft.headerNavigation.filter((_, itemIndex) => itemIndex !== index) })} className="text-red-600"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Homepage hero slides" onAdd={() => setDraft((current) => ({ ...current, heroSlides: [...current.heroSlides, { id: `hero-${Date.now()}`, eyebrow: 'NEW', title: 'New campaign', description: 'Campaign description', imageUrl: '', target: 'category:all', ctaLabel: 'DISCOVER', textColor: 'light', showContent: true }] }))}>
        <div className="grid gap-4 lg:grid-cols-2">
          {draft.heroSlides.map((slide, index) => <HeroEditor key={slide.id} slide={slide} onChange={(patch) => patchHero(index, patch)} onDelete={() => setDraft({ ...draft, heroSlides: draft.heroSlides.filter((_, itemIndex) => itemIndex !== index) })} />)}
        </div>
      </Section>

      <Section title="Homepage video carousel" onAdd={() => setDraft((current) => ({ ...current, brandVideoSlides: [...current.brandVideoSlides, { id: `video-${Date.now()}`, title: 'New video story', description: '', videoUrl: '', posterUrl: '', target: 'category:all', ctaLabel: 'DISCOVER', textColor: 'light' }] }))}>
        <p className="mb-4 text-xs text-neutral-500">Use an MP4 URL hosted on your own domain/CDN. Videos autoplay muted, loop, and can be changed with the left/right arrows.</p>
        <div className="grid gap-4 lg:grid-cols-2">
          {draft.brandVideoSlides.map((slide, index) => <VideoEditor key={slide.id} slide={slide} onChange={(patch) => patchVideo(index, patch)} onDelete={() => setDraft({ ...draft, brandVideoSlides: draft.brandVideoSlides.filter((_, itemIndex) => itemIndex !== index) })} />)}
        </div>
      </Section>

      <CardSection title="Audience cards" cards={draft.audienceCards} onAdd={() => addCard('audienceCards')} onChange={(index, patch) => patchCards('audienceCards', index, patch)} onDelete={(index) => setDraft({ ...draft, audienceCards: draft.audienceCards.filter((_, itemIndex) => itemIndex !== index) })} />
      <CardSection title="Latest banners" cards={draft.latestBanners} onAdd={() => addCard('latestBanners')} onChange={(index, patch) => patchCards('latestBanners', index, patch)} onDelete={(index) => setDraft({ ...draft, latestBanners: draft.latestBanners.filter((_, itemIndex) => itemIndex !== index) })} />
      <CardSection title="Editorial story cards" cards={draft.storyCards} onAdd={() => addCard('storyCards')} onChange={(index, patch) => patchCards('storyCards', index, patch)} onDelete={(index) => setDraft({ ...draft, storyCards: draft.storyCards.filter((_, itemIndex) => itemIndex !== index) })} />

      <Section title="Campaign banners">
        <div className="grid gap-4 lg:grid-cols-2">
          <div><div className="mb-2 flex items-center justify-between"><strong className="text-xs uppercase">Customizer banner</strong><label className="flex items-center gap-2 text-[11px]"><input type="checkbox" checked={draft.showCustomizerBanner} onChange={(event) => setDraft({ ...draft, showCustomizerBanner: event.target.checked })} className="accent-black" /> Show on homepage</label></div><CardEditor card={draft.customizerBanner} onChange={(patch) => setDraft({ ...draft, customizerBanner: { ...draft.customizerBanner, ...patch } })} /></div>
          <div><strong className="mb-2 block text-xs uppercase">Workwear banner</strong><CardEditor card={draft.workwearBanner} onChange={(patch) => setDraft({ ...draft, workwearBanner: { ...draft.workwearBanner, ...patch } })} /></div>
        </div>
      </Section>

      <Section title="Workwear video and featured product rails">
        <div className="grid gap-4 lg:grid-cols-2">
          <label className="text-xs font-bold">Workwear background MP4 URL<input value={draft.workwearVideoUrl} onChange={(event) => setDraft({ ...draft, workwearVideoUrl: event.target.value })} className={`${fieldClass} mt-1 font-mono`} /></label>
          <label className="text-xs font-bold">Workwear video poster image<input value={draft.workwearVideoPosterUrl} onChange={(event) => setDraft({ ...draft, workwearVideoPosterUrl: event.target.value })} className={`${fieldClass} mt-1 font-mono`} /></label>
          <label className="text-xs font-bold">Featured in Roly model codes<textarea rows={4} value={draft.featuredRolyProductCodes.join('\n')} onChange={(event) => setDraft({ ...draft, featuredRolyProductCodes: event.target.value.split(/[,\n]/).map((value) => value.trim().toUpperCase()).filter(Boolean) })} className={`${fieldClass} mt-1 font-mono`} /><span className="mt-1 block font-normal text-neutral-500">One product model code per line.</span></label>
          <label className="text-xs font-bold">Featured in Workwear model codes<textarea rows={4} value={draft.featuredWorkwearProductCodes.join('\n')} onChange={(event) => setDraft({ ...draft, featuredWorkwearProductCodes: event.target.value.split(/[,\n]/).map((value) => value.trim().toUpperCase()).filter(Boolean) })} className={`${fieldClass} mt-1 font-mono`} /><span className="mt-1 block font-normal text-neutral-500">Images come from Product Variations.</span></label>
          <label className="text-xs font-bold">Auto-scroll interval (milliseconds)<input type="number" min={1500} step={100} value={draft.productCarouselIntervalMs} onChange={(event) => setDraft({ ...draft, productCarouselIntervalMs: Math.max(1500, Number(event.target.value) || 4200) })} className={`${fieldClass} mt-1`} /></label>
        </div>
      </Section>

      <Section title="Certification and partner logos">
        <label className="text-xs font-bold">One image URL per line<textarea rows={6} value={draft.certificationLogos.join('\n')} onChange={(event) => setDraft({ ...draft, certificationLogos: event.target.value.split('\n').map((line) => line.trim()).filter(Boolean) })} className={`${fieldClass} mt-1 resize-y font-mono`} /></label>
      </Section>

      <Section title="Footer columns" onAdd={() => setDraft((current) => ({ ...current, footerColumns: [...current.footerColumns, { id: `footer-${Date.now()}`, title: 'NEW COLUMN', links: [] }] }))}>
        <div className="grid gap-4 lg:grid-cols-3">
          {draft.footerColumns.map((column, columnIndex) => (
            <div key={column.id} className="rounded-lg border border-neutral-200 p-4">
              <div className="flex gap-2"><input value={column.title} onChange={(event) => setDraft({ ...draft, footerColumns: draft.footerColumns.map((item, itemIndex) => itemIndex === columnIndex ? { ...item, title: event.target.value } : item) })} className={`${fieldClass} font-bold`} /><button type="button" onClick={() => setDraft({ ...draft, footerColumns: draft.footerColumns.filter((_, itemIndex) => itemIndex !== columnIndex) })} className="text-red-600"><Trash2 className="h-4 w-4" /></button></div>
              <div className="mt-3 space-y-2">
                {column.links.map((link, linkIndex) => <div key={link.id} className="grid grid-cols-[1fr_1fr_24px] gap-1"><input value={link.label} onChange={(event) => setDraft({ ...draft, footerColumns: draft.footerColumns.map((item, itemIndex) => itemIndex === columnIndex ? { ...item, links: item.links.map((linkItem, index) => index === linkIndex ? { ...linkItem, label: event.target.value } : linkItem) } : item) })} className={fieldClass} /><input value={link.target} onChange={(event) => setDraft({ ...draft, footerColumns: draft.footerColumns.map((item, itemIndex) => itemIndex === columnIndex ? { ...item, links: item.links.map((linkItem, index) => index === linkIndex ? { ...linkItem, target: event.target.value } : linkItem) } : item) })} className={`${fieldClass} font-mono`} /><button type="button" onClick={() => setDraft({ ...draft, footerColumns: draft.footerColumns.map((item, itemIndex) => itemIndex === columnIndex ? { ...item, links: item.links.filter((_, index) => index !== linkIndex) } : item) })} className="text-red-600">×</button></div>)}
              </div>
              <button type="button" onClick={() => setDraft({ ...draft, footerColumns: draft.footerColumns.map((item, itemIndex) => itemIndex === columnIndex ? { ...item, links: [...item.links, { id: `link-${Date.now()}`, label: 'New link', target: 'page:home', visible: true }] } : item) })} className="mt-3 text-[11px] font-bold">+ Add footer link</button>
            </div>
          ))}
        </div>
      </Section>

      <div className="sticky bottom-3 flex justify-end rounded-xl border border-neutral-200 bg-white/95 p-4 shadow-lg backdrop-blur"><button type="submit" className="flex items-center gap-2 rounded-md bg-black px-6 py-3 text-xs font-bold uppercase tracking-wide text-white"><Save className="h-4 w-4 text-purple-300" /> Save all page content</button></div>
    </form>
  );
};

const Section: React.FC<{ title: string; onAdd?: () => void; children: React.ReactNode }> = ({ title, onAdd, children }) => <section className="rounded-xl border border-neutral-200 bg-white p-5"><div className="mb-4 flex items-center justify-between"><h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide"><Image className="h-4 w-4 text-purple-700" />{title}</h3>{onAdd && <button type="button" onClick={onAdd} className="flex items-center gap-1 rounded-md bg-black px-3 py-2 text-xs font-bold text-white"><Plus className="h-3.5 w-3.5" /> Add</button>}</div>{children}</section>;

const CardSection: React.FC<{ title: string; cards: HomeContentCard[]; onAdd: () => void; onChange: (index: number, patch: Partial<HomeContentCard>) => void; onDelete: (index: number) => void }> = ({ title, cards, onAdd, onChange, onDelete }) => <Section title={title} onAdd={onAdd}><div className="grid gap-4 lg:grid-cols-3">{cards.map((card, index) => <CardEditor key={card.id} card={card} onChange={(patch) => onChange(index, patch)} onDelete={() => onDelete(index)} />)}</div></Section>;

const CardEditor: React.FC<{ card: HomeContentCard; onChange: (patch: Partial<HomeContentCard>) => void; onDelete?: () => void }> = ({ card, onChange, onDelete }) => <div className="space-y-2 rounded-lg border border-neutral-200 bg-neutral-50 p-4"><div className="flex gap-2"><input value={card.title} onChange={(event) => onChange({ title: event.target.value })} className={`${fieldClass} font-bold`} />{onDelete && <button type="button" onClick={onDelete} className="text-red-600"><Trash2 className="h-4 w-4" /></button>}</div><textarea rows={2} value={card.description} onChange={(event) => onChange({ description: event.target.value })} className={`${fieldClass} resize-none`} placeholder="Description" /><input value={card.imageUrl} onChange={(event) => onChange({ imageUrl: event.target.value })} className={fieldClass} placeholder="Image URL" /><div className="grid grid-cols-2 gap-2"><input value={card.target} onChange={(event) => onChange({ target: event.target.value })} className={`${fieldClass} font-mono`} placeholder="Target" /><input value={card.ctaLabel || ''} onChange={(event) => onChange({ ctaLabel: event.target.value })} className={fieldClass} placeholder="Button label" /></div></div>;

const HeroEditor: React.FC<{ slide: HomeHeroSlide; onChange: (patch: Partial<HomeHeroSlide>) => void; onDelete: () => void }> = ({ slide, onChange, onDelete }) => <div className="space-y-2 rounded-lg border border-neutral-200 bg-neutral-50 p-4"><div className="flex gap-2"><input value={slide.title} onChange={(event) => onChange({ title: event.target.value })} className={`${fieldClass} font-bold`} /><button type="button" onClick={onDelete} className="text-red-600"><Trash2 className="h-4 w-4" /></button></div><div className="grid grid-cols-2 gap-2"><input value={slide.eyebrow} onChange={(event) => onChange({ eyebrow: event.target.value })} className={fieldClass} placeholder="Eyebrow" /><select value={slide.textColor} onChange={(event) => onChange({ textColor: event.target.value as 'light' | 'dark' })} className={fieldClass}><option value="light">Light text</option><option value="dark">Dark text</option></select></div><label className="flex items-center gap-2 text-[11px] font-bold"><input type="checkbox" checked={slide.showContent !== false} onChange={(event) => onChange({ showContent: event.target.checked })} className="accent-black" />Show text and button overlay</label><textarea rows={2} value={slide.description} onChange={(event) => onChange({ description: event.target.value })} className={`${fieldClass} resize-none`} /><input value={slide.imageUrl} onChange={(event) => onChange({ imageUrl: event.target.value })} className={fieldClass} placeholder="Hero image URL" /><div className="grid grid-cols-2 gap-2"><input value={slide.target} onChange={(event) => onChange({ target: event.target.value })} className={`${fieldClass} font-mono`} /><input value={slide.ctaLabel || ''} onChange={(event) => onChange({ ctaLabel: event.target.value })} className={fieldClass} /></div></div>;

const VideoEditor: React.FC<{ slide: HomeVideoSlide; onChange: (patch: Partial<HomeVideoSlide>) => void; onDelete: () => void }> = ({ slide, onChange, onDelete }) => <div className="space-y-2 rounded-lg border border-neutral-200 bg-neutral-50 p-4"><div className="flex gap-2"><input value={slide.title} onChange={(event) => onChange({ title: event.target.value })} className={`${fieldClass} font-bold`} /><button type="button" onClick={onDelete} className="text-red-600"><Trash2 className="h-4 w-4" /></button></div><textarea rows={2} value={slide.description} onChange={(event) => onChange({ description: event.target.value })} className={`${fieldClass} resize-none`} placeholder="Description" /><input value={slide.videoUrl} onChange={(event) => onChange({ videoUrl: event.target.value })} className={`${fieldClass} font-mono`} placeholder="MP4 video URL" /><input value={slide.posterUrl} onChange={(event) => onChange({ posterUrl: event.target.value })} className={`${fieldClass} font-mono`} placeholder="Poster image URL" /><div className="grid grid-cols-2 gap-2"><input value={slide.target} onChange={(event) => onChange({ target: event.target.value })} className={`${fieldClass} font-mono`} /><input value={slide.ctaLabel} onChange={(event) => onChange({ ctaLabel: event.target.value })} className={fieldClass} /></div></div>;
