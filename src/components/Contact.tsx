import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { MapPin, Mail, Phone, Clock } from 'lucide-react';
import { SMOOTH_EASE_OUT, VIEWPORT_ONCE } from '../lib/animations';

interface ContactProps {
  isStandalonePage?: boolean;
}

export const Contact: React.FC<ContactProps> = ({
  isStandalonePage = false,
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="contact"
      className="relative overflow-hidden pt-12 sm:pt-16 pb-12 sm:pb-16 bg-[#FAFAFA] border-b border-slate-100"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-10 sm:mb-12">
          {isStandalonePage ? (
            <motion.h1
              initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT_ONCE}
              transition={{ duration: 0.6, delay: 0.08, ease: SMOOTH_EASE_OUT }}
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#072B57] tracking-tight"
            >
              Get in Touch with CBM Academy
            </motion.h1>
          ) : (
            <motion.h2
              initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT_ONCE}
              transition={{ duration: 0.6, delay: 0.08, ease: SMOOTH_EASE_OUT }}
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#072B57] tracking-tight"
            >
              Get in Touch with CBM Academy
            </motion.h2>
          )}
          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.6, delay: 0.16, ease: SMOOTH_EASE_OUT }}
            className="text-slate-700 text-base leading-relaxed"
          >
            Have questions about digital marketing course admissions, batch schedules, fees, or practical training in Okhla? Reach out below.
          </motion.p>
        </div>

        {/* Two-Column Contact Information & Google Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* Left: Admissions & Campus Office Info */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.6, delay: 0.08, ease: SMOOTH_EASE_OUT }}
            className="lg:col-span-6"
          >
            <div className="h-full bg-white p-6 sm:p-8 rounded-[20px] border border-orange-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col justify-between space-y-6">
              <div>
                <h3 className="text-xl font-bold text-[#072B57] pb-3 border-b border-slate-100 mb-6">
                  Admissions &amp; Campus Office
                </h3>

                <div className="space-y-6">
                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0 text-[#FF6B00] shadow-2xs">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Address</h4>
                      <p className="text-sm font-semibold text-[#072B57]">
                        CBM Academy
                      </p>
                      <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                        E-111, Hari Kothi, Abul Fazal Enclave, Okhla, New Delhi, Delhi - 110025, India
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0 text-[#FF6B00] shadow-2xs">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Official Email</h4>
                      <a
                        href="mailto:office@cbmacademy.in"
                        className="text-sm font-bold text-[#072B57] hover:text-[#FF6B00] transition-colors"
                      >
                        office@cbmacademy.in
                      </a>
                      <p className="text-xs text-slate-500 mt-0.5">Direct inquiries &amp; corporate partnerships</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0 text-[#FF6B00] shadow-2xs">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Helpline &amp; WhatsApp</h4>
                      <a
                        href="tel:+919211583150"
                        className="text-sm font-bold text-[#072B57] hover:text-[#FF6B00] transition-colors block"
                      >
                        +91 92115 83150
                      </a>
                      <p className="text-xs text-slate-500 mt-0.5">Available on WhatsApp for instant guidance</p>
                    </div>
                  </div>

                  {/* Working Hours */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0 text-[#FF6B00] shadow-2xs">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Office Timings</h4>
                      <p className="text-sm font-semibold text-[#072B57]">
                        Monday – Saturday: 11:00 AM – 6:00 PM
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Action Links */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-3">
                <a
                  href="tel:+919211583150"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF6B00] hover:bg-[#e05f00] text-white text-xs sm:text-sm font-bold shadow-sm transition-all"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Admissions</span>
                </a>
                <a
                  href="mailto:office@cbmacademy.in"
                  target="_top"
                  onClick={() => {
                    window.location.href = 'mailto:office@cbmacademy.in';
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#FF6B00] border border-orange-200 text-xs sm:text-sm font-bold transition-all"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Email</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right: Google Map Interactive Container */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.6, delay: 0.16, ease: SMOOTH_EASE_OUT }}
            className="lg:col-span-6"
          >
            <div className="h-full min-h-[360px] lg:min-h-full rounded-[20px] overflow-hidden border border-orange-200/80 shadow-sm bg-white relative">
              <iframe
                title="CBM Academy Delhi Location"
               src="https://www.google.com/maps?q=CBM+Academy+-+AI+Integrated+Digital+Marketing+Institute&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute bottom-3 left-3 bg-[#072B57]/90 backdrop-blur-xs px-3.5 py-1.5 rounded-lg text-xs font-bold text-white shadow-md">
               📍 Upper Ground Floor, Abul Fazal, E-111, Hari Kothi Rd, Abul Fazal Enclave, Jamia Nagar, Okhla, New Delhi
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
