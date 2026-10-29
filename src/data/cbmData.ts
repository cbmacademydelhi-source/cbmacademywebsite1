import {
  CourseModule,
  AITool,
  JobOpportunity,
  VerifiedCertificate,
  BlogPost,
} from '../types';

export const COURSE_MODULES: CourseModule[] = [
  {
    id: 1,
    number: '01',
    title: 'Digital Marketing Foundations',
    iconName: 'Compass',
    shortDescription:
      'Marketing fundamentals, customer psychology, branding, buyer journeys, and digital marketing strategy.',
    syllabus: [
      'Core Marketing Fundamentals & Market Dynamics',
      'Customer Psychology & Buyer Persona Mapping',
      'Brand Identity, Positioning & Value Propositions',
      'Full-Funnel Digital Marketing Architecture',
    ],
    tools: ['ChatGPT', 'Claude', 'Google Market Finder', 'Notion'],
    duration: '1 Week (8 Hours)',
    level: 'Foundational',
    liveProjects: 'Brand positioning playbook and buyer journey mapping for an active business',
  },
  {
    id: 2,
    number: '02',
    title: 'AI-Powered Graphic Design & Generative AI',
    iconName: 'Palette',
    shortDescription:
      'AI image generation, Canva, creative design, brand assets, and advertising creatives.',
    syllabus: [
      'Generative AI Prompt Engineering for Visuals',
      'Midjourney Commercial Product Art & Concepts',
      'Canva Pro Automated Asset Workflows',
      'High-Converting Social & Ad Display Creatives',
    ],
    tools: ['Midjourney', 'Canva Pro', 'Adobe Firefly', 'DALL-E 3'],
    duration: '1 Week (8 Hours)',
    level: 'Beginner to Intermediate',
    liveProjects: 'Generating complete multi-channel visual ad creatives and brand guidelines using AI',
  },
  {
    id: 3,
    number: '03',
    title: 'AI Video Production & Content Creation',
    iconName: 'Video',
    shortDescription:
      'AI video generation, scripting, Reels, voiceovers, video editing, and short-form content.',
    syllabus: [
      'AI Video Generation & Prompt Scripting',
      'Viral Short-Form Reels & TikTok Formats',
      'ElevenLabs Synthetic Voiceover Pipelines',
      'Dynamic Subtitles, B-Roll & Fast Video Editing',
    ],
    tools: ['ElevenLabs', 'HeyGen', 'Instagram', 'Higgsfield'],
    duration: '1 Week (8 Hours)',
    level: 'Intermediate',
    liveProjects: 'Producing 5 viral short-form video ads with AI scripting, voiceovers, and editing',
  },
  {
    id: 4,
    number: '04',
    title: 'Social Media Strategy & Copywriting',
    iconName: 'Share2',
    shortDescription:
      'Content calendars, social media growth, engaging captions, hooks, and persuasive marketing copy.',
    syllabus: [
      'Strategic 30-Day Content Planning & Theming',
      'Organic Growth on Instagram, LinkedIn & X',
      'Direct-Response Copywriting Frameworks (AIDA/PAS)',
      'High-CTR Hooks, Captions & Call-to-Actions',
    ],
    tools: ['Meta Business Suite', 'LinkedIn', 'ChatGPT', 'Buffer'],
    duration: '1 Week (8 Hours)',
    level: 'All Levels',
    liveProjects: '30-day multi-platform social media strategy with high-converting copy',
  },
  {
    id: 5,
    number: '05',
    title: 'Website Development & Conversion Design',
    iconName: 'Layout',
    shortDescription:
      'WordPress, Elementor, landing pages, responsive design, website forms, and conversion optimisation.',
    syllabus: [
      'WordPress Installation & Domain/Hosting Setup',
      'Elementor Pro Drag-and-Drop Page Architecture',
      'High-Converting Landing Page Layouts & CTAs',
      'Lead Capture Form Integration & CRO Optimization',
    ],
    tools: ['Google AI Studio', 'Lovable', 'Replit', 'Bolt'],
    duration: '1 Week (8 Hours)',
    level: 'Beginner to Intermediate',
    liveProjects: 'Designing and launching a high-converting, mobile-responsive landing page',
  },
  {
    id: 6,
    number: '06',
    title: 'SEO, GEO & Answer Engine Optimization (AEO)',
    iconName: 'Search',
    shortDescription:
      'Technical SEO, keyword research, on-page SEO, local SEO, structured data, and AI search visibility.',
    syllabus: [
      'Technical SEO Audits, Core Web Vitals & Schema',
      'Semantic Keyword Research & Intent Clustering',
      'Generative Engine Optimization (GEO) for AI Overviews',
      'Local SEO & Google Business Profile Domination',
    ],
    tools: ['Semrush', 'Google Search Console', 'Google Tag Manager', 'UberSuggest'],
    duration: '1 Week (8 Hours)',
    level: 'Intermediate to Advanced',
    liveProjects: 'Complete technical SEO audit and GEO optimization blueprint for a live website',
  },
  {
    id: 7,
    number: '07',
    title: 'Performance Marketing & Paid Ads',
    iconName: 'Target',
    shortDescription:
      'Meta Ads, Google Ads, audience targeting, retargeting, A/B testing, and campaign optimisation.',
    syllabus: [
      'Meta Advantage+ Shopping & Custom Audiences',
      'Google Search Network & Performance Max (PMax)',
      'Creative Testing Matrices & Iterative Hook Testing',
      'Budget Pacing, Bid Strategies & ROAS Scaling',
    ],
    tools: ['Optmyzr', 'Madgicx', 'Creatify', 'AdCreative.ai'],
    duration: '1 Week (10 Hours)',
    level: 'Intermediate to Advanced',
    liveProjects: 'Deploying live paid advertising campaigns with real conversion tracking',
  },
  {
    id: 8,
    number: '08',
    title: 'Marketing Analytics & Performance Tracking',
    iconName: 'BarChart3',
    shortDescription:
      'Google Analytics 4, Google Tag Manager, conversion tracking, campaign reporting, and ROI measurement.',
    syllabus: [
      'GA4 Event-Based Data Models & Custom Events',
      'Google Tag Manager (GTM) Conversion Triggers',
      'Meta Conversions API (CAPI) & Pixel Integration',
      'Automated Executive KPI Dashboards in Looker Studio',
    ],
    tools: ['Mixpanel', 'Power BI', 'Julius AI', 'Rows AI'],
    duration: '1 Week (8 Hours)',
    level: 'Intermediate',
    liveProjects: 'Setting up end-to-end event tracking and an automated real-time client dashboard',
  },
  {
    id: 9,
    number: '09',
    title: 'E-commerce & Online Business Growth',
    iconName: 'ShoppingBag',
    shortDescription:
      'Online store setup, product listings, e-commerce marketing, shopping campaigns, and customer retention.',
    syllabus: [
      'Shopify Store Architecture & High-Converting Themes',
      'Product Page CRO & Catalog Optimization',
      'Dynamic Product Ads (DPA) & Google Merchant Center',
      'Customer Retention & Abandoned Checkout Recoveries',
    ],
    tools: ['Shopify', 'Meta', 'Razorpay', 'WooCommerce'],
    duration: '1 Week (8 Hours)',
    level: 'Intermediate',
    liveProjects: 'Launching an e-commerce store with optimized product pages and retargeting setup',
  },
  {
    id: 10,
    number: '10',
    title: 'Email Marketing & Customer Automation',
    iconName: 'Mail',
    shortDescription:
      'Email campaigns, newsletters, automated follow-ups, audience segmentation, and lead nurturing.',
    syllabus: [
      'High-Converting Lead Magnet Funnel Architecture',
      'Automated Welcome, Nurture & Promotional Sequences',
      'Audience RFM Segmentation & Lifecycle Triggers',
      'Email Deliverability Best Practices (SPF, DKIM, DMARC)',
    ],
    tools: ['HubSpot', 'Zapier', 'ChatGPT', 'Resend'],
    duration: '1 Week (8 Hours)',
    level: 'Beginner to Intermediate',
    liveProjects: 'Building a 7-stage automated lead nurturing and retention email workflow',
  },
  {
    id: 11,
    number: '11',
    title: 'WhatsApp Marketing & Lead Generation',
    iconName: 'MessageSquare',
    shortDescription:
      'WhatsApp Business, customer enquiries, lead follow-ups, broadcast campaigns, and messaging automation.',
    syllabus: [
      'WhatsApp Business API & Cloud API Setup',
      'Automated Welcome, FAQ & Conversational Funnels',
      'Click-to-WhatsApp Paid Ad Campaigns',
      'Broadcast Messaging & Lead Conversion Sequences',
    ],
    tools: ['AiSensy', 'Manychat', 'Make', 'Botpress'],
    duration: '1 Week (8 Hours)',
    level: 'Beginner to Intermediate',
    liveProjects: 'Creating an automated WhatsApp conversational funnel connected to lead generation ads',
  },
  {
    id: 12,
    number: '12',
    title: 'AI Automation, Agents & Workflow Design',
    iconName: 'Cpu',
    shortDescription:
      'AI tools, chatbots, no-code automation, AI-assisted workflows, and business process automation.',
    syllabus: [
      'Multi-Step Automated Workflows with Zapier & Webhooks',
      'Custom GPT & System Prompt Design for Marketing Ops',
      'Autonomous Lead Research & Data Enrichment Agents',
      'High-Velocity AI Content & Reporting Workflows',
    ],
    tools: ['Zapier', 'Duolingo', 'Claude', 'Notion'],
    duration: '1 Week (8 Hours)',
    level: 'Intermediate to Advanced',
    liveProjects: 'Building a zero-touch automated marketing research and alerting pipeline',
  },
  {
    id: 13,
    number: '13',
    title: 'CRM, Lead Management & Sales',
    iconName: 'Users',
    shortDescription:
      'Customer relationship management, lead qualification, sales pipelines, objection handling, and closing techniques.',
    syllabus: [
      'HubSpot CRM Deal Stages & Pipeline Structuring',
      'Lead Scoring, Routing & MQL/SQL Qualification',
      'Automated Follow-Up Tasks & Reminder Sequences',
      'Sales Closing Strategies & Consultative Pitch Calls',
    ],
    tools: ['Zoho CRM', 'Interakt', 'Motion', 'Apollo.io'],
    duration: '1 Week (8 Hours)',
    level: 'Intermediate',
    liveProjects: 'Configuring a full CRM pipeline with automated lead scoring and stage triggers',
  },
  {
    id: 14,
    number: '14',
    title: 'Digital Products, Funnels & Online Sales',
    iconName: 'Layers',
    shortDescription:
      'E-books, templates, online courses, digital product marketing, sales funnels, pricing, and upselling.',
    syllabus: [
      'Digital Product Packaging & Pricing Strategy',
      'High-Converting Funnel Architecture & Sales Copy',
      'Checkout Optimization, Order Bumps & Upsell Chains',
      'Automated Product Delivery & Onboarding Loops',
    ],
    tools: ['Coda AI', 'Adobe Express', 'AdCreative.ai', 'Gumroad'],
    duration: '1 Week (8 Hours)',
    level: 'Intermediate',
    liveProjects: 'Creating and deploying a digital product offer with sales page and automated delivery',
  },
  {
    id: 15,
    number: '15',
    title: 'Communication, Client Management & Career Readiness',
    iconName: 'Briefcase',
    shortDescription:
      'Professional communication, client presentations, proposal writing, interview preparation, portfolio building, and workplace readiness.',
    syllabus: [
      'High-Ticket Freelance Client Acquisition on Upwork & LinkedIn',
      'Agency Retainer Proposals, Scope Decks & Pricing Models',
      'Verified Client Case Studies & Portfolio Packaging',
      '1-on-1 Mock Interviews with Agency Hiring Leads',
    ],
    tools: ['Teal', 'Gamma', 'Beautiful.ai', 'Pitch'],
    duration: '2 Weeks (12 Hours)',
    level: 'Career Acceleration',
    liveProjects: 'Assembling an interview-ready case study portfolio and sending live client pitches',
  },
];

