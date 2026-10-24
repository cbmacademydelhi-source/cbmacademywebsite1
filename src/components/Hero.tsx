import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Download } from 'lucide-react';

interface HeroProps {
  onOpenApply?: () => void;
  onOpenBrochure: () => void;
  onExploreCourses?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenApply,
  onOpenBrochure,
  onExploreCourses,
}) => {
  const shouldReduceMotion = useReducedMotion();

  const handleExploreCourses = () => {
    if (onExploreCourses) {
      onExploreCourses();
    } else {
      window.location.hash = 'course';
      const courseElement =
        document.getElementById('course') || document.getElementById('courses');
      if (courseElement) {
        courseElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      id="home"
      className="relative overflow-hidden pt-6 pb-12 sm:pb-16 bg-white border-b border-slate-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Badge */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
              className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-700 shadow-sm"
            >
              <span className="flex h-2 w-2 rounded-full bg-[#FF6B00] animate-pulse" />
              <span className="font-bold text-[#FF6B00]">AI-Powered Digital Marketing Academy</span>
              <span className="text-slate-300">|</span>
              <span>Okhla, New Delhi</span>
            </motion.div>

            {/* Main Headline with Distinctive Background Design */}
            <div className="relative">
              {/* Clean, premium background behind/around the headline */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-x-3 sm:-inset-x-4 -inset-y-2.5 sm:-inset-y-3.5 -z-10 rounded-2xl sm:rounded-3xl bg-slate-50/60 border border-slate-200/70 shadow-[0_2px_12px_rgba(7,43,87,0.03)] overflow-hidden select-none"
              >
                {/* Very subtle abstract shapes & soft curves in navy and orange */}
                <svg
                  className="absolute -right-4 -bottom-6 w-44 h-44 sm:w-56 sm:h-56 text-[#072B57]/[0.045]"
                  viewBox="0 0 160 160"
                  fill="none"
                >
                  <circle cx="80" cy="80" r="64" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" />
                  <path d="M20 120 C 50 70, 110 70, 140 110" stroke="currentColor" strokeWidth="1.2" />
                </svg>

                {/* Subtle soft orange curve & geometric corner element */}
                <svg
                  className="absolute -top-3 -right-3 w-28 h-28 text-[#FF6B00]/[0.08]"
                  viewBox="0 0 100 100"
                  fill="none"
                >
                  <path d="M0 0 H100 V100 C100 44.77 55.23 0 0 0Z" fill="currentColor" opacity="0.4" />
                  <path d="M10 0 C60 0 100 40 100 90" stroke="#FF6B00" strokeWidth="1" strokeOpacity="0.25" />
                </svg>

                {/* Minimal geometric alignment element */}
                <div className="absolute top-2.5 left-3 flex items-center gap-1 opacity-20">
                  <span className="w-1 h-1 rounded-full bg-[#072B57]" />
                  <span className="w-3 h-[1px] bg-[#072B57]" />
                </div>
              </div>

              <motion.h1
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.18, ease: 'easeOut' }}
                className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] tracking-tight leading-[1.2] sm:leading-[1.16]"
              >
                <span className="text-[#072B57] font-extrabold sm:font-black">
                  Master Digital Marketing
                </span>{' '}
                <span className="relative inline-block text-[#FF6B00] font-extrabold sm:font-black">
                  with AI
                  <svg
                    className="absolute left-0 -bottom-1 sm:-bottom-1.5 w-full h-[5px] sm:h-[6px] text-[#FF6B00]"
                    viewBox="0 0 85 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M1.5 5.5C24.5 2 60.5 2 83.5 5.5"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                {', '}
                <span className="font-semibold text-[#072B57]/80">
                  Real Projects & Industry Skills
                </span>
              </motion.h1>
            </div>

            {/* Subheadline */}
            <motion.p
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.25, ease: 'easeOut' }}
              className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl"
            >
              Build job-ready digital marketing skills with practical training in SEO, Google Ads, Meta Ads, social media marketing, analytics, content marketing and AI-powered marketing workflows at CBM Academy in Okhla, New Delhi.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.32, ease: 'easeOut' }}
              className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4"
            >
              <button
                onClick={handleExploreCourses}
                id="hero-explore-courses-btn"
                type="button"
                className="inline-flex items-center justify-center gap-2.5 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold text-base px-7 py-3.5 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all duration-150 active:scale-98 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:ring-offset-2"
              >
                <span>Explore Courses</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={onOpenBrochure}
                id="hero-download-brochure-btn"
                type="button"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-[#072B57] font-bold text-base px-6 py-3.5 rounded-xl border border-slate-200 hover:border-slate-300 shadow-sm transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-300"
              >
                <Download className="w-5 h-5 text-[#FF6B00]" />
                <span>Download Brochure</span>
              </button>
            </motion.div>
          </div>

          {/* Right Column: Realistic Classroom & Practical Training Visual - Photo Only */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Visual Frame */}
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.22, ease: 'easeOut' }}
                className="relative rounded-2xl overflow-hidden border border-slate-200/80 shadow-2xl bg-slate-100"
              >
                <img
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop"
                  alt="Students and mentor in digital marketing practical training session at CBM Academy in Okhla, New Delhi"
                  title="CBM Academy Digital Marketing Training & Live Session in Okhla, New Delhi"
                  width={1200}
                  height={800}
                  decoding="async"
                  fetchPriority="high"
                  referrerPolicy="no-referrer"
                  className="w-full h-80 sm:h-96 lg:h-[420px] object-cover transition-transform duration-500 hover:scale-[1.02]"
                />

                {/* Single text in bottom */}
                <div className="absolute bottom-4 left-4 right-4 text-white py-2.5 sm:py-3 px-4 rounded-xl bg-[#072B57]/85 backdrop-blur-md border border-white/10 shadow-lg text-center">
                  <p className="text-xs sm:text-sm font-semibold text-white tracking-wide">
                    Live Campaign Execution &amp; AI Auditing in Okhla
                  </p>
                </div>
              </motion.div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
