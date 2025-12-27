import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface StatsCardProps {
  title: string;
  completed: number;
  total: number;
  percentage: number;
  style?: ViewStyle;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  completed,
  total,
  percentage,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.percentage}>{percentage}%</Text>
      <Text style={styles.stats}>
        {completed} / {total}
      </Text>
      <View style={styles.miniProgressBar}>
        <View style={[styles.miniProgress, { width: `${Math.min(percentage, 100)}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    color: '#666',
  },
  percentage: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  stats: {
    fontSize: 12,
    color: '#999',
    marginBottom: 10,
  },
  miniProgressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  miniProgress: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
});

export default StatsCard;