export const AI_TOOLS: AITool[] = [
  {
    name: 'ChatGPT',
    category: 'Conversational & Strategic AI',
    description:
      'Generate marketing briefs, high-converting ad copy, customer personas, and workflow automations.',
    icon: 'Bot',
    badge: 'OpenAI Enterprise',
    useCase:
      'Persona generation, ad hook writing, and rapid campaign planning',
    capabilities: [
      'Custom GPTs',
      'Data Analysis',
      'Persona Simulator',
      'Script Generation',
    ],
  },

  {
    name: 'Midjourney',
    category: 'Generative Visual Design',
    description:
      'Create commercial-grade product photography, photorealistic ad concepts, and visual campaign assets.',
    icon: 'Image',
    badge: 'v6 High Res',
    useCase:
      'Generating custom visual ad creatives without photoshoots',
    capabilities: [
      'Photorealistic Rendering',
      'Brand Consistency',
      'Concept Mockups',
      'Aspect Ratio Control',
    ],
  },

  {
    name: 'Google Analytics 4',
    category: 'Behavioral Intelligence',
    description:
      'Track full-funnel customer journeys, predictive conversion metrics, and automated anomaly alerts.',
    icon: 'LineChart',
    badge: 'Predictive GA4',
    useCase:
      'Full-funnel attribution and automated revenue reporting',
    capabilities: [
      'Predictive Audiences',
      'Path Exploration',
      'Custom Conversions',
      'Looker Studio Sync',
    ],
  },

  {
    name: 'Semrush',
    category: 'SERP & Competitor Intelligence',
    description:
      'Conduct keyword gap analysis, competitor backlink audits, and SERP position monitoring.',
    icon: 'Search',
    badge: 'Enterprise SEO',
    useCase:
      'Reverse engineering competitor organic and paid search strategies',
    capabilities: [
      'Keyword Magic Tool',
      'Position Tracking',
      'Site Audit Engine',
      'Topic Research',
    ],
  },

  {
    name: 'Meta Ads Manager',
    category: 'Algorithmic Paid Acquisition',
    description:
      'Scale paid acquisition with Advantage+ AI targeting, dynamic creative testing, and automated rules.',
    icon: 'Layers',
    badge: 'Advantage+ AI',
    useCase:
      'Scaling e-commerce and lead gen ROAS on Facebook & Instagram',
    capabilities: [
      'Advantage+ Campaigns',
      'CAPI Integration',
      'Custom Conversions',
      'LTV Modeling',
    ],
  },

  {
    name: 'HubSpot',
    category: 'Inbound Marketing & CRM',
    description:
      'Automate multi-touch lead nurturing, AI content creation, and sales pipeline tracking.',
    icon: 'Cpu',
    badge: 'Certified Partner',
    useCase:
      'Automating multi-touch lead nurturing and CRM workflows',
    capabilities: [
      'Marketing Hub',
      'Lead Scoring Engine',
      'Chatbot Automation',
      'Deal Pipeline Tracking',
    ],
  },
];

