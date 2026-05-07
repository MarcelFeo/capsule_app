import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Header } from '../../../components/layout/Header';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Screen } from '../../../components/ui/Screen';
import { useForm } from '../../../hooks/useForm';
import { useAppData } from '../../../services/AppDataContext';
import type { CaregiverStackParamList } from '../../../types/navigation';
import { AppointmentsScreen } from '../../patient/screens/AppointmentsScreen';
import { MedicationsScreen } from '../../patient/screens/MedicationsScreen';

type Props = NativeStackScreenProps<CaregiverStackParamList, 'PatientDetails'>;
type Tab = 'profile' | 'medications' | 'appointments';

export function PatientDetailsScreen({ route }: Props) {
  const { patientId } = route.params;
  const { getPatientById, updatePatient } = useAppData();
  const patient = getPatientById(patientId);
  const [tab, setTab] = useState<Tab>('profile');
  const { values, update } = useForm({
    name: patient?.name ?? '',
    email: patient?.email ?? '',
    birthDate: patient?.birthDate ?? '',
    phone: patient?.phone ?? '',
  });

  if (!patient) {
    return (
      <Screen>
        <Header title="Paciente" subtitle="Registro não encontrado." />
      </Screen>
    );
  }

  if (tab === 'medications') {
    return <MedicationsScreen patientId={patient.id} title={`Medicamentos de ${patient.name}`} />;
  }

  if (tab === 'appointments') {
    return <AppointmentsScreen patientId={patient.id} title={`Consultas de ${patient.name}`} />;
  }

  return (
    <Screen>
      <Header title={patient.name} subtitle="Editar dados e acompanhar rotina." />
      <View className="flex-row gap-2">
        {[
          ['profile', 'Dados'],
          ['medications', 'Medicamentos'],
          ['appointments', 'Consultas'],
        ].map(([value, label]) => (
          <Pressable
            key={value}
            onPress={() => setTab(value as Tab)}
            className={`flex-1 rounded-lg border px-2 py-3 ${
              tab === value ? 'border-primary bg-primary-light' : 'border-neutral-300 bg-neutral-200'
            }`}
          >
            <Text className="text-center text-sm font-semibold text-neutral-900">{label}</Text>
          </Pressable>
        ))}
      </View>

      <Card className="gap-4">
        <Input label="Nome completo" value={values.name} onChangeText={(text) => update('name', text)} />
        <Input label="Email" value={values.email} onChangeText={(text) => update('email', text)} />
        <Input
          label="Data de nascimento"
          value={values.birthDate}
          onChangeText={(text) => update('birthDate', text)}
        />
        <Input label="Celular" value={values.phone} onChangeText={(text) => update('phone', text)} />
        <Button title="Salvar dados" onPress={() => updatePatient(patient.id, values)} />
      </Card>
    </Screen>
  );
}
