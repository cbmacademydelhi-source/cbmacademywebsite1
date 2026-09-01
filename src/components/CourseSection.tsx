import React from 'react';
import {
  Sparkles,
  Zap,
  Trophy,
  GraduationCap,
  Users,
} from 'lucide-react';

interface CourseSectionProps {
  onOpenApply?: (courseName?: string) => void;
  onOpenBrochure?: () => void;
}

/* =========================================================
   MODULE DATA
========================================================= */

const modules = [
  {
    number: '01',
    title: 'AI-Driven Search Engine Optimization (SEO)',
    description:
      'Master search rankings with AI tools, keyword strategies & on-page SEO.',
    color: '#2563EB',
    soft: '#EFF6FF',
    border: '#DBEAFE',
  },
  {
    number: '02',
    title: 'Performance Marketing & Meta Ads Suite',
    description:
      'Run high-converting ads on Google & Meta with performance focus.',
    color: '#16A34A',
    soft: '#F0FDF4',
    border: '#DCFCE7',
  },
  {
    number: '03',
    title: 'Google Ads & Performance Max Mastery',
    description:
      'Drive results with Google Ads, PMax campaigns & smart bidding.',
    color: '#F97316',
    soft: '#FFF7ED',
    border: '#FFEDD5',
  },
  {
    number: '04',
    title: 'AI Content Creation, Copywriting & Media',
    description:
      'Create content that ranks, engages & converts with AI superpowers.',
    color: '#7C3AED',
    soft: '#F5F3FF',
    border: '#EDE9FE',
  },
  {
    number: '05',
    title: 'Web Analytics, GA4 & Looker Dashboards',
    description:
      'Track, analyze & visualize data like a pro with GA4 & Looker.',
    color: '#EAB308',
    soft: '#FEFCE8',
    border: '#FEF3C7',
  },
  {
    number: '06',
    title: 'Organic Social Media Strategy & Growth',
    description:
      'Build brand presence & grow organically across platforms.',
    color: '#EC4899',
    soft: '#FDF2F8',
    border: '#FCE7F3',
  },
  {
    number: '07',
    title: 'Email Marketing & CRM Automation',
    description:
      'Automate, engage & convert with email funnels & smart CRM.',
    color: '#2563EB',
    soft: '#EFF6FF',
    border: '#DBEAFE',
  },
  {
    number: '08',
    title: 'Freelancing, Affiliate & Agency Blueprint',
    description:
      'Build your income streams & scale as a freelancer or agency owner.',
    color: '#14B8A6',
    soft: '#F0FDFA',
    border: '#CCFBF1',
  },
];

/* =========================================================
   SMALL BRAND LOGOS
========================================================= */

const MetaLogo = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
    <svg viewBox="0 0 50 35" className="h-7 w-8">
      <path
        d="M5 27C5 17 10 8 17 8c5 0 8 5 11 10 3-5 6-10 11-10 7 0 11 9 11 19"
        fill="none"
        stroke="#1877F2"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M5 27c4 0 7-6 11-12 4-6 7-7 10-7"
        fill="none"
        stroke="#1877F2"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

const GoogleAdsLogo = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
    <svg viewBox="0 0 50 50" className="h-7 w-7">
      <path
        d="M17 7c-3-1-6 1-8 4L27 43c2 4 7 5 10 2 3-2 4-6 2-10L24 12c-2-3-4-5-7-5Z"
        fill="#34A853"
      />
      <path
        d="M25 12l14 25c2 4 7 5 10 2 3-2 4-6 2-10L37 5c-2-4-7-5-10-2-3 2-4 6-2 9Z"
        fill="#FBBC04"
      />
      <path
        d="M8 38c-2 4 0 8 4 9 3 1 7 0 9-4l5-10-9-16L8 38Z"
        fill="#4285F4"
      />
    </svg>
  </div>
);

const InstagramLogo = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
    <svg viewBox="0 0 50 50" className="h-7 w-7">
      <defs>
        <linearGradient id="igGradientCBM" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#F58529" />
          <stop offset="45%" stopColor="#DD2A7B" />
          <stop offset="100%" stopColor="#8134AF" />
        </linearGradient>
      </defs>
      <rect
        x="7"
        y="7"
        width="36"
        height="36"
        rx="10"
        fill="url(#igGradientCBM)"
      />
      <circle
        cx="25"
        cy="25"
        r="8"
        fill="none"
        stroke="white"
        strokeWidth="3"
      />
      <circle cx="35" cy="15" r="2.5" fill="white" />
    </svg>
  </div>
);

