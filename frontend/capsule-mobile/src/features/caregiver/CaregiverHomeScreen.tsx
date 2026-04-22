import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { apiClient } from '../../api/client';
import { PatientCaregiverAssociation } from '../../types/caregiver';

const fetchMyPatients = async (): Promise<PatientCaregiverAssociation[]> => {
  const response = await apiClient.get('/paciente-cuidadores/');
  return response.data;
};

export default function CaregiverHomeScreen() {
  const navigation = useNavigation<any>();
  const { data: patients, isLoading, isError } = useQuery({
    queryKey: ['caregiverPatients'],
    queryFn: fetchMyPatients,
  });

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#9C27B0" />
        <Text style={{ marginTop: 10 }}>Loading patients...</Text>
      </View>
    );
  }
  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load patient list.</Text>
      </View>
    );
  }
  const renderPatientCard = ({ item }: { item: PatientCaregiverAssociation }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => navigation.navigate('PatientDetail', { 
        pacienteId: item.paciente_id, 
        pacienteNome: item.paciente_nome || `Patient #${item.paciente_id}`
      })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.patientName}>{item.paciente_nome || `Patient #${item.paciente_id}`}</Text>
        <View style={styles.statusDot} />
      </View>
      <Text style={styles.detail}>Permissions: {item.permissoes}</Text>
      <Text style={styles.detail}>Patient ID: {item.paciente_id}</Text>
      <View style={styles.actionRow}>
        <Text style={styles.actionText}>View Medications ➔</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Patients</Text>
      
      {patients?.length === 0 ? (
        <Text style={styles.emptyText}>.</Text>
      ) : (
        <FlatList
          data={patients}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPatientCard}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#9C27B0',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  patientName: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50' },
  statusDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#4CAF50' },
  detail: { fontSize: 14, color: '#7f8c8d', marginBottom: 4 },
  actionRow: { marginTop: 15, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10, alignItems: 'flex-end' },
  actionText: { color: '#9C27B0', fontWeight: 'bold' },
  emptyText: { fontSize: 16, color: '#7f8c8d', textAlign: 'center', marginTop: 40 },
  errorText: { color: 'red', fontSize: 16 },
});