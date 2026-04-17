// src/navigation/RootNavigator.tsx
import React, { useContext } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../features/auth/AuthContext';
import LoginScreen from '../features/auth/LoginScreen';

const Stack = createNativeStackNavigator();

// placeholder temporario
function DashboardScreen() {
  const authContext = useContext(AuthContext);
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Welcome to Capsule!</Text>
      <Text style={{ marginBottom: 20 }}>Role: {authContext?.userRole}</Text>
      <Button title="Logout" onPress={() => authContext?.logout()} color="red" />
    </View>
  );
}

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
    <Stack.Navigator>
      {authContext?.userToken == null ? (
        // flow de usuario nao autenticado
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
      ) : (
        // flow de usuario autenticado
        <Stack.Screen 
          name="Dashboard" 
          component={DashboardScreen} 
          options={{ headerBackVisible: false }}
        />
      )}
    </Stack.Navigator>
  );
}