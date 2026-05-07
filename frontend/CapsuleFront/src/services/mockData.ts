import type { Appointment, Caregiver, Medication, Patient } from '../types/models';

export const mockPatients: Patient[] = [
  {
    id: 'patient-1',
    name: 'Ana Beatriz Lima',
    email: 'ana@capsule.app',
    role: 'patient',
    birthDate: '1992-08-14',
    phone: '(11) 99999-0101',
  },
  {
    id: 'patient-2',
    name: 'Roberto Silva',
    email: 'roberto@capsule.app',
    role: 'patient',
    birthDate: '1966-02-03',
    phone: '(21) 98888-0202',
  },
];

export const mockCaregivers: Caregiver[] = [
  {
    id: 'caregiver-1',
    name: 'Marina Costa',
    email: 'marina@capsule.app',
    role: 'caregiver',
    phone: '(31) 97777-0303',
  },
];

export const mockCaregiverPatientLinks = [
  { caregiverId: 'caregiver-1', patientId: 'patient-1' },
  { caregiverId: 'caregiver-1', patientId: 'patient-2' },
];

export const mockMedications: Medication[] = [
  {
    id: 'med-1',
    patientId: 'patient-1',
    name: 'Losartana',
    instructions: 'Tomar com água após o café da manhã.',
    dosage: '50mg',
    weekDays: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'],
    intervalHours: 24,
    active: true,
  },
  {
    id: 'med-2',
    patientId: 'patient-1',
    name: 'Vitamina D',
    instructions: 'Tomar junto da refeição principal.',
    dosage: '2000 UI',
    weekDays: ['Dom'],
    intervalHours: 168,
    active: false,
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: 'appointment-1',
    patientId: 'patient-1',
    dateTime: '2026-05-18T09:30:00',
    doctorName: 'Dra. Paula Mendes',
    hospital: 'Hospital São Lucas',
    address: 'Av. Central, 1200',
  },
];
