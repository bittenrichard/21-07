import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL ou Anon Key não foram encontradas. Verifique seu arquivo .env.local');
}

export interface Database {
  public: {
    Tables: {
      triagens: {
        Row: {
          id: number;
          NOME: string | null;
          TELEFONE: string | null;
          TRIAGEM: string | null;
          SCORE: number | null;
          "RESUMO IA": string | null;
          DATA: string;
          job_id: string | null; // <-- NOVO CAMPO
        };
        Insert: {
          id?: number;
          NOME?: string;
          TELEFONE?: string;
          TRIAGEM?: string;
          SCORE?: number;
          "RESUMO IA"?: string;
          DATA?: string;
          job_id?: string; // <-- NOVO CAMPO
        };
        Update: {
          id?: number;
          NOME?: string;
          TELEFONE?: string;
          TRIAGEM?: string;
          SCORE?: number;
          "RESUMO IA"?: string;
          DATA?: string;
          job_id?: string; // <-- NOVO CAMPO
        };
      };
    };
  };
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);