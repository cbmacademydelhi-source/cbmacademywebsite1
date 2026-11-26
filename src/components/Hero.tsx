import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Download, Pause, Play, Volume2, VolumeX } from 'lucide-react';

interface HeroProps {
  onOpenApply?: () => void;
  onOpenBrochure: () => void;
  onExploreCourses?: () => void;
}

const HERO_VIDEO_URL =
  'https://ik.imagekit.io/jhnyo0yy5/Academy%20LOW%20BIT.mp4';
const HERO_POSTER_URL =
  'https://ik.imagekit.io/jhnyo0yy5/Academy%20LOW%20BIT.mp4/ik-thumbnail.jpg';
const HERO_FALLBACK_POSTER_URL =
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop';

// Initial intrinsic dimensions matching Academy LOW BIT.mp4 (2160x2880 -> 3:4) to prevent CLS;
// updated dynamically from video.videoWidth / video.videoHeight once metadata loads.
const INITIAL_VIDEO_DIMENSIONS = { width: 2160, height: 2880 };

export const Hero: React.FC<HeroProps> = ({
  onOpenApply,
  onOpenBrochure,
  onExploreCourses,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [posterSrc, setPosterSrc] = useState<string>(HERO_POSTER_URL);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showFallbackPlay, setShowFallbackPlay] = useState<boolean>(false);
  const [videoDimensions, setVideoDimensions] = useState(INITIAL_VIDEO_DIMENSIONS);
  const [progressPercent, setProgressPercent] = useState<number>(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const userInitiatedPlayRef = useRef<boolean>(false);
  const userPausedRef = useRef<boolean>(false);

  const attemptAutoplay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure muted & inline properties are set directly on the DOM node for iOS/Safari compatibility
    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', 'true');

    const playPromise = video.play();
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise
        .then(() => {
          setHasStarted(true);
          setIsPlaying(true);
          setShowFallbackPlay(false);
        })
        .catch(() => {
          // Browser blocked autoplay (e.g. Low Power Mode or strict policy): show graceful tap-to-play overlay
          setIsPlaying(false);
          setShowFallbackPlay(true);
        });
    }
  }, []);

  // Respect prefers-reduced-motion & start muted autoplay immediately on mount
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = isMuted;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', 'true');

    if (shouldReduceMotion) {
      video.pause();
      setIsPlaying(false);
      setShowFallbackPlay(true);
      return;
    }

    attemptAutoplay();
  }, [shouldReduceMotion, attemptAutoplay]);

  // Pause when off-screen or tab hidden to prevent unnecessary buffering/CPU usage on mobile
  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    const canAutoResume = () =>
      !userPausedRef.current &&
      !showFallbackPlay &&
      (!shouldReduceMotion || userInitiatedPlayRef.current);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (!video.paused) video.pause();
      } else if (canAutoResume() && video.paused) {
        video.play().catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;
          if (!entry.isIntersecting) {
            if (!video.paused) video.pause();
          } else if (canAutoResume() && video.paused) {
            video.play().catch(() => {});
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(container);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer?.disconnect();
    };
  }, [shouldReduceMotion, showFallbackPlay]);

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const { videoWidth, videoHeight } = e.currentTarget;
    if (videoWidth > 0 && videoHeight > 0) {
      setVideoDimensions((prev) =>
        prev.width === videoWidth && prev.height === videoHeight
          ? prev
          : { width: videoWidth, height: videoHeight }
      );
    }
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const { currentTime, duration } = e.currentTarget;
    if (currentTime > 0) {
      setHasStarted(true);
    }
    if (duration && Number.isFinite(duration) && duration > 0) {
      setProgressPercent(Math.min(100, Math.max(0, (currentTime / duration) * 100)));
    }
  };

  const handleManualPlay = () => {
    const video = videoRef.current;
    if (!video) return;

    userInitiatedPlayRef.current = true;
    userPausedRef.current = false;
    video.muted = isMuted;
    video.playsInline = true;

    const playPromise = video.play();
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise
        .then(() => {
          setHasStarted(true);
          setIsPlaying(true);
          setShowFallbackPlay(false);
        })
        .catch(() => {
          video.muted = true;
          setIsMuted(true);
          video
            .play()
            .then(() => {
              setHasStarted(true);
              setIsPlaying(true);
              setShowFallbackPlay(false);
            })
            .catch(() => {});
        });
    }
  };

  const handleTogglePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      handleManualPlay();
    } else {
      userPausedRef.current = true;
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video || !video.duration || !Number.isFinite(video.duration)) return;

    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width <= 0) return;
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    video.currentTime = ratio * video.duration;
    setProgressPercent(ratio * 100);
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

          {/* Right Column: Intrinsic Aspect-Ratio Promotional Video Player */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-md lg:max-w-[440px]">

              {/* Responsive Video Container matching original videoWidth / videoHeight */}
              <motion.div
                ref={containerRef}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.22, ease: 'easeOut' }}
                className="relative w-full rounded-3xl overflow-hidden border border-slate-200/90 shadow-2xl bg-slate-950 group"
                style={{
                  aspectRatio: `${videoDimensions.width} / ${videoDimensions.height}`,
                }}
              >
                {/* Immediate Poster Image with matching intrinsic ratio (prevents layout shift while loading) */}
                <img
                  src={posterSrc}
                  onError={() => {
                    if (posterSrc !== HERO_FALLBACK_POSTER_URL) {
                      setPosterSrc(HERO_FALLBACK_POSTER_URL);
                    }
                  }}
                  alt="CBM Academy Digital Marketing Training & Live Session in Okhla, New Delhi"
                  title="CBM Academy Digital Marketing Training & Live Session in Okhla, New Delhi"
                  width={videoDimensions.width}
                  height={videoDimensions.height}
                  decoding="async"
                  fetchPriority="high"
                  aria-hidden={hasStarted}
                  className={`absolute inset-0 z-10 w-full h-full object-contain object-center pointer-events-none transition-opacity duration-500 ${
                    hasStarted ? 'opacity-0' : 'opacity-100'
                  }`}
                />

                {/* Promotional Hero Video (object-contain so 100% of frame is visible without crop or stretch) */}
                <video
                  ref={videoRef}
                  src={HERO_VIDEO_URL}
                  poster={posterSrc}
                  autoPlay={!shouldReduceMotion}
                  muted={isMuted}
                  loop
                  playsInline
                  controls={false}
                  preload={shouldReduceMotion ? 'none' : 'auto'}
                  disablePictureInPicture
                  disableRemotePlayback
                  onLoadedMetadata={handleLoadedMetadata}
                  onLoadedData={() => setHasStarted(true)}
                  onTimeUpdate={handleTimeUpdate}
                  onPlaying={() => {
                    setHasStarted(true);
                    setIsPlaying(true);
                    setShowFallbackPlay(false);
                  }}
                  onPause={() => setIsPlaying(false)}
                  onClick={handleTogglePlayPause}
                  className="relative z-0 block w-full h-full object-contain object-center cursor-pointer"
                />

                {/* Graceful fallback overlay when autoplay is restricted or reduced motion is enabled */}
                {showFallbackPlay && !isPlaying && (
                  <div
                    onClick={handleManualPlay}
                    className="absolute inset-0 z-20 cursor-pointer select-none flex items-center justify-center bg-gradient-to-t from-slate-950/60 via-slate-950/15 to-black/25"
                    role="button"
                    tabIndex={0}
                    aria-label="Play CBM Academy Promotional Video"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleManualPlay();
                      }
                    }}
                  >
                    <div className="relative flex items-center justify-center">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#FFA04D] via-[#FF6B00] to-[#D95200] p-[2px] shadow-[0_12px_36px_rgba(255,107,0,0.45)] backdrop-blur-md transition-transform duration-300 group-hover:scale-110 active:scale-95 flex items-center justify-center">
                        <div className="w-full h-full rounded-full flex items-center justify-center bg-gradient-to-tr from-transparent via-[#FF7A1A]/30 to-white/20">
                          <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white text-white translate-x-0.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* In-Bounds Player Controls: Play/Pause, Playback Progress Bar, and Sound Toggle */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-0 inset-x-0 z-30 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-3.5 pt-7 pb-3 flex items-center gap-2.5"
                >
                  <button
                    type="button"
                    onClick={handleTogglePlayPause}
                    aria-label={isPlaying ? 'Pause video' : 'Play video'}
                    title={isPlaying ? 'Pause' : 'Play'}
                    className="p-1.5 rounded-full bg-black/55 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 shadow-sm transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                  >
                    {isPlaying ? (
                      <Pause className="w-3.5 h-3.5" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-white translate-x-[0.5px]" />
                    )}
                  </button>

                  {/* Playback Progress Bar */}
                  <div
                    role="slider"
                    aria-label="Video playback progress"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(progressPercent)}
                    tabIndex={0}
                    onClick={handleSeek}
                    className="flex-1 h-4 flex items-center cursor-pointer group/progress"
                  >
                    <div className="w-full h-1.5 rounded-full bg-white/30 overflow-hidden backdrop-blur-xs">
                      <div
                        className="h-full bg-[#FF6B00] rounded-full transition-[width] duration-100"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Sound Mute / Unmute Toggle (muted by default) */}
                  <button
                    type="button"
                    onClick={handleToggleMute}
                    aria-label={isMuted ? 'Enable sound' : 'Mute sound'}
                    title={isMuted ? 'Sound Muted (Click to Unmute)' : 'Sound On (Click to Mute)'}
                    className="p-1.5 rounded-full bg-black/55 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 shadow-sm transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                  >
                    {isMuted ? (
                      <VolumeX className="w-3.5 h-3.5 text-slate-200" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5 text-[#FF6B00]" />
                    )}
                  </button>
                </div>
              </motion.div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
