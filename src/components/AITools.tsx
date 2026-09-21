import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Sparkles,
  BarChart3,
  Palette,
  Globe,
  ArrowUpRight,
} from 'lucide-react';
import { SMOOTH_EASE_OUT, VIEWPORT_ONCE } from '../lib/animations';

/* ==========================================================================
   AUTHENTIC LOGO ICONS (Official Brand Geometry & Authentic Colors)
   ========================================================================== */

// 1. ChatGPT - Official OpenAI Rosette Symbol
const ChatGPTLogo: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 320 320" fill="none">
    <path
      d="m297.06 130.97c7.26-21.79 4.76-45.66-6.85-65.48-17.46-30.4-52.56-46.04-86.84-38.68-15.25-17.18-37.16-26.95-60.13-26.81-35.04-.08-66.13 22.48-76.91 55.82-22.51 4.61-41.94 18.7-53.31 38.67-17.59 30.32-13.58 68.54 9.92 94.54-7.26 21.79-4.76 45.66 6.85 65.48 17.46 30.4 52.56 46.04 86.84 38.68 15.24 17.18 37.16 26.95 60.13 26.8 35.06.09 66.16-22.49 76.94-55.86 22.51-4.61 41.94-18.7 53.31-38.67 17.57-30.32 13.55-68.51-9.94-94.51zm-120.28 168.11c-14.03.02-27.62-4.89-38.39-13.88.49-.26 1.34-.73 1.89-1.07l63.72-36.8c3.26-1.85 5.26-5.32 5.24-9.07v-89.83l26.93 15.55c.29.14.48.42.52.74v74.39c-.04 33.08-26.83 59.9-59.91 59.97zm-128.84-55.03c-7.03-12.14-9.56-26.37-7.15-40.18.47.28 1.3.79 1.89 1.13l63.72 36.8c3.23 1.89 7.23 1.89 10.47 0l77.79-44.92v31.1c.02.32-.13.63-.38.83l-64.41 37.19c-28.69 16.52-65.33 6.7-81.92-21.95zm-16.77-139.09c7-12.16 18.05-21.46 31.21-26.29 0 .55-.03 1.52-.03 2.2v73.61c-.02 3.74 1.98 7.21 5.23 9.06l77.79 44.91-26.93 15.55c-.27.18-.61.21-.91.08l-64.42-37.22c-28.63-16.58-38.45-53.21-21.95-81.89zm221.26 51.49-77.79-44.92 26.93-15.54c.27-.18.61-.21.91-.08l64.42 37.19c28.68 16.57 38.51 53.26 21.94 81.94-7.01 12.14-18.05 21.44-31.2 26.28v-75.81c.03-3.74-1.96-7.2-5.2-9.06zm26.8-40.34c-.47-.29-1.3-.79-1.89-1.13l-63.72-36.8c-3.23-1.89-7.23-1.89-10.47 0l-77.79 44.92v-31.1c-.02-.32.13-.63.38-.83l64.41-37.16c28.69-16.55 65.37-6.7 81.91 22 6.99 12.12 9.52 26.31 7.15 40.1zm-168.51 55.43-26.94-15.55c-.29-.14-.48-.42-.52-.74v-74.39c.02-33.12 26.89-59.96 60.01-59.94 14.01 0 27.57 4.92 38.34 13.88-.49.26-1.33.73-1.89 1.07l-63.72 36.8c-3.26 1.85-5.26 5.31-5.24 9.06l-.04 89.79zm14.63-31.54 34.65-20.01 34.65 20v40.01l-34.65 20-34.65-20z"
      fill="#10A37F"
    />
  </svg>
);

// 2. Google Gemini - Official 4-point Spark with Gradient
const GeminiLogo: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="gemini-official-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1BA1E3" />
        <stop offset="53%" stopColor="#5E5CE6" />
        <stop offset="100%" stopColor="#9C51B6" />
      </linearGradient>
    </defs>
    <path
      d="M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81"
      fill="url(#gemini-official-grad)"
    />
  </svg>
);

