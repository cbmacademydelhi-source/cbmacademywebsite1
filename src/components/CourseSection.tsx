import React from 'react';
import { AITools } from './AITools';

interface CourseSectionProps {
  onOpenApply?: (courseName?: string) => void;
  onOpenBrochure?: () => void;
}

interface ModuleItem {
  number: string;
  badgeBg: string;
  badgeText: string;
  circleBg: string;
  title: string;
  description: string;
  renderIcon: () => React.ReactNode;
}

const modules: ModuleItem[] = [
  {
    number: '01',
    badgeBg: 'bg-[#EEF4FF]',
    badgeText: 'text-[#1E60F2]',
    circleBg: 'bg-[#EEF4FF]',
    title: 'AI-Driven Search Engine Optimization (SEO)',
    description:
      'Master search rankings with AI tools, keyword strategies & on-page SEO.',
    renderIcon: () => (
      <svg
        className="w-6 h-6 text-[#1E60F2]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
  },
  {
    number: '02',
    badgeBg: 'bg-[#EAFBF3]',
    badgeText: 'text-[#10B981]',
    circleBg: 'bg-[#EAFBF3]',
    title: 'Performance Marketing & Meta Ads Suite',
    description:
      'Run high-converting ads on Google & Meta with performance focus.',
    renderIcon: () => (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <rect x="5" y="14" width="3.2" height="6" rx="1.6" fill="#10B981" />
        <rect x="10.4" y="9" width="3.2" height="11" rx="1.6" fill="#10B981" />
        <rect x="15.8" y="4" width="3.2" height="16" rx="1.6" fill="#10B981" />
      </svg>
    ),
  },
  {
    number: '03',
    badgeBg: 'bg-[#FFF3EB]',
    badgeText: 'text-[#FF6B00]',
    circleBg: 'bg-[#FFF3EB]',
    title: 'Google Ads & Performance Max Mastery',
    description:
      'Drive results with Google Ads, PMax campaigns & smart bidding.',
    renderIcon: () => (
      <svg
        className="w-6 h-6 text-[#FF6B00]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        <path d="M19 5l-4 4" />
        <path d="M15 5h4v4" />
      </svg>
    ),
  },
  {
    number: '04',
    badgeBg: 'bg-[#F3E8FF]',
    badgeText: 'text-[#7C3AED]',
    circleBg: 'bg-[#F3E8FF]',
    title: 'AI Content Creation, Copywriting & Media',
    description:
      'Create content that ranks, engages & converts with AI superpowers.',
    renderIcon: () => (
      <div
        className="w-6 h-6 rounded-[7px] bg-[#6D28D9] flex flex-col items-center justify-center text-white shadow-xs"
        aria-hidden="true"
      >
        <span className="text-[9.5px] font-black tracking-tight leading-none">
          AI
        </span>
        <div className="mt-1 flex flex-col gap-[1.5px] w-3.5">
          <div className="h-[1.5px] bg-white/90 rounded-full w-full" />
          <div className="h-[1.5px] bg-white/90 rounded-full w-2.5 mx-auto" />
        </div>
      </div>
    ),
  },
  {
    number: '05',
    badgeBg: 'bg-[#FEF7EA]',
    badgeText: 'text-[#D97706]',
    circleBg: 'bg-[#FEF7EA]',
    title: 'Web Analytics, GA4 & Looker Dashboards',
    description:
      'Track, analyze & visualize data like a pro with GA4 & Looker.',
    renderIcon: () => (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <rect x="5" y="14" width="3.2" height="6" rx="1.6" fill="#F59E0B" />
        <rect x="10.4" y="9" width="3.2" height="11" rx="1.6" fill="#F59E0B" />
        <rect x="15.8" y="4" width="3.2" height="16" rx="1.6" fill="#F59E0B" />
      </svg>
    ),
  },
  {
    number: '06',
    badgeBg: 'bg-[#FFEBF0]',
    badgeText: 'text-[#E11D48]',
    circleBg: 'bg-[#FFEBF0]',
    title: 'Organic Social Media Strategy & Growth',
    description:
      'Build brand presence & grow organically across platforms.',
    renderIcon: () => (
      <div
        className="flex flex-col items-center justify-center gap-1"
        aria-hidden="true"
      >
        <svg
          className="w-4 h-4 text-[#E1306C]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
        <div className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5 fill-[#E1306C]" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <svg className="w-3.5 h-3.5 fill-[#E1306C]" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        </div>
      </div>
    ),
  },
  {
    number: '07',
    badgeBg: 'bg-[#EEF4FF]',
    badgeText: 'text-[#1E60F2]',
    circleBg: 'bg-[#EEF4FF]',
    title: 'Email Marketing & CRM Automation',
    description:
      'Automate, engage & convert with email funnels & smart CRM.',
    renderIcon: () => (
      <svg
        className="w-6 h-6 text-[#1E60F2]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect width="20" height="15" x="2" y="4.5" rx="2.5" />
        <path d="m22 6.5-9.25 6.4a1.5 1.5 0 0 1-1.5 0L2 6.5" />
      </svg>
    ),
  },
  {
    number: '08',
    badgeBg: 'bg-[#EAFBF3]',
    badgeText: 'text-[#10B981]',
    circleBg: 'bg-[#EAFBF3]',
    title: 'Freelancing, Affiliate & Agency Blueprint',
    description:
      'Build your income streams & scale as a freelancer or agency owner.',
    renderIcon: () => (
      <svg
        className="w-6 h-6 fill-[#10B981]"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M20 6h-3V4c0-1.1-.9-2-2-2h-6c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-11-2h6v2H9V4zm11 15H4v-9h16v9zm0-11H4V8h16v2z" />
      </svg>
    ),
  },
];

/* =========================================================
   CURRICULUM SECTION (4x2 GRID - REFERENCE MATCH)
========================================================= */

export const CourseSection: React.FC<CourseSectionProps> = ({
  onOpenApply,
}) => {
  return (
    <>
      <section
        id="course"
        className="relative overflow-hidden bg-transparent pt-8 sm:pt-10 pb-8 sm:pb-10"
      >
        {/* Continuous Animated Ambient Orange Blobs (Behind Content) */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden select-none"
          aria-hidden="true"
        >
          {/* Blob 1: Top Left / Center glow */}
          <div
            className="cbm-curriculum-blob-1 absolute -top-16 -left-12 h-[380px] w-[380px] sm:h-[480px] sm:w-[480px] rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(255, 107, 0, 0.18) 0%, rgba(255, 138, 61, 0.08) 45%, transparent 70%)',
              filter: 'blur(50px)',
            }}
          />

          {/* Blob 2: Top Right glow */}
          <div
            className="cbm-curriculum-blob-2 absolute -top-8 -right-16 h-[360px] w-[360px] sm:h-[460px] sm:w-[460px] rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(255, 120, 20, 0.16) 0%, rgba(255, 160, 92, 0.07) 50%, transparent 70%)',
              filter: 'blur(55px)',
            }}
          />

          {/* Blob 3: Center / Middle glow */}
          <div
            className="cbm-curriculum-blob-3 absolute top-[35%] left-[20%] h-[340px] w-[340px] sm:h-[440px] sm:w-[440px] rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(255, 107, 0, 0.15) 0%, rgba(255, 140, 50, 0.06) 45%, transparent 70%)',
              filter: 'blur(50px)',
            }}
          />

          {/* Blob 4: Bottom Right glow */}
          <div
            className="cbm-curriculum-blob-4 absolute -bottom-20 right-[15%] h-[380px] w-[380px] sm:h-[480px] sm:w-[480px] rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(255, 107, 0, 0.16) 0%, rgba(255, 150, 70, 0.07) 50%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          {/* HEADER */}
          <div className="mx-auto max-w-5xl text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-[34px] lg:text-[40px] font-extrabold tracking-tight leading-tight text-[#072B57] sm:whitespace-nowrap">
              AI-Powered{' '}
              <span className="text-[#FF6B00]">Digital Marketing</span>{' '}
              Curriculum
            </h2>

            <p className="mt-2.5 text-xs sm:text-sm md:text-base font-normal text-slate-500">
              8 power-packed modules. Real-world skills. AI tools. Career-ready you.
            </p>

            {/* Accent divider pill matching reference design */}
            <div className="w-12 h-1 bg-[#FF6B00] rounded-full mx-auto mt-4" />
          </div>

          {/* 4x2 MODULE GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {modules.map((module) => (
              <article
                key={module.number}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] p-6 sm:p-7 flex flex-col justify-start h-full hover:shadow-md transition-shadow duration-200"
              >
                {/* Top Row: Number Badge & Circular Icon */}
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs sm:text-[13px] font-bold leading-none ${module.badgeBg} ${module.badgeText}`}
                  >
                    {module.number}
                  </span>

                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${module.circleBg}`}
                  >
                    {module.renderIcon()}
                  </div>
                </div>

                {/* Bold Module Title */}
                <h3 className="mt-5 sm:mt-6 text-[17px] sm:text-[18px] font-bold text-[#072B57] leading-[1.3]">
                  {module.title}
                </h3>

                {/* Short Description */}
                <p className="mt-2 text-[13px] sm:text-[13.5px] text-slate-500 leading-[1.55]">
                  {module.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =================================================
          AI & MARKETING TOOLS (UNCHANGED)
      ================================================= */}
      <AITools onOpenApply={onOpenApply} />
    </>
  );
};
