import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface LevelCardProps {
  level: number;
  totalXP: number;
  xpToNextLevel: number;
}

const LevelCard: React.FC<LevelCardProps> = ({ level, totalXP, xpToNextLevel }) => {
  const currentLevelXP = totalXP - (level - 1) * 100 * level / 2;
  const levelXPRequired = level * 100;
  const levelProgress = levelXPRequired > 0 ? (currentLevelXP / levelXPRequired) * 100 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.levelLabel}>Nivel {level}</Text>
        <Text style={styles.xpLabel}>{totalXP} XP</Text>
      </View>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${Math.min(levelProgress, 100)}%` }]} />
      </View>
      <Text style={styles.nextLevelText}>
        {xpToNextLevel} XP para el siguiente nivel
      </Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>⭐</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  levelLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  xpLabel: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  nextLevelText: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
  },
  badge: {
    position: 'absolute',
    right: 20,
    top: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 30,
  },
});

export default LevelCard;
