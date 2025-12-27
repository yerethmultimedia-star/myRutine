import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Streak } from '../types';

interface StreakCardProps {
  streaks: Streak[];
}

const StreakCard: React.FC<StreakCardProps> = ({ streaks }) => {
  const totalStreak = streaks.reduce((sum, s) => sum + s.current_streak, 0);
  const longestStreak = Math.max(...streaks.map(s => s.longest_streak), 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔥 Rachas</Text>
      <View style={styles.streakInfo}>
        <View style={styles.streakItem}>
          <Text style={styles.streakValue}>{totalStreak}</Text>
          <Text style={styles.streakLabel}>Días consecutivos</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.streakItem}>
          <Text style={styles.streakValue}>{longestStreak}</Text>
          <Text style={styles.streakLabel}>Récord personal</Text>
        </View>
      </View>
      <Text style={styles.motivation}>¡Sigue así! 💪</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  streakInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 15,
  },
  streakItem: {
    alignItems: 'center',
  },
  streakValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 5,
  },
  streakLabel: {
    fontSize: 12,
    color: '#666',
  },
  divider: {
    width: 1,
    height: 50,
    backgroundColor: '#e0e0e0',
  },
  motivation: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default StreakCard;
