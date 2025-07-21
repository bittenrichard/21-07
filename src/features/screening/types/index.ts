export interface JobPosting {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  desiredSkills: string[];
  createdAt: Date;
  status: 'active' | 'closed';
  candidateCount: number;
  averageScore: number;
}

export interface JobFormData {
  jobTitle: string;
  jobDescription: string;
  requiredSkills: string;
  desiredSkills: string;
}

export interface CreateJobRequest {
  title: string;
  description: string;
  requiredSkills: string[];
  desiredSkills: string[];
}