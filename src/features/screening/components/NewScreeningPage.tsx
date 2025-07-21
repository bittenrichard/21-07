import React from 'react';
import JobForm from './JobForm';
import { useJobForm } from '../hooks/useJobForm';
import { JobPosting } from '../types';

interface NewScreeningPageProps {
  onJobCreated: (newJob: JobPosting) => void;
  onCancel: () => void;
}

const NewScreeningPage: React.FC<NewScreeningPageProps> = ({
  onJobCreated,
  onCancel
}) => {
  const { formData, isSubmitting, updateField, submitJob, resetForm } = useJobForm();

  const handleSubmit = async () => {
    const newJob = await submitJob();
    resetForm();
    onJobCreated(newJob);
  };

  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  return (
    <div className="fade-in">
      <div className="bg-white p-8 rounded-lg shadow-sm max-w-4xl mx-auto">
        <h3 className="text-2xl font-semibold mb-6">Criar Nova Triagem de Vaga</h3>
        <JobForm
          formData={formData}
          onFieldChange={updateField}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default NewScreeningPage;