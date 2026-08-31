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
  Zap,
  Trophy,
  GraduationCap,
  Users,
} from 'lucide-react';

interface CourseSectionProps {
  onOpenApply: (courseName?: string) => void;
  onOpenBrochure: () => void;
}

/* ---------------------------------------------------------
   MODULE CONTENT
--------------------------------------------------------- */

const descriptions: Record<number, string> = {
  1: 'Master search rankings with AI tools, keyword strategies & on-page SEO.',
  2: 'Run high-converting ads on Google & Meta with performance focus.',
  3: 'Drive results with Google Ads, PMax campaigns & smart bidding.',
  4: 'Create content that ranks, engages & converts with AI superpowers.',
  5: 'Track, analyze & visualize data like a pro with GA4 & Looker.',
  6: 'Build brand presence & grow organically across platforms.',
  7: 'Automate, engage & convert with email funnels & smart CRM.',
  8: 'Build your income streams & scale as a freelancer or agency owner.',
};

const moduleIcons: Record<string, React.ElementType> = {
  Search,
  TrendingUp,
  Target,
  Sparkles,
  BarChart3,
  Share2,
  MailCheck,
  Briefcase,
};

/* ---------------------------------------------------------
   PASTEL ACCENTS
--------------------------------------------------------- */

const accents = [
  {
    main: '#2563EB',
    soft: '#EFF6FF',
    border: '#DBEAFE',
    line: '#3B82F6',
  },
  {
    main: '#16A34A',
    soft: '#F0FDF4',
    border: '#DCFCE7',
    line: '#22C55E',
  },
  {
    main: '#F97316',
    soft: '#FFF7ED',
    border: '#FFEDD5',
    line: '#FB923C',
  },
  {
    main: '#7C3AED',
    soft: '#F5F3FF',
    border: '#EDE9FE',
    line: '#8B5CF6',
  },
  {
    main: '#EAB308',
    soft: '#FEFCE8',
    border: '#FEF3C7',
    line: '#EAB308',
  },
  {
    main: '#EC4899',
    soft: '#FDF2F8',
    border: '#FCE7F3',
    line: '#EC4899',
  },
  {
    main: '#2563EB',
    soft: '#EFF6FF',
    border: '#DBEAFE',
    line: '#3B82F6',
  },
  {
    main: '#14B8A6',
    soft: '#F0FDFA',
    border: '#CCFBF1',
    line: '#14B8A6',
  },
];

/* ---------------------------------------------------------
   ILLUSTRATIONS
   CSS/SVG based — no external images or dependencies
--------------------------------------------------------- */

