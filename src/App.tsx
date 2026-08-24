import React, { useState } from 'react';
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
  const [selectedCourseForApply, setSelectedCourseForApply] = useState<string | undefined>(undefined);
  const [brochureModalOpen, setBrochureModalOpen] = useState(false);

  const handleOpenApply = (courseOrJobTitle?: string) => {
    setSelectedCourseForApply(courseOrJobTitle || 'Master in AI-Powered Digital Marketing & Performance Growth');
    setApplyModalOpen(true);
  };

  const handleOpenBrochure = () => {
    setBrochureModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-[#1E293B] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col">
      {/* Top Header */}
      <Header
        onOpenApply={handleOpenApply}
        onOpenBrochure={handleOpenBrochure}
      />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* 1. Hero Section */}
        <Hero
          onOpenApply={() => handleOpenApply()}
          onOpenBrochure={handleOpenBrochure}
        />

        {/* 2. Why Choose CBM */}
        <WhyChooseCBM
          onOpenApply={() => handleOpenApply()}
        />

        {/* 3. Course Modules (8 Modern Static Cards) */}
        <CourseSection
          onOpenApply={handleOpenApply}
          onOpenBrochure={handleOpenBrochure}
        />

        {/* 4. AI Tools Minimal White-Card Grid */}
        <AITools />

        {/* 5. Job Opportunities Placement Portal */}
        <JobBoard
          onOpenApply={handleOpenApply}
        />

        {/* 6. Certificate Verification Portal */}
        <CertificateVerification />

        {/* 7. Blog & Resources */}
        <BlogSection />

        {/* 8. About CBM Academy */}
        <About />

        {/* 9. Contact Us & Campus Map */}
        <Contact />
      </main>

      {/* Footer */}
      <Footer
        onOpenApply={() => handleOpenApply()}
        onOpenBrochure={handleOpenBrochure}
      />

      {/* Real Apply Now Modal */}
      <ApplyModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        initialCourse={selectedCourseForApply}
      />

      {/* Download Syllabus Brochure Modal */}
      <BrochureModal
        isOpen={brochureModalOpen}
        onClose={() => setBrochureModalOpen(false)}
      />
    </div>
  );
}

