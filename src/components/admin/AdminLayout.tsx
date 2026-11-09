import React, { useState, useEffect, useCallback } from 'react';
import {
  Video,
  Image as ImageIcon,
  Award,
  LogOut,
  ExternalLink,
  Menu,
  X,
  RefreshCw,
  Database,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import {
  AdminCertificate,
  fetchAdminCertificates,
  getAdminUser,
  logoutAdmin,
  lastAdminApiError,
} from '../../services/adminService';
import { useScrollLock } from '../../utils/useScrollLock';

import { AdminWebinars } from './AdminWebinars';
import { AdminImages } from './AdminImages';
import { AdminCertificates } from './AdminCertificates';

export type AdminTab = 'webinars' | 'images' | 'certificates';

interface AdminLayoutProps {
  onLogout: () => void;
  onNavigateHome: () => void;
  initialTab?: AdminTab;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  onLogout,
  onNavigateHome,
  initialTab = 'webinars',
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  // Prevent background page from scrolling when mobile sidebar drawer is open
  useScrollLock(mobileMenuOpen);

  const [certificates, setCertificates] = useState<AdminCertificate[]>(() => {
    try {
      const raw = localStorage.getItem('cbm_admin_cached_certificates');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState<boolean>(false);

  const user = getAdminUser();

  const loadAllData = useCallback(async () => {
    setRefreshing(true);
    setDbError(null);

    try {
      const certsRes = await fetchAdminCertificates();
      if (Array.isArray(certsRes)) {
        setCertificates(certsRes);
        try {
          localStorage.setItem('cbm_admin_cached_certificates', JSON.stringify(certsRes));
        } catch {}
      }

      if (lastAdminApiError) {
        setDbError(lastAdminApiError);
      }
    } catch (err: any) {
      setDbError(err?.message || 'Error communicating with database');
      console.warn('[Admin] Data loading notice:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Keep hash synced with tab
  useEffect(() => {
    window.location.hash = `admin/${activeTab}`;
  }, [activeTab]);

  const handleLogout = async () => {
    await logoutAdmin();
    onLogout();
  };

  const navItems: {
    id: AdminTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number | string;
    badgeColor?: string;
  }[] = [
    {
      id: 'webinars',
      label: 'Webinars & Sessions',
      icon: Video,
    },
    {
      id: 'images',
      label: 'Website & Banner Images',
      icon: ImageIcon,
    },
    {
      id: 'certificates',
      label: 'Certificates Registry',
      icon: Award,
      badge: certificates.length > 0 ? certificates.length : undefined,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col antialiased text-[#1E293B] font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Mobile Bar */}
      <div className="lg:hidden bg-[#072B57] text-white px-4 py-3 flex items-center justify-between border-b border-[#0A3D78] sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-black text-sm text-[#FF6B00]">
            CBM
          </div>
          <div>
            <span className="font-bold text-sm tracking-wide block">CBM ACADEMY</span>
            <span className="text-[10px] text-orange-300 font-semibold uppercase tracking-wider block">
              Admin Portal
            </span>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#072B57] text-white flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Brand Header */}
          <div className="p-5 border-b border-[#0D386E] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center font-black text-base text-[#FF6B00] shadow-inner">
                CBM
              </div>
              <div>
                <h1 className="font-extrabold text-sm tracking-wider text-white">CBM ACADEMY</h1>
                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest block mt-0.5">
                  Admin Panel
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-200/60">
              Management Suite
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-[#FF6B00] text-white shadow-sm'
                      : 'text-slate-300 hover:bg-[#0D386E] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        item.badgeColor || 'bg-white/20 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Actions & Logout */}
          <div className="p-3 border-t border-[#0D386E] space-y-1">
            <button
              onClick={onNavigateHome}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-[#0D386E] hover:text-white transition cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-slate-400" />
                <span>View Public Site</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Backdrop for Mobile */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/60 z-30 lg:hidden backdrop-blur-xs"
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Header Bar */}
          <header className="bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                Admin Panel /
              </span>
              <h2 className="text-base font-bold text-slate-900 capitalize">
                {activeTab === 'webinars' && 'Webinars & Masterclasses'}
                {activeTab === 'images' && 'Website & Banner Images'}
                {activeTab === 'certificates' && 'Certificates Registry'}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {/* Database Status Indicator */}
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span>Supabase Connected</span>
              </div>

              {/* Refresh button */}
              <button
                onClick={loadAllData}
                disabled={refreshing}
                title="Refresh Database Data"
                className="p-2 text-slate-500 hover:text-[#072B57] hover:bg-slate-100 rounded-lg transition cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-[#FF6B00]' : ''}`} />
              </button>

              {/* Admin Profile Chip */}
              <div className="hidden md:flex items-center gap-2.5 pl-3 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-[#072B57] text-[#FF6B00] flex items-center justify-center font-bold text-xs shadow-inner">
                  {(user?.email || 'A')[0].toUpperCase()}
                </div>
                <div className="text-left text-xs">
                  <div className="font-semibold text-slate-900 leading-tight">
                    {user?.email || 'office@cbmacademy.in'}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">Administrator</div>
                </div>
              </div>
            </div>
          </header>

          {/* View Container */}
          <div className="p-6 max-w-7xl w-full mx-auto">
            {dbError && (
              <div className="mb-5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start justify-between gap-3 shadow-xs">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">Database Status</div>
                    <div className="text-slate-600 mt-0.5">{dbError}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDbError(null)}
                  className="text-slate-400 hover:text-slate-700 text-xs font-bold px-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center">
                <RefreshCw className="w-8 h-8 text-[#FF6B00] animate-spin mb-3" />
                <p className="text-sm font-semibold text-slate-600">Connecting to Database...</p>
              </div>
            ) : (
              <>
                {activeTab === 'webinars' && <AdminWebinars />}

                {activeTab === 'images' && <AdminImages onRefresh={loadAllData} />}

                {activeTab === 'certificates' && (
                  <AdminCertificates certificates={certificates} onRefresh={loadAllData} />
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
