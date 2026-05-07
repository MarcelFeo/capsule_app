export type UserRole = 'patient' | 'caregiver';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type Medication = {
  id: string;
  patientId: string;
  name: string;
  instructions: string;
  dosage: string;
  weekDays: string[];
  intervalHours: number;
  active: boolean;
};

export type Appointment = {
  id: string;
  patientId: string;
  dateTime: string;
  doctorName: string;
  hospital: string;
  address: string;
};

export type Patient = User & {
  role: 'patient';
  birthDate?: string;
  phone?: string;
};

export type Caregiver = User & {
  role: 'caregiver';
  phone?: string;
};
