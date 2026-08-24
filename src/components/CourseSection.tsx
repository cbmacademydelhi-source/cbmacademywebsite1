import React, { useState } from 'react';
import { COURSE_MODULES } from '../data/cbmData';
import { CourseModule } from '../types';
import { 
  Search, 
  TrendingUp, 
  Target, 
  Sparkles, 
  BarChart3, 
  Share2, 
  MailCheck, 
  Briefcase, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  BookOpen, 
  X, 
  Download,
  Layers
} from 'lucide-react';

interface CourseSectionProps {
  onOpenApply: (courseName?: string) => void;
  onOpenBrochure: () => void;
}

const moduleIconMap: Record<string, React.ReactNode> = {
  Search: <Search className="w-5 h-5 text-[#FF6B00]" />,
  TrendingUp: <TrendingUp className="w-5 h-5 text-[#FF6B00]" />,
  Target: <Target className="w-5 h-5 text-[#FF6B00]" />,
  Sparkles: <Sparkles className="w-5 h-5 text-[#FF6B00]" />,
  BarChart3: <BarChart3 className="w-5 h-5 text-[#FF6B00]" />,
  Share2: <Share2 className="w-5 h-5 text-[#FF6B00]" />,
  MailCheck: <MailCheck className="w-5 h-5 text-[#FF6B00]" />,
  Briefcase: <Briefcase className="w-5 h-5 text-[#FF6B00]" />,
};

export const CourseSection: React.FC<CourseSectionProps> = ({ onOpenApply, onOpenBrochure }) => {
  const [selectedModule, setSelectedModule] = useState<CourseModule | null>(null);

  return (
    <section id="course" className="py-16 lg:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#FF6B00] text-xs font-bold uppercase tracking-wider border border-orange-100">
              Master Curriculum
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#072B57] tracking-tight">
              AI-Powered Digital Marketing Curriculum
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              8 comprehensive modules covering organic SEO, paid growth funnels, AI workflows, and data analytics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenBrochure}
              type="button"
              className="inline-flex items-center gap-2 bg-[#F8FAFC] hover:bg-slate-100 text-[#072B57] font-bold text-sm px-5 py-2.5 rounded-xl border border-slate-200 shadow-sm transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#FF6B00]" />
              <span>Full Syllabus PDF</span>
            </button>
          </div>
        </div>

        {/* 8 Modern Static Module Cards Grid (No Clumsy Accordions) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {COURSE_MODULES.map((module) => (
            <div
              key={module.id}
              className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between hover:border-slate-300 cbm-shadow cbm-shadow-hover transition-all duration-200 group"
            >
              <div>
                {/* Module Number & Icon Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {moduleIconMap[module.iconName] || <Layers className="w-5 h-5 text-[#FF6B00]" />}
                  </div>
                  <span className="text-xs font-extrabold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    MODULE {module.number}
                  </span>
                </div>

                {/* Module Title */}
                <h3 className="text-base font-bold text-[#072B57] line-clamp-2 min-h-[3rem]">
                  {module.title}
                </h3>

                {/* Short Syllabus Overview */}
                <p className="text-xs text-slate-600 mt-2 mb-4 line-clamp-3 leading-relaxed">
                  {module.shortDescription}
                </p>

                {/* Key Syllabus Bullet Points */}
                <div className="space-y-1.5 my-3 pt-3 border-t border-slate-100">
                  {module.syllabus.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6B00] flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Tools Covered Badges */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {module.tools.slice(0, 3).map((tool, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium bg-[#F8FAFC] text-slate-600 px-2 py-0.5 rounded border border-slate-200"
                    >
                      {tool}
                    </span>
                  ))}
                  {module.tools.length > 3 && (
                    <span className="text-[10px] font-semibold text-[#FF6B00] bg-orange-50 px-1.5 py-0.5 rounded">
                      +{module.tools.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Card Action: Learn More Button & Duration */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{module.duration.split(' ')[0]} {module.duration.split(' ')[1]}</span>
                </div>

                <button
                  onClick={() => setSelectedModule(module)}
                  type="button"
                  id={`learn-more-module-${module.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#FF6B00] hover:text-[#072B57] transition-colors p-1"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Global Enrollment CTA Strip */}
        <div className="mt-12 text-center bg-[#F8FAFC] border border-slate-200 rounded-xl p-6 sm:p-7">
          <h3 className="text-lg font-bold text-[#072B57]">
            Ready to enroll in the Full Digital Marketing Specialization?
          </h3>
          <p className="text-sm text-slate-600 mt-1 max-w-xl mx-auto">
            Includes all 8 modules, 15+ live industry projects, resume reviews, and placement assistance.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onOpenApply('Full AI Digital Marketing Specialization')}
              type="button"
              className="bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              Apply for Full Course
            </button>
            <button
              onClick={onOpenBrochure}
              type="button"
              className="bg-white hover:bg-slate-50 text-[#072B57] font-bold text-sm px-5 py-3 rounded-xl border border-slate-200 transition-all shadow-sm"
            >
              Download Syllabus
            </button>
          </div>
        </div>

      </div>

      {/* Learn More Module Details Modal */}
      {selectedModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedModule(null)}
              type="button"
              className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                {moduleIconMap[selectedModule.iconName] || <BookOpen className="w-6 h-6 text-[#FF6B00]" />}
              </div>
              <div>
                <span className="text-xs font-bold text-[#FF6B00] uppercase tracking-wider block">
                  MODULE {selectedModule.number} &bull; {selectedModule.duration}
                </span>
                <h3 className="text-xl font-bold text-[#072B57]">
                  {selectedModule.title}
                </h3>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              {selectedModule.shortDescription}
            </p>

            {/* Detailed Syllabus List */}
            <div className="space-y-4 mb-6">
              <h4 className="text-xs font-bold text-[#072B57] uppercase tracking-wider">
                Detailed Learning Outcomes:
              </h4>
              <div className="space-y-2.5 bg-[#F8FAFC] p-4 rounded-xl border border-slate-200">
                {selectedModule.syllabus.map((topic, index) => (
                  <div key={index} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="leading-snug">{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Capstone Project */}
            <div className="mb-6 bg-blue-50/60 p-4 rounded-xl border border-blue-100">
              <span className="text-xs font-bold text-[#072B57] uppercase tracking-wider block mb-1">
                Practical Capstone Project:
              </span>
              <p className="text-xs text-slate-700 font-medium">
                {selectedModule.liveProjects}
              </p>
            </div>

            {/* Tools Grid */}
            <div className="mb-6">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Tools Mastered:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedModule.tools.map((t, i) => (
                  <span key={i} className="text-xs font-semibold bg-white border border-slate-200 text-[#072B57] px-2.5 py-1 rounded-lg">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  const courseName = selectedModule.title;
                  setSelectedModule(null);
                  onOpenApply(courseName);
                }}
                type="button"
                className="w-full sm:flex-1 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold text-sm py-3 rounded-xl transition-all shadow-sm"
              >
                Enroll in this Module
              </button>
              <button
                onClick={() => setSelectedModule(null)}
                type="button"
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
