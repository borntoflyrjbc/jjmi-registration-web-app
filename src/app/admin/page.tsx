'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, CheckCircle2, Clock, AlertCircle, 
  Download, RefreshCw, LogOut, Search, Filter
} from 'lucide-react';

interface Registration {
  id: string;
  application_number: string;
  full_name: string;
  email: string;
  country_code: string;
  mobile_number: string;
  category: string;
  calculated_fee: number;
  payment_status: 'pending' | 'under_review' | 'verified' | 'rejected' | 'waived';
  payment_utr?: string;
  created_at: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    under_review: 0,
    pending: 0,
    total_revenue: 0,
  });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  async function fetchData() {
    setLoading(true);
    try {
      const statsRes = await fetch('/api/admin/stats');
      if (statsRes.status === 401) {
        router.push('/admin/login');
        return;
      }
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats || statsData);
      }

      const query = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
      const regRes = await fetch(`/api/admin/registrations${query}`);
      if (regRes.ok) {
        const regData = await regRes.json();
        setRegistrations(regData.registrations || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id: string, newStatus: string) {
    try {
      const res = await fetch('/api/admin/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, payment_status: newStatus }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleRetrySheets() {
    setSyncing(true);
    try {
      await fetch('/api/admin/sheets/retry', { method: 'POST' });
      alert('Google Sheets sync process completed.');
    } catch (err) {
      alert('Sync failed.');
    } finally {
      setSyncing(false);
    }
  }

  async function handleLogout() {
    document.cookie = 'jjmi_admin_token=; Max-Age=0; path=/;';
    router.push('/admin/login');
  }

  const filteredRegistrations = registrations.filter(r => {
    const term = search.toLowerCase();
    return (
      r.full_name?.toLowerCase().includes(term) ||
      r.application_number?.toLowerCase().includes(term) ||
      r.email?.toLowerCase().includes(term) ||
      r.mobile_number?.includes(term) ||
      r.payment_utr?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800">
      {/* Top Bar */}
      <header className="bg-[#081d36] text-white px-6 py-4 flex items-center justify-between border-b border-amber-500/20 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center font-serif font-bold text-amber-300">
            JM
          </div>
          <div>
            <h1 className="text-lg font-serif font-bold tracking-wide">Jai Jagannath Mission International</h1>
            <p className="text-xs text-amber-200/80">Admin Verification & Oversight Portal</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRetrySheets}
            disabled={syncing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-amber-200 rounded-lg border border-slate-700 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Sync Sheets'}
          </button>
          <a
            href="/api/admin/export"
            download
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-rose-900/60 hover:bg-rose-800 text-rose-200 rounded-lg transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Total Applicants</p>
              <h3 className="text-2xl font-bold text-slate-800">{stats.total}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Verified</p>
              <h3 className="text-2xl font-bold text-emerald-600">{stats.verified}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Under Review</p>
              <h3 className="text-2xl font-bold text-amber-600">{stats.under_review}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Pending</p>
              <h3 className="text-2xl font-bold text-slate-700">{stats.pending}</h3>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, app #, UTR, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Payment Statuses</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Registrations Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider border-b border-slate-200 font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Application #</th>
                  <th className="py-3.5 px-4">Applicant</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Fee</th>
                  <th className="py-3.5 px-4">UTR Ref</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">Loading registrations...</td>
                  </tr>
                ) : filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">No applicants found matching your query.</td>
                  </tr>
                ) : (
                  filteredRegistrations.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-mono font-bold text-blue-900">{r.application_number}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{r.full_name}</div>
                        <div className="text-slate-400">{r.email || '—'}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {r.country_code} {r.mobile_number}
                      </td>
                      <td className="py-3 px-4 capitalize text-slate-600">{r.category}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">₹{r.calculated_fee}</td>
                      <td className="py-3 px-4 font-mono text-slate-700">
                        {r.payment_utr ? (
                          <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium">{r.payment_utr}</span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          r.payment_status === 'verified' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          r.payment_status === 'under_review' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          r.payment_status === 'rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                          'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {r.payment_status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <select
                          value={r.payment_status}
                          onChange={(e) => handleStatusChange(r.id, e.target.value)}
                          className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-700 focus:outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="under_review">Under Review</option>
                          <option value="verified">Verified</option>
                          <option value="rejected">Rejected</option>
                          <option value="waived">Waived</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
