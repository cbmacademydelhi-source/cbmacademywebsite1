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
    title: 'AI-Driven Search Engine Optimization (SEO)',
    iconName: 'Search',
    shortDescription:
      'Master modern SEO, Generative Engine Optimization (GEO), voice search, and technical audits with AI acceleration.',
    syllabus: [
      'Generative Engine Optimization (GEO) & AI Search',
      'Semantic Keyword Intelligence & Intent Mapping',
      'Technical SEO, Core Web Vitals & Indexing',
      'Programmatic SEO & High-Authority Backlinks',
      'Local SEO & Google Business Profile Optimization',
    ],
    tools: [
      'Semrush',
      'Ahrefs',
      'Google Search Console',
      'ChatGPT Plus',
      'Screaming Frog',
    ],
    duration: '4 Weeks (24 Hours)',
    level: 'Beginner to Advanced',
    liveProjects:
      'E-commerce SEO audit & ranking live keyword on Google SERP',
  },

  {
    id: 2,
    number: '02',
    title: 'Performance Marketing & Meta Ads Suite',
    iconName: 'TrendingUp',
    shortDescription:
      'Run high-converting Facebook and Instagram campaigns using Advantage+ AI, Conversions API (CAPI), and creative scaling.',
    syllabus: [
      'Meta Business Suite & Server-Side CAPI Setup',
      'Advantage+ Shopping & Campaign Budget Optimization',
      'Custom Audience Segmentation & Lookalike Models',
      'High-Converting Ad Creatives & Video Hook Scripts',
      'ROAS Optimization & Attribution Modeling',
    ],
    tools: [
      'Meta Ads Manager',
      'Meta Pixel',
      'Canva Pro',
      'CapCut Pro',
      'Hyros',
    ],
    duration: '4 Weeks (24 Hours)',
    level: 'Intermediate to Advanced',
    liveProjects:
      'Deploying live ₹10,000 ad budget campaign with real ROAS tracking',
  },

  {
    id: 3,
    number: '03',
    title: 'Google Ads & Performance Max Mastery',
    iconName: 'Target',
    shortDescription:
      'Deploy high-intent Search, Shopping, YouTube, and Performance Max (PMax) campaigns with Smart Bidding.',
    syllabus: [
      'Search Network & High-Intent Negative Keywords',
      'Performance Max (PMax) Multi-Channel Asset Groups',
      'Google Merchant Center & E-Commerce Shopping Ads',
      'YouTube Action Ads & Video Storytelling',
      'Smart Bidding: Target CPA & Target ROAS',
    ],
    tools: [
      'Google Ads',
      'Google Merchant Center',
      'Keyword Planner',
      'YouTube Studio',
    ],
    duration: '4 Weeks (24 Hours)',
    level: 'Beginner to Expert',
    liveProjects:
      'Setting up live Search & PMax campaigns with conversion tracking',
  },

  {
    id: 4,
    number: '04',
    title: 'AI Content Creation, Copywriting & Media',
    iconName: 'Sparkles',
    shortDescription:
      'Produce high-converting ad copy, viral social content, and visual brand assets using ChatGPT and Midjourney.',
    syllabus: [
      'Advanced Prompt Engineering for Direct-Response Copy',
      'AI-Powered Long-Form SEO Articles & Brand Voice',
      'Midjourney & DALL-E 3 for Ad Creatives & Banners',
      'Automated Video Scripting & AI Voiceover Workflows',
      'Brand Safety & Originality Guidelines',
    ],
    tools: [
      'ChatGPT',
      'Claude 3.5 Sonnet',
      'Midjourney',
      'Jasper AI',
      'Notion AI',
    ],
    duration: '3 Weeks (18 Hours)',
    level: 'All Levels',
    liveProjects:
      'Creating 30-day multi-channel AI content system for a D2C brand',
  },

  {
    id: 5,
    number: '05',
    title: 'Web Analytics, GA4 & Looker Dashboards',
    iconName: 'BarChart3',
    shortDescription:
      'Track conversion funnels, configure GA4/GTM event models, and build automated Looker Studio executive dashboards.',
    syllabus: [
      'GA4 Event-Based Data Model & Custom Dimensions',
      'Google Tag Manager (GTM) E-Commerce DataLayer',
      'Funnel Exploration & User Path Analysis',
      'Cross-Domain Tracking & Attribution Modeling',
      'Automated Reporting in Looker Studio',
    ],
    tools: [
      'Google Analytics 4',
      'Google Tag Manager',
      'Looker Studio',
      'BigQuery',
    ],
    duration: '3 Weeks (18 Hours)',
    level: 'Intermediate',
    liveProjects:
      'Building full GTM + GA4 e-commerce tracking & client dashboard',
  },

  {
    id: 6,
    number: '06',
    title: 'Organic Social Media Strategy & Growth',
    iconName: 'Share2',
    shortDescription:
      'Build organic reach, B2B thought leadership, and engaged community ecosystems across LinkedIn and Instagram.',
    syllabus: [
      'Instagram Algorithm & Short-Form Video Strategy',
      'LinkedIn Personal Branding & Inbound Lead Playbooks',
      'Community Building & Group Monetization',
      'Influencer Marketing Contracts & ROI Measurement',
      'Social Listening & Reputation Management',
    ],
    tools: [
      'Buffer',
      'Hootsuite',
      'Sprout Social',
      'LinkedIn Sales Navigator',
    ],
    duration: '3 Weeks (18 Hours)',
    level: 'Beginner to Intermediate',
    liveProjects:
      'Executing organic campaign strategy delivering 50,000+ impressions',
  },

  {
    id: 7,
    number: '07',
    title: 'Email Marketing & CRM Automation',
    iconName: 'MailCheck',
    shortDescription:
      'Design automated customer journeys, cart recovery flows, lead nurturing drip sequences, and retention loops.',
    syllabus: [
      'Lifecycle Marketing Funnels & RFM Analysis',
      'Lead Nurturing Automations & Drip Sequences',
      'Deliverability, DKIM, SPF & DMARC Protocols',
      'HubSpot & Klaviyo Flow Automation Logic',
      'A/B Testing Subject Lines & Send-Time AI',
    ],
    tools: [
      'HubSpot',
      'Klaviyo',
      'Mailchimp',
      'Brevo',
      'ActiveCampaign',
    ],
    duration: '3 Weeks (18 Hours)',
    level: 'Beginner to Advanced',
    liveProjects:
      'Building complete 7-stage automated retention email workflow',
  },

  {
    id: 8,
    number: '08',
    title: 'Freelancing, Affiliate & Agency Blueprint',
    iconName: 'Briefcase',
    shortDescription:
      'Monetize digital skills with high-ticket freelance clients, international retainers, affiliate networks, and agency scaling.',
    syllabus: [
      'High-Ticket Client Acquisition on Upwork & LinkedIn',
      'Proposal Writing, Scope Decks & Retainer Pricing',
      'Affiliate Networks: Amazon Associates, Impact & CJ',
      'Contracts, Invoicing & Global Payment Gateways',
      'Scaling from Solo Freelancer to Digital Marketing Agency',
    ],
    tools: [
      'Upwork',
      'Fiverr Pro',
      'Stripe',
      'Notion OS',
      'Loom',
    ],
    duration: '2 Weeks (12 Hours)',
    level: 'Career Acceleration',
    liveProjects:
      'Setting up client portfolio and sending first 5 live pitches',
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
   ========================================================= */

export const JOB_OPPORTUNITIES: JobOpportunity[] = [
  {
    id: 'JOB-101',
    role: 'Performance Marketing Specialist',
    companyCategory: 'Leading D2C E-Commerce Brand',

    // Add the real HR email here later.
    // Keep empty until the actual email is provided.
    hrEmail: '',

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
  },

  {
    id: 'JOB-102',
    role: 'Senior SEO Strategist & Content Lead',
    companyCategory: 'Global Digital Agency Partner',

    hrEmail: '',

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
  },

  {
    id: 'JOB-103',
    role: 'AI Marketing & Growth Executive',
    companyCategory: 'Fast-Growing B2B SaaS Startup',

    hrEmail: '',

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
  },

  {
    id: 'JOB-104',
    role: 'Digital Marketing & Social Media Manager',
    companyCategory: 'Premium Lifestyle Brand',

    hrEmail: '',

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
  },

  {
    id: 'JOB-105',
    role: 'Google Ads & PPC Campaign Analyst',
    companyCategory: 'International Export & FinTech Firm',

    hrEmail: '',

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
  },

  {
    id: 'JOB-106',
    role: 'Junior Growth Associate',
    companyCategory: 'Top Tier Advertising Network',

    hrEmail: '',

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
  },
];

export const VERIFIED_CERTIFICATES: Record<string, VerifiedCertificate> = {
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
    title: 'Placement Support',
    description:
      'Dedicated 1-on-1 placement support, resume reviews, mock interviews, and hiring drives.',
    iconName: 'GraduationCap',
    metric: '100% Help',
    metricLabel: 'Career Support',
  },
];

export const TRUST_STATS = [
  {
    label: 'Learners Trained',
    value: '4,500+',
  },
  {
    label: 'Hiring Partners',
    value: '500+',
  },
  {
    label: 'Average Salary Hike',
    value: '72%',
  },
  {
    label: 'Highest Package',
    value: '₹14.5 LPA',
  },
  {
    label: 'Student Rating',
    value: '4.9/5',
  },
];
