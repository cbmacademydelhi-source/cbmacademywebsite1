import React from 'react';
import {
  Sparkles,
  BarChart3,
  Palette,
  Globe,
  ArrowUpRight,
} from 'lucide-react';

/* ==========================================================================
   AUTHENTIC LOGO ICONS (Official Brand Geometry & Authentic Colors)
   ========================================================================== */

const ChatGPTLogo: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path
      d="M22.28 10.45a5.77 5.77 0 0 0-.5-4.48 5.87 5.87 0 0 0-3.8-2.74 5.96 5.96 0 0 0-4.66.86 5.77 5.77 0 0 0-3.32-1.07 5.87 5.87 0 0 0-5.2 3.34 5.96 5.96 0 0 0-.86 4.66 5.77 5.77 0 0 0-1.8 4.13 5.87 5.87 0 0 0 2.74 4.93 5.96 5.96 0 0 0 4.66.86 5.77 5.77 0 0 0 3.32 1.07 5.87 5.87 0 0 0 5.2-3.34 5.96 5.96 0 0 0 .86-4.66 5.77 5.77 0 0 0 1.8-4.13 5.8 5.8 0 0 0-.44-1.43zM12.9 20.8a4.4 4.4 0 0 1-2.6-.84l.13-.08 4.33-2.5a.73.73 0 0 0 .37-.64v-6.1l1.83 1.06a.07.07 0 0 1 .04.05v5.18a4.43 4.43 0 0 1-4.1 3.87zm-7.9-3.4a4.4 4.4 0 0 1-.95-2.67l.13.08 4.33 2.5a.75.75 0 0 0 .74 0l5.28-3.05v2.12a.07.07 0 0 1-.03.06l-4.48 2.59a4.43 4.43 0 0 1-5.02-1.63zm-1.37-7.93a4.4 4.4 0 0 1 1.65-2.22v5.17a.75.75 0 0 0 .37.65l5.28 3.05-1.83 1.06a.07.07 0 0 1-.07 0L4.54 14.6a4.43 4.43 0 0 1-.92-5.12zm13.3-1.6l-5.28 3.05V8.8a.75.75 0 0 0-.37-.65L6.45 5.09a.07.07 0 0 1 .03-.06l4.48-2.59a4.43 4.43 0 0 1 5.97 1.57c.4.7.63 1.5.65 2.33v1.53zm2.32 6.07a4.4 4.4 0 0 1-1.65 2.22V10.99a.75.75 0 0 0-.37-.65L12 7.29l1.83-1.06a.07.07 0 0 1 .07 0l4.49 2.59a4.43 4.43 0 0 1 .86 5.12zm-3.08-3.02l-4.33 2.5a.75.75 0 0 0-.37.65v4.98a4.4 4.4 0 0 1-2.5.84 4.43 4.43 0 0 1-3.66-1.93c-.4-.7-.63-1.5-.65-2.33v-1.53l5.28-3.05v-2.12a.07.07 0 0 1 .03-.06l4.48-2.59a4.43 4.43 0 0 1 1.72 4.61z"
      fill="#10A37F"
    />
  </svg>
);

const GeminiLogo: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="cbm-gemini-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1BA1E3" />
        <stop offset="50%" stopColor="#5E5CE6" />
        <stop offset="100%" stopColor="#9C51B6" />
      </linearGradient>
    </defs>
    <path
      d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z"
      fill="url(#cbm-gemini-gradient)"
    />
  </svg>
);

const ClaudeLogo: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M4.5 9.5h15v5h-15z" fill="#D97757" />
    <path d="M9.5 4.5h5v15h-5z" fill="#D97757" />
    <path d="M6 6l12 12-3.5 3.5L2.5 9.5z" fill="#D97757" />
    <path d="M18 6L6 18l3.5 3.5L21.5 9.5z" fill="#D97757" />
    <circle cx="12" cy="12" r="3.2" fill="#B3593B" />
  </svg>
);

const GoogleAILogo: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

