import React from 'react';
import { Target, Compass, Sparkles, CheckCircle2, Award, Users, Building } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-16 lg:py-24 bg-[#F8FAFC] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Authentic Institute Visual & Campus Infrastructure */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-white">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop"
                alt="CBM Academy Campus Mentorship and Collaborative Learning"
                referrerPolicy="no-referrer"
                className="w-full h-80 sm:h-96 object-cover"
              />
              
              {/* Overlay Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-slate-200 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-[#FF6B00]">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#072B57]">Centre for Business & Marketing (CBM)</div>
                    <div className="text-[11px] text-slate-500">Excellence in AI & Growth Education</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Small stats row */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-base font-extrabold text-[#072B57]">10+ Yrs</div>
                <div className="text-[10px] text-slate-500 font-medium">Legacy</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-base font-extrabold text-[#072B57]">4,500+</div>
                <div className="text-[10px] text-slate-500 font-medium">Alumni</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-base font-extrabold text-[#072B57]">500+</div>
                <div className="text-[10px] text-slate-500 font-medium">Hiring Cos</div>
              </div>
            </div>
          </div>

          {/* Right Column: Mission, Vision, Why CBM Academy */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#072B57] text-xs font-bold uppercase tracking-wider border border-blue-100">
                About CBM Academy
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#072B57] tracking-tight">
                Empowering the Next Generation of Marketers
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                Premier training institute bridging academic learning and real-world performance marketing demands.
              </p>
            </div>

            {/* Mission, Vision, Why CBM Stack */}
            <div className="space-y-3.5">
              
              {/* Mission */}
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0 text-[#FF6B00] mt-0.5">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#072B57] mb-0.5">Our Mission</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Deliver practical, AI-driven marketing education that transforms learners into confident, hireable digital leaders.
                  </p>
                </div>
              </div>

              {/* Vision */}
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 text-[#072B57] mt-0.5">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#072B57] mb-0.5">Our Vision</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    To be India's most trusted outcome-oriented growth academy, recognized for high-caliber analytical talent.
                  </p>
                </div>
              </div>

              {/* Why CBM Academy */}
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-600 mt-0.5">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#072B57] mb-0.5">Why CBM Academy?</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    25-student cohorts, 1-on-1 mentor guidance, live ad budgets, and dedicated placement support.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