// 3. Claude - Official Anthropic Claude Symbol
const ClaudeLogo: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 100 100" fill="#D97757">
    <path d="m19.6 66.5 19.7-11 .3-1-.3-.5h-1l-3.3-.2-11.2-.3L14 53l-9.5-.5-2.4-.5L0 49l.2-1.5 2-1.3 2.9.2 6.3.5 9.5.6 6.9.4L38 49.1h1.6l.2-.7-.5-.4-.4-.4L29 41l-10.6-7-5.6-4.1-3-2-1.5-2-.6-4.2 2.7-3 3.7.3.9.2 3.7 2.9 8 6.1L37 36l1.5 1.2.6-.4.1-.3-.7-1.1L33 25l-6-10.4-2.7-4.3-.7-2.6c-.3-1-.4-2-.4-3l3-4.2L28 0l4.2.6L33.8 2l2.6 6 4.1 9.3L47 29.9l2 3.8 1 3.4.3 1h.7v-.5l.5-7.2 1-8.7 1-11.2.3-3.2 1.6-3.8 3-2L61 2.6l2 2.9-.3 1.8-1.1 7.7L59 27.1l-1.5 8.2h.9l1-1.1 4.1-5.4 6.9-8.6 3-3.5L77 13l2.3-1.8h4.3l3.1 4.7-1.4 4.9-4.4 5.6-3.7 4.7-5.3 7.1-3.2 5.7.3.4h.7l12-2.6 6.4-1.1 7.6-1.3 3.5 1.6.4 1.6-1.4 3.4-8.2 2-9.6 2-14.3 3.3-.2.1.2.3 6.4.6 2.8.2h6.8l12.6 1 3.3 2 1.9 2.7-.3 2-5.1 2.6-6.8-1.6-16-3.8-5.4-1.3h-.8v.4l4.6 4.5 8.3 7.5L89 80.1l.5 2.4-1.3 2-1.4-.2-9.2-7-3.6-3-8-6.8h-.5v.7l1.8 2.7 9.8 14.7.5 4.5-.7 1.4-2.6 1-2.7-.6-5.8-8-6-9-4.7-8.2-.5.4-2.9 30.2-1.3 1.5-3 1.2-2.5-2-1.4-3 1.4-6.2 1.6-8 1.3-6.4 1.2-7.9.7-2.6v-.2H49L43 72l-9 12.3-7.2 7.6-1.7.7-3-1.5.3-2.8L24 86l10-12.8 6-7.9 4-4.6-.1-.5h-.3L17.2 77.4l-4.7.6-2-2 .2-3 1-1 8-5.5Z" />
  </svg>
);

// 4. Google AI - Official Google 4-Color "G"
const GoogleAILogo: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
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

// 5. Semrush - Official Swirling Flame Symbol
const SemrushLogo: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="#FF642D">
    <path d="M20.698 11.911c0 .444-.226.516-.79.516-.596 0-.706-.1-.77-.554-.118-1.152-.896-2.13-2.201-2.24-.418-.034-.518-.19-.518-.706 0-.48.074-.708.446-.708 2.265.01 3.833 1.832 3.833 3.69v.002zm3.3 0c0-3.456-2.338-7.11-7.74-7.11H5.52c-.218 0-.354.11-.354.31 0 .109.082.209.156.26.388.31.97.654 1.73 1.036.743.372 1.323.616 1.903.852.246.1.336.208.336.344 0 .19-.136.308-.4.308H.372c-.254 0-.372.164-.372.326 0 .136.044.254.162.372.69.726 1.796 1.596 3.4 2.604 1.466.91 2.98 1.74 4.533 2.492.236.11.308.236.308.372-.008.154-.126.28-.4.28H4.1c-.216 0-.344.12-.344.3 0 .1.08.226.19.326.888.808 2.311 1.688 4.207 2.494 2.53 1.08 5.094 1.721 7.98 1.721 5.465 0 7.867-4.087 7.867-7.289l-.002.002zm-7.133 5.104c-2.794 0-5.132-2.276-5.132-5.114 0-2.794 2.33-5.04 5.132-5.04 2.863 0 5.111 2.24 5.111 5.04a5.086 5.086 0 0 1-5.111 5.114z" />
  </svg>
);