const SemrushLogo: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path
      d="M21.2 12.8c-.8 3.8-3.7 6.7-7.5 7.1-4.7.5-8.8-2.8-9.3-7.5-.5-4.7 2.8-8.8 7.5-9.3 2.1-.2 4.1.4 5.7 1.7l-2.4 2.4c-1-.7-2.2-1.1-3.5-1-2.8.3-4.9 2.7-4.6 5.5.3 2.8 2.7 4.9 5.5 4.6 2.3-.2 4.1-1.8 4.5-4h-4.5v-3.2h7.8c.2.6.2 1.3.1 2z"
      fill="#FF642D"
    />
    <circle cx="18.5" cy="6.5" r="2.2" fill="#FF642D" />
  </svg>
);

const GoogleAnalyticsLogo: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <rect x="18" y="4" width="4" height="16" rx="2" fill="#F9AB00" />
    <rect x="11" y="9" width="4" height="11" rx="2" fill="#E37400" />
    <circle cx="5" cy="17" r="2.8" fill="#E37400" />
  </svg>
);

const SearchConsoleLogo: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <rect x="2.5" y="4.5" width="19" height="15" rx="3.5" stroke="#4285F4" strokeWidth="2" fill="#4285F4" fillOpacity="0.08" />
    <path d="M6.5 14.5L10 11L13 14L17.5 9.5" stroke="#34A853" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="17.5" cy="9.5" r="1.8" fill="#EA4335" />
    <path d="M5.5 19.5H18.5" stroke="#4285F4" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const MidjourneyLogo: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="6" fill="#0E1626" />
    <path d="M12 4.5L16.5 13.5H7.5L12 4.5Z" fill="#FFFFFF" fillOpacity="0.95" />
    <path d="M12 15L17.5 18H6.5L12 15Z" fill="#38BDF8" />
  </svg>
);

const CanvaLogo: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="cbm-canva-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00C4CC" />
        <stop offset="100%" stopColor="#7D2AE8" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="11" fill="url(#cbm-canva-grad)" />
    <path
      d="M15.8 9C15 8.1 13.8 7.7 12.3 7.7c-3 0-5.1 2.2-5.1 5.2 0 2.8 2 4.8 4.9 4.8 1.4 0 2.6-.4 3.5-1.3.4-.4.4-.8.2-1.1-.2-.3-.6-.3-1-.1-.7.5-1.6.8-2.6.8-2 0-3.3-1.2-3.5-3h7.3c.4 0 .7-.3.7-.7 0-1.6-.4-3.1-.9-3.9zm-5 2.5c.2-1.3 1.1-2.2 2.3-2.2 1 0 1.6.6 1.8 1.6l.1.6h-4.2z"
      fill="#FFFFFF"
    />
  </svg>
);

const NotionLogo: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="5" fill="#18181B" />
    <path
      d="M6.2 6.5L14.4 5.8C15.4 5.7 15.9 6.2 15.9 7.2V17.2C15.9 18 15.4 18.5 14.6 18.6L6.8 19.3C5.9 19.4 5.5 18.9 5.5 18.1V7.4C5.5 6.7 5.8 6.5 6.2 6.5Z"
      fill="#FFFFFF"
    />
    <path
      d="M8 8.4L12.6 15V8.9L14.3 8.8V16.5L10.2 10.6V16.7L8 16.8V8.4Z"
      fill="#18181B"
    />
  </svg>
);

const ShopifyLogo: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path
      d="M19.2 6.2c-.1-.3-.4-.5-.6-.5-.3 0-1.6.1-1.6.1s-1.1-1.1-1.4-1.3c-.4-.4-1.1-.6-1.7-.6-.2 0-.4 0-.6.1-.2-.6-.6-1.1-1.2-1.4C11.3 2.2 10.6 2.2 10 2.5c-.8.3-1.4 1-1.7 1.9-.8.2-1.4.6-1.8 1.2-.5.8-.6 1.7-.3 2.6L4.8 9.5c-.3.1-.5.4-.5.7l1.7 10.7c.1.7.7 1.2 1.4 1.2h9.2c.7 0 1.3-.5 1.4-1.2l1.7-13.8c0-.3-.1-.6-.4-.8l-.5-.1zm-4.7-.6c.5 0 .9.2 1.2.5l-2.4 1.1c.1-.8.6-1.6 1.2-1.6zm-2.4.9c-.3.6-.5 1.3-.5 2l-2.6 1.2c.2-.9.8-2 1.8-2.6.4-.3.9-.5 1.3-.6zm3.9 6.2l-.7 2.1c-.2.6-.7 1-1.3 1-.7 0-1.2-.5-1.2-1.2 0-.2 0-.4.1-.6l.7-2.1c.2-.6.7-1 1.3-1 .7 0 1.2.5 1.2 1.2 0 .2 0 .4-.1.6z"
      fill="#96BF48"
    />
  </svg>
);

