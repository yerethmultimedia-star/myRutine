import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksService } from '../../services/tasks';
import { Task, TaskPriority, TaskDifficulty } from '../../types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { format } from 'date-fns';

type TaskDetailRouteProp = RouteProp<{ TaskDetail: { taskId: string } }, 'TaskDetail'>;

const TaskDetailScreen: React.FC = () => {
  const route = useRoute<TaskDetailRouteProp>();
  const navigation = useNavigation();
  const { taskId } = route.params;
  const queryClient = useQueryClient();

  const { data: task, isLoading } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => tasksService.getById(taskId),
  });

  const completeMutation = useMutation({
    mutationFn: () => tasksService.complete(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['progress'] });
    },
  });

  const uncompleteMutation = useMutation({
    mutationFn: () => tasksService.uncomplete(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['progress'] });
    },
  });

  const pauseMutation = useMutation({
    mutationFn: () => tasksService.pause(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
    },
  });

  const resumeMutation = useMutation({
    mutationFn: () => tasksService.resume(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => tasksService.delete(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      navigation.goBack();
    },
  });

  const handleComplete = () => {
    if (task?.is_completed) {
      uncompleteMutation.mutate();
    } else {
      completeMutation.mutate();
    }
  };

  const handlePause = () => {
    if (task?.is_paused) {
      resumeMutation.mutate();
    } else {
      pauseMutation.mutate();
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Tarea',
      '¿Estás seguro de que quieres eliminar esta tarea?',
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

  if (isLoading || !task) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.LOW:
        return '#4CAF50';
      case TaskPriority.MEDIUM:
        return '#FF9800';
      case TaskPriority.HIGH:
        return '#FF5722';
      case TaskPriority.CRITICAL:
        return '#F44336';
      default:
        return '#999';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.name, task.is_completed && styles.nameCompleted]}>
          {task.name}
        </Text>
        {task.is_completed && <Icon name="check-circle" size={32} color="#4CAF50" />}
        {task.is_paused && <Icon name="pause-circle" size={32} color="#FF9800" />}
      </View>

      {task.description && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.sectionContent}>{task.description}</Text>
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Prioridad:</Text>
          <View
            style={[
              styles.priorityBadge,
              { backgroundColor: getPriorityColor(task.priority) },
            ]}
          >
            <Text style={styles.priorityText}>{task.priority}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Dificultad:</Text>
          <View style={styles.difficultyContainer}>
            {[1, 2, 3, 4, 5].map((level) => (
              <View
                key={level}
                style={[
                  styles.difficultyDot,
                  level <= task.difficulty && styles.difficultyDotActive,
                ]}
              />
            ))}
            <Text style={styles.difficultyText}>{task.difficulty}/5</Text>
          </View>
        </View>

        {task.deadline && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fecha límite:</Text>
            <Text style={styles.infoValue}>
              {format(new Date(task.deadline), 'dd MMMM yyyy')}
            </Text>
          </View>
        )}

        {task.repetition !== 'none' && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Repetición:</Text>
            <Text style={styles.infoValue}>{task.repetition}</Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            task.is_completed ? styles.uncompleteButton : styles.completeButton,
          ]}
          onPress={handleComplete}
          disabled={completeMutation.isPending || uncompleteMutation.isPending}
        >
          <Icon
            name={task.is_completed ? 'undo' : 'check'}
            size={24}
            color="#fff"
          />
          <Text style={styles.actionButtonText}>
            {task.is_completed ? 'Marcar como no completada' : 'Completar'}
          </Text>
        </TouchableOpacity>

        {!task.is_completed && (
          <TouchableOpacity
            style={[
              styles.actionButton,
              task.is_paused ? styles.resumeButton : styles.pauseButton,
            ]}
            onPress={handlePause}
            disabled={pauseMutation.isPending || resumeMutation.isPending}
          >
            <Icon
              name={task.is_paused ? 'play-arrow' : 'pause'}
              size={24}
              color="#fff"
            />
            <Text style={styles.actionButtonText}>
              {task.is_paused ? 'Reanudar' : 'Pausar'}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Icon name="delete" size={24} color="#fff" />
          <Text style={styles.deleteButtonText}>Eliminar</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  nameCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  sectionContent: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    width: 120,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  priorityText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  difficultyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  difficultyDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  difficultyDotActive: {
    backgroundColor: '#007AFF',
  },
  difficultyText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  actions: {
    padding: 20,
    gap: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    gap: 10,
  },
  completeButton: {
    backgroundColor: '#4CAF50',
  },
  uncompleteButton: {
    backgroundColor: '#FF9800',
  },
  pauseButton: {
    backgroundColor: '#FF9800',
  },
  resumeButton: {
    backgroundColor: '#2196F3',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff3b30',
    padding: 15,
    borderRadius: 8,
    gap: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TaskDetailScreen;
