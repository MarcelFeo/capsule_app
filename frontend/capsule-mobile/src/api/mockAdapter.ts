// src/api/mockAdapter.ts
import MockAdapter from 'axios-mock-adapter';
import { apiClient } from './client';
import { mockPatientProfile, mockMedications } from './mockData';
import { DoseRecordResponse } from '../types/doseRecord';

const mock = new MockAdapter(apiClient, { delayResponse: 800 });

// 1. Mock Login
mock.onPost('/auth/login').reply(200, {
  access_token: 'fake-mock-jwt-token-999',
  token_type: 'bearer',
  user: {
    id: 1, email: 'maria@test.com', nome: 'Maria Silva', tipo_usuario: 'PACIENTE', ativo: true
  }
});

// 2. Mock Patient Profile
mock.onGet('/pacientes/me').reply(200, mockPatientProfile);

// 3. Mock Medications
mock.onGet(/\/paciente-medicamentos\/paciente\/\d+/).reply(200, mockMedications);

// --- NEW: Stateful History Mock ---

// Initial fake history data
let dynamicDoseHistory: DoseRecordResponse[] = [
  {
    id: 998,
    paciente_medicamento_id: 101,
    status: "TOMADO",
    data_hora_prevista: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    data_hora_confirmada: new Date(Date.now() - 86300000).toISOString(),
    metodo_confirmacao: "MANUAL_APP",
  },
  {
    id: 999,
    paciente_medicamento_id: 102,
    status: "ATRASADO",
    data_hora_prevista: new Date(Date.now() - 172800000).toISOString(), // 2 Days ago
    data_hora_confirmada: new Date(Date.now() - 160000000).toISOString(),
    metodo_confirmacao: "MANUAL_APP",
  }
];

// 4. Mock Get History (GET /registros-dose/)
mock.onGet('/registros-dose/').reply(() => {
  return [200, dynamicDoseHistory];
});

// 5. Mock Log Dose (POST /registros-dose/)
mock.onPost('/registros-dose/').reply((config) => {
  const data = JSON.parse(config.data);
  
  const newRecord: DoseRecordResponse = {
    id: Math.floor(Math.random() * 10000), 
    ...data,
    data_hora_confirmada: new Date().toISOString(),
  };

  // Add the new record to the beginning of our mock array
  dynamicDoseHistory = [newRecord, ...dynamicDoseHistory];
  
  return [201, newRecord];
});