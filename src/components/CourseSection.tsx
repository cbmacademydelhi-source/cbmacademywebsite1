import React from 'react';
import { COURSE_MODULES } from '../data/cbmData';
import {
  Search,
  TrendingUp,
  Target,
  Sparkles,
  BarChart3,
  Share2,
  MailCheck,
  Briefcase,
  Layers,
  Zap,
  Trophy,
  GraduationCap,
  Users,
  ArrowUpRight,
} from 'lucide-react';

interface CourseSectionProps {
  onOpenApply: (courseName?: string) => void;
  onOpenBrochure: () => void;
}

const moduleIconMap: Record<string, React.ElementType> = {
  Search,
  TrendingUp,
  Target,
  Sparkles,
  BarChart3,
  Share2,
  MailCheck,
  Briefcase,
};

const moduleDescriptions: Record<number, string> = {
  1: 'Master search rankings with AI tools, keyword strategies & on-page SEO.',
  2: 'Run high-converting ads on Google & Meta with performance focus.',
  3: 'Drive results with Google Ads, PMax campaigns & smart bidding.',
  4: 'Create content that ranks, engages & converts with AI superpowers.',
  5: 'Track, analyze & visualize data like a pro with GA4 & Looker.',
  6: 'Build brand presence & grow organically across platforms.',
  7: 'Automate, engage & convert with email funnels & smart CRM.',
  8: 'Build your income streams & scale as a freelancer or agency owner.',
};

const moduleStyles: Record<
  number,
  {
    accent: string;
    soft: string;
    border: string;
    glow: string;
  }
> = {
  1: {
    accent: '#2563EB',
    soft: '#EFF6FF',
    border: '#DBEAFE',
    glow: 'rgba(37, 99, 235, 0.14)',
  },
  2: {
    accent: '#16A34A',
    soft: '#F0FDF4',
    border: '#DCFCE7',
    glow: 'rgba(22, 163, 74, 0.14)',
  },
  3: {
    accent: '#F97316',
    soft: '#FFF7ED',
    border: '#FFEDD5',
    glow: 'rgba(249, 115, 22, 0.14)',
  },
  4: {
    accent: '#7C3AED',
    soft: '#F5F3FF',
    border: '#EDE9FE',
    glow: 'rgba(124, 58, 237, 0.14)',
  },
  5: {
    accent: '#EAB308',
    soft: '#FEFCE8',
    border: '#FEF9C3',
    glow: 'rgba(234, 179, 8, 0.14)',
  },
  6: {
    accent: '#EC4899',
    soft: '#FDF2F8',
    border: '#FCE7F3',
    glow: 'rgba(236, 72, 153, 0.14)',
  },
  7: {
    accent: '#0EA5E9',
    soft: '#F0F9FF',
    border: '#E0F2FE',
    glow: 'rgba(14, 165, 233, 0.14)',
  },
  8: {
    accent: '#14B8A6',
    soft: '#F0FDFA',
    border: '#CCFBF1',
    glow: 'rgba(20, 184, 166, 0.14)',
  },
};

