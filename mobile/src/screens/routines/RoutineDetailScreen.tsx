import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { routinesService } from '../../services/routines';
import { tasksService } from '../../services/tasks';
import { Routine, Task } from '../../types';
import Icon from 'react-native-vector-icons/MaterialIcons';

type RoutineDetailRouteProp = RouteProp<RootStackParamList, 'RoutineDetail'>;
type RoutineDetailNavigationProp = StackNavigationProp<RootStackParamList>;

const RoutineDetailScreen: React.FC = () => {
  const route = useRoute<RoutineDetailRouteProp>();
  const navigation = useNavigation<RoutineDetailNavigationProp>();
  const { routineId } = route.params;
  const queryClient = useQueryClient();

  const { data: routine } = useQuery({
    queryKey: ['routine', routineId],
    queryFn: () => routinesService.getById(routineId),
  });

  const { data: tasks } = useQuery({
    queryKey: ['tasks', routineId],
    queryFn: () => tasksService.getAll({ routine_id: routineId }),
  });

  const deleteMutation = useMutation({
    mutationFn: () => routinesService.delete(routineId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines'] });
      navigation.goBack();
    },
  });

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Rutina',
      '¿Estás seguro de que quieres eliminar esta rutina? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => deleteMutation.mutate(),
        },
      ]
    );
  };

  if (!routine) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  const completedTasks = tasks?.filter(t => t.is_completed).length || 0;
  const totalTasks = tasks?.length || 0;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{routine.name}</Text>
        <View style={[styles.statusBadge, routine.is_active ? styles.activeBadge : styles.inactiveBadge]}>
          <Text style={styles.statusText}>{routine.is_active ? 'Activa' : 'Inactiva'}</Text>
        </View>
      </View>

      {routine.description && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.sectionContent}>{routine.description}</Text>
        </View>
      )}

      {routine.objective && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Objetivo</Text>
          <Text style={styles.sectionContent}>🎯 {routine.objective}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Progreso</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {completedTasks} / {totalTasks} tareas completadas ({Math.round(progress)}%)
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tareas</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('CreateTask', { routineId })}
          >
            <Icon name="add" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
        {tasks && tasks.length > 0 ? (
          tasks.map((task) => (
            <TouchableOpacity
              key={task.id}
              style={styles.taskItem}
              onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })}
            >
              <View style={styles.taskContent}>
                <Text style={[styles.taskName, task.is_completed && styles.taskCompleted]}>
                  {task.name}
                </Text>
                <Text style={styles.taskMeta}>
                  {task.priority} • Dificultad: {task.difficulty}/5
                </Text>
              </View>
              {task.is_completed && <Icon name="check-circle" size={24} color="#4CAF50" />}
              {task.is_paused && <Icon name="pause-circle" size={24} color="#FF9800" />}
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyText}>No hay tareas en esta rutina</Text>
        )}
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>Eliminar Rutina</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: '#4CAF50',
  },
  inactiveBadge: {
    backgroundColor: '#9E9E9E',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  sectionContent: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  progressBar: {
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  taskContent: {
    flex: 1,
  },
  taskName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  taskMeta: {
    fontSize: 12,
    color: '#999',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
    padding: 15,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RoutineDetailScreen;
