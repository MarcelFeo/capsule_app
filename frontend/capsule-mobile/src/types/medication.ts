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

export interface MedicationCatalogItem {
  id: number;
  nome: string;
  nome_generico?: string | null;
}

export interface PatientMedicationCreate {
  paciente_id: number;
  medicamento_id: number;
  dosagem?: string;
  data_inicio: string;
  frequencia?: string;
  instrucoes?: string;
  estoque_atual?: number;
  estoque_minimo?: number;
  prescrito_por?: number;
}