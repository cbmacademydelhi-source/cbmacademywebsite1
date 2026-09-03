import React, { FormEvent, useState } from 'react';
import {
  X,
  Building2,
  User,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  IndianRupee,
  Clock,
  Code2,
  Send,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface JobForm {
  companyName: string;
  hrName: string;
  hrEmail: string;
  hrPhone: string;
  jobTitle: string;
  jobDescription: string;
  location: string;
  salary: string;
  experience: string;
  skills: string;
  workType: string;
}

const initialForm: JobForm = {
  companyName: '',
  hrName: '',
  hrEmail: '',
  hrPhone: '',
  jobTitle: '',
  jobDescription: '',
  location: '',
  salary: '',
  experience: '',
  skills: '',
  workType: 'Full-time',
};

export const PostJobModal: React.FC<PostJobModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [form, setForm] = useState<JobForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) {
    return null;
  }

  const updateField = (
    field: keyof JobForm,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError('');
    setSuccess(false);

    if (
      !form.companyName.trim() ||
      !form.hrName.trim() ||
      !form.hrEmail.trim() ||
      !form.hrPhone.trim() ||
      !form.jobTitle.trim() ||
      !form.jobDescription.trim() ||
      !form.location.trim()
    ) {
      setError(
        'Please fill in all required fields.'
      );
      return;
    }

    setSubmitting(true);

    try {
      const skillsArray = form.skills
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean);

      const { error: insertError } = await supabase
        .from('job_listings')
        .insert({
          company_name: form.companyName.trim(),
          hr_name: form.hrName.trim(),
          hr_email: form.hrEmail.trim(),
          hr_phone: form.hrPhone.trim(),
          job_title: form.jobTitle.trim(),
          job_description: form.jobDescription.trim(),
          location: form.location.trim(),
          salary: form.salary.trim() || null,
          experience: form.experience.trim() || null,
          skills: skillsArray,
          work_type: form.workType,
          status: 'pending',
        });

      if (insertError) {
        console.error(
          'Post job error:',
          insertError
        );

        throw new Error(
          insertError.message ||
            'Unable to submit job.'
        );
      }

      setSuccess(true);
      setForm(initialForm);
    } catch (submitError) {
      console.error(
        'Employer job submission error:',
        submitError
      );

      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting) {
      return;
    }

    setError('');
    setSuccess(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between bg-[#072B57] px-5 py-4 sm:px-7">

          <div>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#FF6B00]" />

              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                Post a Job
              </h2>
            </div>

            <p className="mt-1 text-xs sm:text-sm text-blue-100">
              Share your opening with CBM Academy students and
              job seekers.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            aria-label="Close"
            className="rounded-full p-2 text-white transition hover:bg-white/10 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        {/* Content */}
        <div className="max-h-[calc(92vh-80px)] overflow-y-auto">

          {success ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center px-6 py-12 text-center">

              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                <CheckCircle2 className="h-9 w-9 text-emerald-600" />
              </div>

              <h3 className="mt-5 text-2xl font-extrabold text-[#072B57]">
                Job Submitted Successfully!
              </h3>

              <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-600">
                Thank you for submitting your job opening.
                Our team will review the details. Once approved,
                the job will appear publicly on the CBM Academy
                Jobs page.
              </p>

              <div className="mt-6 rounded-xl border border-orange-100 bg-orange-50 px-5 py-3 text-sm font-semibold text-orange-700">
                Status: Pending Admin Approval
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="mt-7 rounded-xl bg-[#072B57] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#0c3c78]"
              >
                Done
              </button>

            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-7 p-5 sm:p-7"
            >

              {/* Error */}
              {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                  <div>
                    <p className="font-bold">
                      Submission failed
                    </p>

                    <p className="mt-0.5">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {/* Company Details */}
              <div>

                <div className="mb-4">
                  <h3 className="text-base font-extrabold text-[#072B57]">
                    Company & HR Details
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    These details will be used for verification
                    and recruitment communication.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                  {/* Company */}
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700">
                      Company Name *
                    </label>

                    <div className="relative">
                      <Building2 className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />

                      <input
                        type="text"
                        value={form.companyName}
                        onChange={(event) =>
                          updateField(
                            'companyName',
                            event.target.value
                          )
                        }
                        placeholder="e.g. ABC Digital Pvt. Ltd."
                        className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-100"
                        required
                      />
                    </div>
                  </div>

                  {/* HR Name */}
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700">
                      HR / Recruiter Name *
                    </label>

                    <div className="relative">
                      <User className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />

                      <input
                        type="text"
                        value={form.hrName}
                        onChange={(event) =>
                          updateField(
                            'hrName',
                            event.target.value
                          )
                        }
                        placeholder="e.g. Priya Sharma"
                        className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-100"
                        required
                      />
                    </div>
                  </div>

                  {/* HR Email */}
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700">
                      HR Email *
                    </label>

                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />

                      <input
                        type="email"
                        value={form.hrEmail}
                        onChange={(event) =>
                          updateField(
                            'hrEmail',
                            event.target.value
                          )
                        }
                        placeholder="hr@company.com"
                        className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-100"
                        required
                      />
                    </div>
                  </div>

                  {/* HR Phone */}
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700">
                      HR Phone *
                    </label>

                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />

                      <input
                        type="tel"
                        value={form.hrPhone}
                        onChange={(event) =>
                          updateField(
                            'hrPhone',
                            event.target.value
                          )
                        }
                        placeholder="+91 98765 43210"
                        className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-[#FF6B00] focus:ring-2 ring-orange-100"
                        required
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* Job Details */}
              <div>

                <div className="mb-4">
                  <h3 className="text-base font-extrabold text-[#072B57]">
                    Job Details
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Tell candidates about the opportunity.
                  </p>
                </div>

                <div className="space-y-4">

                  {/* Job Title */}
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700">
                      Job Title *
                    </label>

                    <div className="relative">
                      <Briefcase className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />

                      <input
                        type="text"
                        value={form.jobTitle}
                        onChange={(event) =>
                          updateField(
                            'jobTitle',
                            event.target.value
                          )
                        }
                        placeholder="e.g. Performance Marketing Executive"
                        className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-100"
                        required
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700">
                      Job Description *
                    </label>

                    <textarea
                      value={form.jobDescription}
                      onChange={(event) =>
                        updateField(
                          'jobDescription',
                          event.target.value
                        )
                      }
                      placeholder="Describe responsibilities, requirements and other important details..."
                      rows={5}
                      className="w-full resize-none rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-800 outline-none transition focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-100"
                      required
                    />
                  </div>

                  {/* Location / Salary */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-slate-700">
                        Location *
                      </label>

                      <div className="relative">
                        <MapPin className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />

                        <input
                          type="text"
                          value={form.location}
                          onChange={(event) =>
                            updateField(
                              'location',
                              event.target.value
                            )
                          }
                          placeholder="e.g. Delhi NCR / Remote"
                          className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-100"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-slate-700">
                        Salary
                      </label>

                      <div className="relative">
                        <IndianRupee className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />

                        <input
                          type="text"
                          value={form.salary}
                          onChange={(event) =>
                            updateField(
                              'salary',
                              event.target.value
                            )
                          }
                          placeholder="e.g. ₹4–6 LPA"
                          className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-100"
                        />
                      </div>
                    </div>

                  </div>

                  {/* Experience / Work Type */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-slate-700">
                        Experience
                      </label>

                      <div className="relative">
                        <Clock className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />

                        <input
                          type="text"
                          value={form.experience}
                          onChange={(event) =>
                            updateField(
                              'experience',
                              event.target.value
                            )
                          }
                          placeholder="e.g. 0–2 years"
                          className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-slate-700">
                        Work Type
                      </label>

                      <select
                        value={form.workType}
                        onChange={(event) =>
                          updateField(
                            'workType',
                            event.target.value
                          )
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 outline-none transition focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-100"
                      >
                        <option value="Full-time">
                          Full-time
                        </option>

                        <option value="Part-time">
                          Part-time
                        </option>

                        <option value="Internship">
                          Internship
                        </option>

                        <option value="Contract">
                          Contract
                        </option>

                        <option value="Freelance">
                          Freelance
                        </option>
                      </select>
                    </div>

                  </div>

                  {/* Skills */}
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700">
                      Required Skills
                    </label>

                    <div className="relative">
                      <Code2 className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />

                      <input
                        type="text"
                        value={form.skills}
                        onChange={(event) =>
                          updateField(
                            'skills',
                            event.target.value
                          )
                        }
                        placeholder="Google Ads, Meta Ads, SEO, Analytics"
                        className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-100"
                      />
                    </div>

                    <p className="mt-1.5 text-[11px] text-slate-400">
                      Separate multiple skills with commas.
