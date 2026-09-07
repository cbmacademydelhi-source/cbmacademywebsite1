import {
  ApplicationFormData,
  ContactFormData,
  FormSubmissionResult,
} from "../types";

const WEB3FORMS_ACCESS_KEY =
  "4a2c0a81-481c-4274-a599-cc3f97947c19";

export const TARGET_NOTIFICATION_EMAIL =
  "office@cbmacademy.in";

const WEB3FORMS_URL =
  "https://api.web3forms.com/submit";

const JOBS_API =
  "https://cbm-jobs-api.cbmacademydelhi.workers.dev";


/**
 * Submit Course Application
 */
export async function submitApplicationForm(
  data: ApplicationFormData
): Promise<FormSubmissionResult> {

  if (data.honeypot && data.honeypot.trim() !== "") {
    return {
      success: false,
      message: "Spam detected. Submission blocked.",
    };
  }

  if (
    !data.fullName?.trim() ||
    !data.email?.trim() ||
    !data.phone?.trim() ||
    !data.qualification?.trim() ||
    !data.course?.trim()
  ) {
    return {
      success: false,
      message: "Please fill in all required fields.",
    };
  }

  const payload = {
    access_key: WEB3FORMS_ACCESS_KEY,

    subject:
      `New CBM Academy Course Application - ${data.fullName.trim()}`,

    from_name: "CBM Academy Website",

    name: data.fullName.trim(),

    email: data.email.trim(),

    phone: data.phone.trim(),

    qualification: data.qualification.trim(),

    course: data.course.trim(),

    message:
      data.message?.trim() || "None provided",

    submission_source:
      "CBM Academy Official Website - Apply Now",

    submitted_at:
      new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      }),

    botcheck: "",
  };

  try {
    const response = await fetch(
      WEB3FORMS_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (response.ok && result.success) {
      return {
        success: true,
        message:
          "Thank you! Your application has been sent to CBM Academy. Our admissions team will contact you within 24 hours.",
      };
    }

    return {
      success: false,
      message:
        result.message ||
        "We couldn't send your application right now. Please try again.",
    };

  } catch (error) {

    console.error(
      "Application form submission error:",
      error
    );

    return {
      success: false,
      message:
        "We couldn't send your application right now. Please check your internet connection and try again.",
    };
  }
}


/**
 * Submit Contact Inquiry
 */
export async function submitContactForm(
  data: ContactFormData
): Promise<FormSubmissionResult> {

  if (data.honeypot && data.honeypot.trim() !== "") {
    return {
      success: false,
      message: "Spam detected. Submission blocked.",
    };
  }

  if (
    !data.fullName?.trim() ||
    !data.email?.trim() ||
    !data.phone?.trim() ||
    !data.subject?.trim() ||
    !data.message?.trim()
  ) {
    return {
      success: false,
      message: "Please fill in all required fields.",
    };
  }

  const payload = {
    access_key: WEB3FORMS_ACCESS_KEY,

    subject:
      `New CBM Academy Website Inquiry - ${data.subject.trim()}`,

    from_name: "CBM Academy Website",

    name: data.fullName.trim(),

    email: data.email.trim(),

    phone: data.phone.trim(),

    inquiry_subject: data.subject.trim(),

    message: data.message.trim(),

    submission_source:
      "CBM Academy Official Website - Contact",

    submitted_at:
      new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      }),

    botcheck: "",
  };

  try {
    const response = await fetch(
      WEB3FORMS_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (response.ok && result.success) {
      return {
        success: true,
        message:
          "Thank you! Your inquiry has been sent to CBM Academy. Our team will get back to you within 24 hours.",
      };
    }

    return {
      success: false,
      message:
        result.message ||
        "We couldn't send your message right now. Please try again.",
    };

  } catch (error) {

    console.error(
      "Contact form submission error:",
      error
    );

    return {
      success: false,
      message:
        "We couldn't send your message right now. Please check your internet connection and try again.",
    };
  }
}


/**
 * Job Posting Form Data
 */
export interface JobPostingFormData {
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
  honeypot?: string;
}


/**
 * Submit Job Posting
 *
 * IMPORTANT:
 *
 * 1. Web3Forms remains the PRIMARY submission.
 * 2. After successful email submission,
 *    the job is also sent to the CBM Jobs API.
 * 3. Database failure will NOT make the
 *    employer submission fail.
 */
