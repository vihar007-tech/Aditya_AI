import React, { useState } from 'react';
import { ShieldAlert, Lock, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';

interface AdminAccessRestrictedProps {
  onGrantAdmin: () => void;
  onReturnToUser: () => void;
}

export const AdminAccessRestricted: React.FC<AdminAccessRestrictedProps> = ({
  onGrantAdmin,
  onReturnToUser
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    // Allow standard demo admin access or demo pin 'admin123'
    if (pin === 'admin' || pin === 'admin123' || pin === '') {
      onGrantAdmin();
    } else {
      setError(true);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-slate-900 text-slate-100 p-4">
      <div className="max-w-md w-full bg-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 mx-auto">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Role-Based Access Control</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Administrator Access Restricted
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            The Admin Console is reserved for university staff, system architects, and admissions officers. RAG pipeline controls, API keys, and campus telemetry require administrative credentials.
          </p>
        </div>

        {/* Demo Unlock Form */}
        <form onSubmit={handleVerify} className="space-y-3 pt-2">
          <div className="relative">
            <input
              type="password"
              placeholder="Enter Admin PIN (Demo: admin123 or leave blank)"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError(false);
              }}
              className="w-full px-4 py-3 text-xs rounded-xl border border-slate-800 bg-slate-900 text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500 text-center"
            />
          </div>

          {error && (
            <div className="text-xs text-rose-400 font-semibold">
              Invalid credentials. Use demo PIN 'admin123' or 1-click toggle.
            </div>
          )}

          <div className="flex flex-col gap-2 pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <KeyRound className="w-4 h-4" />
              <span>Authenticate as Administrator</span>
            </button>

            <button
              type="button"
              onClick={onReturnToUser}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Student AI Assistant</span>
            </button>
          </div>
        </form>

        <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-500">
          Aditya University Security & Data Privacy Protocols • NAAC A++
        </div>
      </div>
    </div>
  );
};
