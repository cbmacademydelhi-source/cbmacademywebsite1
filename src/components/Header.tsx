import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { CbmLogo } from './CbmLogo';
import {
  Menu,
  X,
  ArrowRight,
  PhoneCall,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  onOpenApply: (courseTitle?: string) => void;
  onOpenBrochure: () => void;
  isHomePage?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenApply,
  onOpenBrochure,
  isHomePage = false,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState('home');
  const shouldReduceMotion = useReducedMotion();
  const shouldAnimate = isHomePage && !shouldReduceMotion;

  const navLinks = [
    { name: 'Home', href: '#home', id: 'home' },
    { name: 'Course', href: '#course', id: 'course' },
    { name: 'About', href: '#about', id: 'about' },
    {
      name: 'Certificate Verification',
      href: '#certificate',
      id: 'certificate',
    },
    { name: 'Jobs', href: '#jobs', id: 'jobs' },
    { name: 'Blogs', href: '#blogs', id: 'blogs' },
    { name: 'Contact', href: '#contact', id: 'contact' },
  ];

  useEffect(() => {
    const updatePage = () => {
      const hash = window.location.hash.replace('#', '');

      if (hash && navLinks.some((link) => link.id === hash)) {
        setActivePage(hash);
      } else {
        setActivePage('home');
      }
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    updatePage();
    handleScroll();

    window.addEventListener('hashchange', updatePage);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('hashchange', updatePage);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();

    setMobileMenuOpen(false);

    const page = href.replace('#', '');

    setActivePage(page);

    window.location.hash = page;

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {/* Top Notification Bar */}
      <motion.div
        initial={shouldAnimate ? { opacity: 0 } : false}
        animate={shouldAnimate ? { opacity: 1 } : undefined}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="bg-[#0D0D0D] text-white text-xs py-2 px-4 border-b border-white/[0.06]"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">

          <div className="flex items-center gap-2 font-medium">
            <span className="inline-flex items-center gap-1 bg-[#FF7200] text-white px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase">
              <Sparkles className="w-3 h-3" />
              New Batch
            </span>

            <span className="text-[#A7A7A7]">
              New Batch Starting Soon &bull; Limited 25 Seats
            </span>
          </div>

          <div className="flex items-center gap-4 text-[#A7A7A7]">
            <a
              href="tel:+911145678900"
              className="inline-flex items-center gap-1.5 hover:text-[#FF7200] transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#FF7200]" />
              <span>Admissions: +91 11 4567 8900</span>
            </a>

            <span className="hidden md:inline text-white/20">
              |
            </span>

            <span className="hidden md:inline-flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              ISO 9001:2015
            </span>
          </div>
        </div>
      </motion.div>

      {/* Main Header */}
      <motion.header
        id="main-header"
        initial={shouldAnimate ? { opacity: 0 } : false}
        animate={shouldAnimate ? { opacity: 1 } : undefined}
        transition={{ duration: 0.5, delay: 0.05, ease: 'easeOut' }}
        className={`sticky top-0 z-40 w-full transition-all duration-200 bg-[#080808]/90 backdrop-blur-md border-b ${
          isScrolled
            ? 'border-white/[0.12] shadow-xl py-2'
            : 'border-white/[0.06] py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">

          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => handleNavigation(e, '#home')}
            className="flex-shrink-0 flex items-center group focus:outline-none focus:ring-2 focus:ring-[#FF7200] focus:ring-offset-2 focus:ring-offset-[#080808] rounded-lg"
            id="header-logo-link"
            aria-label="CBM Academy Home"
          >
            <CbmLogo
              variant="dark"
              height={isScrolled ? 42 : 48}
              showTagline={true}
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = activePage === link.id;

              return (
                <a
                  key={link.id}
                  href={link.href}
                  id={`nav-link-${link.id}`}
                  onClick={(e) =>
                    handleNavigation(e, link.href)
                  }
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-150 whitespace-nowrap ${
                    isActive
                      ? 'text-[#FF7200] bg-white/[0.06] font-bold border-b-2 border-[#FF7200]'
                      : 'text-[#A7A7A7] hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onOpenBrochure}
              id="header-brochure-btn"
              type="button"
              className="text-xs font-bold text-white hover:text-[#FF7200] px-3.5 py-2 rounded-lg border border-white/[0.12] hover:border-[#FF7200]/50 transition-colors cursor-pointer"
            >
              Brochure
            </button>

            <button
              onClick={() => onOpenApply()}
              id="header-apply-btn"
              type="button"
              className="inline-flex items-center justify-center gap-2 bg-[#FF7200] hover:bg-[#e06500] text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-[0_4px_16px_rgba(255,114,0,0.25)] hover:shadow-[0_6px_22px_rgba(255,114,0,0.35)] transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF7200] focus:ring-offset-2 focus:ring-offset-[#080808]"
            >
              <span>Apply Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => onOpenApply()}
              type="button"
              className="sm:hidden bg-[#FF7200] text-white text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer"
            >
              Apply
            </button>

            <button
              onClick={() =>
                setMobileMenuOpen(!mobileMenuOpen)
              }
              type="button"
              id="mobile-menu-toggle"
              aria-label="Toggle navigation menu"
              className="p-2 rounded-xl text-[#A7A7A7] hover:text-white hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-[#FF7200]"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            id="mobile-menu-drawer"
            className="lg:hidden border-t border-white/[0.08] bg-[#0D0D0D] px-4 pt-3 pb-6 space-y-2 shadow-2xl"
          >
            <div className="py-2 border-b border-white/[0.06]">
              <CbmLogo variant="dark" height={38} showTagline={true} />
            </div>

            <div className="flex flex-col space-y-1 pt-2">
              {navLinks.map((link) => {
                const isActive = activePage === link.id;

                return (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={(e) =>
                      handleNavigation(e, link.href)
                    }
                    className={`px-3 py-2.5 rounded-lg text-base font-semibold transition-colors flex items-center justify-between ${
                      isActive
                        ? 'text-[#FF7200] bg-white/[0.06] font-bold border-l-4 border-[#FF7200]'
                        : 'text-[#A7A7A7] hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ArrowRight className="w-4 h-4 text-white/30" />
                  </a>
                );
              })}
            </div>

            <div className="pt-4 border-t border-white/[0.08] flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBrochure();
                }}
                type="button"
                className="w-full text-center py-2.5 rounded-xl border border-white/[0.12] text-white hover:border-[#FF7200] font-bold text-sm"
              >
                Download Detailed Brochure
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenApply();
                }}
                type="button"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#FF7200] hover:bg-[#e06500] text-white font-bold text-base py-3 rounded-xl shadow-md"
              >
                <span>Apply for Next Cohort</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </motion.header>
    </>
  );
};
