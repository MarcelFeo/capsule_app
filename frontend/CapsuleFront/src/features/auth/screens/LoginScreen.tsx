import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';

import { Header } from '../../../components/layout/Header';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Screen } from '../../../components/ui/Screen';
import { useForm } from '../../../hooks/useForm';
import type { AuthStackParamList } from '../../../types/navigation';
import { useAuth } from '../context/AuthContext';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { login, loading } = useAuth();
  const { values, update } = useForm({ email: 'ana@capsule.app', password: '123456' });

  return (
    <Screen className="flex-grow justify-center">
      <Header title="Capsule" subtitle="Acompanhe medicamentos, consultas e cuidado diário." />

      <Card className="gap-4">
        <Input
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={values.email}
          onChangeText={(text) => update('email', text)}
        />
        <Input
          label="Senha"
          secureTextEntry
          value={values.password}
          onChangeText={(text) => update('password', text)}
        />
        <Button title="Entrar" loading={loading} onPress={() => login(values.email, values.password)} />
        <Button title="Criar conta" variant="ghost" onPress={() => navigation.navigate('Register')} />
      </Card>

      <View className="rounded-lg bg-primary-light p-4">
        <Text className="text-sm text-primary-dark">
          Use ana@capsule.app para paciente ou marina@capsule.app para cuidador.
        </Text>
      </View>
    </Screen>
  );
}