/* =========================================================
   JOB OPPORTUNITIES
   Demo HR emails added for testing
========================================================= */

export const JOB_OPPORTUNITIES: JobOpportunity[] = [
  {
    id: 'JOB-101',
    role: 'Performance Marketing Specialist',
    companyCategory: 'Leading D2C E-Commerce Brand',
    location: 'New Delhi (Hybrid)',
    isRemote: false,
    salary: '₹6.5 - ₹9.5 LPA',
    experience: '0-2 Years',
    type: 'Full-Time',
    skills: [
      'Meta Ads Manager',
      'Google Ads',
      'CAPI',
      'ROAS Scaling',
      'GA4',
    ],
    postedDaysAgo: 2,

    // DEMO HR EMAIL
    hrEmail: 'demo.hr.performance@cbmacademy.in',
  },

  {
    id: 'JOB-102',
    role: 'Senior SEO Strategist & Content Lead',
    companyCategory: 'Global Digital Agency Partner',
    location: 'Remote (Pan India)',
    isRemote: true,
    salary: '₹7.0 - ₹11.0 LPA',
    experience: '1-3 Years',
    type: 'Full-Time',
    skills: [
      'Semrush',
      'Technical SEO',
      'ChatGPT GEO',
      'GSC',
      'Looker Studio',
    ],
    postedDaysAgo: 1,

    // DEMO HR EMAIL
    hrEmail: 'demo.hr.seo@cbmacademy.in',
  },

  {
    id: 'JOB-103',
    role: 'AI Marketing & Growth Executive',
    companyCategory: 'Fast-Growing B2B SaaS Startup',
    location: 'Gurugram / Hybrid',
    isRemote: false,
    salary: '₹5.5 - ₹8.0 LPA',
    experience: '0-1 Year',
    type: 'Full-Time',
    skills: [
      'HubSpot',
      'Email Flows',
      'Claude AI',
      'LinkedIn Inbound',
      'Funnel Optimization',
    ],
    postedDaysAgo: 3,

    // DEMO HR EMAIL
    hrEmail: 'demo.hr.growth@cbmacademy.in',
  },

  {
    id: 'JOB-104',
    role: 'Digital Marketing & Social Media Manager',
    companyCategory: 'Premium Lifestyle Brand',
    location: 'South Delhi / Noida',
    isRemote: false,
    salary: '₹5.0 - ₹7.5 LPA',
    experience: '0-2 Years',
    type: 'Full-Time',
    skills: [
      'Instagram Reels',
      'Canva Pro',
      'Meta Pixel',
      'Influencer Outreach',
      'Community Growth',
    ],
    postedDaysAgo: 4,

    // DEMO HR EMAIL
    hrEmail: 'demo.hr.social@cbmacademy.in',
  },

  {
    id: 'JOB-105',
    role: 'Google Ads & PPC Campaign Analyst',
    companyCategory: 'International Export & FinTech Firm',
    location: 'Remote',
    isRemote: true,
    salary: '₹8.0 - ₹13.0 LPA',
    experience: '1-3 Years',
    type: 'Full-Time',
    skills: [
      'PMax Campaigns',
      'Merchant Center',
      'Smart Bidding',
      'CRO',
    ],
    postedDaysAgo: 2,

    // DEMO HR EMAIL
    hrEmail: 'demo.hr.ppc@cbmacademy.in',
  },

  {
    id: 'JOB-106',
    role: 'Junior Growth Associate',
    companyCategory: 'Top Tier Advertising Network',
    location: 'New Delhi / Connaught Place',
    isRemote: false,
    salary: '₹3.6 - ₹5.0 LPA',
    experience: 'Fresher / Entry Level',
    type: 'Full-Time / PPO',
    skills: [
      'Digital Marketing',
      'Keyword Research',
      'Ad Copywriting',
      'Analytics',
    ],
    postedDaysAgo: 1,

    // DEMO HR EMAIL
    hrEmail: 'demo.hr.junior@cbmacademy.in',
  },
];

