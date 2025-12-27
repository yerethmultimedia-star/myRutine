import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { routinesService } from '../../services/routines';
import { Routine } from '../../types';
import Icon from 'react-native-vector-icons/MaterialIcons';

type RoutinesScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const RoutinesScreen: React.FC = () => {
  const navigation = useNavigation<RoutinesScreenNavigationProp>();
  const queryClient = useQueryClient();

  const { data: routines, isLoading, refetch } = useQuery({
    queryKey: ['routines'],
    queryFn: () => routinesService.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => routinesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines'] });
    },
  });

  const renderRoutine = ({ item }: { item: Routine }) => (
    <TouchableOpacity
      style={styles.routineCard}
      onPress={() => navigation.navigate('RoutineDetail', { routineId: item.id })}
    >
      <View style={styles.routineHeader}>
        <Text style={styles.routineName}>{item.name}</Text>
        <View style={[styles.statusBadge, item.is_active ? styles.activeBadge : styles.inactiveBadge]}>
          <Text style={styles.statusText}>{item.is_active ? 'Activa' : 'Inactiva'}</Text>
        </View>
      </View>
      {item.description && (
        <Text style={styles.routineDescription} numberOfLines={2}>
          {item.description}
        </Text>
      )}
      {item.objective && (
        <Text style={styles.routineObjective} numberOfLines={1}>
          🎯 {item.objective}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={routines}
        renderItem={renderRoutine}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="list" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No tienes rutinas aún</Text>
            <Text style={styles.emptySubtext}>Crea tu primera rutina para empezar</Text>
          </View>
        }
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateRoutine' as any)}
      >
        <Icon name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 15,
  },
  routineCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  routineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  routineName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
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
  routineDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  routineObjective: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
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
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default RoutinesScreen;
