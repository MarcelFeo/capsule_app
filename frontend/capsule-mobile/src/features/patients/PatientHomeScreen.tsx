import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PatientHomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Daily Medications</Text>
      <Text>No medications scheduled for today yet.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
});