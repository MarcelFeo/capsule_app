import React, { useContext } from 'react';
import { Button, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CaregiverHomeScreen from '../features/caregiver/CaregiverHomeScreen';
import { AuthContext } from '../features/auth/AuthContext';

const Tab = createBottomTabNavigator();

function ProfileScreen() {
  const authContext = useContext(AuthContext);
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Logout" onPress={() => authContext?.logout()} color="red" />
    </View>
  );
}

export default function CaregiverNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Patients" component={CaregiverHomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}