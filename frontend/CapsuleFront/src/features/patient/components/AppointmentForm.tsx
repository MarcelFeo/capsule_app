import { View } from 'react-native';

import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useForm } from '../../../hooks/useForm';
import type { Appointment } from '../../../types/models';

type AppointmentFormProps = {
  initial?: Appointment;
  onSubmit: (data: Omit<Appointment, 'id' | 'patientId'>) => void;
  onCancel: () => void;
};

export function AppointmentForm({ initial, onSubmit, onCancel }: AppointmentFormProps) {
  const { values, update } = useForm({
    dateTime: initial?.dateTime ?? '',
    doctorName: initial?.doctorName ?? '',
    hospital: initial?.hospital ?? '',
    address: initial?.address ?? '',
  });

  return (
    <View className="gap-4">
      <Input
        label="Data e horário"
        placeholder="2026-05-18T09:30:00"
        value={values.dateTime}
        onChangeText={(text) => update('dateTime', text)}
      />
      <Input label="Nome do médico" value={values.doctorName} onChangeText={(text) => update('doctorName', text)} />
      <Input label="Hospital" value={values.hospital} onChangeText={(text) => update('hospital', text)} />
      <Input label="Endereço" value={values.address} onChangeText={(text) => update('address', text)} />
      <View className="flex-row gap-3">
        <View className="flex-1">
          <Button title="Cancelar" variant="ghost" onPress={onCancel} />
        </View>
        <View className="flex-1">
          <Button title={initial ? 'Salvar' : 'Adicionar'} onPress={() => onSubmit(values)} />
        </View>
      </View>
    </View>
  );
}
