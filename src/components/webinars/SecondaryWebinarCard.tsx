import React from 'react';
import { Calendar, Clock, Timer, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Webinar } from '../../types';

interface SecondaryWebinarCardProps {
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
    };
  }
  return { day: 'LIVE', month: 'SESSION' };
}

export const SecondaryWebinarCard: React.FC<SecondaryWebinarCardProps> = ({
  webinar,
  onSelect,
  onRegister,
}) => {
  const isFree = webinar.type === 'free';
  const priceDisplay = isFree
    ? 'FREE'
    : typeof webinar.price === 'number'
    ? `₹${webinar.price}`
    : webinar.price || '₹499';

  const dateParts = parseDateBadge(webinar.date);

  return (
    <article
      id={`secondary-webinar-${webinar.id}`}
      onClick={() => onSelect(webinar)}
      className="group relative overflow-hidden rounded-2xl border border-[#FED7AA]/70 bg-white shadow-xs transition-all duration-300 hover:border-[#FF6B00]/60 hover:shadow-lg hover:shadow-[#072B57]/5 cursor-pointer"
    >
      <div className="flex flex-col sm:flex-row items-stretch">
        {/* Left: Photo / Poster (Photo strictly on Left) */}
        <div className="relative w-full sm:w-[260px] md:w-[290px] lg:w-[320px] shrink-0 bg-[#072B57] overflow-hidden flex items-center justify-center min-h-[200px] sm:min-h-full">
          <img
            src={
              webinar.posterUrl ||
              'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
            }
            alt={webinar.title ? `${webinar.title} - CBM Academy Digital Marketing Session` : 'CBM Academy Digital Marketing Webinar Session'}
            title={webinar.title || 'CBM Academy Digital Marketing Session'}
            width={800}
            height={450}
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            referrerPolicy="no-referrer"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#072B57]/80 via-transparent to-black/20 pointer-events-none" />

          {/* Calendar Badge (Website colors) */}
          <div className="absolute top-3.5 left-3.5 flex flex-col items-center justify-center rounded-xl bg-white/95 px-2.5 py-1.5 shadow-sm border border-[#FED7AA] backdrop-blur-xs pointer-events-none">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#FF6B00]">
              {dateParts.month}
            </span>
            <span className="text-lg font-black text-[#072B57] leading-none">
              {dateParts.day}
            </span>
          </div>

          {/* Price status badge on image */}
          <div className="absolute bottom-3 left-3 pointer-events-none">
            {isFree ? (
              <span className="rounded-lg bg-emerald-600 px-2 py-0.5 text-[11px] font-bold text-white shadow-xs">
                Free Access
              </span>
            ) : (
              <span className="rounded-lg bg-[#FF6B00] px-2 py-0.5 text-[11px] font-bold text-white shadow-xs">
                {priceDisplay}
              </span>
            )}
          </div>
        </div>

        {/* Right: Details (Details strictly on Right) */}
        <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            {/* Format & Host Metadata Tag */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium mb-1.5">
              <span className="px-2 py-0.5 rounded-md bg-[#FFF5EC] text-[#FF6B00] font-bold uppercase tracking-wider text-[10px] border border-[#FED7AA]">
                Live Workshop
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-600 font-medium">{webinar.duration || '60 Mins'}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-600 font-medium">{webinar.host || 'CBM Academy'}</span>
            </div>

            {/* Title */}
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-[#072B57] leading-snug group-hover:text-[#FF6B00] transition-colors">
              {webinar.title}
            </h3>

            {/* Description */}
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
              {webinar.description}
            </p>

            {/* Date & Time */}
            <div className="mt-3.5 pt-3 border-t border-orange-100 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[#FF6B00] shrink-0" />
                <span className="font-semibold text-[#072B57]">{webinar.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-[#FF6B00] shrink-0" />
                <span>{webinar.time} IST</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Timer className="h-3.5 w-3.5 text-[#FF6B00] shrink-0" />
                <span>{webinar.duration || '60 Mins'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-[#FF6B00] shrink-0" />
                <span>{webinar.host || 'CBM Faculty'}</span>
              </div>
            </div>

            {/* Key takeaways */}
            {webinar.whatYouWillLearn && webinar.whatYouWillLearn.length > 0 && (
              <div className="mt-3 space-y-1">
                {webinar.whatYouWillLearn.slice(0, 2).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-600">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Price & Action */}
          <div className="mt-5 pt-3.5 border-t border-orange-100 flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">
                Session Fee
              </span>
              <div className="flex items-baseline gap-1.5">
                <span
                  className={`text-lg font-black ${
                    isFree ? 'text-emerald-600' : 'text-[#072B57]'
                  }`}
                >
                  {priceDisplay}
                </span>
                {!isFree && (
                  <span className="text-[11px] text-slate-400 line-through">
                    ₹1,499
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(webinar);
                }}
                className="inline-flex items-center justify-center rounded-xl border border-[#072B57]/20 bg-white px-3 py-2 text-xs font-bold text-[#072B57] hover:border-[#072B57] hover:bg-[#FFF5EC] transition-colors cursor-pointer"
              >
                Details
              </button>

              {typeof webinar.max_capacity === 'number' &&
              typeof webinar.current_registrations === 'number' &&
              webinar.current_registrations >= webinar.max_capacity ? (
                <span className="inline-flex items-center justify-center rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-400 cursor-not-allowed">
                  Closed
                </span>
              ) : (
                <button
                  type="button"
                  id={`btn-register-secondary-${webinar.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRegister(webinar);
                  }}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#FF6B00] px-4 py-2 text-xs font-bold text-white transition-all duration-150 hover:bg-[#e05f00] cursor-pointer shadow-xs active:scale-[0.98]"
                >
                  <span>Register</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
