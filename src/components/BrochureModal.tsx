import React, { useEffect, useState } from 'react';
import {
  Download,
  FileText,
  CheckCircle2,
  X,
  Sparkles,
} from 'lucide-react';

interface BrochureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrochureModal: React.FC<BrochureModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [downloadStatus, setDownloadStatus] = useState<
    'idle' | 'downloading' | 'ready'
  >('idle');

  // PDF uploaded in the GitHub repository
  const brochurePdf =
    'https://cbmacademydelhi-source.github.io/cbmacademywebsite1/CBM_Academy_2026_Course_Brochure.pdf';

  // Close modal with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  // Download PDF
  const handleDownload = () => {
    setDownloadStatus('downloading');

    try {
      const link = document.createElement('a');

      link.href = brochurePdf;
      link.download = 'CBM_Academy_2026_Course_Brochure.pdf';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        setDownloadStatus('ready');
      }, 700);
    } catch (error) {
      console.error('Brochure download error:', error);
      setDownloadStatus('idle');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="brochure-modal-title"
      onClick={onClose}
    >
      <div
        id="brochure-modal"
        className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-brochure-modal-btn"
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close brochure modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
            <FileText className="w-6 h-6" />
          </div>

          <div>
            <h3
              id="brochure-modal-title"
              className="text-xl font-bold text-slate-900"
            >
              Download 2026 Course Brochure
            </h3>

            <p className="text-sm text-slate-500">
              CBM Academy — Digital Marketing Programme
            </p>
          </div>
        </div>

        {/* Brochure Information */}
        <div className="space-y-4 my-6 text-sm text-slate-600">
          <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl">
            <div className="flex items-center gap-2 text-orange-950 font-semibold text-sm mb-2">
              <Sparkles className="w-4 h-4 text-orange-500" />
              Inside the brochure
            </div>

            <ul className="space-y-1.5 text-sm text-slate-700 pl-5 list-disc">
              <li>2026 course curriculum</li>
              <li>Practical digital marketing modules</li>
              <li>AI marketing tools and workflows</li>
              <li>Projects and career guidance</li>
              <li>CBM Academy programme information</li>
            </ul>
          </div>

          {/* Download Success Message */}
          {downloadStatus === 'ready' && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 text-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />

              <div>
                <p className="font-semibold text-sm">
                  Brochure download started!
                </p>

                <p className="text-xs text-slate-600 mt-1">
                  Check your browser Downloads folder.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">

          {/* DOWNLOAD PDF */}
          <button
            id="start-brochure-download-btn"
            onClick={handleDownload}
            type="button"
            disabled={downloadStatus === 'downloading'}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-all shadow-md shadow-orange-500/20 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
          >
            <Download className="w-4 h-4" />

            {downloadStatus === 'downloading'
              ? 'Preparing...'
              : 'Download PDF Brochure'}
          </button>

          {/* VIEW PDF */}
          <a
            id="view-brochure-pdf-btn"
            href={brochurePdf}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition-colors cursor-pointer"
          >
            View PDF
          </a>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-4">
          CBM Academy • Your Digital Marketing Journey Begins Here
        </p>
      </div>
    </div>
  );
};
