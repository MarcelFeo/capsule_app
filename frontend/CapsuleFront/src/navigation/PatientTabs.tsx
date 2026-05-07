import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useAuth } from '../features/auth/context/AuthContext';
import { AppointmentsScreen } from '../features/patient/screens/AppointmentsScreen';
import { CaregiversScreen } from '../features/patient/screens/CaregiversScreen';
import { MedicationsScreen } from '../features/patient/screens/MedicationsScreen';
import { ProfileScreen } from '../features/profile/ProfileScreen';
import { useAppData } from '../services/AppDataContext';
import type { PatientTabsParamList } from '../types/navigation';

const Tabs = createBottomTabNavigator<PatientTabsParamList>();

export function PatientTabs() {
  const { user } = useAuth();
  const { getPatientCaregivers } = useAppData();
  const hasCaregivers = user ? getPatientCaregivers(user.id).length > 0 : false;

  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#739E82',
        tabBarInactiveTintColor: '#4D6B57',
        tabBarStyle: { backgroundColor: '#FAF9F6', borderTopColor: '#E5E2D9' },
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Medications: 'medical-outline',
            Appointments: 'calendar-outline',
            Caregivers: 'people-outline',
            Profile: 'person-outline',
          } as const;

          return <Ionicons name={icons[route.name]} color={color} size={size} />;
        },
      })}
    >
      <Tabs.Screen name="Medications" component={MedicationsScreen} options={{ title: 'Medicamentos' }} />
      <Tabs.Screen name="Appointments" component={AppointmentsScreen} options={{ title: 'Consultas' }} />
      {hasCaregivers ? <Tabs.Screen name="Caregivers" component={CaregiversScreen} options={{ title: 'Cuidadores' }} /> : null}
      <Tabs.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
    </Tabs.Navigator>
  );
}
