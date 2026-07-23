import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import type { UserRole } from '../../types';
import { Shield, User, Building, Sparkles } from 'lucide-react';

export const RoleSwitcherBar: React.FC = () => {
  const { currentUser, switchRole } = useAuthStore();

  const roles: { role: UserRole; label: string; icon: React.ReactNode; color: string }[] = [
    { role: 'buyer', label: 'Buyer Persona', icon: <User className="w-3.5 h-3.5" />, color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    { role: 'seller', label: 'Seller / Agent Persona', icon: <Building className="w-3.5 h-3.5" />, color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    { role: 'admin', label: 'Admin / Moderator Persona', icon: <Shield className="w-3.5 h-3.5" />, color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
  ];

  return (
    <div className="bg-slate-950/90 border-b border-slate-800 text-xs py-1.5 px-4 sticky top-0 z-50 backdrop-blur-md flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2 text-slate-400">
        <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
        <span className="font-semibold text-slate-300">Demo Role Sandbox:</span>
        <span className="hidden sm:inline text-slate-400">Current User: <strong className="text-slate-200">{currentUser.name}</strong> ({currentUser.role.toUpperCase()})</span>
      </div>

      <div className="flex items-center gap-1.5">
        {roles.map((r) => {
          const isActive = currentUser.role === r.role;
          return (
            <button
              key={r.role}
              onClick={() => switchRole(r.role)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${
                isActive
                  ? `${r.color} shadow-sm ring-1 ring-white/10 font-bold scale-105`
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {r.icon}
              <span>{r.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
