import React, { useState } from 'react';
import { Crown, LockKeyhole, ShieldCheck, UserPlus } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { UserRole } from '../../types';

const roles: Array<{ value: UserRole; label: string }> = [
  { value: 'client', label: 'Client' },
  { value: 'vendor', label: 'Vendor / Factory' },
  { value: 'logistics_admin', label: 'Logistics Admin' },
  { value: 'super_admin', label: 'Super Admin' },
];

export const UserRolesTab: React.FC = () => {
  const { users, currentUser, registerClient, updateUserRole, updateUserStatus } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-r from-neutral-950 to-purple-950 p-6 text-white">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-purple-200"><ShieldCheck className="h-4 w-4" /> Access control</div>
        <h2 className="mt-1 text-2xl font-black">Users and roles</h2>
        <p className="mt-2 max-w-3xl text-xs leading-5 text-neutral-300">Public registration always creates a Client account. Privileged roles are assigned here after registration; only the protected bootstrap owner can grant Super Admin.</p>
      </div>

      <form className="rounded-xl border border-neutral-200 bg-neutral-50 p-5" onSubmit={(event) => {
        event.preventDefault();
        registerClient({ name: name.trim(), email: email.trim(), company: company.trim() });
        setName(''); setEmail(''); setCompany('');
      }}>
        <div className="mb-4 flex items-center gap-2"><UserPlus className="h-4 w-4" /><h3 className="text-sm font-black uppercase">Register a user</h3><span className="rounded-full bg-sky-100 px-2 py-1 text-[10px] font-bold text-sky-700">Role: Client</span></div>
        <div className="grid gap-3 md:grid-cols-[1fr_1.2fr_1fr_auto]">
          <input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Full name" className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs" />
          <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs" />
          <input required value={company} onChange={(event) => setCompany(event.target.value)} placeholder="Company" className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs" />
          <button type="submit" className="rounded-md bg-black px-5 py-2 text-xs font-bold text-white">Register client</button>
        </div>
      </form>

      <div className="overflow-x-auto rounded-xl border border-neutral-200">
        <table className="w-full min-w-[850px] text-left text-xs">
          <thead className="bg-neutral-100 text-[10px] uppercase tracking-wide text-neutral-500"><tr><th className="p-3">User</th><th className="p-3">Company</th><th className="p-3">Role</th><th className="p-3">Status</th><th className="p-3">Protection</th></tr></thead>
          <tbody className="divide-y divide-neutral-100">
            {users.map((user) => (
              <tr key={user.id} className="bg-white">
                <td className="p-3"><strong className="flex items-center gap-1.5 text-neutral-900">{user.isBootstrapOwner && <Crown className="h-3.5 w-3.5 text-amber-500" />}{user.name}</strong><span className="text-[10px] text-neutral-500">{user.email}</span></td>
                <td className="p-3 text-neutral-600">{user.company}</td>
                <td className="p-3">
                  <select value={user.role} disabled={user.isBootstrapOwner} onChange={(event) => updateUserRole(user.id, event.target.value as UserRole)} className="rounded border border-neutral-300 bg-white px-2 py-1.5 disabled:cursor-not-allowed disabled:bg-neutral-100">
                    {roles.map((role) => <option key={role.value} value={role.value} disabled={role.value === 'super_admin' && !currentUser.isBootstrapOwner}>{role.label}</option>)}
                  </select>
                </td>
                <td className="p-3"><select value={user.status} disabled={user.isBootstrapOwner} onChange={(event) => updateUserStatus(user.id, event.target.value as typeof user.status)} className="rounded border border-neutral-300 bg-white px-2 py-1.5 disabled:cursor-not-allowed disabled:bg-neutral-100"><option value="active">Active</option><option value="invited">Invited</option><option value="suspended">Suspended</option></select></td>
                <td className="p-3">{user.isBootstrapOwner ? <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-800"><LockKeyhole className="h-3 w-3" /> Bootstrap owner</span> : <span className="text-neutral-400">Managed account</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-900"><strong>Production security:</strong> create the owner during a server-side migration from deployment secrets, store only a password hash, require MFA, log role changes, and never ship owner credentials in this frontend bundle.</div>
    </div>
  );
};
