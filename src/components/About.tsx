import React from 'react';
import {
  Target,
  Compass,
  Sparkles,
  Award,
  Bot,
  Image as ImageIcon,
  LineChart,
  Search,
  Layers,
  Cpu,
} from 'lucide-react';

const aiTools = [
  {
    name: 'ChatGPT',
    icon: <Bot className="w-5 h-5 text-[#FF6B00]" />,
  },
  {
    name: 'Midjourney',
    icon: <ImageIcon className="w-5 h-5 text-[#FF6B00]" />,
  },
  {
    name: 'Google Analytics 4',
    icon: <LineChart className="w-5 h-5 text-[#FF6B00]" />,
  },
  {
    name: 'Semrush',
    icon: <Search className="w-5 h-5 text-[#FF6B00]" />,
  },
  {
    name: 'Meta Ads Manager',
    icon: <Layers className="w-5 h-5 text-[#FF6B00]" />,
  },
  {
    name: 'HubSpot',
    icon: <Cpu className="w-5 h-5 text-[#FF6B00]" />,
  },
];

export const About: React.FC = () => {
  return (
    <section
      id="about"
      className="py-16 lg:py-24 bg-[#F8FAFC] border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main About Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column */}
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
                    <div className="text-xs font-bold text-[#072B57]">
                      Centre for Business & Marketing (CBM)
                    </div>

                    <div className="text-[11px] text-slate-500">
                      Excellence in AI & Growth Education
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 text-center">

              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-base font-extrabold text-[#072B57]">
                  10+ Yrs
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  Legacy
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-base font-extrabold text-[#072B57]">
                  4,500+
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  Alumni
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-base font-extrabold text-[#072B57]">
                  500+
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  Hiring Cos
                </div>
              </div>

            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-7 space-y-6">

            <div className="space-y-3">

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#072B57] text-xs font-bold uppercase tracking-wider border border-blue-100">
                About CBM Academy
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#072B57] tracking-tight">
                Empowering the Next Generation of Marketers
              </h2>

              <p className="text-slate-600 text-base leading-relaxed">
                Premier training institute bridging academic learning and
                real-world performance marketing demands.
              </p>

            </div>

            {/* Mission, Vision, Why CBM */}
            <div className="space-y-3.5">

              {/* Mission */}
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">

                <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0 text-[#FF6B00] mt-0.5">
                  <Target className="w-5 h-5" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#072B57] mb-0.5">
                    Our Mission
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Deliver practical, AI-driven marketing education that
                    transforms learners into confident, hireable digital
                    leaders.
                  </p>
                </div>

              </div>

              {/* Vision */}
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">

                <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 text-[#072B57] mt-0.5">
                  <Compass className="w-5 h-5" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#072B57] mb-0.5">
                    Our Vision
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    To be India's most trusted outcome-oriented growth
                    academy, recognized for high-caliber analytical talent.
                  </p>
                </div>

              </div>

              {/* Why CBM Academy */}
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">

                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-600 mt-0.5">
                  <Sparkles className="w-5 h-5" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#072B57] mb-0.5">
                    Why CBM Academy?
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    25-student cohorts, 1-on-1 mentor guidance, live ad
                    budgets, and dedicated placement support.
                  </p>
                </div>

              </div>

            </div>

          </div>
        </div>

        {/* AI & Marketing Tools */}
        <div className="mt-16 lg:mt-20">

          <div className="text-center mb-8">

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#FF6B00] text-xs font-bold uppercase tracking-wider border border-orange-100">
              Tools We Teach
            </div>

            <h3 className="mt-3 text-2xl sm:text-3xl font-extrabold text-[#072B57]">
              AI & Marketing Tools
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Learn with industry-standard tools used by modern marketing teams.
            </p>

          </div>

          {/* Small Equal Tool Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">

            {aiTools.map((tool) => (
              <div
                key={tool.name}
                className="bg-white border border-slate-200 rounded-xl px-3 py-4 flex flex-col items-center justify-center text-center min-h-[105px] shadow-sm hover:border-orange-200 hover:-translate-y-0.5 transition-all duration-200"
              >

                <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center mb-2.5">
                  {tool.icon}
                </div>

                <span className="text-xs font-bold text-[#072B57] leading-tight">
                  {tool.name}
                </span>

              </div>
            ))}

          </div>

        </div>

      </div>
    </section>
  );
};
