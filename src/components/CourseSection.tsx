import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Clock,
  Wrench,
  Award,
  Briefcase,
  Sparkles,
  Download,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Layers,
  Target,
  Search,
  Share2,
  BarChart3,
  Bot,
  Zap,
} from 'lucide-react';
import { AITools } from './AITools';

interface CourseSectionProps {
  onOpenApply?: (courseName?: string) => void;
  onOpenBrochure?: () => void;
  isStandalonePage?: boolean;
}

interface CourseModule {
  id: string;
  number: string;
  week: string;
  title: string;
  tagline: string;
  badgeBg: string;
  badgeText: string;
  accentColor: string;
  icon: React.ReactNode;
  topics: string[];
  project: string;
  tools: string[];
}

const COURSE_MODULES: CourseModule[] = [
  {
    id: 'module-1',
    number: '01',
    week: 'Weeks 1–2 • 15 Hours',
    title: 'Digital Marketing & AI Strategy Foundations',
    tagline: 'Master full-funnel marketing psychology, audience research and AI prompt systems.',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-[#1E60F2]',
    accentColor: '#1E60F2',
    icon: <Bot className="w-5 h-5 text-[#1E60F2]" />,
    topics: [
      'Digital marketing ecosystem, customer journeys & marketing funnels (AIDA & TOFU/MOFU/BOFU)',
      'Prompt engineering for marketers (ChatGPT, Claude 3.5 & Perplexity)',
      'Target persona profiling, competitor intelligence & TAM/SAM market research',
      'Digital brand positioning and setting business KPIs (CPA, ROAS, LTV, CAC)',
    ],
    project: 'Comprehensive Digital Marketing Audit & AI-Powered Brand Growth Blueprint',
    tools: ['ChatGPT', 'Perplexity', 'Notion AI', 'Claude'],
  },
  {
    id: 'module-2',
    number: '02',
    week: 'Weeks 3–4 • 18 Hours',
    title: 'Modern SEO, GEO & Generative AI Search',
    tagline: 'Dominate traditional search engines and emerging AI overviews (SGE & Perplexity).',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-[#7C3AED]',
    accentColor: '#7C3AED',
    icon: <Search className="w-5 h-5 text-[#7C3AED]" />,
    topics: [
      'Search intent mapping, keyword clustering & semantic entity research',
      'Generative Engine Optimization (GEO): ranking in Google AI Overviews & Perplexity',
      'On-page SEO, internal linking architectures & structured Schema markup',
      'Technical SEO: Core Web Vitals, site crawlability, indexing & robots.txt',
      'Authority building: ethical backlink acquisition & digital PR frameworks',
    ],
    project: 'Full-Scale Technical SEO Audit & 50-Keyword Ranked Content Plan',
    tools: ['Semrush', 'Google Search Console', 'Ahrefs', 'Screaming Frog', 'SurferSEO'],
  },
  {
    id: 'module-3',
    number: '03',
    week: 'Weeks 5–6 • 18 Hours',
    title: 'Performance Marketing & Google Ads Mastery',
    tagline: 'Run high-intent Search, Shopping, YouTube and Performance Max (PMax) campaigns.',
    badgeBg: 'bg-orange-50',
    badgeText: 'text-[#FF6B00]',
    accentColor: '#FF6B00',
    icon: <Target className="w-5 h-5 text-[#FF6B00]" />,
    topics: [
      'Google Search campaigns: keyword match types, negative keywords & Quality Score mastery',
      'Performance Max (PMax) campaigns: asset groups, audience signals & feed optimization',
      'YouTube Video ads & Display Network retargeting sequences',
      'Smart bidding algorithms (tCPA, tROAS) vs. manual bidding control',
      'Conversion tracking setup with Google Tag Manager (GTM) & GA4 linking',
    ],
    project: 'Live Campaign Simulation with ₹15,000 Ad Spend Budget & Real Search Ads Optimization',
    tools: ['Google Ads', 'Google Tag Manager', 'Google Keyword Planner', 'SpyFu'],
  },
  {
    id: 'module-4',
    number: '04',
    week: 'Weeks 7–8 • 16 Hours',
    title: 'Meta Ads & Social Media Media Buying',
    tagline: 'Scale Facebook & Instagram campaigns with Advantage+ and creative testing engines.',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-[#E11D48]',
    accentColor: '#E11D48',
    icon: <Share2 className="w-5 h-5 text-[#E11D48]" />,
    topics: [
      'Meta Business Manager architecture, Pixel setup & Conversions API (CAPI)',
      'Audience segmentation: custom audiences, Lookalikes & broad Advantage+ targeting',
      'High-ROAS creative testing systems: hooks, ad formats, UGC scripts & carousels',
      'Ad fatigue management, budget scaling strategies (CBO vs ABO) and ROAS math',
      'LinkedIn Ads & B2B lead generation funnels for high-ticket clients',
    ],
    project: 'End-to-End Meta Ads Campaign Launch with 12 Creative Variations & CAPI Tracking',
    tools: ['Meta Ads Manager', 'Canva AI', 'CapCut Pro', 'Meta Pixel Helper'],
  },
  {
    id: 'module-5',
    number: '05',
    week: 'Weeks 9–10 • 14 Hours',
    title: 'AI Content Creation, Copywriting & Media Production',
    tagline: 'Produce viral video scripts, photorealistic visuals and persuasive direct-response copy.',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-[#D97706]',
    accentColor: '#D97706',
    icon: <Sparkles className="w-5 h-5 text-[#D97706]" />,
    topics: [
      'High-converting copywriting frameworks (PAS, AIDA, Before-After-Bridge)',
      'AI image generation with Midjourney, DALL-E & Stable Diffusion for ad creatives',
      'Short-form vertical video production for Instagram Reels, YouTube Shorts & TikTok',
      'AI voice cloning, automated captioning & video editing workflows',
      'Automated multi-channel content repurposing engines',
    ],
    project: '30-Day Multi-Platform Content Engine with 10 AI-Generated Ad Creatives & Video Scripts',
    tools: ['Midjourney', 'Claude', 'Canva', 'ElevenLabs', 'Descript'],
  },
  {
    id: 'module-6',
    number: '06',
    week: 'Weeks 11–12 • 14 Hours',
    title: 'Web Analytics, GA4 & Conversion Rate Optimization (CRO)',
    tagline: 'Track visitor journeys, analyze user behavior and turn clicks into paying customers.',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-[#10B981]',
    accentColor: '#10B981',
    icon: <BarChart3 className="w-5 h-5 text-[#10B981]" />,
    topics: [
      'Google Analytics 4 (GA4) setup, data streams, custom events & dimensions',
      'Funnel exploration reports, path analysis & cross-channel attribution modeling',
      'Heatmaps, session replays and scroll depth analysis using Hotjar & Clarity',
      'Landing page CRO audits, friction reduction and high-converting UX principles',
      'Interactive business dashboard creation in Looker Studio for executive reporting',
    ],
    project: 'Interactive Looker Studio Executive Dashboard & CRO Landing Page Teardown',
    tools: ['Google Analytics 4', 'Looker Studio', 'Microsoft Clarity', 'Hotjar'],
  },
  {
    id: 'module-7',
    number: '07',
    week: 'Weeks 13–14 • 12 Hours',
    title: 'Marketing Automation, WhatsApp & CRM Workflows',
    tagline: 'Build automated lead nurture sequences, CRM pipelines and multi-app integrations.',
    badgeBg: 'bg-cyan-50',
    badgeText: 'text-[#0891B2]',
    accentColor: '#0891B2',
    icon: <Zap className="w-5 h-5 text-[#0891B2]" />,
    topics: [
      'Automated marketing pipelines connecting landing pages, ads, and CRMs',
      'Zapier & Make.com multi-step automations to eliminate manual lead handling',
      'WhatsApp Business API integration, automated chatbots & broadcasting rules',
      'Email marketing automation: welcome sequences, cart abandonment & drip campaigns',
      'Lead qualification, lead scoring and pipeline management in HubSpot CRM',
    ],
    project: 'Zero-Touch Automated Lead Pipeline with WhatsApp & Email Auto-Nurture Triggers',
    tools: ['Zapier', 'Make.com', 'HubSpot', 'Brevo', 'Wati'],
  },
  {
    id: 'module-8',
    number: '08',
    week: 'Weeks 15–16 • 15 Hours',
    title: 'Live Agency Capstone, Freelance Blueprint & Placement',
    tagline: 'Execute real client briefs, pitch high-ticket retainers and ace top hiring interviews.',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-[#4F46E5]',
    accentColor: '#4F46E5',
    icon: <Briefcase className="w-5 h-5 text-[#4F46E5]" />,
    topics: [
      'Executing a live agency capstone project with real deliverables and client KPI presentation',
      'Freelance agency blueprint: service packaging, pricing models & high-ticket proposal pitch decks',
      'International client outreach strategies using LinkedIn and personal branding',
      'Portfolio building, live campaign case study documentation and GitHub/deck showcase',
      '1-on-1 resume reviews, mock interviews with digital marketing managers & placement drives',
    ],
    project: 'Complete Agency Pitch Deck & Live Portfolio Presentation for Hiring Managers',
    tools: ['LinkedIn Sales Navigator', 'Pitch', 'Loom', 'Google Workspace'],
  },
];

export const CourseSection: React.FC<CourseSectionProps> = ({
  onOpenApply,
  onOpenBrochure,
  isStandalonePage = false,
}) => {
  const shouldReduceMotion = useReducedMotion();

  const DEFAULT_POSTER =
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1600&auto=format&fit=crop';

  const [posterUrl, setPosterUrl] = useState<string>(DEFAULT_POSTER);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cbm_course_landscape_poster');
      if (saved) {
        setPosterUrl(saved);
      }
    } catch {
      // localStorage may fail in private mode
    }
  }, []);

  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    'module-1': true,
    'module-2': true,
  });

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    COURSE_MODULES.forEach((m) => {
      all[m.id] = true;
    });
    setExpandedModules(all);
  };

  const collapseAll = () => {
    setExpandedModules({});
  };

  return (
    <>
      <section
        id="course"
        className="relative overflow-hidden bg-[#FAFAFA] pt-12 sm:pt-16 pb-10 sm:pb-14"
      >
        <div className="relative z-10 mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
          
          {/* =========================================================
              COURSE HERO / HEADER
              ========================================================= */}
          <div className="mx-auto max-w-4xl text-center mb-8 sm:mb-10">
            
            {/* Top Pill */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-50 text-[#FF6B00] text-xs font-bold uppercase tracking-wider border border-orange-200 mb-3.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>FLAGSHIP MASTER PROGRAM</span>
            </div>

            {/* Main Course Title */}
            {isStandalonePage ? (
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-black tracking-tight leading-[1.12] text-[#072B57]">
                AI Pro <span className="text-[#FF6B00]">Digital Marketing Course</span>
              </h1>
            ) : (
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-black tracking-tight leading-[1.12] text-[#072B57]">
                AI Pro <span className="text-[#FF6B00]">Digital Marketing Course</span>
              </h2>
            )}

            {/* Subtitle / Overview */}
            <p className="mt-3.5 text-sm sm:text-base md:text-[17px] font-normal text-slate-600 max-w-3xl mx-auto leading-relaxed">
              A comprehensive 16-week, practical curriculum engineered for modern careers. Master generative AI tools, performance marketing, search intelligence, full-funnel growth and live agency campaign execution.
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => onOpenApply?.('AI Pro Digital Marketing Course')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6B00] px-6 sm:px-7 py-3 sm:py-3.5 text-sm sm:text-base font-bold text-white shadow-md hover:bg-[#e05f00] hover:shadow-lg transition-all active:scale-98 cursor-pointer"
              >
                <span>Enroll in AI Pro Course</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onOpenBrochure?.()}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 sm:px-6 py-3 sm:py-3.5 text-sm sm:text-base font-bold text-[#072B57] border border-slate-200 shadow-2xs hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#FF6B00]" />
                <span>Download Detailed Syllabus (PDF)</span>
              </button>
            </div>
          </div>

          {/* =========================================================
              COURSE POSTER (LANDSCAPE) - PHOTO ONLY
              ========================================================= */}
          <div className="mb-10 sm:mb-12 relative rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 bg-white shadow-md">
            <div className="relative w-full aspect-[16/7.5] sm:aspect-[16/6.5] lg:aspect-[21/8] min-h-[240px] sm:min-h-[340px] lg:min-h-[420px] overflow-hidden">
              <img
                src={posterUrl}
                alt="AI Pro Digital Marketing Course Poster"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

          {/* =========================================================
              COURSE QUICK HIGHLIGHTS / STATS BAR
              ========================================================= */}
          <div className="mb-10 sm:mb-12 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            
            <div className="flex items-center gap-3 sm:gap-3.5 pt-2 sm:pt-0 sm:px-2">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF6B00] shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs text-slate-500 font-medium">Duration</span>
                <span className="text-sm sm:text-base font-bold text-[#072B57]">16 Weeks / 120+ Hrs</span>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-3.5 pt-3 sm:pt-0 sm:px-4">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1E60F2] shrink-0">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs text-slate-500 font-medium">Tools &amp; AI</span>
                <span className="text-sm sm:text-base font-bold text-[#072B57]">25+ Industry Tools</span>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-3.5 pt-3 sm:pt-0 sm:px-4">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#10B981] shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs text-slate-500 font-medium">Practical Work</span>
                <span className="text-sm sm:text-base font-bold text-[#072B57]">10+ Live Projects</span>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-3.5 pt-3 sm:pt-0 sm:px-4">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-[#7C3AED] shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs text-slate-500 font-medium">Credentials</span>
                <span className="text-sm sm:text-base font-bold text-[#072B57]">Dual Certifications</span>
              </div>
            </div>

          </div>

          {/* =========================================================
              MODULES CURRICULUM SECTION
              ========================================================= */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-[#072B57] tracking-tight">
                Curriculum Modules <span className="text-slate-400 font-medium text-base">(8 Modules • 16 Weeks)</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Step-by-step syllabus from fundamentals to high-growth campaign execution.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={expandAll}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-[#072B57] hover:border-slate-300 transition-colors cursor-pointer"
              >
                Expand All
              </button>
              <button
                type="button"
                onClick={collapseAll}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-[#072B57] hover:border-slate-300 transition-colors cursor-pointer"
              >
                Collapse All
              </button>
            </div>
          </div>

          {/* MODULE ACCORDION / EXPANDABLE LIST */}
          <div className="space-y-4">
            {COURSE_MODULES.map((module, index) => {
              const isExpanded = !!expandedModules[module.id];

              return (
                <motion.div
                  key={module.id}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="rounded-2xl bg-white border border-slate-200/90 shadow-2xs overflow-hidden transition-all duration-200 hover:border-slate-300"
                >
                  {/* Module Header Bar (Clickable) */}
                  <button
                    type="button"
                    onClick={() => toggleModule(module.id)}
                    aria-expanded={isExpanded}
                    className="w-full p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 text-left cursor-pointer hover:bg-slate-50/70 transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 min-w-0">
                      
                      {/* Module Number & Icon */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-black tracking-wider uppercase ${module.badgeBg} ${module.badgeText}`}
                        >
                          MODULE {module.number}
                        </span>
                      </div>

                      {/* Title & Tagline */}
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-base sm:text-lg font-bold text-[#072B57] leading-snug">
                            {module.title}
                          </h4>
                          <span className="hidden sm:inline-flex text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            {module.week}
                          </span>
                        </div>
                        <p className="text-xs sm:text-[13px] text-slate-500 font-normal mt-0.5 line-clamp-1 sm:line-clamp-none">
                          {module.tagline}
                        </p>
                      </div>
                    </div>

                    {/* Expand/Collapse Chevron */}
                    <div className="shrink-0 flex items-center gap-2 pt-0.5 sm:pt-0">
                      <span className="sm:hidden text-[10.5px] font-semibold text-slate-500">
                        {module.week}
                      </span>
                      <div
                        className={`w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180 bg-slate-100' : 'bg-white'
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </button>

                  {/* Expanded Module Details */}
                  {isExpanded && (
                    <div className="px-4 sm:px-6 pb-5 pt-1 border-t border-slate-100/90 bg-slate-50/40">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-3">
                        
                        {/* Left: Learning Topics */}
                        <div className="lg:col-span-7 space-y-2.5">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                            Key Competencies &amp; Topics:
                          </span>
                          <ul className="space-y-2">
                            {module.topics.map((topic, i) => (
                              <li key={i} className="flex items-start gap-2.5 text-xs sm:text-[13.5px] text-slate-700 leading-relaxed">
                                <CheckCircle2 className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
                                <span>{topic}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Right: Hands-on Project & Tools */}
                        <div className="lg:col-span-5 flex flex-col justify-between gap-4 p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                          {/* Project Box */}
                          <div>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-[#072B57] uppercase tracking-wider mb-1.5">
                              <Target className="w-3.5 h-3.5 text-[#FF6B00]" />
                              <span>Hands-on Live Project:</span>
                            </div>
                            <p className="text-xs sm:text-[13px] text-slate-700 font-medium leading-relaxed bg-orange-50/50 p-2.5 rounded-lg border border-orange-100/70">
                              {module.project}
                            </p>
                          </div>

                          {/* Tools Box */}
                          <div>
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                              Tools &amp; Platforms Mastered:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {module.tools.map((t) => (
                                <span
                                  key={t}
                                  className="text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-md transition-colors"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* =========================================================
              BOTTOM SYLLABUS CTA BANNER
              ========================================================= */}
          <div className="mt-10 sm:mt-12 rounded-2xl bg-gradient-to-r from-[#072B57] to-[#0A3D7C] text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-orange-500/20 text-[#FF6B00] text-xs font-bold uppercase tracking-wider border border-orange-400/30 mb-2">
                NEXT COHORT ADMISSIONS OPEN
              </span>
              <h4 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
                Ready to Become an AI-Powered Digital Marketer?
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                Seats are limited to 20 learners per batch for personalized campaign mentorship and agency internship access.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0 w-full md:w-auto">
              <button
                type="button"
                onClick={() => onOpenApply?.('AI Pro Digital Marketing Course')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#FF6B00] text-white font-bold text-sm hover:bg-[#e05f00] shadow-md transition-all active:scale-98 cursor-pointer"
              >
                <span>Apply for Upcoming Batch</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onOpenBrochure?.()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/20 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#FF6B00]" />
                <span>Get Syllabus</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================
          AI & MARKETING TOOLS (SEAMLESSLY INTEGRATED BELOW)
          ========================================================= */}
      <AITools onOpenApply={onOpenApply} />
    </>
  );
};

