import React from 'react';
import { Calendar, Clock, Timer, UserCheck, ArrowRight, Sparkles } from 'lucide-react';
import { Webinar } from '../../types';

interface WebinarCardProps {
  webinar: Webinar;
  onSelect: (webinar: Webinar) => void;
  onRegister: (webinar: Webinar) => void;
}

export const WebinarCard: React.FC<WebinarCardProps> = ({
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

  return (
    <div
      id={`webinar-card-${webinar.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
    >
      {/* Poster Image & Badges */}
      <div
        className="relative aspect-video w-full overflow-hidden bg-slate-100 cursor-pointer"
        onClick={() => onSelect(webinar)}
      >
        <img
          src={
            webinar.posterUrl ||
            'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80'
          }
          alt={webinar.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Free / Paid Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          {isFree ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
              <Sparkles className="h-3 w-3" />
              FREE
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FF6B00] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
              PAID &bull; {priceDisplay}
            </span>
          )}

          {webinar.status === 'draft' && (
            <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              Draft
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Title */}
        <h3
          onClick={() => onSelect(webinar)}
          className="text-lg font-bold text-[#072B57] line-clamp-2 hover:text-[#FF6B00] transition-colors cursor-pointer"
        >
          {webinar.title}
        </h3>

        {/* Short Description */}
        <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
          {webinar.description}
        </p>

        {/* Details Grid */}
        <div className="mt-4 space-y-2 rounded-xl bg-[#F8FAFC] p-3 text-xs text-[#1E293B]">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#FF6B00] shrink-0" />
            <span className="font-semibold text-slate-700">Date:</span>
            <span>{webinar.date}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#FF6B00] shrink-0" />
            <span className="font-semibold text-slate-700">Time:</span>
            <span>{webinar.time}</span>
          </div>

          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4 text-[#FF6B00] shrink-0" />
            <span className="font-semibold text-slate-700">Duration:</span>
            <span>{webinar.duration || '60 Minutes'}</span>
          </div>

          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-[#FF6B00] shrink-0" />
            <span className="font-semibold text-slate-700">Host:</span>
            <span className="truncate">{webinar.host || 'CBM Academy'}</span>
          </div>
        </div>

        {/* Price & Action Button */}
        <div className="mt-5 flex items-center justify-between gap-3 pt-3 border-t border-[#E5E7EB]">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">
              Registration Fee
            </div>
            <div
              className={`text-base font-extrabold ${
                isFree ? 'text-emerald-600' : 'text-[#072B57]'
              }`}
            >
              {priceDisplay}
            </div>
          </div>

          <button
            type="button"
            id={`btn-register-${webinar.id}`}
            onClick={() => onRegister(webinar)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#FF6B00] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#e05f00] cursor-pointer shadow-sm active:scale-95"
          >
            <span>Register Now</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
