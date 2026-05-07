import { Text } from 'react-native';

import { Header } from '../../components/layout/Header';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Screen } from '../../components/ui/Screen';
import { useAuth } from '../auth/context/AuthContext';

export function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <Screen>
      <Header title="Perfil" subtitle="Dados da conta logada." />
      <Card className="gap-2">
        <Text className="text-xl font-bold text-neutral-900">{user?.name}</Text>
        <Text className="text-neutral-800">{user?.email}</Text>
        <Text className="font-semibold text-primary-dark">
          {user?.role === 'patient' ? 'Paciente' : 'Cuidador'}
        </Text>
      </Card>
      <Button title="Sair" variant="ghost" onPress={logout} />
    </Screen>
  );
}
