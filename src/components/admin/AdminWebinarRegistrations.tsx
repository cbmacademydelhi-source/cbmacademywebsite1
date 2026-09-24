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
                <th className="px-5 py-3.5">Payment ID</th>
                <th className="px-5 py-3.5">Registered At</th>
                <th className="px-5 py-3.5">Paid At</th>
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

                      <td className="px-5 py-3.5 whitespace-nowrap font-mono text-[11px] text-slate-500">
                        {reg.razorpay_payment_id || '—'}
                      </td>

                      <td className="px-5 py-3.5 whitespace-nowrap text-slate-500">
                        {dateFormatted}
                      </td>

                      <td className="px-5 py-3.5 whitespace-nowrap text-slate-500">
                        {paidDateFormatted}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
