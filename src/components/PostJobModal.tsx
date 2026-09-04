import React, { FormEvent, useState } from 'react';
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Briefcase,
  Clock,
  Code2,
  IndianRupee,
  Mail,
  MapPin,
  Phone,
  Send,
  User,
  X,
} from 'lucide-react';

import {
  submitJobPosting,
  JobPostingFormData,
} from '../services/formService';

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialForm: JobPostingFormData = {
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
  honeypot: '',
};

export const PostJobModal: React.FC<PostJobModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [form, setForm] =
    useState<JobPostingFormData>(initialForm);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) {
    return null;
  }

  const updateField = (
    field: keyof JobPostingFormData,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError('');
  };

  const closeModal = () => {
    if (loading) {
      return;
    }

    setForm(initialForm);
    setSuccess(false);
    setError('');
    onClose();
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError('');
    setSuccess(false);

    const requiredFields = [
      form.companyName,
      form.hrName,
      form.hrEmail,
      form.hrPhone,
      form.jobTitle,
      form.jobDescription,
      form.location,
      form.workType,
    ];

    if (
      requiredFields.some(
        (field) => !field || !field.trim()
      )
    ) {
      setError(
        'Please fill in all required fields.'
      );
      return;
    }

    if (
      form.honeypot &&
      form.honeypot.trim()
    ) {
      setError(
        'We could not submit this form.'
      );
      return;
    }

    setLoading(true);

    try {
      /*
        FINAL SUBMISSION METHOD

        The job is submitted directly through
        the existing Web3Forms service.

        No Cloudflare Jobs API.
        No Supabase request.
      */

      const result =
        await submitJobPosting(form);

      if (!result.success) {
        throw new Error(
          result.message ||
            'We could not submit the job right now. Please try again.'
        );
      }

      setSuccess(true);
      setForm(initialForm);
    } catch (submitError) {
      console.error(
        'Post job submission error:',
        submitError
      );

      const message =
        submitError instanceof Error
          ? submitError.message
          : 'We could not submit the job right now. Please try again.';

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closeModal();
        }
      }}
    >
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between bg-[#072B57] px-5 py-4 sm:px-7">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#FF6B00]" />

              <h2 className="text-lg font-extrabold text-white sm:text-xl">
                Post a Job
              </h2>
            </div>

            <p className="mt-1 text-xs text-blue-100 sm:text-sm">
              Submit your job opening to CBM Academy.
            </p>
          </div>

          <button
            type="button"
            onClick={closeModal}
            disabled={loading}
            className="rounded-full p-2 text-white hover:bg-white/10 disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[calc(92vh-80px)] overflow-y-auto">

          {/* SUCCESS SCREEN */}
          {success ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center px-6 py-12 text-center">

              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                <CheckCircle2 className="h-9 w-9 text-emerald-600" />
              </div>

              <h3 className="mt-5 text-2xl font-extrabold text-[#072B57]">
                Job Submitted Successfully!
              </h3>

              <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-600">
                Your job opening has been submitted
                successfully. CBM Academy will review it
                before publishing it on the Jobs page.
              </p>

              <div className="mt-5 rounded-xl border border-orange-100 bg-orange-50 px-5 py-3 text-sm font-bold text-orange-700">
                Status: Pending Approval
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="mt-7 rounded-xl bg-[#072B57] px-7 py-3 text-sm font-bold text-white hover:bg-[#0c3c78]"
              >
                Done
              </button>

            </div>
          ) : (

            /* FORM */
            <form
              onSubmit={handleSubmit}
              className="space-y-7 p-5 sm:p-7"
            >

              {/* Hidden honeypot */}
              <input
                type="text"
                value={form.honeypot || ''}
                onChange={(event) =>
                  updateField(
                    'honeypot',
                    event.target.value
                  )
                }
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
              />

              {/* Error */}
              {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                  <div>
                    <p className="font-bold">
                      Submission failed
                    </p>

                    <p className="mt-1">
                      {error}
                    </p>
                  </div>

                </div>
              )}

              {/* Company Details */}
              <section>

                <h3 className="text-base font-extrabold text-[#072B57]">
                  Company & HR Details
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Enter the company and recruitment contact details.
                </p>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">

                  <FormInput
                    label="Company Name *"
                    icon={<Building2 />}
                    value={form.companyName}
                    onChange={(value) =>
                      updateField(
                        'companyName',
                        value
                      )
                    }
                    placeholder="ABC Digital Pvt. Ltd."
                    required
                  />

                  <FormInput
                    label="HR / Recruiter Name *"
                    icon={<User />}
                    value={form.hrName}
                    onChange={(value) =>
                      updateField(
                        'hrName',
                        value
                      )
                    }
                    placeholder="Priya Sharma"
                    required
                  />

                  <FormInput
                    label="HR Email *"
                    icon={<Mail />}
                    type="email"
                    value={form.hrEmail}
                    onChange={(value) =>
                      updateField(
                        'hrEmail',
                        value
                      )
                    }
                    placeholder="hr@company.com"
                    required
                  />

                  <FormInput
                    label="HR Phone *"
                    icon={<Phone />}
                    type="tel"
                    value={form.hrPhone}
                    onChange={(value) =>
                      updateField(
                        'hrPhone',
                        value
                      )
                    }
                    placeholder="+91 98765 43210"
                    required
                  />

                </div>
              </section>

              {/* Job Details */}
              <section>

                <h3 className="text-base font-extrabold text-[#072B57]">
                  Job Details
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Tell candidates about the job opportunity.
                </p>

                <div className="mt-4 space-y-4">

                  {/* Job Title */}
                  <FormInput
                    label="Job Title *"
                    icon={<Briefcase />}
                    value={form.jobTitle}
                    onChange={(value) =>
                      updateField(
                        'jobTitle',
                        value
                      )
                    }
                    placeholder="Performance Marketing Executive"
                    required
                  />

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
                      rows={5}
                      placeholder="Describe responsibilities, requirements and important details..."
                      className="w-full resize-none rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-800 outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-100"
                      required
                    />

                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                    {/* Location */}
                    <FormInput
                      label="Location *"
                      icon={<MapPin />}
                      value={form.location}
                      onChange={(value) =>
                        updateField(
                          'location',
                          value
                        )
                      }
                      placeholder="Delhi NCR / Remote"
                      required
                    />

                    {/* Salary */}
                    <FormInput
                      label="Salary"
                      icon={<IndianRupee />}
                      value={form.salary}
                      onChange={(value) =>
                        updateField(
                          'salary',
                          value
                        )
                      }
                      placeholder="₹4–6 LPA"
                    />

                    {/* Experience */}
                    <FormInput
                      label="Experience"
                      icon={<Clock />}
                      value={form.experience}
                      onChange={(value) =>
                        updateField(
                          'experience',
                          value
                        )
                      }
                      placeholder="0–2 years"
                    />

                    {/* Work Type */}
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
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-100"
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

                        <option value="Remote">
                          Remote
                        </option>

                        <option value="Hybrid">
                          Hybrid
                        </option>

                      </select>

                    </div>

                  </div>

                  {/* Skills */}
                  <FormInput
                    label="Required Skills"
                    icon={<Code2 />}
                    value={form.skills}
                    onChange={(value) =>
                      updateField(
                        'skills',
                        value
                      )
                    }
                    placeholder="Google Ads, Meta Ads, SEO, Analytics"
                  />

                  <p className="text-[11px] text-slate-400">
                    Separate multiple skills with commas.
                  </p>

                </div>
              </section>

              {/* Approval Notice */}
              <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">

                <p className="text-xs leading-relaxed text-[#072B57]">
                  <strong>Review process:</strong> Your job will
                  first be reviewed by CBM Academy. Only approved
                  jobs will appear publicly.
                </p>

              </div>

              {/* Buttons */}
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={loading}
                  className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6B00] px-7 py-3 text-sm font-extrabold text-white shadow-md hover:bg-[#e85f00] disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Submit Job for Review
                    </>
                  )}

                </button>

              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
};


/* =========================
   FORM INPUT COMPONENT
========================= */

interface FormInputProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  icon,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
}) => {
  return (
    <div>

      <label className="mb-1.5 block text-xs font-bold text-slate-700">
        {label}
      </label>

      <div className="relative">

        <span className="pointer-events-none absolute left-3 top-3.5 text-slate-400">
          {React.isValidElement(icon)
            ? React.cloneElement(icon, {
                className: 'h-4 w-4',
              })
            : icon}
        </span>

        <input
          type={type}
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder={placeholder}
          required={required}
          className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm text-slate-800 outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-100"
        />

      </div>

    </div>
  );
};
