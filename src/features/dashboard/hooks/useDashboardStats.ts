import { useState, useEffect } from 'react';
import { supabase } from '../../../shared/services/supabaseClient';
import { JobPosting } from '../../screening/types';

export interface DashboardStats {
  activeJobs: number;
  totalCandidates: number;
  averageScore: number;
  approvedCandidates: number;
}

export const useDashboardStats = (jobs: JobPosting[]) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const calculateStats = async () => {
      if (!jobs) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const activeJobsCount = jobs.length;
        const totalCandidatesCount = jobs.reduce((acc, job) => acc + job.candidateCount, 0);
        
        const jobsWithCandidates = jobs.filter(job => job.candidateCount > 0);
        let averageScore = 0;
        if (jobsWithCandidates.length > 0) {
          const totalAverageScore = jobsWithCandidates.reduce((acc, job) => acc + job.averageScore, 0);
          averageScore = Math.round(totalAverageScore / jobsWithCandidates.length);
        }

        // --- AQUI ESTÁ A CORREÇÃO ---
        // 1. Pegamos os títulos de todas as vagas ativas na sua lista.
        const activeJobTitles = jobs.map(job => job.title);
        
        let approvedCount = 0;
        // 2. Só executamos a busca se houver vagas para filtrar.
        if (activeJobTitles.length > 0) {
          const { count, error: approvedError } = await supabase
            .from('triagens')
            .select('*', { count: 'exact', head: true })
            .gte('SCORE', 90)
            .in('TRIAGEM', activeJobTitles); // 3. Filtramos a contagem para incluir apenas candidatos dessas vagas.

          if (approvedError) throw approvedError;
          approvedCount = count ?? 0;
        }

        setStats({
          activeJobs: activeJobsCount,
          totalCandidates: totalCandidatesCount,
          averageScore: averageScore,
          approvedCandidates: approvedCount,
        });

      } catch (err: any) {
        console.error("Erro ao calcular estatísticas do dashboard:", err);
        setError("Não foi possível carregar os dados do dashboard.");
      } finally {
        setIsLoading(false);
      }
    };

    calculateStats();
  }, [jobs]);

  return { stats, isLoading, error };
};
