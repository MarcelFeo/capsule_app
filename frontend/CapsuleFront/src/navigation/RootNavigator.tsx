import { ActivityIndicator, View } from 'react-native';

import { useAuth } from '../features/auth/context/AuthContext';
import { AuthNavigator } from './AuthNavigator';
import { CaregiverNavigator } from './CaregiverNavigator';
import { PatientTabs } from './PatientTabs';

export function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading && !user) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-100">
        <ActivityIndicator color="#739E82" size="large" />
      </View>
    );
  }

  if (!user) {
    return <AuthNavigator />;
  }

  return user.role === 'patient' ? <PatientTabs /> : <CaregiverNavigator />;
}