const WordPressLogo: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" fill="#21759B" />
    <circle cx="12" cy="12" r="9.6" stroke="#FFFFFF" strokeWidth="1.2" />
    <path
      d="M4.8 12c0 3 1.8 5.6 4.3 6.8L5.6 10c-.5.6-.8 1.3-.8 2zm12-.8c0-1.1-.3-1.8-.8-2.5-.6-.8-1-1.3-1-2.1 0-.9.7-1.7 1.6-1.7.1 0 .2 0 .2.1-1.2-1-2.8-1.7-4.5-1.7-2.5 0-4.6 1.2-5.9 3 .2 0 .5.1.8.1 1.2 0 3.1-.1 3.1-.1.7 0 .7.9 0 1 0 0-.7.1-1.3.1l4.2 12.6 2.6-7.7-1.8-4.9c-.7 0-1.2-.1-1.2-.1-.7 0-.7-.9 0-1 0 0 1.9.1 3 .1 1 0 3-.1 3-.1.7 0 .7.9 0 1 0 0-.7.1-1.3.1l4.2 12.5c1.1-1 1.9-2.5 2.2-4 .5-1.2.7-2.6.7-4 0-1.2-.2-2.2-.6-3.1z"
      fill="#FFFFFF"
    />
  </svg>
);

const GitHubLogo: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="#24292F">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

const SupabaseLogo: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="cbm-supabase-grad" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3ECF8E" />
        <stop offset="1" stopColor="#249361" />
      </linearGradient>
    </defs>
    <path
      d="M13.4 2.1L2.8 14.6c-.4.5-.1 1.4.6 1.4h7.1v5.9c0 .7.8 1.1 1.3.6l10.6-12.5c.4-.5.1-1.4-.6-1.4h-7.1V2.7c0-.7-.8-1.1-1.3-.6z"
      fill="url(#cbm-supabase-grad)"
    />
  </svg>
);

/* ==========================================================================
   CATEGORY & TOOLS DATA STRUCTURE
   ========================================================================== */

interface ToolItem {
  name: string;
  description: string;
  logo: React.ReactNode;
}

interface CategoryCard {
  id: string;
  accent: 'orange' | 'blue' | 'purple' | 'green';
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  tools: ToolItem[];
  colorClasses: {
    badgeBg: string;
    badgeBorder: string;
    badgeText: string;
    cardBg: string;
    cardBorder: string;
    cardBorderHover: string;
    arrowHoverText: string;
    arrowHoverBorder: string;
  };
}

