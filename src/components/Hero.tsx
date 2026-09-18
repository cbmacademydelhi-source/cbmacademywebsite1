import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Download, Star, CheckCircle2, Briefcase, TrendingUp } from 'lucide-react';

interface HeroProps {
  onOpenApply: () => void;
  onOpenBrochure: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenApply, onOpenBrochure }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-transparent pt-6 pb-8 sm:pb-10 lg:pt-10 lg:pb-12"
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
              className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] px-3.5 py-1.5 rounded-full text-xs font-semibold text-white shadow-sm"
            >
              <span className="flex h-2 w-2 rounded-full bg-[#FF7200] animate-pulse" />
              <span className="font-bold text-[#FF7200]">Admissions Open 2026</span>
              <span className="text-white/20">|</span>
              <span className="text-[#A7A7A7]">Practical AI Growth Training</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.18, ease: 'easeOut' }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15]"
            >
              Become Job Ready with <br className="hidden sm:inline" />
              <span className="text-[#FF7200] underline decoration-[#FF7200]/30 decoration-wavy decoration-1 underline-offset-4">
                AI-Powered
              </span>{' '}
              Digital Marketing Training
            </motion.h1>

            {/* Subheadline - Shortened to 1-2 lines */}
            <motion.p
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.25, ease: 'easeOut' }}
              className="text-base sm:text-lg text-[#A7A7A7] leading-relaxed max-w-2xl"
            >
              Master SEO, Meta & Google Ads, GA4, and AI workflows with hands-on campaign execution and direct placement support.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.32, ease: 'easeOut' }}
              className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4"
            >
              <button
                onClick={onOpenApply}
                id="hero-apply-now-btn"
                type="button"
                className="inline-flex items-center justify-center gap-2.5 bg-[#FF7200] hover:bg-[#e06500] text-white font-bold text-base px-7 py-3.5 rounded-xl shadow-[0_4px_20px_rgba(255,114,0,0.3)] hover:shadow-[0_6px_25px_rgba(255,114,0,0.4)] transition-all duration-150 active:scale-98 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF7200] focus:ring-offset-2 focus:ring-offset-[#080808]"
              >
                <span>Apply Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={onOpenBrochure}
                id="hero-download-brochure-btn"
                type="button"
                className="inline-flex items-center justify-center gap-2 bg-white/[0.05] hover:bg-white/[0.09] text-white font-bold text-base px-6 py-3.5 rounded-xl border border-white/[0.12] hover:border-white/[0.2] shadow-sm transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <Download className="w-5 h-5 text-[#FF7200]" />
                <span>Download Brochure</span>
              </button>
            </motion.div>

            {/* Quick Highlights / Trust Badges */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.39, ease: 'easeOut' }}
              className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-white/[0.08]"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-[#A7A7A7]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>100% Placement Help</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#A7A7A7]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Live Client Budgets</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#A7A7A7]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Govt. Recognized</span>
              </div>
            </motion.div>

            {/* Rating & Social Proof */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.46, ease: 'easeOut' }}
              className="flex items-center gap-4 pt-2"
            >
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="text-xs text-[#A7A7A7]">
                <strong className="text-white font-bold">4.9/5 Rating</strong> from 4,500+ alumni across Google, Amazon & top agency roles
              </div>
            </motion.div>

          </div>

          {/* Right Column: Realistic Classroom & Practical Training Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Visual Frame */}
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.22, ease: 'easeOut' }}
                className="relative rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl bg-[#0D0D0D]"
              >
                <img
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop"
                  alt="CBM Academy Digital Marketing Training Classroom"
                  referrerPolicy="no-referrer"
                  className="w-full h-80 sm:h-96 object-cover opacity-85 transition-transform duration-500 hover:scale-105"
                />
                
                {/* Visual Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/95 via-[#080808]/40 to-transparent pointer-events-none" />

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-4 left-4 right-4 text-white p-4 rounded-xl bg-[#0D0D0D]/85 backdrop-blur-md border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold tracking-wider text-[#FF7200] uppercase block">
                        CBM Practical Masterclass
                      </span>
                      <p className="text-sm font-semibold text-white">Live Campaign Execution & AI Auditing</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-1 rounded-full font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Active Session
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Stat Card 1 (Top Left) - Consistent Card Style */}
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.42, ease: 'easeOut' }}
                className="absolute -top-4 -left-4 bg-[#0D0D0D]/90 backdrop-blur-md p-3.5 rounded-2xl border border-white/[0.08] shadow-xl hidden sm:flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-[#FF7200]">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-[#A7A7A7] font-medium">Average ROI/Salary</div>
                  <div className="text-sm font-bold text-white">72% Career Hike</div>
                </div>
              </motion.div>

              {/* Floating Stat Card 2 (Bottom Right) - Consistent Card Style */}
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5, ease: 'easeOut' }}
                className="absolute -bottom-4 -right-4 bg-[#0D0D0D]/90 backdrop-blur-md p-3.5 rounded-2xl border border-white/[0.08] shadow-xl hidden sm:flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-[#FF7200]">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-[#A7A7A7] font-medium">Hiring Network</div>
                  <div className="text-sm font-bold text-white">500+ Corporate Brands</div>
                </div>
              </motion.div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
