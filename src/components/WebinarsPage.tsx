import React, { useState, useEffect } from 'react';
import { Settings, Sparkles, Filter } from 'lucide-react';
import { Webinar } from '../types';
import { getWebinars, WEBINAR_UPDATE_EVENT } from '../services/webinarStorage';
import { WebinarCard } from './webinars/WebinarCard';
import { WebinarDetailsModal } from './webinars/WebinarDetailsModal';
import { WebinarRegisterModal } from './webinars/WebinarRegisterModal';
import { ManageWebinarsModal } from './webinars/ManageWebinarsModal';

type FilterType = 'all' | 'free' | 'paid';

export const WebinarsPage: React.FC = () => {
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');

  // Modals state
  const [selectedWebinarForDetails, setSelectedWebinarForDetails] = useState<Webinar | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const [selectedWebinarForRegister, setSelectedWebinarForRegister] = useState<Webinar | null>(null);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  const [manageModalOpen, setManageModalOpen] = useState(false);

  const loadWebinars = () => {
    const all = getWebinars();
    setWebinars(all);
  };

  useEffect(() => {
    loadWebinars();

    const handleUpdate = () => {
      loadWebinars();
    };

    window.addEventListener(WEBINAR_UPDATE_EVENT, handleUpdate);
    return () => {
      window.removeEventListener(WEBINAR_UPDATE_EVENT, handleUpdate);
    };
  }, []);

  // Filter public view: only show published/upcoming (or all non-draft for public view)
  // If in admin mode, drafts can be seen in Manage Webinars.
  const publicWebinars = webinars.filter(
    (w) => w.status === 'published' || w.status === 'upcoming'
  );

  const filteredWebinars = publicWebinars.filter((w) => {
    if (filter === 'free') return w.type === 'free';
    if (filter === 'paid') return w.type === 'paid';
    return true;
  });

  const handleOpenDetails = (webinar: Webinar) => {
    setSelectedWebinarForDetails(webinar);
    setDetailsModalOpen(true);
  };

  const handleOpenRegister = (webinar: Webinar) => {
    setSelectedWebinarForRegister(webinar);
    setRegisterModalOpen(true);
  };

  return (
    <div id="webinars-page-root" className="min-h-screen bg-[#F8FAFC] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header section with badge & admin button */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-8 border-b border-[#E5E7EB]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3.5 py-1 text-xs font-bold text-[#FF6B00] mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>LIVE INDUSTRY SESSIONS</span>
            </div>

            <h1
              id="webinars-main-heading"
              className="text-3xl sm:text-4xl font-extrabold text-[#072B57] tracking-tight"
            >
              Upcoming Webinars
            </h1>

            <p
              id="webinars-subtitle"
              className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed"
            >
              Learn from industry experts through live, practical and career-focused sessions.
            </p>
          </div>

          {/* Quick Admin / Management Access Button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              id="btn-open-manage-webinars-page"
              onClick={() => setManageModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-[#072B57] hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
            >
              <Settings className="h-4 w-4 text-[#FF6B00]" />
              <span>Manage Webinars</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 p-1 bg-white border border-[#E5E7EB] rounded-2xl shadow-2xs">
            <button
              type="button"
              id="filter-all"
              onClick={() => setFilter('all')}
              className={`rounded-xl px-5 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-[#072B57] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#072B57] hover:bg-slate-50'
              }`}
            >
              All ({publicWebinars.length})
            </button>

            <button
              type="button"
              id="filter-free"
              onClick={() => setFilter('free')}
              className={`rounded-xl px-5 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                filter === 'free'
                  ? 'bg-[#072B57] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#072B57] hover:bg-slate-50'
              }`}
            >
              Free ({publicWebinars.filter((w) => w.type === 'free').length})
            </button>

            <button
              type="button"
              id="filter-paid"
              onClick={() => setFilter('paid')}
              className={`rounded-xl px-5 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                filter === 'paid'
                  ? 'bg-[#072B57] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#072B57] hover:bg-slate-50'
              }`}
            >
              Paid ({publicWebinars.filter((w) => w.type === 'paid').length})
            </button>
          </div>

          <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <span>
              Showing {filteredWebinars.length} {filteredWebinars.length === 1 ? 'webinar' : 'webinars'}
            </span>
          </div>
        </div>

        {/* Webinars Grid: Desktop 3 cols, Tablet 2 cols, Mobile 1 col */}
        <div className="mt-8">
          {filteredWebinars.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#E5E7EB] bg-white p-12 text-center">
              <p className="text-sm font-semibold text-slate-600">
                No webinars found for this filter.
              </p>
              <button
                type="button"
                onClick={() => setFilter('all')}
                className="mt-3 text-xs font-bold text-[#FF6B00] hover:underline cursor-pointer"
              >
                View all webinars &rarr;
              </button>
            </div>
          ) : (
            <div
              id="webinars-grid"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {filteredWebinars.map((webinar) => (
                <WebinarCard
                  key={webinar.id}
                  webinar={webinar}
                  onSelect={handleOpenDetails}
                  onRegister={handleOpenRegister}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      <WebinarDetailsModal
        webinar={selectedWebinarForDetails}
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        onRegister={handleOpenRegister}
      />

      {/* Register Modal */}
      <WebinarRegisterModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        selectedWebinar={selectedWebinarForRegister}
        availableWebinars={publicWebinars}
      />

      {/* Manage Webinars Modal */}
      <ManageWebinarsModal
        isOpen={manageModalOpen}
        onClose={() => setManageModalOpen(false)}
        onWebinarsUpdated={loadWebinars}
      />
    </div>
  );
};
