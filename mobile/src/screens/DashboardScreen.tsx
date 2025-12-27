import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { progressService } from '../services/progress';
import { userService } from '../services/user';
import ProgressCard from '../components/ProgressCard';
import StatsCard from '../components/StatsCard';
import StreakCard from '../components/StreakCard';
import LevelCard from '../components/LevelCard';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<DashboardScreenNavigationProp>();
  const [refreshing, setRefreshing] = React.useState(false);

  const { data: metrics, refetch: refetchMetrics } = useQuery({
    queryKey: ['progress'],
    queryFn: () => progressService.getMetrics(),
  });

  const { data: user, refetch: refetchUser } = useQuery({
    queryKey: ['user'],
    queryFn: () => userService.getProfile(),
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchMetrics(), refetchUser()]);
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.content}>
        <Text style={styles.greeting}>
          ¡Hola{user?.name ? `, ${user.name}` : ''}! 👋
        </Text>

        {user && (
          <LevelCard
            level={user.level}
            totalXP={user.total_xp}
            xpToNextLevel={metrics?.xp_to_next_level || 0}
          />
        )}

        {metrics && (
          <>
            <ProgressCard
              title="Hoy"
              completed={metrics.daily.completed}
              total={metrics.daily.total}
              percentage={metrics.daily.percentage}
              xpEarned={metrics.daily.xp_earned}
            />

            <View style={styles.statsRow}>
              <StatsCard
                title="Esta Semana"
                completed={metrics.weekly.completed}
                total={metrics.weekly.total}
                percentage={metrics.weekly.percentage}
                style={styles.statsCard}
              />
              <StatsCard
                title="Este Mes"
                completed={metrics.monthly.completed}
                total={metrics.monthly.total}
                percentage={metrics.monthly.percentage}
                style={styles.statsCard}
              />
            </View>

            {metrics.streaks && metrics.streaks.length > 0 && (
              <StreakCard streaks={metrics.streaks} />
            )}

            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('Tasks' as any)}
            >
              <Text style={styles.quickActionText}>Ver Tareas</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statsCard: {
    flex: 1,
    marginHorizontal: 5,
  },
  quickActionButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  quickActionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DashboardScreen;
