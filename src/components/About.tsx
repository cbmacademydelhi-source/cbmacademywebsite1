import React, { useEffect } from 'react';
import {
  Award,
  BookOpen,
  Laptop,
  Cpu,
  TrendingUp,
  Users,
  Briefcase,
  Layers,
  Building2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface AboutProps {
  isServicesPage?: boolean;
}

export const About: React.FC<AboutProps> = ({ isServicesPage = false }) => {
  // Scroll to services section if requested
  useEffect(() => {
    if (isServicesPage) {
      const timer = setTimeout(() => {
        const el = document.getElementById('digital-marketing-services');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [isServicesPage]);

  const whoCanLearn = [
    {
      title: 'Students & Freshers',
      description: 'Prepare for internships and entry-level career roles.',
      renderVisual: () => (
        <div className="w-full h-full relative flex items-center justify-center bg-gradient-to-br from-orange-50/80 via-slate-50 to-white">
          <div className="relative flex items-center justify-center">
            <div className="w-28 h-16 bg-white rounded-lg border border-slate-200/90 shadow-2xs p-2 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                <span className="text-[9px] font-extrabold text-[#072B57]">Study Path</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#072B57] to-[#FF6B00] w-3/4 rounded-full" />
              </div>
              <div className="text-[8px] text-slate-400 font-medium">Internship Ready</div>
            </div>
            <div className="absolute -top-2 -right-2 w-7 h-7 rounded-lg bg-[#FF6B00] text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Professionals',
      description: 'Upgrade your digital and AI marketing capabilities.',
      renderVisual: () => (
        <div className="w-full h-full relative flex items-center justify-center bg-gradient-to-br from-blue-50/80 via-slate-50 to-white">
          <div className="w-28 h-16 bg-white rounded-lg border border-slate-200/90 shadow-2xs p-2 flex flex-col justify-between group-hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-0.5">
              <span className="text-[8px] font-bold text-slate-400">ROI METRICS</span>
              <span className="text-[8px] font-extrabold text-[#FF6B00]">+240%</span>
            </div>
            <div className="flex items-end justify-between gap-1.5 h-7 px-1">
              <div className="w-3.5 bg-slate-200 rounded-t h-3" />
              <div className="w-3.5 bg-blue-200 rounded-t h-4.5" />
              <div className="w-3.5 bg-[#072B57] rounded-t h-6" />
              <div className="w-3.5 bg-[#FF6B00] rounded-t h-7" />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Freelancers',
      description: 'Master client campaigns and freelance deliverables.',
      renderVisual: () => (
        <div className="w-full h-full relative flex items-center justify-center bg-gradient-to-br from-emerald-50/80 via-slate-50 to-white">
          <div className="relative flex items-center justify-center">
            <div className="w-28 h-16 bg-white rounded-lg border border-slate-200/90 shadow-2xs p-2 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                <span className="text-[9px] font-extrabold text-[#072B57]">Client Work</span>
                <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-1 rounded">Paid</span>
              </div>
              <div className="flex items-center gap-1.5 text-[8px] text-slate-600 font-medium">
                <Laptop className="w-3 h-3 text-emerald-600" />
                <span>Live Campaigns</span>
              </div>
              <div className="text-[8px] text-slate-400">Remote Retainers</div>
            </div>
            <div className="absolute -top-2 -right-2 w-7 h-7 rounded-lg bg-[#072B57] text-[#FF6B00] flex items-center justify-center shadow-xs">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Business Owners',
      description: 'Generate online leads and scale your business growth.',
      renderVisual: () => (
        <div className="w-full h-full relative flex items-center justify-center bg-gradient-to-br from-purple-50/80 via-slate-50 to-white">
          <div className="relative flex items-center justify-center">
            <div className="w-28 h-16 bg-white rounded-lg border border-slate-200/90 shadow-2xs p-2 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                <span className="text-[9px] font-extrabold text-[#072B57]">Scale ROI</span>
                <span className="text-[8px] font-bold text-[#FF6B00]">3.8x</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-600 to-[#FF6B00] w-4/5 rounded-full" />
              </div>
              <div className="text-[8px] text-slate-400 font-medium">Customer Growth</div>
            </div>
            <div className="absolute -top-2 -right-2 w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <Building2 className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      ),
    },
  ];

  const whyChooseItems = [
    {
      title: 'AI-Integrated Learning',
      description: 'Learn with AI-powered marketing tools.',
      renderVisual: () => (
        <div className="w-full h-full relative flex items-center justify-center bg-gradient-to-br from-purple-50/80 via-slate-50 to-white">
          <div className="w-28 h-16 bg-white rounded-lg border border-slate-200/90 shadow-2xs p-2 flex items-center justify-between group-hover:scale-105 transition-transform duration-200">
            <div className="w-10 h-10 rounded-lg bg-[#072B57] text-[#FF6B00] flex items-center justify-center shrink-0 shadow-2xs">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="text-right">
              <span className="text-[9px] font-black text-purple-700 block">AI Engine</span>
              <span className="text-[8px] text-slate-400 font-medium">Automated</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Practical Learning',
      description: 'Learn through hands-on projects.',
      renderVisual: () => (
        <div className="w-full h-full relative flex items-center justify-center bg-gradient-to-br from-orange-50/80 via-slate-50 to-white">
          <div className="w-28 h-16 bg-white rounded-lg border border-slate-200/90 shadow-2xs p-2 flex flex-col justify-between group-hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-0.5">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] font-extrabold text-[#072B57]">CAMPAIGN</span>
              </div>
              <span className="text-[8px] font-black text-[#FF6B00]">CTR 8.2%</span>
            </div>
            <div className="flex items-center justify-between text-[8px] text-slate-600 font-bold">
              <span>Real Tasks</span>
              <span className="text-emerald-600">✓ Hands-on</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Industry Tools',
      description: 'Practice with modern marketing platforms.',
      renderVisual: () => (
        <div className="w-full h-full relative flex items-center justify-center bg-gradient-to-br from-blue-50/80 via-slate-50 to-white">
          <div className="w-28 h-16 bg-white rounded-lg border border-slate-200/90 shadow-2xs p-1.5 flex flex-col justify-center gap-1">
            <div className="grid grid-cols-2 gap-1 text-[7px] font-bold text-center">
              <span className="bg-blue-50 text-[#072B57] border border-blue-100 rounded py-0.5">Google Ads</span>
              <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 rounded py-0.5">Meta Ads</span>
              <span className="bg-orange-50 text-[#FF6B00] border border-orange-100 rounded py-0.5">GA4 Data</span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded py-0.5">SEO Suites</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Career-Focused Skills',
      description: 'Build skills for real opportunities.',
      renderVisual: () => (
        <div className="w-full h-full relative flex items-center justify-center bg-gradient-to-br from-emerald-50/80 via-slate-50 to-white">
          <div className="w-28 h-16 bg-white rounded-lg border border-slate-200/90 shadow-2xs p-2 flex flex-col justify-between group-hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-0.5">
              <span className="text-[8px] font-bold text-slate-500 uppercase">Growth</span>
              <span className="text-[8px] font-extrabold text-emerald-600 bg-emerald-50 px-1 rounded">Job-Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#072B57] text-[#FF6B00] flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="text-[8px] font-medium text-slate-500 leading-tight">
                Placement & Opportunities
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div
      id="about-page-root"
      className="min-h-screen bg-[#FAFAFA] pt-8 sm:pt-12 pb-24 sm:pb-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">
        {/* =========================================================
            1. ABOUT HERO SECTION
            ========================================================= */}
        <section
          id="about-hero"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
        >
          {/* Introductory Content - Very top */}
          <div className="lg:col-span-6 space-y-4">
            <div className="about-section-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#FF6B00] text-xs font-extrabold uppercase tracking-wider border border-orange-200">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>ABOUT CBM ACADEMY</span>
            </div>

            {isServicesPage ? (
              <h2 className="about-section-heading text-3xl sm:text-4xl lg:text-[42px] font-black text-[#072B57] tracking-tight leading-[1.15]">
                About CBM <span className="text-[#FF6B00] about-accent">Academy</span>
              </h2>
            ) : (
              <h1 className="about-section-heading text-3xl sm:text-4xl lg:text-[42px] font-black text-[#072B57] tracking-tight leading-[1.15]">
                About CBM <span className="text-[#FF6B00] about-accent">Academy</span>
              </h1>
            )}

            <h2 className="about-section-subheading text-lg sm:text-xl font-bold text-[#FF6B00]">
              A Practical Digital Marketing Academy in Okhla, New Delhi
            </h2>

            <p className="about-section-paragraph text-slate-600 text-sm sm:text-base leading-relaxed">
              Build practical digital marketing and AI skills through projects,
              industry tools and real-world learning.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href="#course"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6B00] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-[#e05f00] cursor-pointer shadow-md hover:shadow-lg active:scale-98"
              >
                <span>Explore Our Courses</span>
                <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#072B57] border border-slate-200 hover:border-slate-300 transition-colors shadow-xs cursor-pointer"
              >
                <span>Get in Touch</span>
              </a>
            </div>
          </div>

          {/* Hero Visual on Right */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-white group">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop"
                alt="Students collaborating on digital marketing projects and laptops at CBM Academy in Okhla, New Delhi"
                title="CBM Academy Digital Marketing Training in Okhla, New Delhi"
                width={1000}
                height={667}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="w-full h-80 sm:h-[380px] object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#072B57]/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-slate-200 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-[#FF6B00] shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#072B57]">
                      Centre for Business &amp; Marketing (CBM)
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Practical Digital Marketing &bull; Okhla, New Delhi
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <div className="text-sm font-extrabold text-[#072B57]">
                  Hands-On
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  Live Projects
                </div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <div className="text-sm font-extrabold text-[#072B57]">
                  Practical
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  AI Marketing
                </div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <div className="text-sm font-extrabold text-[#072B57]">
                  Career
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  Guidance
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            2. WHO WE ARE SECTION
            ========================================================= */}
        <section
          id="who-we-are"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
        >
          {/* Left: Classroom / Training Image */}
          <div className="lg:col-span-6 order-2 lg:order-1 h-full">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md group h-full min-h-[300px] sm:min-h-[340px]">
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop"
                alt="Digital marketing classroom training session with mentor and learners at CBM Academy in New Delhi"
                title="CBM Academy Classroom Training & Mentorship"
                width={1000}
                height={667}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 bg-[#072B57]/90 text-white text-[11px] font-bold px-3 py-1 rounded-lg backdrop-blur-xs">
                Mentor-Led Sessions
              </div>
            </div>
          </div>

          {/* Right: Concise Content */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
            <div className="about-section-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#FF6B00] text-xs font-extrabold uppercase tracking-wider border border-orange-200">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>WHO WE ARE</span>
            </div>

            <h2 className="about-section-heading text-3xl sm:text-4xl lg:text-[42px] font-black text-[#072B57] tracking-tight leading-[1.15]">
              Who We <span className="text-[#FF6B00] about-accent">Are</span>
            </h2>

            <p className="about-section-paragraph text-slate-600 text-sm sm:text-base leading-relaxed">
              CBM Academy is a digital marketing academy and marketing services platform that combines practical learning, industry exposure, technology, AI, and real-world marketing experience.
            </p>
          </div>
        </section>

        {/* =========================================================
            7. AI + DIGITAL MARKETING SECTION
            ========================================================= */}
        <section
          id="ai-marketing"
          className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Info */}
            <div className="lg:col-span-6 space-y-3.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-extrabold uppercase tracking-wider border border-purple-100">
                <Cpu className="w-3.5 h-3.5 text-purple-600" />
                <span>AI + DIGITAL MARKETING</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-[#072B57] tracking-tight">
                Digital Marketing Meets AI
              </h2>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Learn how AI can support SEO, content, advertising, analytics,
                research and marketing automation.
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-[11px] font-semibold bg-purple-50 text-purple-700 px-3 py-1 rounded-lg border border-purple-100">
                  AI Copywriting
                </span>
                <span className="text-[11px] font-semibold bg-purple-50 text-purple-700 px-3 py-1 rounded-lg border border-purple-100">
                  Automated Reporting
                </span>
                <span className="text-[11px] font-semibold bg-purple-50 text-purple-700 px-3 py-1 rounded-lg border border-purple-100">
                  Audience Targeting
                </span>
              </div>
            </div>

            {/* Right Large AI Image */}
            <div className="lg:col-span-6">
              <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-md group">
                <img
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop"
                  alt="AI-powered digital marketing automation, analytics and intelligent campaign optimization"
                  title="AI Meets Digital Marketing at CBM Academy"
                  width={1000}
                  height={667}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-64 sm:h-72 object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            8. WHO CAN LEARN WITH US
            ========================================================= */}
        <section id="who-can-learn">
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-[#072B57] tracking-tight">
              Who Is CBM Academy For?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 items-stretch">
            {whoCanLearn.map((item, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-[#FF6B00]/50 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col h-full"
              >
                <div className="h-28 sm:h-32 w-full bg-slate-50/70 border-b border-slate-100 flex items-center justify-center p-2.5 overflow-hidden select-none">
                  {item.renderVisual()}
                </div>
                <div className="p-4 sm:p-5 flex flex-col flex-1 justify-start">
                  <h3 className="text-sm sm:text-base font-bold text-[#072B57] group-hover:text-[#FF6B00] transition-colors tracking-tight mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-snug">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================
            9. WHY LEARN WITH US
            ========================================================= */}
        <section id="why-cbm-about">
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-[#072B57] tracking-tight">
              Why Learn With Us?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 items-stretch">
            {whyChooseItems.map((item, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-[#FF6B00]/50 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col h-full"
              >
                <div className="h-28 sm:h-32 w-full bg-slate-50/70 border-b border-slate-100 flex items-center justify-center p-2.5 overflow-hidden select-none">
                  {item.renderVisual()}
                </div>
                <div className="p-4 sm:p-5 flex flex-col flex-1 justify-start">
                  <h3 className="text-sm sm:text-base font-bold text-[#072B57] group-hover:text-[#FF6B00] transition-colors tracking-tight mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-snug">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================
            10. DIGITAL MARKETING SERVICES (Visual Split)
            ========================================================= */}
        <section
          id="digital-marketing-services"
          className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Image */}
            <div className="lg:col-span-5">
              <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-xs group">
                <img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop"
                  alt="Digital marketing agency performance charts, SEO metrics and growth analytics in Delhi"
                  title="CBM Academy Digital Marketing Agency Services in Okhla, New Delhi"
                  width={1000}
                  height={667}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-60 sm:h-68 object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Right Info */}
            <div className="lg:col-span-7 space-y-4">
              <div className="about-section-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#FF6B00] text-xs font-extrabold uppercase tracking-wider border border-orange-200">
                <Building2 className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>DIGITAL MARKETING SERVICES</span>
              </div>

              {isServicesPage ? (
                <h1 className="about-section-heading text-3xl sm:text-4xl lg:text-[42px] font-black text-[#072B57] tracking-tight leading-[1.15]">
                  Digital Marketing <span className="text-[#FF6B00] about-accent">Services in Delhi</span>
                </h1>
              ) : (
                <h2 className="about-section-heading text-3xl sm:text-4xl lg:text-[42px] font-black text-[#072B57] tracking-tight leading-[1.15]">
                  Digital Marketing Agency in <span className="text-[#FF6B00] about-accent">Okhla, New Delhi</span>
                </h2>
              )}

              <p className="about-section-paragraph text-slate-600 text-sm sm:text-base leading-relaxed">
                We also help businesses grow online through SEO, Google Ads,
                Meta Ads, social media, analytics and AI-powered marketing.
              </p>

              <div className="pt-1">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#072B57] px-6 py-3 text-xs sm:text-sm font-bold text-white transition-all hover:bg-[#0c3c78] cursor-pointer shadow-md active:scale-98"
                >
                  <span>Explore Digital Marketing Services</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
