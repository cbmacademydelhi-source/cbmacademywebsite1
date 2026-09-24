import React from 'react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Webinar } from '../../types';

interface CompactWebinarCardProps {
  webinar: Webinar;
  onSelect: (webinar: Webinar) => void;
  onRegister: (webinar: Webinar) => void;
}

export const CompactWebinarCard: React.FC<CompactWebinarCardProps> = ({
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
      id={`compact-webinar-${webinar.id}`}
      onClick={() => onSelect(webinar)}
      className="group flex flex-col overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-200 ease-out hover:-translate-y-[2px] hover:shadow-[0_8px_18px_rgba(7,43,87,0.07)] cursor-pointer"
    >
      {/* 16:9 Image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
        <img
          src={
            webinar.posterUrl ||
            'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80'
          }
          alt={webinar.title}
          className="h-full w-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.02]"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 pointer-events-none">
          {isFree ? (
            <span className="inline-block rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
              FREE
            </span>
          ) : (
            <span className="inline-block rounded-md bg-[#FF6B00] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
              PAID
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          <h4 className="text-sm sm:text-base font-bold text-[#072B57] line-clamp-2 leading-snug group-hover:text-[#FF6B00] transition-colors">
            {webinar.title}
          </h4>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3 w-3 text-[#FF6B00]" />
              {webinar.date}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3 w-3 text-[#FF6B00]" />
              {webinar.time}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#E5E7EB] flex items-center justify-between gap-2">
          <span
            className={`text-sm font-extrabold ${
              isFree ? 'text-emerald-600' : 'text-[#072B57]'
            }`}
          >
            {priceDisplay}
          </span>

          {typeof webinar.max_capacity === 'number' &&
          typeof webinar.current_registrations === 'number' &&
          webinar.current_registrations >= webinar.max_capacity ? (
            <span className="inline-flex items-center rounded-md bg-slate-200 px-3 py-1.5 text-xs font-bold text-slate-500 cursor-not-allowed">
              Closed
            </span>
          ) : (
            <button
              type="button"
              id={`btn-register-compact-${webinar.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onRegister(webinar);
              }}
              className="inline-flex items-center gap-1 rounded-md bg-[#FF6B00] px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[#e05f00] cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <span>Register</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