export async function submitJobPosting(
  data: JobPostingFormData
): Promise<FormSubmissionResult> {

  if (data.honeypot && data.honeypot.trim() !== "") {
    return {
      success: false,
      message: "Spam detected. Submission blocked.",
    };
  }

  if (
    !data.companyName?.trim() ||
    !data.hrName?.trim() ||
    !data.hrEmail?.trim() ||
    !data.hrPhone?.trim() ||
    !data.jobTitle?.trim() ||
    !data.jobDescription?.trim() ||
    !data.location?.trim() ||
    !data.workType?.trim()
  ) {
    return {
      success: false,
      message: "Please fill in all required fields.",
    };
  }

  /*
  ========================================
  STEP 1 — WEB3FORMS
  ========================================
  */

  const emailPayload = {
    access_key: WEB3FORMS_ACCESS_KEY,

    subject:
      `New Job Posting for Review - ${data.jobTitle.trim()} - ${data.companyName.trim()}`,

    from_name:
      "CBM Academy Job Portal",

    name:
      data.hrName.trim(),

    email:
      data.hrEmail.trim(),

    phone:
      data.hrPhone.trim(),

    company_name:
      data.companyName.trim(),

    hr_name:
      data.hrName.trim(),

    hr_email:
      data.hrEmail.trim(),

    hr_phone:
      data.hrPhone.trim(),

    job_title:
      data.jobTitle.trim(),

    job_description:
      data.jobDescription.trim(),

    location:
      data.location.trim(),

    salary:
      data.salary?.trim() || "Not provided",

    experience:
      data.experience?.trim() || "Not provided",

    skills:
      data.skills?.trim() || "Not provided",

    work_type:
      data.workType.trim(),

    status:
      "PENDING ADMIN REVIEW",

    submission_source:
      "CBM Academy Official Website - Post a Job",

    submitted_at:
      new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      }),

    botcheck: "",
  };

  try {

    const response = await fetch(
      WEB3FORMS_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(
          emailPayload
        ),
      }
    );

    const result =
      await response.json();

    /*
    If Web3Forms itself fails,
    we DO show an error because this
    is the primary submission.
    */

    if (
      !response.ok ||
      !result.success
    ) {
      return {
        success: false,
        message:
          result.message ||
          "We couldn't submit the job right now. Please try again.",
      };
    }

  } catch (error) {

    console.error(
      "Web3Forms job submission error:",
      error
    );

    return {
      success: false,
      message:
        "We couldn't submit the job right now. Please check your internet connection and try again.",
    };
  }


  /*
  ========================================
  STEP 2 — SAVE JOB TO DATABASE
  ========================================

  This is intentionally BEST-EFFORT.

  If Supabase/Worker is temporarily down,
  the Web3Forms submission above has already
  succeeded, so we still report success.

  This prevents the working Post a Job
  form from breaking because of a database
  outage.
  */

  try {

    const skillsArray =
      data.skills
        ? data.skills
            .split(",")
            .map((skill) =>
              skill.trim()
            )
            .filter(Boolean)
        : [];

    const databasePayload = {
      company_name:
        data.companyName.trim(),

      hr_name:
        data.hrName.trim(),

      hr_email:
        data.hrEmail.trim(),

      hr_phone:
        data.hrPhone.trim(),

      job_title:
        data.jobTitle.trim(),

      job_description:
        data.jobDescription.trim(),

      location:
        data.location.trim(),

      salary:
        data.salary?.trim() || null,

      experience:
        data.experience?.trim() || null,

      skills:
        skillsArray,

      work_type:
        data.workType.trim(),
    };

    const databaseResponse =
      await fetch(
        `${JOBS_API}/jobs`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
            Accept:
              "application/json",
          },

          body:
            JSON.stringify(
              databasePayload
            ),
        }
      );

    if (!databaseResponse.ok) {

      const errorText =
        await databaseResponse.text();

      console.warn(
        "Job database save failed:",
        databaseResponse.status,
        errorText
      );

    } else {

      console.log(
        "Job saved to CBM Jobs database successfully."
      );

    }

  } catch (error) {

    /*
    IMPORTANT:

    Do NOT throw here.

    Web3Forms already succeeded.
    Therefore employer submission
    must remain successful.
    */

    console.warn(
      "Job database save temporarily unavailable:",
      error
    );
  }


  /*
  ========================================
  FINAL SUCCESS
  ========================================
  */

  return {
    success: true,
    message:
      "Your job has been submitted successfully for CBM Academy's review. We will review the details before publishing the job.",
  };
}
