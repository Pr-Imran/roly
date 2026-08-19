import React, { useState } from 'react';
import { Crown, Eye, EyeOff, KeyRound, LockKeyhole, ShieldCheck, UserPlus } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { UserRole } from '../../types';

const roles: Array<{ value: UserRole; label: string }> = [
  { value: 'client', label: 'Client' },
  { value: 'vendor', label: 'Vendor / Factory' },
  { value: 'logistics_admin', label: 'Logistics Admin' },
  { value: 'super_admin', label: 'Super Admin' },
];

export const UserRolesTab: React.FC = () => {
  const { users, currentUser, registerClient, resetUserPassword, updateUserRole, updateUserStatus } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [resetUserId, setResetUserId] = useState<string | null>(null);
  const [resetPassword, setResetPassword] = useState('');
  const [resetConfirmation, setResetConfirmation] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const [resetError, setResetError] = useState('');

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-r from-neutral-950 to-purple-950 p-6 text-white">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-purple-200"><ShieldCheck className="h-4 w-4" /> Access control</div>
        <h2 className="mt-1 text-2xl font-black">Users and roles</h2>
        <p className="mt-2 max-w-3xl text-xs leading-5 text-neutral-300">Public registration always creates a Client account. Privileged roles are assigned here after registration; only the protected bootstrap owner can grant Super Admin.</p>
      </div>

      <form className="rounded-xl border border-neutral-200 bg-neutral-50 p-5" onSubmit={(event) => {
        event.preventDefault();
        if (password.length < 8) {
          setPasswordError('Use at least 8 characters.');
          return;
        }
        if (password !== confirmPassword) {
          setPasswordError('Passwords do not match.');
          return;
        }
        setPasswordError('');
        const registered = registerClient({ name: name.trim(), email: email.trim(), company: company.trim(), password });
        if (registered) {
          setName(''); setEmail(''); setCompany(''); setPassword(''); setConfirmPassword('');
        }
      }}>
        <div className="mb-4 flex items-center gap-2"><UserPlus className="h-4 w-4" /><h3 className="text-sm font-black uppercase">Register a user</h3><span className="rounded-full bg-sky-100 px-2 py-1 text-[10px] font-bold text-sky-700">Role: Client</span></div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Full name" className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs" />
          <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs" />
          <input required value={company} onChange={(event) => setCompany(event.target.value)} placeholder="Company" className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs" />
          <PasswordField label="Password" value={password} visible={showPassword} onChange={(value) => { setPassword(value); setPasswordError(''); }} onToggle={() => setShowPassword((visible) => !visible)} />
          <PasswordField label="Confirm password" value={confirmPassword} visible={showConfirmPassword} onChange={(value) => { setConfirmPassword(value); setPasswordError(''); }} onToggle={() => setShowConfirmPassword((visible) => !visible)} />
          <button type="submit" className="rounded-md bg-black px-5 py-2 text-xs font-bold text-white">Register client</button>
        </div>
        {passwordError && <p role="alert" className="mt-2 text-xs font-semibold text-red-600">{passwordError}</p>}
        <p className="mt-2 text-[10px] text-neutral-500">The production PHP API must hash this password before saving it. This frontend demo intentionally never stores the plain password.</p>
      </form>

      <div className="overflow-x-auto rounded-xl border border-neutral-200">
        <table className="w-full min-w-[850px] text-left text-xs">
          <thead className="bg-neutral-100 text-[10px] uppercase tracking-wide text-neutral-500"><tr><th className="p-3">User</th><th className="p-3">Company</th><th className="p-3">Role</th><th className="p-3">Status</th><th className="p-3">Password</th><th className="p-3">Protection</th></tr></thead>
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
                <td className="p-3"><div className="flex items-center gap-2"><span className="text-[10px] font-semibold text-emerald-700">Configured · hidden</span><button type="button" onClick={() => { setResetUserId(user.id); setResetPassword(''); setResetConfirmation(''); setResetError(''); }} className="inline-flex items-center gap-1 rounded border border-neutral-300 px-2 py-1 text-[10px] font-bold hover:border-black"><KeyRound className="h-3 w-3" /> Reset</button></div></td>
                <td className="p-3">{user.isBootstrapOwner ? <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-800"><LockKeyhole className="h-3 w-3" /> Bootstrap owner</span> : <span className="text-neutral-400">Managed account</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {resetUserId && (
        <form className="rounded-xl border border-neutral-300 bg-white p-5 shadow-sm" onSubmit={(event) => {
          event.preventDefault();
          if (resetPassword.length < 8) {
            setResetError('Use at least 8 characters.');
            return;
          }
          if (resetPassword !== resetConfirmation) {
            setResetError('Passwords do not match.');
            return;
          }
          if (resetUserPassword(resetUserId, resetPassword)) {
            setResetUserId(null); setResetPassword(''); setResetConfirmation(''); setResetError('');
          }
        }}>
          <div className="mb-3 flex items-center justify-between gap-3"><div><h3 className="text-sm font-black">Reset password</h3><p className="text-[10px] text-neutral-500">{users.find((user) => user.id === resetUserId)?.name}</p></div><button type="button" onClick={() => setResetUserId(null)} className="text-xs font-bold text-neutral-500 hover:text-black">Cancel</button></div>
          <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <PasswordField label="New password" value={resetPassword} visible={showResetPassword} onChange={(value) => { setResetPassword(value); setResetError(''); }} onToggle={() => setShowResetPassword((visible) => !visible)} />
            <PasswordField label="Confirm new password" value={resetConfirmation} visible={showResetConfirmation} onChange={(value) => { setResetConfirmation(value); setResetError(''); }} onToggle={() => setShowResetConfirmation((visible) => !visible)} />
            <button type="submit" className="rounded-md bg-black px-5 py-2 text-xs font-bold text-white">Save new password</button>
          </div>
          {resetError && <p role="alert" className="mt-2 text-xs font-semibold text-red-600">{resetError}</p>}
        </form>
      )}

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-900"><strong>Production security:</strong> create the owner during a server-side migration from deployment secrets, store only a password hash, require MFA, log role changes, and never ship owner credentials in this frontend bundle.</div>
    </div>
  );
};

const PasswordField: React.FC<{ label: string; value: string; visible: boolean; onChange: (value: string) => void; onToggle: () => void }> = ({ label, value, visible, onChange, onToggle }) => (
  <div className="relative">
    <input required minLength={8} type={visible ? 'text' : 'password'} value={value} onChange={(event) => onChange(event.target.value)} placeholder={label} autoComplete="new-password" className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 pr-10 text-xs" />
    <button type="button" onClick={onToggle} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-neutral-500 hover:text-black" aria-label={`${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`}>
      {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  </div>
);
