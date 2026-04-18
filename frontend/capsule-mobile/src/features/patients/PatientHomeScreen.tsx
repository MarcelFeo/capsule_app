// src/features/patients/PatientHomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { PatientMeResponse } from '../../types/patient';

//funcao fetch
const fetchMyProfile = async (): Promise<PatientMeResponse> => {
  const response = await apiClient.get('/pacientes/me');
  return response.data;
};

export default function PatientHomeScreen() {
  const{data: patientData,isLoading,isError,error}= useQuery({
    queryKey: ['patientMe'],
    queryFn: fetchMyProfile,
  });

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={{marginTop: 10 }}>Carregando perfil...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Erro ao carregar perfil.</Text>
        <Text>{error instanceof Error ? error.message : 'Unknown error'}</Text>
      </View>
    );
  }

  const profile = patientData?.perfil;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.greeting}>Olá, {patientData?.nome}!</Text>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Perfil médico</Text>
        
        {profile ? (
          <>
            <View style={styles.row}>
              <Text style={styles.label}>Tipo sanguineo:</Text>
              <Text style={styles.value}>{profile.tipo_sanguineo || 'nao especificado'}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Alergias:</Text>
              <Text style={styles.value}>{profile.alergias || 'n/a'}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Condições:</Text>
              <Text style={styles.value}>{profile.condicoes_medicas || 'n/a'}</Text>
            </View>

            <View style={styles.divider} />

            <Text style={styles.cardSubtitle}>Contato de emergência</Text>
            <View style={styles.row}>
              <Text style={styles.label}>nome:</Text>
              <Text style={styles.value}>{profile.contato_emergencia || 'n/a'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>telefone:</Text>
              <Text style={styles.value}>{profile.telefone_emergencia || 'n/a'}</Text>
            </View>
          </>
        ) : (
          <Text style={styles.value}>detalhes vao aqui.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centerContainer: {flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { padding: 20 },
  greeting: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: { fontSize: 20, fontWeight: '600', marginBottom: 15, color: '#2c3e50' },
  cardSubtitle: { fontSize: 16, fontWeight: '600', marginTop: 10, marginBottom: 10, color: '#34495e' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  label: { fontSize: 16, color: '#7f8c8d', flex: 1 },
  value: { fontSize: 16, color: '#2c3e50', flex: 2, textAlign: 'right', fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#ecf0f1', marginVertical: 15 },
  errorText: { color: 'red', fontSize: 18, marginBottom: 10 },
});