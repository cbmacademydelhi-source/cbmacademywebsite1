import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { SMOOTH_EASE_OUT, VIEWPORT_ONCE } from '../lib/animations';

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  testimonial: string;
  rating: number;
  initials: string;
  image: string;
  cornerDeco: 'rings' | 'dots' | 'arc' | 'cross';
}

/**
 * EXACTLY 8 COMPACT TESTIMONIALS (4 cards × 2 rows on desktop)
 * Balanced student representation with clean, professional profile photos.
 */
export const SAMPLE_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'testimonial-ayesha-khan',
    name: 'Ayesha Khan',
    role: 'Digital Marketing Student',
    testimonial:
      '“CBM Academy made digital marketing much easier to understand. The practical projects helped me gain confidence in using real marketing tools.”',
    rating: 5,
    initials: 'AK',
    image:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop&crop=faces',
    cornerDeco: 'rings',
  },
  {
    id: 'testimonial-rahul-sharma',
    name: 'Rahul Sharma',
    role: 'Performance Marketing Student',
    testimonial:
      '“The hands-on learning approach and AI tools were really useful. I learned how to apply digital marketing concepts instead of only studying theory.”',
    rating: 5,
    initials: 'RS',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop&crop=faces',
    cornerDeco: 'dots',
  },
  {
    id: 'testimonial-simran-kapoor',
    name: 'Simran Kapoor',
    role: 'SEO & Content Marketing Student',
    testimonial:
      '“I especially liked the practical assignments and guidance. The course gave me a much clearer direction for building my career in digital marketing.”',
    rating: 5,
    initials: 'SK',
    image:
      'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=300&auto=format&fit=crop&crop=faces',
    cornerDeco: 'arc',
  },
  {
    id: 'testimonial-rohan-verma',
    name: 'Rohan Verma',
    role: 'Social Media Marketing Student',
    testimonial:
      '“Running live ad campaigns with dedicated mentorship helped me land an agency role right after finishing the course.”',
    rating: 5,
    initials: 'RV',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop&crop=faces',
    cornerDeco: 'cross',
  },
  {
    id: 'testimonial-amit-joshi',
    name: 'Amit Joshi',
    role: 'Google Ads & PPC Student',
    testimonial:
      '“The depth of analytics and ROI optimization covered here is outstanding. The trainers are always supportive.”',
    rating: 5,
    initials: 'AJ',
    image:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300&auto=format&fit=crop&crop=faces',
    cornerDeco: 'rings',
  },
  {
    id: 'testimonial-priya-patel',
    name: 'Priya Patel',
    role: 'E-Commerce Growth Student',
    testimonial:
      '“The course structure is super practical. Working with actual client budgets gave me real-world marketing experience.”',
    rating: 5,
    initials: 'PP',
    image:
      'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=300&auto=format&fit=crop&crop=faces',
    cornerDeco: 'dots',
  },
  {
    id: 'testimonial-vikram-malhotra',
    name: 'Vikram Malhotra',
    role: 'Digital Strategy Student',
    testimonial:
      '“From brand building to funnel optimization, CBM Academy covered everything needed to scale high-performing campaigns.”',
    rating: 5,
    initials: 'VM',
    image:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&auto=format&fit=crop&crop=faces',
    cornerDeco: 'cross',
  },
  {
    id: 'testimonial-neha-gupta',
    name: 'Neha Gupta',
    role: 'AI & Automation Marketer',
    testimonial:
      '“Learning to integrate modern AI tools into daily marketing workflows made a huge difference in my campaign efficiency.”',
    rating: 5,
    initials: 'NG',
    image:
      'https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?q=80&w=300&auto=format&fit=crop&crop=faces',
    cornerDeco: 'arc',
  },
];

/**
 * Minimal, elegant, very subtle decorative background accents inside cards.
 * Extremely low opacity (3-5%), positioned in corners behind text.
 */
