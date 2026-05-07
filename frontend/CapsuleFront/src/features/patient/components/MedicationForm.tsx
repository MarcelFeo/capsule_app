import { Pressable, Text, View } from 'react-native';

import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Switch } from '../../../components/ui/Switch';
import { useForm } from '../../../hooks/useForm';
import type { Medication } from '../../../types/models';

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

type MedicationFormProps = {
  initial?: Medication;
  onSubmit: (data: Omit<Medication, 'id' | 'patientId'>) => void;
  onCancel: () => void;
};

export function MedicationForm({ initial, onSubmit, onCancel }: MedicationFormProps) {
  const { values, update } = useForm({
    name: initial?.name ?? '',
    instructions: initial?.instructions ?? '',
    dosage: initial?.dosage ?? '',
    weekDays: initial?.weekDays ?? [],
    intervalHours: initial?.intervalHours?.toString() ?? '8',
    active: initial?.active ?? true,
  });

  function toggleDay(day: string) {
    update(
      'weekDays',
      values.weekDays.includes(day)
        ? values.weekDays.filter((item) => item !== day)
        : [...values.weekDays, day],
    );
  }

  return (
    <View className="gap-4">
      <Input label="Nome do medicamento" value={values.name} onChangeText={(text) => update('name', text)} />
      <Input label="Instruções" value={values.instructions} onChangeText={(text) => update('instructions', text)} />
      <Input label="Dosagem" value={values.dosage} onChangeText={(text) => update('dosage', text)} />
      <View className="gap-2">
        <Text className="text-sm font-semibold text-neutral-800">Dias da semana</Text>
        <View className="flex-row flex-wrap gap-2">
          {weekDays.map((day) => {
            const selected = values.weekDays.includes(day);

            return (
              <Pressable
                key={day}
                onPress={() => toggleDay(day)}
                className={`rounded-lg border px-3 py-2 ${
                  selected ? 'border-primary bg-primary-light' : 'border-neutral-300 bg-neutral-200'
                }`}
              >
                <Text className="font-semibold text-neutral-900">{day}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      <Input
        label="Intervalo em horas"
        keyboardType="number-pad"
        value={values.intervalHours}
        onChangeText={(text) => update('intervalHours', text)}
      />
      <Switch label={values.active ? 'Ativo' : 'Inativo'} value={values.active} onValueChange={(value) => update('active', value)} />
      <View className="flex-row gap-3">
        <View className="flex-1">
          <Button title="Cancelar" variant="ghost" onPress={onCancel} />
        </View>
        <View className="flex-1">
          <Button
            title={initial ? 'Salvar' : 'Adicionar'}
            onPress={() =>
              onSubmit({
                name: values.name,
                instructions: values.instructions,
                dosage: values.dosage,
                weekDays: values.weekDays,
                intervalHours: Number(values.intervalHours) || 8,
                active: values.active,
              })
            }
          />
        </View>
      </View>
    </View>
  );
}
