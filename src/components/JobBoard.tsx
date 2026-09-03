import React, { useState } from 'react';
import { JOB_OPPORTUNITIES } from '../data/cbmData';
import {
  ArrowRight,
  Building2,
  Clock,
  Globe,
  IndianRupee,
  Mail,
  MapPin,
  PlusCircle,
} from 'lucide-react';

interface JobBoardProps {
  onOpenApply: (jobRole?: string, hrEmail?: string) => void;
  onPostJob?: () => void;
}

export const JobBoard: React.FC<JobBoardProps> = ({
  onOpenApply,
  onPostJob,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'REMOTE' | 'DELHI'>('ALL');

  const filteredJobs = JOB_OPPORTUNITIES.filter((job) => {
    if (filter === 'REMOTE') {
      return job.isRemote;
    }

    if (filter === 'DELHI') {
      return (
        job.location.includes('Delhi') ||
        job.location.includes('Gurugram') ||
        job.location.includes('Noida')
      );
    }

    return true;
  });

  return (
    <section
      id="jobs"
      className="py-16 lg:py-24 bg-white border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">

          <div className="space-y-3 max-w-2xl">

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#072B57] text-xs font-bold uppercase tracking-wider border border-blue-100">
              Placement Cell & Hiring Drives
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#072B57] tracking-tight">
              Live Job Opportunities
            </h2>

            <p className="text-slate-600 text-base leading-relaxed">
              Find your next opportunity or post a job with CBM Academy.
            </p>

          </div>

          {/* Employer CTA */}
          <button
            type="button"
            onClick={onPostJob}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#FF6B00] hover:bg-[#e85f00] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 whitespace-nowrap"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Post a Job</span>
          </button>

        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">

          <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200">

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

          <p className="text-xs text-slate-500">
            Are you an employer?{' '}
            <button
              type="button"
              onClick={onPostJob}
              className="font-bold text-[#FF6B00] hover:underline"
            >
              Post your opening
            </button>
          </p>

        </div>

        {/* Job Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between cbm-shadow cbm-shadow-hover transition-all duration-200 hover:border-slate-300"
            >

              <div className="space-y-4">

                {/* Badge */}
                <div className="flex items-center justify-between gap-2">

                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded">
                    {job.type}
                  </span>

                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-100 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Posted {job.postedDaysAgo}d ago
                  </span>

                </div>

                {/* Role */}
                <div>

                  <h3 className="text-lg font-bold text-[#072B57] line-clamp-2">
                    {job.role}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1 font-medium">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.companyCategory}</span>
                  </div>

                </div>

                {/* Location & Salary */}
                <div className="space-y-2 py-2 border-y border-slate-100 text-xs">

                  <div className="flex items-center justify-between text-slate-700 gap-3">

                    <span className="flex items-center gap-1.5 text-slate-500 shrink-0">
                      {job.isRemote ? (
                        <Globe className="w-4 h-4 text-blue-600" />
                      ) : (
                        <MapPin className="w-4 h-4 text-rose-500" />
                      )}
                      Location:
                    </span>

                    <span className="font-semibold text-right">
                      {job.location}
                    </span>

                  </div>

                  <div className="flex items-center justify-between text-slate-700">

                    <span className="flex items-center gap-1.5 text-slate-500">
                      <IndianRupee className="w-4 h-4 text-emerald-600" />
                      Salary:
                    </span>

                    <span className="font-extrabold text-[#072B57] text-sm">
                      {job.salary}
                    </span>

                  </div>

                  <div className="flex items-center justify-between text-slate-700">

                    <span className="text-slate-500">
                      Experience:
                    </span>

                    <span className="font-semibold">
                      {job.experience}
                    </span>

                  </div>

                </div>

                {/* Skills */}
                <div>

                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Required Skills:
                  </span>

                  <div className="flex flex-wrap gap-1.5">

                    {job.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[11px] font-medium bg-[#F8FAFC] text-slate-700 px-2 py-0.5 rounded border border-slate-200"
                      >
                        {skill}
                      </span>
                    ))}

                  </div>

                </div>

                {/* Demo HR Email */}
                <div className="flex items-center gap-2 rounded-lg bg-orange-50 border border-orange-100 px-3 py-2">

                  <Mail className="w-4 h-4 text-[#FF6B00] shrink-0" />

                  <div className="min-w-0">

                    <p className="text-[9px] font-bold uppercase tracking-wider text-orange-600">
                      Demo HR Email
                    </p>

                    <p className="text-[11px] font-semibold text-[#072B57] truncate">
                      {job.hrEmail}
                    </p>

                  </div>

                </div>

              </div>

              {/* Apply */}
              <div className="mt-6 pt-4 border-t border-slate-100">

                <button
                  onClick={() =>
                    onOpenApply(
                      `Job Placement: ${job.role}`,
                      job.hrEmail
                    )
                  }
                  type="button"
                  id={`apply-job-${job.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#072B57] hover:bg-[#0c3c78] text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#072B57]"
                >
                  <span>Apply for Role</span>
                  <ArrowRight className="w-4 h-4 text-[#FF6B00]" />
                </button>

              </div>

            </div>
          ))}

        </div>

        {/* Empty State */}
        {filteredJobs.length === 0 && (
          <div className="text-center py-16 border border-dashed border-slate-300 rounded-2xl">
            <Briefcase className="w-10 h-10 mx-auto text-slate-300 mb-3" />
            <h3 className="font-bold text-[#072B57]">
              No jobs found
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Try another filter.
            </p>
          </div>
        )}

        {/* Partners */}
        <div className="mt-14 pt-8 border-t border-slate-200 text-center">

          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-6">
            Our Graduates Work At Top Global Brands & Agencies
          </span>

          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-75 grayscale hover:grayscale-0 transition-all duration-300">

            {[
              'Google Partner Agencies',
              'Amazon India',
              'Swiggy',
              'Zomato Media',
              'Dentsu International',
              'GroupM',
              'Nykaa Growth',
              'Flipkart',
            ].map((brand, bIndex) => (
              <span
                key={bIndex}
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
