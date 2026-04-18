export interface PatientProfile {
  id: number;
  usuario_id: number;
  data_nascimento: string | null;
  tipo_sanguineo: string | null;
  telefone_emergencia: string | null;
  contato_emergencia: string | null;
  observacoes: string | null;
  alergias: string | null;
  condicoes_medicas: string | null;
}

export interface PatientMeResponse {
  id: number;
  nome: string;
  perfil: PatientProfile | null;
}