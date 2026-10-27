import React from 'react';
import {
  BookOpen,
  CalendarDays,
  Cpu,
  Users,
  Briefcase,
} from 'lucide-react';

interface HowWeTeachSectionProps {
  onExploreMethod?: () => void;
}

interface TimelineItem {
  id: string;
  step: string;
  title: string;
  description: string;
  icon: React.ElementType;
  iconBg: 'orange' | 'blue';
  thumbnailUrl: string;
  thumbnailAlt: string;
}

const TIMELINE_STEPS: TimelineItem[] = [
  {
    id: 'step-1',
    step: '01',
    title: 'Four-Month Enhanced Course',
    description:
      'Master digital marketing through structured modules, hands-on assignments, and practical projects.',
    icon: BookOpen,
    iconBg: 'orange',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=320&q=80',
    thumbnailAlt: 'Course curriculum modules and structured assignments',
  },
  {
    id: 'step-2',
    step: '02',
    title: 'Alternate-Day Classes',
    description:
      'Attend classes on alternate days to get enough time to practise, complete assignments, and apply what you learn.',
    icon: CalendarDays,
    iconBg: 'blue',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=320&q=80',
    thumbnailAlt: 'Alternate day schedule planner for deliberate practice',
  },
  {
    id: 'step-3',
    step: '03',
    title: 'AI-Integrated Workflows',
    description:
      'Learn to use AI tools to improve productivity, simplify tasks, and build smarter marketing workflows.',
    icon: Cpu,
    iconBg: 'orange',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=320&q=80',
    thumbnailAlt: 'AI marketing workflows and performance dashboards',
  },
  {
    id: 'step-4',
    step: '04',
    title: 'Small, Focused Batches',
    description:
      'Learn in small groups with more opportunities to interact, ask questions, and receive individual attention.',
    icon: Users,
    iconBg: 'blue',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=320&q=80',
    thumbnailAlt: 'Interactive focused batch learning and mentoring',
  },
  {
    id: 'step-5',
    step: '05',
    title: 'Beyond Digital Marketing',
    description:
      'Attend extra sessions on sales, communication, and planning to develop skills that matter in real workplaces and business.',
    icon: Briefcase,
    iconBg: 'orange',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=320&q=80',
    thumbnailAlt: 'Sales, executive communication and business skills mentoring',
  },
];

export const HowWeTeachSection: React.FC<HowWeTeachSectionProps> = () => {

  return (
    <section
      id="teaching-method"
      aria-label="HOW YOU’LL LEARN"
      className="relative bg-white text-[#172E59] py-16 sm:py-20 lg:py-28 overflow-hidden border-t border-b border-slate-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          {/* LEFT COLUMN: ~48% width */}
          <div className="w-full lg:w-[48%] shrink-0">
            {/* 1. Section Label */}
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#F4772B]"></span>
              <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[#F4772B]">
              Learn Skills. Build Projects. Grow Your Career.
              </span>
            </div>

            {/* 2. Main heading */}
            <div className="relative mb-5">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.12]">
                <span className="block text-[#172E59]">.</span>
                <span className="block text-[#F4772B]">.</span>
              </h2>

              {/* Small handwritten-style annotation near headline */}
              <div className="mt-3.5 inline-flex items-center gap-2">
                <span className="font-['Caveat',cursive] text-lg sm:text-xl font-bold text-[#172E59] tracking-wide transform -rotate-1 select-none">
                  Practical. AI-Powered. Career Focused.
                </span>
                <svg
                  className="w-16 h-2 text-[#F4772B] hidden sm:inline-block"
                  viewBox="0 0 80 8"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M1 5.5C24 2 56 2 79 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* 3. Description (Unchanged) */}
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl mb-8">
              Learn digital marketing through practical experience, AI-powered tools, and self-learning techniques that help you adapt to industry changes independently.
            </p>

            {/* 4. Large, authentic classroom photograph with asymmetrical frame */}
            <div className="relative rounded-3xl rounded-tl-xl overflow-hidden shadow-xl border border-slate-100 bg-slate-900 aspect-[4/3] sm:aspect-[16/11]">
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80"
                alt="CBM Academy trainer mentoring students in a hands-on digital marketing and AI session"
                className="w-full h-full object-cover object-center filter saturate-[1.05] contrast-[1.02]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#172E59]/80 via-transparent to-transparent pointer-events-none" />

              {/* Subtle dark translucent label near bottom-left of the image */}
              <div className="absolute bottom-4 left-4 sm:bottom-5 sm:left-5 right-4 sm:right-auto bg-[#172E59]/85 backdrop-blur-md text-white px-4 py-2.5 rounded-xl border border-white/15 shadow-xl flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#F4772B] shrink-0"></span>
                <p className="text-xs sm:text-sm font-semibold tracking-wide text-white">
                  Learn from Real Campaigns, Not Just Slides.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ~52% width */}
          <div className="w-full lg:w-[52%] flex-1 relative flex flex-col justify-between pt-2 lg:pt-3">
            {/* Vertical numbered learning timeline with five rows (no separate floating cards) */}
            <div className="relative z-10">
              {/* Subtle vertical connecting line */}
              <div
                aria-hidden="true"
                className="absolute left-[19px] sm:left-[21px] top-6 bottom-8 w-[1.5px] bg-slate-200 -z-0"
              />

              <div className="space-y-0">
                {TIMELINE_STEPS.map((item, index) => {
                  const Icon = item.icon;
                  const isOrange = item.iconBg === 'orange';
                  const isLast = index === TIMELINE_STEPS.length - 1;

                  return (
                    <div
                      key={item.id}
                      className={`relative flex items-start gap-3.5 sm:gap-4.5 py-5 sm:py-6 ${
                        !isLast ? 'border-b border-slate-200/80' : ''
                      }`}
                    >
                      {/* Circular numbered marker */}
                      <div className="relative shrink-0 z-10 mt-0.5">
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white border-2 border-[#F4772B] text-[#F4772B] font-bold text-xs sm:text-sm flex items-center justify-center shadow-sm">
                          {item.step}
                        </div>
                      </div>

                      {/* Content block: icon + title + description */}
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="flex items-center gap-2 mb-1.5">
                          {/* Alternating subtle warm-orange and pale-blue icon backgrounds */}
                          <span
                            className={`p-1.5 rounded-md inline-flex items-center justify-center shrink-0 ${
                              isOrange
                                ? 'bg-[#F4772B]/10 text-[#F4772B]'
                                : 'bg-[#172E59]/10 text-[#172E59]'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </span>
                          <h3 className="text-base sm:text-lg font-bold text-[#172E59] tracking-tight">
                            {item.title}
                          </h3>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md">
                          {item.description}
                        </p>
                      </div>

                      {/* Small relevant rectangular thumbnail aligned to the far right */}
                      <div className="shrink-0 self-center">
                        <img
                          src={item.thumbnailUrl}
                          alt={item.thumbnailAlt}
                          className="w-16 h-12 sm:w-22 sm:h-16 rounded-lg object-cover shadow-xs border border-slate-200/70"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
