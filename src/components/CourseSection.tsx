import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Clock,
  Wrench,
  Award,
  Sparkles,
  Download,
  ArrowRight,
  Layers,
  Target,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  Route,
  Zap,
} from 'lucide-react';
import { AITools } from './AITools';
import {
  ChatGPTLogo,
  ClaudeLogo,
  GoogleLogo,
  SemrushLogo,
  SearchConsoleLogo,
  GoogleAdsLogo,
  YouTubeLogo,
  MetaLogo,
  InstagramLogo,
  CanvaLogo,
  MidjourneyLogo,
  ElevenLabsLogo,
  FigmaLogo,
  GoogleAnalyticsLogo,
  LookerStudioLogo,
  ZapierLogo,
  HubSpotLogo,
  WhatsAppLogo,
  LinkedInLogo,
  NotionLogo,
  WordPressLogo,
  ShopifyLogo,
} from './CurriculumLogos';

interface CourseSectionProps {
  onOpenApply?: (courseName?: string) => void;
  onOpenBrochure?: () => void;
  isStandalonePage?: boolean;
}

interface ToolWithLogo {
  name: string;
  role: string;
  logo: React.ReactNode;
}

interface CurriculumModule {
  id: string;
  number: string;
  phase: string;
  duration: string;
  title: string;
  summary: string;
  topics: string[];
  project: string;
  projectOutcome: string;
  tools: ToolWithLogo[];
}

