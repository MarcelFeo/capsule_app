export interface DoseRecordCreate {
  paciente_medicamento_id: number;
  status: string; 
  data_hora_prevista: string;
  observacao?: string | null;
  horario_medicacao_id?: number | null;
  registrado_por?: number | null;
  metodo_confirmacao?: string | null;
}

export interface DoseRecordResponse extends DoseRecordCreate {
  id: number;
  data_hora_confirmada?: string | null;
}