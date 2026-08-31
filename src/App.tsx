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
import { AIBot } from './components/AIBot';

import { MessageCircle } from 'lucide-react';

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

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/919211583150?text=Hi%20CBM%20Academy%2C%20I%20want%20to%20know%20more%20about%20your%20Digital%20Marketing%20course."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with CBM Academy on WhatsApp"
        className="fixed bottom-5 right-24 z-50 w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
      >
        <MessageCircle className="w-7 h-7" />
      </a>

      {/* Floating AI Assistant */}
      <AIBot />

    </div>
  );
}
