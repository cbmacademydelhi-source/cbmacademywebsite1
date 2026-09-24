export interface ApplicationFormData {
  fullName: string;
  email: string;
  phone: string;
  qualification: string;
  course: string;
  message?: string;
  honeypot?: string;
}

export interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  honeypot?: string;
}

export interface CourseModule {
  id: number;
  number: string;
  title: string;
  iconName: string;
  shortDescription: string;
  syllabus: string[];
  tools: string[];
  duration: string;
  level: string;
  liveProjects: string;
}

export interface AITool {
  name: string;
  category: string;
  description: string;
  icon: string;
  badge: string;
  useCase: string;
  capabilities: string[];
}

export interface JobOpportunity {
  id: string;
  role: string;
  companyCategory: string;
  location: string;
  isRemote: boolean;
  salary: string;
  experience: string;
  type: string;
  skills: string[];
  postedDaysAgo: number;

  // Demo HR email for job applications
  hrEmail: string;
}

export interface VerifiedCertificate {
  id: string;
  studentName: string;
  courseName: string;
  issueDate: string;
  completionDate: string;
  grade: string;
  credentialUrl: string;
  status: 'VERIFIED' | 'REVOKED' | 'EXPIRED';
  skillsVerified: string[];
  instructor: string;
  qrCodeSeed: string;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    role: string;
  };
  imageUrl: string;
  tags: string[];
}

export type WebinarType = 'free' | 'paid';
export type WebinarStatus = 'upcoming' | 'published' | 'draft' | 'completed';
export type WebinarPaymentStatus = 'not_required' | 'pending' | 'paid' | 'failed' | 'expired';
export type WebinarRegistrationStatus = 'pending' | 'approved' | 'cancelled';

export interface Webinar {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  type: WebinarType;
  price?: number | string;
  date: string;
  time: string;
  duration: string;
  host: string;
  whatYouWillLearn: string[];
  registrationLink?: string;
  status: WebinarStatus;
  max_capacity?: number;
  current_registrations?: number;
  createdAt: string;
}

export interface WebinarRegistration {
  id: string;
  webinar_id: string;
  webinar_title?: string;
  webinarId?: string;
  webinarTitle?: string;
  full_name: string;
  fullName?: string;
  email: string;
  phone: string;
  message?: string;
  registration_type: 'free' | 'paid';
  amount: number;
  currency: string;
  payment_status: WebinarPaymentStatus;
  registration_status?: WebinarRegistrationStatus;
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
  razorpay_signature?: string | null;
  razorpay_qr_id?: string | null;
  created_at: string;
  registeredAt?: string;
  paid_at?: string | null;
}

export interface FormSubmissionResult {
  success: boolean;
  message: string;
  registrationId?: string;
  orderId?: string;
  qrId?: string;
  qrImageUrl?: string;
  qrPayload?: string;
  amount?: number;
  currency?: string;
  keyId?: string;
  code?: string;
}
