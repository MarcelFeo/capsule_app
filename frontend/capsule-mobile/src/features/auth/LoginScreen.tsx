// src/features/auth/LoginScreen.tsx
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { apiClient } from '../../api/client';
import { AuthContext } from './AuthContext';
import { Role } from '../../types/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const authContext = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append('username', email); 
      formData.append('password', password);
      const response = await apiClient.post('/auth/login', formData.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      const token = response.data.access_token;
      const role = response.data.user.tipo_usuario; 
      await authContext?.login(token, role);
    } catch (error) {
      console.error(error);
      Alert.alert('Login Failed', 'Invalid credentials or server error.');
    } finally {
      setLoading(false);
    }
  };

  const handleDevBypass = (role: Role) => {
    authContext?.login('fake-dev-token-123', role);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Capsule App</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button 
        title={loading ? "Entrando..." : "Login"} 
        onPress={handleLogin} 
        disabled={loading} 
      />

      {}
      <View style={styles.devSection}>
        <Text style={styles.devText}>-bypass-</Text>
        <View style={styles.devButtons}>
          <Button title="login como paciente" onPress={() => handleDevBypass('PACIENTE')} color="#4CAF50" />
        </View>
        <View style={styles.devButtons}>
          <Button title="login como cuidador" onPress={() => handleDevBypass('CUIDADOR')} color="#9C27B0" />
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 15, borderRadius: 8 },
  devSection: { marginTop: 40, borderTopWidth: 1, borderColor: '#eee', paddingTop: 20 },
  devText: { textAlign: 'center', color: '#888', marginBottom: 15, fontWeight: 'bold' },
  devButtons: { marginBottom: 10 }
});