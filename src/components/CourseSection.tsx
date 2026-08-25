import React from 'react';
import { COURSE_MODULES } from '../data/cbmData';
import {
  Search,
  TrendingUp,
  Target,
  Sparkles,
  BarChart3,
  Share2,
  MailCheck,
  Briefcase,
  Layers,
} from 'lucide-react';

interface CourseSectionProps {
  onOpenApply: (courseName?: string) => void;
  onOpenBrochure: () => void;
}

const moduleIconMap: Record<string, React.ReactNode> = {
  Search: <Search className="w-6 h-6 text-[#FF6B00]" />,
  TrendingUp: <TrendingUp className="w-6 h-6 text-[#FF6B00]" />,
  Target: <Target className="w-6 h-6 text-[#FF6B00]" />,
  Sparkles: <Sparkles className="w-6 h-6 text-[#FF6B00]" />,
  BarChart3: <BarChart3 className="w-6 h-6 text-[#FF6B00]" />,
  Share2: <Share2 className="w-6 h-6 text-[#FF6B00]" />,
  MailCheck: <MailCheck className="w-6 h-6 text-[#FF6B00]" />,
  Briefcase: <Briefcase className="w-6 h-6 text-[#FF6B00]" />,
};

export const CourseSection: React.FC<CourseSectionProps> = () => {
  return (
    <section
      id="course"
      className="py-16 lg:py-24 bg-white border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#FF6B00] text-xs font-bold uppercase tracking-wider border border-orange-100">
            Master Curriculum
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#072B57] tracking-tight">
            AI-Powered Digital Marketing Curriculum
          </h2>

          <p className="text-slate-600 text-base leading-relaxed">
            Build practical digital marketing skills through focused,
            industry-relevant modules.
          </p>

        </div>

        {/* Course Modules */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {COURSE_MODULES.map((module) => (
            <div
              key={module.id}
              className="bg-white rounded-xl border border-slate-200 p-5 min-h-[220px] flex flex-col cbm-shadow cbm-shadow-hover transition-all duration-200 hover:border-[#FF6B00]/40 hover:-translate-y-1 group"
            >

              {/* Module Number + Icon */}
              <div className="flex items-center justify-between mb-5">

                <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  {moduleIconMap[module.iconName] || (
                    <Layers className="w-6 h-6 text-[#FF6B00]" />
                  )}
                </div>

                <span className="text-xs font-extrabold text-[#072B57] bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                  MODULE {String(module.number).padStart(2, '0')}
                </span>

              </div>

              {/* Module Name */}
              <h3 className="text-base sm:text-lg font-bold text-[#072B57] leading-snug mb-3">
                {module.title}
              </h3>

              {/* Short Module Details */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                {module.shortDescription}
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
};