const LinkedInLogo = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
    <svg viewBox="0 0 50 50" className="h-7 w-7">
      <rect x="7" y="7" width="36" height="36" rx="5" fill="#0A66C2" />
      <circle cx="16" cy="18" r="3" fill="white" />
      <rect x="13.5" y="23" width="5" height="14" fill="white" />
      <path
        d="M23 37V23h5v2c1-2 3-3 6-3 5 0 7 3 7 9v6h-5v-6c0-3-1-5-4-5-3 0-4 2-4 5v6Z"
        fill="white"
      />
    </svg>
  </div>
);

/* =========================================================
   ILLUSTRATION 01 - SEO
========================================================= */

const SEOIllustration = ({ color }: { color: string }) => (
  <svg viewBox="0 0 240 180" className="h-full w-full">
    <g opacity="0.35">
      {[0, 1, 2, 3, 4].map((row) =>
        [0, 1, 2, 3, 4].map((col) => (
          <circle
            key={`${row}-${col}`}
            cx={154 + col * 10}
            cy={25 + row * 10}
            r="1.7"
            fill={color}
          />
        ))
      )}
    </g>

    <rect
      x="22"
      y="91"
      width="65"
      height="7"
      rx="3"
      fill="#CBD5E1"
    />

    <rect
      x="22"
      y="105"
      width="48"
      height="6"
      rx="3"
      fill="#E2E8F0"
    />

    <rect
      x="22"
      y="119"
      width="35"
      height="6"
      rx="3"
      fill="#E2E8F0"
    />

    <circle
      cx="105"
      cy="68"
      r="38"
      fill="white"
      stroke={color}
      strokeWidth="7"
    />

    <line
      x1="133"
      y1="96"
      x2="166"
      y2="129"
      stroke={color}
      strokeWidth="10"
      strokeLinecap="round"
    />

    <circle
      cx="174"
      cy="130"
      r="12"
      fill="#EFF6FF"
      stroke={color}
      strokeWidth="2"
    />

    <path
      d="M168 130h12M174 124v12"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />

    <circle cx="49" cy="139" r="5" fill={color} />
  </svg>
);

/* =========================================================
   ILLUSTRATION 02 - PERFORMANCE MARKETING
========================================================= */

const PerformanceIllustration = () => (
  <div className="relative h-full w-full">
    <div className="absolute right-1 top-1 flex gap-2">
      <MetaLogo />
      <GoogleAdsLogo />
    </div>

    <svg viewBox="0 0 240 180" className="h-full w-full">
      <rect
        x="30"
        y="113"
        width="27"
        height="38"
        rx="5"
        fill="#DCFCE7"
      />

      <rect
        x="67"
        y="94"
        width="27"
        height="57"
        rx="5"
        fill="#BBF7D0"
      />

      <rect
        x="104"
        y="70"
        width="27"
        height="81"
        rx="5"
        fill="#86EFAC"
      />

      <rect
        x="141"
        y="43"
        width="27"
        height="108"
        rx="5"
        fill="#4ADE80"
      />

      <path
        d="M27 106L65 84L90 94L121 60L158 28"
        fill="none"
        stroke="#16A34A"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M148 28h12v12"
        fill="none"
        stroke="#16A34A"
        strokeWidth="5"
        strokeLinecap="round"
      />

      <circle cx="65" cy="84" r="4" fill="#16A34A" />
      <circle cx="90" cy="94" r="4" fill="#16A34A" />
      <circle cx="121" cy="60" r="4" fill="#16A34A" />
    </svg>
  </div>
);

/* =========================================================
   ILLUSTRATION 03 - GOOGLE ADS
========================================================= */

const TargetIllustration = () => (
  <div className="relative h-full w-full">
    <svg viewBox="0 0 240 180" className="h-full w-full">
      <circle cx="113" cy="87" r="58" fill="#FFF7ED" />

      <circle
        cx="113"
        cy="87"
        r="46"
        fill="white"
        stroke="#F97316"
        strokeWidth="7"
      />

      <circle
        cx="113"
        cy="87"
        r="31"
        fill="#FFEDD5"
        stroke="#F97316"
        strokeWidth="5"
      />

      <circle cx="113" cy="87" r="13" fill="#F97316" />

      <path
        d="M169 31L121 76"
        stroke="#F97316"
        strokeWidth="7"
        strokeLinecap="round"
      />

      <path
        d="M169 31L162 51M169 31L149 35"
        fill="none"
        stroke="#F97316"
        strokeWidth="5"
        strokeLinecap="round"
      />

      <rect
        x="165"
        y="99"
        width="40"
        height="31"
        rx="8"
        fill="white"
        stroke="#FED7AA"
        strokeWidth="3"
      />

      <path
        d="M174 114h22"
        stroke="#F97316"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>

    <div className="absolute right-0 top-1">
      <GoogleAdsLogo />
    </div>
  </div>
);

