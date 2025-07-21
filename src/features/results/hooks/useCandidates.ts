import { useState, useEffect, useCallback } from 'react';
import { Candidate } from '../types';
import { supabase } from '../../../shared/services/supabaseClient';

// O hook agora espera o ID da vaga (jobId)
export const useCandidates = (jobId?: string) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCandidates = useCallback(async () => {
    if (!jobId) {
      setCandidates([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // AQUI ESTÁ A MUDANÇA: Filtramos por 'job_id'
      const { data, error } = await supabase
        .from('triagens')
        .select('*')
        .eq('job_id', jobId) // <-- LÓGICA CORRIGIDA
        .order('DATA', { ascending: false });

      if (error) {
        throw error;
      }

      setCandidates(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar triagens:', err);
      setError('Não foi possível carregar o histórico de triagens.');
    } finally {
      setIsLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  return {
    candidates,
    isLoading,
    error,
    refetchCandidates: fetchCandidates,
  };
};