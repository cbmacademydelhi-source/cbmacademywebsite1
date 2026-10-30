import React from 'react';
import { CbmLogo } from './CbmLogo';
import { Mail, Phone, MapPin, ArrowRight, Download } from 'lucide-react';

interface FooterProps {
  onOpenApply: () => void;
  onOpenBrochure: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenApply, onOpenBrochure }) => {
  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Courses', href: '#course' },
    { name: 'Webinars', href: '#webinars' },
    { name: 'About', href: '#about' },
    { name: 'Certificate Verification', href: '#certificate' },
    { name: 'Jobs', href: '#jobs' },
    { name: 'Blogs', href: '#blogs' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <footer className="bg-[#072B57] text-white border-t border-[#041a35]">
      {/* Compact Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-7 pb-5 sm:pb-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Col 1: Branding & Key Contact Details (5 Cols) */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center">
              <CbmLogo variant="dark" height={76} />
            </div>

            <p className="text-slate-300 text-xs leading-relaxed max-w-sm">
              Practical digital marketing academy in Okhla, New Delhi. Learn SEO, performance ads, generative AI, and campaign strategy with dedicated placement assistance.
            </p>

            <div className="space-y-1.5 text-xs text-slate-300 pt-0.5">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#FF6B00] mt-0.5 shrink-0" />
                <span className="leading-snug">E-111, Hari Kothi, Abul Fazal Enclave, Okhla, New Delhi - 110025</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
                <a href="mailto:office@cbmacademy.in" className="hover:text-white transition-colors">
                  office@cbmacademy.in
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
                <a href="tel:+919211583150" className="hover:text-white transition-colors font-medium">
                  +91 92115 83150
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Essential Navigation Links (4 Cols - 2 column subgrid) */}
          <div className="md:col-span-4 space-y-2.5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/10 pb-1.5 flex items-center min-h-[24px]">
              Quick Links
            </h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-slate-300">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="hover:text-[#FF6B00] transition-colors inline-block py-0.5 leading-snug"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Important CTAs (3 Cols) */}
          <div className="md:col-span-3 space-y-2.5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/10 pb-1.5 flex items-center min-h-[24px]">
              Next Batch &amp; Syllabus
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              New weekend &amp; weekday batches starting soon. Reserve your seat or download the 2026 syllabus.
            </p>
            <div className="space-y-2 pt-0.5">
              <button
                type="button"
                onClick={onOpenApply}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#e05f00] text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-colors shadow-xs cursor-pointer active:scale-98"
              >
                <span>Apply for Next Batch</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={onOpenBrochure}
                className="w-full inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs py-2.5 px-4 rounded-xl border border-white/15 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>Download Brochure</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Compact Bar */}
      <div className="border-t border-white/10 bg-[#041a35] py-2.5 sm:py-3 text-[11px] text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div>
            <span>&copy; {new Date().getFullYear()} CBM Academy. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <a href="#about" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#about" className="hover:text-white transition-colors">Terms</a>
            <a href="#certificate" className="hover:text-white transition-colors">Verify Credential</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
