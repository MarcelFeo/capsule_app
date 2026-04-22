import MockAdapter from 'axios-mock-adapter';
import { apiClient } from './client';
import { mockPatientProfile, mockMedications } from './mockData';
import { DoseRecordResponse } from '../types/doseRecord';
import { mockCaregiverPatients } from './mockData';

const mock = new MockAdapter(apiClient, { delayResponse: 800 });

mock.onPost('/auth/login').reply(200, {
  access_token: 'fake-mock-jwt-token-999',
  token_type: 'bearer',
  user: {
    id: 1, email: 'maria@test.com', nome: 'Maria Silva', tipo_usuario: 'PACIENTE', ativo: true
  }
});

mock.onGet('/pacientes/me').reply(200, mockPatientProfile);

mock.onGet(/\/paciente-medicamentos\/paciente\/\d+/).reply(200, mockMedications);

let dynamicDoseHistory: DoseRecordResponse[] = [
  {
    id: 998,
    paciente_medicamento_id: 101,
    status: "TOMADO",
    data_hora_prevista: new Date(Date.now() - 86400000).toISOString(), 
    data_hora_confirmada: new Date(Date.now() - 86300000).toISOString(),
    metodo_confirmacao: "MANUAL_APP",
  },
  {
    id: 999,
    paciente_medicamento_id: 102,
    status: "ATRASADO",
    data_hora_prevista: new Date(Date.now() - 172800000).toISOString(), 
    data_hora_confirmada: new Date(Date.now() - 160000000).toISOString(),
    metodo_confirmacao: "MANUAL_APP",
  }
];

mock.onGet('/registros-dose/').reply(() => {
  return [200, dynamicDoseHistory];
});

mock.onPost('/registros-dose/').reply((config) => {
  const data = JSON.parse(config.data);
  
  const newRecord: DoseRecordResponse = {
    id: Math.floor(Math.random() * 10000), 
    ...data,
    data_hora_confirmada: new Date().toISOString(),
  };
  dynamicDoseHistory = [newRecord, ...dynamicDoseHistory];
  return [201, newRecord];
});

mock.onGet('/paciente-cuidadores/').reply(200, mockCaregiverPatients);
mock.onGet(/\/registros-dose\/paciente-medicamento\/\d+/).reply((config) => {
  const pmId = parseInt(config.url!.split('/').pop()!);
  const filteredHistory = dynamicDoseHistory.filter(dose => dose.paciente_medicamento_id === pmId);
  return [200, filteredHistory];
});