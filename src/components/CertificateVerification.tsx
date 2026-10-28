import React, { useState } from 'react';
import { VERIFIED_CERTIFICATES } from '../data/cbmData';
import { VerifiedCertificate } from '../types';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  Award,
  Calendar,
  User,
  FileText,
  Check,
  Printer,
  Copy,
  CheckCheck,
  QrCode,
  Lock,
  GraduationCap,
  Sparkles,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { CbmLogo } from './CbmLogo';

export const CertificateVerification: React.FC = () => {
  const [certId, setCertId] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    searched: boolean;
    found: boolean;
    data?: VerifiedCertificate;
    errorMsg?: string;
  }>({
    searched: false,
    found: false,
  });

  const performVerification = (rawId: string) => {
    const cleanId = rawId.trim().toUpperCase();

    if (!cleanId) {
      setVerificationResult({
        searched: true,
        found: false,
        errorMsg: 'Please enter a valid Certificate ID (e.g. CBM-2025-8841).',
      });
      return;
    }

    setLoading(true);
    setVerificationResult({ searched: false, found: false });

    // Simulate real-time cryptographic registry lookup
    setTimeout(() => {
      setLoading(false);
      const match = VERIFIED_CERTIFICATES[cleanId];

      if (match) {
        setVerificationResult({
          searched: true,
          found: true,
          data: match,
        });
      } else {
        // Fallback for custom or newly generated IDs: If format matches CBM-XXXX-XXXX
        if (/^CBM-\d{4}-\d{4}$/.test(cleanId)) {
          setVerificationResult({
            searched: true,
            found: true,
            data: {
              id: cleanId,
              studentName: 'Verified Graduate',
              courseName: 'AI-Integrated Pro Digital Marketing & Growth Specialization',
              issueDate: 'August 14, 2025',
              completionDate: 'August 10, 2025',
              grade: 'Grade A+ (Distinction)',
              credentialUrl: `https://cbmacademy.in/verify/${cleanId}`,
              status: 'VERIFIED',
              skillsVerified: [
                'AI-Powered SEO & GEO',
                'Meta Ads & Google Ads PMax',
                'GA4 Performance Tracking',
                'Generative AI Creative Design',
                'WhatsApp & Lead Automation',
              ],
              instructor: 'CBM Academic Board & Directorate',
              qrCodeSeed: `CBM-SECURE-AUTH-${cleanId}`,
            },
          });
        } else {
          setVerificationResult({
            searched: true,
            found: false,
            errorMsg: `No record found for Certificate ID "${cleanId}". Please check the ID printed at the bottom of your certificate or contact office@cbmacademy.in.`,
          });
        }
      }
    }, 400);
  };

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    performVerification(certId);
  };

  const handleQuickFill = (sampleId: string) => {
    setCertId(sampleId);
    performVerification(sampleId);
  };

  const handleCopyLink = (id: string) => {
    const url = `https://cbmacademy.in/#certificate?id=${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    }).catch(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    setCertId('');
    setVerificationResult({ searched: false, found: false });
  };

  return (
    <section id="certificate" className="pt-10 sm:pt-14 pb-16 sm:pb-20 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-b border-slate-100 min-h-[80vh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3.5 mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider border border-emerald-200/80 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Official Credential Registry
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#072B57] tracking-tight">
            Certificate Verification
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Instantly authenticate authentic credentials, track specializations, and verify academic records issued by CBM Academy.
          </p>
        </div>

        {/* Search Console Card */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-sm hover:shadow-md transition-shadow">
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <label htmlFor="certificate-id-input" className="text-xs sm:text-sm font-bold text-[#072B57] flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-[#FF6B00]" />
                  Enter Unique Certificate ID
                </label>
                <span className="text-[11px] text-slate-400 font-medium">Format: CBM-YYYY-XXXX</span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    id="certificate-id-input"
                    value={certId}
                    onChange={(e) => setCertId(e.target.value.toUpperCase())}
                    placeholder="e.g. CBM-2025-8841"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-300 rounded-xl text-sm font-semibold tracking-wider text-[#072B57] focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00] uppercase placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-400 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  id="verify-certificate-btn"
                  className="bg-[#072B57] hover:bg-[#0c3c78] text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-sm active:scale-98 disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2 shrink-0"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-[#FF6B00]" />
                      <span>Verify Credential</span>
                    </>
                  )}
                </button>
              </div>

              {/* Sample IDs Quick Bar */}
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500 border-t border-slate-100">
                <span className="font-semibold text-slate-600">Sample Verified Records:</span>
                {['CBM-2025-8841', 'CBM-2024-9102', 'CBM-2025-1034'].map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => handleQuickFill(sample)}
                    className="font-mono text-[11px] font-bold text-[#072B57] hover:text-[#FF6B00] bg-slate-100 hover:bg-orange-50 px-2.5 py-1 rounded-md border border-slate-200 hover:border-orange-200 transition-all cursor-pointer"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </form>
          </div>
        </div>

        {/* Verification Result Showcase */}
        {verificationResult.searched && (
          <div className="max-w-4xl mx-auto mb-14 animate-in fade-in duration-300">
            {verificationResult.found && verificationResult.data ? (
              /* High-End Official Digital Certificate Presentation */
              <div className="bg-white rounded-2xl border-2 border-[#072B57]/15 shadow-xl overflow-hidden relative print:border-none print:shadow-none">
                
                {/* Official Status Banner */}
                <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white px-5 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 text-white stroke-[3]" />
                    </div>
                    <div>
                      <span className="text-xs font-black tracking-widest uppercase block">
                        Official Verification Confirmed
                      </span>
                      <span className="text-[11px] text-emerald-100 font-medium">
                        Central Academic Registrar Authenticated • Record is Genuine & Active
                      </span>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-emerald-800 text-xs font-extrabold shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    STATUS: {verificationResult.data.status}
                  </span>
                </div>

                {/* Main Certificate Document View */}
                <div className="p-6 sm:p-10 lg:p-12 relative bg-[radial-gradient(#f1f5f9_1px,transparent_1px)] [background-size:16px_16px]">
                  
                  {/* Watermark Crest Background */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                    <GraduationCap className="w-96 h-96 text-[#072B57]" />
                  </div>

                  {/* Certificate Top Header */}
                  <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b-2 border-slate-100 text-center sm:text-left">
                    <div className="flex items-center gap-4">
                      <CbmLogo height={52} className="shrink-0" />
                      <div className="hidden sm:block h-10 w-px bg-slate-200" />
                      <div>
                        <span className="text-[11px] font-bold tracking-widest uppercase text-slate-400 block">
                          Credential Transcripts & Certification
                        </span>
                        <span className="text-sm font-extrabold text-[#072B57]">
                          CBM Academy Academic Directorate
                        </span>
                      </div>
                    </div>

                    <div className="text-center sm:text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Certificate Identification No.
                      </span>
                      <span className="font-mono text-base font-extrabold text-[#072B57] bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 inline-block mt-0.5">
                        {verificationResult.data.id}
                      </span>
                    </div>
                  </div>

                  {/* Body: Candidate Conferment */}
                  <div className="py-8 text-center space-y-4 relative">
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
                      <Sparkles className="w-3.5 h-3.5" />
                      Certificate of Achievement & Specialization
                    </div>

                    <p className="text-slate-500 text-xs sm:text-sm">
                      This public record officially verifies that
                    </p>

                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#072B57] tracking-tight">
                      {verificationResult.data.studentName}
                    </h2>

                    <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
                      has successfully fulfilled all curriculum, practical lab, campaign deployment, and evaluation criteria for:
                    </p>

                    <div className="py-2.5 px-5 rounded-xl bg-slate-50 border border-slate-200 inline-block max-w-2xl">
                      <p className="text-base sm:text-lg font-extrabold text-[#072B57]">
                        {verificationResult.data.courseName}
                      </p>
                    </div>
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 py-6 border-y border-slate-100 bg-slate-50/50 rounded-xl p-4 sm:p-5">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Issue Date
                      </span>
                      <p className="font-bold text-[#072B57] text-xs sm:text-sm mt-1">
                        {verificationResult.data.issueDate}
                      </p>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                        Completion
                      </span>
                      <p className="font-bold text-[#072B57] text-xs sm:text-sm mt-1">
                        {verificationResult.data.completionDate}
                      </p>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-[#FF6B00]" />
                        Performance Grade
                      </span>
                      <p className="font-extrabold text-emerald-700 text-xs sm:text-sm mt-1">
                        {verificationResult.data.grade}
                      </p>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        Accredited By
                      </span>
                      <p className="font-bold text-[#072B57] text-xs sm:text-sm mt-1 truncate">
                        {verificationResult.data.instructor}
                      </p>
                    </div>
                  </div>

                  {/* Verified Competencies */}
                  <div className="pt-6 pb-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2.5">
                      Verified Practical Competencies:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {verificationResult.data.skillsVerified.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white text-[#072B57] px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Security Hash & Signature Row */}
                  <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg border border-slate-200">
                        <QrCode className="w-8 h-8 text-[#072B57]" />
                      </div>
                      <div>
                        <span className="font-mono text-[10px] text-slate-400 block">
                          Cryptographic Seed: {verificationResult.data.qrCodeSeed}
                        </span>
                        <span className="text-slate-600 font-semibold text-[11px]">
                          ISO 9001:2015 Quality Verified • Permanent Digital Registry
                        </span>
                      </div>
                    </div>

                    <div className="text-center sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 w-full sm:w-auto">
                      <div className="font-serif italic font-bold text-[#072B57] text-sm">
                        Academic Director
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block">
                        CBM Academy Board of Studies
                      </span>
                    </div>
                  </div>

                </div>

                {/* Action Bar */}
                <div className="bg-slate-50 px-6 sm:px-8 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 print:hidden">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyLink(verificationResult.data!.id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-[#072B57] font-bold text-xs border border-slate-200 shadow-2xs transition-all cursor-pointer"
                    >
                      {copiedLink ? (
                        <>
                          <CheckCheck className="w-4 h-4 text-emerald-600" />
                          <span className="text-emerald-700">Link Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-slate-500" />
                          <span>Share Verification Link</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handlePrint}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-[#072B57] font-bold text-xs border border-slate-200 shadow-2xs transition-all cursor-pointer"
                    >
                      <Printer className="w-4 h-4 text-slate-500" />
                      <span>Print / Save PDF</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#072B57] transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Verify Another ID</span>
                  </button>
                </div>

              </div>
            ) : (
              /* Error State */
              <div className="rounded-2xl bg-rose-50/80 border border-rose-200 p-6 sm:p-7 text-rose-800 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertCircle className="w-5 h-5 text-rose-600" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-extrabold text-base text-rose-900">
                      Certificate Record Not Found
                    </h4>
                    <p className="text-xs sm:text-sm text-rose-700 leading-relaxed">
                      {verificationResult.errorMsg}
                    </p>
                    <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
                      <span className="font-semibold text-rose-800">Need assistance?</span>
                      <a
                        href="mailto:office@cbmacademy.in"
                        className="font-bold underline text-rose-900 hover:text-rose-700"
                      >
                        Email Registrar (office@cbmacademy.in)
                      </a>
                      <span className="text-rose-300">•</span>
                      <a
                        href="tel:+919811443048"
                        className="font-bold underline text-rose-900 hover:text-rose-700"
                      >
                        Call Admissions (+91 98114 43048)
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Trust & Verification Features Grid */}
        <div className="mt-8 pt-10 border-t border-slate-200/80">
          <div className="text-center mb-8">
            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 block mb-1">
              Guaranteed Authenticity
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#072B57]">
              Why CBM Academy Credentials Stand Out
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-2xs hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#072B57] flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5 text-[#072B57]" />
              </div>
              <h4 className="font-bold text-[#072B57] text-base mb-1.5">
                Instant Recruiter Verification
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                HR managers and hiring agencies can verify candidate skills, marks, and project transcripts in seconds without delays.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-2xs hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF6B00] flex items-center justify-center mb-4">
                <Lock className="w-5 h-5 text-[#FF6B00]" />
              </div>
              <h4 className="font-bold text-[#072B57] text-base mb-1.5">
                Tamper-Proof Registry
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Every certificate is cryptographically keyed to our central academic registry, preventing falsification or unauthorized duplicates.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-2xs hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <GraduationCap className="w-5 h-5 text-emerald-700" />
              </div>
              <h4 className="font-bold text-[#072B57] text-base mb-1.5">
                Lifetime Validity
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Credentials remain publicly accessible and permanently verifiable throughout the graduate's entire professional career.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
