import React, { useEffect, useState } from 'react';

import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { WhyChooseCBM } from './components/WhyChooseCBM';
import { CourseSection } from './components/CourseSection';
import { AITools } from './components/AITools';
import { JobBoard } from './components/JobBoard';
import { CertificateVerification } from './components/CertificateVerification';
import { BlogSection } from './components/BlogSection';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ApplyModal } from './components/ApplyModal';
import { BrochureModal } from './components/BrochureModal';

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
        {/* Hero */}
        <Hero
          onOpenApply={() => handleOpenApply()}
          onOpenBrochure={handleOpenBrochure}
        />

        {/* Why Choose CBM */}
        <WhyChooseCBM
          onOpenApply={() => handleOpenApply()}
        />

        {/* Course Modules */}
        <CourseSection
          onOpenApply={handleOpenApply}
          onOpenBrochure={handleOpenBrochure}
        />

        {/* AI Tools */}
        <AITools />

        {/* Jobs */}
        <JobBoard
          onOpenApply={handleOpenApply}
        />

        {/* Blogs */}
        <BlogSection />

        {/* About */}
        <About />

        {/* Contact */}
        <Contact />
      </>
    );
  };

  /*
   * INDIVIDUAL PAGES
   */
  const renderPage = () => {
    switch (currentPage) {

      /*
       * COURSE PAGE
       * Only CourseSection is shown here.
       * AI Tools has been removed from this page.
       */
      case 'course':
        return (
          <CourseSection
            onOpenApply={handleOpenApply}
            onOpenBrochure={handleOpenBrochure}
          />
        );

      /*
       * ABOUT PAGE
       */
      case 'about':
        return <About />;

      /*
       * CERTIFICATE VERIFICATION PAGE
       */
      case 'certificate':
        return <CertificateVerification />;

      /*
       * JOBS PAGE
       */
      case 'jobs':
        return (
          <JobBoard
            onOpenApply={handleOpenApply}
          />
        );

      /*
       * BLOGS PAGE
       */
      case 'blogs':
        return <BlogSection />;

      /*
       * CONTACT PAGE
       */
      case 'contact':
        return <Contact />;

      /*
       * HOME PAGE
       */
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

    </div>
  );
}
