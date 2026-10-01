import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Download, Sparkles, Target, TrendingUp, Briefcase } from 'lucide-react';
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
                
                {/* Subtle Navy Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#072B57]/80 via-[#072B57]/20 to-transparent pointer-events-none" />

                {/* Bottom Overlay Badge */}
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 text-white p-3 sm:p-3.5 rounded-xl bg-[#072B57]/85 backdrop-blur-md border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold tracking-wider text-[#FF6B00] uppercase block">
                        CBM Classroom &amp; Projects
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-white">Interactive Training with Real Campaigns</p>
                    </div>
                    <span className="hidden sm:inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-1 rounded-full font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Card 1: Practical Focus (Top Left) */}
              <div className="absolute -top-1 sm:top-0 -left-1 sm:-left-2 bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-slate-200/80 shadow-xl flex items-center gap-2.5 z-10">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF6B00] shrink-0">
                  <Target className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-medium">Hands-On</div>
                  <div className="text-xs sm:text-sm font-bold text-[#072B57]">Practical Focus</div>
                </div>
              </div>

              {/* Floating Card 2: Skill Advancement (Top Right) */}
              <div className="absolute -top-1 sm:top-2 -right-1 sm:-right-2 bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-slate-200/80 shadow-xl flex items-center gap-2.5 z-10">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#072B57] shrink-0">
                  <TrendingUp className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-medium">Modern Tools &amp; AI</div>
                  <div className="text-xs sm:text-sm font-bold text-[#072B57]">Skill Advancement</div>
                </div>
              </div>

              {/* Floating Card 3: Career Support (Bottom Right) */}
              <div className="absolute -bottom-1 sm:bottom-0 -right-1 sm:-right-2 bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-slate-200/80 shadow-xl flex items-center gap-2.5 z-10">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF6B00] shrink-0">
                  <Briefcase className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-medium">Placement Guidance</div>
                  <div className="text-xs sm:text-sm font-bold text-[#072B57]">Career Support</div>
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

              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-50 text-[#FF6B00] text-xs font-extrabold uppercase tracking-wider border border-orange-200 w-fit">
                <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>PRACTICAL LEARNING</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-black text-[#072B57] tracking-tight leading-[1.12]">
                Digital Marketing <span className="text-[#FF6B00]">Academy</span>
              </h2>

              <div className="space-y-3.5">
                <p className="text-base sm:text-[17px] font-semibold text-[#072B57]/90 leading-relaxed">
                  CBM Academy is a practical digital marketing academy designed for students, freshers, freelancers, entrepreneurs and working professionals. Learn modern digital marketing through hands-on projects, real marketing tools, AI-powered workflows and career-focused training.
                </p>
                <p className="text-[14.5px] sm:text-[15.5px] font-normal text-slate-600 leading-relaxed">
                  From SEO and Google Ads to Meta Ads, social media marketing, analytics, content marketing and AI automation, our courses help learners build practical skills they can apply in real-world campaigns.
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
          <motion.h3
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.5, delay: 0.08, ease: SMOOTH_EASE_OUT }}
            className="text-2xl sm:text-3xl lg:text-[36px] font-black text-[#072B57] tracking-tight leading-[1.15]"
          >
            Practical Digital Marketing Training for{' '}
            <span className="text-[#FF6B00]">Career Growth</span>
          </motion.h3>

          {/* Subtitle */}
          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.5, delay: 0.15, ease: SMOOTH_EASE_OUT }}
            className="mt-3 text-slate-600 text-sm sm:text-base font-normal leading-relaxed max-w-2xl mx-auto"
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

        {/* Mid-Page Conversion CTA: Apply Now & Brochure */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: 0.5, delay: 0.2, ease: SMOOTH_EASE_OUT }}
          className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <button
            onClick={onOpenApply}
            id="why-cbm-apply-now-btn"
            type="button"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold text-base px-7 py-3.5 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all duration-150 active:scale-98 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:ring-offset-2"
          >
            <span>Apply Now</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenBrochure}
            id="why-cbm-download-brochure-btn"
            type="button"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-[#072B57] font-bold text-base px-6 py-3.5 rounded-xl border border-slate-200 hover:border-slate-300 shadow-sm transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            <Download className="w-5 h-5 text-[#FF6B00]" />
            <span>Download Brochure</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
};