/* =========================================================
   VERIFIED CERTIFICATES
========================================================= */

export const VERIFIED_CERTIFICATES: Record<
  string,
  VerifiedCertificate
> = {
  'CBM-2025-8841': {
    id: 'CBM-2025-8841',
    studentName: 'Aarav Sharma',
    courseName:
      'Master in AI-Powered Digital Marketing & Performance Growth',
    issueDate: 'January 18, 2025',
    completionDate: 'January 15, 2025',
    grade: 'Grade A+ (Distinction - 94%)',
    credentialUrl:
      'https://cbmacademy.in/verify/CBM-2025-8841',
    status: 'VERIFIED',
    skillsVerified: [
      'AI SEO Strategy',
      'Meta Ads CAPI',
      'Google Ads PMax',
      'GA4 Analytics',
      'HubSpot CRM',
    ],
    instructor: 'Er. Rajesh Varma (Lead Faculty)',
    qrCodeSeed: 'CBM-SECURE-AUTH-8841',
  },

  'CBM-2024-9102': {
    id: 'CBM-2024-9102',
    studentName: 'Priya Mehra',
    courseName:
      'Executive Certification in Performance Marketing & ROI Analytics',
    issueDate: 'November 28, 2024',
    completionDate: 'November 25, 2024',
    grade: 'Grade A+ (Distinction - 96%)',
    credentialUrl:
      'https://cbmacademy.in/verify/CBM-2024-9102',
    status: 'VERIFIED',
    skillsVerified: [
      'Meta Ads Manager',
      'Budget Scaling',
      'Creative Testing',
      'Looker Studio',
    ],
    instructor: 'Pooja Kapoor (Performance Lead)',
    qrCodeSeed: 'CBM-SECURE-AUTH-9102',
  },

  'CBM-2025-1034': {
    id: 'CBM-2025-1034',
    studentName: 'Rohan Verma',
    courseName:
      'Advanced Search Engine Optimization & AI Content Systems',
    issueDate: 'February 10, 2025',
    completionDate: 'February 05, 2025',
    grade: 'Grade A (91%)',
    credentialUrl:
      'https://cbmacademy.in/verify/CBM-2025-1034',
    status: 'VERIFIED',
    skillsVerified: [
      'Technical SEO',
      'GEO (Generative Engine Optimization)',
      'Semrush',
      'ChatGPT Workflows',
    ],
    instructor: 'Vikram Singh (Head of SEO)',
    qrCodeSeed: 'CBM-SECURE-AUTH-1034',
  },

  'CBM-2025-5520': {
    id: 'CBM-2025-5520',
    studentName: 'Ananya Deshmukh',
    courseName:
      'Master in AI-Powered Digital Marketing & Performance Growth',
    issueDate: 'March 02, 2025',
    completionDate: 'February 28, 2025',
    grade: 'Grade A+ (Distinction - 98%)',
    credentialUrl:
      'https://cbmacademy.in/verify/CBM-2025-5520',
    status: 'VERIFIED',
    skillsVerified: [
      'Full-Stack Digital Marketing',
      'Midjourney Creatives',
      'E-Commerce Growth',
      'Email CRM',
    ],
    instructor: 'Er. Rajesh Varma (Lead Faculty)',
    qrCodeSeed: 'CBM-SECURE-AUTH-5520',
  },
};