const categoryCards: CategoryCard[] = [
  {
    id: 'ai-automation',
    accent: 'orange',
    title: 'AI & Automation',
    subtitle: 'Work smarter with the power of AI.',
    icon: <Sparkles className="w-6 h-6 stroke-[2.2]" />,
    colorClasses: {
      badgeBg: 'bg-orange-500/10',
      badgeBorder: 'border-orange-500/20',
      badgeText: 'text-[#FF6B00]',
      cardBg: 'bg-gradient-to-b from-[#FFFDF9] via-[#FFF9F2] to-[#FFF6EB]',
      cardBorder: 'border-orange-200/60',
      cardBorderHover: 'hover:border-orange-300',
      arrowHoverText: 'group-hover:text-[#FF6B00]',
      arrowHoverBorder: 'group-hover:border-orange-300',
    },
    tools: [
      {
        name: 'ChatGPT',
        description: 'AI assistant',
        logo: <ChatGPTLogo />,
      },
      {
        name: 'Gemini',
        description: 'Multimodal AI',
        logo: <GeminiLogo />,
      },
      {
        name: 'Claude',
        description: 'AI assistant',
        logo: <ClaudeLogo />,
      },
      {
        name: 'Google AI',
        description: 'Research & tools',
        logo: <GoogleAILogo />,
      },
    ],
  },
  {
    id: 'marketing-analytics',
    accent: 'blue',
    title: 'Marketing & Analytics',
    subtitle: 'Grow faster with data-driven decisions.',
    icon: <BarChart3 className="w-6 h-6 stroke-[2.2]" />,
    colorClasses: {
      badgeBg: 'bg-blue-500/10',
      badgeBorder: 'border-blue-500/20',
      badgeText: 'text-[#2563EB]',
      cardBg: 'bg-gradient-to-b from-[#FAFBFD] via-[#F5F8FF] to-[#EFF4FE]',
      cardBorder: 'border-blue-200/60',
      cardBorderHover: 'hover:border-blue-300',
      arrowHoverText: 'group-hover:text-[#2563EB]',
      arrowHoverBorder: 'group-hover:border-blue-300',
    },
    tools: [
      {
        name: 'Semrush',
        description: 'SEO & Competitor Analysis',
        logo: <SemrushLogo />,
      },
      {
        name: 'Google Analytics',
        description: 'Website Analytics',
        logo: <GoogleAnalyticsLogo />,
      },
      {
        name: 'Search Console',
        description: 'SEO Performance',
        logo: <SearchConsoleLogo />,
      },
      {
        name: 'Midjourney',
        description: 'AI Image Generation',
        logo: <MidjourneyLogo />,
      },
    ],
  },
  {
    id: 'design-content',
    accent: 'purple',
    title: 'Design & Content',
    subtitle: 'Create stunning content, faster.',
    icon: <Palette className="w-6 h-6 stroke-[2.2]" />,
    colorClasses: {
      badgeBg: 'bg-purple-500/10',
      badgeBorder: 'border-purple-500/20',
      badgeText: 'text-[#9333EA]',
      cardBg: 'bg-gradient-to-b from-[#FBFAFD] via-[#F9F5FF] to-[#F5EEFE]',
      cardBorder: 'border-purple-200/60',
      cardBorderHover: 'hover:border-purple-300',
      arrowHoverText: 'group-hover:text-[#9333EA]',
      arrowHoverBorder: 'group-hover:border-purple-300',
    },
    tools: [
      {
        name: 'Canva',
        description: 'Design & Graphics',
        logo: <CanvaLogo />,
      },
      {
        name: 'Notion',
        description: 'Notes & Productivity',
        logo: <NotionLogo />,
      },
      {
        name: 'Midjourney',
        description: 'AI Image Generation',
        logo: <MidjourneyLogo />,
      },
    ],
  },
  {
    id: 'web-commerce',
    accent: 'green',
    title: 'Web & Commerce',
    subtitle: 'Build, sell and scale online.',
    icon: <Globe className="w-6 h-6 stroke-[2.2]" />,
    colorClasses: {
      badgeBg: 'bg-emerald-500/10',
      badgeBorder: 'border-emerald-500/20',
      badgeText: 'text-[#16A34A]',
      cardBg: 'bg-gradient-to-b from-[#FAFCFB] via-[#F4FAF6] to-[#EDF7F0]',
      cardBorder: 'border-emerald-200/60',
      cardBorderHover: 'hover:border-emerald-300',
      arrowHoverText: 'group-hover:text-[#16A34A]',
      arrowHoverBorder: 'group-hover:border-emerald-300',
    },
    tools: [
      {
        name: 'Shopify',
        description: 'E-commerce',
        logo: <ShopifyLogo />,
      },
      {
        name: 'WordPress',
        description: 'Website Builder',
        logo: <WordPressLogo />,
      },
      {
        name: 'GitHub',
        description: 'Development',
        logo: <GitHubLogo />,
      },
      {
        name: 'Supabase',
        description: 'Database & Backend',
        logo: <SupabaseLogo />,
      },
    ],
  },
];

interface AIToolsProps {
  onOpenApply?: (courseTitle?: string) => void;
}

