import { supabase } from "../lib/supabase";
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
 * Helper to securely insert into Supabase 'contact_submissions' table.
 * First tries direct client-side insert with the publishable key.
 * If direct insert encounters an RLS policy restriction or network error,
 * securely falls back to the server endpoint so data is never lost.
 */
async function insertIntoContactSubmissions(record: {
  full_name: string;
  email: string;
  phone: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  let directErrorMsg = "";

  // 1. Direct Supabase Client insertion (Publishable key)
  try {
    const { data, error } = await supabase
      .from("contact_submissions")
      .insert([
        {
          full_name: record.full_name,
          email: record.email,
          phone: record.phone,
          message: record.message,
        },
      ])
      .select();

    if (!error && data && data.length > 0) {
      return { success: true };
    }

    if (error) {
      directErrorMsg = error.message;
      console.warn("Direct Supabase insert notice:", error.message);
    }
  } catch (err: any) {
    directErrorMsg = err?.message || "Supabase connection error";
    console.warn("Direct Supabase insert exception:", err);
  }

  // 2. Server-side proxy insertion fallback
  try {
    const response = await fetch("/api/forms/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: record.full_name,
        email: record.email,
        phone: record.phone,
        message: record.message,
      }),
    });

    if (response.ok) {
      const serverResult = await response.json();
      if (serverResult.success) {
        return { success: true };
      }
      if (serverResult.message) {
        directErrorMsg = serverResult.message;
      }
    }
  } catch (serverErr) {
    console.warn("Server fallback insert error:", serverErr);
  }

  return {
    success: false,
    error: directErrorMsg || "Database submission could not be completed.",
  };
}

/**
 * Send backup email notification via Web3Forms (non-blocking)
 */
async function sendNotificationEmail(payload: Record<string, any>): Promise<void> {
  try {
    await fetch(WEB3FORMS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.warn("Web3Forms email notification background note:", err);
  }
}

/**
 * Real Supabase INSERT into 'form_submissions' table using @supabase/supabase-js.
 * Columns: Name, Email, Phone, Course, Message
 * First attempts direct insert using the official Supabase client.
 * If direct insert encounters an RLS policy restriction, safely proxies to
 * the server endpoint so student submissions are never lost.
 */
async function insertIntoFormSubmissions(record: {
  Name: string;
  Email: string;
  Phone: string;
  Course: string;
  Message: string;
}): Promise<{ success: boolean; error?: string }> {
  let directErrorMsg = "";

  // 1. Direct Supabase Client insertion with @supabase/supabase-js
  try {
    const { data, error } = await supabase
      .from("form_submissions")
      .insert([
        {
          Name: record.Name,
          Email: record.Email,
          Phone: record.Phone,
          Course: record.Course,
          Message: record.Message,
        },
      ])
      .select();

    if (!error && data && data.length > 0) {
      return { success: true };
    }

    if (error) {
      directErrorMsg = error.message;
      console.warn("Direct Supabase form_submissions insert note:", error.message);
    }
  } catch (err: any) {
    directErrorMsg = err?.message || "Supabase connection error";
    console.warn("Direct Supabase form_submissions insert exception:", err);
  }

  // 2. Server-side proxy insertion fallback (ensures submission succeeds if RLS policy is pending)
  try {
    const response = await fetch("/api/forms/apply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Name: record.Name,
        Email: record.Email,
        Phone: record.Phone,
        Course: record.Course,
        Message: record.Message,
      }),
    });

    if (response.ok) {
      const serverResult = await response.json();
      if (serverResult.success) {
        return { success: true };
      }
      if (serverResult.message) {
        directErrorMsg = serverResult.message;
      }
    }
  } catch (serverErr) {
    console.warn("Server fallback insert error:", serverErr);
  }

  return {
    success: false,
    error: directErrorMsg || "Database submission could not be completed.",
  };
}

/**
 * Submit Course Application
 * Performs a real Supabase INSERT into the existing 'form_submissions' table.
 * Fields mapped: Name, Email, Phone, Course, Message.
 * Shows success ONLY after the Supabase INSERT succeeds.
 */
