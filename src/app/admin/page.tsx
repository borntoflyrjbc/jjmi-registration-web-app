'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, CheckCircle2, Clock, AlertCircle, 
  Download, RefreshCw, LogOut, Search, Filter, 
  ExternalLink, MapPin, Eye, X, Phone, Mail, FileText, Calendar,
  Activity, Globe, TrendingUp, Smartphone, Monitor, Tablet, BarChart3, ChevronDown, ChevronUp
} from 'lucide-react';

interface VisitorAnalytics {
  totalVisits: number;
  todayVisits: number;
  yesterdayVisits: number;
  uniqueVisitors: number;
  last7DaysVisits: number;
  thisMonthVisits: number;
  devices: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  sources: {
    source: string;
    count: number;
  }[];
  dailyBreakdown: {
    date: string;
    fullDate: string;
    totalVisits: number;
    uniqueVisitors: number;
    mobile: number;
    desktop: number;
    tablet: number;
  }[];
}

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
  const [analytics, setAnalytics] = useState<VisitorAnalytics>({
    totalVisits: 0,
    todayVisits: 0,
    yesterdayVisits: 0,
    uniqueVisitors: 0,
    last7DaysVisits: 0,
    thisMonthVisits: 0,
    devices: { mobile: 0, desktop: 0, tablet: 0 },
    sources: [],
    dailyBreakdown: [],
  });
  const [timeframeFilter, setTimeframeFilter] = useState<'7d' | '30d' | 'all'>('7d');
  const [showDetailedAnalytics, setShowDetailedAnalytics] = useState(true);

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

      // Fetch Visitor Analytics
      const analyticsRes = await fetch('/api/admin/analytics');
      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        if (analyticsData.analytics) {
          setAnalytics(analyticsData.analytics);
        }
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

  // Filter daily breakdown based on selected timeframe
  const filteredDaily = React.useMemo(() => {
    if (!analytics.dailyBreakdown || analytics.dailyBreakdown.length === 0) return [];
    if (timeframeFilter === '7d') return analytics.dailyBreakdown.slice(-7);
    if (timeframeFilter === '30d') return analytics.dailyBreakdown.slice(-30);
    return analytics.dailyBreakdown;
  }, [analytics.dailyBreakdown, timeframeFilter]);

  const totalDevCount =
    (analytics.devices?.mobile || 0) +
    (analytics.devices?.desktop || 0) +
    (analytics.devices?.tablet || 0);

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
            href="https://docs.google.com/spreadsheets/d/1bZ_RrC_f6pol6Pre_SJmyOwAYUEAM61koM9YkOBYkpI/edit"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-lg shadow-sm transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Sheet 1 (Master)
          </a>
          <a
            href="https://docs.google.com/spreadsheets/d/1J0SarYkXukFWbzoCrIMeJDviYCdvZ7-GOeI0t4KMZQo/edit"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-amber-600/90 hover:bg-amber-500 text-white font-semibold rounded-lg shadow-sm transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Sheet 2 (तिवारी जी)
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
            href="/api/admin/export-visitors"
            download
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg shadow-sm transition"
            title="Download full visitor tracking CSV report"
          >
            <Activity className="w-3.5 h-3.5" />
            Visitors CSV
          </a>
          <a
            href="/api/admin/export"
            download
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5" />
            Leads CSV
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
        {/* ======================================================== */}
        {/* 1. VISITOR ANALYTICS & TRAFFIC TRACKING SECTION           */}
        {/* ======================================================== */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 mb-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center shadow-xs">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Website Visitor Analytics & Campaign Tracking
                  </h2>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1"></span>
                    Live Tracking (IST)
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Real-time traffic telemetry from Meta Ads, Social Media campaigns & Direct visitors
                </p>
              </div>
            </div>

            {/* Timeframe Filter & Export Button */}
            <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
              <div className="bg-slate-100 p-1 rounded-lg flex items-center text-xs">
                <button
                  onClick={() => setTimeframeFilter('7d')}
                  className={`px-2.5 py-1 rounded-md font-medium transition ${
                    timeframeFilter === '7d'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  7 Days
                </button>
                <button
                  onClick={() => setTimeframeFilter('30d')}
                  className={`px-2.5 py-1 rounded-md font-medium transition ${
                    timeframeFilter === '30d'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  30 Days
                </button>
                <button
                  onClick={() => setTimeframeFilter('all')}
                  className={`px-2.5 py-1 rounded-md font-medium transition ${
                    timeframeFilter === 'all'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Time
                </button>
              </div>

              <a
                href="/api/admin/export-visitors"
                download
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium rounded-lg shadow-xs transition"
              >
                <Download className="w-3.5 h-3.5 text-indigo-300" />
                Export CSV
              </a>

              <button
                onClick={() => setShowDetailedAnalytics(!showDetailedAnalytics)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
                title={showDetailedAnalytics ? 'Collapse Details' : 'Expand Details'}
              >
                {showDetailedAnalytics ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 6 Compact Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-5">
            {/* 1. Total Visits */}
            <div className="bg-slate-50 hover:bg-indigo-50/40 p-3.5 rounded-xl border border-slate-200/70 transition">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[11px] font-medium uppercase tracking-wider">Total Visits</span>
                <Globe className="w-3.5 h-3.5 text-indigo-500" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900">{analytics.totalVisits}</div>
              <p className="text-[10px] text-slate-400 mt-0.5">Lifetime pageviews</p>
            </div>

            {/* 2. Today's Visits */}
            <div className="bg-slate-50 hover:bg-blue-50/40 p-3.5 rounded-xl border border-slate-200/70 transition">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[11px] font-medium uppercase tracking-wider">Today</span>
                <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-blue-600">{analytics.todayVisits}</div>
              <p className="text-[10px] text-slate-400 mt-0.5">IST Calendar Day</p>
            </div>

            {/* 3. Yesterday's Visits */}
            <div className="bg-slate-50 hover:bg-slate-100/70 p-3.5 rounded-xl border border-slate-200/70 transition">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[11px] font-medium uppercase tracking-wider">Yesterday</span>
                <Clock className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-slate-700">{analytics.yesterdayVisits}</div>
              <p className="text-[10px] text-slate-400 mt-0.5">Previous 24h</p>
            </div>

            {/* 4. Unique Visitors */}
            <div className="bg-slate-50 hover:bg-emerald-50/40 p-3.5 rounded-xl border border-slate-200/70 transition">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[11px] font-medium uppercase tracking-wider">Unique Reach</span>
                <Users className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-emerald-600">{analytics.uniqueVisitors}</div>
              <p className="text-[10px] text-slate-400 mt-0.5">Distinct devices</p>
            </div>

            {/* 5. Last 7 Days */}
            <div className="bg-slate-50 hover:bg-amber-50/40 p-3.5 rounded-xl border border-slate-200/70 transition">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[11px] font-medium uppercase tracking-wider">Last 7 Days</span>
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-amber-600">{analytics.last7DaysVisits}</div>
              <p className="text-[10px] text-slate-400 mt-0.5">Weekly volume</p>
            </div>

            {/* 6. This Month */}
            <div className="bg-slate-50 hover:bg-purple-50/40 p-3.5 rounded-xl border border-slate-200/70 transition">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[11px] font-medium uppercase tracking-wider">This Month</span>
                <BarChart3 className="w-3.5 h-3.5 text-purple-500" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-purple-600">{analytics.thisMonthVisits}</div>
              <p className="text-[10px] text-slate-400 mt-0.5">Current month</p>
            </div>
          </div>

          {/* Detailed Analytics (Chart, Devices, Sources & Daily Breakdown) */}
          {showDetailedAnalytics && (
            <div className="mt-6 pt-6 border-t border-slate-100 space-y-6">
              {/* Top row: Visual Chart (Left 2/3) + Devices & Sources (Right 1/3) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Visual Bar Chart */}
                <div className="lg:col-span-2 bg-slate-50/70 p-4 rounded-xl border border-slate-200/80">
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-indigo-600" />
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Daily Traffic Trend ({timeframeFilter === '7d' ? 'Last 7 Days' : timeframeFilter === '30d' ? 'Last 30 Days' : 'All Recorded Days'})
                      </h3>
                    </div>
                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="flex items-center gap-1.5 text-slate-600">
                        <span className="w-2.5 h-2.5 rounded-xs bg-indigo-600"></span>
                        Total Visits
                      </span>
                      <span className="flex items-center gap-1.5 text-slate-600">
                        <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500"></span>
                        Unique Visitors
                      </span>
                    </div>
                  </div>

                  {/* Chart Bars */}
                  {filteredDaily.length === 0 ? (
                    <div className="h-44 flex items-center justify-center text-xs text-slate-400 italic">
                      No traffic recorded in this timeframe yet.
                    </div>
                  ) : (
                    <div className="h-44 flex items-end gap-2 pt-6 pb-2 px-2 overflow-x-auto">
                      {filteredDaily.map((d, idx) => {
                        const maxVal = Math.max(...filteredDaily.map(item => item.totalVisits), 5);
                        const totalPct = Math.max(Math.round((d.totalVisits / maxVal) * 100), 6);
                        const uniquePct = Math.max(Math.round((d.uniqueVisitors / maxVal) * 100), 6);

                        return (
                          <div key={idx} className="flex-1 min-w-[28px] max-w-[50px] flex flex-col items-center h-full justify-end group">
                            {/* Bar container */}
                            <div className="w-full flex items-end justify-center gap-1 h-32 relative">
                              {/* Hover Tooltip */}
                              <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition pointer-events-none bg-slate-900 text-white text-[10px] py-1 px-2 rounded-md whitespace-nowrap z-20 shadow-md">
                                {d.fullDate}: {d.totalVisits} visits ({d.uniqueVisitors} unique)
                              </div>

                              {/* Total Bar */}
                              <div
                                style={{ height: `${totalPct}%` }}
                                className="w-1/2 bg-indigo-600 rounded-t-sm transition-all group-hover:bg-indigo-500"
                              ></div>
                              {/* Unique Bar */}
                              <div
                                style={{ height: `${uniquePct}%` }}
                                className="w-1/2 bg-emerald-500 rounded-t-sm transition-all group-hover:bg-emerald-400"
                              ></div>
                            </div>
                            {/* X-axis label */}
                            <span className="text-[10px] text-slate-500 mt-2 truncate w-full text-center">
                              {d.date}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Devices & Referrer Breakdown */}
                <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-blue-600" />
                      Device Breakdown
                    </h3>
                    <div className="space-y-2 mb-4">
                      {/* Mobile */}
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="flex items-center gap-1 text-slate-600 font-medium">
                            <Smartphone className="w-3.5 h-3.5 text-blue-500" /> Mobile
                          </span>
                          <span className="font-semibold text-slate-800">
                            {analytics.devices?.mobile || 0} ({totalDevCount > 0 ? Math.round(((analytics.devices?.mobile || 0) / totalDevCount) * 100) : 0}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${totalDevCount > 0 ? ((analytics.devices?.mobile || 0) / totalDevCount) * 100 : 0}%` }}
                            className="bg-blue-500 h-full rounded-full"
                          ></div>
                        </div>
                      </div>

                      {/* Desktop */}
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="flex items-center gap-1 text-slate-600 font-medium">
                            <Monitor className="w-3.5 h-3.5 text-indigo-500" /> Desktop
                          </span>
                          <span className="font-semibold text-slate-800">
                            {analytics.devices?.desktop || 0} ({totalDevCount > 0 ? Math.round(((analytics.devices?.desktop || 0) / totalDevCount) * 100) : 0}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${totalDevCount > 0 ? ((analytics.devices?.desktop || 0) / totalDevCount) * 100 : 0}%` }}
                            className="bg-indigo-500 h-full rounded-full"
                          ></div>
                        </div>
                      </div>

                      {/* Tablet */}
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="flex items-center gap-1 text-slate-600 font-medium">
                            <Tablet className="w-3.5 h-3.5 text-amber-500" /> Tablet
                          </span>
                          <span className="font-semibold text-slate-800">
                            {analytics.devices?.tablet || 0} ({totalDevCount > 0 ? Math.round(((analytics.devices?.tablet || 0) / totalDevCount) * 100) : 0}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${totalDevCount > 0 ? ((analytics.devices?.tablet || 0) / totalDevCount) * 100 : 0}%` }}
                            className="bg-amber-500 h-full rounded-full"
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Sources */}
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 pt-2 border-t border-slate-200/60 flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-emerald-600" />
                      Top Campaign Sources
                    </h3>
                    <div className="space-y-1.5">
                      {(!analytics.sources || analytics.sources.length === 0) ? (
                        <p className="text-[11px] text-slate-400 italic">No campaign source data yet</p>
                      ) : (
                        analytics.sources.slice(0, 4).map((s, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs py-0.5">
                            <span className="text-slate-600 truncate max-w-[150px]">{s.source}</span>
                            <span className="font-semibold bg-white border border-slate-200 px-1.5 py-0.5 rounded-md text-slate-700 text-[11px]">
                              {s.count}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Table: Daily Breakdown */}
              <div className="bg-slate-50/70 rounded-xl border border-slate-200/80 overflow-hidden">
                <div className="p-3.5 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Daily Visitor Log & Performance Matrix
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Showing {filteredDaily.length} calendar days
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-4">Date (IST)</th>
                        <th className="py-2.5 px-4">Total Visits</th>
                        <th className="py-2.5 px-4">Unique Visitors</th>
                        <th className="py-2.5 px-4">Mobile</th>
                        <th className="py-2.5 px-4">Desktop</th>
                        <th className="py-2.5 px-4">Tablet</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredDaily.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-4 text-center text-slate-400 italic">
                            No daily records found.
                          </td>
                        </tr>
                      ) : (
                        filteredDaily.slice().reverse().map((row, idx) => (
                          <tr key={idx} className="hover:bg-white/80 transition">
                            <td className="py-2 px-4 font-medium text-slate-800">{row.fullDate} ({row.date})</td>
                            <td className="py-2 px-4 font-bold text-indigo-600">{row.totalVisits}</td>
                            <td className="py-2 px-4 font-semibold text-emerald-600">{row.uniqueVisitors}</td>
                            <td className="py-2 px-4 text-slate-600">{row.mobile}</td>
                            <td className="py-2 px-4 text-slate-600">{row.desktop}</td>
                            <td className="py-2 px-4 text-slate-600">{row.tablet}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* 2. REGISTRATIONS & LEADS SECTION (ORIGINAL PORTAL)        */}
        {/* ======================================================== */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Devotee Applications & Payment Management
            </h2>
            <p className="text-xs text-slate-500">
              Direct verification of registrations, donations, and UTR transaction references
            </p>
          </div>
        </div>
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