const renderCardDeco = (type: TestimonialItem['cornerDeco']) => {
  switch (type) {
    case 'rings':
      return (
        <svg
          className="absolute -top-3 -right-3 w-20 h-20 pointer-events-none select-none text-[#072B57] opacity-[0.045]"
          viewBox="0 0 100 100"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="75" cy="25" r="28" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" />
          <circle cx="75" cy="25" r="48" stroke="currentColor" strokeWidth="1" />
        </svg>
      );
    case 'dots':
      return (
        <svg
          className="absolute -bottom-2 -right-2 w-16 h-16 pointer-events-none select-none text-[#FF6B00] opacity-[0.055]"
          viewBox="0 0 60 60"
          fill="none"
          aria-hidden="true"
        >
          {[0, 14, 28].map((x) =>
            [0, 14, 28].map((y) => (
              <circle key={`${x}-${y}`} cx={24 + x} cy={24 + y} r="1.6" fill="currentColor" />
            ))
          )}
        </svg>
      );
    case 'arc':
      return (
        <svg
          className="absolute -top-4 -right-4 w-20 h-20 pointer-events-none select-none text-[#072B57] opacity-[0.045]"
          viewBox="0 0 80 80"
          fill="none"
          aria-hidden="true"
        >
          <path d="M10 80 C 10 40, 40 10, 80 10" stroke="currentColor" strokeWidth="1.4" />
          <path d="M26 80 C 26 50, 50 26, 80 26" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
        </svg>
      );
    case 'cross':
    default:
      return (
        <svg
          className="absolute -bottom-2 -right-2 w-16 h-16 pointer-events-none select-none text-[#072B57] opacity-[0.045]"
          viewBox="0 0 60 60"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="36" cy="36" r="20" stroke="currentColor" strokeWidth="1" />
          <line x1="36" y1="12" x2="36" y2="60" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" />
          <line x1="12" y1="36" x2="60" y2="36" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" />
        </svg>
      );
  }
};

/**
 * Individual Testimonial Card with Student Image, Fallback, and Hover Animation
 */
const TestimonialCard: React.FC<{
  item: TestimonialItem;
  index: number;
  shouldReduceMotion: boolean | null;
}> = ({ item, index, shouldReduceMotion }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.article
      id={item.id}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT_ONCE}
      transition={{
        duration: 0.35,
        delay: shouldReduceMotion ? 0 : (index % 4) * 0.05 + Math.floor(index / 4) * 0.08,
        ease: SMOOTH_EASE_OUT,
      }}
      className="relative overflow-hidden bg-white rounded-[14px] border border-[#E5E7EB] p-5 flex flex-col justify-between shadow-[0_1px_4px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.05)] hover:-translate-y-[3px] transition-all duration-200 ease-out h-full min-h-[250px]"
    >
      {/* Subtle Decorative Background Inside Card */}
      {renderCardDeco(item.cornerDeco)}

      {/* TOP: 5 Orange Stars & Testimonial Quote */}
      <div className="relative z-10">
        {/* Five Orange Stars */}
        <div
          className="flex items-center gap-1 mb-2.5"
          aria-label={`${item.rating} out of 5 stars`}
        >
          {[...Array(item.rating)].map((_, i) => (
            <Star
              key={i}
              className="w-3.5 h-3.5 fill-[#FF6B00] text-[#FF6B00]"
              aria-hidden="true"
            />
          ))}
        </div>

        {/* Testimonial Quote */}
        <p className="text-[#1E293B] text-[13px] sm:text-[13.5px] leading-relaxed font-normal">
          {item.testimonial}
        </p>
      </div>

      {/* BOTTOM: Student Profile Photo + Name + Course/Role */}
      <div className="relative z-10 flex items-center gap-3 pt-3.5 mt-3 border-t border-[#F1F5F9]">
        {/* Circular Profile Image (48px) with subtle border & fallback */}
        <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-[#E5E7EB] bg-slate-100 shadow-xs">
          {!imgError ? (
            <img
              src={item.image}
              alt={item.name}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#072B57]/5 text-[#072B57] font-bold text-xs tracking-wide select-none">
              {item.initials}
            </div>
          )}
        </div>

        {/* Name & Role */}
        <div className="min-w-0">
          <h3 className="text-[#072B57] font-bold text-[14px] leading-snug truncate">
            {item.name}
          </h3>
          <p className="text-[#64748B] text-[11px] sm:text-xs leading-tight mt-0.5 truncate">
            {item.role}
          </p>
        </div>
      </div>
    </motion.article>
  );
};

export const Testimonials: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="testimonials"
      className="w-full bg-[#F8FAFC] py-[56px] sm:py-[60px] lg:py-[64px] border-b border-[#E5E7EB]"
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
        {/* SECTION HEADER */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: 0.4, ease: SMOOTH_EASE_OUT }}
          className="text-center max-w-2xl mx-auto mb-7 sm:mb-8"
        >
          {/* Small orange eyebrow text */}
          <p className="text-xs font-bold tracking-wider uppercase text-[#FF6B00]">
            WHAT OUR STUDENTS SAY
          </p>

          {/* Main heading */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#072B57] tracking-tight mt-1.5">
            Real Learning. Real Growth.
          </h2>

          {/* Short description */}
          <p className="text-xs sm:text-sm text-[#64748B] mt-2 leading-relaxed">
            Hear from learners who are building practical digital marketing skills with CBM Academy.
          </p>
        </motion.div>

        {/* 8 COMPACT TESTIMONIAL CARDS: 4 COLUMNS × 2 ROWS ON DESKTOP */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[18px] items-stretch">
          {SAMPLE_TESTIMONIALS.map((item, index) => (
            <TestimonialCard
              key={item.id}
              item={item}
              index={index}
              shouldReduceMotion={shouldReduceMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
