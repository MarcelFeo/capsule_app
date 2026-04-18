import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CaregiverHomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Patients</Text>
      <Text>You are not monitoring any patients yet.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
});