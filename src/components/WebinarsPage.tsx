import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Search,
  X,
  ArrowRight,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';
import { Webinar } from '../types';
import { getWebinars, fetchWebinarsFromDb, WEBINAR_UPDATE_EVENT } from '../services/webinarStorage';
import { WebinarDetailsModal } from './webinars/WebinarDetailsModal';
import { WebinarRegisterModal } from './webinars/WebinarRegisterModal';
import { ManageWebinarsModal } from './webinars/ManageWebinarsModal';

interface WebinarsPageProps {
  onOpenApply?: (courseOrNote?: string) => void;
  onOpenBrochure?: () => void;
}

type FilterType = 'all' | 'free' | 'paid';

export const WebinarsPage: React.FC<WebinarsPageProps> = ({
  onOpenApply,
}) => {
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllWebinars, setShowAllWebinars] = useState(false);

  // Modals state
  const [selectedWebinarForDetails, setSelectedWebinarForDetails] = useState<Webinar | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const [selectedWebinarForRegister, setSelectedWebinarForRegister] = useState<Webinar | null>(null);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  const [manageModalOpen, setManageModalOpen] = useState(false);

  // Dynamic SEO metadata
  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'Webinars & Live Masterclasses | CBM Academy';

    const metaDescription = document.querySelector('meta[name="description"]');
    const prevDescription = metaDescription?.getAttribute('content') || '';
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Live sessions on digital marketing, AI tools and career growth from CBM Academy instructors. Free and specialist practical masterclasses.'
      );
    }

    return () => {
      document.title = prevTitle;
      if (metaDescription && prevDescription) {
        metaDescription.setAttribute('content', prevDescription);
      }
    };
  }, []);

  const loadWebinars = () => {
    const all = getWebinars();
    setWebinars(all);
  };

  useEffect(() => {
    loadWebinars();

    // Fetch live webinars from database
    fetchWebinarsFromDb().then((fresh) => {
      if (fresh && fresh.length > 0) {
        setWebinars(fresh);
      }
    });

    const handleUpdate = () => {
      loadWebinars();
    };

    window.addEventListener(WEBINAR_UPDATE_EVENT, handleUpdate);
    return () => {
      window.removeEventListener(WEBINAR_UPDATE_EVENT, handleUpdate);
    };
  }, []);

  // Filter public view: only show published/upcoming
  const publicWebinars = useMemo(() => {
    return webinars.filter(
      (w) => w.status === 'published' || w.status === 'upcoming'
    );
  }, [webinars]);

  const freeCount = useMemo(() => {
    return publicWebinars.filter((w) => w.type === 'free').length;
  }, [publicWebinars]);

  const paidCount = useMemo(() => {
    return publicWebinars.filter((w) => w.type === 'paid').length;
  }, [publicWebinars]);

  const totalCount = publicWebinars.length;

  const filteredWebinars = useMemo(() => {
    return publicWebinars.filter((w) => {
      // Category filter
      if (filter === 'free' && w.type !== 'free') return false;
      if (filter === 'paid' && w.type !== 'paid') return false;

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = w.title.toLowerCase().includes(q);
        const matchDesc = w.description.toLowerCase().includes(q);
        const matchHost = (w.host || '').toLowerCase().includes(q);
        const matchTopics = w.whatYouWillLearn?.some((topic) =>
          topic.toLowerCase().includes(q)
        );
        if (!matchTitle && !matchDesc && !matchHost && !matchTopics) {
          return false;
        }
      }

      return true;
    });
  }, [publicWebinars, filter, searchQuery]);

  // Display six by default, or all if showAllWebinars or search/filter active
  const displayedWebinars = useMemo(() => {
    if (showAllWebinars || searchQuery.trim() || filter !== 'all') {
      return filteredWebinars;
    }
    return filteredWebinars.slice(0, 6);
  }, [filteredWebinars, showAllWebinars, searchQuery, filter]);

  const handleOpenDetails = (webinar: Webinar) => {
    setSelectedWebinarForDetails(webinar);
    setDetailsModalOpen(true);
  };

  const handleOpenRegister = (webinar: Webinar) => {
    setSelectedWebinarForRegister(webinar);
    setRegisterModalOpen(true);
  };

  const latestWebinar = publicWebinars[0] || null;

  return (
    <div
      id="webinars-page-root"
      className="min-h-screen bg-white text-[#072B57] font-['Plus_Jakarta_Sans',system-ui,sans-serif] selection:bg-[#FF6B00]/20 selection:text-[#072B57]"
    >
      {/* Centered Desktop Container (Full-width responsive up to 1400px canvas) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">

        {/* =========================================================
            2. HERO SECTION (Compact, two-sided, short height)
            ========================================================= */}
        <section
          id="webinars-hero"
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center pb-6 border-b border-gray-200"
        >
          {/* Left Side: Breadcrumb, Compact Heading, Supporting Text */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-500 mb-2 sm:mb-3">
              <a
                href="#home"
                className="hover:text-[#FF6B00] transition-colors font-medium"
              >
                Home
              </a>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 stroke-[1.5]" />
              <span className="text-[#FF6B00] font-bold">Webinars</span>
            </nav>

            {/* Compact bold heading matching CBM website theme */}
            <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-[#072B57] tracking-tight leading-[1.2]">
              Learn something new.
              <br />
              <span className="text-[#FF6B00]">Take your next step.</span>
            </h1>

            {/* Supporting text */}
            <p className="mt-2 sm:mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md">
              Live sessions on digital marketing, AI tools and career growth.
            </p>
          </div>

          {/* Right Side: Upcoming or Latest Webinar Card */}
          <div className="lg:col-span-6">
            {latestWebinar && (
              <div className="relative rounded-xl border border-gray-200/90 bg-white shadow-xs hover:border-[#FED7AA] hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col sm:flex-row group">
                {/* Thumbnail */}
                <div
                  className="sm:w-5/12 relative aspect-[16/10] sm:aspect-auto overflow-hidden bg-gray-100 shrink-0 cursor-pointer"
                  onClick={() => handleOpenDetails(latestWebinar)}
                >
                  <img
                    src={latestWebinar.posterUrl}
                    alt={latestWebinar.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    loading="eager"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    {latestWebinar.type === 'free' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
                        FREE
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-orange-50 text-[#FF6B00] border border-orange-200 shadow-xs">
                        PAID
                      </span>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="sm:w-7/12 p-3.5 sm:p-4 flex flex-col justify-between">
                  <div>
                    {/* Header with live indicator */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-extrabold text-[#FF6B00] uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-pulse" />
                        Upcoming Webinar
                      </span>
                      <span className="text-[10px] font-semibold text-gray-400">
                        {latestWebinar.duration}
                      </span>
                    </div>

                    <h3
                      onClick={() => handleOpenDetails(latestWebinar)}
                      className="text-xs sm:text-sm font-bold text-[#072B57] leading-snug line-clamp-2 hover:text-[#FF6B00] transition-colors cursor-pointer"
                      title={latestWebinar.title}
                    >
                      {latestWebinar.title}
                    </h3>

                    <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-2">
                      <Calendar className="w-3 h-3 text-gray-400 shrink-0 stroke-[1.75]" />
                      <span className="truncate">{latestWebinar.date} • {latestWebinar.time}</span>
                    </div>
                  </div>

                  {/* Footer actions */}
                  <div className="flex items-center justify-between gap-2 pt-2.5 mt-2 border-t border-gray-100">
                    <div>
                      {latestWebinar.type === 'free' ? (
                        <span className="text-[11px] sm:text-xs font-bold text-emerald-600 uppercase tracking-wide">
                          Free
                        </span>
                      ) : (
                        <div className="flex items-baseline gap-1">
                          <span className="text-xs sm:text-sm font-extrabold text-[#072B57]">
                            ₹{latestWebinar.price}
                          </span>
                          <span className="text-[10px] text-gray-400 line-through">₹1,999</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenDetails(latestWebinar)}
                        className="px-2 py-1 rounded text-[11px] font-semibold text-gray-600 hover:text-[#072B57] hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        Details
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenRegister(latestWebinar)}
                        className="inline-flex items-center justify-center px-3 py-1 rounded-md text-[11px] font-bold text-white bg-[#072B57] hover:bg-[#FF6B00] shadow-xs transition-colors cursor-pointer active:scale-98"
                      >
                        {latestWebinar.type === 'free' ? 'Register Free' : 'Book Seat'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* =========================================================
            3. WEBINAR FILTERS (Compact horizontal filter bar below hero)
            ========================================================= */}
        <section
          id="webinar-filters"
          className="pt-5 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4"
        >
          {/* Horizontal filter buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
            <button
              type="button"
              id="filter-all-webinars"
              onClick={() => {
                setFilter('all');
                setShowAllWebinars(false);
              }}
              className={`px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-[#072B57] text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-gray-200 hover:border-[#FF6B00] hover:text-[#FF6B00]'
              }`}
            >
              All Webinars ({totalCount})
            </button>

            <button
              type="button"
              id="filter-free-webinars"
              onClick={() => {
                setFilter('free');
                setShowAllWebinars(false);
              }}
              className={`px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                filter === 'free'
                  ? 'bg-[#072B57] text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-gray-200 hover:border-[#FF6B00] hover:text-[#FF6B00]'
              }`}
            >
              Free ({freeCount})
            </button>

            <button
              type="button"
              id="filter-paid-webinars"
              onClick={() => {
                setFilter('paid');
                setShowAllWebinars(false);
              }}
              className={`px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                filter === 'paid'
                  ? 'bg-[#072B57] text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-gray-200 hover:border-[#FF6B00] hover:text-[#FF6B00]'
              }`}
            >
              Paid ({paidCount})
            </button>
          </div>

          {/* Long search bar */}
          <div className="relative flex-1 md:max-w-md lg:max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 stroke-[1.75]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search webinars by title or topic..."
              className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm rounded-md border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </section>

        {/* =========================================================
            4. UPCOMING WEBINARS (Heading with View all → + 3-col grid)
            ========================================================= */}
        <section id="upcoming-webinars" className="pb-16 sm:pb-20">
          {/* Section heading with right-aligned "View all →" link */}
          <div className="flex items-center justify-between mb-5 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-[#072B57] tracking-tight">
              Upcoming Webinars
            </h2>

            <button
              type="button"
              id="btn-view-all-webinars"
              onClick={() => {
                setShowAllWebinars(!showAllWebinars);
                if (filter !== 'all') setFilter('all');
              }}
              className="text-xs sm:text-sm font-bold text-[#FF6B00] hover:text-[#e05e00] inline-flex items-center gap-1 transition-colors cursor-pointer group"
            >
              <span>{showAllWebinars ? 'Show fewer' : 'View all'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Empty search state */}
          {displayedWebinars.length === 0 ? (
            <div className="my-12 rounded-[10px] border border-gray-200 bg-white p-10 text-center max-w-md mx-auto shadow-xs">
              <Search className="h-8 w-8 text-gray-400 mx-auto mb-3" />
              <p className="text-sm font-bold text-[#072B57]">
                No webinars found
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Try searching for a different keyword or resetting your filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setFilter('all');
                  setSearchQuery('');
                  setShowAllWebinars(false);
                }}
                className="mt-4 inline-flex items-center justify-center px-4 py-2 rounded-md bg-[#072B57] hover:bg-[#FF6B00] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            /* Three-column desktop grid (6 cards) */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {displayedWebinars.map((webinar) => (
                /* Card Design: White background, thin light-gray border, rounded corners around 10px */
                <article
                  key={webinar.id}
                  className="bg-white border border-gray-200 rounded-[10px] overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-[#FED7AA] transition-all duration-200 group"
                >
                  {/* Top: Wide Photographic Thumbnail + Badge */}
                  <div
                    className="aspect-[16/9] w-full relative overflow-hidden bg-gray-100 cursor-pointer"
                    onClick={() => handleOpenDetails(webinar)}
                  >
                    <img
                      src={webinar.posterUrl}
                      alt={webinar.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      loading="lazy"
                    />

                    {/* Small FREE green badge or PAID CBM orange badge */}
                    <div className="absolute top-3 left-3">
                      {webinar.type === 'free' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
                          FREE
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-orange-50 text-[#FF6B00] border border-orange-200 shadow-xs">
                          PAID
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      {/* Bold title */}
                      <h3
                        onClick={() => handleOpenDetails(webinar)}
                        className="text-base font-bold text-[#072B57] leading-snug line-clamp-2 mb-2 group-hover:text-[#FF6B00] transition-colors cursor-pointer"
                      >
                        {webinar.title}
                      </h3>

                      {/* Short description */}
                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
                        {webinar.description}
                      </p>
                    </div>

                    <div>
                      {/* Date & Duration with small outline icons */}
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 pt-3 border-t border-gray-100">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400 stroke-[1.75]" />
                          <span>{webinar.date}</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-gray-400 stroke-[1.75]" />
                          <span>{webinar.duration}</span>
                        </span>
                      </div>

                      {/* Price & Clear Navy CTA Button */}
                      <div className="flex items-center justify-between gap-3 pt-1">
                        <div>
                          {webinar.type === 'free' ? (
                            <span className="text-xs sm:text-sm font-bold text-emerald-600 uppercase tracking-wide">
                              Free
                            </span>
                          ) : (
                            <div className="flex items-baseline gap-1">
                              <span className="text-sm sm:text-base font-extrabold text-[#072B57]">
                                ₹{webinar.price}
                              </span>
                              <span className="text-[11px] text-gray-400 line-through">
                                ₹1,999
                              </span>
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenRegister(webinar)}
                          className="inline-flex items-center justify-center bg-[#072B57] hover:bg-[#FF6B00] text-white text-xs font-semibold px-4 py-2 rounded-md shadow-xs transition-colors cursor-pointer active:scale-98"
                        >
                          {webinar.type === 'free' ? 'Register Free' : 'Book Seat — ₹499'}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Discrete Admin Switcher at Bottom for Admin Faculty */}
        <div className="pt-6 pb-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
          <span>&copy; {new Date().getFullYear()} CBM Academy &bull; All masterclasses are conducted live</span>
          <button
            type="button"
            onClick={() => setManageModalOpen(true)}
            className="hover:text-gray-600 transition-colors cursor-pointer inline-flex items-center gap-1"
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>Manage Webinars</span>
          </button>
        </div>
      </div>

      {/* =========================================================
          INTERACTIVE MODALS (Registration, Details & Management)
          ========================================================= */}
      {selectedWebinarForDetails && (
        <WebinarDetailsModal
          webinar={selectedWebinarForDetails}
          isOpen={detailsModalOpen}
          onClose={() => {
            setDetailsModalOpen(false);
            setSelectedWebinarForDetails(null);
          }}
          onRegister={() => {
            setDetailsModalOpen(false);
            setSelectedWebinarForRegister(selectedWebinarForDetails);
            setRegisterModalOpen(true);
          }}
        />
      )}

      {selectedWebinarForRegister && (
        <WebinarRegisterModal
          webinar={selectedWebinarForRegister}
          isOpen={registerModalOpen}
          onClose={() => {
            setRegisterModalOpen(false);
            setSelectedWebinarForRegister(null);
          }}
        />
      )}

      {manageModalOpen && (
        <ManageWebinarsModal
          isOpen={manageModalOpen}
          onClose={() => setManageModalOpen(false)}
        />
      )}
    </div>
  );
};
