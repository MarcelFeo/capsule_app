import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Button, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { PatientMedication } from '../../types/medication';
import { DoseRecordCreate } from '../../types/doseRecord';
import { AuthContext } from '../auth/AuthContext'; 

const fetchPatientMedications = async (pacienteId: number): Promise<PatientMedication[]> => {
  const response = await apiClient.get(`/paciente-medicamentos/paciente/${pacienteId}`);
  return response.data;
};

const logDose = async (doseData: DoseRecordCreate) => {
  const response = await apiClient.post('/registros-dose/', doseData);
  return response.data;
};

export default function CaregiverPatientDetailScreen() {
  const route = useRoute<any>(); 
  const { pacienteId, pacienteNome } = route.params;
  const queryClient = useQueryClient();
  const authContext = useContext(AuthContext); // vai ser usado p identifica quem logou a dose
  const navigation = useNavigation<any>();

  const { data: medications, isLoading, isError } = useQuery({
    queryKey: ['patientMedications', pacienteId],
    queryFn: () => fetchPatientMedications(pacienteId),
  });

  const logDoseMutation = useMutation({
    mutationFn: logDose,
    onSuccess: () => {
      Alert.alert("Successo!", `Dose tomada com sucesso ${pacienteNome}.`);
      queryClient.invalidateQueries({ queryKey: ['doseHistory'] }); 
    },
    onError: () => {
      Alert.alert("Error", "Erro ao logar a dose.");
    }
  });

  const handleLogDoseAsCaregiver = (medicationId: number) => {
    const payload: DoseRecordCreate = {
      paciente_medicamento_id: medicationId,
      status: "TOMADO", 
      data_hora_prevista: new Date().toISOString(), 
      metodo_confirmacao: "MANUAL_CUIDADOR", //pro mock, tem que mudar depois
      registrado_por: 2 
    };
    
    logDoseMutation.mutate(payload);
  };
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
        <Text style={styles.errorText}>Erro ao carregar medicamentos.</Text>
      </View>
    );
  }

  const renderMedicationItem = ({ item }: { item: PatientMedication }) => (
    <View style={styles.card}>
      <Text style={styles.medName}>ID: {item.medicamento_id}</Text>
      <Text style={styles.detail}>Dosagem: {item.dosagem || 'N/A'}</Text>
      <Text style={styles.detail}>Frequencia: {item.frequencia || 'N/A'}</Text>
      {item.instrucoes && <Text style={styles.instructions}>Note: {item.instrucoes}</Text>}
      
      <View style={styles.stockContainer}>
        <Text style={styles.detail}>Stock: {item.estoque_atual}</Text>
        {item.estoque_atual <= item.estoque_minimo && (
          <Text style={styles.lowStockWarning}> (Estoque baixo!)</Text>
        )}
      </View>
      <View style={styles.actionContainer}>
        <View style={styles.buttonRow}>
          <View style={styles.buttonWrapper}>
            <Button 
              title={logDoseMutation.isPending ? "Logging..." : "Administer Dose"} 
              onPress={() => handleLogDoseAsCaregiver(item.id)}
              color="#9C27B0" 
              disabled={logDoseMutation.isPending}
            />
          </View>
          <View style={styles.spacer} />
          <View style={styles.buttonWrapper}>
            <Button 
              title="View History" 
              onPress={() => navigation.navigate('MedicationHistory', { medicationId: item.id })}
              color="#607D8B" 
            />
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prescriptions for {pacienteNome}</Text>
      
      {medications?.length === 0 ? (
        <Text style={styles.emptyText}>This patient has no active medications.</Text>
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
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#333' },
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
    borderLeftColor: '#9C27B0',
  },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  buttonWrapper: { flex: 1 },
  spacer: { width: 10 },
  medName: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50', marginBottom: 5 },
  detail: { fontSize: 14, color: '#7f8c8d', marginBottom: 3 },
  instructions: { fontSize: 14, color: '#34495e', fontStyle: 'italic', marginTop: 5 },
  stockContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  lowStockWarning: { fontSize: 14, color: '#e74c3c', fontWeight: 'bold' },
  actionContainer: { marginTop: 15, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10 },
  emptyText: { fontSize: 16, color: '#7f8c8d', textAlign: 'center', marginTop: 40 },
  errorText: { color: 'red', fontSize: 16 },
});