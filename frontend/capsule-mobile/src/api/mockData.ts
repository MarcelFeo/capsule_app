import { PatientMeResponse } from '../types/patient';
import { PatientMedication } from '../types/medication';
import { PatientCaregiverAssociation } from '../types/caregiver';
import { MedicationCatalogItem } from '../types/medication';


export const mockPatientProfile: PatientMeResponse = {
  id: 1,
  nome: "Maria Silva",
  perfil: {
    id: 1,
    usuario_id: 1,
    data_nascimento: "1955-08-12",
    tipo_sanguineo: "O+",
    telefone_emergencia: "(11) 98765-4321",
    contato_emergencia: "João Silva (Filho)",
    observacoes: "Paciente apresenta leve dificuldade de locomoção.",
    alergias: "Dipirona, Amendoim",
    condicoes_medicas: "Hipertensão, Diabetes Tipo 2"
  }
};

export const mockMedications: PatientMedication[] = [
  {
    id: 101,
    paciente_id: 1,
    medicamento_id: 42, 
    dosagem: "50mg",
    data_inicio: "2023-01-01",
    data_fim: null,
    instrucoes: "Tomar pela manhã após o café",
    estoque_atual: 24,
    estoque_minimo: 10,
    data_vencimento: "2025-12-31",
    frequencia: "1x ao dia",
    prescrito_por: 2, 
    ativo: true
  },
  {
    id: 102,
    paciente_id: 1,
    medicamento_id: 15, 
    dosagem: "500mg",
    data_inicio: "2024-03-15",
    data_fim: null,
    instrucoes: "Tomar junto com o almoço",
    estoque_atual: 4,
    estoque_minimo: 15,
    data_vencimento: "2024-10-01",
    frequencia: "1x ao dia",
    prescrito_por: 2,
    ativo: true
  }
];

export const mockCaregiverPatients: PatientCaregiverAssociation[] = [
  {
    id: 1,
    paciente_id: 1, 
    cuidador_id: 2, 
    permissoes: "TOTAL",
    ativo: true,
    paciente_nome: "Maria Silva",
  },
  {
    id: 2,
    paciente_id: 5,
    cuidador_id: 2,
    permissoes: "LEITURA",
    ativo: true,
    paciente_nome: "João Souza",
  }
];

export const mockCatalog: MedicationCatalogItem[] = [
  { id: 42, nome: "Losartana", nome_generico: "Losartana Potássica 50mg" },
  { id: 15, nome: "Metformina", nome_generico: "Cloridrato de Metformina 500mg" },
  { id: 88, nome: "Dipirona", nome_generico: "Dipirona Sódica 1g" }
];