import React, { useState } from 'react';
import { JOB_OPPORTUNITIES } from '../data/cbmData';
import {
  MapPin,
  IndianRupee,
  ArrowRight,
  Building2,
  Clock,
  Globe,
} from 'lucide-react';

interface JobBoardProps {
  onOpenApply: (jobRole?: string) => void;
}

export const JobBoard: React.FC<JobBoardProps> = ({ onOpenApply }) => {
  const [filter, setFilter] = useState<'ALL' | 'REMOTE' | 'DELHI'>('ALL');

  const filteredJobs = JOB_OPPORTUNITIES.filter((job) => {
    if (filter === 'REMOTE') return job.isRemote;

    if (filter === 'DELHI') {
      return (
        job.location.includes('Delhi') ||
        job.location.includes('Gurugram') ||
        job.location.includes('Noida')
      );
    }

    return true;
  });

  const handleApply = (job: (typeof JOB_OPPORTUNITIES)[number]) => {
    /*
      We pass both the company and the role inside the existing
      course/job string so the current application system continues
      working without breaking the existing architecture.
    */
    const applicationTarget =
      `Job Application | Company: ${job.companyCategory} | Role: ${job.role}`;

    onOpenApply(applicationTarget);
  };

  return (
    <section
      id="jobs"
      className="py-16 lg:py-24 bg-white border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================= HEADER ================= */}

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">

          <div className="space-y-3 max-w-2xl">

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#072B57] text-xs font-bold uppercase tracking-wider border border-blue-100">
              Placement Cell & Hiring Drives
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#072B57] tracking-tight">
              Live Job Opportunities
            </h2>

            <p className="text-slate-600 text-base leading-relaxed">
              Explore current openings and apply directly through CBM
              Academy's placement portal.
            </p>

          </div>

          {/* ================= FILTERS ================= */}

          <div className="inline-flex flex-wrap p-1 rounded-xl bg-slate-100 border border-slate-200 self-start md:self-auto">

            <button
              onClick={() => setFilter('ALL')}
              type="button"
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                filter === 'ALL'
                  ? 'bg-white text-[#072B57] shadow-sm'
                  : 'text-slate-600 hover:text-[#072B57]'
              }`}
            >
              All Openings ({JOB_OPPORTUNITIES.length})
            </button>

            <button
              onClick={() => setFilter('DELHI')}
              type="button"
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                filter === 'DELHI'
                  ? 'bg-white text-[#072B57] shadow-sm'
                  : 'text-slate-600 hover:text-[#072B57]'
              }`}
            >
              Delhi NCR
            </button>

            <button
              onClick={() => setFilter('REMOTE')}
              type="button"
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                filter === 'REMOTE'
                  ? 'bg-white text-[#072B57] shadow-sm'
                  : 'text-slate-600 hover:text-[#072B57]'
              }`}
            >
              Remote
            </button>

          </div>
        </div>

        {/* ================= JOB GRID ================= */}

        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredJobs.map((job) => (

              <article
                key={job.id}
                className="group bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-slate-300 transition-all duration-300"
              >

                <div className="space-y-5">

                  {/* TOP BADGES */}

                  <div className="flex items-center justify-between gap-2">

                    <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {job.type}
                    </span>

                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Posted {job.postedDaysAgo}d ago
                    </span>

                  </div>

                  {/* JOB ROLE */}

                  <div>

                    <h3 className="text-lg font-extrabold text-[#072B57] leading-snug">
                      {job.role}
                    </h3>

                    <div className="flex items-start gap-1.5 text-xs text-slate-600 mt-2 font-medium">

                      <Building2 className="w-4 h-4 text-[#FF6B00] flex-shrink-0 mt-0.5" />

                      <span>
                        {job.companyCategory}
                      </span>

                    </div>

                  </div>

                  {/* COMPANY / JOB INFO */}

                  <div className="space-y-3 py-3 border-y border-slate-100 text-xs">

                    <div className="flex items-center justify-between gap-3 text-slate-700">

                      <span className="flex items-center gap-1.5 text-slate-500">
                        {job.isRemote ? (
                          <Globe className="w-4 h-4 text-blue-600" />
                        ) : (
                          <MapPin className="w-4 h-4 text-rose-500" />
                        )}

                        Location
                      </span>

                      <span className="font-semibold text-right">
                        {job.location}
                      </span>

                    </div>

                    <div className="flex items-center justify-between gap-3 text-slate-700">

                      <span className="flex items-center gap-1.5 text-slate-500">
                        <IndianRupee className="w-4 h-4 text-emerald-600" />
                        Salary
                      </span>

                      <span className="font-extrabold text-[#072B57] text-sm text-right">
                        {job.salary}
                      </span>

                    </div>

                    <div className="flex items-center justify-between gap-3 text-slate-700">

                      <span className="text-slate-500">
                        Experience
                      </span>

                      <span className="font-semibold text-right">
                        {job.experience}
                      </span>

                    </div>

                  </div>

                  {/* SKILLS */}

                  <div>

                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Required Skills
                    </span>

                    <div className="flex flex-wrap gap-1.5">

                      {job.skills.map((skill, index) => (

                        <span
                          key={`${job.id}-skill-${index}`}
                          className="text-[11px] font-medium bg-[#F8FAFC] text-slate-700 px-2 py-1 rounded-md border border-slate-200"
                        >
                          {skill}
                        </span>

                      ))}

                    </div>

                  </div>

                </div>

                {/* ================= APPLY ================= */}

                <div className="mt-6 pt-4 border-t border-slate-100">

                  <button
                    onClick={() => handleApply(job)}
                    type="button"
                    id={`apply-job-${job.id}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#072B57] hover:bg-[#0c3c78] text-white font-bold text-sm py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#072B57] focus:ring-offset-2"
                  >

                    <span>
                      Apply for this Role
                    </span>

                    <ArrowRight className="w-4 h-4 text-[#FF6B00] transition-transform group-hover:translate-x-1" />

                  </button>

                </div>

              </article>

            ))}

          </div>
        ) : (

          <div className="py-16 text-center border border-dashed border-slate-300 rounded-2xl">

            <h3 className="text-lg font-bold text-[#072B57]">
              No openings found
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              Try another filter to see available opportunities.
            </p>

          </div>

        )}

        {/* ================= PARTNERS ================= */}

        <div className="mt-14 pt-8 border-t border-slate-200 text-center">

          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-6">
            Placement & Hiring Network
          </span>

          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">

            {[
              'Google Partner Agencies',
              'Amazon India',
              'Swiggy',
              'Zomato Media',
              'Dentsu International',
              'GroupM',
              'Nykaa Growth',
              'Flipkart',
            ].map((brand, index) => (

              <span
                key={index}
                className="text-sm sm:text-base font-extrabold text-[#072B57] tracking-tight hover:text-[#FF6B00] transition-colors"
              >
                {brand}
              </span>

            ))}

          </div>

        </div>

      </div>
    </section>
  );
};
