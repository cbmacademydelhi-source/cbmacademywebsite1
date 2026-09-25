import React, { useState, useEffect } from 'react';
import {
  Settings,
  ArrowRight,
  ArrowDown,
  BookOpen,
  Laptop,
  Cpu,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import { Webinar } from '../types';
import { getWebinars, WEBINAR_UPDATE_EVENT } from '../services/webinarStorage';
import { FeaturedWebinarCard } from './webinars/FeaturedWebinarCard';
import { SecondaryWebinarCard } from './webinars/SecondaryWebinarCard';
import { CompactWebinarCard } from './webinars/CompactWebinarCard';
import { WebinarDetailsModal } from './webinars/WebinarDetailsModal';
import { WebinarRegisterModal } from './webinars/WebinarRegisterModal';
import { ManageWebinarsModal } from './webinars/ManageWebinarsModal';

type FilterType = 'all' | 'free' | 'paid';

interface FaqItem {
  question: string;
  answer: string;
}

const WEBINAR_FAQS: FaqItem[] = [
  {
    question: 'Are CBM Academy webinars free or paid?',
    answer:
      'CBM Academy offers both free and paid webinars. You can use the webinar filters to explore available sessions.',
  },
  {
    question: 'How can I register for a webinar?',
    answer:
      'Select your preferred webinar, complete the registration form and follow the registration or payment instructions provided.',
  },
  {
    question: 'How will I receive the webinar details?',
    answer:
      'After successful registration, the webinar information and joining instructions will be shared through the registered contact details.',
  },
  {
    question: 'Do I need to pay for every webinar?',
    answer:
      'No. CBM Academy offers both free and paid webinar sessions. The webinar card clearly indicates whether a session is free or paid.',
  },
  {
    question: 'Can students and beginners attend the webinars?',
    answer:
      'Yes. Webinar eligibility depends on the individual session. Check the webinar description for specific requirements.',
  },
];

export const WebinarsPage: React.FC = () => {
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Modals state
  const [selectedWebinarForDetails, setSelectedWebinarForDetails] = useState<Webinar | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const [selectedWebinarForRegister, setSelectedWebinarForRegister] = useState<Webinar | null>(null);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  const [manageModalOpen, setManageModalOpen] = useState(false);

  // Dynamic SEO metadata for Webinars page
  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'Digital Marketing Webinars in Okhla, New Delhi | CBM Academy';

    const metaDescription = document.querySelector('meta[name="description"]');
    const prevDescription = metaDescription?.getAttribute('content') || '';
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Join CBM Academy webinars in Okhla, New Delhi on digital marketing, AI, SEO, Google Ads, social media, performance marketing and business growth.'
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

  const scrollToUpcoming = () => {
    const el = document.getElementById('upcoming-webinars-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      id="webinars-page-root"
      className="min-h-screen bg-[#F8FAFC] pt-8 sm:pt-12 pb-24 sm:pb-32"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Top bar with Admin Quick Access */}
        <div className="flex justify-end mb-3 sm:mb-4">
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

        {/* =========================================================
            1. WEBINAR HERO SECTION
            ========================================================= */}
        <div className="max-w-4xl">
          {/* Section Label */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#FF6B00] text-xs font-extrabold uppercase tracking-wider border border-orange-200 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
            <span>CBM ACADEMY WEBINARS</span>
          </div>

          {/* Main Heading (H1) */}
          <h1
            id="webinars-main-heading"
            className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#072B57] tracking-tight leading-[1.18]"
          >
            Digital Marketing Webinars &{' '}
            <span className="text-[#FF6B00]">Live Learning Sessions</span>
          </h1>

          {/* Subheading */}
          <p
            id="webinars-subtitle"
            className="mt-3.5 text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl"
          >
            Join practical webinars and live sessions on digital marketing, AI, SEO, Google Ads, Meta Ads, social media marketing, performance marketing and emerging industry trends. Learn from industry-focused sessions designed for students, professionals, freelancers and business owners.
          </p>

          {/* Supporting Text */}
          <p className="mt-2 text-xs sm:text-sm text-slate-500 font-medium">
            Discover upcoming free and paid webinars from CBM Academy and build practical knowledge beyond the classroom.
          </p>

          {/* Primary Button */}
          <div className="mt-5">
            <button
              type="button"
              id="btn-hero-explore-webinars"
              onClick={scrollToUpcoming}
              className="inline-flex items-center gap-2 rounded-xl bg-[#FF6B00] px-6 py-3 text-xs sm:text-sm font-bold text-white transition-all duration-150 hover:bg-[#e05f00] cursor-pointer shadow-md hover:shadow-lg active:scale-98"
            >
              <span>Explore Webinars</span>
              <ArrowDown className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* =========================================================
            2. INTRODUCTION SECTION
            ========================================================= */}
        <div className="mt-10 sm:mt-12 rounded-2xl bg-white border border-[#E5E7EB] p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-black text-[#072B57] tracking-tight">
            Learn, Connect & Grow with CBM Academy Webinars
          </h2>
          <div className="mt-3 space-y-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>
              CBM Academy webinars provide practical insights into the latest digital marketing strategies, AI tools, advertising platforms, SEO techniques, social media trends and business growth opportunities.
            </p>
            <p>
              Whether you are a student starting your digital marketing journey, a professional upgrading your skills, a freelancer looking for new opportunities or a business owner exploring digital growth, our webinars are designed to provide useful and actionable knowledge.
            </p>
          </div>
        </div>

        {/* =========================================================
            3. UPCOMING WEBINARS SECTION
            ========================================================= */}
        <div id="upcoming-webinars-section" className="mt-12 sm:mt-14 scroll-mt-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
            <div>
              <div className="text-xs font-extrabold text-[#FF6B00] tracking-wider uppercase mb-1">
                UPCOMING WEBINARS
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#072B57] tracking-tight">
                Explore Our Upcoming Webinars
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-600 max-w-2xl">
                Choose from upcoming free and paid webinars covering digital marketing, AI, SEO, performance marketing, social media and business growth.
              </p>
            </div>

            {/* Filters: [ All Webinars ] [ Free Webinars ] [ Paid Webinars ] */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                id="filter-all"
                onClick={() => setFilter('all')}
                className={`rounded-[8px] px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  filter === 'all'
                    ? 'bg-[#072B57] text-white border border-[#072B57] shadow-xs'
                    : 'bg-white text-[#072B57] border border-[#E5E7EB] hover:border-[#072B57]/40'
                }`}
              >
                All Webinars ({publicWebinars.length})
              </button>

              <button
                type="button"
                id="filter-free"
                onClick={() => setFilter('free')}
                className={`rounded-[8px] px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  filter === 'free'
                    ? 'bg-[#072B57] text-white border border-[#072B57] shadow-xs'
                    : 'bg-white text-[#072B57] border border-[#E5E7EB] hover:border-[#072B57]/40'
                }`}
              >
                Free Webinars ({publicWebinars.filter((w) => w.type === 'free').length})
              </button>

              <button
                type="button"
                id="filter-paid"
                onClick={() => setFilter('paid')}
                className={`rounded-[8px] px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  filter === 'paid'
                    ? 'bg-[#072B57] text-white border border-[#072B57] shadow-xs'
                    : 'bg-white text-[#072B57] border border-[#E5E7EB] hover:border-[#072B57]/40'
                }`}
              >
                Paid Webinars ({publicWebinars.filter((w) => w.type === 'paid').length})
              </button>
            </div>
          </div>

          {/* Contextual Filter Notice (Free / Paid Webinars Section) */}
          {filter === 'free' && (
            <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 p-4">
              <h3 className="text-sm font-bold text-emerald-900">
                Free Digital Marketing Webinars
              </h3>
              <p className="mt-1 text-xs text-emerald-800 leading-relaxed">
                Join our free webinars to explore digital marketing concepts, AI tools, SEO, social media, advertising and career opportunities without a paid registration.
              </p>
            </div>
          )}

          {filter === 'paid' && (
            <div className="mt-4 rounded-xl bg-orange-50 border border-orange-200 p-4">
              <h3 className="text-sm font-bold text-[#072B57]">
                Premium Digital Marketing Webinars
              </h3>
              <p className="mt-1 text-xs text-slate-700 leading-relaxed">
                Take a deeper dive into advanced digital marketing strategies, practical tools, AI-powered workflows, performance marketing and industry-focused topics through our premium webinar sessions.
              </p>
            </div>
          )}
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
            {/* =========================================================
                4. FEATURED WEBINAR SECTION
                ========================================================= */}
            {featuredWebinar && (
              <section id="featured-webinar-section">
                <div className="mb-3">
                  <div className="text-[11px] font-extrabold text-[#FF6B00] tracking-wider uppercase">
                    FEATURED WEBINAR
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#072B57]">
                    Learn from Industry-Focused Digital Marketing Sessions
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Get practical insights, strategies and actionable knowledge through live sessions led by experienced trainers and digital marketing professionals.
                  </p>
                </div>

                <FeaturedWebinarCard
                  webinar={featuredWebinar}
                  onSelect={handleOpenDetails}
                  onRegister={handleOpenRegister}
                />
              </section>
            )}

            {/* =========================================================
                5. TWO SECONDARY WEBINARS
                ========================================================= */}
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

            {/* =========================================================
                6. MORE UPCOMING WEBINARS (Compact grid)
                ========================================================= */}
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

        {/* =========================================================
            7. WHY ATTEND OUR WEBINARS
            ========================================================= */}
        <section id="why-attend-webinars" className="mt-16 sm:mt-20 pt-10 border-t border-[#E5E7EB]">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#FF6B00] text-xs font-extrabold uppercase tracking-wider border border-orange-200 mb-2">
              WHY ATTEND OUR WEBINARS
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#072B57] tracking-tight">
              Practical Knowledge Beyond the Classroom
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600">
              Discover why thousands of learners join CBM Academy webinars to accelerate their digital marketing career.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* Card 1 */}
            <div className="rounded-2xl bg-white border border-[#E5E7EB] p-5 sm:p-6 shadow-xs hover:border-[#FF6B00]/40 transition-colors">
              <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#072B57] mb-3.5">
                <BookOpen className="h-5 w-5 text-[#072B57]" />
              </div>
              <h3 className="text-base font-bold text-[#072B57] tracking-tight">
                Industry-Relevant Topics
              </h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Stay updated with current digital marketing strategies, tools, platforms and industry trends.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl bg-white border border-[#E5E7EB] p-5 sm:p-6 shadow-xs hover:border-[#FF6B00]/40 transition-colors">
              <div className="h-10 w-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF6B00] mb-3.5">
                <Laptop className="h-5 w-5 text-[#FF6B00]" />
              </div>
              <h3 className="text-base font-bold text-[#072B57] tracking-tight">
                Practical Learning
              </h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Understand how digital marketing concepts and tools can be applied to real-world campaigns and business situations.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl bg-white border border-[#E5E7EB] p-5 sm:p-6 shadow-xs hover:border-[#FF6B00]/40 transition-colors">
              <div className="h-10 w-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 mb-3.5">
                <Cpu className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-base font-bold text-[#072B57] tracking-tight">
                AI-Powered Insights
              </h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Discover practical ways to use AI for content, SEO, advertising, research, analytics and marketing automation.
              </p>
            </div>

            {/* Card 4 */}
            <div className="rounded-2xl bg-white border border-[#E5E7EB] p-5 sm:p-6 shadow-xs hover:border-[#FF6B00]/40 transition-colors">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-3.5">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="text-base font-bold text-[#072B57] tracking-tight">
                Career & Business Growth
              </h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Gain knowledge that can support your career development, freelance opportunities and digital business growth.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================
            8. WEBINAR FAQs SECTION
            ========================================================= */}
        <section id="webinar-faqs" className="mt-16 sm:mt-20 pt-10 border-t border-[#E5E7EB]">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#FF6B00] text-xs font-extrabold uppercase tracking-wider border border-orange-200 mb-2">
              WEBINAR FAQs
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#072B57] tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600">
              Find answers to common questions about attending CBM Academy live webinars.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {WEBINAR_FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm sm:text-base font-bold text-[#072B57] hover:text-[#FF6B00] transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-[#FF6B00] shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-1">
                      <p className="pt-2">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================================
            9. FINAL CTA
            ========================================================= */}
        <section className="mt-16 sm:mt-20 rounded-2xl bg-[#072B57] p-8 sm:p-10 text-white text-center shadow-lg relative overflow-hidden">
          <div className="max-w-2xl mx-auto relative z-10">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Keep Learning. Keep Growing.
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Stay connected with CBM Academy for practical digital marketing webinars, AI insights, industry trends and career-focused learning opportunities.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={scrollToUpcoming}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6B00] px-6 py-3 text-xs sm:text-sm font-bold text-white transition-all hover:bg-[#e05f00] cursor-pointer shadow-md active:scale-98"
              >
                <span>View Upcoming Webinars</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <a
                href="#course"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3 text-xs sm:text-sm font-bold text-white transition-colors cursor-pointer"
              >
                <span>Explore Courses</span>
              </a>
            </div>
          </div>
        </section>
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




