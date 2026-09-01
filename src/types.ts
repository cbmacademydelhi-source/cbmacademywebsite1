export interface JobOpportunity {
  id: string;
  role: string;
  companyCategory: string;
  hrEmail?: string;
  location: string;
  isRemote: boolean;
  salary: string;
  experience: string;
  type: string;
  skills: string[];
  postedDaysAgo: number;
}