// 6. Google Analytics - Official GA4 3-Element Bar/Circle Emblem
const GoogleAnalyticsLogo: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path
      d="M22.84 2.9982v17.9987c.0086 1.6473-1.3197 2.9897-2.967 2.9984a2.9808 2.9808 0 01-.3677-.0208c-1.528-.226-2.6477-1.5558-2.6105-3.1V3.1204c-.0369-1.5458 1.0856-2.8762 2.6157-3.1 1.6361-.1915 3.1178.9796 3.3093 2.6158.014.1201.0208.241.0202.3619z"
      fill="#F9AB00"
    />
    <path
      d="M12.0054 9.045c-.0171 0-.0342 0-.0513.0003-1.6495.0904-2.9293 1.474-2.891 3.1256v7.9846c0 2.167.9535 3.4825 2.3505 3.763 1.6118.3266 3.1832-.7152 3.5098-2.327.04-.1974.06-.3983.0593-.5998v-8.9585c.003-1.6474-1.33-2.9852-2.9773-2.9882z"
      fill="#E37400"
    />
    <path
      d="M4.1326 18.0548c-1.6417 0-2.9726 1.331-2.9726 2.9726C1.16 22.6691 2.4909 24 4.1326 24s2.9726-1.3309 2.9726-2.9726-1.331-2.9726-2.9726-2.9726z"
      fill="#E37400"
    />
  </svg>
);

// 7. Google Search Console - Official Tool Logo
const SearchConsoleLogo: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="#4285F4">
    <path d="M8.548 1.156L6.832 2.872v1.682h1.716zm0 3.398v.035H6.832v-.035H3.386L0 7.844v3.577h2.826V8.94c0-.525.429-.954.954-.954h16.476c.525 0 .954.43.954.954v2.48h2.754V7.844l-3.386-3.29H17.3v.035h-1.717v-.035zm7.035 0H17.3V2.872l-1.717-1.716zM8.679 1.188V2.84h6.773V1.188zm11.471 7.07a.834.834 0 00-.132.01l-.543.002c-5.216.014-10.432-.008-15.648.01-.435-.063-.794.436-.716.883v2.264h17.812c-.016-.888.045-1.782-.034-2.666-.104-.342-.427-.502-.739-.502zm-15.422.634a.689.698 0 01.689.698.689.698 0 01-.689.697.689.698 0 01-.688-.697.689.698 0 01.688-.698zm2.134 0a.689.698 0 01.689.698.689.698 0 01-.689.697.689.698 0 01-.688-.697.689.698 0 01.688-.698zM.036 11.645v9.156c0 1.05.858 1.908 1.907 1.908h.883V11.645zm21.174 0v11.064h.882c1.05 0 1.908-.858 1.908-1.908v-9.156zM4.057 13.133v6.85h6.137v-6.85zm13.243.021v3.777l-1.708.977-1.708-.977v-3.758a4.006 4.006 0 000 7.23v2.441h3.457v-2.442a4.006 4.006 0 00-.041-7.248zm-13.243 8.26v1.43h7.925v-1.43z" />
  </svg>
);

