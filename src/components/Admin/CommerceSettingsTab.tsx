import React, { useState } from 'react';
import { CreditCard, KeyRound, Plus, Save, Settings2, ShieldCheck, Trash2, Truck } from 'lucide-react';
import { DEFAULT_COMMERCE_SETTINGS, useStore } from '../../context/StoreContext';
import { CommerceSettings, PaymentMethodSetting, ShippingMethodSetting } from '../../types';

const cloneSettings = (settings: CommerceSettings): CommerceSettings => JSON.parse(JSON.stringify(settings));

export const CommerceSettingsTab: React.FC = () => {
  const { commerceSettings, updateCommerceSettings, siteSettings } = useStore();
  const [draft, setDraft] = useState<CommerceSettings>(() => cloneSettings(commerceSettings));

  const patchPayment = (index: number, patch: Partial<PaymentMethodSetting>) => {
    setDraft((current) => ({
      ...current,
      paymentMethods: current.paymentMethods.map((method, methodIndex) => methodIndex === index ? { ...method, ...patch } : method),
    }));
  };

  const patchShipping = (index: number, patch: Partial<ShippingMethodSetting>) => {
    setDraft((current) => ({
      ...current,
      shippingMethods: current.shippingMethods.map((method, methodIndex) => methodIndex === index ? { ...method, ...patch } : method),
    }));
  };

  const addPayment = () => setDraft((current) => ({
    ...current,
    paymentMethods: [...current.paymentMethods, {
      id: `payment_${Date.now()}`,
      name: 'New payment method',
      description: 'Describe when customers should use this method.',
      enabled: false,
      type: 'gateway',
      provider: 'Provider name',
      publicKey: '',
      webhookUrl: '/api/payments/webhook',
      feePercent: 0,
      credentialsConfigured: false,
    }],
  }));

  const addShipping = () => setDraft((current) => ({
    ...current,
    shippingMethods: [...current.shippingMethods, {
      id: `shipping_${Date.now()}`,
      name: 'New delivery method',
      description: 'Describe the delivery service.',
      enabled: false,
      carrier: 'Carrier name',
      price: 0,
      freeAbove: 0,
      estimatedDays: '2–4 business days',
    }],
  }));

  const inputClass = 'w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs outline-none focus:border-black';

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        updateCommerceSettings(draft);
      }}
    >
      <div className="rounded-xl bg-neutral-950 p-6 text-white">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
          <Settings2 className="h-4 w-4" /> Commerce operations
        </div>
        <h2 className="mt-1 text-2xl font-black">Payments, delivery and stock rules</h2>
        <p className="mt-2 max-w-3xl text-xs leading-5 text-neutral-300">Methods enabled here appear in checkout immediately. Secret gateway credentials must stay in server environment variables; this panel records only safe public configuration and whether the server credential has been installed.</p>
      </div>

      <section className="rounded-xl border border-neutral-200 p-5">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide"><Settings2 className="h-4 w-4" /> General order rules</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-xs font-bold">Order prefix
            <input value={draft.orderPrefix} onChange={(event) => setDraft({ ...draft, orderPrefix: event.target.value.toUpperCase() })} className={`${inputClass} mt-1 font-mono`} />
          </label>
          <label className="text-xs font-bold">Low-stock alert at
            <input type="number" min="0" value={draft.lowStockThreshold} onChange={(event) => setDraft({ ...draft, lowStockThreshold: Number(event.target.value) })} className={`${inputClass} mt-1`} />
          </label>
          <label className="text-xs font-bold">Cart stock hold (minutes)
            <input type="number" min="0" value={draft.stockHoldMinutes} onChange={(event) => setDraft({ ...draft, stockHoldMinutes: Number(event.target.value) })} className={`${inputClass} mt-1`} />
          </label>
          <label className="text-xs font-bold">Order notification email
            <input type="email" value={draft.operationsEmail} onChange={(event) => setDraft({ ...draft, operationsEmail: event.target.value })} className={`${inputClass} mt-1`} />
          </label>
        </div>
        <div className="mt-4 flex flex-wrap gap-5 text-xs font-semibold">
          <Toggle label="Allow backorders" checked={draft.allowBackorders} onChange={(checked) => setDraft({ ...draft, allowBackorders: checked })} />
          <Toggle label="Prices include tax" checked={draft.taxInclusivePricing} onChange={(checked) => setDraft({ ...draft, taxInclusivePricing: checked })} />
          <Toggle label="Require terms at checkout" checked={draft.requireTermsAcceptance} onChange={(checked) => setDraft({ ...draft, requireTermsAcceptance: checked })} />
        </div>
      </section>

      <section className="rounded-xl border border-neutral-200 p-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide"><CreditCard className="h-4 w-4" /> Payment methods</h3>
            <p className="mt-1 text-[11px] text-neutral-500">Configure invoice terms, transfers, cash methods, or an online gateway.</p>
          </div>
          <button type="button" onClick={addPayment} className="flex items-center gap-1 rounded-md bg-black px-3 py-2 text-xs font-bold text-white"><Plus className="h-3.5 w-3.5" /> Add method</button>
        </div>

        <div className="space-y-4">
          {draft.paymentMethods.map((method, index) => (
            <div key={method.id} className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <Toggle label="Available at checkout" checked={method.enabled} onChange={(enabled) => patchPayment(index, { enabled })} />
                <button type="button" onClick={() => setDraft({ ...draft, paymentMethods: draft.paymentMethods.filter((_, itemIndex) => itemIndex !== index) })} className="text-red-600" aria-label="Remove payment method"><Trash2 className="h-4 w-4" /></button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <label className="text-[11px] font-bold">Checkout name<input value={method.name} onChange={(event) => patchPayment(index, { name: event.target.value })} className={`${inputClass} mt-1`} /></label>
                <label className="text-[11px] font-bold">Stable ID<input value={method.id} onChange={(event) => patchPayment(index, { id: event.target.value.replace(/\s+/g, '_').toLowerCase() })} className={`${inputClass} mt-1 font-mono`} /></label>
                <label className="text-[11px] font-bold">Type<select value={method.type} onChange={(event) => patchPayment(index, { type: event.target.value as PaymentMethodSetting['type'] })} className={`${inputClass} mt-1`}><option value="gateway">Online gateway</option><option value="invoice">Invoice / credit terms</option><option value="bank_transfer">Bank transfer</option><option value="cash">Cash / collection</option></select></label>
                <label className="text-[11px] font-bold">Provider<input value={method.provider} onChange={(event) => patchPayment(index, { provider: event.target.value })} className={`${inputClass} mt-1`} /></label>
                <label className="text-[11px] font-bold sm:col-span-2">Customer description<input value={method.description} onChange={(event) => patchPayment(index, { description: event.target.value })} className={`${inputClass} mt-1`} /></label>
                <label className="text-[11px] font-bold">Fee (%)<input type="number" min="0" step="0.01" value={method.feePercent} onChange={(event) => patchPayment(index, { feePercent: Number(event.target.value) })} className={`${inputClass} mt-1`} /></label>
                <label className="text-[11px] font-bold">Public/client key<input value={method.publicKey || ''} onChange={(event) => patchPayment(index, { publicKey: event.target.value })} className={`${inputClass} mt-1 font-mono`} /></label>
                {method.type === 'gateway' && <>
                  <label className="text-[11px] font-bold sm:col-span-2">Webhook path<input value={method.webhookUrl || ''} onChange={(event) => patchPayment(index, { webhookUrl: event.target.value })} className={`${inputClass} mt-1 font-mono`} /></label>
                  <label className="flex items-end"><span className="flex w-full items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-[11px] font-bold"><KeyRound className="h-4 w-4 text-amber-500" /><input type="checkbox" checked={method.credentialsConfigured} onChange={(event) => patchPayment(index, { credentialsConfigured: event.target.checked })} className="accent-black" /> Server secret configured</span></label>
                </>}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-neutral-200 p-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div><h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide"><Truck className="h-4 w-4" /> Shipping methods</h3><p className="mt-1 text-[11px] text-neutral-500">Rates use {siteSettings.currency} and are recalculated in checkout.</p></div>
          <button type="button" onClick={addShipping} className="flex items-center gap-1 rounded-md bg-black px-3 py-2 text-xs font-bold text-white"><Plus className="h-3.5 w-3.5" /> Add delivery</button>
        </div>
        <div className="space-y-3">
          {draft.shippingMethods.map((method, index) => (
            <div key={method.id} className="grid gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center justify-between sm:col-span-2 lg:col-span-4"><Toggle label="Available at checkout" checked={method.enabled} onChange={(enabled) => patchShipping(index, { enabled })} /><button type="button" onClick={() => setDraft({ ...draft, shippingMethods: draft.shippingMethods.filter((_, itemIndex) => itemIndex !== index) })} className="text-red-600"><Trash2 className="h-4 w-4" /></button></div>
              <label className="text-[11px] font-bold">Method name<input value={method.name} onChange={(event) => patchShipping(index, { name: event.target.value })} className={`${inputClass} mt-1`} /></label>
              <label className="text-[11px] font-bold">Carrier<input value={method.carrier} onChange={(event) => patchShipping(index, { carrier: event.target.value })} className={`${inputClass} mt-1`} /></label>
              <label className="text-[11px] font-bold">Price<input type="number" min="0" step="0.01" value={method.price} onChange={(event) => patchShipping(index, { price: Number(event.target.value) })} className={`${inputClass} mt-1`} /></label>
              <label className="text-[11px] font-bold">Free above<input type="number" min="0" step="0.01" value={method.freeAbove} onChange={(event) => patchShipping(index, { freeAbove: Number(event.target.value) })} className={`${inputClass} mt-1`} /></label>
              <label className="text-[11px] font-bold sm:col-span-2 lg:col-span-3">Description<input value={method.description} onChange={(event) => patchShipping(index, { description: event.target.value })} className={`${inputClass} mt-1`} /></label>
              <label className="text-[11px] font-bold">Delivery estimate<input value={method.estimatedDays} onChange={(event) => patchShipping(index, { estimatedDays: event.target.value })} className={`${inputClass} mt-1`} /></label>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white p-4">
        <button type="button" onClick={() => setDraft(cloneSettings(DEFAULT_COMMERCE_SETTINGS))} className="text-xs font-bold text-neutral-500 hover:text-black">Restore commerce defaults</button>
        <button type="submit" className="flex items-center gap-2 rounded-md bg-black px-6 py-3 text-xs font-bold uppercase tracking-wide text-white"><Save className="h-4 w-4 text-emerald-400" /> Save commerce settings</button>
      </div>
    </form>
  );
};

const Toggle: React.FC<{ label: string; checked: boolean; onChange: (checked: boolean) => void }> = ({ label, checked, onChange }) => (
  <label className="flex cursor-pointer items-center gap-2">
    <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="accent-black" />
    <span>{label}</span>
    {checked && <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />}
  </label>
);
