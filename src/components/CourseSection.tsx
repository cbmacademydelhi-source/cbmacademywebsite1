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
  Building2,
  Bot,
  ShoppingBag,
  Package,
  Globe,
  Briefcase,
  Megaphone,
  Search,
  TrendingUp,
  Share2,
  Video,
  Code2,
  GraduationCap,
  FileText,
  Folder,
  Users,
  QrCode,
} from 'lucide-react';
import { AITools } from './AITools';
import { CbmLogo } from './CbmLogo';
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
  AdobeFireflyLogo,
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
  HeyGenLogo,
  HiggsfieldLogo,
  GoogleAIStudioLogo,
  LovableLogo,
  ReplitLogo,
  BoltLogo,
  GoogleTagManagerLogo,
  UberSuggestLogo,
  OptmyzrLogo,
  MadgicxLogo,
  CreatifyLogo,
  AdCreativeAILogo,
  MixpanelLogo,
  PowerBILogo,
  JuliusAILogo,
  RowsAILogo,
  RazorpayLogo,
  WooCommerceLogo,
  ResendLogo,
  AiSensyLogo,
  ManychatLogo,
  MakeLogo,
  BotpressLogo,
  DuolingoLogo,
  ZohoCRMLogo,
  InteraktLogo,
  MotionLogo,
  ApolloLogo,
  CodaAILogo,
  AdobeExpressLogo,
  GumroadLogo,
  TealLogo,
  GammaLogo,
  BeautifulAILogo,
  PitchLogo,
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
      { name: 'Notion', role: 'Strategy Playbook Hub', logo: <NotionLogo className="w-5 h-5" /> },
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
      { name: 'Adobe Firefly', role: 'Generative AI & Design', logo: <AdobeFireflyLogo className="w-5 h-5" /> },
      { name: 'ChatGPT', role: 'Generative AI Prompts', logo: <ChatGPTLogo className="w-5 h-5" /> },
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
      { name: 'HeyGen', role: 'AI Video Avatars & Voice', logo: <HeyGenLogo className="w-5 h-5" /> },
      { name: 'Instagram', role: 'Reels Video Formats', logo: <InstagramLogo className="w-5 h-5" /> },
      { name: 'Higgsfield', role: 'Cinematic AI Video', logo: <HiggsfieldLogo className="w-5 h-5" /> },
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
      { name: 'ChatGPT', role: 'Copywriting & Hooks', logo: <ChatGPTLogo className="w-5 h-5" /> },
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
      { name: 'Google AI Studio', role: 'AI Prototyping & Models', logo: <GoogleAIStudioLogo className="w-5 h-5" /> },
      { name: 'Lovable', role: 'Full-Stack Web AI', logo: <LovableLogo className="w-5 h-5" /> },
      { name: 'Replit', role: 'Cloud Code & Hosting', logo: <ReplitLogo className="w-5 h-5" /> },
      { name: 'Bolt', role: 'In-Browser Full-Stack AI', logo: <BoltLogo className="w-5 h-5" /> },
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
      { name: 'Google Tag Manager', role: 'Tag & Conversion Tracking', logo: <GoogleTagManagerLogo className="w-5 h-5" /> },
      { name: 'UberSuggest', role: 'SEO & Keyword Intelligence', logo: <UberSuggestLogo className="w-5 h-5" /> },
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
      { name: 'Optmyzr', role: 'PPC Management & Optimization', logo: <OptmyzrLogo className="w-5 h-5" /> },
      { name: 'Madgicx', role: 'Autonomous Ad Optimization', logo: <MadgicxLogo className="w-5 h-5" /> },
      { name: 'Creatify', role: 'AI Short-Form Video Ads', logo: <CreatifyLogo className="w-5 h-5" /> },
      { name: 'AdCreative.ai', role: 'High-Converting Ad Creatives', logo: <AdCreativeAILogo className="w-5 h-5" /> },
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
      { name: 'Mixpanel', role: 'User & Product Analytics', logo: <MixpanelLogo className="w-5 h-5" /> },
      { name: 'Power BI', role: 'Enterprise BI Dashboards', logo: <PowerBILogo className="w-5 h-5" /> },
      { name: 'Julius AI', role: 'AI Data Analyst & Graphing', logo: <JuliusAILogo className="w-5 h-5" /> },
      { name: 'Rows AI', role: 'AI Spreadsheet Calculations', logo: <RowsAILogo className="w-5 h-5" /> },
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
      { name: 'Razorpay', role: 'Payment Gateway & Checkout', logo: <RazorpayLogo className="w-5 h-5" /> },
      { name: 'WooCommerce', role: 'WordPress E-Commerce', logo: <WooCommerceLogo className="w-5 h-5" /> },
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
      { name: 'Resend', role: 'Modern Email Delivery & API', logo: <ResendLogo className="w-5 h-5" /> },
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
      { name: 'AiSensy', role: 'WhatsApp Engagement Platform', logo: <AiSensyLogo className="w-5 h-5" /> },
      { name: 'Manychat', role: 'Chat & DM Automation', logo: <ManychatLogo className="w-5 h-5" /> },
      { name: 'Make', role: 'Visual Workflow Automation', logo: <MakeLogo className="w-5 h-5" /> },
      { name: 'Botpress', role: 'Conversational AI Chatbots', logo: <BotpressLogo className="w-5 h-5" /> },
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
      { name: 'Duolingo', role: 'Adaptive & Gamified Learning', logo: <DuolingoLogo className="w-5 h-5" /> },
      { name: 'Claude', role: 'Deep Analysis & Reasoning', logo: <ClaudeLogo className="w-5 h-5" /> },
      { name: 'Notion', role: 'AI Knowledge Workflows', logo: <NotionLogo className="w-5 h-5" /> },
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
      { name: 'Zoho CRM', role: 'Sales Pipeline & Lead Hub', logo: <ZohoCRMLogo className="w-5 h-5" /> },
      { name: 'Interakt', role: 'WhatsApp CRM & Shared Inbox', logo: <InteraktLogo className="w-5 h-5" /> },
      { name: 'Motion', role: 'AI Calendar & Task Automation', logo: <MotionLogo className="w-5 h-5" /> },
      { name: 'Apollo.io', role: 'B2B Lead Intelligence', logo: <ApolloLogo className="w-5 h-5" /> },
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
      { name: 'Coda AI', role: 'Collaborative AI Workspaces', logo: <CodaAILogo className="w-5 h-5" /> },
      { name: 'Adobe Express', role: 'Digital Asset Packaging', logo: <AdobeExpressLogo className="w-5 h-5" /> },
      { name: 'AdCreative.ai', role: 'Targeted Ad Creative AI', logo: <AdCreativeAILogo className="w-5 h-5" /> },
      { name: 'Gumroad', role: 'Digital Product Sales & Checkout', logo: <GumroadLogo className="w-5 h-5" /> },
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
      { name: 'Teal', role: 'Career Growth & Resume AI', logo: <TealLogo className="w-5 h-5" /> },
      { name: 'Gamma', role: 'AI Presentations & Documents', logo: <GammaLogo className="w-5 h-5" /> },
      { name: 'Beautiful.ai', role: 'Smart Presentation Design', logo: <BeautifulAILogo className="w-5 h-5" /> },
      { name: 'Pitch', role: 'Collaborative Pitch Decks', logo: <PitchLogo className="w-5 h-5" /> },
    ],
  },
];

