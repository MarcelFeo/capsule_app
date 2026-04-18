import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../features/auth/AuthContext';
import LoginScreen from '../features/auth/LoginScreen';
import PatientNavigator from './PatientNavigator';
import CaregiverNavigator from './CaregiverNavigator';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const authContext = useContext(AuthContext);
  if (authContext?.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {authContext?.userToken == null ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <>
          {authContext.userRole === 'PACIENTE' && (
            <Stack.Screen name="PatientApp" component={PatientNavigator} />
          )}
          {authContext.userRole === 'CUIDADOR' && (
            <Stack.Screen name="CaregiverApp" component={CaregiverNavigator} />
          )}
        </>
      )}
    </Stack.Navigator>
  );
}