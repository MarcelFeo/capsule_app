import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { NotificationResponse } from '../../types/notification';
import { AuthContext } from '../auth/AuthContext';

const fetchUserNotifications = async (usuarioId: number): Promise<NotificationResponse[]> => {
  const response = await apiClient.get(`/notificacoes/usuario/${usuarioId}`);
  return response.data;
};

const markAsRead = async (notificationId: number) => {
  const response = await apiClient.put(`/notificacoes/${notificationId}`, {
    lida: true,
    data_leitura: new Date().toISOString()
  });
  return response.data;
};

export default function NotificationsScreen() {
  const authContext = useContext(AuthContext);
  const queryClient = useQueryClient();
  
  const usuarioId = 1; // mock, mudar depois para authContext.user?.id
  const { data: notifications, isLoading, isError, refetch } = useQuery({
    queryKey: ['notifications', usuarioId],
    queryFn: () => fetchUserNotifications(usuarioId),
  });
  const readMutation = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', usuarioId] });
    }
  });

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Erro ao carregar notificações.</Text>
      </View>
    );
  }

  const renderNotification = ({ item }: { item: NotificationResponse }) => (
    <TouchableOpacity 
      style={[styles.card, !item.lida && styles.unreadCard]}
      onPress={() => {
        if (!item.lida) readMutation.mutate(item.id);
      }}
      disabled={item.lida || readMutation.isPending}
    >
      <View style={styles.headerRow}>
        <Text style={styles.priorityText}>{item.prioridade}</Text>
        <Text style={styles.dateText}>
          {item.data_envio ? new Date(item.data_envio).toLocaleTimeString() : ''}
        </Text>
      </View>
      <Text style={styles.message}>{item.mensagem}</Text>
      {!item.lida && (
        <Text style={styles.unreadDot}>Toque para marcar como lida</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <FlatList
        data={notifications?.slice().sort((a, b) => Number(a.lida) - Number(b.lida))} 
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderNotification}
        contentContainerStyle={{ paddingBottom: 20 }}
        onRefresh={refetch}
        refreshing={isLoading}
        ListEmptyComponent={<Text style={styles.emptyText}>Sem notificações</Text>}
      />
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
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
    opacity: 0.7, 
  },
  unreadCard: {
    backgroundColor: '#e3f2fd', 
    borderColor: '#2196F3',
    opacity: 1,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  priorityText: { fontSize: 12, fontWeight: 'bold', color: '#7f8c8d' },
  dateText: { fontSize: 12, color: '#95a5a6' },
  message: { fontSize: 16, color: '#2c3e50', fontWeight: '500' },
  unreadDot: { fontSize: 12, color: '#2196F3', marginTop: 10, fontStyle: 'italic' },
  emptyText: { textAlign: 'center', color: '#7f8c8d', marginTop: 40 },
  errorText: { color: 'red' },
});