import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Database, Server, CheckCircle2, ShieldCheck, Download, Sparkles, ArrowRight, X, AlertTriangle } from 'lucide-react';

export const FirstTimeMySQLWizard: React.FC = () => {
  const { showFirstTimeWizard, setShowFirstTimeWizard, mysqlConfig, completeFirstTimeMySQLSetup, showToast } = useStore();

  const [host, setHost] = useState(mysqlConfig.host || 'localhost');
  const [port, setPort] = useState(mysqlConfig.port || 3306);
  const [database, setDatabase] = useState(mysqlConfig.database || 'roly_b2b_ecommerce');
  const [user, setUser] = useState(mysqlConfig.user || 'roly_admin');
  const [password, setPassword] = useState(mysqlConfig.password || '••••••••••••');
  const [prefix, setPrefix] = useState(mysqlConfig.tablePrefix || 'roly_');
  const [ssl, setSsl] = useState(mysqlConfig.ssl);
  const [isInitializing, setIsInitializing] = useState(false);

  if (!showFirstTimeWizard) return null;

  const handleInitialize = async () => {
    setIsInitializing(true);
    await completeFirstTimeMySQLSetup({
      host,
      port: Number(port),
      database,
      user,
      password,
      tablePrefix: prefix,
      ssl,
    });
    setIsInitializing(false);
  };

  const handleSkipAndUseSandbox = () => {
    localStorage.setItem('roly_first_time_mysql_done', 'true');
    setShowFirstTimeWizard(false);
    showToast('Loaded in Demo Sandbox mode with full local persistence. You can configure MySQL anytime from Admin.', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8 overflow-hidden border border-neutral-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Gradient Header */}
        <div className="bg-neutral-950 text-white p-6 sm:p-8 relative">
          <button
            onClick={handleSkipAndUseSandbox}
            className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2.5 text-yellow-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Database className="w-4 h-4" />
            <span>First-Time Deployment & Setup Wizard</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Configure Your MySQL Database
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-lg">
            Welcome to the ROLY enterprise fashion & wholesale e-commerce platform. Connect your live MySQL or MariaDB instance to initialize the database tables and catalog.
          </p>
        </div>

        {/* Wizard Form */}
        <div className="p-6 sm:p-8 space-y-5 text-xs">
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3.5 flex items-start space-x-3 text-blue-900">
            <Sparkles className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold">Multi-Vendor & B2B Inventory Schema</p>
              <p className="text-[11px] text-blue-800">
                Initializing will provision tables for products, vendor matrices, orders, packing lists, invoices, and stock inventory.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">MySQL Host / Server IP:</label>
              <input
                type="text"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                placeholder="localhost or 127.0.0.1"
                className="w-full border border-gray-300 rounded px-3 py-2 font-mono font-semibold outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Port:</label>
              <input
                type="number"
                value={port}
                onChange={(e) => setPort(Number(e.target.value))}
                placeholder="3306"
                className="w-full border border-gray-300 rounded px-3 py-2 font-mono font-semibold outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Database Name:</label>
              <input
                type="text"
                value={database}
                onChange={(e) => setDatabase(e.target.value)}
                placeholder="roly_b2b_ecommerce"
                className="w-full border border-gray-300 rounded px-3 py-2 font-mono font-bold outline-none focus:border-black text-black"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Table Prefix:</label>
              <input
                type="text"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                placeholder="roly_"
                className="w-full border border-gray-300 rounded px-3 py-2 font-mono font-semibold outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Database Username:</label>
              <input
                type="text"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="root or roly_admin"
                className="w-full border border-gray-300 rounded px-3 py-2 font-mono font-semibold outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full border border-gray-300 rounded px-3 py-2 font-mono font-semibold outline-none focus:border-black"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <label className="flex items-center space-x-2 cursor-pointer font-bold text-gray-700">
              <input
                type="checkbox"
                checked={ssl}
                onChange={(e) => setSsl(e.target.checked)}
                className="accent-black rounded"
              />
              <span>Enable SSL / TLS Encrypted Connection</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={handleSkipAndUseSandbox}
              className="text-xs text-gray-500 hover:text-black font-semibold cursor-pointer underline"
            >
              Continue in Fast Demo Sandbox Mode
            </button>

            <button
              disabled={isInitializing}
              onClick={handleInitialize}
              className="w-full sm:w-auto px-6 py-3 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isInitializing ? (
                <span>Initializing Database & Tables...</span>
              ) : (
                <>
                  <Server className="w-4 h-4 text-emerald-400" />
                  <span>Connect & Initialize MySQL</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
