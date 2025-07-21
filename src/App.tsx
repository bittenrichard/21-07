import React, { useEffect, useCallback, useState } from 'react';
import { useAuth } from './features/auth/hooks/useAuth';
import { useNavigation } from './shared/hooks/useNavigation';
import LoginPage from './features/auth/components/LoginPage';
import MainLayout from './shared/components/Layout/MainLayout';
import DashboardPage from './features/dashboard/components/DashboardPage';
import NewScreeningPage from './features/screening/components/NewScreeningPage';
import ResultsPage from './features/results/components/ResultsPage';
import { JobPosting } from './features/screening/types';
import { supabase } from './shared/services/supabaseClient';

const initialJobs: JobPosting[] = [
  { id: '1', title: 'Desenvolvedor Backend Pleno', description: '', requiredSkills: [], desiredSkills: [], createdAt: new Date(), status: 'active', candidateCount: 0, averageScore: 0 },
  { id: '2', title: 'Engenheiro de Dados Sênior', description: '', requiredSkills: [], desiredSkills: [], createdAt: new Date(), status: 'active', candidateCount: 0, averageScore: 0 },
  { id: '3', title: 'Product Manager', description: '', requiredSkills: [], desiredSkills: [], createdAt: new Date(), status: 'closed', candidateCount: 0, averageScore: 0 }
];

function App() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();
  const { currentPage, navigateTo } = useNavigation();
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [jobs, setJobs] = useState<JobPosting[]>(initialJobs);

  const syncJobData = useCallback(async () => {
    // Usamos a forma funcional do setJobs para garantir que estamos lendo o estado mais recente
    setJobs(currentJobs => {
      const fetchAndUpdate = async () => {
        if (currentJobs.length === 0) return;

        const jobDataPromises = currentJobs.map(job => 
          supabase
            .from('triagens')
            .select('SCORE', { count: 'exact' })
            .eq('job_id', job.id)
        );

        try {
          const results = await Promise.all(jobDataPromises);
          
          const updatedJobs = currentJobs.map((job, index) => {
            const result = results[index];
            const candidateCount = result.count ?? 0;
            const candidates = result.data || [];
            
            let averageScore = 0;
            if (candidateCount > 0) {
              const totalScore = candidates.reduce((acc, curr) => acc + (curr.SCORE || 0), 0);
              averageScore = Math.round(totalScore / candidateCount);
            }

            return { ...job, candidateCount, averageScore };
          });
          
          setJobs(updatedJobs);
        } catch (error) {
          console.error("Erro ao sincronizar dados das vagas:", error);
        }
      };
      
      fetchAndUpdate();
      return currentJobs; // Retorna o estado atual imediatamente, a atualização virá depois
    });
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      syncJobData();
    }
  }, [isAuthenticated, syncJobData]);

  const handleDeleteJob = async (jobId: string, jobTitle: string) => {
    if (window.confirm(`Tem certeza que deseja excluir a triagem "${jobTitle}"? TODOS os candidatos associados serão permanentemente apagados.`)) {
      try {
        const { error } = await supabase.from('triagens').delete().eq('job_id', jobId);
        if (error) throw error;
        setJobs(prev => prev.filter(job => job.id !== jobId));
      } catch (error) {
        console.error("Erro ao deletar triagem:", error);
        alert("Não foi possível excluir a triagem.");
      }
    }
  };

  const handleLogin = async (credentials: { email: string; password: string }) => {
    await login(credentials);
    navigateTo('dashboard');
  };

  const handleLogout = () => {
    logout();
    navigateTo('login');
    setSelectedJob(null);
  };

  const handleViewResults = (job: JobPosting) => {
    setSelectedJob(job);
    navigateTo('results');
  };

  const handleJobCreated = (newJob: JobPosting) => {
    // Usamos a forma funcional para garantir que estamos adicionando à lista mais recente
    setJobs(prevJobs => [newJob, ...prevJobs]);
    setSelectedJob(newJob);
    navigateTo('results');
  };

  const handleCancel = () => {
    navigateTo('dashboard');
  };
  
  const onDeleteJobWithTitle = (jobId: string) => {
      const jobToDelete = jobs.find(job => job.id === jobId);
      if (jobToDelete) {
          handleDeleteJob(jobId, jobToDelete.title);
      }
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <DashboardPage
            jobs={jobs}
            onViewResults={handleViewResults}
            onDeleteJob={onDeleteJobWithTitle}
            onNavigate={navigateTo}
          />
        );
      case 'new-screening':
        return (
          <NewScreeningPage
            onJobCreated={handleJobCreated}
            onCancel={handleCancel}
          />
        );
      case 'results':
        return <ResultsPage selectedJob={selectedJob} onDataSynced={syncJobData} />;
      default:
        return (
          <DashboardPage
            jobs={jobs}
            onViewResults={handleViewResults}
            onDeleteJob={onDeleteJobWithTitle}
            onNavigate={navigateTo}
          />
        );
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="font-inter antialiased">
        <LoginPage onLogin={handleLogin} isLoading={isLoading} />
      </div>
    );
  }

  return (
    <div className="font-inter antialiased">
      <MainLayout
        currentPage={currentPage}
        user={user}
        onNavigate={navigateTo}
        onLogout={handleLogout}
      >
        {renderContent()}
      </MainLayout>
    </div>
  );
}

export default App;
