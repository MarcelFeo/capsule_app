import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Pressable, Text, View } from 'react-native';

import { Header } from '../../../components/layout/Header';
import { Card } from '../../../components/ui/Card';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Screen } from '../../../components/ui/Screen';
import { useAppData } from '../../../services/AppDataContext';
import type { CaregiverStackParamList } from '../../../types/navigation';
import { useAuth } from '../../auth/context/AuthContext';

export function DashboardScreen() {
  const { user } = useAuth();
  const { getCaregiverPatients, getMedicationsByPatient, getAppointmentsByPatient } = useAppData();
  const navigation = useNavigation<NativeStackNavigationProp<CaregiverStackParamList>>();
  const patients = user ? getCaregiverPatients(user.id) : [];

  return (
    <Screen>
      <Header title="Dashboard" subtitle="Pacientes vinculados ao seu cuidado." />

      {patients.length === 0 ? (
        <EmptyState title="Nenhum paciente vinculado" />
      ) : (
        patients.map((patient) => (
          <Pressable key={patient.id} onPress={() => navigation.navigate('PatientDetails', { patientId: patient.id })}>
            <Card className="gap-3">
              <View>
                <Text className="text-lg font-bold text-neutral-900">{patient.name}</Text>
                <Text className="text-primary-dark">{patient.email}</Text>
              </View>
              <View className="flex-row gap-3">
                <View className="flex-1 rounded-lg bg-primary-light p-3">
                  <Text className="text-center text-xl font-bold text-primary-dark">
                    {getMedicationsByPatient(patient.id).length}
                  </Text>
                  <Text className="text-center text-xs text-primary-dark">medicamentos</Text>
                </View>
                <View className="flex-1 rounded-lg bg-secondary-light p-3">
                  <Text className="text-center text-xl font-bold text-neutral-900">
                    {getAppointmentsByPatient(patient.id).length}
                  </Text>
                  <Text className="text-center text-xs text-neutral-900">consultas</Text>
                </View>
              </View>
            </Card>
          </Pressable>
        ))
      )}
    </Screen>
  );
}