/* =========================================================
   ILLUSTRATION 04 - AI CONTENT
========================================================= */

const AIContentIllustration = () => (
  <svg viewBox="0 0 240 180" className="h-full w-full">
    <rect
      x="34"
      y="35"
      width="98"
      height="78"
      rx="14"
      fill="#F5F3FF"
      stroke="#DDD6FE"
      strokeWidth="2"
    />

    <rect
      x="53"
      y="51"
      width="61"
      height="46"
      rx="9"
      fill="#7C3AED"
    />

    <text
      x="83"
      y="82"
      textAnchor="middle"
      fontSize="28"
      fontWeight="800"
      fill="white"
    >
      AI
    </text>

    <path
      d="M161 28L169 47L188 55L169 63L161 82L153 63L134 55L153 47Z"
      fill="#DDD6FE"
    />

    <path
      d="M199 79L204 91L216 96L204 101L199 113L194 101L182 96L194 91Z"
      fill="#C4B5FD"
    />

    <rect
      x="104"
      y="91"
      width="91"
      height="52"
      rx="11"
      fill="white"
      stroke="#E2E8F0"
      strokeWidth="3"
    />

    <rect
      x="117"
      y="103"
      width="62"
      height="29"
      rx="5"
      fill="#EDE9FE"
    />

    <circle cx="129" cy="112" r="4" fill="#7C3AED" />

    <path
      d="M120 126L134 114L144 122L156 112L176 129"
      fill="none"
      stroke="#7C3AED"
      strokeWidth="2.5"
    />
  </svg>
);

/* =========================================================
   ILLUSTRATION 05 - ANALYTICS
========================================================= */

const AnalyticsIllustration = () => (
  <svg viewBox="0 0 240 180" className="h-full w-full">
    <rect
      x="28"
      y="31"
      width="132"
      height="96"
      rx="12"
      fill="white"
      stroke="#E2E8F0"
      strokeWidth="4"
    />

    <rect
      x="43"
      y="45"
      width="48"
      height="7"
      rx="3"
      fill="#FEF3C7"
    />

    <rect
      x="43"
      y="59"
      width="32"
      height="5"
      rx="2"
      fill="#E2E8F0"
    />

    <path
      d="M45 105L66 84L86 92L105 68L127 77L151 48"
      fill="none"
      stroke="#EAB308"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <circle cx="66" cy="84" r="4" fill="#EAB308" />
    <circle cx="86" cy="92" r="4" fill="#EAB308" />
    <circle cx="105" cy="68" r="4" fill="#EAB308" />
    <circle cx="127" cy="77" r="4" fill="#EAB308" />
    <circle cx="151" cy="48" r="4" fill="#EAB308" />

    <circle cx="177" cy="122" r="29" fill="#FEF3C7" />

    <path
      d="M177 93A29 29 0 0 1 201 135"
      fill="none"
      stroke="#EAB308"
      strokeWidth="9"
    />
  </svg>
);

/* =========================================================
   ILLUSTRATION 06 - SOCIAL MEDIA
========================================================= */

const SocialIllustration = () => (
  <div className="relative h-full w-full">
    <svg viewBox="0 0 240 180" className="h-full w-full">
      <circle cx="105" cy="88" r="48" fill="#FDF2F8" />

      <circle cx="99" cy="88" r="32" fill="#EC4899" />

      <circle cx="99" cy="88" r="13" fill="white" />

      <circle cx="99" cy="88" r="6" fill="#EC4899" />

      <circle cx="45" cy="135" r="5" fill="#F9A8D4" />
      <circle cx="177" cy="35" r="5" fill="#EC4899" />

      <rect
        x="126"
        y="39"
        width="43"
        height="43"
        rx="11"
        fill="#DBEAFE"
        transform="rotate(12 147 60)"
      />

      <rect
        x="132"
        y="91"
        width="47"
        height="47"
        rx="12"
        fill="#FCE7F3"
      />

      <path
        d="M155 105C155 98 142 98 142 108C142 116 155 126 155 126C155 126 168 116 168 108C168 98 155 98 155 105Z"
        fill="#EC4899"
      />
    </svg>

    <div className="absolute right-0 top-0 flex flex-col gap-2">
      <InstagramLogo />
      <LinkedInLogo />
    </div>
  </div>
);

