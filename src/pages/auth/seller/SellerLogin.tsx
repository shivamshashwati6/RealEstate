import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { useAuthStore } from '../../../store/useAuthStore';
import { Building2, ArrowRight, Lock, Mail, AlertCircle } from 'lucide-react';

export default function SellerLogin() {
  const [email, setEmail] = useState('sarah.realty@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const mockLogin = useAuthStore((state) => state.mockLogin);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (isSupabaseConfigured) {
      // 1. Authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setLoading(false);
        return setError(authError.message);
      }

      // 2. Fetch role directly from public.users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', authData.user.id)
        .single();

      const userRole = userData?.role || authData.user.user_metadata?.role;

      if (userError || userRole !== 'seller') {
        await supabase.auth.signOut();
        setLoading(false);
        return setError(`This account is registered as a ${userRole || 'different role'}. Please use the correct login portal.`);
      }

      // 3. Sync Zustand global state
      await initializeAuth();
    } else {
      // Demo / Local storage mode fallback
      await mockLogin(email, 'seller');
    }

    // 4. DIRECT IMMEDIATE NAVIGATION to Seller Dashboard
    setLoading(false);
    navigate('/dashboard/seller', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 w-fit mx-auto">
            <Building2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Seller & Agent Studio</h2>
          <p className="text-xs text-slate-400">Manage property listings, inquiries & visit requests</p>
        </div>

        {error && (
          <div className="bg-rose-950/80 border border-rose-500/40 p-3 rounded-xl text-xs text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 text-white pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 text-white pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Seller Studio</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-400 border-t border-slate-800 flex justify-between">
          <Link to="/auth/seller/register" className="hover:text-amber-400">
            Create Seller Account
          </Link>
          <Link to="/" className="hover:text-amber-400">
            Back to Gateway
          </Link>
        </div>
      </div>
    </div>
  );
}