export async function submitApplicationForm(
  data: ApplicationFormData
): Promise<FormSubmissionResult> {
  // Honeypot / Spam Protection
  if (data.honeypot && data.honeypot.trim() !== "") {
    return {
      success: false,
      message: "Spam detected. Submission blocked.",
    };
  }

  // Input Validation
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

  const formattedMessage = data.qualification
    ? `Qualification: ${data.qualification.trim()}${data.message?.trim() ? `\nApplicant Note: ${data.message.trim()}` : ""}`
    : (data.message?.trim() || "Course Application");

  // Perform real Supabase INSERT into form_submissions table
  const dbResult = await insertIntoFormSubmissions({
    Name: data.fullName.trim(),
    Email: data.email.trim(),
    Phone: data.phone.trim(),
    Course: data.course.trim(),
    Message: formattedMessage,
  });

  // Success message must appear ONLY after Supabase INSERT succeeds.
  // If the INSERT fails, return the error.
  if (!dbResult.success) {
    return {
      success: false,
      message:
        dbResult.error ||
        "We could not save your application to the database at this time. Please try again.",
    };
  }

  // Also sync to contact_submissions table in background
  insertIntoContactSubmissions({
    full_name: data.fullName.trim(),
    email: data.email.trim(),
    phone: data.phone.trim(),
    message: `Application Track: ${data.course.trim()}\n${formattedMessage}`,
  }).catch(() => {});

  // Keep existing email submission (do not remove it)
  sendNotificationEmail({
    access_key: WEB3FORMS_ACCESS_KEY,
    subject: `New CBM Academy Course Application - ${data.fullName.trim()}`,
    from_name: "CBM Academy Website",
    name: data.fullName.trim(),
    email: data.email.trim(),
    phone: data.phone.trim(),
    qualification: data.qualification.trim(),
    course: data.course.trim(),
    message: data.message?.trim() || "None provided",
    submission_source: "CBM Academy Official Website - Apply Now",
    submitted_at: new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    }),
    botcheck: "",
  });

  return {
    success: true,
    message:
      "Thank you! Your application has been sent to CBM Academy. Our admissions team will contact you within 24 hours.",
  };
}


/**
 * Submit Contact Inquiry
 * Inserts directly into Supabase 'contact_submissions'
 */
export async function submitContactForm(
  data: ContactFormData
): Promise<FormSubmissionResult> {
  // Honeypot / Spam Protection
  if (data.honeypot && data.honeypot.trim() !== "") {
    return {
      success: false,
      message: "Spam detected. Submission blocked.",
    };
  }

  // Input Validation
  if (
    !data.fullName?.trim() ||
    !data.email?.trim() ||
    !data.phone?.trim() ||
    (!data.message?.trim() && !data.subject?.trim())
  ) {
    return {
      success: false,
      message: "Please fill in all required fields.",
    };
  }

  const formattedMessage = data.subject?.trim()
    ? `Subject: ${data.subject.trim()}\n\n${(data.message || "").trim()}`
    : (data.message || "").trim();

  // Insert into Supabase contact_submissions table
  const dbResult = await insertIntoContactSubmissions({
    full_name: data.fullName.trim(),
    email: data.email.trim(),
    phone: data.phone.trim(),
    message: formattedMessage,
  });

  if (!dbResult.success) {
    return {
      success: false,
      message:
        dbResult.error ||
        "We could not send your message right now. Please try again.",
    };
  }

  // Send email notification to academy office in background
  sendNotificationEmail({
    access_key: WEB3FORMS_ACCESS_KEY,
    subject: `New CBM Academy Website Inquiry - ${(data.subject || "General Inquiry").trim()}`,
    from_name: "CBM Academy Website",
    name: data.fullName.trim(),
    email: data.email.trim(),
    phone: data.phone.trim(),
    inquiry_subject: (data.subject || "General Inquiry").trim(),
    message: data.message?.trim() || "",
    submission_source: "CBM Academy Official Website - Contact",
    submitted_at: new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    }),
    botcheck: "",
  });

  return {
    success: true,
    message:
      "Thank you! Your inquiry has been sent to CBM Academy. Our team will get back to you within 24 hours.",
  };
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
 * FLOW:
 *
 * 1. Save job to Cloudflare KV through CBM Jobs API
 * 2. Send notification email through Web3Forms
 * 3. Show success
 *
 * The job MUST be successfully saved first.
 */
