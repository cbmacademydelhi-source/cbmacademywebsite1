import React, { useEffect, useState } from 'react';

import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { WhyChooseCBM } from './components/WhyChooseCBM';
import { CourseSection } from './components/CourseSection';
import { JobBoard } from './components/JobBoard';
import { CertificateVerification } from './components/CertificateVerification';
import { BlogSection } from './components/BlogSection';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ApplyModal } from './components/ApplyModal';
import { BrochureModal } from './components/BrochureModal';
import { AIBot } from './components/AIBot';

export default function App() {
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  const [selectedCourseForApply, setSelectedCourseForApply] =
    useState<string | undefined>(undefined);

  const [brochureModalOpen, setBrochureModalOpen] =
    useState(false);

  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const updatePage = () => {
      const hash = window.location.hash.replace('#', '');

      const validPages = [
        'home',
        'course',
        'about',
        'certificate',
        'jobs',
        'blogs',
        'contact',
      ];

      if (validPages.includes(hash)) {
        setCurrentPage(hash);
      } else {
        setCurrentPage('home');
      }

      window.scrollTo({
        top: 0,
        behavior: 'instant',
      });
    };

    updatePage();

    window.addEventListener('hashchange', updatePage);

    return () => {
      window.removeEventListener('hashchange', updatePage);
    };
  }, []);

  const handleOpenApply = (courseOrJobTitle?: string) => {
    setSelectedCourseForApply(
      courseOrJobTitle ||
        'Master in AI-Powered Digital Marketing & Performance Growth'
    );

    setApplyModalOpen(true);
  };

  const handleOpenBrochure = () => {
    setBrochureModalOpen(true);
  };

  /*
   * HOME PAGE
   */
  const renderHomePage = () => {
    return (
      <>
        <Hero
          onOpenApply={() => handleOpenApply()}
          onOpenBrochure={handleOpenBrochure}
        />

        <WhyChooseCBM
          onOpenApply={() => handleOpenApply()}
        />

        <CourseSection
          onOpenApply={handleOpenApply}
          onOpenBrochure={handleOpenBrochure}
        />

        <JobBoard
          onOpenApply={handleOpenApply}
        />

        <BlogSection />

        <About />

        <Contact />
      </>
    );
  };

  /*
   * INDIVIDUAL PAGES
   */
  const renderPage = () => {
    switch (currentPage) {
      case 'course':
        return (
          <CourseSection
            onOpenApply={handleOpenApply}
            onOpenBrochure={handleOpenBrochure}
          />
        );

      case 'about':
        return <About />;

      case 'certificate':
        return <CertificateVerification />;

      case 'jobs':
        return (
          <JobBoard
            onOpenApply={handleOpenApply}
          />
        );

      case 'blogs':
        return <BlogSection />;

      case 'contact':
        return <Contact />;

      case 'home':
      default:
        return renderHomePage();
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#1E293B] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col">

      {/* Header */}
      <Header
        onOpenApply={handleOpenApply}
        onOpenBrochure={handleOpenBrochure}
      />

      {/* Main Content */}
      <main className="flex-grow">
        {renderPage()}
      </main>

      {/* Footer */}
      <Footer
        onOpenApply={() => handleOpenApply()}
        onOpenBrochure={handleOpenBrochure}
      />

      {/* Apply Modal */}
      <ApplyModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        initialCourse={selectedCourseForApply}
      />

      {/* Brochure Modal */}
      <BrochureModal
        isOpen={brochureModalOpen}
        onClose={() => setBrochureModalOpen(false)}
      />

      {/* =====================================================
          FLOATING WHATSAPP + CBM AI BOT
      ===================================================== */}

      <div className="fixed bottom-5 right-5 z-[60] flex items-end gap-3">

        {/* CBM AI BOT */}
        <div className="flex flex-col items-center gap-1.5">

          <span className="rounded-full bg-white px-3 py-1 text-[11px] font-extrabold text-[#072B57] border border-slate-200 shadow-sm whitespace-nowrap">
            CBM AI Bot
          </span>

          <div className="transition-transform duration-200 hover:scale-110">
            <AIBot />
          </div>

        </div>

        {/* WHATSAPP */}
        <a
          href="https://wa.me/919211583150?text=Hi%20CBM%20Academy%2C%20I%20want%20to%20know%20more%20about%20your%20Digital%20Marketing%20course."
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="flex flex-col items-center gap-1.5"
        >

          <span className="rounded-full bg-white px-3 py-1 text-[11px] font-extrabold text-[#072B57] border border-slate-200 shadow-sm whitespace-nowrap">
            WhatsApp
          </span>

          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl">

            {/* WhatsApp Logo */}
            <svg
              viewBox="0 0 48 48"
              className="h-8 w-8"
              aria-hidden="true"
            >
              <path
                fill="white"
                d="M24 4C12.95 4 4 12.95 4 24c0 3.52.91 6.82 2.51 9.69L4 44l10.63-2.79A19.91 19.91 0 0 0 24 44c11.05 0 20-8.95 20-20S35.05 4 24 4Z"
              />

              <path
                fill="#25D366"
                d="M24 8.5C15.45 8.5 8.5 15.45 8.5 24c0 3.02.88 5.84 2.39 8.21l-1.56 5.72 5.9-1.54A15.42 15.42 0 0 0 24 39.5c8.55 0 15.5-6.95 15.5-15.5S32.55 8.5 24 8.5Z"
              />

              <path
                fill="white"
                d="M31.1 27.55c-.39-.2-2.3-1.13-2.66-1.26-.36-.13-.62-.2-.89.2-.26.39-1 1.26-1.23 1.52-.23.26-.46.3-.85.1-.39-.2-1.65-.61-3.14-1.95-1.16-1.03-1.94-2.3-2.17-2.69-.23-.39-.02-.6.18-.8.18-.18.39-.46.59-.69.2-.23.26-.39.39-.65.13-.26.07-.49-.03-.69-.1-.2-.89-2.14-1.22-2.93-.32-.77-.65-.67-.89-.68h-.76c-.26 0-.69.1-1.05.49-.36.39-1.38 1.35-1.38 3.29s1.41 3.81 1.61 4.08c.2.26 2.77 4.23 6.71 5.93.94.4 1.67.64 2.24.82.94.3 1.79.26 2.46.16.75-.11 2.3-.94 2.62-1.84.33-.91.33-1.68.23-1.84-.1-.16-.36-.26-.75-.46Z"
              />
            </svg>

          </span>

        </a>

      </div>

    </div>
  );
}