/* =========================================================
   BLOG POSTS
========================================================= */

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    title:
      'How Generative Engine Optimization (GEO) is Replacing Traditional SEO in 2026',
    category: 'SEO & AI Search',
    date: 'Feb 15, 2026',
    readTime: '4 min read',
    excerpt:
      'Why Google SGE and AI chat engines prioritize structured brand authority over keyword density in 2026.',
    content:
      'As AI search engines like Gemini, ChatGPT Search, and Perplexity ingest the web, rankings shift from keyword repetition to Generative Engine Optimization (GEO). Brands providing structured schemas, direct data points, and expert citations win AI search citations.',
    author: {
      name: 'Er. Rajesh Varma',
      role: 'Director of Academics',
    },
    imageUrl:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
    tags: ['GEO', 'SEO', 'AI Search', 'Google SGE'],
  },

  {
    id: 'blog-2',
    title:
      'Scaling Meta Ads to 4.8x ROAS Using Server-Side CAPI & Advantage+ AI',
    category: 'Performance Marketing',
    date: 'Feb 02, 2026',
    readTime: '5 min read',
    excerpt:
      'How D2C brands navigate tracking changes and scale ad spend with server-side CAPI and Advantage+ campaigns.',
    content:
      'Client-side pixels can lose up to 35% of purchase events. Implementing Meta Conversions API (CAPI) through server-side tracking restores signal fidelity and allows Advantage+ algorithms to locate high-intent buyers with precision.',
    author: {
      name: 'Pooja Kapoor',
      role: 'Performance Lead',
    },
    imageUrl:
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop',
    tags: ['Meta Ads', 'CAPI', 'ROAS', 'E-Commerce'],
  },

  {
    id: 'blog-3',
    title:
      'The Modern Digital Marketer’s AI Stack: From ChatGPT to Midjourney & GA4',
    category: 'AI Tools & Productivity',
    date: 'Jan 24, 2026',
    readTime: '4 min read',
    excerpt:
      'How top growth marketers save 20+ hours weekly with AI copy generation, visual design, and GA4 automation.',
    content:
      'Marketers leveraging AI tools produce higher output with faster iteration. Combining prompt engineering for copywriting, Midjourney for creative prototyping, and Looker Studio for analytics supercharges campaign delivery.',
    author: {
      name: 'Vikram Singh',
      role: 'Head of AI Innovation',
    },
    imageUrl:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop',
    tags: ['AI Tools', 'ChatGPT', 'Automation', 'Career'],
  },
];

/* =========================================================
   WHY CHOOSE CBM
========================================================= */

export const WHY_CHOOSE_CBM_CARDS = [
  {
    title: 'Experienced Trainers',
    description:
      'Learn from agency leads and certified marketers with 10+ years of live campaign experience.',
    iconName: 'Award',
    metric: '10+ Years',
    metricLabel: 'Faculty Experience',
  },

  {
    title: 'Practical Learning',
    description:
      '80% hands-on training executing live campaigns with real marketing budgets.',
    iconName: 'Laptop',
    metric: '80% Live',
    metricLabel: 'Hands-on Work',
  },

  {
    title: 'Industry Projects',
    description:
      'Build an employer-ready portfolio with 15+ live client case studies and capstones.',
    iconName: 'FolderGit2',
    metric: '15+ Projects',
    metricLabel: 'Live Case Studies',
  },

  {
    title: 'Career & Placement Support',
    description:
      'Get practical career guidance, interview preparation and placement-oriented support.',
    iconName: 'GraduationCap',
    metric: 'Career',
    metricLabel: 'Guidance',
  },
];

/* =========================================================
   TRUST STATS
========================================================= */

export const TRUST_STATS: Array<{ label: string; value: string }> = [];
