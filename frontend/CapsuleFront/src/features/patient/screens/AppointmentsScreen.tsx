import { useState } from 'react';
import { Text, View } from 'react-native';

import { Header } from '../../../components/layout/Header';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Screen } from '../../../components/ui/Screen';
import { useAppData } from '../../../services/AppDataContext';
import type { Appointment } from '../../../types/models';
import { formatDateTime } from '../../../utils/date';
import { useAuth } from '../../auth/context/AuthContext';
import { AppointmentForm } from '../components/AppointmentForm';

type Props = {
  patientId?: string;
  title?: string;
};

export function AppointmentsScreen({ patientId, title = 'Consultas' }: Props) {
  const { user } = useAuth();
  const targetPatientId = patientId ?? user?.id ?? '';
  const { getAppointmentsByPatient, addAppointment, updateAppointment, deleteAppointment } = useAppData();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Appointment | undefined>();
  const appointments = getAppointmentsByPatient(targetPatientId);

  return (
    <Screen>
      <Header title={title} subtitle="Próximos compromissos médicos." />
      <Button title="Adicionar consulta" onPress={() => setShowForm(true)} />

      {showForm || editing ? (
        <Card>
          <AppointmentForm
            initial={editing}
            onCancel={() => {
              setShowForm(false);
              setEditing(undefined);
            }}
            onSubmit={(data) => {
              if (editing) {
                updateAppointment(editing.id, data);
              } else {
                addAppointment(targetPatientId, data);
              }
              setShowForm(false);
              setEditing(undefined);
            }}
          />
        </Card>
      ) : null}

      {appointments.length === 0 ? (
        <EmptyState title="Nenhuma consulta cadastrada" description="Inclua data, médico e local da consulta." />
      ) : (
        appointments.map((appointment) => (
          <Card key={appointment.id} className="gap-2">
            <Text className="text-lg font-bold text-neutral-900">{formatDateTime(appointment.dateTime)}</Text>
            <Text className="text-neutral-800">{appointment.doctorName}</Text>
            <Text className="text-primary-dark">{appointment.hospital}</Text>
            <Text className="text-sm text-neutral-800">{appointment.address}</Text>
            <View className="mt-2 flex-row gap-3">
              <View className="flex-1">
                <Button title="Editar" variant="ghost" onPress={() => setEditing(appointment)} />
              </View>
              <View className="flex-1">
                <Button title="Excluir" variant="danger" onPress={() => deleteAppointment(appointment.id)} />
              </View>
            </View>
          </Card>
        ))
      )}
    </Screen>
  );
}
