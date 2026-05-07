import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { PatientDetailsScreen } from '../features/caregiver/screens/PatientDetailsScreen';
import type { CaregiverStackParamList } from '../types/navigation';
import { CaregiverTabs } from './CaregiverTabs';

const Stack = createNativeStackNavigator<CaregiverStackParamList>();

export function CaregiverNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: '#2D312E',
        headerStyle: { backgroundColor: '#FAF9F6' },
        contentStyle: { backgroundColor: '#FAF9F6' },
      }}
    >
      <Stack.Screen name="CaregiverTabs" component={CaregiverTabs} options={{ headerShown: false }} />
      <Stack.Screen name="PatientDetails" component={PatientDetailsScreen} options={{ title: 'Paciente' }} />
    </Stack.Navigator>
  );
}
