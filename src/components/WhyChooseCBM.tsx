import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { SMOOTH_EASE_OUT, VIEWPORT_ONCE } from '../lib/animations';

interface WhyChooseCBMProps {
  onOpenApply?: () => void;
}

interface CardItem {
  id: string;
  badgeNumber: string;
  badgeLabel: string;
  title: string;
  description: string;
  renderIcon: () => React.ReactNode;
}

const CARDS: CardItem[] = [
  {
    id: 'card-1',
    badgeNumber: '10+',
    badgeLabel: 'Years',
    title: 'Experienced Trainers',
    description:
      'Learn from agency leads and certified marketers with 10+ years of live campaign experience.',
    renderIcon: () => (
      <svg
        className="w-20 h-16 sm:w-22 sm:h-18 drop-shadow-md"
        viewBox="0 0 100 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="capGlow" cx="50%" cy="80%" r="60%">
            <stop offset="0%" stopColor="#2D323E" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#2D323E" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="capTopGrad" x1="15" y1="20" x2="85" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3A3F4D" />
            <stop offset="45%" stopColor="#222630" />
            <stop offset="100%" stopColor="#14171F" />
          </linearGradient>
          <linearGradient id="tasselGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFE066" />
            <stop offset="60%" stopColor="#FF6B00" />
            <stop offset="100%" stopColor="#FF6B00" />
          </linearGradient>
        </defs>

        {/* Ambient shadow beneath cap */}
        <ellipse cx="50" cy="58" rx="34" ry="10" fill="url(#capGlow)" />

        {/* Cap Skull Base */}
        <path
          d="M32 38C32 38 32 54 50 54C68 54 68 38 68 38L62 36C62 47 50 49 50 49C50 49 38 47 38 36L32 38Z"
          fill="#1A1D24"
        />

        {/* Diamond Mortarboard Top (3D Perspective) */}
        <polygon
          points="50,15 88,31 50,47 12,31"
          fill="url(#capTopGrad)"
        />

        {/* Top Edge Highlights for 3D realism */}
        <path
          d="M12 31L50 15L88 31"
          stroke="#555C6D"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M12 31L50 47L88 31"
          stroke="#111318"
          strokeWidth="1.4"
          strokeLinecap="round"
        />

        {/* Center Button */}
        <ellipse cx="50" cy="31" rx="3.5" ry="2.2" fill="url(#tasselGrad)" />

        {/* Golden Tassel Cord draped over the edge */}
        <path
          d="M50 31 Q 68 32 74 42 Q 77 47 77 56"
          stroke="url(#tasselGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Tassel Cap & Fringe */}
        <ellipse cx="77" cy="56" rx="3" ry="1.8" fill="#FF6B00" />
        <path
          d="M74 57L73 66C73 67 81 67 81 66L80 57Z"
          fill="url(#tasselGrad)"
        />
      </svg>
    ),
  },
  {
    id: 'card-2',
    badgeNumber: '80%',
    badgeLabel: 'Live',
    title: 'Practical Learning',
    description:
      '80% hands-on training executing live campaigns with real marketing budgets.',
    renderIcon: () => (
      <svg
        className="w-20 h-16 sm:w-22 sm:h-18 drop-shadow-md"
        viewBox="0 0 100 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="laptopBezel" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#333742" />
            <stop offset="100%" stopColor="#1E2129" />
          </linearGradient>
          <linearGradient id="playGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B00" />
            <stop offset="100%" stopColor="#FF6B00" />
          </linearGradient>
        </defs>

        {/* Sound/Energy Rays (Right side) */}
        <path d="M82 23L88 20" stroke="#FF6B00" strokeWidth="2.8" strokeLinecap="round" />
        <path d="M84 32L91 32" stroke="#FF6B00" strokeWidth="2.8" strokeLinecap="round" />
        <path d="M82 41L88 44" stroke="#FF6B00" strokeWidth="2.8" strokeLinecap="round" />

        {/* Sound/Energy Rays (Left side) */}
        <path d="M18 23L12 20" stroke="#FF6B00" strokeWidth="2.8" strokeLinecap="round" />
        <path d="M16 32L9 32" stroke="#FF6B00" strokeWidth="2.8" strokeLinecap="round" />
        <path d="M18 41L12 44" stroke="#FF6B00" strokeWidth="2.8" strokeLinecap="round" />

        {/* Laptop Display Shell */}
        <rect x="23" y="15" width="54" height="35" rx="3.5" fill="url(#laptopBezel)" />
        {/* Inner Screen */}
        <rect x="26" y="18" width="48" height="29" rx="2" fill="#0F1117" />

        {/* Orange Glowing Play Circle */}
        <circle cx="50" cy="32.5" r="11" fill="url(#playGrad)" />
        {/* Triangle Play Symbol */}
        <polygon points="47,27.5 56,32.5 47,37.5" fill="#FFFFFF" />

        {/* Screen Bottom Bar Accent */}
        <rect x="36" y="44" width="28" height="1.5" rx="0.75" fill="#FF6B00" fillOpacity="0.8" />


        {/* Laptop Base (3D Bevel) */}
        <path
          d="M17 50C17 48.8 18 48 19.2 48H80.8C82 48 83 48.8 83 50L80 54.5C79.5 55.4 78.5 56 77.4 56H22.6C21.5 56 20.5 55.4 20 54.5L17 50Z"
          fill="#474D5C"
        />
        {/* Trackpad Notch */}
        <rect x="44" y="49" width="12" height="2" rx="1" fill="#71788A" />
      </svg>
    ),
  },
  {
    id: 'card-3',
    badgeNumber: '15+',
    badgeLabel: 'Projects',
    title: 'Industry Projects',
    description:
      'Build an employer-ready portfolio with 15+ live client case studies and capstones.',
    renderIcon: () => (
      <svg
        className="w-20 h-16 sm:w-22 sm:h-18 drop-shadow-md"
        viewBox="0 0 100 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="barGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF6B00" />
            <stop offset="100%" stopColor="#FF6B00" />
          </linearGradient>
          <linearGradient id="barTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFA05C" />
            <stop offset="100%" stopColor="#FF6B00" />
          </linearGradient>
          <linearGradient id="arrowGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF6B00" />
            <stop offset="60%" stopColor="#FFA05C" />
            <stop offset="100%" stopColor="#FF6B00" />
          </linearGradient>
        </defs>

        {/* 3D Ascending Bars */}
        {/* Bar 1 (Short) */}
        <rect x="25" y="45" width="9" height="15" rx="2" fill="url(#barGrad)" />
        <rect x="25" y="43" width="9" height="3" rx="1.5" fill="url(#barTop)" />

        {/* Bar 2 (Medium-Low) */}
        <rect x="38" y="36" width="9.5" height="24" rx="2" fill="url(#barGrad)" />
        <rect x="38" y="34" width="9.5" height="3" rx="1.5" fill="url(#barTop)" />

        {/* Bar 3 (Medium-High) */}
        <rect x="52" y="27" width="9.5" height="33" rx="2" fill="url(#barGrad)" />
        <rect x="52" y="25" width="9.5" height="3" rx="1.5" fill="url(#barTop)" />

        {/* Bar 4 (High) */}
        <rect x="66" y="18" width="9.5" height="42" rx="2" fill="url(#barGrad)" />
        <rect x="66" y="16" width="9.5" height="3" rx="1.5" fill="url(#barTop)" />

        {/* 3D Dynamic Curved Growth Arrow */}
        <path
          d="M21 44 C 34 40, 50 28, 76 13"
          stroke="url(#arrowGrad)"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        {/* Arrow Tip Head */}
        <polygon points="76,8 82,18 70,16" fill="#FF6B00" />
      </svg>
    ),
  },
  {
    id: 'card-4',
    badgeNumber: '100%',
    badgeLabel: 'Help',
    title: 'Placement Support',
    description:
      'Dedicated 1-on-1 placement support, resume reviews, mock interviews, and hiring drives.',
    renderIcon: () => (
      <svg
        className="w-20 h-16 sm:w-22 sm:h-18 drop-shadow-md"
        viewBox="0 0 100 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="leatherGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF6B00" />
            <stop offset="50%" stopColor="#A83707" />
            <stop offset="100%" stopColor="#7C2D12" />
          </linearGradient>
          <linearGradient id="goldBuckle" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
        </defs>

        {/* Briefcase Handle */}
        <path
          d="M38 18C38 13.5 42 10 47 10H53C58 10 62 13.5 62 18V20H38V18Z"
          stroke="#7C2D12"
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Handle Gold Mounts */}
        <rect x="36" y="17" width="5" height="4" rx="1.5" fill="url(#goldBuckle)" />
        <rect x="59" y="17" width="5" height="4" rx="1.5" fill="url(#goldBuckle)" />

        {/* Briefcase Main Body */}
        <rect x="22" y="20" width="56" height="42" rx="7" fill="url(#leatherGrad)" />

        {/* Front Flap Horizontal Seam with Depth */}
        <path
          d="M22 36C22 36 38 41 50 41C62 41 78 36 78 36"
          stroke="#5F1E08"
          strokeWidth="2.5"
          fill="none"
        />

        {/* Gold Clasp in Center */}
        <rect x="46" y="34" width="8" height="9" rx="2" fill="url(#goldBuckle)" />
        <circle cx="50" cy="38.5" r="1.2" fill="#78350F" />

        {/* Subtle Highlight on Bottom Edges */}
        <path
          d="M26 60H74"
          stroke="#FF6B00"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export const WhyChooseCBM: React.FC<WhyChooseCBMProps> = ({ onOpenApply }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="why-cbm"
      className="py-12 sm:py-16 bg-[#FAFAFA] border-b border-slate-100 relative overflow-hidden"
    >
      {/* =========================================================
          BACKGROUND DECORATIVE WATERMARKS & SUBTLE ACCENTS
      ========================================================= */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden select-none"
        aria-hidden="true"
      >
        {/* Very Faint Ambient Warmth */}
        <div
          className="absolute -top-36 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(255, 107, 0, 0.05) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* =========================================================
            HEADING AREA
        ========================================================= */}
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-10">
          {/* Top Pill with Parallel Golden Horizontal Lines */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.45, ease: SMOOTH_EASE_OUT }}
            className="flex items-center justify-center gap-3 sm:gap-3.5 mb-3.5"
          >
            {/* Left 2 Golden Lines */}
            <div className="flex flex-col gap-1 items-end">
              <div className="h-[2px] w-7 sm:w-8 rounded-full bg-[#FF6B00]" />
              <div className="h-[2px] w-4 sm:w-5 rounded-full bg-[#FF6B00]" />
            </div>

            {/* Pill Container */}
            <div className="px-5 sm:px-6 py-1.5 rounded-full border border-orange-200 bg-orange-50 shadow-2xs">
              <span className="text-[#FF6B00] font-extrabold text-[11.5px] sm:text-[13px] tracking-wider uppercase">
                WHY CBM ACADEMY
              </span>
            </div>

            {/* Right 2 Golden Lines */}
            <div className="flex flex-col gap-1 items-start">
              <div className="h-[2px] w-7 sm:w-8 rounded-full bg-[#FF6B00]" />
              <div className="h-[2px] w-4 sm:w-5 rounded-full bg-[#FF6B00]" />
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h2
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.5, delay: 0.08, ease: SMOOTH_EASE_OUT }}
            className="text-3xl sm:text-4xl lg:text-[44px] font-black text-[#072B57] tracking-tight leading-[1.15]"
          >
            Built for{' '}
            <span className="text-[#FF6B00]">
              High-Growth Careers
            </span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.5, delay: 0.15, ease: SMOOTH_EASE_OUT }}
            className="mt-3 text-slate-600 text-sm sm:text-base lg:text-[16.5px] font-normal leading-relaxed max-w-2xl mx-auto"
          >
            Outcome-driven training with live ad budgets, modern AI tools, and
            direct placement support.
          </motion.p>
        </div>

        {/* 4 EQUAL CARDS HORIZONTALLY ON DESKTOP */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 items-stretch">
          {CARDS.map((card, index) => (
            <motion.article
              key={card.id}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT_ONCE}
              transition={{
                duration: 0.45,
                delay: 0.08 * (index + 1),
                ease: SMOOTH_EASE_OUT,
              }}
              onClick={onOpenApply}
              className="group relative bg-white hover:bg-white rounded-[20px] border border-slate-200/90 hover:border-[#FF6B00]/40 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(255,107,0,0.12)] hover:-translate-y-1.5 transition-all duration-300 p-6 flex flex-col justify-start cursor-pointer h-full"
            >
              {/* Top Row: Illustrated 3D Graphic (Left) & Soft Badge (Right) */}
              <div className="flex items-center justify-between gap-3">
                {/* 3D Illustration */}
                <div className="w-[104px] h-[92px] sm:w-[110px] sm:h-[96px] rounded-2xl bg-orange-50/60 border border-orange-100/80 flex items-center justify-center relative group-hover:scale-105 transition-transform duration-300 shrink-0">
                  {card.renderIcon()}
                </div>

                {/* Badge */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-center flex flex-col items-center justify-center min-w-[74px] shadow-2xs">
                  <span className="text-xl sm:text-[22px] font-black text-[#FF6B00] leading-none">
                    {card.badgeNumber}
                  </span>
                  <span className="text-xs sm:text-[13px] font-bold text-slate-500 leading-none mt-1">
                    {card.badgeLabel}
                  </span>
                </div>
              </div>

              {/* Card Title */}
              <h3 className="mt-5 sm:mt-6 text-xl sm:text-[21px] font-black text-[#072B57] group-hover:text-[#FF6B00] transition-colors tracking-tight leading-snug">
                {card.title}
              </h3>

              {/* Body Text */}
              <p className="mt-2.5 text-[14px] sm:text-[14.5px] text-slate-600 font-normal leading-[1.6]">
                {card.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
