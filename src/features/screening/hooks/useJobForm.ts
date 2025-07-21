import { useState } from 'react';
import { JobFormData, CreateJobRequest, JobPosting } from '../types';

export const useJobForm = () => {
  const [formData, setFormData] = useState<JobFormData>({
    jobTitle: '',
    jobDescription: '',
    requiredSkills: '',
    desiredSkills: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof JobFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const submitJob = async (): Promise<JobPosting> => {
    setIsSubmitting(true);
    
    const jobRequest: CreateJobRequest = {
      title: formData.jobTitle,
      description: formData.jobDescription,
      requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
      desiredSkills: formData.desiredSkills.split(',').map(s => s.trim()).filter(Boolean)
    };

    // Simulação de criação de job
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Criar o objeto JobPosting completo
    const newJob: JobPosting = {
      id: Date.now().toString(), // ID único baseado no timestamp
      title: jobRequest.title,
      description: jobRequest.description,
      requiredSkills: jobRequest.requiredSkills,
      desiredSkills: jobRequest.desiredSkills,
      createdAt: new Date(),
      status: 'active',
      candidateCount: 0,
      averageScore: 0
    };
    
    setIsSubmitting(false);
    return newJob;
  };

  const resetForm = () => {
    setFormData({
      jobTitle: '',
      jobDescription: '',
      requiredSkills: '',
      desiredSkills: ''
    });
  };

  return {
    formData,
    isSubmitting,
    updateField,
    submitJob,
    resetForm
  };
};