// 8. Midjourney - Official Sailing Yacht on Waves Emblem
const MidjourneyLogo: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 695 695" fill="none">
    <rect width="695" height="695" rx="140" fill="#0E1726" />
    <path
      d="m 478.5 610.1 c 60.3 -28 119.9 -62.2 166.3 -104.4 l -590 38 22.9 43.8 130 89.4 z"
      fill="#ffffff"
    />
    <path
      d="m 289.7 135.7 c 100.4 30.7 240.8 179 288.6 338.4 -26.2 -10.3 -45.8 -20.8 -82.6 -11.4 -35.6 -129.5 -99.3 -253.2 -206 -327 z"
      fill="#ffffff"
    />
    <path
      d="m 103 64.8 c 128.6 55 305 208.1 337.4 412 -148.3 -59.8 -261.2 -27.9 -339.8 20.6 119.9 -152.4 66.1 -325.7 2.4 -432.6 z"
      fill="#ffffff"
    />
    <path
      d="m 94.3 587.3 c -2.2 0 -4.3 0.2 -6.3 0.5 -28.6 4.3 -43.8 36.7 -72.3 41 -2 0.3 -4.2 0.5 -6.3 0.5 -2.2 0 -4.3 -0.2 -6.3 -0.5 -1 -0.2 -2 -0.4 -3 -0.7 v 66.5 H 694.7 v -65.7 c -1.7 0.2 -3.5 0.4 -5.3 0.4 -2.2 0 -4.3 -0.2 -6.3 -0.5 -2 -0.3 -4 -0.8 -5.9 -1.3 -7.7 -2.3 -14.4 -6.6 -20.8 -11.5 -16 -12.3 -30 -28.7 -52 -28.7 -2 0 -4 0.2 -6 0.4 -0.6 0.1 -1.2 0.2 -1.8 0.4 -1.3 0.2 -2.6 0.5 -3.9 0.9 -0.7 0.2 -1.3 0.4 -2 0.7 -1.1 0.4 -2.3 0.8 -3.4 1.3 -0.6 0.3 -1.3 0.6 -1.9 0.9 -1.1 0.5 -2.2 1.1 -3.3 1.7 -0.6 0.3 -1.1 0.6 -1.7 0.9 -1.2 0.7 -2.4 1.5 -3.5 2.2 -0.4 0.3 -0.8 0.5 -1.1 0.8 -0.8 0.6 -1.6 1.2 -2.4 1.8 -1.4 1.1 -2.9 2.2 -4.3 3.3 -3.1 2.5 -6.2 5 -9.2 7.5 -1 0.8 -1.9 1.6 -2.9 2.4 -3.7 3.1 -7.5 6 -11.5 8.6 -0.2 0.1 -0.4 0.3 -0.6 0.4 -1.3 0.8 -2.6 1.6 -3.9 2.3 -0.3 0.2 -0.6 0.3 -0.9 0.5 -1.3 0.7 -2.6 1.3 -4 1.8 -0.3 0.1 -0.6 0.2 -0.9 0.3 -1.4 0.5 -2.8 1.1 -4.3 1.5 -3.6 1 -7.4 1.6 -11.4 1.6 -35 0 -50 -42 -85 -42 -35 0 -50 42 -85 42 -2.2 0 -4.3 -0.2 -6.3 -0.5 -2 -0.3 -4 -0.8 -5.9 -1.3 -7.7 -2.3 -14.4 -6.6 -20.8 -11.5 -16 -12.3 -30 -28.7 -52 -28.7 z"
      fill="#38BDF8"
    />
  </svg>
);

