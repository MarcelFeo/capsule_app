import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, Text, View } from 'react-native';

import { Header } from '../../../components/layout/Header';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Screen } from '../../../components/ui/Screen';
import { useForm } from '../../../hooks/useForm';
import type { UserRole } from '../../../types/models';
import type { AuthStackParamList } from '../../../types/navigation';
import { useAuth } from '../context/AuthContext';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const roles: { label: string; value: UserRole }[] = [
  { label: 'Paciente', value: 'patient' },
  { label: 'Cuidador', value: 'caregiver' },
];

export function RegisterScreen({ navigation }: Props) {
  const { register, loading } = useAuth();
  const { values, update } = useForm({
    name: '',
    email: '',
    birthDate: '',
    phone: '',
    role: 'patient' as UserRole,
  });

  async function handleRegister() {
    await register(values);
    navigation.goBack();
  }

  return (
    <Screen>
      <Header title="Criar conta" subtitle="Preencha os dados básicos para começar." />

      <Card className="gap-4">
        <Input label="Nome completo" value={values.name} onChangeText={(text) => update('name', text)} />
        <Input
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={values.email}
          onChangeText={(text) => update('email', text)}
        />
        <Input
          label="Data de nascimento"
          placeholder="DD/MM/AAAA"
          value={values.birthDate}
          onChangeText={(text) => update('birthDate', text)}
        />
        <Input
          label="Celular"
          keyboardType="phone-pad"
          value={values.phone}
          onChangeText={(text) => update('phone', text)}
        />

        <View className="gap-2">
          <Text className="text-sm font-semibold text-neutral-800">Role</Text>
          <View className="flex-row gap-2">
            {roles.map((role) => {
              const selected = values.role === role.value;

              return (
                <Pressable
                  key={role.value}
                  onPress={() => update('role', role.value)}
                  className={`flex-1 rounded-lg border px-4 py-3 ${
                    selected ? 'border-primary bg-primary-light' : 'border-neutral-300 bg-neutral-200'
                  }`}
                >
                  <Text className="text-center font-semibold text-neutral-900">{role.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Button title="Cadastrar" loading={loading} onPress={handleRegister} />
      </Card>
    </Screen>
  );
}
