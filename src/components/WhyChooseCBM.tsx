import React from 'react';
import { Award, Laptop, FolderGit2, GraduationCap, CheckCircle } from 'lucide-react';
import { WHY_CHOOSE_CBM_CARDS } from '../data/cbmData';

const iconMap: Record<string, React.ReactNode> = {
  Award: <Award className="w-6 h-6 text-[#FF6B00]" />,
  Laptop: <Laptop className="w-6 h-6 text-[#FF6B00]" />,
  FolderGit2: <FolderGit2 className="w-6 h-6 text-[#FF6B00]" />,
  GraduationCap: <GraduationCap className="w-6 h-6 text-[#FF6B00]" />,
};

interface WhyChooseCBMProps {
  onOpenApply: () => void;
}

export const WhyChooseCBM: React.FC<WhyChooseCBMProps> = ({ onOpenApply }) => {
  return (
    <section id="why-cbm" className="py-16 lg:py-24 bg-[#F8FAFC] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#072B57] text-xs font-bold uppercase tracking-wider border border-blue-100">
            Why CBM Academy
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#072B57] tracking-tight">
            Built for High-Growth Careers
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Outcome-driven training with live ad budgets, modern AI tools, and direct placement support.
          </p>
        </div>

        {/* 4 Premium Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_CHOOSE_CBM_CARDS.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between cbm-shadow cbm-shadow-hover transition-all duration-200"
            >
              <div className="space-y-4">
                {/* Icon & Metric Badge */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                    {iconMap[card.iconName] || <Award className="w-6 h-6 text-[#FF6B00]" />}
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-[#072B57] block">{card.metric}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{card.metricLabel}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-[#072B57]">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-600 leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* Sub-feature check */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-700">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Verified Curriculum Standard</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner Strip */}
        <div className="mt-12 bg-[#072B57] rounded-xl p-6 sm:p-7 text-white flex flex-col md:flex-row items-center justify-between gap-5 shadow-lg">
          <div className="space-y-1 text-center md:text-left">
            <div className="text-lg font-bold text-white">
              Ready to accelerate your career?
            </div>
            <div className="text-sm text-slate-300">
              Schedule a free 1-on-1 career consultation with our senior mentors.
            </div>
          </div>
          <button
            onClick={onOpenApply}
            type="button"
            className="whitespace-nowrap bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-sm active:scale-98 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white"
          >
            Apply for Free Counseling
          </button>
        </div>

      </div>
    </section>
  );
};
