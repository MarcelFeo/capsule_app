import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { MedicationCatalogItem, PatientMedicationCreate } from '../../types/medication';

const fetchCatalog = async (): Promise<MedicationCatalogItem[]> => {
  const response = await apiClient.get('/medicamentos/');
  return response.data;
};

const createPrescription = async (data: PatientMedicationCreate) => {
  const response = await apiClient.post('/paciente-medicamentos/', data);
  return response.data;
};

export default function CaregiverAddMedicationScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { pacienteId, pacienteNome } = route.params;
  const [selectedMedId, setSelectedMedId] = useState<number | null>(null);
  const [dosagem, setDosagem] = useState('');
  const [frequencia, setFrequencia] = useState('');
  const [instrucoes, setInstrucoes] = useState('');
  const [estoque, setEstoque] = useState('30');


  const { data: catalog, isLoading } = useQuery({
    queryKey: ['medicationCatalog'],
    queryFn: fetchCatalog,
  });
  const addMutation = useMutation({
    mutationFn: createPrescription,
    onSuccess: () => {
      Alert.alert('Sucesso', 'Medicamento adicionado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['patientMedications', pacienteId] });
      navigation.goBack();
    },
    onError: () => {
      Alert.alert('Erro', 'Falha ao adicionar medicamento.');
    }
  });

  const handleSave = () => {
    if (!selectedMedId) {
      Alert.alert('Erro de Validação', 'Por favor, selecione um medicamento da lista.');
      return;
    }

    const payload: PatientMedicationCreate = {
      paciente_id: pacienteId,
      medicamento_id: selectedMedId,
      dosagem,
      frequencia,
      instrucoes,
      estoque_atual: parseInt(estoque) || 0,
      estoque_minimo: 5,
      data_inicio: new Date().toISOString().split('T')[0], 
      prescrito_por: 2,
    };

    addMutation.mutate(payload);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Nova Prescrição</Text>
      <Text style={styles.subtitle}>Para : {pacienteNome}</Text>
      <Text style={styles.label}>1. Selecionar Medicamento</Text>
      <View style={styles.catalogList}>
        {isLoading ? <Text>Carregando...</Text> : catalog?.map((med) => (
          <Text 
            key={med.id} 
            style={[styles.catalogItem, selectedMedId === med.id && styles.selectedItem]}
            onPress={() => setSelectedMedId(med.id)}
          >
            {med.nome} ({med.nome_generico})
          </Text>
        ))}
      </View>

      <Text style={styles.label}>2. Dosagem</Text>
      <TextInput style={styles.input} placeholder="e.g., 50mg" value={dosagem} onChangeText={setDosagem} />
      <Text style={styles.label}>3. Frequência</Text>
      <TextInput style={styles.input} placeholder="e.g., 1x ao dia" value={frequencia} onChangeText={setFrequencia} />
      <Text style={styles.label}>4. Instruções</Text>
      <TextInput style={styles.input} placeholder="e.g., Tomar após o almoço" value={instrucoes} onChangeText={setInstrucoes} />
      <Text style={styles.label}>5. Estoque Inicial</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={estoque} onChangeText={setEstoque} />
      <View style={styles.buttonContainer}>
        <Button 
          title={addMutation.isPending ? "Salvando..." : "Salvar Prescrição"} 
          onPress={handleSave} 
          color="#4CAF50"
          disabled={addMutation.isPending}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f8f9fa' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 16, color: '#7f8c8d', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50', marginTop: 15, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, backgroundColor: '#fff' },
  catalogList: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, backgroundColor: '#fff', overflow: 'hidden' },
  catalogItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee', fontSize: 16 },
  selectedItem: { backgroundColor: '#e8f5e9', fontWeight: 'bold', color: '#4CAF50' },
  buttonContainer: { marginTop: 30, marginBottom: 40 },
});