// 9. Canva - Authentic Canva Cursive Wordmark / Brand Logo
const CanvaLogo: React.FC<{ className?: string }> = ({ className = 'w-7 h-auto' }) => (
  <svg className={className} viewBox="0 0 80 30">
    <defs>
      <linearGradient id="canva-auth-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00C4CC" />
        <stop offset="100%" stopColor="#7D2AE8" />
      </linearGradient>
    </defs>
    <path
      fill="url(#canva-auth-grad)"
      d="M79.444 18.096c-.136 0-.26.088-.324.272-.82 2.34-1.928 3.732-2.84 3.732-.524 0-.736-.584-.736-1.5 0-2.292 1.372-7.152 2.064-9.368.08-.268.132-.508.132-.712 0-.644-.352-.96-1.224-.96-.94 0-1.952.368-2.936 2.092-.34-1.52-1.368-2.184-2.804-2.184-1.66 0-3.264 1.068-4.584 2.8-1.32 1.732-2.872 2.3-4.04 2.02.84-2.056 1.152-3.592 1.152-4.732 0-1.788-.884-2.868-2.312-2.868-2.172 0-3.424 2.072-3.424 4.252 0 1.684.764 3.416 2.444 4.256-1.408 3.184-3.464 6.064-4.244 6.064-1.008 0-1.304-4.932-1.248-8.46.036-2.024.204-2.128.204-2.74 0-.352-.228-.592-1.144-.592-2.136 0-2.796 1.808-2.896 3.884a10.233 10.233 0 0 1-.368 2.332c-.892 3.184-2.732 5.6-3.932 5.6-.556 0-.708-.556-.708-1.284 0-2.292 1.284-5.156 1.284-7.6 0-1.796-.788-2.932-2.272-2.932-1.748 0-4.06 2.08-6.248 5.976.72-2.984 1.016-5.872-1.116-5.872A2.886 2.886 0 0 0 36 9.916a.752.752 0 0 0-.432.728c.204 3.176-2.56 11.312-5.18 11.312-.476 0-.708-.516-.708-1.348 0-2.296 1.368-7.144 2.056-9.364.088-.288.136-.536.136-.752 0-.608-.376-.92-1.228-.92-.936 0-1.952.356-2.932 2.08-.344-1.52-1.372-2.184-2.808-2.184-2.356 0-4.988 2.492-6.144 5.74-1.548 4.336-4.668 8.524-8.868 8.524-3.812 0-5.824-3.172-5.824-8.184C4.068 8.312 9.38 2.4 13.32 2.4c1.884 0 2.784 1.2 2.784 3.04 0 2.228-1.244 3.264-1.244 4.112 0 .26.216.516.644.516 1.712 0 3.728-2.012 3.728-4.756S17.004.56 13.064.56C6.552.56 0 7.112 0 15.508c0 6.68 3.296 10.708 8.996 10.708 3.888 0 7.284-3.024 9.116-6.552.208 2.924 1.536 4.452 3.56 4.452 1.8 0 3.256-1.072 4.368-2.956.428 1.972 1.564 2.936 3.04 2.936 1.692 0 3.108-1.072 4.456-3.064-.02 1.564.336 3.036 1.692 3.036.64 0 1.404-.148 1.54-.708 1.428-5.904 4.956-10.724 6.036-10.724.32 0 .408.308.408.672 0 1.604-1.132 4.892-1.132 6.992 0 2.268.964 3.768 2.956 3.768 2.208 0 4.452-2.704 5.948-6.656.468 3.692 1.48 6.672 3.064 6.672 1.944 0 5.396-4.092 7.488-8.424.82.104 2.052.076 3.236-.76-.504 1.276-.8 2.672-.8 4.068 0 4.02 1.92 5.148 3.572 5.148 1.796 0 3.252-1.072 4.368-2.956.368 1.7 1.308 2.932 3.036 2.932 2.704 0 5.052-2.764 5.052-5.032 0-.6-.256-.964-.556-.964zM23.32 21.888c-1.092 0-1.52-1.1-1.52-2.74 0-2.848 1.948-7.604 4.008-7.604.9 0 1.24 1.06 1.24 2.356 0 2.892-1.852 7.988-3.728 7.988zm37.404-8.5c-.652-.776-.888-1.832-.888-2.772 0-1.16.424-2.14.932-2.14s.664.5.664 1.196c0 1.164-.416 2.864-.708 3.716zm8.468 8.5c-1.092 0-1.52-1.264-1.52-2.74 0-2.748 1.948-7.604 4.024-7.604.9 0 1.22 1.052 1.22 2.356 0 2.892-1.82 7.988-3.724 7.988z"
    />
  </svg>
);

// 10. Notion - Official Notion Monogram Mark
const NotionLogo: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="#000000">
    <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z" />
  </svg>
);

