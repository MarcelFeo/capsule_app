import { useState } from 'react';
import { Text, View } from 'react-native';

import { Header } from '../../../components/layout/Header';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Screen } from '../../../components/ui/Screen';
import { useAuth } from '../../auth/context/AuthContext';
import { useAppData } from '../../../services/AppDataContext';
import type { Medication } from '../../../types/models';
import { MedicationForm } from '../components/MedicationForm';

type Props = {
  patientId?: string;
  title?: string;
};

export function MedicationsScreen({ patientId, title = 'Medicamentos' }: Props) {
  const { user } = useAuth();
  const targetPatientId = patientId ?? user?.id ?? '';
  const { getMedicationsByPatient, addMedication, updateMedication, deleteMedication } = useAppData();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Medication | undefined>();
  const medications = getMedicationsByPatient(targetPatientId);

  return (
    <Screen>
      <Header title={title} subtitle="Organize tratamentos ativos e recorrências." />
      <Button title="Adicionar medicamento" onPress={() => setShowForm(true)} />

      {showForm || editing ? (
        <Card>
          <MedicationForm
            initial={editing}
            onCancel={() => {
              setShowForm(false);
              setEditing(undefined);
            }}
            onSubmit={(data) => {
              if (editing) {
                updateMedication(editing.id, data);
              } else {
                addMedication(targetPatientId, data);
              }
              setShowForm(false);
              setEditing(undefined);
            }}
          />
        </Card>
      ) : null}

      {medications.length === 0 ? (
        <EmptyState title="Nenhum medicamento cadastrado" description="Adicione o primeiro item da rotina." />
      ) : (
        medications.map((medication) => (
          <Card key={medication.id} className="gap-3">
            <View className="flex-row items-start justify-between gap-3">
              <View className="flex-1">
                <Text className="text-lg font-bold text-neutral-900">{medication.name}</Text>
                <Text className="text-sm text-primary-dark">{medication.dosage}</Text>
              </View>
              <Text className={`font-semibold ${medication.active ? 'text-status-success' : 'text-status-error'}`}>
                {medication.active ? 'Ativo' : 'Inativo'}
              </Text>
            </View>
            <Text className="text-neutral-800">{medication.instructions}</Text>
            <Text className="text-sm text-neutral-800">
              {medication.weekDays.join(', ') || 'Sem dias'} • a cada {medication.intervalHours}h
            </Text>
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Button title="Editar" variant="ghost" onPress={() => setEditing(medication)} />
              </View>
              <View className="flex-1">
                <Button title="Excluir" variant="danger" onPress={() => deleteMedication(medication.id)} />
              </View>
            </View>
          </Card>
        ))
      )}
    </Screen>
  );
}