/* =========================================================
   ILLUSTRATION 07 - EMAIL CRM
========================================================= */

const EmailIllustration = () => (
  <svg viewBox="0 0 240 180" className="h-full w-full">
    <rect
      x="27"
      y="49"
      width="135"
      height="86"
      rx="14"
      fill="#EFF6FF"
      stroke="#BFDBFE"
      strokeWidth="3"
    />

    <path
      d="M33 58L94 103L156 58"
      fill="none"
      stroke="#2563EB"
      strokeWidth="7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <path
      d="M34 126L76 92"
      stroke="#93C5FD"
      strokeWidth="4"
      strokeLinecap="round"
    />

    <path
      d="M155 126L113 92"
      stroke="#93C5FD"
      strokeWidth="4"
      strokeLinecap="round"
    />

    <circle
      cx="178"
      cy="119"
      r="27"
      fill="white"
      stroke="#DBEAFE"
      strokeWidth="3"
    />

    <circle cx="178" cy="112" r="8" fill="#2563EB" />

    <path
      d="M163 132C166 119 190 119 193 132"
      fill="#2563EB"
    />

    <path
      d="M185 30L191 42L203 48L191 54L185 66L179 54L167 48L179 42Z"
      fill="#DBEAFE"
    />
  </svg>
);

/* =========================================================
   ILLUSTRATION 08 - BUSINESS
========================================================= */

const BusinessIllustration = () => (
  <svg viewBox="0 0 240 180" className="h-full w-full">
    <rect
      x="28"
      y="60"
      width="110"
      height="75"
      rx="14"
      fill="#F0FDFA"
      stroke="#99F6E4"
      strokeWidth="3"
    />

    <path
      d="M55 60V47C55 41 60 37 66 37H100C106 37 111 41 111 47V60"
      fill="none"
      stroke="#14B8A6"
      strokeWidth="7"
    />

    <rect
      x="28"
      y="79"
      width="110"
      height="18"
      fill="#CCFBF1"
    />

    <rect
      x="70"
      y="81"
      width="26"
      height="14"
      rx="3"
      fill="#14B8A6"
    />

    <path
      d="M134 115L158 91L173 102L193 78"
      fill="none"
      stroke="#14B8A6"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <path
      d="M184 78H194V88"
      fill="none"
      stroke="#14B8A6"
      strokeWidth="5"
      strokeLinecap="round"
    />

    <circle cx="170" cy="47" r="13" fill="#CCFBF1" />
  </svg>
);

/* =========================================================
   ILLUSTRATION SELECTOR
========================================================= */

const Illustration = ({
  number,
  color,
}: {
  number: string;
  color: string;
}) => {
  switch (number) {
    case '01':
      return <SEOIllustration color={color} />;

    case '02':
      return <PerformanceIllustration />;

    case '03':
      return <TargetIllustration />;

    case '04':
      return <AIContentIllustration />;

    case '05':
      return <AnalyticsIllustration />;

    case '06':
      return <SocialIllustration />;

    case '07':
      return <EmailIllustration />;

    case '08':
      return <BusinessIllustration />;

    default:
      return null;
  }
};

/* =========================================================
   COURSE SECTION
========================================================= */

