export interface PatientMedication {
  id: number;
  paciente_id:number;
  medicamento_id: number;
  dosagem: string | null;
  data_inicio: string;
  data_fim: string | null;
  instrucoes: string | null;
  estoque_atual: number;
  estoque_minimo: number;
  data_vencimento: string | null;
  frequencia: string | null;
  prescrito_por: number | null;
  ativo: boolean;
}