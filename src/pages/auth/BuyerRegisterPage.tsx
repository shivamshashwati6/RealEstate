import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import { User, ArrowRight } from 'lucide-react';

export const BuyerRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { switchRole } = useAuthStore();
  const { addNotification } = useNotificationStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetCity, setTargetCity] = useState('Miami');
  const [maxBudget, setMaxBudget] = useState(1500000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    switchRole('buyer');
    addNotification('success', 'Buyer Account Created!', 'Welcome to EstateMarket. Instant session activated.');
    navigate('/dashboard/buyer');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-8 shadow-2xl space-y-6 animate-fadeIn">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg">
            <User className="w-6 h-6" />
          </div>
          <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 inline-block">
            Home Seeker Portal
          </span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Buyer Registration</h1>
          <p className="text-xs text-slate-400">Discover penthouses, villas & investment properties</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Alex Johnson"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none"
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
                className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Search Preferences</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 text-[11px] mb-1">Preferred Location</label>
                <select
                  value={targetCity}
                  onChange={(e) => setTargetCity(e.target.value)}
                  className="w-full bg-slate-900 text-white p-2 rounded-xl border border-slate-800"
                >
                  <option value="Miami">Miami, FL</option>
                  <option value="New York">New York, NY</option>
                  <option value="Austin">Austin, TX</option>
                  <option value="San Jose">San Jose, CA</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] mb-1">Max Budget</label>
                <select
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(Number(e.target.value))}
                  className="w-full bg-slate-900 text-white p-2 rounded-xl border border-slate-800 font-semibold text-emerald-400"
                >
                  <option value={500000}>$500,000</option>
                  <option value={1500000}>$1.5 Million</option>
                  <option value={5000000}>$5.0 Million</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 transition-all flex items-center justify-center gap-2"
          >
            <span>Register & Launch Buyer Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
          Already registered as a Buyer?{' '}
          <Link to="/auth/buyer/login" className="text-emerald-400 font-semibold hover:underline">
            Sign In to Buyer Portal
          </Link>
        </div>
      </div>
    </div>
  );
};
