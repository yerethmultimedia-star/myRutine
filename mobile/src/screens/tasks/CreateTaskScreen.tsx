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
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksService } from '../../services/tasks';
import { Task, TaskPriority, TaskDifficulty, TaskRepetition } from '../../types';

type CreateTaskRouteProp = RouteProp<{ CreateTask: { routineId: string } }, 'CreateTask'>;

const CreateTaskScreen: React.FC = () => {
  const route = useRoute<CreateTaskRouteProp>();
  const navigation = useNavigation();
  const { routineId } = route.params;
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [difficulty, setDifficulty] = useState<TaskDifficulty>(TaskDifficulty.MEDIUM);
  const [deadline, setDeadline] = useState('');
  const [repetition, setRepetition] = useState<TaskRepetition>(TaskRepetition.NONE);

  const createMutation = useMutation({
    mutationFn: (task: Partial<Task>) => tasksService.create(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['routine', routineId] });
      navigation.goBack();
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message || 'Error al crear tarea');
    },
  });

  const handleCreate = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'El nombre es requerido');
      return;
    }

    createMutation.mutate({
      routine_id: routineId,
      name: name.trim(),
      description: description.trim() || undefined,
      priority,
      difficulty,
      deadline: deadline || undefined,
      repetition,
    });
  };

  const priorities: { value: TaskPriority; label: string; color: string }[] = [
    { value: TaskPriority.LOW, label: 'Baja', color: '#4CAF50' },
    { value: TaskPriority.MEDIUM, label: 'Media', color: '#FF9800' },
    { value: TaskPriority.HIGH, label: 'Alta', color: '#FF5722' },
    { value: TaskPriority.CRITICAL, label: 'Crítica', color: '#F44336' },
  ];

  const difficulties = [1, 2, 3, 4, 5];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Nombre *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Nombre de la tarea"
        />

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Descripción de la tarea"
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Prioridad</Text>
        <View style={styles.optionsRow}>
          {priorities.map((p) => (
            <TouchableOpacity
              key={p.value}
              style={[
                styles.optionButton,
                priority === p.value && { backgroundColor: p.color },
              ]}
              onPress={() => setPriority(p.value)}
            >
              <Text
                style={[
                  styles.optionButtonText,
                  priority === p.value && styles.optionButtonTextActive,
                ]}
              >
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Dificultad</Text>
        <View style={styles.optionsRow}>
          {difficulties.map((d) => (
            <TouchableOpacity
              key={d}
              style={[
                styles.difficultyButton,
                difficulty === d && styles.difficultyButtonActive,
              ]}
              onPress={() => setDifficulty(d as TaskDifficulty)}
            >
              <Text
                style={[
                  styles.difficultyButtonText,
                  difficulty === d && styles.difficultyButtonTextActive,
                ]}
              >
                {d}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Fecha límite</Text>
        <TextInput
          style={styles.input}
          value={deadline}
          onChangeText={setDeadline}
          placeholder="YYYY-MM-DD"
        />

        <TouchableOpacity
          style={[styles.button, createMutation.isPending && styles.buttonDisabled]}
          onPress={handleCreate}
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Crear Tarea</Text>
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
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  optionButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  optionButtonTextActive: {
    color: '#fff',
  },
  difficultyButton: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  difficultyButtonActive: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF',
  },
  difficultyButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
  difficultyButtonTextActive: {
    color: '#fff',
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

export default CreateTaskScreen;
