// src/api/mockAdapter.ts
import MockAdapter from 'axios-mock-adapter';
import { apiClient } from './client';
import { mockPatientProfile, mockMedications } from './mockData';

// Initialize the mock adapter on your existing axios instance
// delayResponse adds a realistic 800ms loading time
const mock = new MockAdapter(apiClient, { delayResponse: 800 });

// 1. Mock Login (POST /auth/login)
mock.onPost('/auth/login').reply(200, {
  access_token: 'fake-mock-jwt-token-999',
  token_type: 'bearer',
  user: {
    id: 1,
    email: 'maria@test.com',
    nome: 'Maria Silva',
    tipo_usuario: 'PACIENTE',
    ativo: true
  }
});

// 2. Mock Patient Profile (GET /pacientes/me)
mock.onGet('/pacientes/me').reply(200, mockPatientProfile);

// 3. Mock Medications (GET /paciente-medicamentos/paciente/{id})
// We use a regular expression to match ANY patient ID at the end of the URL
mock.onGet(/\/paciente-medicamentos\/paciente\/\d+/).reply(200, mockMedications);

// 4. Mock Log Dose (POST /registros-dose/)
mock.onPost('/registros-dose/').reply((config) => {
  const data = JSON.parse(config.data);
  console.log("Mock API received dose record:", data);
  
  // Return a fake successful response matching the schema
  return [201, {
    id: Math.floor(Math.random() * 1000), // Fake ID
    ...data,
    data_hora_confirmada: new Date().toISOString(),
  }];
});

export default mock;