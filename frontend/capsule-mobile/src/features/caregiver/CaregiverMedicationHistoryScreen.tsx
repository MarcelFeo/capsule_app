import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { DoseRecordResponse } from '../../types/doseRecord';

const fetchMedicationHistory = async (pmId: number): Promise<DoseRecordResponse[]> => {
  const response = await apiClient.get(`/registros-dose/paciente-medicamento/${pmId}`);
  return response.data;
};

export default function CaregiverMedicationHistoryScreen() {
  const route = useRoute<any>();
  const { medicationId } = route.params;

  const { data: history, isLoading, isError, refetch } = useQuery({
    queryKey: ['medicationHistory', medicationId],
    queryFn: () => fetchMedicationHistory(medicationId),
  });
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#9C27B0" />
      </View>
    );
  }
  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Erro ao carregar doses tomadas.</Text>
      </View>
    );
  }

  const renderHistoryItem = ({ item }: { item: DoseRecordResponse }) => {
    const isTaken = item.status === 'TOMADO';
    return (
      <View style={[styles.card, { borderLeftColor: isTaken ? '#4CAF50' : '#e74c3c' }]}>
        <View style={styles.headerRow}>
          <Text style={styles.statusBadge}>{item.status}</Text>
          <Text style={styles.methodText}>{item.metodo_confirmacao || 'Unknown Method'}</Text>
        </View>
        
        <Text style={styles.detail}>
          Scheduled: {new Date(item.data_hora_prevista).toLocaleString()}
        </Text>
        
        {item.data_hora_confirmada && (
          <Text style={styles.detail}>
            Confirmed: {new Date(item.data_hora_confirmada).toLocaleString()}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Doses tomadas</Text>
      <Text style={styles.subtitle}>ID da medicação: {medicationId}</Text>
      
      {history?.length === 0 ? (
        <Text style={styles.emptyText}>Sem doses registradas para este medicamento até o momento.</Text>
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
  title: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 16, color: '#7f8c8d', marginBottom: 20 },
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
  statusBadge: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50' },
  methodText: { fontSize: 12, color: '#9C27B0', fontWeight: '600' },
  detail: { fontSize: 14, color: '#7f8c8d', marginBottom: 4 },
  emptyText: { fontSize: 16, color: '#7f8c8d', textAlign: 'center', marginTop: 40 },
  errorText: { color: 'red', fontSize: 16 },
});