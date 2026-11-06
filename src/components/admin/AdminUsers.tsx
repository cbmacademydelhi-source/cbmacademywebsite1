import React, { useState } from 'react';
import {
  ShieldCheck,
  UserCheck,
  Key,
  Lock,
  Mail,
  Calendar,
  AlertCircle,
  Plus,
  CheckCircle2,
} from 'lucide-react';
import { getAdminUser } from '../../services/adminService';

export const AdminUsers: React.FC = () => {
  const currentUser = getAdminUser();
  const [toast, setToast] = useState<string | null>(null);

  const adminAccounts = [
    {
      id: 'usr-1',
      name: 'CBM Academy Administrator',
      email: 'office@cbmacademy.in',
      role: 'Super Admin',
      status: 'Active',
      lastActive: 'Just now (Current session)',
      permissions: ['Manage Courses', 'Approve Jobs', 'Verify Certificates', 'View Enquiries', 'System Settings'],
    },
    {
      id: 'usr-2',
      name: 'Admissions & Counseling Lead',
      email: 'admissions@cbmacademy.in',
      role: 'Counselor / Admissions',
      status: 'Active',
      lastActive: '2 hours ago',
      permissions: ['Manage Applications', 'View Enquiries', 'Student Follow-ups'],
    },
    {
      id: 'usr-3',
      name: 'Editorial & Content Team',
      email: 'content@cbmacademy.in',
      role: 'Editor',
      status: 'Active',
      lastActive: 'Yesterday',
      permissions: ['Write Blogs', 'Draft Webinars', 'Review Articles'],
    },
  ];

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg shadow-lg text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#072B57]" />
            Administrator Roles & Access Control
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Authorized admin team members with access to the CBM Academy Admin Management Suite.
          </p>
        </div>
      </div>

      {/* Current Active Session Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#072B57] text-[#FF6B00] flex items-center justify-center font-bold text-lg shadow-sm">
            {(currentUser?.email || 'A')[0].toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">{currentUser?.email || 'office@cbmacademy.in'}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                Current Session
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Role: Super Admin • Authenticated via Supabase Auth & Secure Session Token
            </p>
          </div>
        </div>
        <div className="text-xs text-slate-500 flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-600" />
          <span>Encrypted Session Active</span>
        </div>
      </div>

      {/* Team Accounts Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm">Designated Administrative Personnel</h3>
          <span className="text-xs text-slate-500">{adminAccounts.length} Registered Accounts</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">User</th>
                <th className="px-6 py-3.5">Role</th>
                <th className="px-6 py-3.5">Assigned Permissions</th>
                <th className="px-6 py-3.5">Last Active</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {adminAccounts.map((adm) => (
                <tr key={adm.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{adm.name}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3" />
                      {adm.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-xs text-[#072B57] bg-slate-100 px-2.5 py-1 rounded">
                      {adm.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <div className="flex flex-wrap gap-1">
                      {adm.permissions.map((p, i) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px]">
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                    {adm.lastActive}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {adm.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
