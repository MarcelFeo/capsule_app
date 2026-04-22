import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CaregiverHomeScreen from '../features/caregiver/CaregiverHomeScreen';
import CaregiverPatientDetailScreen from '../features/caregiver/CaregiverPatientDetailScreen';
import CaregiverMedicationHistoryScreen from '../features/caregiver/CaregiverMedicationHistoryScreen';
import CaregiverAddMedicationScreen from '../features/caregiver/CaregiverAddMedicationScreen';

const Stack = createNativeStackNavigator();

export default function CaregiverPatientsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="CaregiverHome" 
        component={CaregiverHomeScreen} 
        options={{ title: 'Meus Pacientes' }} 
      />
      <Stack.Screen 
        name="PatientDetail" 
        component={CaregiverPatientDetailScreen} 
        options={{ title: 'Detalhes do Paciente' }} 
      />
      <Stack.Screen 
        name="MedicationHistory" 
        component={CaregiverMedicationHistoryScreen} 
        options={{ title: 'Histórico de Doses' }} 
      />
      <Stack.Screen 
        name="AddMedication" 
        component={CaregiverAddMedicationScreen} 
        options={{ title: 'Add Prescription' }} 
      />
    </Stack.Navigator>
  );
}