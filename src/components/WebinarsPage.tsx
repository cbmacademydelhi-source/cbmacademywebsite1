import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { Webinar } from '../types';
import { getWebinars, WEBINAR_UPDATE_EVENT } from '../services/webinarStorage';
import { FeaturedWebinarCard } from './webinars/FeaturedWebinarCard';
import { SecondaryWebinarCard } from './webinars/SecondaryWebinarCard';
import { CompactWebinarCard } from './webinars/CompactWebinarCard';
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

  // Filter public view: only show published/upcoming
  const publicWebinars = webinars.filter(
    (w) => w.status === 'published' || w.status === 'upcoming'
  );

  const filteredWebinars = publicWebinars.filter((w) => {
    if (filter === 'free') return w.type === 'free';
    if (filter === 'paid') return w.type === 'paid';
    return true;
  });

  // Editorial hierarchy breakdown for Version 2:
  // 1. Featured Webinar (first item)
  // 2. Secondary Webinars (next 2 items)
  // 3. Remaining Webinars (items 3+)
  const featuredWebinar = filteredWebinars[0] || null;
  const secondaryWebinars = filteredWebinars.slice(1, 3);
  const remainingWebinars = filteredWebinars.slice(3);

  const handleOpenDetails = (webinar: Webinar) => {
    setSelectedWebinarForDetails(webinar);
    setDetailsModalOpen(true);
  };

  const handleOpenRegister = (webinar: Webinar) => {
    setSelectedWebinarForRegister(webinar);
    setRegisterModalOpen(true);
  };

  return (
    <div
      id="webinars-page-root"
      className="min-h-screen bg-[#F8FAFC] pt-8 sm:pt-12 pb-28 sm:pb-36"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Top bar with Admin Quick Access */}
        <div className="flex justify-end mb-2.5 sm:mb-3">
          <button
            type="button"
            id="btn-open-manage-webinars-page"
            onClick={() => setManageModalOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#072B57] transition-colors cursor-pointer"
          >
            <Settings className="h-3.5 w-3.5 text-[#FF6B00]" />
            <span>Manage Webinars</span>
          </button>
        </div>

        {/* 1. HERO / INTRO: Left-aligned, balanced 60–70px total spacing */}
        <div className="max-w-3xl">
          {/* Small orange label */}
          <div className="text-xs font-extrabold text-[#FF6B00] tracking-wider uppercase mb-1.5">
            CBM ACADEMY EVENTS
          </div>

          {/* Main heading */}
          <h1
            id="webinars-main-heading"
            className="text-3xl sm:text-4xl lg:text-[40px] font-black text-[#072B57] tracking-tight leading-tight"
          >
            Learn. Connect. Grow.
          </h1>

          {/* Supporting text */}
          <p
            id="webinars-subtitle"
            className="mt-2.5 text-sm sm:text-base text-[#1E293B]/80 leading-relaxed max-w-2xl"
          >
            Join live sessions led by experienced professionals and discover practical strategies for digital marketing, AI and career growth.
          </p>

          {/* Compact and Elegant Functional Filters: [ All ] [ Free ] [ Paid ] */}
          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              id="filter-all"
              onClick={() => setFilter('all')}
              className={`rounded-[8px] px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-[#072B57] text-white border border-[#072B57] shadow-xs'
                  : 'bg-white text-[#072B57] border border-[#E5E7EB] hover:border-[#072B57]/40'
              }`}
            >
              All ({publicWebinars.length})
            </button>

            <button
              type="button"
              id="filter-free"
              onClick={() => setFilter('free')}
              className={`rounded-[8px] px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                filter === 'free'
                  ? 'bg-[#072B57] text-white border border-[#072B57] shadow-xs'
                  : 'bg-white text-[#072B57] border border-[#E5E7EB] hover:border-[#072B57]/40'
              }`}
            >
              Free ({publicWebinars.filter((w) => w.type === 'free').length})
            </button>

            <button
              type="button"
              id="filter-paid"
              onClick={() => setFilter('paid')}
              className={`rounded-[8px] px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                filter === 'paid'
                  ? 'bg-[#072B57] text-white border border-[#072B57] shadow-xs'
                  : 'bg-white text-[#072B57] border border-[#E5E7EB] hover:border-[#072B57]/40'
              }`}
            >
              Paid ({publicWebinars.filter((w) => w.type === 'paid').length})
            </button>
          </div>
        </div>

        {/* Empty State */}
        {filteredWebinars.length === 0 ? (
          <div className="mt-8 rounded-[16px] border border-dashed border-[#E5E7EB] bg-white p-12 text-center max-w-md mx-auto">
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
          <div className="mt-6 sm:mt-7 space-y-6 sm:space-y-7">
            {/* 2. ONE LARGE FEATURED WEBINAR */}
            {featuredWebinar && (
              <section id="featured-webinar-section">
                <FeaturedWebinarCard
                  webinar={featuredWebinar}
                  onSelect={handleOpenDetails}
                  onRegister={handleOpenRegister}
                />
              </section>
            )}

            {/* 3. TWO SECONDARY WEBINARS (Horizontal row of 2 cards with consistent 16:9 images) */}
            {secondaryWebinars.length > 0 && (
              <section id="secondary-webinars-section">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                  {secondaryWebinars.map((webinar) => (
                    <SecondaryWebinarCard
                      key={webinar.id}
                      webinar={webinar}
                      onSelect={handleOpenDetails}
                      onRegister={handleOpenRegister}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 4. MORE UPCOMING WEBINARS (Compact grid) */}
            {remainingWebinars.length > 0 && (
              <section
                id="remaining-webinars-section"
                className="pt-5 sm:pt-6 border-t border-[#E5E7EB]"
              >
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#072B57] tracking-tight">
                      More Upcoming Webinars
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      Expand your digital skill set with additional live sessions
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                  {remainingWebinars.map((webinar) => (
                    <CompactWebinarCard
                      key={webinar.id}
                      webinar={webinar}
                      onSelect={handleOpenDetails}
                      onRegister={handleOpenRegister}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
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