export const CourseSection: React.FC<CourseSectionProps> = () => {
  return (
    <section
      id="course"
      className="relative overflow-hidden bg-white py-14 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">

        {/* =================================================
            HEADER
        ================================================= */}

      <div className="mx-auto max-w-[1600px] px-2 sm:px-4 lg:px-5">

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-5 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-orange-600">
            <Sparkles className="h-3.5 w-3.5" />
            MASTER CURRICULUM
          </div>
<h2 className="mx-auto w-full max-w-[1400px] text-center text-3xl font-extrabold leading-[1.1] tracking-tight text-[#071B41] sm:text-4xl md:text-[46px] lg:text-[50px]">
            AI-Powered{' '}
            <span className="bg-gradient-to-r from-[#FF6B00] via-[#F59E0B] to-[#F6D7A7] bg-clip-text text-transparent">
  Digital Marketing
            </span>
            Curriculum
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
            8 power-packed modules. Real-world skills. AI tools. Career-ready
            you.
          </p>

          <div className="mt-5 flex justify-center gap-5">
            <span className="h-[3px] w-9 rounded-full bg-blue-500" />
            <span className="h-[3px] w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
            <span className="h-[3px] w-9 rounded-full bg-purple-500" />
          </div>
        </div>

        {/* =================================================
            MODULE GRID
        ================================================= */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">

          {modules.map((module) => (
            <article
              key={module.number}
              className="group relative h-[270px] overflow-hidden rounded-[22px] border border-[#E5EAF2] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.10)]"
            >

              {/* Pastel glow */}

              <div
                className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-70 blur-3xl transition-transform duration-500 group-hover:scale-125"
                style={{
                  backgroundColor: module.soft,
                }}
              />

              {/* Dotted decoration */}

              <div
                className="pointer-events-none absolute right-5 top-5 h-16 w-16 opacity-40"
                style={{
                  backgroundImage: `radial-gradient(${module.color} 1.2px, transparent 1.2px)`,
                  backgroundSize: '8px 8px',
                }}
              />

              {/* Module number */}

              <div
                className="absolute left-5 top-5 z-30 flex h-11 w-11 items-center justify-center rounded-xl border text-sm font-extrabold"
                style={{
                  backgroundColor: module.soft,
                  borderColor: module.border,
                  color: module.color,
                }}
              >
                {module.number}
              </div>

              {/* Small decorative dot */}

              <div
                className="absolute left-[70px] top-[116px] z-20 h-2 w-2 rounded-full"
                style={{
                  backgroundColor: module.color,
                }}
              />

                            {/* Illustration */}

              <div className="absolute right-0 top-[42px] z-10 h-[160px] w-[220px] transition-all duration-500 group-hover:-translate-y-1 group-hover:scale-[1.04]">
                <Illustration
                  number={module.number}
                  color={module.color}
                />
              </div>

              {/* Text */}

              <div className="absolute bottom-8 left-5 z-30 w-[64%] pr-2">

                <div
                  className="mb-2 text-[9px] font-extrabold uppercase tracking-[0.14em]"
                  style={{
                    color: module.color,
                  }}
                >
                  MODULE {module.number}
                </div>

                <h3 className="text-[15px] font-extrabold leading-[1.25] text-[#071B41] sm:text-[16px]">
                  {module.title}
                </h3>

                <p className="mt-2 text-[11px] leading-[1.45] text-slate-500 sm:text-xs">
                  {module.description}
                </p>
              </div>

              {/* Bottom accent line */}

              <div
                className="absolute bottom-0 left-0 h-[3px] w-full opacity-80 transition-all duration-300 group-hover:h-[5px]"
                style={{
                  backgroundColor: module.color,
                }}
              />

            </article>
          ))}

        </div>

        {/* =================================================
            BENEFITS STRIP
        ================================================= */}

        <div className="mx-auto mt-7 max-w-[1160px] rounded-full border border-slate-200 bg-white px-4 py-3 shadow-[0_5px_20px_rgba(15,23,42,0.04)] sm:px-6">

          <div className="flex flex-col items-center justify-center gap-4 text-center sm:flex-row sm:gap-0">

            {/* Benefit 1 */}

            <div className="flex flex-1 items-center justify-center gap-2 text-xs font-semibold text-slate-700">
              <Zap className="h-5 w-5 text-purple-500" />
              <span>AI-Powered Learning</span>
            </div>

            <div className="hidden h-6 w-px bg-slate-200 sm:block" />

            {/* Benefit 2 */}

            <div className="flex flex-1 items-center justify-center gap-2 text-xs font-semibold text-slate-700">
              <Trophy className="h-5 w-5 text-orange-500" />
              <span>Industry-Relevant Projects</span>
            </div>

            <div className="hidden h-6 w-px bg-slate-200 sm:block" />

            {/* Benefit 3 */}

            <div className="flex flex-1 items-center justify-center gap-2 text-xs font-semibold text-slate-700">
              <GraduationCap className="h-5 w-5 text-pink-500" />
              <span>Certification &amp; Career Support</span>
            </div>

            <div className="hidden h-6 w-px bg-slate-200 sm:block" />

            {/* Benefit 4 */}

            <div className="flex flex-1 items-center justify-center gap-2 text-xs font-semibold text-slate-700">
              <Users className="h-5 w-5 text-blue-500" />
              <span>Lifetime Access &amp; Community</span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