// 11. Shopify - Official Shopify Bag
const ShopifyLogo: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="#7AB55C">
    <path d="M15.337 23.979l7.216-1.561s-2.604-17.613-2.625-17.73c-.018-.116-.114-.192-.211-.192s-1.929-.136-1.929-.136-1.275-1.274-1.439-1.411c-.045-.037-.075-.057-.121-.074l-.914 21.104h.023zM11.71 11.305s-.81-.424-1.774-.424c-1.447 0-1.504.906-1.504 1.141 0 1.232 3.24 1.715 3.24 4.629 0 2.295-1.44 3.76-3.406 3.76-2.354 0-3.54-1.465-3.54-1.465l.646-2.086s1.245 1.066 2.28 1.066c.675 0 .975-.545.975-.932 0-1.619-2.654-1.694-2.654-4.359-.034-2.237 1.571-4.416 4.827-4.416 1.257 0 1.875.361 1.875.361l-.945 2.715-.02.01zM11.17.83c.136 0 .271.038.405.135-.984.465-2.064 1.639-2.508 3.992-.656.213-1.293.405-1.889.578C7.697 3.75 8.951.84 11.17.84V.83zm1.235 2.949v.135c-.754.232-1.583.484-2.394.736.466-1.777 1.333-2.645 2.085-2.971.193.501.309 1.176.309 2.1zm.539-2.234c.694.074 1.141.867 1.429 1.755-.349.114-.735.231-1.158.366v-.252c0-.752-.096-1.371-.271-1.871v.002zm2.992 1.289c-.02 0-.06.021-.078.021s-.289.075-.714.21c-.423-1.233-1.176-2.37-2.508-2.37h-.115C12.135.209 11.669 0 11.265 0 8.159 0 6.675 3.877 6.21 5.846c-1.194.365-2.063.636-2.16.674-.675.213-.694.232-.772.87-.075.462-1.83 14.063-1.83 14.063L15.009 24l.927-21.166z" />
  </svg>
);

// 12. WordPress - Official WordPress Circle W Logo
const WordPressLogo: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="#21759B">
    <path d="M21.469 6.825c.84 1.537 1.318 3.3 1.318 5.175 0 3.979-2.156 7.456-5.363 9.325l3.295-9.527c.615-1.54.82-2.771.82-3.864 0-.405-.026-.78-.07-1.11m-7.981.105c.647-.03 1.232-.105 1.232-.105.582-.075.514-.93-.067-.899 0 0-1.755.135-2.88.135-1.064 0-2.85-.15-2.85-.15-.585-.03-.661.855-.075.885 0 0 .54.061 1.125.09l1.68 4.605-2.37 7.08L5.354 6.9c.649-.03 1.234-.1 1.234-.1.585-.075.516-.93-.065-.896 0 0-1.746.138-2.874.138-.2 0-.438-.008-.69-.015C4.911 3.15 8.235 1.215 12 1.215c2.809 0 5.365 1.072 7.286 2.833-.046-.003-.091-.009-.141-.009-1.06 0-1.812.923-1.812 1.914 0 .89.513 1.643 1.06 2.531.411.72.89 1.643.89 2.977 0 .915-.354 1.994-.821 3.479l-1.075 3.585-3.9-11.61.001.014zM12 22.784c-1.059 0-2.081-.153-3.048-.437l3.237-9.406 3.315 9.087c.024.053.05.101.078.149-1.12.393-2.325.609-3.582.609M1.211 12c0-1.564.336-3.05.935-4.39L7.29 21.709C3.694 19.96 1.212 16.271 1.211 12M12 0C5.385 0 0 5.385 0 12s5.385 12 12 12 12-5.385 12-12S18.615 0 12 0" />
  </svg>
);

// 13. GitHub - Official Octocat Silhouette Logo
const GitHubLogo: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="#24292F">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

// 14. Supabase - Official Lightning Badge
const SupabaseLogo: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="#3ECF8E">
    <path d="M11.9 1.036c-.015-.986-1.26-1.41-1.874-.637L.764 12.05C-.33 13.427.65 15.455 2.409 15.455h9.579l.113 7.51c.014.985 1.259 1.408 1.873.636l9.262-11.653c1.093-1.375.113-3.403-1.645-3.403h-9.642z" />
  </svg>
);

