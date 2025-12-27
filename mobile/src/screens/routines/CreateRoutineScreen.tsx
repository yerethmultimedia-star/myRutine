import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { routinesService } from '../../services/routines';
import { Routine } from '../../types';

const CreateRoutineScreen: React.FC = () => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [objective, setObjective] = useState('');
  const [durationDays, setDurationDays] = useState('');
  const [frequency, setFrequency] = useState('');

  const createMutation = useMutation({
    mutationFn: (routine: Partial<Routine>) => routinesService.create(routine),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines'] });
      navigation.goBack();
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message || 'Error al crear rutina');
    },
  });

  const handleCreate = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'El nombre es requerido');
      return;
    }

    createMutation.mutate({
      name: name.trim(),
      description: description.trim() || undefined,
      objective: objective.trim() || undefined,
      duration_days: durationDays ? parseInt(durationDays) : undefined,
      frequency: frequency.trim() || undefined,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Nombre *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Ej: Rutina matutina"
        />

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Describe tu rutina"
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Objetivo</Text>
        <TextInput
          style={styles.input}
          value={objective}
          onChangeText={setObjective}
          placeholder="¿Qué quieres lograr?"
        />

        <Text style={styles.label}>Duración (días)</Text>
        <TextInput
          style={styles.input}
          value={durationDays}
          onChangeText={setDurationDays}
          placeholder="30"
          keyboardType="number-pad"
        />

        <Text style={styles.label}>Frecuencia</Text>
        <TextInput
          style={styles.input}
          value={frequency}
          onChangeText={setFrequency}
          placeholder="Ej: Diaria, 3 veces por semana"
        />

        <TouchableOpacity
          style={[styles.button, createMutation.isPending && styles.buttonDisabled]}
          onPress={handleCreate}
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Crear Rutina</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 15,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreateRoutineScreen;
