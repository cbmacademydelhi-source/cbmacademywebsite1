import React, { useEffect } from 'react';
import {
  Target,
  Compass,
  Award,
  BookOpen,
  Laptop,
  Cpu,
  TrendingUp,
  Users,
  Briefcase,
  Layers,
  Building2,
  ArrowRight,
  MapPin,
  Sparkles,
  Search,
  Megaphone,
  Share2,
  BarChart3,
  PenTool,
  CheckCircle,
} from 'lucide-react';

export const About: React.FC = () => {
  // Dynamic SEO metadata for About page
  useEffect(() => {
    const prevTitle = document.title;
    document.title =
      'Best Digital Marketing Academy in Okhla, New Delhi | About CBM Academy';

    const metaDescription = document.querySelector('meta[name="description"]');
    const prevDescription = metaDescription?.getAttribute('content') || '';
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Learn about CBM Academy, a practical digital marketing academy and agency in Okhla, New Delhi focused on digital marketing, AI, SEO, advertising and career-ready skills.'
      );
    }

    return () => {
      document.title = prevTitle;
      if (metaDescription && prevDescription) {
        metaDescription.setAttribute('content', prevDescription);
      }
    };
  }, []);

  const whatWeTeachItems = [
    {
      title: 'SEO',
      desc: 'Rank on search engines and drive organic traffic.',
      icon: <Search className="w-5 h-5 text-[#FF6B00]" />,
      bg: 'bg-orange-50 border-orange-100',
    },
    {
      title: 'Google Ads',
      desc: 'Master search, display and high-intent PPC campaigns.',
      icon: <Target className="w-5 h-5 text-[#072B57]" />,
      bg: 'bg-blue-50 border-blue-100',
    },
    {
      title: 'Meta Ads',
      desc: 'Scale high-converting campaigns on Facebook and Instagram.',
      icon: <Megaphone className="w-5 h-5 text-indigo-600" />,
      bg: 'bg-indigo-50 border-indigo-100',
    },
    {
      title: 'Social Media',
      desc: 'Build engaged communities and organic viral reach.',
      icon: <Share2 className="w-5 h-5 text-pink-600" />,
      bg: 'bg-pink-50 border-pink-100',
    },
    {
      title: 'Performance Marketing',
      desc: 'Optimize ROAS, media spend and conversion funnels.',
      icon: <TrendingUp className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50 border-emerald-100',
    },
    {
      title: 'Analytics & GA4',
      desc: 'Track conversions, user journeys and data attribution.',
      icon: <BarChart3 className="w-5 h-5 text-blue-600" />,
      bg: 'bg-cyan-50 border-cyan-100',
    },
    {
      title: 'Content Marketing',
      desc: 'Craft strategic copy that converts readers into buyers.',
      icon: <PenTool className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50 border-amber-100',
    },
    {
      title: 'AI Marketing',
      desc: 'Automate research, creative workflows and campaign optimization.',
      icon: <Cpu className="w-5 h-5 text-purple-600" />,
      bg: 'bg-purple-50 border-purple-100',
    },
  ];

  const whoCanLearn = [
    {
      title: 'Students & Freshers',
      description:
        'Build practical skills for internships and entry-level opportunities.',
      icon: <Users className="w-5 h-5 text-[#FF6B00]" />,
      bg: 'bg-orange-50 border-orange-100',
    },
    {
      title: 'Professionals',
      description: 'Upgrade your digital and AI skills.',
      icon: <Briefcase className="w-5 h-5 text-[#072B57]" />,
      bg: 'bg-blue-50 border-blue-100',
    },
    {
      title: 'Freelancers',
      description:
        'Develop skills for digital marketing projects and clients.',
      icon: <Laptop className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50 border-emerald-100',
    },
    {
      title: 'Business Owners',
      description: 'Learn strategies for online growth.',
      icon: <TrendingUp className="w-5 h-5 text-purple-600" />,
      bg: 'bg-purple-50 border-purple-100',
    },
  ];

  const whyChooseItems = [
    {
      title: 'Practical Projects',
      description: 'Learn through real-world exercises.',
      icon: <Layers className="w-5 h-5 text-[#FF6B00]" />,
      bg: 'bg-orange-50 border-orange-100',
    },
    {
      title: 'Industry Tools',
      description: 'Practice with modern marketing tools.',
      icon: <Laptop className="w-5 h-5 text-[#072B57]" />,
      bg: 'bg-blue-50 border-blue-100',
    },
    {
      title: 'AI-Integrated Learning',
      description: 'Use AI across digital marketing workflows.',
      icon: <Cpu className="w-5 h-5 text-purple-600" />,
      bg: 'bg-purple-50 border-purple-100',
    },
    {
      title: 'Career Guidance',
      description: 'Build professional and career-ready skills.',
      icon: <Sparkles className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50 border-emerald-100',
    },
  ];

  return (
    <div
      id="about-page-root"
      className="min-h-screen bg-[#FAFAFA] pt-8 sm:pt-12 pb-24 sm:pb-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">
        {/* =========================================================
            1. ABOUT HERO SECTION
            ========================================================= */}
        <section
          id="about-hero"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
        >
          {/* Left Hero Image */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-white group">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop"
                alt="Students learning digital marketing on laptops at CBM Academy in Okhla"
                referrerPolicy="no-referrer"
                className="w-full h-80 sm:h-[380px] object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#072B57]/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-slate-200 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-[#FF6B00] shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#072B57]">
                      Centre for Business & Marketing (CBM)
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Practical Digital Marketing &bull; Okhla, New Delhi
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <div className="text-base font-extrabold text-[#072B57]">
                  10+ Yrs
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  Legacy
                </div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <div className="text-base font-extrabold text-[#072B57]">
                  4,500+
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  Alumni
                </div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <div className="text-base font-extrabold text-[#072B57]">
                  500+
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  Hiring Cos
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Info */}
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#FF6B00] text-xs font-extrabold uppercase tracking-wider border border-orange-200">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>ABOUT CBM ACADEMY</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#072B57] tracking-tight leading-[1.15]">
              About CBM Academy
            </h1>

            <h2 className="text-lg sm:text-xl font-bold text-[#FF6B00]">
              A Practical Digital Marketing Academy in Okhla, New Delhi
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Build practical digital marketing and AI skills through projects,
              industry tools and real-world learning.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href="#course"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6B00] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-[#e05f00] cursor-pointer shadow-md hover:shadow-lg active:scale-98"
              >
                <span>Explore Our Courses</span>
                <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#072B57] border border-slate-200 hover:border-slate-300 transition-colors shadow-xs cursor-pointer"
              >
                <span>Get in Touch</span>
              </a>
            </div>
          </div>
        </section>

        {/* =========================================================
            2. OUR STORY SECTION
            ========================================================= */}
        <section
          id="our-story"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
        >
          {/* Left: Classroom / Training Image */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md group">
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop"
                alt="Digital marketing training classroom and mentor teaching students"
                referrerPolicy="no-referrer"
                className="w-full h-72 sm:h-84 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 bg-[#072B57]/90 text-white text-[11px] font-bold px-3 py-1 rounded-lg backdrop-blur-xs">
                Mentor-Led Sessions
              </div>
            </div>
          </div>

          {/* Right: Concise Content */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-3.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#072B57] text-xs font-extrabold uppercase tracking-wider border border-blue-100">
              OUR STORY
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[#072B57] tracking-tight">
              Building Skills for the Digital Future
            </h2>

            <p className="text-slate-700 text-sm sm:text-base font-semibold leading-relaxed">
              CBM Academy makes digital marketing learning practical, relevant
              and career-focused.
            </p>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Learn SEO, advertising, social media, analytics and AI through
              practical projects and modern marketing tools.
            </p>
          </div>
        </section>

        {/* =========================================================
            3. WHO WE ARE SECTION
            ========================================================= */}
        <section
          id="who-we-are"
          className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visual */}
            <div className="lg:col-span-5">
              <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-xs">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop"
                  alt="Team collaboration and practical digital marketing learning"
                  referrerPolicy="no-referrer"
                  className="w-full h-64 sm:h-72 object-cover"
                />
              </div>
            </div>

            {/* Info + 3 short points */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#072B57] tracking-tight">
                  Who We Are
                </h2>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-600">
                  A digital marketing academy and marketing services platform
                  based in Okhla, New Delhi.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#072B57] mb-1">
                    <CheckCircle className="w-3.5 h-3.5 text-[#FF6B00]" />
                    <span>Practical Learning</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Learn through projects and real-world marketing scenarios.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#072B57] mb-1">
                    <CheckCircle className="w-3.5 h-3.5 text-[#072B57]" />
                    <span>Industry Tools</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Work with modern digital marketing, analytics and AI tools.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#072B57] mb-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Career Focus</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Build skills for professional growth, freelancing and
                    business.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            4. OUR MISSION + OUR VISION
            ========================================================= */}
        <section id="mission-vision" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Mission */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4 hover:border-[#FF6B00]/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF6B00] shrink-0 mt-0.5">
              <Target className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="text-[11px] font-extrabold text-[#FF6B00] uppercase tracking-wider">
                OUR MISSION
              </div>
              <h3 className="text-lg font-bold text-[#072B57]">
                Make Learning Practical
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Help learners build practical digital marketing skills they can
                apply in real-world situations.
              </p>
            </div>
          </div>

          {/* Card 2: Vision */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4 hover:border-[#072B57]/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#072B57] shrink-0 mt-0.5">
              <Compass className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="text-[11px] font-extrabold text-[#072B57] uppercase tracking-wider">
                OUR VISION
              </div>
              <h3 className="text-lg font-bold text-[#072B57]">
                Prepare Marketers for Tomorrow
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Combine digital marketing, technology and AI to prepare learners
                for the changing digital industry.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================
            5. WHAT WE TEACH (Clean Visual Grid)
            ========================================================= */}
        <section id="what-we-teach" className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="max-w-2xl mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#FF6B00] text-xs font-extrabold uppercase tracking-wider border border-orange-200 mb-2">
              WHAT WE TEACH
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#072B57] tracking-tight">
              Core Digital Marketing Skills
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Learn the skills used across modern digital marketing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {whatWeTeachItems.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-[#FF6B00]/40 transition-all shadow-2xs"
              >
                <div
                  className={`w-9 h-9 rounded-lg border flex items-center justify-center mb-2.5 ${item.bg}`}
                >
                  {item.icon}
                </div>
                <h3 className="text-sm font-bold text-[#072B57] mb-0.5">
                  {item.title}
                </h3>
                <p className="text-[11px] text-slate-500 leading-snug">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================
            6. PRACTICAL LEARNING SECTION (Learn by Doing)
            ========================================================= */}
        <section
          id="learn-by-doing"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
        >
          {/* Left: Large Image */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md group">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop"
                alt="Students collaborating on digital marketing strategy and project execution"
                referrerPolicy="no-referrer"
                className="w-full h-72 sm:h-88 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-3 right-3 bg-white/90 text-[#072B57] text-[11px] font-bold px-3 py-1 rounded-lg backdrop-blur-xs shadow-xs">
                Real Projects &bull; Live Campaigns
              </div>
            </div>
          </div>

          {/* Right: Info & 3 Highlights */}
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#072B57] text-xs font-extrabold uppercase tracking-wider border border-blue-100">
              OUR APPROACH
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[#072B57] tracking-tight">
              Learn by Doing
            </h2>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Go beyond theory with practical assignments, campaign exercises,
              AI workflows and real-world marketing scenarios.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-white border border-slate-200 text-center shadow-xs">
                <div className="text-sm font-bold text-[#FF6B00]">Projects</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Hands-on marketing tasks.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 text-center shadow-xs">
                <div className="text-sm font-bold text-[#072B57]">Tools</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Practice with platforms.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 text-center shadow-xs">
                <div className="text-sm font-bold text-purple-600">AI</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Modern AI workflows.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            7. AI + DIGITAL MARKETING SECTION
            ========================================================= */}
        <section
          id="ai-marketing"
          className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Info */}
            <div className="lg:col-span-6 space-y-3.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-extrabold uppercase tracking-wider border border-purple-100">
                <Cpu className="w-3.5 h-3.5 text-purple-600" />
                <span>AI + DIGITAL MARKETING</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-[#072B57] tracking-tight">
                Digital Marketing Meets AI
              </h2>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Learn how AI can support SEO, content, advertising, analytics,
                research and marketing automation.
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-[11px] font-semibold bg-purple-50 text-purple-700 px-3 py-1 rounded-lg border border-purple-100">
                  AI Copywriting
                </span>
                <span className="text-[11px] font-semibold bg-purple-50 text-purple-700 px-3 py-1 rounded-lg border border-purple-100">
                  Automated Reporting
                </span>
                <span className="text-[11px] font-semibold bg-purple-50 text-purple-700 px-3 py-1 rounded-lg border border-purple-100">
                  Audience Targeting
                </span>
              </div>
            </div>

            {/* Right Large AI Image */}
            <div className="lg:col-span-6">
              <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-md group">
                <img
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop"
                  alt="Modern AI, data visualization and digital marketing automation"
                  referrerPolicy="no-referrer"
                  className="w-full h-64 sm:h-72 object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            8. WHO CAN LEARN WITH US
            ========================================================= */}
        <section id="who-can-learn">
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-[#072B57] tracking-tight">
              Who Is CBM Academy For?
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Practical learning paths designed for diverse career and business
              goals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {whoCanLearn.map((item, index) => (
              <div
                key={index}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#FF6B00]/40 transition-colors flex flex-col justify-start"
              >
                <div
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-3 ${item.bg}`}
                >
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-[#072B57] mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================
            9. WHY CBM ACADEMY
            ========================================================= */}
        <section id="why-cbm-about">
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#FF6B00] text-xs font-extrabold uppercase tracking-wider border border-orange-200 mb-2">
              WHY CBM ACADEMY
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#072B57] tracking-tight">
              Why Learn With Us?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {whyChooseItems.map((item, index) => (
              <div
                key={index}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#FF6B00]/40 transition-colors flex flex-col justify-start"
              >
                <div
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-3 ${item.bg}`}
                >
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-[#072B57] mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================
            10. DIGITAL MARKETING SERVICES (Visual Split)
            ========================================================= */}
        <section
          id="digital-marketing-services"
          className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Image */}
            <div className="lg:col-span-5">
              <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-xs group">
                <img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop"
                  alt="Digital marketing analytics, charts and agency services"
                  referrerPolicy="no-referrer"
                  className="w-full h-60 sm:h-68 object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Right Info */}
            <div className="lg:col-span-7 space-y-3.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#072B57] text-xs font-extrabold uppercase tracking-wider border border-blue-100">
                <Building2 className="w-3.5 h-3.5 text-[#072B57]" />
                <span>DIGITAL MARKETING SERVICES</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-[#072B57] tracking-tight">
                Digital Marketing Agency in Okhla, New Delhi
              </h2>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                We also help businesses grow online through SEO, Google Ads,
                Meta Ads, social media, analytics and AI-powered marketing.
              </p>

              <div className="pt-1">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#072B57] px-6 py-3 text-xs sm:text-sm font-bold text-white transition-all hover:bg-[#0c3c78] cursor-pointer shadow-md active:scale-98"
                >
                  <span>Explore Digital Marketing Services</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            11. LOCAL PRESENCE SECTION (With Location Image)
            ========================================================= */}
        <section
          id="local-presence"
          className="rounded-2xl bg-orange-50/70 border border-orange-200/80 p-6 sm:p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-2">
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#FF6B00] uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-[#FF6B00]" />
                <span>LOCAL CAMPUS & COMMUNITY</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-[#072B57] tracking-tight">
                Best Digital Marketing Academy in Okhla, New Delhi
              </h2>

              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                Practical digital marketing education for students,
                professionals and businesses in Okhla, Jamia Nagar, South Delhi
                and nearby areas.
              </p>
            </div>

            <div className="md:col-span-4">
              <div className="rounded-xl overflow-hidden border border-orange-200 shadow-xs">
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop"
                  alt="CBM Academy modern campus workspace in Okhla New Delhi"
                  referrerPolicy="no-referrer"
                  className="w-full h-36 sm:h-40 object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            12. FINAL CTA
            ========================================================= */}
        <section className="rounded-2xl bg-[#072B57] p-8 sm:p-10 text-white text-center shadow-lg relative overflow-hidden">
          <div className="max-w-2xl mx-auto relative z-10 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Start Your Digital Marketing Journey
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Build practical skills in digital marketing, SEO, performance
              marketing, social media, analytics and AI.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="#course"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6B00] px-6 py-3 text-xs sm:text-sm font-bold text-white transition-all hover:bg-[#e05f00] cursor-pointer shadow-md active:scale-98"
              >
                <span>Explore Courses</span>
                <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href="#contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3 text-xs sm:text-sm font-bold text-white transition-colors cursor-pointer"
              >
                <span>Contact Us</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
