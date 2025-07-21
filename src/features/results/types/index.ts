// Este tipo agora reflete exatamente a estrutura da sua tabela "triagens"
export interface Candidate {
  id: number;
  NOME: string | null;
  TELEFONE: string | null;
  TRIAGEM: string | null;
  SCORE: number | null;
  "RESUMO IA": string | null;
  DATA: string;
}

// Este tipo não é mais necessário aqui, mas mantendo para referência de upload.
export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
}