interface BusinessOpportunity {
  title: string;
  description: string;
  image: string;
}

const BUSINESS_OPPORTUNITIES: BusinessOpportunity[] = [
  {
    title: 'Digital Marketing Agency',
    description: 'Offer marketing services to businesses.',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'AI Automation Agency',
    description: 'Help businesses automate and grow.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'E-commerce Business',
    description: 'Launch and grow your online store.',
    image: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Digital Products',
    description: 'Sell e-books, templates, and online courses.',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Website Development',
    description: 'Build websites and landing pages for clients.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Freelancing & Consulting',
    description: 'Work independently with clients.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
  },
];

interface CareerRoleItem {
  title: string;
  description: string;
  image: string;
}

const CAREER_ROLES: CareerRoleItem[] = [
  {
    title: 'Digital Marketing Executive',
    description: 'Work on campaigns and growth strategies.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'SEO / GEO / AEO Specialist',
    description: 'Improve website visibility and traffic.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Performance Marketing Specialist',
    description: 'Run and optimise paid ad campaigns.',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Social Media Manager',
    description: 'Plan and manage social media growth.',
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'AI Content Creator',
    description: 'Create engaging content using AI tools.',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Website Developer',
    description: 'Build and maintain websites for businesses.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80',
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
                loading="lazy"
                decoding="async"
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
          {/* =========================================================
              SECTION 1: BUSINESS OPPORTUNITIES
              ========================================================= */}
          <div className="mt-12 sm:mt-16 pt-10 sm:pt-14 border-t border-slate-200/80">
            <div className="max-w-3xl mb-6 sm:mb-8 text-left">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#FF6B00] block mb-1">
                BUSINESS OPPORTUNITIES
              </span>
              <h3 className="text-xl sm:text-3xl font-black text-[#072B57] tracking-tight">
                Build Your Own Digital Business
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Turn your skills into income by launching your own digital business.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
              {BUSINESS_OPPORTUNITIES.map((biz) => (
                <div
                  key={biz.title}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all overflow-hidden flex flex-col group"
                >
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-100">
                    <img
                      src={biz.image}
                      alt={biz.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3 sm:p-3.5 flex flex-col justify-between flex-1">
                    <h4 className="text-xs sm:text-[13px] font-bold text-[#072B57] leading-tight group-hover:text-[#FF6B00] transition-colors">
                      {biz.title}
                    </h4>
                    <p className="mt-1 text-[11px] sm:text-xs text-slate-500 leading-snug font-normal">
                      {biz.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* =========================================================
              SECTION 2: CAREER OPPORTUNITIES
              ========================================================= */}
          <div className="mt-12 sm:mt-16 pt-10 sm:pt-14 border-t border-slate-200/80">
            <div className="max-w-3xl mb-6 sm:mb-8 text-left">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#FF6B00] block mb-1">
                CAREER OPPORTUNITIES
              </span>
              <h3 className="text-xl sm:text-3xl font-black text-[#072B57] tracking-tight">
                Turn Your Skills Into a Career
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Explore job opportunities across digital marketing, AI and online business.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
              {CAREER_ROLES.map((role) => (
                <div
                  key={role.title}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all overflow-hidden flex flex-col group"
                >
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-100">
                    <img
                      src={role.image}
                      alt={role.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3 sm:p-3.5 flex flex-col justify-between flex-1">
                    <h4 className="text-xs sm:text-[13px] font-bold text-[#072B57] leading-tight group-hover:text-[#FF6B00] transition-colors">
                      {role.title}
                    </h4>
                    <p className="mt-1 text-[11px] sm:text-xs text-slate-500 leading-snug font-normal">
                      {role.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* =========================================================
              SECTION 3: PLACEMENT SUPPORT BANNER
              ========================================================= */}
          <div className="mt-12 sm:mt-16 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-sm p-6 sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* Left Side */}
              <div className="lg:col-span-5 flex flex-col items-start text-left">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#FF6B00] mb-2">
                  CAREER SUPPORT
                </span>
                <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-[#072B57] tracking-tight leading-tight mb-2.5">
                  100% Placement Support
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mb-6 font-normal">
                  Get complete career guidance and job opportunity assistance to help you start your career.
                </p>
                <button
                  type="button"
                  onClick={() => onOpenApply?.('Career Support & Placement Guidance')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6B00] hover:bg-[#e05f00] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-sm transition-all active:scale-98 cursor-pointer"
                >
                  <span>Start Your Career Journey</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Right Side: 4 evenly spaced items with icons only */}
              <div className="lg:col-span-7">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-3.5">
                  <div className="bg-slate-50/80 hover:bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex flex-col items-center text-center justify-center transition-all">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center text-[#FF6B00] mb-3">
                      <FileText className="w-5 h-5 text-[#FF6B00]" />
                    </div>
                    <span className="text-xs sm:text-[13px] font-bold text-[#072B57] leading-tight">
                      Resume Building
                    </span>
                  </div>

                  <div className="bg-slate-50/80 hover:bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex flex-col items-center text-center justify-center transition-all">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center text-[#FF6B00] mb-3">
                      <Folder className="w-5 h-5 text-[#FF6B00]" />
                    </div>
                    <span className="text-xs sm:text-[13px] font-bold text-[#072B57] leading-tight">
                      Portfolio Guidance
                    </span>
                  </div>

                  <div className="bg-slate-50/80 hover:bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex flex-col items-center text-center justify-center transition-all">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center text-[#FF6B00] mb-3">
                      <Users className="w-5 h-5 text-[#FF6B00]" />
                    </div>
                    <span className="text-xs sm:text-[13px] font-bold text-[#072B57] leading-tight">
                      Interview Preparation
                    </span>
                  </div>

                  <div className="bg-slate-50/80 hover:bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex flex-col items-center text-center justify-center transition-all">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center text-[#FF6B00] mb-3">
                      <Briefcase className="w-5 h-5 text-[#FF6B00]" />
                    </div>
                    <span className="text-xs sm:text-[13px] font-bold text-[#072B57] leading-tight">
                      Job Assistance
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-5 pt-4 border-t border-slate-100 font-normal">
              * Placement support provides comprehensive career mentorship, resume optimization, interview grooming, and recruitment network assistance; it does not constitute a legal guarantee of employment.
            </p>
          </div>

          {/* =========================================================
              COURSE COMPLETION CERTIFICATE PREVIEW SECTION
              ========================================================= */}
          <div className="mt-12 sm:mt-16 pt-10 sm:pt-14 border-t border-slate-200/80">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Column (6 cols): Certificate Preview */}
              <div className="lg:col-span-6 flex justify-center w-full">
                <div className="w-full max-w-lg bg-white rounded-2xl border-2 border-slate-200/90 shadow-xl overflow-hidden relative">
                  
                  {/* Decorative Certificate Inner Frame with Thin Gold Border */}
                  <div className="m-3 sm:m-4 p-5 sm:p-6 rounded-xl border border-amber-300/80 bg-gradient-to-b from-white via-amber-50/15 to-white relative">
                    
                    {/* Corner Ornaments */}
                    <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-amber-400" />
                    <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-amber-400" />
                    <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-amber-400" />
                    <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-amber-400" />

                    {/* Header: CBM Logo & Credentials */}
                    <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200">
                      <CbmLogo height={34} className="shrink-0" />
                      <div className="text-right">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                          CERTIFICATE ID
                        </span>
                        <span className="font-mono text-xs font-bold text-[#072B57] bg-slate-100 px-2 py-0.5 rounded border border-slate-200 inline-block mt-0.5">
                          CBM-2025-8841
                        </span>
                      </div>
                    </div>

                    {/* Title & Conferment */}
                    <div className="text-center pt-3 pb-2.5">
                      <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#FF6B00] mb-1">
                        <Sparkles className="w-3 h-3 text-[#FF6B00]" />
                        <span>CERTIFICATE OF COMPLETION</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">This is proudly presented to</p>
                      <p className="text-lg sm:text-xl font-black text-[#072B57] tracking-tight mt-0.5 mb-1">
                        RAHUL SHARMA
                      </p>
                      <p className="text-[11px] text-slate-600 max-w-xs mx-auto leading-tight">
                        for successfully fulfilling all curriculum requirements and live practical projects in
                      </p>
                      <div className="mt-2 py-1 px-3 rounded-lg bg-orange-50/70 border border-orange-200/80 inline-block">
                        <span className="text-xs sm:text-[13px] font-extrabold text-[#072B57]">
                          AI Pro Digital Marketing Course
                        </span>
                      </div>
                    </div>

                    {/* Skills Verified Tags */}
                    <div className="py-2 flex flex-wrap justify-center gap-1.5 border-t border-slate-100 mt-1.5">
                      {['SEO / GEO / AEO', 'Meta & Google Ads', 'AI Automation', 'GA4 Analytics'].map((sk) => (
                        <span key={sk} className="text-[9.5px] font-semibold text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/80">
                          {sk}
                        </span>
                      ))}
                    </div>

                    {/* Footer: QR Code, Authenticity Stamp & Signature */}
                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3 text-left">
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-white rounded border border-slate-200 shadow-2xs">
                          <QrCode className="w-7 h-7 text-[#072B57]" />
                        </div>
                        <div className="leading-tight">
                          <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">
                            VERIFIED CREDENTIAL
                          </span>
                          <span className="text-[9.5px] font-medium text-slate-600">
                            ISO 9001:2015 Registered
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-serif italic font-bold text-[#072B57] text-xs">
                          Academic Director
                        </div>
                        <span className="text-[9px] text-slate-400 uppercase tracking-wider block">
                          CBM Academy
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Right Column (6 cols): Copy & 3 Compact Benefits */}
              <div className="lg:col-span-6 flex flex-col items-start text-left">
                {/* Small orange label */}
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#FF6B00] mb-2 block">
                  COURSE COMPLETION CERTIFICATE
                </span>

                {/* Heading */}
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#072B57] tracking-tight leading-tight mb-3">
                  Get a Recognised Certificate <span className="text-[#FF6B00]">from CBM Academy</span>
                </h3>

                {/* Short description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg mb-6 font-normal">
                  Students receive a certificate after successfully completing all modules, assignments, and final assessments.
                </p>

                {/* 3 Compact Benefits with Simple Icons */}
                <div className="space-y-3 sm:space-y-3.5 w-full max-w-lg">
                  {/* Benefit 1 */}
                  <div className="flex items-start gap-3 p-3 sm:p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:bg-white hover:shadow-xs transition-all">
                    <div className="w-9 h-9 rounded-lg bg-orange-50 border border-orange-200/80 flex items-center justify-center text-[#FF6B00] shrink-0 mt-0.5">
                      <Award className="w-4 h-4 text-[#FF6B00]" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#072B57]">
                        Industry-relevant certificate
                      </h4>
                      <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 font-normal">
                        Endorsed by top digital agencies and hiring managers for practical competencies.
                      </p>
                    </div>
                  </div>

                  {/* Benefit 2 */}
                  <div className="flex items-start gap-3 p-3 sm:p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:bg-white hover:shadow-xs transition-all">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200/80 flex items-center justify-center text-[#1E60F2] shrink-0 mt-0.5">
                      <QrCode className="w-4 h-4 text-[#1E60F2]" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#072B57]">
                        Unique certificate ID with QR code
                      </h4>
                      <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 font-normal">
                        Instantly verifiable online 24/7 by employers on the central CBM registry.
                      </p>
                    </div>
                  </div>

                  {/* Benefit 3 */}
                  <div className="flex items-start gap-3 p-3 sm:p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:bg-white hover:shadow-xs transition-all">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-[#10B981] shrink-0 mt-0.5">
                      <Share2 className="w-4 h-4 text-[#10B981]" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#072B57]">
                        Shareable on LinkedIn and resume
                      </h4>
                      <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 font-normal">
                        Add directly to your LinkedIn credentials, online portfolio, and CV.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

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