export async function submitJobPosting(
  data: JobPostingFormData
): Promise<FormSubmissionResult> {
  if (
    data.honeypot &&
    data.honeypot.trim() !== ""
  ) {
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
  STEP 1
  SAVE JOB TO CLOUDFLARE KV
  ========================================
  */

  const skillsArray =
    data.skills
      ? data.skills
          .split(",")
          .map((skill) =>
            skill.trim()
          )
          .filter(Boolean)
      : [];

  const jobPayload = {
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
      data.salary?.trim() ||
      null,

    experience:
      data.experience?.trim() ||
      null,

    skills:
      skillsArray,

    work_type:
      data.workType.trim(),
  };

  try {
    const response =
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
              jobPayload
            ),
        }
      );

    const responseText =
      await response.text();

    let result: any = {};

    try {
      result =
        responseText
          ? JSON.parse(
              responseText
            )
          : {};
    } catch {
      result = {};
    }

    if (!response.ok) {
      console.error(
        "CBM Jobs API error:",
        response.status,
        responseText
      );

      return {
        success: false,
        message:
          result.error ||
          `Unable to save job. Server error ${response.status}.`,
      };
    }

    if (
      result.success !== true
    ) {
      console.error(
        "CBM Jobs API unsuccessful response:",
        result
      );

      return {
        success: false,
        message:
          result.error ||
          "Unable to save the job posting.",
      };
    }

    console.log(
      "CBM job saved successfully:",
      result.job
    );
  } catch (error) {
    console.error(
      "CBM Jobs API request failed:",
      error
    );

    return {
      success: false,
      message:
        "Unable to save the job posting right now. Please check your internet connection and try again.",
    };
  }


  /*
  ========================================
  STEP 2
  SEND ADMIN EMAIL
  ========================================
  */

  const emailPayload = {
    access_key:
      WEB3FORMS_ACCESS_KEY,

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
      data.salary?.trim() ||
      "Not provided",

    experience:
      data.experience?.trim() ||
      "Not provided",

    skills:
      data.skills?.trim() ||
      "Not provided",

    work_type:
      data.workType.trim(),

    status:
      "PENDING ADMIN REVIEW",

    submission_source:
      "CBM Academy Official Website - Post a Job",

    submitted_at:
      new Date().toLocaleString(
        "en-IN",
        {
          timeZone: "Asia/Kolkata",
        }
      ),

    botcheck: "",
  };

  try {
    const response =
      await fetch(
        WEB3FORMS_URL,
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
              emailPayload
            ),
        }
      );

    const result =
      await response.json();

    if (
      !response.ok ||
      !result.success
    ) {
      console.warn(
        "Web3Forms notification failed:",
        result
      );

      /*
       * IMPORTANT:
       * Job is already safely stored in KV.
       * Therefore we still report success.
       */
    }
  } catch (error) {
    console.warn(
      "Web3Forms notification error:",
      error
    );

    /*
     * Job is already safely stored in KV.
     * Do not make the employer submit again.
     */
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

export interface BrochureLeadData {
  studentName: string;
  email: string;
  phone: string;
  honeypot?: string;
}

/**
 * Submit Brochure Download Request
 * Saves student details (Student Name, Email ID, Phone Number) securely in Supabase.
 */
export async function submitBrochureRequest(
  data: BrochureLeadData
): Promise<FormSubmissionResult> {
  if (data.honeypot && data.honeypot.trim() !== '') {
    return {
      success: false,
      message: 'Spam detected. Submission blocked.',
    };
  }

  if (
    !data.studentName?.trim() ||
    !data.email?.trim() ||
    !data.phone?.trim()
  ) {
    return {
      success: false,
      message: 'Please provide Student Name, Email ID, and Phone Number.',
    };
  }

  // 1. Direct Supabase insert into form_submissions
  let dbResult = await insertIntoFormSubmissions({
    Name: data.studentName.trim(),
    Email: data.email.trim(),
    Phone: data.phone.trim(),
    Course: '2026 Course Brochure',
    Message: 'Student downloaded 2026 Digital Marketing Course Brochure',
  });

  // If direct client insert was blocked or failed, use server proxy
  if (!dbResult.success) {
    try {
      const resp = await fetch('/api/forms/brochure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: data.studentName.trim(),
          email: data.email.trim(),
          phone: data.phone.trim(),
        }),
      });
      if (resp.ok) {
        const json = await resp.json();
        if (json.success) {
          dbResult = { success: true };
        }
      }
    } catch (err) {
      console.warn('Brochure server proxy error:', err);
    }
  }

  if (!dbResult.success) {
    return {
      success: false,
      message:
        dbResult.error ||
        'Could not save details to database. Please check your connection and try again.',
    };
  }

  // Also sync to contact_submissions in background
  insertIntoContactSubmissions({
    full_name: data.studentName.trim(),
    email: data.email.trim(),
    phone: data.phone.trim(),
    message: 'Student downloaded 2026 Digital Marketing Course Brochure',
  }).catch(() => {});

  // Background email notification
  sendNotificationEmail({
    access_key: WEB3FORMS_ACCESS_KEY,
    subject: `New Brochure Download - ${data.studentName.trim()}`,
    from_name: 'CBM Academy Website',
    name: data.studentName.trim(),
    email: data.email.trim(),
    phone: data.phone.trim(),
    course: '2026 Course Brochure',
    message: 'Student requested and unlocked 2026 Course Brochure download',
    submission_source: 'CBM Academy Official Website - Download Brochure',
    submitted_at: new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
    }),
    botcheck: '',
  });

  return {
    success: true,
    message: 'Details saved successfully.',
  };
}

