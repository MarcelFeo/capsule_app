import { Text } from 'react-native';

import { Header } from '../../../components/layout/Header';
import { Card } from '../../../components/ui/Card';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Screen } from '../../../components/ui/Screen';
import { useAppData } from '../../../services/AppDataContext';
import { useAuth } from '../../auth/context/AuthContext';

export function CaregiversScreen() {
  const { user } = useAuth();
  const { getPatientCaregivers } = useAppData();
  const caregivers = user ? getPatientCaregivers(user.id) : [];

  return (
    <Screen>
      <Header title="Cuidadores" subtitle="Pessoas vinculadas ao seu acompanhamento." />
      {caregivers.length === 0 ? (
        <EmptyState title="Nenhum cuidador vinculado" />
      ) : (
        caregivers.map((caregiver) => (
          <Card key={caregiver.id}>
            <Text className="text-lg font-bold text-neutral-900">{caregiver.name}</Text>
            <Text className="text-primary-dark">{caregiver.email}</Text>
            {caregiver.phone ? <Text className="text-neutral-800">{caregiver.phone}</Text> : null}
          </Card>
        ))
      )}
    </Screen>
  );
}
