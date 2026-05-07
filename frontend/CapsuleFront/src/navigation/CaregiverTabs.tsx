import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { DashboardScreen } from '../features/caregiver/screens/DashboardScreen';
import { ProfileScreen } from '../features/profile/ProfileScreen';
import type { CaregiverTabsParamList } from '../types/navigation';

const Tabs = createBottomTabNavigator<CaregiverTabsParamList>();

export function CaregiverTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#739E82',
        tabBarInactiveTintColor: '#4D6B57',
        tabBarStyle: { backgroundColor: '#FAF9F6', borderTopColor: '#E5E2D9' },
        tabBarIcon: ({ color, size }) => {
          const icon = route.name === 'Dashboard' ? 'grid-outline' : 'person-outline';

          return <Ionicons name={icon} color={color} size={size} />;
        },
      })}
    >
      <Tabs.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
    </Tabs.Navigator>
  );
}
