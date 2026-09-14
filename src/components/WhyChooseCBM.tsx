import React from 'react';
import { WHY_CHOOSE_CBM_CARDS } from '../data/cbmData';

interface WhyChooseCBMProps {
  onOpenApply: () => void;
}

export const WhyChooseCBM: React.FC<WhyChooseCBMProps> = ({ onOpenApply }) => {
  return (
    <section
      id="why-cbm"
      className="relative py-16 sm:py-20 lg:py-24 bg-white overflow-hidden border-b border-slate-100"
    >
      {/* =========================================================
          AMBIENT BACKGROUND CURVES (MATCHING REFERENCE IMAGE)
      ========================================================= */}
      {/* Soft periwinkle/lavender organic wave on the right edge */}
      <div
        className="absolute top-0 right-0 w-[380px] sm:w-[480px] lg:w-[580px] h-full pointer-events-none overflow-hidden select-none"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 500 800"
          fill="none"
          className="w-full h-full object-cover opacity-60"
        >
          <path
            d="M500 0 C320 80 240 280 340 460 C420 600 330 720 500 800 Z"
            fill="url(#ambientRightGrad)"
          />
          <defs>
            <linearGradient id="ambientRightGrad" x1="500" y1="0" x2="300" y2="600" gradientUnits="userSpaceOnUse">
              <stop stopColor="#EEF2FF" stopOpacity="0.8" />
              <stop offset="0.6" stopColor="#E0E7FF" stopOpacity="0.4" />
              <stop offset="1" stopColor="#F5F3FF" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Soft lavender/blue glow on the bottom-left */}
      <div
        className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-blue-50/70 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* =========================================================
            SECTION HEADER
        ========================================================= */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-14">
          {/* Top Pill Badge with 3 Radiating Sparks on Each Side */}
          <div className="inline-flex items-center justify-center gap-2.5 mb-3.5">
            {/* Left Spark Rays */}
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              className="text-[#2563EB]"
              aria-hidden="true"
            >
              <path
                d="M9 12H3"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <path
                d="M10 6L5 3"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <path
                d="M10 18L5 21"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </svg>

            {/* Pill Container */}
            <span className="px-4 py-1.5 rounded-full bg-[#EEF2FF] text-[#312E81] text-[11px] sm:text-xs font-black uppercase tracking-wider border border-indigo-100/80 shadow-2xs">
              Why CBM Academy
            </span>

            {/* Right Spark Rays */}
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              className="text-[#7C3AED]"
              aria-hidden="true"
            >
              <path
                d="M15 12H21"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <path
                d="M14 6L19 3"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <path
                d="M14 18L19 21"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Main Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-slate-900 tracking-tight leading-[1.15]">
            Built for{' '}
            <span className="bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent">
              High-Growth Careers
            </span>
          </h2>

          {/* Subtitle */}
          <p className="mt-3 text-slate-500 text-sm sm:text-[15px] leading-relaxed max-w-2xl mx-auto font-normal">
            Outcome-driven training with live ad budgets, modern AI tools, and
            direct placement support.
          </p>
        </div>

        {/* =========================================================
            FOUR CARDS HORIZONTAL GRID (MATCHING REFERENCE IMAGE)
        ========================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {/* -------------------------------------------------------
              CARD 1: EXPERIENCED TRAINERS (BLUE THEME)
          ------------------------------------------------------- */}
          <div
            onClick={onOpenApply}
            className="group relative bg-white rounded-[26px] border border-[#E9EEF5] shadow-[0_8px_24px_-6px_rgba(15,23,42,0.06)] hover:shadow-[0_16px_36px_-8px_rgba(37,99,235,0.12)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer"
          >
            {/* Top Visual Area with Organic Wave Background */}
            <div className="relative w-full h-[180px] p-4 sm:p-5 flex items-start justify-between">
              {/* Background Gradient & Dual Wave Curves */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 280 180"
                preserveAspectRatio="none"
                fill="none"
              >
                {/* Upper soft sky tint */}
                <rect width="280" height="180" fill="url(#card1TopGrad)" />
                {/* Secondary smooth wave */}
                <path
                  d="M0,110 C80,85 160,145 280,105 L280,180 L0,180 Z"
                  fill="#E0F2FE"
                  fillOpacity="0.8"
                />
                {/* Front white wave transition */}
                <path
                  d="M0,135 C90,115 170,165 280,135 L280,180 L0,180 Z"
                  fill="#FFFFFF"
                />
                <defs>
                  <linearGradient id="card1TopGrad" x1="140" y1="0" x2="140" y2="180" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F0F9FF" />
                    <stop offset="0.7" stopColor="#E0F2FE" stopOpacity="0.6" />
                    <stop offset="1" stopColor="#FFFFFF" />
                  </linearGradient>
                </defs>
              </svg>

              {/* 3D Mortarboard Cap & Book Artwork */}
              <div className="relative z-10 w-32 h-32 flex items-center justify-center -mt-1 ml-1">
                <svg
                  viewBox="0 0 130 130"
                  className="w-full h-full drop-shadow-md"
                  fill="none"
                >
                  {/* Soft Oval Drop Shadow */}
                  <ellipse
                    cx="65"
                    cy="104"
                    rx="40"
                    ry="9"
                    fill="#0284C7"
                    fillOpacity="0.22"
                  />

                  {/* Hardcover Book Underneath */}
                  <g transform="translate(0, 10)">
                    {/* Book Bottom Cover (Navy/Blue) */}
                    <path
                      d="M30 76 L65 89 L100 76 L100 81 L65 94 L30 81 Z"
                      fill="#1E3A8A"
                    />
                    {/* Book Thick Pages Block (White with layered page grooves) */}
                    <path
                      d="M31 71 L65 84 L99 71 L99 78 L65 91 L31 78 Z"
                      fill="#FFFFFF"
                    />
                    <path
                      d="M35 77 L65 88 L95 77"
                      stroke="#E2E8F0"
                      strokeWidth="1.2"
                    />
                    {/* Book Top Cover (Royal Blue) */}
                    <path
                      d="M28 69 L65 82 L102 69 L102 73 L65 86 L28 73 Z"
                      fill="#1D4ED8"
                    />
                    <path
                      d="M30 67 L65 80 L100 67 L65 55 Z"
                      fill="#2563EB"
                    />
                    {/* Spine Highlight */}
                    <path
                      d="M28 69 L65 82"
                      stroke="#60A5FA"
                      strokeWidth="1"
                    />
                  </g>

                  {/* Mortarboard Cap Skull Dome */}
                  <path
                    d="M48 56 C48 68 56 74 65 74 C74 74 82 68 82 56 Z"
                    fill="#172554"
                  />
                  <path
                    d="M49 55 C49 65 56 71 65 71 C74 71 81 65 81 55 Z"
                    fill="#1E40AF"
                  />

                  {/* 3D Mortarboard Diamond Plate */}
                  <g transform="translate(0, -2)">
                    {/* 3D Under-rim Thickness */}
                    <path
                      d="M26 48 L65 62 L104 48 L104 53 L65 67 L26 53 Z"
                      fill="#0F172A"
                    />
                    {/* Diamond Top Surface */}
                    <path
                      d="M65 31 L104 46 L65 60 L26 46 Z"
                      fill="url(#capSurfaceGrad)"
                    />
                    {/* Bevel Highlight along upper edges */}
                    <path
                      d="M26 46 L65 31 L104 46"
                      stroke="#93C5FD"
                      strokeWidth="1.4"
                    />

                    {/* Central Gold Button */}
                    <ellipse
                      cx="65"
                      cy="46"
                      rx="3.8"
                      ry="2.2"
                      fill="#F59E0B"
                    />

                    {/* Elegant Golden Tassel Drape */}
                    <path
                      d="M65 46 C73 47 82 52 84 58 C85.5 63 85 70 86 77"
                      stroke="#F59E0B"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      fill="none"
                    />
                    {/* Tassel Cap & Fringe */}
                    <rect
                      x="83"
                      y="75"
                      width="6"
                      height="10"
                      rx="2"
                      fill="#D97706"
                    />
                    <ellipse
                      cx="86"
                      cy="75"
                      rx="3"
                      ry="1.8"
                      fill="#FBBF24"
                    />
                  </g>

                  {/* Radiating Spark Rays */}
                  <circle cx="98" cy="54" r="1.5" fill="#38BDF8" />
                  <line
                    x1="102"
                    y1="48"
                    x2="108"
                    y2="45"
                    stroke="#38BDF8"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="104"
                    y1="56"
                    x2="110"
                    y2="58"
                    stroke="#38BDF8"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />

                  {/* Gradient Definitions */}
                  <defs>
                    <linearGradient
                      id="capSurfaceGrad"
                      x1="26"
                      y1="31"
                      x2="104"
                      y2="60"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#3B82F6" />
                      <stop offset="0.45" stopColor="#2563EB" />
                      <stop offset="1" stopColor="#1D4ED8" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Metric Badge Pill (Top-Right) */}
              <div className="relative z-10 px-3 py-1.5 rounded-[14px] bg-[#E0F2FE] border border-sky-100/80 text-center shadow-2xs">
                <span className="block text-[15px] font-black text-[#0369A1] leading-none">
                  10+
                </span>
                <span className="block text-[11px] font-bold text-[#0284C7] mt-0.5 leading-none">
                  Years
                </span>
              </div>
            </div>

            {/* Bottom Content Area */}
            <div className="p-5 sm:p-6 pt-2 flex flex-col flex-1 justify-between">
              <div>
                <h3 className="text-[19px] sm:text-[20px] font-black text-slate-900 tracking-tight leading-snug mb-2">
                  {WHY_CHOOSE_CBM_CARDS[0].title}
                </h3>
                <p className="text-[13px] sm:text-[13.5px] text-slate-500 font-normal leading-[1.65]">
                  {WHY_CHOOSE_CBM_CARDS[0].description}
                </p>
              </div>

              {/* Verified Curriculum Standard Pill */}
              <div className="mt-5">
                <div className="w-full py-2 px-3.5 rounded-full bg-[#EFF6FF] border border-blue-100/70 flex items-center justify-center gap-2 text-xs font-semibold text-[#1D4ED8] shadow-2xs">
                  <span className="w-4 h-4 rounded-full bg-[#2563EB] text-white flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 16 16" className="w-2.5 h-2.5 fill-current">
                      <path d="M13.485 3.515a.75.75 0 0 1 0 1.06l-6.5 6.5a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 0 1 1.06-1.06L6.455 9.47l5.97-5.955a.75.75 0 0 1 1.06 0z" />
                    </svg>
                  </span>
                  <span className="truncate">Verified Curriculum Standard</span>
                </div>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------
              CARD 2: PRACTICAL LEARNING (ORANGE THEME)
          ------------------------------------------------------- */}
          <div
            onClick={onOpenApply}
            className="group relative bg-white rounded-[26px] border border-[#E9EEF5] shadow-[0_8px_24px_-6px_rgba(15,23,42,0.06)] hover:shadow-[0_16px_36px_-8px_rgba(234,88,12,0.12)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer"
          >
            {/* Top Visual Area with Organic Wave Background */}
            <div className="relative w-full h-[180px] p-4 sm:p-5 flex items-start justify-between">
              {/* Background Gradient & Dual Wave Curves */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 280 180"
                preserveAspectRatio="none"
                fill="none"
              >
                {/* Upper soft peach tint */}
                <rect width="280" height="180" fill="url(#card2TopGrad)" />
                {/* Secondary smooth wave */}
                <path
                  d="M0,115 C90,135 170,85 280,115 L280,180 L0,180 Z"
                  fill="#FFEDD5"
                  fillOpacity="0.8"
                />
                {/* Front white wave transition */}
                <path
                  d="M0,140 C80,165 180,120 280,140 L280,180 L0,180 Z"
                  fill="#FFFFFF"
                />
                <defs>
                  <linearGradient id="card2TopGrad" x1="140" y1="0" x2="140" y2="180" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFF7ED" />
                    <stop offset="0.7" stopColor="#FFEDD5" stopOpacity="0.6" />
                    <stop offset="1" stopColor="#FFFFFF" />
                  </linearGradient>
                </defs>
              </svg>

              {/* 3D Laptop Artwork with Play Button & Scrubber */}
              <div className="relative z-10 w-32 h-32 flex items-center justify-center -mt-1 ml-1">
                <svg
                  viewBox="0 0 130 130"
                  className="w-full h-full drop-shadow-md"
                  fill="none"
                >
                  {/* Soft Oval Drop Shadow */}
                  <ellipse
                    cx="65"
                    cy="104"
                    rx="40"
                    ry="8"
                    fill="#C2410C"
                    fillOpacity="0.18"
                  />

                  {/* 3D Laptop Unit */}
                  <g transform="translate(4, 8)">
                    {/* Outer Shell Bezel */}
                    <rect
                      x="26"
                      y="22"
                      width="66"
                      height="48"
                      rx="5"
                      fill="#1E293B"
                    />
                    {/* Inner Vibrant Display */}
                    <rect
                      x="29"
                      y="25"
                      width="60"
                      height="42"
                      rx="3"
                      fill="url(#laptopScreenGrad)"
                    />

                    {/* 3D Orange Play Button Circle */}
                    <circle
                      cx="59"
                      cy="44"
                      r="12"
                      fill="url(#orangePlayGrad)"
                      className="drop-shadow-sm"
                    />
                    <polygon
                      points="56,38 66,44 56,50"
                      fill="#FFFFFF"
                    />

                    {/* Video Scrubber Bar */}
                    <rect
                      x="35"
                      y="58"
                      width="48"
                      height="2.5"
                      rx="1.2"
                      fill="#0F172A"
                      fillOpacity="0.45"
                    />
                    <rect
                      x="35"
                      y="58"
                      width="20"
                      height="2.5"
                      rx="1.2"
                      fill="#FF6B00"
                    />
                    <circle
                      cx="55"
                      cy="59.2"
                      r="2.5"
                      fill="#FF6B00"
                    />

                    {/* Metallic Silver-Blue Laptop Base */}
                    <path
                      d="M16 71 L102 71 L95 82 L23 82 Z"
                      fill="#CBD5E1"
                    />
                    <path
                      d="M23 82 L95 82 L95 84 L23 84 Z"
                      fill="#94A3B8"
                    />
                    {/* Trackpad */}
                    <rect
                      x="51"
                      y="73"
                      width="18"
                      height="7"
                      rx="1.5"
                      fill="#94A3B8"
                      fillOpacity="0.55"
                    />
                  </g>

                  {/* Radiating Spark Rays */}
                  <line
                    x1="99"
                    y1="44"
                    x2="105"
                    y2="41"
                    stroke="#FB923C"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="102"
                    y1="51"
                    x2="108"
                    y2="51"
                    stroke="#FB923C"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />

                  {/* Gradient Definitions */}
                  <defs>
                    <linearGradient
                      id="laptopScreenGrad"
                      x1="29"
                      y1="25"
                      x2="89"
                      y2="67"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#3B82F6" />
                      <stop offset="1" stopColor="#1E3A8A" />
                    </linearGradient>
                    <linearGradient
                      id="orangePlayGrad"
                      x1="47"
                      y1="32"
                      x2="71"
                      y2="56"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#FB923C" />
                      <stop offset="1" stopColor="#EA580C" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Metric Badge Pill (Top-Right) */}
              <div className="relative z-10 px-3 py-1.5 rounded-[14px] bg-[#FFEDD5] border border-orange-100/80 text-center shadow-2xs">
                <span className="block text-[15px] font-black text-[#C2410C] leading-none">
                  80%
                </span>
                <span className="block text-[11px] font-bold text-[#EA580C] mt-0.5 leading-none">
                  Live
                </span>
              </div>
            </div>

            {/* Bottom Content Area */}
            <div className="p-5 sm:p-6 pt-2 flex flex-col flex-1 justify-between">
              <div>
                <h3 className="text-[19px] sm:text-[20px] font-black text-slate-900 tracking-tight leading-snug mb-2">
                  {WHY_CHOOSE_CBM_CARDS[1].title}
                </h3>
                <p className="text-[13px] sm:text-[13.5px] text-slate-500 font-normal leading-[1.65]">
                  {WHY_CHOOSE_CBM_CARDS[1].description}
                </p>
              </div>

              {/* Verified Curriculum Standard Pill */}
              <div className="mt-5">
                <div className="w-full py-2 px-3.5 rounded-full bg-[#FFF7ED] border border-orange-100/70 flex items-center justify-center gap-2 text-xs font-semibold text-[#C2410C] shadow-2xs">
                  <span className="w-4 h-4 rounded-full bg-[#EA580C] text-white flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 16 16" className="w-2.5 h-2.5 fill-current">
                      <path d="M13.485 3.515a.75.75 0 0 1 0 1.06l-6.5 6.5a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 0 1 1.06-1.06L6.455 9.47l5.97-5.955a.75.75 0 0 1 1.06 0z" />
                    </svg>
                  </span>
                  <span className="truncate">Verified Curriculum Standard</span>
                </div>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------
              CARD 3: INDUSTRY PROJECTS (GREEN THEME)
          ------------------------------------------------------- */}
          <div
            onClick={onOpenApply}
            className="group relative bg-white rounded-[26px] border border-[#E9EEF5] shadow-[0_8px_24px_-6px_rgba(15,23,42,0.06)] hover:shadow-[0_16px_36px_-8px_rgba(22,163,74,0.12)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer"
          >
            {/* Top Visual Area with Organic Wave Background */}
            <div className="relative w-full h-[180px] p-4 sm:p-5 flex items-start justify-between">
              {/* Background Gradient & Dual Wave Curves */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 280 180"
                preserveAspectRatio="none"
                fill="none"
              >
                {/* Upper soft mint tint */}
                <rect width="280" height="180" fill="url(#card3TopGrad)" />
                {/* Secondary smooth wave */}
                <path
                  d="M0,110 C80,85 160,140 280,105 L280,180 L0,180 Z"
                  fill="#DCFCE7"
                  fillOpacity="0.8"
                />
                {/* Front white wave transition */}
                <path
                  d="M0,135 C90,115 170,165 280,135 L280,180 L0,180 Z"
                  fill="#FFFFFF"
                />
                <defs>
                  <linearGradient id="card3TopGrad" x1="140" y1="0" x2="140" y2="180" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F0FDF4" />
                    <stop offset="0.7" stopColor="#DCFCE7" stopOpacity="0.6" />
                    <stop offset="1" stopColor="#FFFFFF" />
                  </linearGradient>
                </defs>
              </svg>

              {/* 3D Analytics Easel / Growth Board & AI Tag Artwork */}
              <div className="relative z-10 w-32 h-32 flex items-center justify-center -mt-1 ml-1">
                <svg
                  viewBox="0 0 130 130"
                  className="w-full h-full drop-shadow-md"
                  fill="none"
                >
                  {/* Soft Oval Drop Shadow */}
                  <ellipse
                    cx="65"
                    cy="104"
                    rx="40"
                    ry="8"
                    fill="#15803D"
                    fillOpacity="0.18"
                  />

                  {/* Angled White Canvas / Board */}
                  <g transform="translate(6, 6)">
                    {/* Board Surface */}
                    <rect
                      x="23"
                      y="26"
                      width="64"
                      height="54"
                      rx="6"
                      fill="#FFFFFF"
                      stroke="#E2E8F0"
                      strokeWidth="1.5"
                    />

                    {/* 4 Ascending 3D Green Bar Charts */}
                    <rect
                      x="32"
                      y="60"
                      width="7"
                      height="13"
                      rx="2.5"
                      fill="url(#greenBarGrad)"
                    />
                    <rect
                      x="42"
                      y="51"
                      width="7"
                      height="22"
                      rx="2.5"
                      fill="url(#greenBarGrad)"
                    />
                    <rect
                      x="52"
                      y="42"
                      width="7"
                      height="31"
                      rx="2.5"
                      fill="url(#greenBarGrad)"
                    />
                    <rect
                      x="62"
                      y="33"
                      width="7"
                      height="40"
                      rx="2.5"
                      fill="url(#greenBarGrad)"
                    />

                    {/* Upward Trending Arrow Line */}
                    <path
                      d="M31 62 Q 46 52 69 31"
                      stroke="#10B981"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <polygon
                      points="69,25 74,33 65,32"
                      fill="#10B981"
                    />

                    {/* Floating Green AI Badge */}
                    <rect
                      x="70"
                      y="16"
                      width="20"
                      height="14"
                      rx="4"
                      fill="#10B981"
                      className="drop-shadow-xs"
                    />
                    <text
                      x="80"
                      y="26.5"
                      fill="#FFFFFF"
                      fontSize="8.5"
                      fontWeight="900"
                      textAnchor="middle"
                    >
                      AI
                    </text>
                  </g>

                  {/* Radiating Spark Rays */}
                  <line
                    x1="101"
                    y1="48"
                    x2="107"
                    y2="45"
                    stroke="#34D399"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="102"
                    y1="56"
                    x2="108"
                    y2="58"
                    stroke="#34D399"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />

                  {/* Gradients */}
                  <defs>
                    <linearGradient
                      id="greenBarGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop stopColor="#34D399" />
                      <stop offset="1" stopColor="#059669" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Metric Badge Pill (Top-Right) */}
              <div className="relative z-10 px-3 py-1.5 rounded-[14px] bg-[#DCFCE7] border border-emerald-100/80 text-center shadow-2xs">
                <span className="block text-[15px] font-black text-[#15803D] leading-none">
                  15+
                </span>
                <span className="block text-[11px] font-bold text-[#16A34A] mt-0.5 leading-none">
                  Projects
                </span>
              </div>
            </div>

            {/* Bottom Content Area */}
            <div className="p-5 sm:p-6 pt-2 flex flex-col flex-1 justify-between">
              <div>
                <h3 className="text-[19px] sm:text-[20px] font-black text-slate-900 tracking-tight leading-snug mb-2">
                  {WHY_CHOOSE_CBM_CARDS[2].title}
                </h3>
                <p className="text-[13px] sm:text-[13.5px] text-slate-500 font-normal leading-[1.65]">
                  {WHY_CHOOSE_CBM_CARDS[2].description}
                </p>
              </div>

              {/* Verified Curriculum Standard Pill */}
              <div className="mt-5">
                <div className="w-full py-2 px-3.5 rounded-full bg-[#F0FDF4] border border-emerald-100/70 flex items-center justify-center gap-2 text-xs font-semibold text-[#15803D] shadow-2xs">
                  <span className="w-4 h-4 rounded-full bg-[#16A34A] text-white flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 16 16" className="w-2.5 h-2.5 fill-current">
                      <path d="M13.485 3.515a.75.75 0 0 1 0 1.06l-6.5 6.5a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 0 1 1.06-1.06L6.455 9.47l5.97-5.955a.75.75 0 0 1 1.06 0z" />
                    </svg>
                  </span>
                  <span className="truncate">Verified Curriculum Standard</span>
                </div>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------
              CARD 4: PLACEMENT SUPPORT (PURPLE THEME)
          ------------------------------------------------------- */}
          <div
            onClick={onOpenApply}
            className="group relative bg-white rounded-[26px] border border-[#E9EEF5] shadow-[0_8px_24px_-6px_rgba(15,23,42,0.06)] hover:shadow-[0_16px_36px_-8px_rgba(124,58,237,0.12)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer"
          >
            {/* Top Visual Area with Organic Wave Background */}
            <div className="relative w-full h-[180px] p-4 sm:p-5 flex items-start justify-between">
              {/* Background Gradient & Dual Wave Curves */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 280 180"
                preserveAspectRatio="none"
                fill="none"
              >
                {/* Upper soft lilac tint */}
                <rect width="280" height="180" fill="url(#card4TopGrad)" />
                {/* Secondary smooth wave */}
                <path
                  d="M0,115 C85,90 175,135 280,110 L280,180 L0,180 Z"
                  fill="#F3E8FF"
                  fillOpacity="0.8"
                />
                {/* Front white wave transition */}
                <path
                  d="M0,140 C85,115 175,165 280,140 L280,180 L0,180 Z"
                  fill="#FFFFFF"
                />
                <defs>
                  <linearGradient id="card4TopGrad" x1="140" y1="0" x2="140" y2="180" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FAF5FF" />
                    <stop offset="0.7" stopColor="#F3E8FF" stopOpacity="0.6" />
                    <stop offset="1" stopColor="#FFFFFF" />
                  </linearGradient>
                </defs>
              </svg>

              {/* 3D Purple Briefcase & ID Badge Artwork */}
              <div className="relative z-10 w-32 h-32 flex items-center justify-center -mt-1 ml-1">
                <svg
                  viewBox="0 0 130 130"
                  className="w-full h-full drop-shadow-md"
                  fill="none"
                >
                  {/* Soft Oval Drop Shadow */}
                  <ellipse
                    cx="61"
                    cy="104"
                    rx="38"
                    ry="8"
                    fill="#7C3AED"
                    fillOpacity="0.18"
                  />

                  {/* 3D Briefcase Body & Handle */}
                  <g transform="translate(6, 6)">
                    {/* Top Curved Handle */}
                    <path
                      d="M40 33 C40 25 45 22 53 22 C61 22 66 25 66 33"
                      stroke="#5B21B6"
                      strokeWidth="4"
                      strokeLinecap="round"
                      fill="none"
                    />

                    {/* Briefcase Main Body */}
                    <rect
                      x="25"
                      y="33"
                      width="56"
                      height="46"
                      rx="7"
                      fill="url(#purpleBagGrad)"
                    />
                    {/* Briefcase Flap */}
                    <path
                      d="M25 38 C25 35 28 33 31 33 L75 33 C78 33 81 35 81 38 L81 54 C81 57 73 62 53 62 C33 62 25 57 25 54 Z"
                      fill="#6D28D9"
                    />

                    {/* Metallic Golden Clasp */}
                    <rect
                      x="49"
                      y="53"
                      width="8"
                      height="11"
                      rx="2"
                      fill="#FCD34D"
                      stroke="#F59E0B"
                      strokeWidth="0.8"
                    />
                    <circle cx="53" cy="58.5" r="1.2" fill="#78350F" />

                    {/* Laminated ID Badge Card */}
                    <g transform="translate(52, 46)">
                      {/* ID Card Shadow */}
                      <rect
                        x="0"
                        y="0"
                        width="32"
                        height="24"
                        rx="3.5"
                        fill="#0F172A"
                        fillOpacity="0.12"
                        transform="translate(1.5, 1.5)"
                      />
                      {/* ID Card Base */}
                      <rect
                        x="0"
                        y="0"
                        width="32"
                        height="24"
                        rx="3.5"
                        fill="#FFFFFF"
                        stroke="#E2E8F0"
                        strokeWidth="1"
                      />
                      {/* Avatar Photo */}
                      <circle
                        cx="9"
                        cy="12"
                        r="5"
                        fill="#818CF8"
                      />
                      <circle cx="9" cy="10.5" r="2.2" fill="#FFFFFF" />
                      <path
                        d="M5.5 15.5 C5.5 13.8 7 12.8 9 12.8 C11 12.8 12.5 13.8 12.5 15.5"
                        fill="#FFFFFF"
                      />

                      {/* Detail Lines */}
                      <rect
                        x="17"
                        y="7.5"
                        width="11"
                        height="2"
                        rx="1"
                        fill="#6366F1"
                      />
                      <rect
                        x="17"
                        y="12"
                        width="8.5"
                        height="1.5"
                        rx="0.75"
                        fill="#CBD5E1"
                      />
                      <rect
                        x="17"
                        y="15.5"
                        width="10"
                        height="1.5"
                        rx="0.75"
                        fill="#CBD5E1"
                      />
                    </g>
                  </g>

                  {/* Radiating Spark Rays */}
                  <line
                    x1="98"
                    y1="42"
                    x2="104"
                    y2="38"
                    stroke="#A855F7"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="101"
                    y1="50"
                    x2="107"
                    y2="50"
                    stroke="#A855F7"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />

                  {/* Gradients */}
                  <defs>
                    <linearGradient
                      id="purpleBagGrad"
                      x1="25"
                      y1="33"
                      x2="81"
                      y2="79"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#8B5CF6" />
                      <stop offset="0.5" stopColor="#7C3AED" />
                      <stop offset="1" stopColor="#6D28D9" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Metric Badge Pill (Top-Right) */}
              <div className="relative z-10 px-3 py-1.5 rounded-[14px] bg-[#F3E8FF] border border-purple-100/80 text-center shadow-2xs">
                <span className="block text-[15px] font-black text-[#7E22CE] leading-none">
                  100%
                </span>
                <span className="block text-[11px] font-bold text-[#9333EA] mt-0.5 leading-none">
                  Help
                </span>
              </div>
            </div>

            {/* Bottom Content Area */}
            <div className="p-5 sm:p-6 pt-2 flex flex-col flex-1 justify-between">
              <div>
                <h3 className="text-[19px] sm:text-[20px] font-black text-slate-900 tracking-tight leading-snug mb-2">
                  {WHY_CHOOSE_CBM_CARDS[3].title}
                </h3>
                <p className="text-[13px] sm:text-[13.5px] text-slate-500 font-normal leading-[1.65]">
                  {WHY_CHOOSE_CBM_CARDS[3].description}
                </p>
              </div>

              {/* Verified Curriculum Standard Pill */}
              <div className="mt-5">
                <div className="w-full py-2 px-3.5 rounded-full bg-[#FAF5FF] border border-purple-100/70 flex items-center justify-center gap-2 text-xs font-semibold text-[#7E22CE] shadow-2xs">
                  <span className="w-4 h-4 rounded-full bg-[#9333EA] text-white flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 16 16" className="w-2.5 h-2.5 fill-current">
                      <path d="M13.485 3.515a.75.75 0 0 1 0 1.06l-6.5 6.5a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 0 1 1.06-1.06L6.455 9.47l5.97-5.955a.75.75 0 0 1 1.06 0z" />
                    </svg>
                  </span>
                  <span className="truncate">Verified Curriculum Standard</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
