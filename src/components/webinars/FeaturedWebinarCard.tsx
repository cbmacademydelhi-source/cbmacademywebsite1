import React from 'react';
import { Calendar, Clock, Timer, User, ArrowRight, CheckCircle2, Video, Sparkles } from 'lucide-react';
import { Webinar } from '../../types';

interface FeaturedWebinarCardProps {
  webinar: Webinar;
  onSelect: (webinar: Webinar) => void;
  onRegister: (webinar: Webinar) => void;
}

function parseDateBadge(dateStr: string) {
  const parts = dateStr.trim().split(' ');
  if (parts.length >= 3) {
    return {
      day: parts[0],
      month: parts[1].slice(0, 3).toUpperCase(),
      year: parts[2],
    };
  }
  return { day: 'LIVE', month: 'SESSION', year: '' };
}

export const FeaturedWebinarCard: React.FC<FeaturedWebinarCardProps> = ({
  webinar,
  onSelect,
  onRegister,
}) => {
  const rawPrice = webinar.price;
  const numPrice = typeof rawPrice === 'number'
    ? rawPrice
    : Number(String(rawPrice || '').replace(/[^0-9.]/g, ''));
  const isPaid = (typeof rawPrice === 'number' && rawPrice > 0) ||
    (!isNaN(numPrice) && numPrice > 0) ||
    webinar.type === 'paid';
  const priceValue = typeof rawPrice === 'number' && rawPrice > 0
    ? rawPrice
    : !isNaN(numPrice) && numPrice > 0
    ? numPrice
    : 499;
  const isFree = !isPaid;
  const priceDisplay = isFree ? 'FREE' : `₹${priceValue}`;

  const dateParts = parseDateBadge(webinar.date);

  return (
    <article
      id={`featured-webinar-${webinar.id}`}
      onClick={() => onSelect(webinar)}
      className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[#FED7AA]/80 bg-white shadow-sm transition-all duration-300 hover:border-[#FF6B00]/60 hover:shadow-xl hover:shadow-[#072B57]/6 cursor-pointer"
    >
      {/* Featured Accent Strip */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF6B00] via-[#FFA450] to-[#072B57]" />

      <div className="flex flex-col sm:flex-row items-stretch">
        {/* Left: Photo / Poster (Photo strictly on Left) */}
        <div className="relative w-full sm:w-[320px] md:w-[380px] lg:w-[420px] shrink-0 bg-[#072B57] overflow-hidden flex items-center justify-center min-h-[220px] sm:min-h-full">
          <img
            src={
              webinar.posterUrl ||
              'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80'
            }
            alt={webinar.title ? `${webinar.title} - CBM Academy Digital Marketing Webinar` : 'CBM Academy Digital Marketing Webinar in Okhla'}
            title={webinar.title || 'CBM Academy Digital Marketing Webinar'}
            width={1200}
            height={675}
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            referrerPolicy="no-referrer"
            loading="lazy"
          />

          {/* Vignette gradient for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#072B57]/85 via-transparent to-black/20 pointer-events-none" />

          {/* Calendar Badge (Website Colors: Warm White, Navy Day, Orange Month) */}
          <div className="absolute top-4 left-4 flex flex-col items-center justify-center rounded-xl bg-white/95 px-3 py-2 shadow-md border border-[#FED7AA] backdrop-blur-xs pointer-events-none">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#FF6B00]">
              {dateParts.month}
            </span>
            <span className="text-xl font-black text-[#072B57] leading-none">
              {dateParts.day}
            </span>
          </div>

          {/* Format indicator on image */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white pointer-events-none">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#072B57]/90 backdrop-blur-md px-2.5 py-1 text-xs font-semibold text-slate-100 border border-white/15 shadow-sm">
              <Video className="h-3.5 w-3.5 text-[#FF6B00]" />
              Live Interactive
            </span>

            {isFree ? (
              <span className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-xs">
                FREE
              </span>
            ) : (
              <span className="rounded-lg bg-[#FF6B00] px-3 py-1 text-xs font-bold text-white shadow-xs">
                PAID • {priceDisplay}
              </span>
            )}
          </div>
        </div>

        {/* Right: Details (Details on Right) */}
        <div className="flex-1 p-6 sm:p-7 lg:p-8 flex flex-col justify-between">
          <div>
            {/* Website Color Accent Tag */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium mb-2.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#FFF5EC] text-[#FF6B00] font-bold uppercase tracking-wider text-[11px] border border-[#FED7AA]">
                <Sparkles className="h-3 w-3" />
                Featured Masterclass
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="font-semibold text-slate-600">CBM Academy Faculty</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="font-semibold text-slate-600">Live Q&amp;A Included</span>
            </div>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl lg:text-[26px] font-black text-[#072B57] leading-snug tracking-tight group-hover:text-[#FF6B00] transition-colors">
              {webinar.title}
            </h2>

            {/* Description */}
            <p className="mt-2.5 text-sm sm:text-base text-slate-600 leading-relaxed">
              {webinar.description}
            </p>

            {/* Date, Time, Duration & Host strip */}
            <div className="mt-4 pt-3.5 border-t border-orange-100 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs sm:text-sm text-slate-700">
              <div className="flex items-center gap-1.5 font-medium">
                <Calendar className="h-4 w-4 text-[#FF6B00] shrink-0" />
                <span className="font-semibold text-[#072B57]">{webinar.date}</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Clock className="h-4 w-4 text-[#FF6B00] shrink-0" />
                <span>{webinar.time} IST</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Timer className="h-4 w-4 text-[#FF6B00] shrink-0" />
                <span>{webinar.duration || '60 Mins'}</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <User className="h-4 w-4 text-[#FF6B00] shrink-0" />
                <span>{webinar.host || 'CBM Academy'}</span>
              </div>
            </div>

            {/* What you will learn key highlights */}
            {webinar.whatYouWillLearn && webinar.whatYouWillLearn.length > 0 && (
              <div className="mt-4 pt-3 border-t border-orange-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Session Highlights
                </span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700">
                  {webinar.whatYouWillLearn.slice(0, 4).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Bottom Action strip */}
          <div className="mt-6 pt-4 border-t border-orange-100 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                {isFree ? '100% Free Live Access' : 'Full Workshop Access'}
              </span>
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-2xl font-black ${
                    isFree ? 'text-emerald-600' : 'text-[#072B57]'
                  }`}
                >
                  {priceDisplay}
                </span>
                {!isFree && (
                  <span className="text-xs text-slate-400 line-through">
                    ₹1,499
                  </span>
                )}
                <span className="text-xs text-slate-500">
                  · Includes session resources &amp; deck
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(webinar);
                }}
                className="inline-flex items-center justify-center rounded-xl border-2 border-[#072B57]/20 bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-[#072B57] transition-all hover:border-[#072B57] hover:bg-[#FFF5EC] cursor-pointer"
              >
                View Syllabus
              </button>

              {typeof webinar.max_capacity === 'number' &&
              typeof webinar.current_registrations === 'number' &&
              webinar.current_registrations >= webinar.max_capacity ? (
                <span className="inline-flex items-center justify-center rounded-xl bg-slate-100 px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-400 cursor-not-allowed">
                  Session Full
                </span>
              ) : (
                <button
                  type="button"
                  id={`btn-register-featured-${webinar.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRegister(webinar);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6B00] px-5 py-2.5 text-xs sm:text-sm font-bold text-white transition-all duration-150 hover:bg-[#e05f00] cursor-pointer shadow-sm hover:shadow-md active:scale-[0.98]"
                >
                  <span>Reserve Your Seat</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
