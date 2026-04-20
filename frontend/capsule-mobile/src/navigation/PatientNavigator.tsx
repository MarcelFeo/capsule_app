import React, { useContext } from 'react';
import { Button, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PatientHomeScreen from '../features/patients/PatientHomeScreen';
import PatientMedicationsScreen from '../features/patients/PatientMedicationsScreen'; 
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

export default function PatientNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={PatientHomeScreen} />
      {/* Add the Medications tab here */}
      <Tab.Screen name="Medications" component={PatientMedicationsScreen} /> 
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}