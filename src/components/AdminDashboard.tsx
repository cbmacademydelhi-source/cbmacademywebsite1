import React, { useState, useEffect } from 'react';
import { AdminLogin } from './admin/AdminLogin';
import { AdminLayout, AdminTab } from './admin/AdminLayout';
import { getAdminToken, checkAdminSession } from '../services/adminService';
import { RefreshCw } from 'lucide-react';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(() => {
    const token = getAdminToken();
    return token ? true : false;
  });
  const [activeTab, setActiveTab] = useState<AdminTab>('webinars');

  const determineTabFromHash = (): AdminTab => {
    const rawHash = window.location.hash.toLowerCase().replace('#', '').trim();
    const rawPath = window.location.pathname.toLowerCase().replace(/^\/|\/$/g, '').trim();
    const candidate = rawHash.startsWith('admin') ? rawHash : (rawPath.startsWith('admin') ? rawPath : '');

    if (candidate.startsWith('admin/')) {
      const sub = candidate.replace('admin/', '') as any;
      if (sub === 'images') return 'images';
      if (sub === 'certificates') return 'certificates';
      return 'webinars';
    }
    return 'webinars';
  };

  useEffect(() => {
    const verifyAuth = async () => {
      const token = getAdminToken();
      if (!token) {
        setIsAuthenticated(false);
        return;
      }
      try {
        const valid = await checkAdminSession();
        setIsAuthenticated(valid);
      } catch {
        // If checking session fails due to transient connection, keep session if token exists
        setIsAuthenticated(true);
      }
    };

    verifyAuth();
    setActiveTab(determineTabFromHash());

    const handleHashChange = () => {
      setActiveTab(determineTabFromHash());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center font-['Plus_Jakarta_Sans',sans-serif]">
        <RefreshCw className="w-8 h-8 text-[#FF6B00] animate-spin mb-3" />
        <p className="text-sm font-semibold text-[#072B57]">Verifying CBM Admin Authorization...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AdminLogin
        onLoginSuccess={() => {
          setIsAuthenticated(true);
        }}
        onSuccess={() => {
          setIsAuthenticated(true);
        }}
        onNavigateHome={() => {
          window.location.hash = '';
          window.location.pathname = '/';
        }}
        onBackToHome={() => {
          window.location.hash = '';
          window.location.pathname = '/';
        }}
      />
    );
  }

  return (
    <AdminLayout
      initialTab={activeTab}
      onLogout={() => {
        setIsAuthenticated(false);
        window.location.hash = 'admin/login';
      }}
      onNavigateHome={() => {
        window.location.hash = '';
        window.location.pathname = '/';
      }}
    />
  );
}
