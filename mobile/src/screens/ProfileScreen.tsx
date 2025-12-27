import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { userService } from '../services/user';
import { exportService } from '../services/export';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen: React.FC = () => {
  const { signOut } = useAuthStore();
  const navigation = useNavigation();

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => userService.getProfile(),
  });

  const handleSignOut = () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro de que quieres cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar Sesión', onPress: signOut, style: 'destructive' },
    ]);
  };

  const handleExportJSON = async () => {
    try {
      await exportService.exportJSON();
      Alert.alert('Éxito', 'Datos exportados correctamente');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al exportar datos');
    }
  };

  const handleExportCSV = async () => {
    try {
      await exportService.exportCSV();
      Alert.alert('Éxito', 'Datos exportados correctamente');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al exportar datos');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {user?.avatar_url ? (
          <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Icon name="person" size={40} color="#fff" />
          </View>
        )}
        <Text style={styles.name}>{user?.name || 'Usuario'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>Nivel {user?.level || 1}</Text>
          <Text style={styles.xpText}>{user?.total_xp || 0} XP</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Datos</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={handleExportJSON}>
          <Icon name="file-download" size={24} color="#007AFF" />
          <Text style={styles.menuItemText}>Exportar como JSON</Text>
          <Icon name="chevron-right" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleExportCSV}>
          <Icon name="file-download" size={24} color="#007AFF" />
          <Text style={styles.menuItemText}>Exportar como CSV</Text>
          <Icon name="chevron-right" size={24} color="#ccc" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cuenta</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={handleSignOut}>
          <Icon name="logout" size={24} color="#ff3b30" />
          <Text style={[styles.menuItemText, styles.dangerText]}>Cerrar Sesión</Text>
          <Icon name="chevron-right" size={24} color="#ccc" />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>myRutine v1.0.0</Text>
        <Text style={styles.footerText}>Mejora tu rendimiento diario</Text>
      </View>
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
    padding: 30,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  levelBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    gap: 15,
  },
  levelText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  xpText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 20,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginLeft: 15,
  },
  dangerText: {
    color: '#ff3b30',
  },
  footer: {
    padding: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
  },
});

export default ProfileScreen;
