import React, { useState, useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Download, Upload, RotateCcw, X, CheckCircle2 } from 'lucide-react';
import { SMOOTH_EASE_OUT, VIEWPORT_ONCE } from '../lib/animations';

interface WhyChooseCBMProps {
  onOpenApply?: () => void;
  onOpenBrochure?: () => void;
}

interface CardItem {
  id: string;
  title: string;
  description: string;
  renderIcon: () => React.ReactNode;
}

const CARDS: CardItem[] = [
  {
    id: 'card-career-growth',
    title: 'Career Growth',
    description:
      'Practical assignments, live campaign simulations and AI-powered workflows.',
    renderIcon: () => (
      <svg
        className="w-7 h-7"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M3 20L21 20" stroke="#072B57" strokeWidth="1.8" strokeLinecap="round" />
        <rect x="5" y="13" width="3" height="7" rx="1" fill="#072B57" />
        <rect x="10.5" y="9" width="3" height="11" rx="1" fill="#072B57" />
        <rect x="16" y="5" width="3" height="15" rx="1" fill="#FF6B00" />
        <path d="M4 14L10 8L15 12L20 4M20 4H15M20 4V9" stroke="#FF6B00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'card-experienced-trainers',
    title: 'Experienced Trainers',
    description:
      'Learn from experienced digital marketing professionals.',
    renderIcon: () => (
      <svg
        className="w-7 h-7"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M22 10V16M2 10L12 5L22 10L12 15L2 10Z" stroke="#072B57" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 12.5V17C6 17 8.5 19.5 12 19.5C15.5 19.5 18 17 18 17V12.5" stroke="#FF6B00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'card-hands-on-learning',
    title: 'Hands-On Learning',
    description:
      'Build skills through practical campaigns, assignments and real-world projects.',
    renderIcon: () => (
      <svg
        className="w-7 h-7"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect x="3" y="4" width="18" height="12" rx="2" stroke="#072B57" strokeWidth="1.8" />
        <path d="M2 18H22" stroke="#072B57" strokeWidth="1.8" strokeLinecap="round" />
        <polygon points="10,8 15,10 10,12" fill="#FF6B00" />
      </svg>
    ),
  },
  {
    id: 'card-ai-powered-skills',
    title: 'AI-Powered Skills',
    description:
      'Learn modern AI tools for content, research, analytics and automation.',
    renderIcon: () => (
      <svg
        className="w-7 h-7"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect x="4" y="4" width="16" height="16" rx="3" stroke="#072B57" strokeWidth="1.8" />
        <rect x="8.5" y="8.5" width="7" height="7" rx="1.5" fill="#FF6B00" />
        <path d="M9 1V4M15 1V4M9 20V23M15 20V23M1 9H4M1 15H4M20 9H23M20 15H23" stroke="#072B57" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
];

export const WhyChooseCBM: React.FC<WhyChooseCBMProps> = ({
  onOpenApply,
  onOpenBrochure,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const DEFAULT_BANNER =
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600&auto=format&fit=crop';

  const [bannerUrl, setBannerUrl] = useState<string>(DEFAULT_BANNER);
  const [isCustomBanner, setIsCustomBanner] = useState<boolean>(false);
  const [showUrlPrompt, setShowUrlPrompt] = useState<boolean>(false);
  const [urlInput, setUrlInput] = useState<string>('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cbm_mid_page_banner');
      if (saved) {
        setBannerUrl(saved);
        setIsCustomBanner(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setBannerUrl(reader.result);
          setIsCustomBanner(true);
          try {
            localStorage.setItem('cbm_mid_page_banner', reader.result);
          } catch {
            // ignore
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      setBannerUrl(urlInput.trim());
      setIsCustomBanner(true);
      try {
        localStorage.setItem('cbm_mid_page_banner', urlInput.trim());
      } catch {
        // ignore
      }
      setShowUrlPrompt(false);
      setUrlInput('');
    }
  };

  const handleResetBanner = () => {
    setBannerUrl(DEFAULT_BANNER);
    setIsCustomBanner(false);
    try {
      localStorage.removeItem('cbm_mid_page_banner');
    } catch {
      // ignore
    }
  };

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
            INTRO / VALUE SECTION (DIGITAL MARKETING ACADEMY)
        ========================================================= */}
        <div className="relative mb-14 sm:mb-18 pb-10 sm:pb-14 border-b border-slate-200/80">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-14 items-center">
            {/* Left Column on Desktop / Bottom on Mobile: Modern Classroom Image + Floating Cards */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT_ONCE}
              transition={{ duration: 0.55, delay: 0.1, ease: SMOOTH_EASE_OUT }}
              className="lg:col-span-6 order-2 lg:order-1 relative pt-4 pb-4 px-2 sm:px-4"
            >
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 shadow-xl bg-white group">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop"
                  alt="Students working on laptops in a modern digital marketing classroom at CBM Academy"
                  title="CBM Academy Digital Marketing Classroom Training"
                  width={1200}
                  height={800}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-72 sm:h-84 lg:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Single text in bottom */}
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 text-white py-2.5 sm:py-3 px-4 rounded-xl bg-[#072B57]/85 backdrop-blur-md border border-white/10 shadow-lg text-center">
                  <p className="text-xs sm:text-sm font-semibold text-white tracking-wide">
                    Interactive Training with Real Campaigns
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right Column on Desktop / Top on Mobile: Text Content */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT_ONCE}
              transition={{ duration: 0.5, ease: SMOOTH_EASE_OUT }}
              className="lg:col-span-6 order-1 lg:order-2 space-y-4 sm:space-y-5 relative"
            >
              {/* Subtle Elegant Navy Blue & Light Orange Decorative Shapes */}
              <div className="absolute -top-8 -right-4 w-60 h-60 rounded-full bg-gradient-to-br from-orange-100/50 via-blue-50/40 to-transparent blur-3xl pointer-events-none -z-10" />
              <div className="absolute top-1/2 -left-6 w-48 h-48 rounded-full bg-gradient-to-tr from-blue-100/40 via-orange-50/30 to-transparent blur-2xl pointer-events-none -z-10" />

              {/* Subtle decorative vector contour */}
              <svg
                className="absolute -top-4 right-0 w-32 h-32 text-orange-200/40 pointer-events-none -z-10"
                viewBox="0 0 100 100"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 4" />
                <circle cx="50" cy="50" r="26" stroke="#072B57" strokeOpacity="0.08" strokeWidth="1.5" />
              </svg>

              <h2 className="text-2xl min-[400px]:text-[26px] sm:text-[30px] md:text-[34px] lg:text-[32px] xl:text-[38px] font-black text-[#072B57] tracking-tight leading-tight whitespace-nowrap">
                Digital Marketing <span className="text-[#FF6B00]">Academy</span>
              </h2>

              <div className="space-y-4">
                <p className="text-sm sm:text-base font-semibold text-[#072B57] leading-relaxed">
                  Industry-first digital marketing training bridging the gap between classroom theory and live agency execution.
                </p>

                {/* 4 Organised Key Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-0.5">
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs h-full">
                    <CheckCircle2 className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-xs sm:text-[13px] font-bold text-[#072B57]">Live Campaign Execution</span>
                      <span className="block text-xs sm:text-[13px] text-slate-500 font-normal leading-relaxed mt-0.5">Real ad budgets, SEO audits &amp; Meta Ads</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs h-full">
                    <CheckCircle2 className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-xs sm:text-[13px] font-bold text-[#072B57]">AI-Powered Workflows</span>
                      <span className="block text-xs sm:text-[13px] text-slate-500 font-normal leading-relaxed mt-0.5">Prompt systems, GA4 &amp; marketing automations</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs h-full">
                    <CheckCircle2 className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-xs sm:text-[13px] font-bold text-[#072B57]">Designed for All Learners</span>
                      <span className="block text-xs sm:text-[13px] text-slate-500 font-normal leading-relaxed mt-0.5">Students, freshers, freelancers &amp; professionals</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs h-full">
                    <CheckCircle2 className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-xs sm:text-[13px] font-bold text-[#072B57]">Career &amp; Placement Support</span>
                      <span className="block text-xs sm:text-[13px] text-slate-500 font-normal leading-relaxed mt-0.5">Interview prep, portfolio building &amp; mentorship</span>
                    </div>
                  </div>
                </div>

                {/* Scope Coverage Summary */}
                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed pt-0.5">
                  Master SEO, Google Ads, Meta Ads, social media marketing, GA4 analytics, AI automation, and freelance agency blueprints.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="#course"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6B00] px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#e05f00] cursor-pointer shadow-md hover:shadow-lg active:scale-98"
                >
                  <span>Explore Courses</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* =========================================================
            WHY CHOOSE CBM ACADEMY HEADING AREA
        ========================================================= */}
        <div className="max-w-5xl mx-auto text-center mb-8 sm:mb-10">
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

          {/* Main Heading - In single line */}
          <motion.h3
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.5, delay: 0.08, ease: SMOOTH_EASE_OUT }}
            className="text-lg min-[480px]:text-xl sm:text-2xl md:text-[28px] lg:text-[33px] xl:text-[36px] font-black text-[#072B57] tracking-tight leading-snug sm:whitespace-nowrap"
          >
            Practical Digital Marketing Training for{' '}
            <span className="text-[#FF6B00] whitespace-nowrap">Career Growth</span>
          </motion.h3>

          {/* Subtitle */}
          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.5, delay: 0.15, ease: SMOOTH_EASE_OUT }}
            className="mt-3 text-slate-600 text-sm sm:text-base font-normal leading-relaxed max-w-2xl mx-auto text-left"
          >
            Learn digital marketing through practical assignments, live campaign simulations, industry tools and AI-powered workflows instead of relying only on classroom theory.
          </motion.p>
        </div>

        {/* 4 EQUAL CARDS HORIZONTALLY ON DESKTOP */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch">
          {CARDS.map((card, index) => (
            <motion.article
              key={card.id}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT_ONCE}
              transition={{
                duration: 0.45,
                delay: 0.06 * (index + 1),
                ease: SMOOTH_EASE_OUT,
              }}
              onClick={onOpenApply}
              className="group relative bg-white hover:bg-white rounded-2xl border border-slate-200/90 hover:border-[#FF6B00]/40 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 p-5 sm:p-6 flex flex-col justify-start cursor-pointer h-full"
            >
              {/* Top Graphic */}
              <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100/90 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200 shrink-0">
                {card.renderIcon()}
              </div>

              {/* Card Title */}
              <h3 className="text-base sm:text-lg font-bold text-[#072B57] group-hover:text-[#FF6B00] transition-colors tracking-tight leading-snug mb-2">
                {card.title}
              </h3>

              {/* Body Text */}
              <p className="text-xs sm:text-[13.5px] text-slate-600 font-normal leading-relaxed">
                {card.description}
              </p>
            </motion.article>
          ))}
        </div>

        {/* =========================================================
            UPLOADABLE COURSE BANNER (SAME LANDSCAPE SIZE)
            ========================================================= */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: 0.5, delay: 0.25, ease: SMOOTH_EASE_OUT }}
          className="mt-10 sm:mt-12 relative rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 bg-white shadow-md group"
        >
          {/* Same Aspect Ratio Landscape Frame */}
          <div className="relative w-full aspect-[16/7.5] sm:aspect-[16/6.5] lg:aspect-[21/8] min-h-[240px] sm:min-h-[340px] lg:min-h-[420px] overflow-hidden bg-slate-900">
            <img
              src={bannerUrl}
              alt="Course Banner"
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.01]"
            />

            {/* If not custom banner yet, show helpful upload invite overlay */}
            {!isCustomBanner ? (
              <div
                onClick={() => bannerInputRef.current?.click()}
                className="absolute inset-0 bg-[#072B57]/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center text-white cursor-pointer hover:bg-[#072B57]/50 transition-colors"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-white mb-3 shadow-md group-hover:scale-105 transition-transform">
                  <Upload className="w-7 h-7 text-[#FF6B00]" />
                </div>
                <h4 className="text-lg sm:text-2xl font-black tracking-tight text-white mb-1">
                  Upload Your Course Banner Here
                </h4>
                <p className="text-xs sm:text-sm text-slate-200 max-w-md mb-4 font-normal">
                  Click anywhere on this banner to upload your image (PNG, JPG, WebP)
                </p>
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95">
                  <Upload className="w-4 h-4" />
                  <span>Choose Banner Image</span>
                </div>
              </div>
            ) : (
              /* When custom banner is uploaded: Keep only photo, with clean subtle hover controls in top right */
              <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex items-center gap-2 z-10 opacity-90 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => bannerInputRef.current?.click()}
                  title="Change Banner Image"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FF6B00] hover:bg-[#e05e00] text-white text-xs font-bold transition-all shadow-md cursor-pointer active:scale-95"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Change Banner</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetBanner}
                  title="Reset Banner"
                  className="p-1.5 rounded-lg bg-black/60 hover:bg-rose-600 text-white text-xs transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Hidden file input */}
            <input
              ref={bannerInputRef}
              type="file"
              accept="image/*"
              onChange={handleBannerUpload}
              className="hidden"
              aria-label="Upload Course Banner Image"
            />
          </div>

          {/* Optional URL Input Popover */}
          {showUrlPrompt && (
            <div className="p-3 sm:p-4 bg-slate-900 border-t border-white/10 flex flex-wrap items-center gap-2 text-white">
              <span className="text-xs font-semibold text-slate-300">Banner Image URL:</span>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/course-banner.jpg"
                className="flex-1 min-w-[220px] px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF6B00]"
              />
              <button
                type="button"
                onClick={handleUrlSubmit}
                className="px-3.5 py-1.5 rounded-lg bg-[#FF6B00] hover:bg-[#e05f00] text-xs font-bold text-white transition-colors cursor-pointer"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowUrlPrompt(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