export const AITools: React.FC<AIToolsProps> = ({ onOpenApply }) => {
  return (
    <section
      id="ai-tools"
      className="relative overflow-hidden bg-[#FFFCF8] py-16 sm:py-20 lg:py-24 border-t border-b border-orange-100/50"
    >
      {/* Subtle Warm Ambient Glow on Page Edges */}
      <div
        className="pointer-events-none absolute -top-32 -left-32 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-orange-200/20 blur-[110px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-32 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-amber-200/20 blur-[110px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] rounded-full bg-orange-100/15 blur-[150px]"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* =========================================================
            SECTION HEADER
            ========================================================= */}
        <div className="max-w-3xl mx-auto text-center">

          {/* Top Pill / Badge */}
          <div className="inline-flex items-center justify-center gap-2.5 px-3.5 py-1.5 rounded-full bg-orange-50/90 border border-orange-200/70 shadow-2xs">
            <span className="w-4 sm:w-5 h-[1.5px] bg-[#FF6B00] rounded-full" />
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.14em] text-[#FF6B00]">
              INDUSTRY TOOLKIT
            </span>
            <span className="w-4 sm:w-5 h-[1.5px] bg-[#FF6B00] rounded-full" />
          </div>

          {/* Main Headline */}
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#072B57] tracking-tight leading-[1.18]">
            Master the tools modern teams{' '}
            <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#FF6B00] via-[#FF7E24] to-[#F59E0B] bg-clip-text text-transparent">
              actually use.
            </span>
          </h2>

          {/* Subtitle */}
          <p className="mt-3.5 text-sm sm:text-base text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
            Build practical skills with the platforms powering today’s AI, marketing
            and digital businesses.
          </p>

        </div>

        {/* =========================================================
            MAIN CONTENT: 2-COLUMN × 2-ROW GRID
            ========================================================= */}
        <div className="mt-12 lg:mt-14 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-7 xl:gap-8">
          {categoryCards.map((category) => (
            <div
              key={category.id}
              className={`group relative rounded-[22px] sm:rounded-[24px] ${category.colorClasses.cardBg} border ${category.colorClasses.cardBorder} ${category.colorClasses.cardBorderHover} p-6 sm:p-7 lg:p-8 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.04)] hover:shadow-[0_16px_36px_-6px_rgba(15,23,42,0.07)] transition-all duration-300 flex flex-col justify-between`}
            >
              {/* Category Card Header */}
              <div>
                <div className="flex items-start justify-between gap-4">
                  
                  {/* Left: Category Icon & Titles */}
                  <div className="flex items-center gap-3.5 sm:gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl ${category.colorClasses.badgeBg} border ${category.colorClasses.badgeBorder} ${category.colorClasses.badgeText} flex items-center justify-center flex-shrink-0 shadow-2xs`}
                    >
                      {category.icon}
                    </div>

                    <div>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-[#072B57] tracking-tight leading-tight">
                        {category.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5 leading-snug">
                        {category.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Right: Subtle Circular Arrow Button */}
                  <button
                    type="button"
                    onClick={() => onOpenApply?.(category.title)}
                    aria-label={`Learn more about ${category.title}`}
                    className={`w-9 h-9 rounded-full bg-white/95 border border-slate-200/80 flex items-center justify-center text-slate-400 ${category.colorClasses.arrowHoverText} ${category.colorClasses.arrowHoverBorder} group-hover:scale-105 transition-all duration-200 shadow-2xs flex-shrink-0 cursor-pointer`}
                  >
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>

                </div>
              </div>

              {/* Tools List / Grid */}
              <div
                className={`mt-7 sm:mt-8 grid ${
                  category.tools.length === 3
                    ? 'grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4'
                    : 'grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-3.5'
                }`}
              >
                {category.tools.map((tool) => (
                  <div
                    key={tool.name}
                    className="group/tool flex flex-col items-center sm:items-start text-center sm:text-left p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/80 hover:bg-white border border-slate-200/60 hover:border-slate-300/90 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:shadow-xs transition-all duration-200 cursor-default"
                  >
                    {/* Logo in light rounded-square container */}
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200/70 shadow-2xs flex items-center justify-center p-2 mb-3 group-hover/tool:scale-105 group-hover/tool:border-slate-300 transition-all duration-200">
                      {tool.logo}
                    </div>

                    {/* Tool Name */}
                    <span className="text-[13px] sm:text-[14px] font-bold text-[#072B57] tracking-tight leading-tight">
                      {tool.name}
                    </span>

                    {/* Small Muted Description */}
                    <span className="text-[11px] sm:text-[11.5px] text-slate-500 font-medium leading-snug mt-1">
                      {tool.description}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
