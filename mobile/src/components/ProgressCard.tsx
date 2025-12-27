import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ProgressCardProps {
  title: string;
  completed: number;
  total: number;
  percentage: number;
  xpEarned: number;
}

const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  completed,
  total,
  percentage,
  xpEarned,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${percentage}%` }]} />
      </View>
      <View style={styles.stats}>
        <Text style={styles.statText}>
          {completed} / {total} completadas
        </Text>
        <Text style={styles.xpText}>+{xpEarned} XP</Text>
      </View>
      <Text style={styles.percentage}>{percentage}%</Text>
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
  progressBarContainer: {
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 6,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: '#666',
  },
  xpText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  percentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 5,
  },
});

export default ProgressCard;