const MODULES: CurriculumModule[] = [
  {
    id: 'mod-1',
    number: '01',
    phase: 'Phase 1: Foundations',
    duration: 'Week 1 • 8h',
    title: 'Digital Marketing Foundations',
    summary: 'Marketing fundamentals, customer psychology, branding, buyer journeys, and digital marketing strategy.',
    topics: [
      'Marketing Fundamentals & Business Models',
      'Customer Psychology & Persona Mapping',
      'Brand Positioning & Value Proposition',
      'Full-Funnel Digital Marketing Strategy',
    ],
    project: 'Brand Positioning & Customer Persona Playbook',
    projectOutcome: 'Build a complete market strategy and buyer journey map for an active brand.',
    tools: [
      { name: 'ChatGPT', role: 'Persona Simulator', logo: <ChatGPTLogo className="w-5 h-5" /> },
      { name: 'Claude', role: 'Strategic Analysis', logo: <ClaudeLogo className="w-5 h-5" /> },
      { name: 'Google', role: 'Market Intel', logo: <GoogleLogo className="w-5 h-5" /> },
    ],
  },
  {
    id: 'mod-2',
    number: '02',
    phase: 'Phase 1: Generative Design',
    duration: 'Week 2 • 8h',
    title: 'AI-Powered Graphic Design & Generative AI',
    summary: 'AI image generation, Canva, creative design, brand assets, and advertising creatives.',
    topics: [
      'Midjourney & Generative AI Image Prompts',
      'Canva Pro Rapid Creative Systems',
      'High-Converting Ad Banners & Creatives',
      'Visual Brand Guidelines & Asset Kits',
    ],
    project: 'AI Brand Visual Identity & Ad Creative Kit',
    projectOutcome: 'Generate a complete suite of brand creatives, social posts, and ad banners using AI.',
    tools: [
      { name: 'Midjourney', role: 'Photorealistic Ad Art', logo: <MidjourneyLogo className="w-5 h-5" /> },
      { name: 'Canva', role: 'Creative Asset Production', logo: <CanvaLogo className="w-6 h-auto" /> },
      { name: 'Figma', role: 'Visual Layouts & Frames', logo: <FigmaLogo className="w-4 h-5" /> },
    ],
  },
  {
    id: 'mod-3',
    number: '03',
    phase: 'Phase 2: Video & Content',
    duration: 'Week 3 • 8h',
    title: 'AI Video Production & Content Creation',
    summary: 'AI video generation, scripting, Reels, voiceovers, video editing, and short-form content.',
    topics: [
      'AI Video Generation & Prompt Scripting',
      'Viral Reels & Shorts Storyboarding',
      'ElevenLabs Synthetic Voiceover Pipelines',
      'Short-Form Video Editing & Dynamic Captions',
    ],
    project: 'Viral Short-Form Video Campaign Pipeline',
    projectOutcome: 'Produce and edit 5 high-converting Reels using AI scripting, voiceovers, and dynamic captions.',
    tools: [
      { name: 'ElevenLabs', role: 'AI Voice & Speech', logo: <ElevenLabsLogo className="w-5 h-5" /> },
      { name: 'YouTube', role: 'Shorts & Long-Form', logo: <YouTubeLogo className="w-5 h-5" /> },
      { name: 'Instagram', role: 'Reels Video Formats', logo: <InstagramLogo className="w-5 h-5" /> },
    ],
  },
  {
    id: 'mod-4',
    number: '04',
    phase: 'Phase 2: Social Media & Copy',
    duration: 'Week 4 • 8h',
    title: 'Social Media Strategy & Copywriting',
    summary: 'Content calendars, social media growth, engaging captions, hooks, and persuasive marketing copy.',
    topics: [
      '30-Day Multi-Channel Content Calendars',
      'Organic Growth on Instagram & LinkedIn',
      'Direct-Response Copywriting (AIDA/PAS)',
      'Viral Hook Formulas & Engaging Captions',
    ],
    project: 'Multi-Platform 30-Day Content & Copy Engine',
    projectOutcome: 'Develop a strategic editorial calendar with viral hooks and conversion copy for LinkedIn and Instagram.',
    tools: [
      { name: 'Instagram', role: 'Visual Social Growth', logo: <InstagramLogo className="w-5 h-5" /> },
      { name: 'LinkedIn', role: 'B2B Thought Leadership', logo: <LinkedInLogo className="w-5 h-5" /> },
      { name: 'Meta', role: 'Community & Distribution', logo: <MetaLogo className="w-5 h-5" /> },
    ],
  },
  {
    id: 'mod-5',
    number: '05',
    phase: 'Phase 2: Web & Conversions',
    duration: 'Week 5 • 8h',
    title: 'Website Development & Conversion Design',
    summary: 'WordPress, Elementor, landing pages, responsive design, website forms, and conversion optimisation.',
    topics: [
      'WordPress Architecture & Elementor Pro',
      'High-Converting Landing Page Layouts',
      'Mobile Responsive Design & Speed Tuning',
      'Lead Capture Forms & CRO Best Practices',
    ],
    project: 'High-Converting Lead Gen Landing Page Build',
    projectOutcome: 'Design and launch a fast, mobile-friendly landing page with integrated capture forms and CRO principles.',
    tools: [
      { name: 'WordPress', role: 'CMS & Page Engine', logo: <WordPressLogo className="w-5 h-5" /> },
      { name: 'Figma', role: 'UI/UX Mockups', logo: <FigmaLogo className="w-4 h-5" /> },
      { name: 'Google', role: 'PageSpeed & Testing', logo: <GoogleLogo className="w-5 h-5" /> },
    ],
  },
  {
    id: 'mod-6',
    number: '06',
    phase: 'Phase 3: Search & SEO/GEO',
    duration: 'Week 6 • 8h',
    title: 'SEO, GEO & Answer Engine Optimization (AEO)',
    summary: 'Technical SEO, keyword research, on-page SEO, local SEO, structured data, and AI search visibility.',
    topics: [
      'Technical SEO, Core Web Vitals & Schema',
      'Semantic Keyword Intelligence & Search Intent',
      'Generative Engine Optimization (GEO) for AI Overviews',
      'Local SEO & Google Business Profile Domination',
    ],
    project: 'Live SEO Audit & GEO Optimization Blueprint',
    projectOutcome: 'Audit and optimize a live site to capture both traditional SERP rankings and AI Overview citations.',
    tools: [
      { name: 'Semrush', role: 'Keyword & SERP Intel', logo: <SemrushLogo className="w-5 h-5" /> },
      { name: 'Search Console', role: 'Indexing & Queries', logo: <SearchConsoleLogo className="w-5 h-5" /> },
      { name: 'Google', role: 'AI Overviews & SERP', logo: <GoogleLogo className="w-5 h-5" /> },
    ],
  },
  {
    id: 'mod-7',
    number: '07',
    phase: 'Phase 3: Performance Ads',
    duration: 'Week 7 • 10h',
    title: 'Performance Marketing & Paid Ads',
    summary: 'Meta Ads, Google Ads, audience targeting, retargeting, A/B testing, and campaign optimisation.',
    topics: [
      'Meta Advantage+ Shopping & Lead Gen Ads',
      'Google Search & Performance Max (PMax)',
      'Creative Testing Matrices & Hook Testing',
      'Budget Allocation, Bid Strategies & ROAS Scaling',
    ],
    project: 'Live Paid Ad Campaign Structure & Budget Scaling',
    projectOutcome: 'Launch and optimize live search and social ad sets with real tracking and ROAS modeling.',
    tools: [
      { name: 'Google Ads', role: 'Search & PMax Campaigns', logo: <GoogleAdsLogo className="w-5 h-5" /> },
      { name: 'Meta', role: 'Ads Manager Engine', logo: <MetaLogo className="w-5 h-5" /> },
      { name: 'YouTube', role: 'Video Ad Action', logo: <YouTubeLogo className="w-5 h-5" /> },
    ],
  },
  {
    id: 'mod-8',
    number: '08',
    phase: 'Phase 3: Analytics & Data',
    duration: 'Week 8 • 8h',
    title: 'Marketing Analytics & Performance Tracking',
    summary: 'Google Analytics 4, Google Tag Manager, conversion tracking, campaign reporting, and ROI measurement.',
    topics: [
      'GA4 Event-Based Data Models & Custom Dimensions',
      'Google Tag Manager (GTM) E-Commerce DataLayer',
      'Meta Conversions API (CAPI) & Pixel Setup',
      'Executive KPI Dashboards in Looker Studio',
    ],
    project: 'Executive GA4 & Looker Studio Analytics Dashboard',
    projectOutcome: 'Connect multi-channel ad data, conversion events, and traffic funnels into an automated dashboard.',
    tools: [
      { name: 'GA4', role: 'Custom Events & Funnels', logo: <GoogleAnalyticsLogo className="w-5 h-5" /> },
      { name: 'Looker Studio', role: 'BI Dashboards', logo: <LookerStudioLogo className="w-5 h-5" /> },
      { name: 'Google', role: 'Tag Manager & Cloud Sync', logo: <GoogleLogo className="w-5 h-5" /> },
    ],
  },
  {
    id: 'mod-9',
    number: '09',
    phase: 'Phase 4: E-Commerce Growth',
    duration: 'Week 9 • 8h',
    title: 'E-commerce & Online Business Growth',
    summary: 'Online store setup, product listings, e-commerce marketing, shopping campaigns, and customer retention.',
    topics: [
      'Shopify Store Setup & High-Converting Themes',
      'Product Page CRO & Catalog Optimization',
      'Dynamic Product Ads & Catalog Feeds',
      'Retention Loops & Abandoned Cart Recovery',
    ],
    project: 'End-to-End E-Commerce Growth & Store Funnel',
    projectOutcome: 'Launch an optimized store with high-converting product pages and automated abandoned-checkout flows.',
    tools: [
      { name: 'Shopify', role: 'E-Commerce Platform', logo: <ShopifyLogo className="w-5 h-5" /> },
      { name: 'Meta', role: 'Catalog & Shopping Ads', logo: <MetaLogo className="w-5 h-5" /> },
      { name: 'Google', role: 'Merchant Center & Shopping', logo: <GoogleLogo className="w-5 h-5" /> },
    ],
  },
  {
    id: 'mod-10',
    number: '10',
    phase: 'Phase 4: Email & CRM',
    duration: 'Week 10 • 8h',
    title: 'Email Marketing & Customer Automation',
    summary: 'Email campaigns, newsletters, automated follow-ups, audience segmentation, and lead nurturing.',
    topics: [
      'Lead Magnet Funnels & List Building',
      'Automated Welcome & Nurture Drip Sequences',
      'Behavioral Segmentation & RFM Customer Scoring',
      'Deliverability (DKIM/SPF) & Subject Line AI',
    ],
    project: '7-Stage Automated Customer Retention Drip Workflow',
    projectOutcome: 'Build an automated multi-step email sequence that warms cold leads and drives recurring revenue.',
    tools: [
      { name: 'HubSpot', role: 'Email Automation Flows', logo: <HubSpotLogo className="w-5 h-5" /> },
      { name: 'Zapier', role: 'Webhook Data Triggers', logo: <ZapierLogo className="w-5 h-5" /> },
      { name: 'ChatGPT', role: 'Subject Line & Copy AI', logo: <ChatGPTLogo className="w-5 h-5" /> },
    ],
  },
  {
    id: 'mod-11',
    number: '11',
    phase: 'Phase 4: WhatsApp Funnels',
    duration: 'Week 11 • 8h',
    title: 'WhatsApp Marketing & Lead Generation',
    summary: 'WhatsApp Business, customer enquiries, lead follow-ups, broadcast campaigns, and messaging automation.',
    topics: [
      'WhatsApp Business API Setup & Verification',
      'Automated Greeting, Away & Quick Reply Sequences',
      'Click-to-WhatsApp Paid Ad Funnels',
      'Targeted Broadcast Campaigns & CRM Sync',
    ],
    project: 'Automated WhatsApp Lead Capture & Follow-Up Funnel',
    projectOutcome: 'Deploy an instant WhatsApp responder flow connected to paid ads to qualify and convert leads.',
    tools: [
      { name: 'WhatsApp', role: 'Business API Engine', logo: <WhatsAppLogo className="w-5 h-5" /> },
      { name: 'Meta', role: 'Click-to-WhatsApp Ads', logo: <MetaLogo className="w-5 h-5" /> },
      { name: 'Zapier', role: 'CRM Instant Notification', logo: <ZapierLogo className="w-5 h-5" /> },
    ],
  },
  {
    id: 'mod-12',
    number: '12',
    phase: 'Phase 5: AI & Automation',
    duration: 'Week 12 • 8h',
    title: 'AI Automation, Agents & Workflow Design',
    summary: 'AI tools, chatbots, no-code automation, AI-assisted workflows, and business process automation.',
    topics: [
      'Zapier Multi-Step Automated Marketing Paths',
      'Custom AI Prompt Architecture & System Instructions',
      'Autonomous Research & Content Generation Agents',
      'Productivity Stacks & Marketing Operations',
    ],
    project: 'Multi-Step Zero-Touch AI Marketing Automation',
    projectOutcome: 'Connect AI models with CRM and marketing channels to automate research, lead alerts, and reporting.',
    tools: [
      { name: 'Zapier', role: 'Workflow Automation', logo: <ZapierLogo className="w-5 h-5" /> },
      { name: 'ChatGPT', role: 'Custom GPTs & API', logo: <ChatGPTLogo className="w-5 h-5" /> },
      { name: 'Claude', role: 'Deep Analysis & Reasoning', logo: <ClaudeLogo className="w-5 h-5" /> },
    ],
  },
  {
    id: 'mod-13',
    number: '13',
    phase: 'Phase 5: Sales & CRM Pipelines',
    duration: 'Week 13 • 8h',
    title: 'CRM, Lead Management & Sales',
    summary: 'Customer relationship management, lead qualification, sales pipelines, objection handling, and closing techniques.',
    topics: [
      'HubSpot Deal Pipeline & Stage Architecture',
      'Lead Scoring, Routing & Qualification Criteria',
      'Automated Task Triggers & Follow-Up Cadences',
      'Consultative Sales Frameworks & Closing Calls',
    ],
    project: 'Full-Funnel CRM Pipeline & Lead Scoring System',
    projectOutcome: 'Configure a CRM pipeline that tracks inbound leads from first touch to closed contract.',
    tools: [
      { name: 'HubSpot', role: 'CRM & Pipeline Hub', logo: <HubSpotLogo className="w-5 h-5" /> },
      { name: 'WhatsApp', role: 'Lead Engagement Channel', logo: <WhatsAppLogo className="w-5 h-5" /> },
      { name: 'Google', role: 'Calendar & Workspace Sync', logo: <GoogleLogo className="w-5 h-5" /> },
    ],
  },
  {
    id: 'mod-14',
    number: '14',
    phase: 'Phase 6: Digital Products & Funnels',
    duration: 'Week 14 • 8h',
    title: 'Digital Products, Funnels & Online Sales',
    summary: 'E-books, templates, online courses, digital product marketing, sales funnels, pricing, and upselling.',
    topics: [
      'Digital Product Ideation, Pricing & Packaging',
      'High-Converting Sales Funnel Wireframes & Copy',
      'Checkout Optimisation, Order Bumps & Upsells',
      'Automated Digital Delivery & Customer Onboarding',
    ],
    project: 'Complete Digital Product Sales Funnel & Delivery',
    projectOutcome: 'Create and launch a digital product offer with high-converting sales copy, payment flow, and instant delivery.',
    tools: [
      { name: 'Notion', role: 'Product Docs & Workspaces', logo: <NotionLogo className="w-5 h-5" /> },
      { name: 'Canva', role: 'Digital Asset Packaging', logo: <CanvaLogo className="w-6 h-auto" /> },
      { name: 'Meta', role: 'Targeted Traffic Generation', logo: <MetaLogo className="w-5 h-5" /> },
    ],
  },
  {
    id: 'mod-15',
    number: '15',
    phase: 'Phase 6: Career & Client Retainers',
    duration: 'Weeks 15–16 • 12h',
    title: 'Communication, Client Management & Career Readiness',
    summary: 'Professional communication, client presentations, proposal writing, interview preparation, portfolio building, and workplace readiness.',
    topics: [
      'High-Ticket Freelance Proposals & Retainers',
      'Live Portfolio Case Studies & Agency Workflows',
      'Client Onboarding, Scoping & Executive Reporting',
      '1-on-1 Mock Interviews with Agency Hiring Leads',
    ],
    project: 'Verified Agency-Grade Portfolio & Client Pitch Deck',
    projectOutcome: 'Assemble an interview-ready portfolio of live campaigns and pitch an end-to-end strategy to mentors.',
    tools: [
      { name: 'LinkedIn', role: 'Job Search & Outreach', logo: <LinkedInLogo className="w-5 h-5" /> },
      { name: 'Notion', role: 'Portfolio & Case Studies', logo: <NotionLogo className="w-5 h-5" /> },
      { name: 'Google', role: 'Executive Presentations', logo: <GoogleLogo className="w-5 h-5" /> },
    ],
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
  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'roadmap' | 'grid'>('roadmap');
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const allExpanded = MODULES.every((m) => !!expandedModules[m.id]);
  const toggleAll = () => {
    if (allExpanded) {
      setExpandedModules({});
    } else {
      const next: Record<string, boolean> = {};
      MODULES.forEach((m) => {
        next[m.id] = true;
      });
      setExpandedModules(next);
    }
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cbm_course_landscape_poster');
      if (saved) {
        setPosterUrl(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  const activeModule = MODULES[activeModuleIndex];

  const handleNext = () => {
    setActiveModuleIndex((prev) => (prev < MODULES.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setActiveModuleIndex((prev) => (prev > 0 ? prev - 1 : MODULES.length - 1));
  };

  return (
    <>
      <section
        id="course"
        className="relative overflow-hidden bg-[#FAFAFA] pt-10 sm:pt-16 pb-12 sm:pb-16 border-b border-slate-100"
      >
        <div className="relative z-10 mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
          
          {/* =========================================================
              HEADER
              ========================================================= */}
          <div className="mx-auto max-w-4xl text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#FF6B00] text-[11px] sm:text-xs font-bold uppercase tracking-wider border border-orange-200/80 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>FLAGSHIP 16-WEEK PROGRAM</span>
            </div>

            {isStandalonePage ? (
              <h1 className="text-2xl sm:text-4xl lg:text-[44px] font-black tracking-tight leading-tight text-[#072B57]">
                AI Pro <span className="text-[#FF6B00]">Digital Marketing Course</span>
              </h1>
            ) : (
              <h2 className="text-2xl sm:text-4xl lg:text-[44px] font-black tracking-tight leading-tight text-[#072B57]">
                AI Pro <span className="text-[#FF6B00]">Digital Marketing Course</span>
              </h2>
            )}

            <p className="mt-2.5 text-xs sm:text-base font-normal text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Master search, paid performance, AI automation, and live agency campaigns through practical, project-driven execution.
            </p>

            {/* Quick Actions */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => onOpenApply?.('AI Pro Digital Marketing Course')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6B00] px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#e05f00] transition-all active:scale-98 cursor-pointer"
              >
                <span>Enroll in AI Pro Course</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onOpenBrochure?.()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#072B57] border border-slate-200 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#FF6B00]" />
                <span>Download Syllabus (PDF)</span>
              </button>
            </div>
          </div>

          {/* =========================================================
              COURSE POSTER (LANDSCAPE) - PHOTO ONLY
              ========================================================= */}
          <div className="mb-8 sm:mb-10 relative rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 bg-white shadow-md">
            <div className="relative w-full aspect-[16/7.5] sm:aspect-[16/6.5] lg:aspect-[21/8] min-h-[200px] sm:min-h-[300px] lg:min-h-[380px] overflow-hidden">
              <img
                src={posterUrl}
                alt="AI Pro Digital Marketing Course Poster"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

          {/* =========================================================
              CLEAN SPEC METRICS STRIP
              ========================================================= */}
          <div className="mb-10 sm:mb-12 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3.5 sm:p-5 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            <div className="flex items-center gap-2.5 sm:gap-3 pt-1 sm:pt-0 sm:px-2">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF6B00] shrink-0">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <span className="block text-[11px] text-slate-400 font-medium uppercase tracking-wider">Duration</span>
                <span className="text-xs sm:text-sm font-bold text-[#072B57]">16 Weeks / 120+ Hrs</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3 pt-2.5 sm:pt-0 sm:px-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1E60F2] shrink-0">
                <Wrench className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <span className="block text-[11px] text-slate-400 font-medium uppercase tracking-wider">Tools &amp; AI</span>
                <span className="text-xs sm:text-sm font-bold text-[#072B57]">25+ Industry Tools</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3 pt-2.5 sm:pt-0 sm:px-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#10B981] shrink-0">
                <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <span className="block text-[11px] text-slate-400 font-medium uppercase tracking-wider">Practical</span>
                <span className="text-xs sm:text-sm font-bold text-[#072B57]">10+ Live Projects</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3 pt-2.5 sm:pt-0 sm:px-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-[#7C3AED] shrink-0">
                <Award className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <span className="block text-[11px] text-slate-400 font-medium uppercase tracking-wider">Credentials</span>
                <span className="text-xs sm:text-sm font-bold text-[#072B57]">Dual Certifications</span>
              </div>
            </div>
          </div>

          {/* =========================================================
              ANIMATED, RESPONSIVE CURRICULUM ARCHITECTURE WITH LOGOS
              ========================================================= */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#FF6B00] uppercase tracking-wider mb-1">
                <Zap className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>Industry Learning Architecture</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#072B57] tracking-tight">
                Curriculum Architecture
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                15 Progressive Modules • Real Tool Stacks &amp; Live Deliverables
              </p>
            </div>

            {/* View Switcher: All 15 Modules vs Interactive Pathway */}
            <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
              {viewMode === 'grid' && (
                <button
                  type="button"
                  onClick={toggleAll}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:text-[#072B57] bg-white border border-slate-200 hover:border-slate-300 shadow-2xs transition-all cursor-pointer"
                >
                  {allExpanded ? (
                    <>
                      <ChevronUp className="w-3.5 h-3.5 text-[#FF6B00]" />
                      <span>Collapse All</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3.5 h-3.5 text-[#FF6B00]" />
                      <span>Expand All Details</span>
                    </>
                  )}
                </button>
              )}

              <div className="inline-flex items-center p-1 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setViewMode('roadmap')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'roadmap'
                      ? 'bg-[#072B57] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Route className="w-3.5 h-3.5" />
                  <span>Interactive Pathway</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-[#072B57] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>All 15 Modules</span>
                </button>
              </div>
            </div>
          </div>

          {/* =========================================================
              MODE 1: INTERACTIVE ROADMAP (ANIMATED & STEP-BY-STEP)
              ========================================================= */}
          {viewMode === 'roadmap' && (
            <div className="space-y-6">
              {/* Responsive Module Stepper / Tab Bar */}
              <div className="relative">
                {/* Horizontal scroll container with hidden scrollbar for smooth mobile swipe */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth snap-x">
                  {MODULES.map((mod, idx) => {
                    const isActive = idx === activeModuleIndex;
                    return (
                      <button
                        key={mod.id}
                        type="button"
                        onClick={() => setActiveModuleIndex(idx)}
                        className={`relative flex-shrink-0 snap-start flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border transition-all duration-200 cursor-pointer text-left ${
                          isActive
                            ? 'bg-white border-[#FF6B00] shadow-md shadow-orange-500/10 ring-1 ring-[#FF6B00]'
                            : 'bg-white/80 hover:bg-white border-slate-200 hover:border-slate-300 text-slate-600'
                        }`}
                      >
                        {/* Module number circle */}
                        <span
                          className={`w-6 h-6 rounded-lg text-[11px] font-mono font-bold flex items-center justify-center transition-colors ${
                            isActive
                              ? 'bg-[#FF6B00] text-white'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {mod.number}
                        </span>

                        <div className="min-w-0 pr-1">
                          <span
                            className={`block text-[10px] font-semibold uppercase tracking-wider ${
                              isActive ? 'text-[#FF6B00]' : 'text-slate-400'
                            }`}
                          >
                            Module {mod.number}
                          </span>
                          <span
                            className={`block text-xs font-bold truncate max-w-[140px] sm:max-w-[170px] ${
                              isActive ? 'text-[#072B57]' : 'text-slate-700'
                            }`}
                          >
                            {mod.title.split('&')[0].trim()}
                          </span>
                        </div>

                        {/* Mini tool logo preview in tab */}
                        <div className="hidden sm:flex items-center -space-x-1 pl-1">
                          {mod.tools.slice(0, 2).map((t) => (
                            <div
                              key={t.name}
                              className="w-5 h-5 rounded-full bg-slate-50 border border-white shadow-2xs flex items-center justify-center p-0.5"
                              title={t.name}
                            >
                              {t.logo}
                            </div>
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Module Showcase / Command Panel */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeModule.id}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, y: -14 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-sm overflow-hidden"
                >
                  {/* Top Bar inside active showcase */}
                  <div className="bg-gradient-to-r from-[#072B57] to-[#0A3D7C] text-white px-5 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-[#FF6B00] text-white font-mono font-black text-sm flex items-center justify-center shadow-sm">
                        {activeModule.number}
                      </span>
                      <div>
                        <div className="text-[11px] font-semibold tracking-wider text-orange-200 uppercase">
                          {activeModule.phase}
                        </div>
                        <div className="text-xs sm:text-sm font-medium text-slate-200">
                          {activeModule.duration}
                        </div>
                      </div>
                    </div>

                    {/* Step Navigation Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
                        title="Previous Module"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-mono font-bold text-white/80 px-1">
                        {activeModuleIndex + 1} / {MODULES.length}
                      </span>
                      <button
                        type="button"
                        onClick={handleNext}
                        className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
                        title="Next Module"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Main Active Module Body (2-Column Architecture) */}
                  <div className="p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                    
                    {/* Left Column (7 cols): Title, Summary, Key Topics, Live Deliverable */}
                    <div className="lg:col-span-7 space-y-5">
                      <div>
                        <h4 className="text-xl sm:text-2xl font-black text-[#072B57] tracking-tight leading-snug">
                          {activeModule.title}
                        </h4>
                        <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                          {activeModule.summary}
                        </p>
                      </div>

                      {/* Limited, High-Impact Competencies */}
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                          Core Competencies &amp; Execution
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {activeModule.topics.map((topic) => (
                            <div
                              key={topic}
                              className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition-colors"
                            >
                              <CheckCircle2 className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
                              <span className="text-xs font-medium text-slate-700 leading-snug">
                                {topic}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Live Hands-On Project Callout */}
                      <div className="rounded-xl sm:rounded-2xl bg-gradient-to-br from-orange-50/70 to-amber-50/40 border border-orange-200/80 p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Target className="w-4 h-4 text-[#FF6B00]" />
                          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FF6B00]">
                            Live Practical Deliverable
                          </span>
                        </div>
                        <h5 className="text-sm sm:text-base font-bold text-[#072B57]">
                          {activeModule.project}
                        </h5>
                        <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                          {activeModule.projectOutcome}
                        </p>
                      </div>
                    </div>

                    {/* Right Column (5 cols): Official Brand Tool Logos Stack */}
                    <div className="lg:col-span-5 bg-slate-50/90 rounded-2xl border border-slate-200/80 p-4 sm:p-5 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Platforms &amp; Tool Stack
                          </span>
                          <span className="text-[11px] font-semibold text-[#072B57] bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                            Industry Certified
                          </span>
                        </div>

                        {/* Animated Tool Logo Cards */}
                        <div className="space-y-2.5">
                          {activeModule.tools.map((tool) => (
                            <div
                              key={tool.name}
                              className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-[#FF6B00]/40 hover:shadow-xs transition-all group"
                            >
                              {/* Logo Icon Box */}
                              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                {tool.logo}
                              </div>

                              {/* Tool Info */}
                              <div className="min-w-0 flex-1">
                                <div className="text-xs sm:text-sm font-bold text-[#072B57] group-hover:text-[#FF6B00] transition-colors truncate">
                                  {tool.name}
                                </div>
                                <div className="text-[11px] text-slate-500 font-medium truncate">
                                  {tool.role}
                                </div>
                              </div>

                              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 shrink-0">
                                Hands-on
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action trigger for this module */}
                      <div className="mt-6 pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => onOpenApply?.(`${activeModule.title} (Module ${activeModule.number})`)}
                          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF6B00] hover:bg-[#e05f00] text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer active:scale-98"
                        >
                          <span>Enroll in this Track</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onOpenBrochure?.()}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-[#072B57] text-xs font-bold transition-all cursor-pointer shrink-0"
                        >
                          <Download className="w-3.5 h-3.5 text-[#FF6B00]" />
                          <span>Syllabus</span>
                        </button>
                      </div>

                    </div>

                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {/* =========================================================
              MODE 2: ALL 15 MODULES VIEW (CLICK TITLE FOR COMPLETE DETAILS)
              ========================================================= */}
          {viewMode === 'grid' && (
            <div className="space-y-3.5">
              {/* Mobile helper notice */}
              <div className="flex sm:hidden items-center justify-between px-1 text-xs text-slate-500">
                <span>Tap title to view complete details</span>
                <button
                  type="button"
                  onClick={toggleAll}
                  className="font-bold text-[#FF6B00] hover:underline cursor-pointer"
                >
                  {allExpanded ? 'Collapse All' : 'Expand All'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 items-start">
                {MODULES.map((module, index) => {
                  const isExpanded = !!expandedModules[module.id];

                  return (
                    <motion.article
                      key={module.id}
                      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-20px' }}
                      transition={{ duration: 0.35, delay: index * 0.03 }}
                      className={`relative rounded-2xl bg-white border transition-all duration-200 overflow-hidden ${
                        isExpanded
                          ? 'border-[#072B57] ring-1 ring-[#072B57]/15 shadow-md'
                          : 'border-slate-200/90 shadow-2xs hover:border-[#FF6B00]/60 hover:shadow-sm'
                      }`}
                    >
                      {/* Top Card Body */}
                      <div className="p-4 sm:p-5">
                        {/* Header: Numeral, Phase, & Duration */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-[#072B57] text-white font-mono text-[11px] font-extrabold tracking-wider">
                              MOD {module.number}
                            </span>
                            <span className="text-[10.5px] font-bold text-[#FF6B00] uppercase tracking-wider">
                              {module.phase}
                            </span>
                          </div>
                          <span className="text-[11px] font-semibold text-slate-500">
                            {module.duration}
                          </span>
                        </div>

                        {/* Clickable Title: Click to show/hide complete details */}
                        <button
                          type="button"
                          onClick={() => toggleModule(module.id)}
                          aria-expanded={isExpanded}
                          className="w-full text-left group/title cursor-pointer flex items-start justify-between gap-3 focus:outline-none pt-0.5"
                        >
                          <h4 className="text-base sm:text-[17px] font-bold text-[#072B57] group-hover/title:text-[#FF6B00] transition-colors tracking-tight leading-snug">
                            {module.title}
                          </h4>
                          <span
                            className={`shrink-0 inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                              isExpanded
                                ? 'bg-[#072B57] text-white border-[#072B57]'
                                : 'bg-slate-50 text-slate-600 border-slate-200 group-hover/title:border-[#FF6B00] group-hover/title:text-[#FF6B00] group-hover/title:bg-orange-50'
                            }`}
                          >
                            <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
                            <ChevronDown
                              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                isExpanded ? 'rotate-180' : ''
                              }`}
                            />
                          </span>
                        </button>

                        {/* 1-Liner Summary */}
                        <p className="text-xs text-slate-500 leading-relaxed mt-1.5 font-normal">
                          {module.summary}
                        </p>

                        {/* Summary preview strip when collapsed */}
                        {!isExpanded && (
                          <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-col gap-2.5">
                            {/* Live Deliverable pill */}
                            <div className="flex items-center gap-1.5 text-xs text-slate-800 bg-orange-50/60 border border-orange-100 px-2.5 py-1.5 rounded-lg">
                              <Target className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
                              <span className="font-semibold truncate text-[11.5px]">
                                {module.project}
                              </span>
                            </div>

                            {/* Tool Brand Logos Strip */}
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                                {module.tools.map((t) => (
                                  <div
                                    key={t.name}
                                    className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 rounded-lg px-2 py-1 shrink-0"
                                    title={`${t.name} - ${t.role}`}
                                  >
                                    <span className="shrink-0">{t.logo}</span>
                                    <span className="text-[11px] font-bold text-slate-700">
                                      {t.name}
                                    </span>
                                  </div>
                                ))}
                              </div>

                              <span
                                onClick={() => toggleModule(module.id)}
                                className="text-[11px] font-semibold text-slate-400 hover:text-[#FF6B00] transition-colors cursor-pointer shrink-0"
                              >
                                Click title to expand
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Complete Details Section (Revealed AFTER clicking title only) */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={shouldReduceMotion ? false : { opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={shouldReduceMotion ? undefined : { opacity: 0, height: 0 }}
                            transition={{ duration: 0.28, ease: 'easeOut' }}
                            className="border-t border-slate-100 bg-slate-50/70 p-4 sm:p-5 space-y-4"
                          >
                            {/* Complete Core Competencies */}
                            <div>
                              <div className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                                Core Competencies &amp; Execution Topics
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {module.topics.map((topic) => (
                                  <div
                                    key={topic}
                                    className="flex items-start gap-2 p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6B00] shrink-0 mt-0.5" />
                                    <span className="text-xs font-medium text-slate-700 leading-snug">
                                      {topic}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Full Live Practical Deliverable */}
                            <div className="rounded-xl bg-gradient-to-br from-orange-50/90 to-amber-50/60 border border-orange-200/80 p-3.5 sm:p-4">
                              <div className="flex items-center gap-1.5 mb-1">
                                <Target className="w-4 h-4 text-[#FF6B00]" />
                                <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#FF6B00]">
                                  Live Practical Deliverable
                                </span>
                              </div>
                              <h5 className="text-xs sm:text-sm font-bold text-[#072B57]">
                                {module.project}
                              </h5>
                              <p className="mt-1 text-xs text-slate-600 leading-relaxed font-normal">
                                {module.projectOutcome}
                              </p>
                            </div>

                            {/* Complete Platforms & Tools Stack with Roles */}
                            <div>
                              <div className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                                Platforms &amp; Applied Tool Stack
                              </div>
                              <div className="space-y-2">
                                {module.tools.map((tool) => (
                                  <div
                                    key={tool.name}
                                    className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs"
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                                        {tool.logo}
                                      </div>
                                      <div className="min-w-0">
                                        <div className="text-xs font-bold text-[#072B57] truncate">
                                          {tool.name}
                                        </div>
                                        <div className="text-[10.5px] text-slate-500 font-medium truncate">
                                          {tool.role}
                                        </div>
                                      </div>
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 shrink-0">
                                      Hands-on
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Track Action CTAs */}
                            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                              <button
                                type="button"
                                onClick={() =>
                                  onOpenApply?.(`${module.title} (Module ${module.number})`)
                                }
                                className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF6B00] hover:bg-[#e05f00] text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer active:scale-98"
                              >
                                <span>Enroll in this Module</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => onOpenBrochure?.()}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-[#072B57] text-xs font-bold transition-all cursor-pointer shrink-0"
                              >
                                <Download className="w-3.5 h-3.5 text-[#FF6B00]" />
                                <span>Get Syllabus</span>
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.article>
                  );
                })}
              </div>
            </div>
          )}

          {/* =========================================================
              CLEAN REFINED CTA BANNER
              ========================================================= */}
          <div className="mt-10 sm:mt-12 rounded-2xl bg-[#072B57] text-white p-5 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-5 shadow-sm">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/20 text-[#FF6B00] text-[10.5px] font-bold uppercase tracking-wider border border-orange-400/30 mb-1.5">
                LIMITED SEATS PER BATCH
              </div>
              <h4 className="text-lg sm:text-xl font-bold tracking-tight">
                Ready to Master AI Digital Marketing?
              </h4>
              <p className="text-xs text-slate-300 mt-0.5 max-w-lg">
                Personalized campaign mentorship, live agency ad spend, and placement support.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto">
              <button
                type="button"
                onClick={() => onOpenApply?.('AI Pro Digital Marketing Course')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF6B00] text-white font-bold text-xs sm:text-sm hover:bg-[#e05f00] transition-all cursor-pointer active:scale-98"
              >
                <span>Apply for Upcoming Batch</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onOpenBrochure?.()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm border border-white/15 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>Get Syllabus</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================
          AI & MARKETING TOOLS SECTION
          ========================================================= */}
      <AITools onOpenApply={onOpenApply} />
    </>
  );
};
