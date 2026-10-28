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
  Search,
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

  const primaryNavLinks = [
    { name: 'Home', href: '#home', id: 'home' },
    { name: 'Courses', href: '#course', id: 'course' },
    { name: 'Webinars', href: '#webinars', id: 'webinars' },
    { name: 'About', href: '#about', id: 'about' },
    { name: 'Blog', href: '#blogs', id: 'blogs' },
    { name: 'Contact', href: '#contact', id: 'contact' },
  ];

  const allNavLinks = [
    ...primaryNavLinks,
    { name: 'Certificate Verification', href: '#certificate', id: 'certificate' },
    { name: 'Jobs', href: '#jobs', id: 'jobs' },
  ];

  useEffect(() => {
    const updatePage = () => {
      const hash = window.location.hash.replace('#', '');

      if (hash && allNavLinks.some((link) => link.id === hash)) {
        setActivePage(hash);
      } else if (hash === 'services') {
        setActivePage('about');
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
        className="bg-[#072B57] text-white text-xs py-2 px-4"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">

          <div className="flex items-center gap-2 font-medium">
            <span className="inline-flex items-center gap-1 bg-[#FF6B00] text-white px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase">
              <Sparkles className="w-3 h-3" />
              New Batch
            </span>

            <span className="text-blue-100">
              New Batch Starting Soon &bull; Limited 25 Seats
            </span>
          </div>

          <div className="flex items-center gap-4 text-blue-200">
            <a
              href="tel:+911145678900"
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>Admissions: +91 11 4567 8900</span>
            </a>

            <span className="hidden md:inline text-blue-300/40">
              |
            </span>

            <span className="hidden md:inline-flex items-center gap-1 text-emerald-300">
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
        className={`sticky top-0 z-40 w-full transition-all duration-150 bg-white border-b border-gray-200 ${
          isScrolled ? 'shadow-xs py-2' : 'py-2.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">

          {/* Official CBM Academy Logo */}
          <a
            href="#home"
            onClick={(e) => handleNavigation(e, '#home')}
            className="flex-shrink-0 flex items-center group focus:outline-none"
            id="header-logo-link"
            aria-label="CBM Academy Home"
          >
            <CbmLogo height={52} className="hover:opacity-95 transition-opacity" />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {primaryNavLinks.map((link) => {
              const isActive = activePage === link.id;

              return (
                <a
                  key={link.id}
                  href={link.href}
                  id={`nav-link-${link.id}`}
                  onClick={(e) => handleNavigation(e, link.href)}
                  className={`py-1 text-sm transition-colors duration-150 whitespace-nowrap ${
                    isActive
                      ? 'text-[#072B57] font-bold border-b-2 border-[#FF6B00]'
                      : 'text-slate-600 hover:text-[#FF6B00]'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Desktop Actions: Search Icon & Navy Enquire Now Button */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              type="button"
              id="header-search-icon-btn"
              onClick={() => {
                if (activePage === 'webinars') {
                  const searchInput = document.querySelector('input[placeholder*="Search webinars"]') as HTMLInputElement;
                  searchInput?.focus();
                } else {
                  window.location.hash = 'webinars';
                  setTimeout(() => {
                    const searchInput = document.querySelector('input[placeholder*="Search webinars"]') as HTMLInputElement;
                    searchInput?.focus();
                  }, 100);
                }
              }}
              aria-label="Search webinars"
              className="p-2 text-gray-500 hover:text-[#073B8C] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenApply()}
              id="header-enquire-btn"
              type="button"
              className="inline-flex items-center justify-center bg-[#073B8C] hover:bg-[#052c6b] text-white font-medium text-xs sm:text-sm px-4 py-2 rounded-md shadow-xs transition-colors cursor-pointer active:scale-98"
            >
              Enquire Now
            </button>
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => onOpenApply()}
              type="button"
              className="sm:hidden bg-[#FF6B00] text-white text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer"
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
              className="p-2 rounded-xl text-slate-700 hover:text-[#072B57] hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
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
            className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl"
          >
            <div className="py-2 border-b border-slate-100">
              <CbmLogo variant="light" height={48} />
            </div>

            <div className="flex flex-col space-y-1 pt-2">
              {allNavLinks.map((link) => {
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
                        ? 'text-[#FF6B00] bg-orange-50 font-bold border-l-4 border-[#FF6B00]'
                        : 'text-slate-600 hover:text-[#072B57] hover:bg-slate-50'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </a>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBrochure();
                }}
                type="button"
                className="w-full text-center py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-sm"
              >
                Download Detailed Brochure
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenApply();
                }}
                type="button"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold text-base py-3 rounded-xl shadow-md"
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
