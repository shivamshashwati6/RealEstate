import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import { Shield, Key, ArrowRight, CheckCircle2 } from 'lucide-react';

export const RegisterAdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { switchRole } = useAuthStore();
  const { addNotification } = useNotificationStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secretCode, setSecretCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (secretCode !== 'ADMIN2026') {
      addNotification('error', 'Invalid Invite Secret Passcode', 'Admin registration requires secret code: ADMIN2026');
      return;
    }

    switchRole('admin');
    addNotification('success', 'Admin Account Authorized!', 'Welcome to the Super Admin Governance Center.');
    navigate('/dashboard/admin');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-6 animate-fadeIn">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto shadow-lg">
            <Shield className="w-6 h-6" />
          </div>
          <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-rose-500/20 text-rose-400 border border-rose-500/30 inline-block">
            Restricted Access
          </span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Admin & Moderator Setup</h1>
          <p className="text-xs text-slate-400">Invite-only registration for platform governance</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="bg-rose-950/60 p-3 rounded-xl border border-rose-900 text-[11px] text-rose-300 text-center">
            🔒 Demo Invite Secret Passcode required: <strong className="text-white">ADMIN2026</strong>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Invite Secret Passcode *</label>
            <input
              type="password"
              required
              placeholder="Enter ADMIN2026"
              value={secretCode}
              onChange={(e) => setSecretCode(e.target.value)}
              className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Full Name *</label>
            <input
              type="text"
              required
              placeholder="Eleanor Vance"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Admin Email *</label>
            <input
              type="email"
              required
              placeholder="admin@estatemarket.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Password *</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-rose-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white font-extrabold text-xs shadow-lg shadow-rose-600/20 hover:from-rose-500 hover:to-amber-500 transition-all flex items-center justify-center gap-2"
          >
            <span>Authorize & Launch Admin Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
          Return to standard{' '}
          <Link to="/auth/login" className="text-rose-400 font-semibold hover:underline">
            Sign In Portal
          </Link>
        </div>
      </div>
    </div>
  );
};
