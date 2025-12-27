import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  SectionList,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { tasksService } from '../../services/tasks';
import { Task } from '../../types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { format } from 'date-fns';

type TasksScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const TasksScreen: React.FC = () => {
  const navigation = useNavigation<TasksScreenNavigationProp>();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'paused'>('all');

  const { data: tasks, isLoading, refetch } = useQuery({
    queryKey: ['tasks', filter],
    queryFn: () => {
      if (filter === 'completed') return tasksService.getAll({ is_completed: true });
      if (filter === 'paused') return tasksService.getAll({ is_paused: true });
      if (filter === 'active') return tasksService.getAll({ is_completed: false, is_paused: false });
      return tasksService.getAll();
    },
  });

  const renderTask = ({ item }: { item: Task }) => (
    <TouchableOpacity
      style={styles.taskCard}
      onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}
    >
      <View style={styles.taskHeader}>
        <Text style={[styles.taskName, item.is_completed && styles.taskCompleted]}>
          {item.name}
        </Text>
        <View style={styles.taskIcons}>
          {item.is_completed && <Icon name="check-circle" size={24} color="#4CAF50" />}
          {item.is_paused && <Icon name="pause-circle" size={24} color="#FF9800" />}
        </View>
      </View>
      {item.description && (
        <Text style={styles.taskDescription} numberOfLines={2}>
          {item.description}
        </Text>
      )}
      <View style={styles.taskMeta}>
        <View style={[styles.priorityBadge, styles[`priority${item.priority.toUpperCase()}`]]}>
          <Text style={styles.priorityText}>{item.priority}</Text>
        </View>
        <Text style={styles.difficultyText}>Dificultad: {item.difficulty}/5</Text>
        {item.deadline && (
          <Text style={styles.deadlineText}>
            📅 {format(new Date(item.deadline), 'dd MMM')}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const filterButtons = [
    { key: 'all', label: 'Todas' },
    { key: 'active', label: 'Activas' },
    { key: 'completed', label: 'Completadas' },
    { key: 'paused', label: 'Pausadas' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        {filterButtons.map((button) => (
          <TouchableOpacity
            key={button.key}
            style={[styles.filterButton, filter === button.key && styles.filterButtonActive]}
            onPress={() => setFilter(button.key as any)}
          >
            <Text
              style={[
                styles.filterButtonText,
                filter === button.key && styles.filterButtonTextActive,
              ]}
            >
              {button.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="assignment" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No hay tareas</Text>
            <Text style={styles.emptySubtext}>Crea una nueva tarea para empezar</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginHorizontal: 4,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  list: {
    padding: 15,
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  taskIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  priorityLOW: {
    backgroundColor: '#E8F5E9',
  },
  priorityMEDIUM: {
    backgroundColor: '#FFF3E0',
  },
  priorityHIGH: {
    backgroundColor: '#FFE0B2',
  },
  priorityCRITICAL: {
    backgroundColor: '#FFCDD2',
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
    textTransform: 'capitalize',
  },
  difficultyText: {
    fontSize: 12,
    color: '#999',
  },
  deadlineText: {
    fontSize: 12,
    color: '#007AFF',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 8,
  },
});

export default TasksScreen;
