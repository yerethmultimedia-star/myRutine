import { apiClient } from './api';
import { Platform, Alert, Share } from 'react-native';
import RNFS from 'react-native-fs';

export const exportService = {
  async exportJSON(): Promise<void> {
    try {
      const data = await apiClient.get<any>('/export/json');
      const jsonString = JSON.stringify(data, null, 2);
      const fileName = `myrutine-export-${Date.now()}.json`;
      const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

      await RNFS.writeFile(filePath, jsonString, 'utf8');

      if (Platform.OS === 'ios') {
        await Share.share({
          url: `file://${filePath}`,
          type: 'application/json',
        });
      } else {
        Alert.alert('Exportado', `Archivo guardado en: ${filePath}`);
      }
    } catch (error) {
      console.error('Export error:', error);
      throw error;
    }
  },

  async exportCSV(): Promise<void> {
    try {
      // Note: This would need a proper CSV endpoint or convert JSON to CSV
      const response = await fetch(`${apiClient.baseUrl}/export/csv`, {
        headers: await apiClient.getHeadersPublic(),
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const csvText = await response.text();
      const fileName = `myrutine-tasks-${Date.now()}.csv`;
      const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

      await RNFS.writeFile(filePath, csvText, 'utf8');

      if (Platform.OS === 'ios') {
        await Share.share({
          url: `file://${filePath}`,
          type: 'text/csv',
        });
      } else {
        Alert.alert('Exportado', `Archivo guardado en: ${filePath}`);
      }
    } catch (error) {
      console.error('Export error:', error);
      throw error;
    }
  },
};