// 15. Figma - Official 5-Shape Color Mark
const FigmaLogo: React.FC<{ className?: string }> = ({ className = 'w-4 h-6' }) => (
  <svg className={className} viewBox="0 0 38 57" fill="none">
    <path
      d="M19 0H9.5C4.25329 0 0 4.25329 0 9.5C0 14.7467 4.25329 19 9.5 19H19V0Z"
      fill="#F24E1E"
    />
    <path
      d="M19 0H28.5C33.7467 0 38 4.25329 38 9.5C38 14.7467 33.7467 19 28.5 19H19V0Z"
      fill="#FF7262"
    />
    <path
      d="M0 28.5C0 23.2533 4.25329 19 9.5 19H19V38H9.5C4.25329 38 0 33.7467 0 28.5Z"
      fill="#A259FF"
    />
    <path
      d="M38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5Z"
      fill="#1ABCFE"
    />
    <path
      d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z"
      fill="#0ACF83"
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
    icon: <Sparkles className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[2.2]" />,
    colorClasses: {
      badgeBg: 'bg-orange-50',
      badgeBorder: 'border-orange-100',
      badgeText: 'text-[#FF6B00]',
      cardBg: 'bg-white',
      cardBorder: 'border-slate-200/80',
      cardBorderHover: 'hover:border-[#FF6B00]/40',
      arrowHoverText: 'group-hover:text-[#FF6B00]',
      arrowHoverBorder: 'group-hover:border-[#FF6B00]/40',
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
    icon: <BarChart3 className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[2.2]" />,
    colorClasses: {
      badgeBg: 'bg-blue-50',
      badgeBorder: 'border-blue-100',
      badgeText: 'text-blue-600',
      cardBg: 'bg-white',
      cardBorder: 'border-slate-200/80',
      cardBorderHover: 'hover:border-blue-500/40',
      arrowHoverText: 'group-hover:text-blue-600',
      arrowHoverBorder: 'group-hover:border-blue-500/40',
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
    icon: <Palette className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[2.2]" />,
    colorClasses: {
      badgeBg: 'bg-purple-50',
      badgeBorder: 'border-purple-100',
      badgeText: 'text-purple-600',
      cardBg: 'bg-white',
      cardBorder: 'border-slate-200/80',
      cardBorderHover: 'hover:border-purple-500/40',
      arrowHoverText: 'group-hover:text-purple-600',
      arrowHoverBorder: 'group-hover:border-purple-500/40',
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
      {
        name: 'Figma',
        description: 'UI/UX Design',
        logo: <FigmaLogo />,
      },
    ],
  },
  {
    id: 'web-commerce',
    accent: 'green',
    title: 'Web & Commerce',
    subtitle: 'Build, sell and scale online.',
    icon: <Globe className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[2.2]" />,
    colorClasses: {
      badgeBg: 'bg-emerald-50',
      badgeBorder: 'border-emerald-100',
      badgeText: 'text-emerald-600',
      cardBg: 'bg-white',
      cardBorder: 'border-slate-200/80',
      cardBorderHover: 'hover:border-emerald-500/40',
      arrowHoverText: 'group-hover:text-emerald-600',
      arrowHoverBorder: 'group-hover:border-emerald-500/40',
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
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="ai-tools"
      className="relative overflow-hidden bg-[#FAFAFA] pt-12 sm:pt-16 pb-12 sm:pb-16 border-b border-slate-100"
    >

      {/* HORIZONTAL WIDTH MATCHING MODULE CARDS (max-w-[1200px]) */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-3 sm:px-4 lg:px-6">

        {/* =========================================================
            SECTION HEADER
            ========================================================= */}
        <div className="max-w-4xl mx-auto text-center">

          {/* Top Pill / Badge */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.6, ease: SMOOTH_EASE_OUT }}
            className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/30 shadow-2xs"
          >
            <span className="w-3.5 sm:w-4 h-[1.5px] bg-[#FF6B00] rounded-full" />
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.14em] text-[#FF6B00]">
              INDUSTRY TOOLKIT
            </span>
            <span className="w-3.5 sm:w-4 h-[1.5px] bg-[#FF6B00] rounded-full" />
          </motion.div>

          {/* Main Headline */}
          <motion.h2
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.6, delay: 0.08, ease: SMOOTH_EASE_OUT }}
            className="mt-3.5 sm:mt-4 text-2xl sm:text-3xl md:text-[34px] lg:text-[40px] font-extrabold text-[#072B57] tracking-tight leading-[1.18] sm:whitespace-nowrap"
          >
            Master the tools modern teams{' '}
            <span className="text-[#FF6B00]">
              actually use.
            </span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.6, delay: 0.16, ease: SMOOTH_EASE_OUT }}
            className="mt-2.5 sm:mt-3 text-sm sm:text-[15px] text-slate-600 font-medium leading-relaxed max-w-xl mx-auto"
          >
            Build practical skills with the platforms powering today’s AI, marketing
            and digital businesses.
          </motion.p>

        </div>

        {/* =========================================================
            MAIN CONTENT: 2-COLUMN × 2-ROW GRID
            ========================================================= */}
        <div className="mt-7 sm:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          {categoryCards.map((category, index) => (
            <motion.div
              key={category.id}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT_ONCE}
              transition={{ duration: 0.6, delay: index * 0.1, ease: SMOOTH_EASE_OUT }}
              className={`group relative rounded-[20px] sm:rounded-[22px] bg-white border border-slate-200/90 hover:border-[#FF6B00]/40 p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(255,107,0,0.08)] hover:-translate-y-[2.5px] transition-all duration-300 flex flex-col justify-between`}
            >
              {/* Category Card Header */}
              <div>
                <div className="flex items-start justify-between gap-3 sm:gap-4">
                  
                  {/* Left: Category Icon & Titles */}
                  <div className="flex items-center gap-3 sm:gap-3.5">
                    <div
                      className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl ${category.colorClasses.badgeBg} border ${category.colorClasses.badgeBorder} ${category.colorClasses.badgeText} flex items-center justify-center flex-shrink-0 shadow-2xs`}
                    >
                      {category.icon}
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-extrabold text-[#072B57] tracking-tight leading-tight">
                        {category.title}
                      </h3>
                      <p className="text-xs sm:text-[13px] text-slate-500 font-medium mt-0.5 leading-snug">
                        {category.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Right: Subtle Circular Arrow Button */}
                  <button
                    type="button"
                    onClick={() => onOpenApply?.(category.title)}
                    aria-label={`Learn more about ${category.title}`}
                    className={`w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 ${category.colorClasses.arrowHoverText} ${category.colorClasses.arrowHoverBorder} group-hover:scale-105 group-hover:bg-slate-100 transition-all duration-200 shadow-2xs flex-shrink-0 cursor-pointer`}
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>

                </div>
              </div>

              {/* Tools List / Grid */}
              <div
                className={`mt-5 sm:mt-6 grid ${
                  category.tools.length === 3
                    ? 'grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3'
                    : 'grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3'
                }`}
              >
                {category.tools.map((tool) => (
                  <div
                    key={tool.name}
                    className="group/tool flex flex-col items-center sm:items-start text-center sm:text-left p-3 sm:p-3.5 rounded-xl bg-slate-50/80 hover:bg-white border border-slate-100 hover:border-slate-200/90 hover:shadow-xs transition-all duration-200 cursor-default"
                  >
                    {/* Logo in rounded-square container */}
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white border border-slate-200/70 shadow-2xs flex items-center justify-center p-2 mb-2 sm:mb-2.5 group-hover/tool:scale-105 group-hover/tool:border-[#FF6B00]/40 transition-all duration-200">
                      {tool.logo}
                    </div>

                    {/* Tool Name */}
                    <span className="text-[12.5px] sm:text-[13px] font-bold text-slate-800 tracking-tight leading-tight">
                      {tool.name}
                    </span>

                    {/* Small Muted Description */}
                    <span className="text-[10.5px] sm:text-[11px] text-slate-500 font-medium leading-snug mt-0.5 sm:mt-1">
                      {tool.description}
                    </span>
                  </div>
                ))}
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
