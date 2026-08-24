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
