import React, { useEffect, useState } from 'react';
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
}

export const Header: React.FC<HeaderProps> = ({
  onOpenApply,
  onOpenBrochure,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState('home');

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
      <div className="bg-[#072B57] text-white text-xs py-2 px-4 border-b border-blue-900/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">

          <div className="flex items-center gap-2 font-medium">
            <span className="inline-flex items-center gap-1 bg-[#FF6B00] text-white px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase">
              <Sparkles className="w-3 h-3" />
              New Batch
            </span>

            <span>
              New Batch Starting Soon &bull; Limited 25 Seats
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-200">
            <a
              href="tel:+911145678900"
              className="inline-flex items-center gap-1.5 hover:text-[#FF6B00] transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>Admissions: +91 11 4567 8900</span>
            </a>

            <span className="hidden md:inline text-slate-500">
              |
            </span>

            <span className="hidden md:inline-flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              ISO 9001:2015
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        id="main-header"
        className={`sticky top-0 z-40 w-full transition-all duration-200 bg-white/95 backdrop-blur-md border-b ${
          isScrolled
            ? 'border-slate-200 shadow-md py-2'
            : 'border-slate-100 py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">

          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => handleNavigation(e, '#home')}
            className="flex-shrink-0 flex items-center group focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:ring-offset-2 rounded-lg"
            id="header-logo-link"
            aria-label="CBM Academy Home"
          >
            <CbmLogo
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
                      ? 'text-[#072B57] bg-slate-100 font-bold border-b-2 border-[#FF6B00]'
                      : 'text-slate-600 hover:text-[#072B57] hover:bg-slate-50'
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
              className="text-xs font-bold text-[#072B57] hover:text-[#FF6B00] px-3 py-2 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
            >
              Brochure
            </button>

            <button
              onClick={() => onOpenApply()}
              id="header-apply-btn"
              type="button"
              className="inline-flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:ring-offset-2"
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
              className="sm:hidden bg-[#FF6B00] text-white text-xs font-bold px-3 py-1.5 rounded-lg"
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
              className="p-2 rounded-xl text-slate-700 hover:text-[#072B57] hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#072B57]"
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
              <CbmLogo height={38} showTagline={true} />
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
                        ? 'text-[#072B57] bg-slate-100 font-bold border-l-4 border-[#FF6B00]'
                        : 'text-slate-700 hover:text-[#072B57] hover:bg-slate-50'
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
                className="w-full text-center py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm"
              >
                Download Detailed Brochure
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenApply();
                }}
                type="button"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#FF6B00] text-white font-bold text-base py-3 rounded-xl shadow-md"
              >
                <span>Apply for Next Cohort</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
