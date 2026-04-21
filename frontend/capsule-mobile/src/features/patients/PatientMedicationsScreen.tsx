import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Button, Alert } from 'react-native';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { PatientMeResponse } from '../../types/patient';
import { PatientMedication } from '../../types/medication';
import { DoseRecordCreate } from '../../types/doseRecord';

const fetchMyProfile = async (): Promise<PatientMeResponse> => {
  const response = await apiClient.get('/pacientes/me');
  return response.data;
};

const fetchMyMedications = async (pacienteId: number): Promise<PatientMedication[]> => {
  const response = await apiClient.get(`/paciente-medicamentos/paciente/${pacienteId}`);
  return response.data;
};

const logDose = async (doseData: DoseRecordCreate) => {
  const response = await apiClient.post('/registros-dose/', doseData);
  return response.data;
};

export default function PatientMedicationsScreen() {
  const { data: profileData, isLoading: loadingProfile } = useQuery({
    queryKey: ['patientMe'],
    queryFn: fetchMyProfile,
  });

  const pacienteId = profileData?.perfil?.id;

  const { data: medications, isLoading: loadingMedications, isError } = useQuery({
    queryKey: ['patientMedications', pacienteId],
    queryFn: () => fetchMyMedications(pacienteId!),
    enabled: !!pacienteId, 
  });

  // Setup the mutation
  const logDoseMutation = useMutation({
    mutationFn: logDose,
    onSuccess: () => {
      Alert.alert("Success!", "Dose logged successfully.");
      // In a real app, you might want to invalidate queries here to refresh the stock count
    },
    onError: () => {
      Alert.alert("Error", "Failed to log the dose.");
    }
  });

  const handleTakeDose = (medicationId: number) => {
    const payload: DoseRecordCreate = {
      paciente_medicamento_id: medicationId,
      status: "TOMADO", 
      data_hora_prevista: new Date().toISOString(),
      metodo_confirmacao: "MANUAL_APP"
    };
    
    logDoseMutation.mutate(payload);
  };

  if (loadingProfile || loadingMedications) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load medications.</Text>
      </View>
    );
  }

  const renderMedicationItem = ({ item }: { item: PatientMedication }) => (
    <View style={styles.card}>
      <Text style={styles.medName}>Medication ID: {item.medicamento_id}</Text>
      <Text style={styles.detail}>Dosage: {item.dosagem || 'N/A'}</Text>
      <Text style={styles.detail}>Frequency: {item.frequencia || 'N/A'}</Text>
      {item.instrucoes && <Text style={styles.instructions}>Note: {item.instrucoes}</Text>}
      
      <View style={styles.stockContainer}>
        <Text style={styles.detail}>Stock: {item.estoque_atual}</Text>
        {item.estoque_atual <= item.estoque_minimo && (
          <Text style={styles.lowStockWarning}> (Low Stock!)</Text>
        )}
      </View>

      <View style={styles.actionContainer}>
        <Button 
          title={logDoseMutation.isPending ? "Logging..." : "Log Dose Taken"} 
          onPress={() => handleTakeDose(item.id)}
          color="#4CAF50"
          disabled={logDoseMutation.isPending}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Prescriptions</Text>
      
      {medications?.length === 0 ? (
        <Text style={styles.emptyText}>You have no active medications.</Text>
      ) : (
        <FlatList
          data={medications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMedicationItem}
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
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  medName: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50', marginBottom: 5 },
  detail: { fontSize: 14, color: '#7f8c8d', marginBottom: 3 },
  instructions: { fontSize: 14, color: '#34495e', fontStyle: 'italic', marginTop: 5 },
  stockContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  lowStockWarning: { fontSize: 14, color: '#e74c3c', fontWeight: 'bold' },
  actionContainer: { marginTop: 15, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10 },
  emptyText: { fontSize: 16, color: '#7f8c8d', textAlign: 'center', marginTop: 40 },
  errorText: { color: 'red', fontSize: 16 },
});