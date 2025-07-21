import React, { useState, useMemo } from 'react';
import StatCard from './StatCard';
import RecentScreenings from './RecentScreenings';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { JobPosting } from '../../screening/types';
import { PageKey } from '../../../shared/types';
import ApprovedCandidatesModal from './ApprovedCandidatesModal';
import { Candidate } from '../../results/types';
import { supabase } from '../../../shared/services/supabaseClient';

interface DashboardPageProps {
  jobs: JobPosting[];
  onViewResults: (job: JobPosting) => void;
  onDeleteJob: (jobId: string) => void;
  onNavigate: (page: PageKey) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({
  jobs,
  onViewResults,
  onDeleteJob,
  onNavigate,
}) => {
  const { stats, isLoading, error } = useDashboardStats(jobs);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isApprovedModalOpen, setIsApprovedModalOpen] = useState(false);
  const [approvedCandidates, setApprovedCandidates] = useState<Candidate[]>([]);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      if (!searchTerm) return true;
      return job.title.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [jobs, searchTerm]);

  const handleOpenApprovedModal = async () => {
    if (stats && stats.approvedCandidates === 0) {
      return;
    }
    
    setIsApprovedModalOpen(true);
    setIsModalLoading(true);
    
    try {
      const activeJobTitles = jobs.map(job => job.title);
      let approvedData: Candidate[] = [];
      if (activeJobTitles.length > 0) {
        const { data, error } = await supabase
          .from('triagens')
          .select('*')
          .gte('SCORE', 90)
          .in('TRIAGEM', activeJobTitles)
          .order('SCORE', { ascending: false });
        if (error) throw error;
        approvedData = data || [];
      }
      setApprovedCandidates(approvedData);
    } catch (err) {
      console.error("Erro ao buscar candidatos aprovados:", err);
    } finally {
      setIsModalLoading(false);
    }
  };

  const statsData = [
    { title: 'Vagas Ativas', value: stats?.activeJobs ?? 0, iconName: 'briefcase', iconColor: 'text-indigo-600', iconBg: 'bg-indigo-100' },
    { title: 'Candidatos Triados', value: stats?.totalCandidates ?? 0, iconName: 'users', iconColor: 'text-green-600', iconBg: 'bg-green-100' },
    // AQUI ESTÁ A MUDANÇA
    { title: 'Score de Compatibilidade', value: `${stats?.averageScore ?? 0}%`, iconName: 'check', iconColor: 'text-blue-600', iconBg: 'bg-blue-100' },
    { title: 'Aprovados (>90%)', value: stats?.approvedCandidates ?? 0, iconName: 'award', iconColor: 'text-amber-600', iconBg: 'bg-amber-100', onClick: handleOpenApprovedModal }
  ];

  if (isLoading) {
    return <div className="text-center p-10"><p>Sincronizando dados do dashboard...</p></div>;
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
        <strong className="font-bold">Erro: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <>
      <div className="fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {statsData.map((stat, index) => <StatCard key={index} {...stat} />)}
        </div>
        <RecentScreenings
          jobs={filteredJobs}
          onViewResults={onViewResults}
          onDeleteJob={onDeleteJob}
          onNewScreening={() => onNavigate('new-screening')}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>
      
      {isApprovedModalOpen && (
        <ApprovedCandidatesModal 
          candidates={approvedCandidates}
          isLoading={isModalLoading}
          onClose={() => setIsApprovedModalOpen(false)} 
        />
      )}
    </>
  );
};

export default DashboardPage;
