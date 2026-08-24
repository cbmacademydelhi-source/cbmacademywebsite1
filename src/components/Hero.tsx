import React from 'react';
import { ArrowRight, Download, Star, CheckCircle2, Award, Briefcase, Users, Sparkles, TrendingUp } from 'lucide-react';
import { TRUST_STATS } from '../data/cbmData';

interface HeroProps {
  onOpenApply: () => void;
  onOpenBrochure: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenApply, onOpenBrochure }) => {
  return (
    <section id="home" className="relative overflow-hidden bg-white pt-6 pb-16 lg:pt-12 lg:pb-24 border-b border-slate-100">
      {/* Background Subtle Grid Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 bg-[#F8FAFC] border border-slate-200 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#072B57] shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-[#FF6B00] animate-pulse" />
              <span className="font-bold text-[#FF6B00]">Admissions Open 2026</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-600">Practical AI Growth Training</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#072B57] tracking-tight leading-[1.15]">
              Become Job Ready with <br className="hidden sm:inline" />
              <span className="text-[#FF6B00] underline decoration-slate-200 decoration-wavy decoration-1 underline-offset-4">
                AI-Powered
              </span>{' '}
              Digital Marketing Training
            </h1>

            {/* Subheadline - Shortened to 1-2 lines */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Master SEO, Meta & Google Ads, GA4, and AI workflows with hands-on campaign execution and direct placement support.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <button
                onClick={onOpenApply}
                id="hero-apply-now-btn"
                type="button"
                className="inline-flex items-center justify-center gap-2.5 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold text-base px-7 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-150 active:scale-98 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:ring-offset-2"
              >
                <span>Apply Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={onOpenBrochure}
                id="hero-download-brochure-btn"
                type="button"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-[#072B57] font-bold text-base px-6 py-3.5 rounded-xl border border-slate-300 hover:border-slate-400 shadow-sm transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#072B57]"
              >
                <Download className="w-5 h-5 text-[#FF6B00]" />
                <span>Download Brochure</span>
              </button>
            </div>

            {/* Quick Highlights / Trust Badges */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>100% Placement Help</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Live Client Budgets</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Govt. Recognized</span>
              </div>
            </div>

            {/* Rating & Social Proof */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="text-xs text-slate-600">
                <strong className="text-slate-900 font-bold">4.9/5 Rating</strong> from 4,500+ alumni across Google, Amazon & top agency roles
              </div>
            </div>

          </div>

          {/* Right Column: Realistic Classroom & Practical Training Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Visual Frame */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop"
                  alt="CBM Academy Digital Marketing Training Classroom"
                  referrerPolicy="no-referrer"
                  className="w-full h-80 sm:h-96 object-cover opacity-90 transition-transform duration-500 hover:scale-105"
                />
                
                {/* Visual Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#072B57]/90 via-[#072B57]/30 to-transparent pointer-events-none" />

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-4 left-4 right-4 text-white p-4 rounded-xl bg-[#072B57]/80 backdrop-blur-md border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold tracking-wider text-[#FF6B00] uppercase block">
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
              </div>

              {/* Floating Stat Card 1 (Top Left) */}
              <div className="absolute -top-4 -left-4 bg-white p-3.5 rounded-xl border border-slate-200 shadow-lg hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-[#FF6B00]">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">Average ROI/Salary</div>
                  <div className="text-sm font-bold text-[#072B57]">72% Career Hike</div>
                </div>
              </div>

              {/* Floating Stat Card 2 (Bottom Right) */}
              <div className="absolute -bottom-4 -right-4 bg-white p-3.5 rounded-xl border border-slate-200 shadow-lg hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-[#072B57]">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">Hiring Network</div>
                  <div className="text-sm font-bold text-[#072B57]">500+ Corporate Brands</div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Trust Metrics Strip */}
        <div className="mt-14 pt-8 border-t border-slate-200 grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          {TRUST_STATS.map((stat, index) => (
            <div key={index} className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-100">
              <div className="text-xl sm:text-2xl font-extrabold text-[#072B57]">{stat.value}</div>
              <div className="text-xs font-medium text-slate-600 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
