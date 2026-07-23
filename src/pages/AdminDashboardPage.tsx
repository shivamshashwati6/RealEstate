import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { usePropertyStore } from '../store/usePropertyStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { StorageEngine } from '../services/storage';
import type { ReportItem, Property } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Shield, CheckCircle2, Building2, Flag, BarChart2, Check, RefreshCw, Users } from 'lucide-react';

interface AdminDashboardPageProps {
  onSelectProperty: (property: Property) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onSelectProperty }) => {
  const { allUsers, toggleUserSuspension } = useAuthStore();
  const { properties, updateListingStatus, fetchProperties } = usePropertyStore();
  const { addNotification } = useNotificationStore();

  const [reports, setReports] = useState<ReportItem[]>(() => StorageEngine.getReports());

  const analytics = StorageEngine.getAnalyticsSummary();
  const pendingProperties = properties.filter((p) => p.status === 'pending_approval');

  const handleApproveProperty = (id: string, title: string) => {
    updateListingStatus(id, 'live');
    addNotification('success', 'Listing Approved!', `"${title}" is now published and live.`);
  };

  const handleRejectProperty = (id: string, title: string) => {
    updateListingStatus(id, 'archived');
    addNotification('warning', 'Listing Rejected', `"${title}" has been rejected.`);
  };

  const handleResolveReport = (reportId: string, status: ReportItem['status']) => {
    StorageEngine.updateReportStatus(reportId, status);
    setReports(StorageEngine.getReports());
    addNotification('info', 'Report Updated', `Report marked as ${status}.`);
  };

  const COLORS = ['#10b981', '#14b8a6', '#06b6d4', '#3b82f6', '#8b5cf6', '#f59e0b'];

  return (
    <div className="space-y-8 pb-16">
      <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">Platform Governance & Moderation</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-500/20 text-rose-400 border border-rose-500/30">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Real-time health telemetry, listing queue, and fraud prevention</p>
          </div>
        </div>

        <button
          onClick={fetchProperties}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700"
        >
          <RefreshCw className="w-4 h-4" />
          Sync Data Telemetry
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-slate-400 font-semibold block">Total Users</span>
          <span className="text-2xl font-extrabold text-white">{analytics.totalUsers}</span>
          <span className="text-[10px] text-emerald-400 font-medium block">Across 3 Roles</span>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-slate-400 font-semibold block">Total Listings</span>
          <span className="text-2xl font-extrabold text-emerald-400">{analytics.totalListings}</span>
          <span className="text-[10px] text-slate-400 block">Catalog Volume</span>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-slate-400 font-semibold block">Pending Approvals</span>
          <span className="text-2xl font-extrabold text-amber-400">{pendingProperties.length}</span>
          <span className="text-[10px] text-amber-400 font-medium block">Requires Moderation</span>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-slate-400 font-semibold block">Total Visits</span>
          <span className="text-2xl font-extrabold text-teal-400">{analytics.totalVisits}</span>
          <span className="text-[10px] text-slate-400 block">Scheduled Tours</span>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-slate-400 font-semibold block">Total Inquiries</span>
          <span className="text-2xl font-extrabold text-sky-400">{analytics.totalInquiries}</span>
          <span className="text-[10px] text-slate-400 block">Chat Messages</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-emerald-400" />
            Monthly Platform Growth (Users vs Listings)
          </h3>
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.monthlyRegistrations}>
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="users" fill="#10b981" name="New Users" radius={[4, 4, 0, 0]} />
                <Bar dataKey="listings" fill="#06b6d4" name="New Listings" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-teal-400" />
            Listings Distribution by City
          </h3>
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.listingsByCity}
                  dataKey="count"
                  nameKey="city"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ city, count }) => `${city}: ${count}`}
                >
                  {analytics.listingsByCity.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-amber-400" />
            Listing Approval Moderation Queue ({pendingProperties.length})
          </h3>
          <span className="text-xs text-slate-400">Review pending seller submissions before public release</span>
        </div>

        {pendingProperties.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">All property submissions reviewed! Queue is empty.</p>
        ) : (
          <div className="space-y-3">
            {pendingProperties.map((p) => (
              <div key={p.id} className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <img src={p.images[0]} alt={p.title} className="w-14 h-14 rounded-xl object-cover" />
                  <div>
                    <h4
                      onClick={() => onSelectProperty(p)}
                      className="font-bold text-white hover:text-emerald-400 cursor-pointer line-clamp-1"
                    >
                      {p.title}
                    </h4>
                    <p className="text-slate-400 text-[11px]">{p.city} • For {p.intent.toUpperCase()} • ${p.price.toLocaleString()}</p>
                    <span className="text-[10px] text-amber-400 font-semibold">Seller: {p.ownerName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleApproveProperty(p.id, p.title)}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-1 shadow-md"
                  >
                    <Check className="w-4 h-4" />
                    Approve Listing
                  </button>
                  <button
                    onClick={() => handleRejectProperty(p.id, p.title)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-rose-400 hover:bg-rose-950 font-bold"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-teal-400" />
          Registered Users Directory & Roles
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider">
                <th className="p-3.5 rounded-l-xl">User Profile</th>
                <th className="p-3.5">Contact Info</th>
                <th className="p-3.5">Assigned Role</th>
                <th className="p-3.5">Account Status</th>
                <th className="p-3.5 text-right rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {allUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-950/40 transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover border border-slate-700" />
                      <div>
                        <span className="font-bold text-white block">{u.name}</span>
                        <span className="text-[10px] text-slate-500">ID: {u.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="block font-medium">{u.email}</span>
                    <span className="text-[11px] text-slate-500">{u.phone}</span>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                      u.role === 'admin' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                      u.role === 'seller' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                      'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className={`font-semibold ${u.isSuspended ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {u.isSuspended ? 'Suspended' : 'Active Verified'}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => toggleUserSuspension(u.id)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-colors ${
                        u.isSuspended
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30'
                          : 'bg-slate-800 text-rose-400 border-slate-700 hover:bg-rose-950'
                      }`}
                    >
                      {u.isSuspended ? 'Reactivate User' : 'Suspend Account'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Flag className="w-5 h-5 text-rose-400" />
          Flagged User Reports ({reports.length})
        </h3>

        {reports.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">No reported listings.</p>
        ) : (
          <div className="space-y-3">
            {reports.map((r) => (
              <div key={r.id} className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div>
                  <h4 className="font-bold text-white">Property: {r.propertyTitle}</h4>
                  <p className="text-rose-400 font-semibold mt-0.5">Reason: {r.reason}</p>
                  <p className="text-slate-400 text-[11px]">Reported by {r.reportedByName} • Status: {r.status}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleResolveReport(r.id, 'dismissed')}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                  >
                    Dismiss Report
                  </button>
                  <button
                    onClick={() => handleResolveReport(r.id, 'action_taken')}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold"
                  >
                    Action Taken
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
