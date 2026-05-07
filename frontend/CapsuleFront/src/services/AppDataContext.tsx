import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

import {
  mockAppointments,
  mockCaregiverPatientLinks,
  mockCaregivers,
  mockMedications,
  mockPatients,
} from './mockData';
import type { Appointment, Caregiver, Medication, Patient } from '../types/models';
import { createId } from '../utils/id';

type MedicationInput = Omit<Medication, 'id' | 'patientId'>;
type AppointmentInput = Omit<Appointment, 'id' | 'patientId'>;
type PatientInput = Pick<Patient, 'name' | 'email' | 'birthDate' | 'phone'>;

type AppDataContextValue = {
  patients: Patient[];
  caregivers: Caregiver[];
  getPatientCaregivers: (patientId: string) => Caregiver[];
  getCaregiverPatients: (caregiverId: string) => Patient[];
  getPatientById: (patientId: string) => Patient | undefined;
  getMedicationsByPatient: (patientId: string) => Medication[];
  getAppointmentsByPatient: (patientId: string) => Appointment[];
  addMedication: (patientId: string, data: MedicationInput) => void;
  updateMedication: (medicationId: string, data: Partial<MedicationInput>) => void;
  deleteMedication: (medicationId: string) => void;
  addAppointment: (patientId: string, data: AppointmentInput) => void;
  updateAppointment: (appointmentId: string, data: Partial<AppointmentInput>) => void;
  deleteAppointment: (appointmentId: string) => void;
  updatePatient: (patientId: string, data: PatientInput) => void;
};

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [caregivers] = useState<Caregiver[]>(mockCaregivers);
  const [medications, setMedications] = useState<Medication[]>(mockMedications);
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);

  const value = useMemo<AppDataContextValue>(
    () => ({
      patients,
      caregivers,
      getPatientCaregivers: (patientId) => {
        const caregiverIds = mockCaregiverPatientLinks
          .filter((link) => link.patientId === patientId)
          .map((link) => link.caregiverId);

        return caregivers.filter((caregiver) => caregiverIds.includes(caregiver.id));
      },
      getCaregiverPatients: (caregiverId) => {
        const patientIds = mockCaregiverPatientLinks
          .filter((link) => link.caregiverId === caregiverId)
          .map((link) => link.patientId);

        return patients.filter((patient) => patientIds.includes(patient.id));
      },
      getPatientById: (patientId) => patients.find((patient) => patient.id === patientId),
      getMedicationsByPatient: (patientId) =>
        medications.filter((medication) => medication.patientId === patientId),
      getAppointmentsByPatient: (patientId) =>
        appointments.filter((appointment) => appointment.patientId === patientId),
      addMedication: (patientId, data) => {
        setMedications((current) => [{ ...data, id: createId('med'), patientId }, ...current]);
      },
      updateMedication: (medicationId, data) => {
        setMedications((current) =>
          current.map((item) => (item.id === medicationId ? { ...item, ...data } : item)),
        );
      },
      deleteMedication: (medicationId) => {
        setMedications((current) => current.filter((item) => item.id !== medicationId));
      },
      addAppointment: (patientId, data) => {
        setAppointments((current) => [{ ...data, id: createId('appointment'), patientId }, ...current]);
      },
      updateAppointment: (appointmentId, data) => {
        setAppointments((current) =>
          current.map((item) => (item.id === appointmentId ? { ...item, ...data } : item)),
        );
      },
      deleteAppointment: (appointmentId) => {
        setAppointments((current) => current.filter((item) => item.id !== appointmentId));
      },
      updatePatient: (patientId, data) => {
        setPatients((current) =>
          current.map((patient) => (patient.id === patientId ? { ...patient, ...data } : patient)),
        );
      },
    }),
    [appointments, caregivers, medications, patients],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);

  if (!context) {
    throw new Error('useAppData must be used inside AppDataProvider');
  }

  return context;
}
