import React, { useState, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Download, Play, Volume2, VolumeX } from 'lucide-react';

interface HeroProps {
  onOpenApply?: () => void;
  onOpenBrochure: () => void;
  onExploreCourses?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenApply,
  onOpenBrochure,
  onExploreCourses,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayVideo = () => {
    setIsPlaying(true);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(() => {
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().catch(() => {});
          }
        });
      }
    }, 50);
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
    }
  };

  const handleExploreCourses = () => {
    if (onExploreCourses) {
      onExploreCourses();
    } else {
      window.location.hash = 'course';
      const courseElement =
        document.getElementById('course') || document.getElementById('courses');
      if (courseElement) {
        courseElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      id="home"
      className="relative overflow-hidden pt-6 pb-12 sm:pb-16 bg-white border-b border-slate-100"
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
              className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-700 shadow-sm"
            >
              <span className="flex h-2 w-2 rounded-full bg-[#FF6B00] animate-pulse" />
              <span className="font-bold text-[#FF6B00]">AI-Powered Digital Marketing Academy</span>
              <span className="text-slate-300">|</span>
              <span>Okhla, New Delhi</span>
            </motion.div>

            {/* Main Headline with Distinctive Background Design */}
            <div className="relative">
              {/* Clean, premium background behind/around the headline */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-x-3 sm:-inset-x-4 -inset-y-2.5 sm:-inset-y-3.5 -z-10 rounded-2xl sm:rounded-3xl bg-slate-50/60 border border-slate-200/70 shadow-[0_2px_12px_rgba(7,43,87,0.03)] overflow-hidden select-none"
              >
                {/* Very subtle abstract shapes & soft curves in navy and orange */}
                <svg
                  className="absolute -right-4 -bottom-6 w-44 h-44 sm:w-56 sm:h-56 text-[#072B57]/[0.045]"
                  viewBox="0 0 160 160"
                  fill="none"
                >
                  <circle cx="80" cy="80" r="64" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" />
                  <path d="M20 120 C 50 70, 110 70, 140 110" stroke="currentColor" strokeWidth="1.2" />
                </svg>

                {/* Subtle soft orange curve & geometric corner element */}
                <svg
                  className="absolute -top-3 -right-3 w-28 h-28 text-[#FF6B00]/[0.08]"
                  viewBox="0 0 100 100"
                  fill="none"
                >
                  <path d="M0 0 H100 V100 C100 44.77 55.23 0 0 0Z" fill="currentColor" opacity="0.4" />
                  <path d="M10 0 C60 0 100 40 100 90" stroke="#FF6B00" strokeWidth="1" strokeOpacity="0.25" />
                </svg>

                {/* Minimal geometric alignment element */}
                <div className="absolute top-2.5 left-3 flex items-center gap-1 opacity-20">
                  <span className="w-1 h-1 rounded-full bg-[#072B57]" />
                  <span className="w-3 h-[1px] bg-[#072B57]" />
                </div>
              </div>

              <motion.h1
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.18, ease: 'easeOut' }}
                className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] tracking-tight leading-[1.2] sm:leading-[1.16]"
              >
                <span className="text-[#072B57] font-extrabold sm:font-black">
                  Master Digital Marketing in Delhi
                </span>{' '}
                <span className="relative inline-block text-[#FF6B00] font-extrabold sm:font-black">
                  with AI
                  <svg
                    className="absolute left-0 -bottom-1 sm:-bottom-1.5 w-full h-[5px] sm:h-[6px] text-[#FF6B00]"
                    viewBox="0 0 85 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M1.5 5.5C24.5 2 60.5 2 83.5 5.5"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                {', '}
                <span className="font-semibold text-[#072B57]/80">
                  at CBM Academy
                </span>
              </motion.h1>
            </div>

            {/* Subheadline */}
            <motion.p
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.25, ease: 'easeOut' }}
              className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl"
            >
              Build job-ready digital marketing skills with practical training in SEO, Google Ads, Meta Ads, social media marketing, analytics, content marketing and AI-powered marketing workflows at CBM Academy in Okhla, New Delhi.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.32, ease: 'easeOut' }}
              className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4"
            >
              <button
                onClick={handleExploreCourses}
                id="hero-explore-courses-btn"
                type="button"
                className="inline-flex items-center justify-center gap-2.5 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold text-base px-7 py-3.5 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all duration-150 active:scale-98 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:ring-offset-2"
              >
                <span>Explore Courses</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={onOpenBrochure}
                id="hero-download-brochure-btn"
                type="button"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-[#072B57] font-bold text-base px-6 py-3.5 rounded-xl border border-slate-200 hover:border-slate-300 shadow-sm transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-300"
              >
                <Download className="w-5 h-5 text-[#FF6B00]" />
                <span>Download Brochure</span>
              </button>
            </motion.div>
          </div>

          {/* Right Column: 1:1 Welcome Video Preview & Inline Player */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-md lg:max-w-[440px]">
              
              {/* 1:1 Video Container */}
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.22, ease: 'easeOut' }}
                className="relative w-full aspect-square rounded-3xl overflow-hidden border border-slate-200/90 shadow-2xl bg-slate-950 group"
                style={{ aspectRatio: '1 / 1' }}
              >
                {!isPlaying ? (
                  /* Thumbnail Preview State */
                  <div
                    onClick={handlePlayVideo}
                    className="relative w-full h-full cursor-pointer select-none"
                    role="button"
                    tabIndex={0}
                    aria-label="Watch CBM Academy Video"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handlePlayVideo();
                      }
                    }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop"
                      alt="CBM Academy Digital Marketing Training & Live Session in Okhla, New Delhi"
                      title="CBM Academy Digital Marketing Training & Live Session in Okhla, New Delhi"
                      width={1200}
                      height={1200}
                      decoding="async"
                      fetchPriority="high"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Subtle gradient overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-black/35 pointer-events-none" />

                    {/* Voice enable / disable icon button */}
                    <button
                      type="button"
                      onClick={handleToggleMute}
                      aria-label={isMuted ? 'Enable sound' : 'Mute sound'}
                      title={isMuted ? 'Sound Disabled (Click to Enable)' : 'Sound Enabled (Click to Mute)'}
                      className="absolute top-3.5 right-3.5 z-20 p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md border border-white/15 shadow-md transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4 text-slate-300" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-[#FF6B00]" />
                      )}
                    </button>

                    {/* Liquid-Style Play Button (Fluid Glass Sphere + Ambient Ripples) */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="relative flex items-center justify-center">
                        {/* Fluid ambient pulsing glow */}
                        <span className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-[#FF6B00]/40 to-amber-300/40 blur-md animate-pulse" />

                        {/* Liquid fluid outer ring wave */}
                        <span className="absolute w-18 h-18 sm:w-22 sm:h-22 rounded-full border border-orange-400/40 animate-ping opacity-60" style={{ animationDuration: '3s' }} />

                        {/* Glossy liquid glass button */}
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#FFA04D] via-[#FF6B00] to-[#D95200] p-[2px] shadow-[0_12px_36px_rgba(255,107,0,0.45)] backdrop-blur-md transition-transform duration-300 group-hover:scale-110 active:scale-95 flex items-center justify-center">
                          {/* Liquid specular highlight / reflection */}
                          <div className="absolute top-1 left-2.5 right-2.5 h-[42%] rounded-t-full bg-gradient-to-b from-white/70 via-white/20 to-transparent pointer-events-none" />

                          {/* Inner caustic glow & play icon */}
                          <div className="w-full h-full rounded-full flex items-center justify-center bg-gradient-to-tr from-transparent via-[#FF7A1A]/30 to-white/20 shadow-[inset_0_2px_4px_rgba(255,255,255,0.6),inset_0_-2px_6px_rgba(0,0,0,0.3)]">
                            <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white text-white translate-x-0.5 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Clean, minimal bottom label */}
                    <div className="absolute bottom-3.5 left-4 right-4 pointer-events-none flex items-center justify-between text-white text-xs">
                      <span className="font-semibold tracking-wide bg-slate-900/75 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                        Watch Video
                      </span>
                      <span className="text-[11px] text-slate-300 bg-slate-900/60 backdrop-blur-sm px-2.5 py-1 rounded-md">
                        Click to play
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Inline Video Playback State */
                  <div className="relative w-full h-full bg-black">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      controls
                      controlsList="nodownload noplaybackrate"
                      disablePictureInPicture
                      muted={isMuted}
                      className="w-full h-full object-cover"
                    >
                      <source src="/assets/aistudio/Academy_Digital_h264.mp4" type="video/mp4" />
                      <source src="/assets/aistudio/Academy_Digital_b9140150.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>

                    {/* Voice enable / disable icon button during playback */}
                    <button
                      type="button"
                      onClick={handleToggleMute}
                      aria-label={isMuted ? 'Enable sound' : 'Mute sound'}
                      title={isMuted ? 'Sound Disabled (Click to Enable)' : 'Sound Enabled (Click to Mute)'}
                      className="absolute top-3.5 right-3.5 z-20 p-2 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md border border-white/20 shadow-md transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4 text-slate-300" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-[#FF6B00]" />
                      )}
                    </button>
                  </div>
                )}
              </motion.div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
