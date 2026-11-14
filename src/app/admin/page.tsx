'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, CheckCircle2, Clock, AlertCircle, 
  Download, RefreshCw, LogOut, Search, Filter, 
  ExternalLink, MapPin, Eye, X, Phone, Mail, FileText, Calendar
} from 'lucide-react';

interface Registration {
  id: string;
  application_number: string;
  full_name: string;
  email: string;
  country_code: string;
  mobile_number: string;
  whatsapp_number?: string;
  city: string;
  state_region: string;
  country: string;
  postal_code?: string;
  street_address?: string;
  category: string;
  calculated_fee: number;
  payment_status: 'pending' | 'under_review' | 'verified' | 'rejected' | 'waived';
  registration_status?: string;
  payment_utr?: string;
  service_interests?: string;
  joining_purpose?: string;
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
  const [selectedApplicant, setSelectedApplicant] = useState<Registration | null>(null);

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

      const query = statusFilter !== 'all' ? `?paymentStatus=${statusFilter}` : '';
      const regRes = await fetch(`/api/admin/registrations${query}`);
      if (regRes.ok) {
        const regData = await regRes.json();
        setRegistrations(regData.registrations || regData.records || []);
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
        body: JSON.stringify({ id, paymentStatus: newStatus }),
      });
      if (res.ok) {
        fetchData();
        if (selectedApplicant && selectedApplicant.id === id) {
          setSelectedApplicant(prev => prev ? { ...prev, payment_status: newStatus as any } : null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleRetrySheets() {
    setSyncing(true);
    try {
      const res = await fetch('/api/admin/sheets/retry', { method: 'POST' });
      const data = await res.json();
      alert(data.message || 'Google Sheets sync process completed.');
      fetchData();
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
      r.city?.toLowerCase().includes(term) ||
      r.state_region?.toLowerCase().includes(term) ||
      r.country?.toLowerCase().includes(term) ||
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
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
          <a
            href="https://docs.google.com/spreadsheets/d/1J0SarYkXukFWbzoCrIMeJDviYCdvZ7-GOeI0t4KMZQo/edit"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-lg shadow-sm transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Open Google Sheet
          </a>
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
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, city, state, mobile, app #..."
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
                  <th className="py-3.5 px-4">Location</th>
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
                    <td colSpan={9} className="py-12 text-center text-slate-400">Loading registrations...</td>
                  </tr>
                ) : filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">No applicants found matching your query.</td>
                  </tr>
                ) : (
                  filteredRegistrations.map((r) => (
                    <tr key={r.id || r.application_number} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-mono font-bold text-blue-900">
                        <button
                          onClick={() => setSelectedApplicant(r)}
                          className="hover:underline text-left text-blue-900 font-bold"
                          title="Click to view full dossier"
                        >
                          {r.application_number}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{r.full_name}</div>
                        <div className="text-slate-400 text-[11px]">{r.email || '—'}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-700 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>{r.city || 'Puri'}{r.state_region ? `, ${r.state_region}` : ''}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 pl-4">{r.country || 'India'}{r.postal_code ? ` • ${r.postal_code}` : ''}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                        {r.country_code} {r.mobile_number}
                      </td>
                      <td className="py-3 px-4 capitalize text-slate-600 whitespace-nowrap">{r.category}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">₹{r.calculated_fee}</td>
                      <td className="py-3 px-4 font-mono text-slate-700">
                        {r.payment_utr ? (
                          <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium">{r.payment_utr}</span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          r.payment_status === 'verified' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          r.payment_status === 'under_review' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          r.payment_status === 'rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                          'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {r.payment_status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedApplicant(r)}
                            className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                            title="View Full Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
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
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Applicant Detail Modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="bg-[#081d36] text-white p-5 flex items-center justify-between rounded-t-2xl">
              <div>
                <span className="text-xs uppercase tracking-wider text-amber-300 font-medium">Participant Dossier</span>
                <h2 className="text-xl font-bold font-serif">{selectedApplicant.full_name}</h2>
                <p className="text-xs text-slate-300 font-mono mt-0.5">{selectedApplicant.application_number}</p>
              </div>
              <button
                onClick={() => setSelectedApplicant(null)}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 text-sm text-slate-700">
              {/* Section 1: Contact Details */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-xs text-slate-400 block">Calling Mobile</span>
                    <span className="font-semibold text-slate-800">{selectedApplicant.country_code} {selectedApplicant.mobile_number}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">WhatsApp Number</span>
                    <span className="font-semibold text-slate-800">{selectedApplicant.whatsapp_number || `${selectedApplicant.country_code} ${selectedApplicant.mobile_number}`}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-xs text-slate-400 block">Email Address</span>
                    <span className="font-semibold text-slate-800">{selectedApplicant.email || 'None Provided'}</span>
                  </div>
                </div>
              </div>

              {/* Section 2: Location Details */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  Location & Residence
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-xs text-slate-400 block">City</span>
                    <span className="font-semibold text-slate-800">{selectedApplicant.city || '—'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">State / Region</span>
                    <span className="font-semibold text-slate-800">{selectedApplicant.state_region || '—'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Country</span>
                    <span className="font-semibold text-slate-800">{selectedApplicant.country || 'India'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Postal / PIN Code</span>
                    <span className="font-semibold text-slate-800">{selectedApplicant.postal_code || '—'}</span>
                  </div>
                  {selectedApplicant.street_address && (
                    <div className="col-span-2">
                      <span className="text-xs text-slate-400 block">Street Address</span>
                      <span className="font-medium text-slate-800">{selectedApplicant.street_address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 3: Participation & Payment */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  Participation & Contribution
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-xs text-slate-400 block">Category</span>
                    <span className="font-semibold text-slate-800">{selectedApplicant.category}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Contribution Amount</span>
                    <span className="font-bold text-emerald-700 text-base">₹{selectedApplicant.calculated_fee}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Payment Status</span>
                    <span className="font-semibold text-slate-800 capitalize">{selectedApplicant.payment_status.replace('_', ' ')}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">UTR Reference</span>
                    <span className="font-mono text-xs font-semibold text-slate-800">{selectedApplicant.payment_utr || 'Not Provided'}</span>
                  </div>
                  {selectedApplicant.joining_purpose && (
                    <div className="col-span-2">
                      <span className="text-xs text-slate-400 block">Joining Purpose</span>
                      <span className="font-medium text-slate-800">{selectedApplicant.joining_purpose}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Timestamp */}
              <div className="text-xs text-slate-400 flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Registered: {new Date(selectedApplicant.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                </span>
                <button
                  onClick={() => setSelectedApplicant(null)}
                  className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
