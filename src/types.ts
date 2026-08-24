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

export interface FormSubmissionResult {
  success: boolean;
  message: string;
}
