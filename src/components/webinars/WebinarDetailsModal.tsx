import React from 'react';
import { X, Calendar, Clock, Timer, UserCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { Webinar } from '../../types';

interface WebinarDetailsModalProps {
  webinar: Webinar | null;
  isOpen: boolean;
  onClose: () => void;
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

export const WebinarDetailsModal: React.FC<WebinarDetailsModalProps> = ({
  webinar,
  isOpen,
  onClose,
  onRegister,
}) => {
  if (!isOpen || !webinar) return null;

  const isFree = webinar.type === 'free';
  const priceDisplay = isFree
    ? 'FREE'
    : typeof webinar.price === 'number'
    ? `₹${webinar.price}`
    : webinar.price || '₹499';

  const dateParts = parseDateBadge(webinar.date);

  return (
    <div
      id="webinar-details-modal-overlay"
      className="fixed inset-0 z-[10010] flex items-center justify-center bg-[#072B57]/70 p-4 sm:p-6 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="webinar-details-modal-content"
        className="relative my-8 w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-[#FED7AA]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="webinar-details-title"
      >
        {/* Close Button */}
        <button
          type="button"
          id="btn-close-webinar-details"
          onClick={onClose}
          aria-label="Close details"
          className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-[#072B57]/70 text-white transition-colors hover:bg-[#072B57] cursor-pointer shadow-md"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col md:flex-row items-stretch max-h-[85vh]">
          {/* Left: Photo / Poster (Photo on Left) */}
          <div className="relative w-full md:w-[360px] lg:w-[400px] shrink-0 bg-[#072B57] flex flex-col justify-between p-6 overflow-hidden">
            <img
              src={
                webinar.posterUrl ||
                'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80'
              }
              alt={webinar.title ? `${webinar.title} - CBM Academy Webinar Details` : 'CBM Academy Webinar Details'}
              title={webinar.title || 'CBM Academy Webinar Details'}
              width={800}
              height={450}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover opacity-60"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/50" />

            {/* Top Badge */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex flex-col items-center justify-center rounded-xl bg-white/95 px-3 py-1.5 shadow-md border border-slate-200/60">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FF6B00]">
                  {dateParts.month}
                </span>
                <span className="text-xl font-black text-[#072B57] leading-none">
                  {dateParts.day}
                </span>
              </div>

              {isFree ? (
                <span className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-xs">
                  Free Live Session
                </span>
              ) : (
                <span className="rounded-lg bg-[#FF6B00] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-xs">
                  Masterclass
                </span>
              )}
            </div>

            {/* Bottom Meta on Left */}
            <div className="relative z-10 mt-24 md:mt-auto space-y-3 pt-6 border-t border-white/10 text-white text-xs">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#FF6B00]" />
                <span className="text-slate-200">{webinar.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#FF6B00]" />
                <span className="text-slate-200">{webinar.time} IST</span>
              </div>
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-[#FF6B00]" />
                <span className="text-slate-200">{webinar.duration || '60 Minutes'}</span>
              </div>
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-[#FF6B00]" />
                <span className="text-slate-200">{webinar.host || 'CBM Academy Faculty'}</span>
              </div>

              <div className="pt-2">
                <span className="text-[11px] text-slate-400 block uppercase tracking-wider">Access Fee</span>
                <span className={`text-2xl font-black ${isFree ? 'text-emerald-400' : 'text-white'}`}>
                  {priceDisplay}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Details (Details on Right) */}
          <div className="flex-1 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#FF6B00] mb-1.5">
                CBM Academy Live Masterclass
              </div>

              <h2
                id="webinar-details-title"
                className="text-xl sm:text-2xl lg:text-3xl font-black text-[#072B57] leading-snug tracking-tight"
              >
                {webinar.title}
              </h2>

              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                {webinar.description}
              </p>

              {/* What You Will Learn */}
              {webinar.whatYouWillLearn && webinar.whatYouWillLearn.length > 0 && (
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Curriculum & Key Takeaways
                  </h3>
                  <ul className="space-y-2.5">
                    {webinar.whatYouWillLearn.map((point, index) => (
                      <li key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Real student perks */}
              <div className="mt-6 rounded-2xl bg-[#FFF5EC]/70 border border-[#FED7AA] p-4 text-xs text-slate-700 space-y-1.5">
                <div className="font-bold text-[#072B57] text-sm">Session Inclusions</div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B00]" />
                  <span>Live interactive audio/chat Q&A with instructor</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B00]" />
                  <span>Downloadable campaign templates, prompt sheets & presentation slides</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B00]" />
                  <span>Digital Certificate of Participation from CBM Academy</span>
                </div>
              </div>
            </div>

            {/* Action Row */}
            <div className="mt-8 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 block">Registration Status</span>
                <span className="text-sm font-bold text-slate-800">
                  {isFree ? 'Open to All Students & Professionals' : 'Limited Seats Available'}
                </span>
              </div>

              {typeof webinar.max_capacity === 'number' &&
              typeof webinar.current_registrations === 'number' &&
              webinar.current_registrations >= webinar.max_capacity ? (
                <div className="rounded-xl bg-slate-200 px-6 py-3 text-sm font-bold text-slate-500 cursor-not-allowed">
                  Registration Closed
                </div>
              ) : (
                <button
                  type="button"
                  id="btn-modal-register-now"
                  onClick={() => {
                    onClose();
                    onRegister(webinar);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#FF6B00] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-[#e05f00] cursor-pointer shadow-md active:scale-95"
                >
                  <span>Register for This Session</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
