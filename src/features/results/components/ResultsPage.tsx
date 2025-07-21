import React, { useState } from 'react';
import UploadArea from './UploadArea';
import CandidateTable from './CandidateTable';
import { useCandidates } from '../hooks/useCandidates';
import { JobPosting } from '../../screening/types';
import { Candidate } from '../types';
import { sendCurriculumsToWebhook } from '../../../shared/services/webhookService';
import { supabase } from '../../../shared/services/supabaseClient';
import CandidateDetailModal from './CandidateDetailModal';

interface ResultsPageProps {
  selectedJob: JobPosting | null;
  onDataSynced: () => void;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ selectedJob, onDataSynced }) => {
  const { candidates, isLoading, error: candidatesError, refetchCandidates } = useCandidates(selectedJob?.id);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Estados para o modal de detalhes
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const handleFilesSelected = async (files: FileList) => {
    if (!selectedJob) {
      setUploadError('Vaga não selecionada. Não é possível enviar os currículos.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const result = await sendCurriculumsToWebhook(files, selectedJob.id);

      if (!result.success || !result.candidates) {
        throw new Error(result.message || 'A análise da IA falhou.');
      }
      
      const newTriagens = result.candidates.map(c => ({
        "NOME": c.name,
        "SCORE": c.score,
        "RESUMO IA": c.summary,
        "TRIAGEM": selectedJob.title,
        "job_id": selectedJob.id,
        "TELEFONE": c.Telefone || null,
      }));
      
      const { error: insertError } = await supabase
        .from('triagens')
        .insert(newTriagens);

      if (insertError) {
        throw new Error(`Falha ao salvar no banco de dados: ${insertError.message}`);
      }
      
      await refetchCandidates();
      onDataSynced();

    } catch (error) {
      console.error('Erro no processo de upload e salvamento:', error);
      setUploadError(error instanceof Error ? error.message : 'Erro ao processar currículos. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  // Função para abrir o modal de detalhes
  const handleViewDetails = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsDetailModalOpen(true);
  };

  // Função para fechar o modal de detalhes
  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedCandidate(null);
  };

  return (
    <>
      <div className="fade-in">
        <div className="mb-6">
          <h3 className="text-2xl font-semibold">
            Resultados: {selectedJob?.title || 'Vaga não selecionada'}
          </h3>
          <p className="text-gray-600">
            Envie os currículos para iniciar a análise da IA.
          </p>
        </div>

        {(uploadError || candidatesError) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{uploadError || candidatesError}</p>
          </div>
        )}

        <UploadArea
          onFilesSelected={handleFilesSelected}
          isUploading={isUploading}
          jobId={selectedJob?.id}
        />
        
        <CandidateTable
          candidates={candidates}
          onViewDetails={handleViewDetails}
          isLoading={isLoading}
        />
      </div>

      {/* A variável isDetailModalOpen é usada aqui para renderizar o modal */}
      {isDetailModalOpen && (
        <CandidateDetailModal 
          candidate={selectedCandidate}
          onClose={handleCloseDetailModal}
        />
      )}
    </>
  );
};

export default ResultsPage;
