import React, { useState } from 'react';
import { CbmLogo } from './CbmLogo';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { submitContactForm } from '../services/formService';

interface FooterProps {
  onOpenApply: () => void;
  onOpenBrochure: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenApply, onOpenBrochure }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    try {
      await submitContactForm({
        fullName: 'Newsletter Subscriber',
        email: newsletterEmail.trim(),
        phone: '9876543210',
        subject: 'Newsletter Subscription (Weekly Growth Insights)',
        message: 'Subscribed to CBM Academy Weekly Digital Marketing Newsletter',
      });
    } catch (e) {
      console.error(e);
    } finally {
      setSubscribed(true);
    }
  };

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Course Modules', href: '#course' },
    { name: 'About CBM', href: '#about' },
    { name: 'Certificate Verification', href: '#certificate' },
    { name: 'Job Opportunities', href: '#jobs' },
    { name: 'Articles & Blogs', href: '#blogs' },
    { name: 'Contact Campus', href: '#contact' },
  ];

  const courseTracks = [
    'AI-Driven SEO & Voice Search',
    'Performance Marketing & Meta Ads',
    'Google Ads & Performance Max (PMax)',
    'AI Content Creation & Midjourney',
    'Web Analytics, GA4 & Looker Studio',
    'Email Marketing & CRM Automation'
  ];

  return (
    <footer className="bg-[#072B57] text-white border-t border-[#041a35]">
      
      {/* Top Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-14 pb-10 sm:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Col 1: Official Branding & Identity (4 Cols) */}
          <div className="lg:col-span-4 space-y-5">
            <CbmLogo variant="dark" height={44} showTagline={true} />

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-sm">
              India’s premier outcome-driven AI digital marketing institute. Practical execution with direct career placement support.
            </p>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FF6B00] flex-shrink-0" />
                <span>Connaught Place & South Ext, New Delhi, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FF6B00] flex-shrink-0" />
                <a href="mailto:office@cbmacademy.in" className="hover:text-white transition-colors">
                  office@cbmacademy.in
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FF6B00] flex-shrink-0" />
                <a href="tel:+919876543210" className="hover:text-white transition-colors">
                  +91 98765 43210 / +91 11 4567 8900
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Links (2.5 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="hover:text-[#FF6B00] transition-colors inline-flex items-center gap-1"
                  >
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Specialization Tracks (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
              Popular Specializations
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {courseTracks.map((trk, i) => (
                <li key={i}>
                  <a
                    href="#course"
                    className="hover:text-[#FF6B00] transition-colors inline-flex items-center gap-1.5"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#FF6B00]" />
                    <span>{trk}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Newsletter & Direct Application (3.5 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
              Weekly AI Growth Digest
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Get the latest marketing algorithms, prompt frameworks, and job alerts in your inbox every Monday.
            </p>

            {subscribed ? (
              <div className="bg-emerald-500/15 border border-emerald-500/30 p-3 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Thank you! You are subscribed to CBM Growth Insights.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-white/10 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#FF6B00] hover:bg-[#e05f00] text-white font-bold text-xs py-2.5 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Subscribe to Newsletter</span>
                  <Send className="w-3 h-3" />
                </button>
              </form>
            )}

            <div className="pt-2">
              <button
                onClick={onOpenApply}
                type="button"
                className="w-full text-center text-xs font-bold text-white bg-white/10 hover:bg-white/15 px-3 py-2.5 rounded-xl border border-white/15 transition-colors cursor-pointer"
              >
                Apply for Next Batch &rarr;
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar: Copyright, Socials & Legal */}
      <div className="border-t border-white/10 bg-[#041a35] py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          
          <div>
            <span>&copy; {new Date().getFullYear()} CBM Academy. All rights reserved.</span>
            <span className="hidden sm:inline mx-2">&bull;</span>
            <span className="text-slate-400">Your Digital Marketing Journey Begins Here</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#about" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#about" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#certificate" className="hover:text-white transition-colors">Verify Credential</a>
            <a href="#contact" className="hover:text-white transition-colors">Campus Map</a>
          </div>

        </div>
      </div>

    </footer>
  );
};
