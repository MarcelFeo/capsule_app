export interface Caregiver {
  id: number;
  usuario_id: number;
  registro_profissional?: string | null;
  especialidade?: string | null;
  telefone?: string | null;
}

export interface PatientCaregiverAssociation {
  id: number;
  paciente_id: number;
  cuidador_id: number;
  permissoes?: string | null;
  ativo: boolean;
  paciente_nome?: string; //pra facilitar exibição do nome do paciente junto com o cuidador
}