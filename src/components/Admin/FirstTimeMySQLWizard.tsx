import React, { useEffect, useState } from 'react';
import { CheckCircle2, Database, Server, ShieldCheck, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const FirstTimeMySQLWizard: React.FC = () => {
  const { showFirstTimeWizard, setShowFirstTimeWizard, testMySQLConnection, showToast } = useStore();
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    if (!showFirstTimeWizard) return undefined;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setShowFirstTimeWizard(false); };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [showFirstTimeWizard, setShowFirstTimeWizard]);

  if (!showFirstTimeWizard) return null;

  const continueDemo = () => {
    localStorage.setItem('roly_first_time_mysql_done', 'true');
    setShowFirstTimeWizard(false);
    showToast('Local demo mode enabled. Hosted data remains browser-local until the full authenticated API is connected.', 'info');
  };

  const testHostedApi = async () => {
    setIsTesting(true);
    const connected = await testMySQLConnection({});
    setIsTesting(false);
    if (connected) {
      localStorage.setItem('roly_first_time_mysql_done', 'true');
      setShowFirstTimeWizard(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 font-sans backdrop-blur-sm" role="dialog" aria-modal="true" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowFirstTimeWizard(false); }}>
      <div className="my-8 w-full max-w-2xl overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl">
        <div className="relative bg-neutral-950 p-6 text-white sm:p-8">
          <button type="button" onClick={continueDemo} className="absolute right-4 top-4 p-1 text-neutral-400 hover:text-white" aria-label="Close setup"><X className="h-5 w-5" /></button>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-yellow-400"><Database className="h-4 w-4" />Namecheap/cPanel database setup</div>
          <h2 className="text-2xl font-black tracking-tight sm:text-3xl">Connect PHP securely to MySQL</h2>
          <p className="mt-2 max-w-xl text-sm text-neutral-300">Database credentials belong in the hosted PHP configuration—not in this browser form.</p>
        </div>
        <div className="space-y-5 p-6 text-xs sm:p-8">
          <ol className="space-y-3">
            {[
              'Create the MySQL database and restricted user in Namecheap cPanel.',
              'Import database/001_initial_schema.sql through phpMyAdmin.',
              'Copy public_html/api/config.example.php to config.php and enter the cPanel-prefixed database details there.',
              'Open /api/health.php, then use the connection test below.',
            ].map((step, index) => <li key={step} className="flex gap-3 rounded-lg bg-neutral-50 p-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black font-bold text-white">{index + 1}</span><span className="pt-1 leading-5">{step}</span></li>)}
          </ol>
          <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-900"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" /><div><strong className="block">Safe connection path</strong>React calls <code>/api/health.php</code>; PHP uses PDO to connect to MySQL. The browser never receives the password.</div></div>
          <div className="flex flex-col items-center justify-between gap-3 border-t border-neutral-200 pt-4 sm:flex-row">
            <button type="button" onClick={continueDemo} className="font-semibold text-neutral-500 underline hover:text-black">Continue with local demo data</button>
            <button type="button" disabled={isTesting} onClick={testHostedApi} className="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-6 py-3 font-bold uppercase tracking-wider text-white disabled:opacity-50 sm:w-auto">{isTesting ? <Server className="h-4 w-4 animate-pulse text-yellow-400" /> : <CheckCircle2 className="h-4 w-4 text-emerald-400" />}{isTesting ? 'Testing hosted API...' : 'Test hosted PHP → MySQL'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};
