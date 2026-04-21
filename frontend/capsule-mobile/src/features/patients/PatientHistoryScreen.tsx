import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { DoseRecordResponse } from '../../types/doseRecord';

const fetchDoseHistory = async (): Promise<DoseRecordResponse[]> => {
  const response = await apiClient.get('/registros-dose/');
  return response.data;
};

export default function PatientHistoryScreen() {
  const { data: history, isLoading, isError, refetch } = useQuery({
    queryKey: ['doseHistory'],
    queryFn: fetchDoseHistory,
  });
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }
  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load history.</Text>
      </View>
    );
  }

  const renderHistoryItem = ({ item }: { item: DoseRecordResponse }) => {
    const isTaken = item.status === 'TOMADO';
    
    return (
      <View style={[styles.card, { borderLeftColor: isTaken ? '#4CAF50' : '#e74c3c' }]}>
        <View style={styles.headerRow}>
          <Text style={styles.medName}>Prescription ID: {item.paciente_medicamento_id}</Text>
          <Text style={[styles.statusBadge, { color: isTaken ? '#4CAF50' : '#e74c3c' }]}>
            {item.status}
          </Text>
        </View>
        
        <Text style={styles.detail}>
          Scheduled: {new Date(item.data_hora_prevista).toLocaleString()}
        </Text>
        
        {item.data_hora_confirmada && (
          <Text style={styles.detail}>
            Confirmed: {new Date(item.data_hora_confirmada).toLocaleString()}
          </Text>
        )}
        <Text style={styles.detail}>Method: {item.metodo_confirmacao || 'N/A'}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dose History</Text>
      
      {history?.length === 0 ? (
        <Text style={styles.emptyText}>No doses logged yet.</Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderHistoryItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          onRefresh={refetch}
          refreshing={isLoading}
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
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderLeftWidth: 4,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  medName: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50' },
  statusBadge: { fontSize: 14, fontWeight: 'bold' },
  detail: { fontSize: 14, color: '#7f8c8d', marginBottom: 4 },
  emptyText: { fontSize: 16, color: '#7f8c8d', textAlign: 'center', marginTop: 40 },
  errorText: { color: 'red', fontSize: 16 },
});