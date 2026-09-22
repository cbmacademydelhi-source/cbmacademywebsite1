import React from 'react';
import { X, Calendar, Clock, Timer, UserCheck, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { Webinar } from '../../types';

interface WebinarDetailsModalProps {
  webinar: Webinar | null;
  isOpen: boolean;
  onClose: () => void;
  onRegister: (webinar: Webinar) => void;
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

  return (
    <div
      id="webinar-details-modal-overlay"
      className="fixed inset-0 z-[10010] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="webinar-details-modal-content"
        className="relative my-8 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-[#E5E7EB]"
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
          className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/70 text-white transition-colors hover:bg-slate-900 cursor-pointer shadow-md"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Large Poster Image */}
        <div className="relative aspect-video max-h-[300px] w-full overflow-hidden bg-slate-900">
          <img
            src={
              webinar.posterUrl ||
              'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80'
            }
            alt={webinar.title}
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

          {/* Badge over poster */}
          <div className="absolute bottom-4 left-4 sm:left-6 flex items-center gap-2">
            {isFree ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                FREE WEBINAR
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#FF6B00] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
                PAID LIVE WEBINAR &bull; {priceDisplay}
              </span>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="max-h-[calc(85vh-260px)] overflow-y-auto p-5 sm:p-7">
          {/* Title */}
          <h2
            id="webinar-details-title"
            className="text-xl sm:text-2xl font-extrabold text-[#072B57] leading-snug"
          >
            {webinar.title}
          </h2>

          {/* Description */}
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            {webinar.description}
          </p>

          {/* Schedule & Info Grid */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-4 text-xs sm:text-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#072B57]">
                <Calendar className="h-4 w-4 text-[#FF6B00]" />
                <span>Date</span>
              </div>
              <div className="text-slate-600">{webinar.date}</div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#072B57]">
                <Clock className="h-4 w-4 text-[#FF6B00]" />
                <span>Time</span>
              </div>
              <div className="text-slate-600">{webinar.time}</div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#072B57]">
                <Timer className="h-4 w-4 text-[#FF6B00]" />
                <span>Duration</span>
              </div>
              <div className="text-slate-600">{webinar.duration || '60 Minutes'}</div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#072B57]">
                <UserCheck className="h-4 w-4 text-[#FF6B00]" />
                <span>Host</span>
              </div>
              <div className="text-slate-600 truncate">{webinar.host || 'CBM Academy'}</div>
            </div>
          </div>

          {/* What You Will Learn */}
          {webinar.whatYouWillLearn && webinar.whatYouWillLearn.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#072B57]">
                What You Will Learn
              </h3>
              <ul className="mt-3 space-y-2.5">
                {webinar.whatYouWillLearn.map((point, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-[#FF6B00] shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer with Action */}
        <div className="flex items-center justify-between border-t border-[#E5E7EB] bg-[#F8FAFC] px-5 py-4 sm:px-7">
          <div>
            <div className="text-xs text-slate-500">Access Fee</div>
            <div
              className={`text-lg sm:text-xl font-black ${
                isFree ? 'text-emerald-600' : 'text-[#072B57]'
              }`}
            >
              {priceDisplay}
            </div>
          </div>

          <button
            type="button"
            id="btn-modal-register-now"
            onClick={() => {
              onClose();
              onRegister(webinar);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-[#FF6B00] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#e05f00] cursor-pointer shadow-md active:scale-95"
          >
            <span>Register Now</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
