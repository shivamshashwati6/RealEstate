import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import { supabase, isSupabaseConfigured } from '../../services/supabase';
import { Building2, ArrowRight, AlertTriangle } from 'lucide-react';

export const SellerLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { allUsers, switchRole } = useAuthStore();
  const { addNotification } = useNotificationStore();

  const [email, setEmail] = useState('sarah.realty@example.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [roleError, setRoleError] = useState<{ message: string; targetLink: string; targetRole: string } | null>(null);

  const handleSellerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setRoleError(null);
    setLoading(true);

    if (isSupabaseConfigured && supabase) {
      // 1. Authenticate credentials directly (No OTP)
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setLoading(false);
        addNotification('error', 'Authentication Failed', authError.message);
        return;
      }

      // 2. Validate role in public.users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single();

      const fetchedRole = userData?.role || data.user.user_metadata?.role;

      if (userError || fetchedRole !== 'seller') {
        await supabase.auth.signOut();
        setLoading(false);
        const actualRole = fetchedRole || 'different role';
        const targetLink = `/auth/${actualRole}/login`;
        setRoleError({
          message: `This account is registered as a ${actualRole.toUpperCase()}. Please log in through the correct portal.`,
          targetLink,
          targetRole: actualRole,
        });
        addNotification('error', 'Role Mismatch', `This account is registered as a ${actualRole.toUpperCase()}.`);
        return;
      }
    } else {
      const existingUser = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (existingUser && existingUser.role !== 'seller') {
        const correctRole = existingUser.role;
        const targetLink = `/auth/${correctRole}/login`;
        setRoleError({
          message: `This account is registered as a ${correctRole.toUpperCase()}!`,
          targetLink,
          targetRole: correctRole,
        });
        addNotification('error', 'Role Validation Failed', `Account ${email} belongs to a ${correctRole.toUpperCase()}. Please use the ${correctRole.toUpperCase()} login portal.`);
        setLoading(false);
        return;
      }
    }

    switchRole('seller');
    setLoading(false);
    addNotification('success', 'Seller Studio Sign In', 'Welcome back to your Seller & Agent Studio!');
    navigate('/dashboard/seller');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-6 animate-fadeIn">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-lg">
            <Building2 className="w-7 h-7" />
          </div>
          <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30 inline-block">
            Seller & Agent Studio
          </span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Seller Studio Login</h1>
          <p className="text-xs text-slate-400">Manage listings, buyer tour visits & impression analytics</p>
        </div>

        {roleError && (
          <div className="bg-rose-950/80 border border-rose-800 p-4 rounded-2xl space-y-2 text-xs animate-shake">
            <div className="flex items-center gap-2 text-rose-400 font-bold">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Role Mismatch Warning</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {roleError.message}
            </p>
            <Link
              to={roleError.targetLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs mt-1"
            >
              <span>Go to {roleError.targetRole.toUpperCase()} Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        <form onSubmit={handleSellerLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Business Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-emerald-400 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Authenticating Agent Credentials...</span>
            ) : (
              <>
                <span>Sign In to Seller Studio</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <Link to="/" className="hover:text-white">← Gateway Landing</Link>
          <Link to="/auth/seller/register" className="text-amber-400 font-bold hover:underline">Register Seller Account</Link>
        </div>
      </div>
    </div>
  );
};
