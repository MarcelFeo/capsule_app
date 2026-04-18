import React, { useContext } from 'react';
import { Button } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PatientHomeScreen from '../features/patients/PatientHomeScreen';
import { AuthContext } from '../features/auth/AuthContext';

const Tab = createBottomTabNavigator();

//placeholder
function ProfileScreen() {
  const authContext = useContext(AuthContext);
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Logout" onPress={() => authContext?.logout()} color="red" />
    </View>
  );
}
import { View } from 'react-native';

export default function PatientNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={PatientHomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}