const SearchVisual = ({ color }: { color: string }) => (
  <svg viewBox="0 0 180 150" className="h-full w-full">
    <circle cx="91" cy="70" r="48" fill="#F8FAFC" />
    <circle
      cx="78"
      cy="61"
      r="30"
      fill="none"
      stroke={color}
      strokeWidth="7"
    />
    <line
      x1="100"
      y1="83"
      x2="133"
      y2="116"
      stroke={color}
      strokeWidth="9"
      strokeLinecap="round"
    />
    <rect x="24" y="110" width="35" height="5" rx="2.5" fill="#CBD5E1" />
    <rect x="24" y="121" width="58" height="5" rx="2.5" fill="#E2E8F0" />
    <circle cx="139" cy="105" r="12" fill="#DBEAFE" />
    <path
      d="M133 105h12M139 99v12"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

const GrowthVisual = ({ color }: { color: string }) => (
  <svg viewBox="0 0 180 150" className="h-full w-full">
    <rect x="30" y="88" width="20" height="35" rx="4" fill="#DCFCE7" />
    <rect x="60" y="72" width="20" height="51" rx="4" fill="#BBF7D0" />
    <rect x="90" y="53" width="20" height="70" rx="4" fill="#86EFAC" />
    <rect x="120" y="31" width="20" height="92" rx="4" fill="#4ADE80" />

    <path
      d="M27 82 L58 65 L83 73 L112 42 L146 21"
      fill="none"
      stroke={color}
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <path
      d="M136 21h10v10"
      fill="none"
      stroke={color}
      strokeWidth="4"
      strokeLinecap="round"
    />

    <circle cx="58" cy="65" r="4" fill={color} />
    <circle cx="83" cy="73" r="4" fill={color} />
    <circle cx="112" cy="42" r="4" fill={color} />
  </svg>
);

const TargetVisual = ({ color }: { color: string }) => (
  <svg viewBox="0 0 180 150" className="h-full w-full">
    <circle cx="90" cy="72" r="49" fill="#FFF7ED" />
    <circle cx="90" cy="72" r="38" fill="white" stroke={color} strokeWidth="7" />
    <circle cx="90" cy="72" r="25" fill="#FFEDD5" stroke={color} strokeWidth="5" />
    <circle cx="90" cy="72" r="11" fill={color} />

    <path
      d="M125 28 L94 62"
      stroke="#F97316"
      strokeWidth="7"
      strokeLinecap="round"
    />
    <path
      d="M125 28 L119 47 M125 28 L106 30"
      stroke="#F97316"
      strokeWidth="5"
      strokeLinecap="round"
    />

    <circle cx="140" cy="103" r="10" fill="#FFEDD5" />
    <circle cx="40" cy="42" r="4" fill={color} />
  </svg>
);

const AIVisual = ({ color }: { color: string }) => (
  <svg viewBox="0 0 180 150" className="h-full w-full">
    <rect
      x="35"
      y="25"
      width="82"
      height="75"
      rx="12"
      fill="#F5F3FF"
      stroke="#DDD6FE"
      strokeWidth="2"
    />
    <rect
      x="51"
      y="40"
      width="51"
      height="35"
      rx="8"
      fill={color}
    />
    <text
      x="76"
      y="64"
      textAnchor="middle"
      fontSize="25"
      fontWeight="800"
      fill="white"
    >
      AI
    </text>

    <path
      d="M128 30 L136 48 L154 56 L136 64 L128 82 L120 64 L102 56 L120 48Z"
      fill="#DDD6FE"
    />

    <rect
      x="90"
      y="82"
      width="57"
      height="43"
      rx="9"
      fill="white"
      stroke="#E2E8F0"
      strokeWidth="3"
    />

    <rect x="99" y="91" width="39" height="24" rx="4" fill="#EDE9FE" />
    <circle cx="108" cy="99" r="4" fill={color} />
    <path
      d="M100 111 L110 103 L118 109 L126 101 L138 114"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
    />
  </svg>
);

const AnalyticsVisual = ({ color }: { color: string }) => (
  <svg viewBox="0 0 180 150" className="h-full w-full">
    <rect
      x="27"
      y="24"
      width="112"
      height="91"
      rx="10"
      fill="white"
      stroke="#E2E8F0"
      strokeWidth="4"
    />

    <rect x="39" y="38" width="38" height="7" rx="3" fill="#FEF3C7" />
    <rect x="39" y="51" width="24" height="5" rx="2" fill="#E2E8F0" />

    <path
      d="M43 92 L60 76 L76 84 L92 61 L112 70 L129 48"
      fill="none"
      stroke={color}
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <circle cx="60" cy="76" r="4" fill={color} />
    <circle cx="76" cy="84" r="4" fill={color} />
    <circle cx="92" cy="61" r="4" fill={color} />
    <circle cx="112" cy="70" r="4" fill={color} />
    <circle cx="129" cy="48" r="4" fill={color} />

    <circle cx="143" cy="102" r="22" fill="#FEF3C7" />
    <path
      d="M143 87 A15 15 0 1 1 130 110"
      fill="none"
      stroke={color}
      strokeWidth="7"
    />
  </svg>
);

const SocialVisual = ({ color }: { color: string }) => (
  <svg viewBox="0 0 180 150" className="h-full w-full">
    <circle cx="86" cy="72" r="34" fill="#FDF2F8" />

    <path
      d="M61 51 L76 45 L86 63 L73 68Z"
      fill="#FBCFE8"
    />

    <circle cx="78" cy="72" r="23" fill="#EC4899" opacity="0.95" />
    <circle cx="78" cy="72" r="9" fill="white" />
    <circle cx="78" cy="72" r="4" fill={color} />

    <rect
      x="103"
      y="39"
      width="30"
      height="30"
      rx="8"
      fill="#DBEAFE"
      transform="rotate(12 118 54)"
    />

    <rect
      x="106"
      y="83"
      width="35"
      height="35"
      rx="10"
      fill="#FCE7F3"
    />

    <path
      d="M123 91 C123 86 114 86 114 94 C114 99 123 106 123 106 C123 106 132 99 132 94 C132 86 123 86 123 91Z"
      fill={color}
    />

    <circle cx="49" cy="111" r="5" fill="#F9A8D4" />
    <circle cx="145" cy="31" r="4" fill={color} />
  </svg>
);

const EmailVisual = ({ color }: { color: string }) => (
  <svg viewBox="0 0 180 150" className="h-full w-full">
    <rect
      x="32"
      y="39"
      width="108"
      height="74"
      rx="12"
      fill="#EFF6FF"
      stroke="#BFDBFE"
      strokeWidth="3"
    />

    <path
      d="M36 47 L86 84 L136 47"
      fill="none"
      stroke={color}
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <path
      d="M37 105 L70 78"
      stroke="#93C5FD"
      strokeWidth="4"
      strokeLinecap="round"
    />

    <path
      d="M135 105 L102 78"
      stroke="#93C5FD"
      strokeWidth="4"
      strokeLinecap="round"
    />

    <circle cx="139" cy="104" r="20" fill="white" stroke="#DBEAFE" strokeWidth="3" />
    <circle cx="139" cy="99" r="6" fill={color} />
    <path
      d="M128 116 C130 106 148 106 150 116"
      fill={color}
    />
  </svg>
);

const BusinessVisual = ({ color }: { color: string }) => (
  <svg viewBox="0 0 180 150" className="h-full w-full">
    <rect
      x="28"
      y="50"
      width="88"
      height="65"
      rx="12"
      fill="#F0FDFA"
      stroke="#99F6E4"
      strokeWidth="3"
    />

    <path
      d="M53 50 V39 C53 34 57 31 62 31 H82 C87 31 91 34 91 39 V50"
      fill="none"
      stroke={color}
      strokeWidth="6"
    />

    <rect x="28" y="66" width="88" height="15" fill="#CCFBF1" />
    <rect x="64" y="68" width="16" height="11" rx="3" fill={color} />

    <path
      d="M115 98 L137 77 L151 87 L165 69"
      fill="none"
      stroke={color}
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <path
      d="M157 69 H165 V77"
      fill="none"
      stroke={color}
      strokeWidth="4"
      strokeLinecap="round"
    />

    <circle cx="146" cy="45" r="10" fill="#CCFBF1" />
  </svg>
);

const Visual = ({
  number,
  color,
}: {
  number: number;
  color: string;
}) => {
  switch (number) {
    case 1:
      return <SearchVisual color={color} />;
    case 2:
      return <GrowthVisual color={color} />;
    case 3:
      return <TargetVisual color={color} />;
    case 4:
      return <AIVisual color={color} />;
    case 5:
      return <AnalyticsVisual color={color} />;
    case 6:
      return <SocialVisual color={color} />;
    case 7:
      return <EmailVisual color={color} />;
    case 8:
      return <BusinessVisual color={color} />;
    default:
      return <SearchVisual color={color} />;
  }
};

/* ---------------------------------------------------------
   MAIN COMPONENT
--------------------------------------------------------- */

export const CourseSection: React.FC<CourseSectionProps> = () => {
  return (
    <section
      id="course"
      className="relative overflow-hidden bg-white py-14 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">

        {/* ==================================================
            HEADER
        ================================================== */}

        <header className="mx-auto mb-10 max-w-[1250px] text-center sm:mb-12 lg:mb-14">

          <div className="relative mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-5 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-orange-600">
            <Sparkles className="h-3.5 w-3.5" />
            MASTER CURRICULUM
          </div>

          <h2 className="mx-auto text-3xl font-extrabold leading-[1.12] tracking-tight text-[#071B41] sm:text-4xl md:text-[46px] lg:text-[50px]">
            AI-Powered{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Digital Marketing
            </span>{' '}
            Curriculum
          </h2>

          <p className="mt-4 text-sm text-slate-500 sm:text-base">
            8 power-packed modules. Real-world skills. AI tools. Career-ready you.
          </p>

          <div className="mt-5 flex items-center justify-center gap-2">
            <span className="h-[3px] w-9 rounded-full bg-blue-500" />
            <span className="h-[3px] w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
            <span className="h-[3px] w-9 rounded-full bg-purple-500" />
          </div>
        </header>

        {/* ==================================================
            8 MODULE CARDS
        ================================================== */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">

          {COURSE_MODULES.map((module, index) => {
            const accent = accents[index];
            const title = module.title;

            return (
              <article
                key={module.id}
                className="group relative h-[270px] overflow-hidden rounded-[22px] border bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.10)]"
                style={{
                  borderColor: '#E5EAF2',
                }}
              >

                {/* subtle pastel glow */}
                <div
                  className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full opacity-60 blur-2xl transition-transform duration-500 group-hover:scale-125"
                  style={{
                    backgroundColor: accent.soft,
                  }}
                />

                {/* dotted pattern */}
                <div
                  className="pointer-events-none absolute right-5 top-5 h-16 w-16 opacity-35"
                  style={{
                    backgroundImage: `radial-gradient(${accent.main} 1.2px, transparent 1.2px)`,
                    backgroundSize: '8px 8px',
                  }}
                />

                {/* ==================================================
                    MODULE NUMBER
                ================================================== */}

                <div
                  className="absolute left-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-xl border text-sm font-extrabold"
                  style={{
                    backgroundColor: accent.soft,
                    borderColor: accent.border,
                    color: accent.main,
                  }}
                >
                  {String(module.number).padStart(2, '0')}
                </div>

                {/* ==================================================
                    VISUAL
                ================================================== */}

                <div className="absolute right-0 top-[42px] z-10 h-[150px] w-[175px] transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:scale-[1.04]">
                  <Visual
                    number={module.number}
                    color={accent.main}
                  />
                </div>

                {/* small decorative dot */}
                <span
                  className="absolute left-[72px] top-[115px] z-10 h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: accent.main,
                  }}
                />

                {/* ==================================================
                    TEXT
                ================================================== */}

                <div className="absolute bottom-8 left-5 z-20 w-[58%]">

                  <div
                    className="mb-2 text-[9px] font-extrabold uppercase tracking-[0.14em]"
                    style={{
                      color: accent.main,
                    }}
                  >
                    MODULE {String(module.number).padStart(2, '0')}
                  </div>

                  <h3 className="text-[15px] font-extrabold leading-[1.28] text-[#071B41] sm:text-[15.5px]">
                    {title}
                  </h3>

                  <p className="mt-2 text-[10.5px] leading-[1.5] text-slate-500 sm:text-[11px]">
                    {descriptions[module.number]}
                  </p>

                </div>

                {/* ==================================================
                    PROGRESS LINE
                ================================================== */}

                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-slate-100">
                  <div
                    className="h-full w-full transition-all duration-300 group-hover:h-[5px]"
                    style={{
                      background: `linear-gradient(90deg, ${accent.main}, ${accent.line})`,
                    }}
                  />
                </div>

              </article>
            );
          })}

        </div>

        {/* ==================================================
            BENEFITS STRIP
        ================================================== */}

        <div className="mx-auto mt-7 max-w-[1160px] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_5px_25px_rgba(15,23,42,0.05)]">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">

            <div className="flex items-center justify-center gap-3 px-5 py-3.5 lg:border-r lg:border-slate-200">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                <Zap className="h-5 w-5" />
              </div>

              <span className="text-xs font-bold text-[#071B41]">
                AI-Powered Learning
              </span>
            </div>

            <div className="flex items-center justify-center gap-3 border-t border-slate-200 px-5 py-3.5 sm:border-r lg:border-t-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                <Trophy className="h-5 w-5" />
              </div>

              <span className="text-xs font-bold text-[#071B41]">
                Industry-Relevant Projects
              </span>
            </div>

            <div className="flex items-center justify-center gap-3 border-t border-slate-200 px-5 py-3.5 lg:border-r lg:border-t-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pink-50 text-pink-500">
                <GraduationCap className="h-5 w-5" />
              </div>

              <span className="text-xs font-bold text-[#071B41]">
                Certification & Career Support
              </span>
            </div>

            <div className="flex items-center justify-center gap-3 border-t border-slate-200 px-5 py-3.5 lg:border-t-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-500">
                <Users className="h-5 w-5" />
              </div>

              <span className="text-xs font-bold text-[#071B41]">
                Lifetime Access & Community
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
