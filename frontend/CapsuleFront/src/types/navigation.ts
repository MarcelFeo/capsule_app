import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type PatientTabsParamList = {
  Medications: undefined;
  Appointments: undefined;
  Caregivers: undefined;
  Profile: undefined;
};

export type CaregiverTabsParamList = {
  Dashboard: undefined;
  Profile: undefined;
};

export type CaregiverStackParamList = {
  CaregiverTabs: NavigatorScreenParams<CaregiverTabsParamList>;
  PatientDetails: { patientId: string };
};
