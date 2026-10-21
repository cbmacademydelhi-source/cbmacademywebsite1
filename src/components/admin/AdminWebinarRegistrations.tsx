import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  RefreshCw,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  CreditCard,
  Users,
  DollarSign,
  Calendar,
  Database,
  Info,
  ExternalLink,
  Eye,
  X,
} from 'lucide-react';
import { WebinarRegistration } from '../../types';
import { fetchAdminRegistrations } from '../../services/webinarRegistrationService';

interface AdminWebinarRegistrationsProps {
  token: string;
}

export const AdminWebinarRegistrations: React.FC<AdminWebinarRegistrationsProps> = ({ token }) => {
  const [registrations, setRegistrations] = useState<WebinarRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedAttendee, setSelectedAttendee] = useState<WebinarRegistration | null>(null);
  const [configStatus, setConfigStatus] = useState<{
    supabaseConnected?: boolean;
    supabaseConfigured?: boolean;
    supabaseUrl?: string;
    supabaseError?: string | null;
    fallbackModeActive?: boolean;
  } | null>(null);
  const [showDbHelp, setShowDbHelp] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAdminRegistrations(token, {
        type: typeFilter === 'all' ? undefined : typeFilter,
        status: statusFilter === 'all' ? undefined : statusFilter,
      });
      setRegistrations(data);
    } catch (err: any) {
      console.error('Failed to load admin registrations:', err);
      setError(err?.message || 'Could not load registrations from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch('/api/webinars/config-status')
      .then((r) => r.json())
      .then((data) => setConfigStatus(data))
      .catch(() => null);
  }, []);

  useEffect(() => {
    loadData();
  }, [typeFilter, statusFilter, token]);

  const filtered = registrations.filter((reg) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const nameMatch = reg.full_name?.toLowerCase().includes(term);
    const emailMatch = reg.email?.toLowerCase().includes(term);
    const phoneMatch = reg.phone?.includes(term);
    const titleMatch = reg.webinar_title?.toLowerCase().includes(term);
    const payIdMatch = reg.razorpay_payment_id?.toLowerCase().includes(term);
    return nameMatch || emailMatch || phoneMatch || titleMatch || payIdMatch;
  });

  // Calculate metrics
  const totalCount = registrations.length;
  const paidCount = registrations.filter((r) => r.registration_type === 'paid' && r.payment_status === 'paid').length;
  const freeCount = registrations.filter((r) => r.registration_type === 'free').length;
  const totalRevenue = registrations
    .filter((r) => r.payment_status === 'paid')
    .reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  // CSV Export
  const exportToCSV = () => {
    if (filtered.length === 0) return;
    const headers = [
      'ID',
      'Name',
      'Email',
      'Phone',
      'Webinar',
      'Type',
      'Amount',
      'Payment Status',
      'Registration Status',
      'Payment ID',
      'Registration Date',
      'Payment Date',
    ];
    const rows = filtered.map((r) => [
      `"${r.id || ''}"`,
      `"${r.full_name || ''}"`,
      `"${r.email || ''}"`,
      `"${r.phone || ''}"`,
      `"${r.webinar_title || r.webinar_id || ''}"`,
      `"${r.registration_type || ''}"`,
      `"${r.amount || 0}"`,
      `"${r.payment_status || ''}"`,
      `"${r.registration_status || ''}"`,
      `"${r.razorpay_payment_id || ''}"`,
      `"${r.created_at || ''}"`,
      `"${r.paid_at || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cbm_webinar_registrations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Database Connection Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-xl ${
              configStatus?.supabaseConnected ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
            }`}
          >
            <Database className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800">
                {configStatus?.supabaseConnected ? 'Supabase Database: Live Connected' : 'Database: Local & Memory Fallback Engine'}
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  configStatus?.supabaseConnected
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {configStatus?.supabaseConnected ? 'Live' : 'Fallback Active'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {configStatus?.supabaseConnected
                ? 'Persistent PostgreSQL storage connected & syncing registrations in real-time.'
                : 'Registrations and attendance are currently managed with in-memory and local storage.'}
            </p>
          </div>
        </div>

        {!configStatus?.supabaseConnected && (
          <button
            onClick={() => setShowDbHelp(!showDbHelp)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Info className="h-3.5 w-3.5 text-slate-500" />
            {showDbHelp ? 'Hide Setup Guide' : 'How to Connect Supabase'}
          </button>
        )}
      </div>

      {showDbHelp && (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
          <h4 className="font-bold text-[#072B57]">3 Steps to Connect Your Supabase Database:</h4>
          <ol className="list-decimal list-inside space-y-1 text-slate-600">
            <li>
              Create a free project at{' '}
              <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-blue-600 underline font-medium">
                supabase.com
              </a>.
            </li>
            <li>
              Copy the complete SQL schema from{' '}
              <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-[11px]">
                supabase_schema.sql
              </code>{' '}
              (in the project root) and run it in the Supabase SQL Editor.
            </li>
            <li>
              Set the environment variables{' '}
              <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-[11px]">
                SUPABASE_URL
              </code>{' '}
              and{' '}
              <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-[11px]">
                SUPABASE_SERVICE_ROLE_KEY
              </code>{' '}
              (or <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-[11px]">SUPABASE_ANON_KEY</code>).
            </li>
          </ol>
        </div>
      )}

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Registered</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-[#072B57]">{totalCount}</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Paid Attendees</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CreditCard className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-600">{paidCount}</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Free Registrations</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-indigo-600">{freeCount}</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Revenue</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-[#FF6B00]">₹{totalRevenue.toLocaleString('en-IN')}</div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, phone, or webinar..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#072B57] outline-none focus:border-[#FF6B00] focus:bg-white"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadData}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={exportToCSV}
              disabled={filtered.length === 0}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#072B57] px-4 py-2 text-xs font-bold text-white hover:bg-[#0c3c78] disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1 text-slate-500 font-semibold">
            <Filter className="h-3.5 w-3.5" />
            <span>Type:</span>
          </div>

          <div className="flex items-center gap-1.5">
            {(['all', 'free', 'paid'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTypeFilter(t)}
                className={`rounded-lg px-3 py-1 font-bold capitalize transition-colors cursor-pointer ${
                  typeFilter === t
                    ? 'bg-[#072B57] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

          <div className="flex items-center gap-1 text-slate-500 font-semibold">
            <span>Payment Status:</span>
          </div>

          <div className="flex items-center gap-1.5">
            {[
              { id: 'all', label: 'All' },
              { id: 'paid', label: 'Successful (Paid)' },
              { id: 'not_required', label: 'Free (Not Required)' },
              { id: 'pending', label: 'Pending' },
              { id: 'failed', label: 'Failed' },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStatusFilter(s.id)}
                className={`rounded-lg px-3 py-1 font-bold transition-colors cursor-pointer ${
                  statusFilter === s.id
                    ? 'bg-[#FF6B00] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Registrations Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#072B57] text-white uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Name</th>
                <th className="px-5 py-3.5">Contact</th>
                <th className="px-5 py-3.5">Webinar</th>
                <th className="px-5 py-3.5">Type</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Payment Status</th>
                <th className="px-5 py-3.5">Registration Status</th>
                <th className="px-5 py-3.5">Registered At</th>
                <th className="px-5 py-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <div className="inline-flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin text-[#FF6B00]" />
                      <span>Loading registration records...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    No webinar registrations found matching your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((reg) => {
                  const isPaid = reg.registration_type === 'paid';
                  const dateFormatted = reg.created_at
                    ? new Date(reg.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'N/A';

                  const paidDateFormatted = reg.paid_at
                    ? new Date(reg.paid_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '—';

                  return (
                    <tr key={reg.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-[#072B57] whitespace-nowrap">
                        {reg.full_name}
                      </td>

                      <td className="px-5 py-3.5 whitespace-nowrap space-y-0.5">
                        <div className="font-medium text-slate-800">{reg.email}</div>
                        <div className="text-[11px] text-slate-400">{reg.phone}</div>
                      </td>

                      <td className="px-5 py-3.5 max-w-[220px] truncate" title={reg.webinar_title || reg.webinar_id}>
                        <span className="font-semibold text-slate-800">{reg.webinar_title || reg.webinar_id}</span>
                      </td>

                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${
                            isPaid
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {reg.registration_type}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 whitespace-nowrap font-bold text-slate-800">
                        {isPaid ? `₹${reg.amount}` : '₹0'}
                      </td>

                      <td className="px-5 py-3.5 whitespace-nowrap">
                        {reg.payment_status === 'paid' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="h-3 w-3" />
                            Paid
                          </span>
                        )}
                        {reg.payment_status === 'not_required' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-600 border border-slate-200">
                            Not Required
                          </span>
                        )}
                        {reg.payment_status === 'pending' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 border border-amber-200">
                            <Clock className="h-3 w-3" />
                            Pending
                          </span>
                        )}
                        {reg.payment_status === 'failed' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-bold text-red-700 border border-red-200">
                            <AlertCircle className="h-3 w-3" />
                            Failed
                          </span>
                        )}
                        {reg.payment_status === 'expired' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-600 border border-slate-300">
                            Expired
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-3.5 whitespace-nowrap">
                        {reg.registration_status === 'approved' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-800 border border-emerald-300">
                            Approved
                          </span>
                        )}
                        {(!reg.registration_status || reg.registration_status === 'pending') && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black uppercase text-amber-800 border border-amber-300">
                            Pending
                          </span>
                        )}
                        {reg.registration_status === 'cancelled' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-black uppercase text-red-800 border border-red-300">
                            Cancelled
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-3.5 whitespace-nowrap text-slate-500">
                        {dateFormatted}
                      </td>

                      <td className="px-5 py-3.5 whitespace-nowrap text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedAttendee(reg)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#072B57] hover:bg-[#FF6B00] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendee Details Modal */}
      {selectedAttendee && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
          onClick={() => setSelectedAttendee(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-[#072B57]">
                Webinar Registration Details
              </h3>
              <button
                type="button"
                onClick={() => setSelectedAttendee(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Webinar</span>
                  <span className="text-sm font-bold text-[#072B57]">{selectedAttendee.webinar_title || selectedAttendee.webinar_id}</span>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase ${
                    selectedAttendee.registration_type === 'paid'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {selectedAttendee.registration_type}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase block">Full Name</span>
                  <span className="text-sm font-bold text-slate-800">{selectedAttendee.full_name}</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase block">Email Address</span>
                  <a href={`mailto:${selectedAttendee.email}`} className="text-sm font-medium text-indigo-600 hover:underline">
                    {selectedAttendee.email}
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase block">Phone / WhatsApp</span>
                  <a href={`tel:${selectedAttendee.phone || selectedAttendee.whatsapp_number}`} className="text-sm font-medium text-slate-800">
                    {selectedAttendee.phone || selectedAttendee.whatsapp_number || 'N/A'}
                  </a>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase block">Submission Date</span>
                  <span className="text-xs text-slate-700">
                    {selectedAttendee.created_at
                      ? new Date(selectedAttendee.created_at).toLocaleString('en-IN')
                      : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Message / Question */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Message / Question from Attendee</span>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 leading-relaxed italic">
                  {selectedAttendee.message || selectedAttendee.learning_goal || 'No specific question provided.'}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Amount</span>
                  <span className="font-bold text-slate-800">₹{selectedAttendee.amount || 0}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Payment Status</span>
                  <span className="font-bold capitalize text-slate-800">{selectedAttendee.payment_status || 'not_required'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Reg Status</span>
                  <span className="font-bold capitalize text-slate-800">{selectedAttendee.registration_status || 'approved'}</span>
                </div>
              </div>

              {selectedAttendee.razorpay_payment_id && (
                <div className="pt-2">
                  <span className="text-[10px] text-slate-400 uppercase block">Payment Transaction ID</span>
                  <span className="font-mono text-xs text-slate-600">{selectedAttendee.razorpay_payment_id}</span>
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedAttendee(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