export const CourseSection: React.FC<CourseSectionProps> = ({
  onOpenApply,
  onOpenBrochure,
}) => {
  return (
    <section
      id="course"
      className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24"
    >
      {/* Soft background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[900px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(99,102,241,0.10) 0%, rgba(59,130,246,0.06) 35%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ================= HEADER ================= */}
        <div className="mx-auto mb-12 max-w-4xl text-center sm:mb-14 lg:mb-16">

          {/* Badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#E66A00] shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Master Curriculum
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-extrabold tracking-tight text-[#072B57] sm:text-4xl lg:text-5xl xl:text-[52px]">
            AI-Powered{' '}
            <span
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent"
            >
              Digital Marketing
            </span>{' '}
            Curriculum
          </h2>

          {/* Subtitle */}
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
            8 power-packed modules. Real-world skills. AI tools.
            <span className="font-semibold text-slate-700">
              {' '}Career-ready you.
            </span>
          </p>

          {/* Small decorative line */}
          <div className="mx-auto mt-6 flex items-center justify-center gap-2">
            <span className="h-1 w-8 rounded-full bg-blue-500" />
            <span className="h-1 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
            <span className="h-1 w-8 rounded-full bg-purple-500" />
          </div>
        </div>

        {/* ================= MODULE GRID ================= */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">

          {COURSE_MODULES.map((module) => {
            const style =
              moduleStyles[module.number] || moduleStyles[1];

            const Icon =
              moduleIconMap[module.iconName] || Layers;

            return (
              <article
                key={module.id}
                className="group relative flex min-h-[360px] flex-col overflow-hidden rounded-[24px] border bg-white p-5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl sm:min-h-[375px] sm:p-6"
                style={{
                  borderColor: '#E5EAF2',
                  boxShadow: `0 8px 30px ${style.glow}`,
                }}
              >

                {/* Soft top-right glow */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-70 blur-2xl transition-transform duration-500 group-hover:scale-125"
                  style={{
                    background: style.soft,
                  }}
                />

                {/* Module Number */}
                <div className="relative z-10 flex items-start justify-between">

                  <div
                    className="flex h-11 min-w-11 items-center justify-center rounded-xl border px-3 text-sm font-extrabold"
                    style={{
                      backgroundColor: style.soft,
                      borderColor: style.border,
                      color: style.accent,
                    }}
                  >
                    {String(module.number).padStart(2, '0')}
                  </div>

                  <ArrowUpRight
                    className="h-5 w-5 opacity-30 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-70"
                    style={{ color: style.accent }}
                  />
                </div>

                {/* Large Visual */}
                <div className="relative z-10 mt-5 flex h-[120px] items-center justify-center overflow-hidden rounded-2xl">
                  
                  {/* Decorative circles */}
                  <div
                    aria-hidden="true"
                    className="absolute h-28 w-28 rounded-full opacity-60 transition-transform duration-500 group-hover:scale-110"
                    style={{
                      backgroundColor: style.soft,
                    }}
                  />

                  <div
                    aria-hidden="true"
                    className="absolute h-20 w-20 rounded-full border opacity-70"
                    style={{
                      borderColor: style.border,
                    }}
                  />

                  {/* Icon */}
                  <div
                    className="relative flex h-20 w-20 items-center justify-center rounded-2xl border bg-white shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1"
                    style={{
                      borderColor: style.border,
                      boxShadow: `0 12px 30px ${style.glow}`,
                    }}
                  >
                    <Icon
                      className="h-10 w-10"
                      strokeWidth={1.8}
                      style={{ color: style.accent }}
                    />
                  </div>

                  {/* Tiny decorative dots */}
                  <span
                    className="absolute left-8 top-5 h-2 w-2 rounded-full"
                    style={{ backgroundColor: style.accent }}
                  />

                  <span
                    className="absolute bottom-5 right-8 h-1.5 w-1.5 rounded-full opacity-60"
                    style={{ backgroundColor: style.accent }}
                  />
                </div>

                {/* Content */}
                <div className="relative z-10 mt-4 flex flex-1 flex-col">

                  <div
                    className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.15em]"
                    style={{ color: style.accent }}
                  >
                    Module {String(module.number).padStart(2, '0')}
                  </div>

                  <h3 className="text-[17px] font-extrabold leading-snug text-[#072B57] sm:text-[18px]">
                    {module.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {moduleDescriptions[module.number] ||
                      'Practical training focused on modern digital marketing skills.'}
                  </p>
                </div>

                {/* Bottom accent line */}
                <div
                  className="absolute bottom-0 left-0 h-1 w-full transition-all duration-300 group-hover:h-1.5"
                  style={{
                    background: `linear-gradient(90deg, ${style.accent}, transparent)`,
                  }}
                />
              </article>
            );
          })}

        </div>

        {/* ================= BENEFITS STRIP ================= */}
        <div className="mt-10 overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm sm:mt-12 lg:mt-14">

          <div className="grid grid-cols-1 divide-y divide-slate-200 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x lg:divide-y-0">

            {/* Benefit 1 */}
            <div className="flex items-center gap-3 px-5 py-4 sm:px-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#072B57]">
                  AI-Powered Learning
                </p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="flex items-center gap-3 px-5 py-4 sm:px-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#072B57]">
                  Industry-Relevant Projects
                </p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="flex items-center gap-3 px-5 py-4 sm:px-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-500">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#072B57]">
                  Certification & Career Support
                </p>
              </div>
            </div>

            {/* Benefit 4 */}
            <div className="flex items-center gap-3 px-5 py-4 sm:px-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-500">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#072B57]">
                  Lifetime Access & Community
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
