import PushNotification from 'react-native-push-notification';
import { Platform } from 'react-native';

class NotificationService {
  constructor() {
    this.configure();
  }

  configure() {
    PushNotification.configure({
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });

    PushNotification.createChannel(
      {
        channelId: 'myrutine-default',
        channelName: 'myRutine Notifications',
        channelDescription: 'Notificaciones de myRutine',
        playSound: true,
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`Channel created: ${created}`)
    );
  }

  scheduleNotification(title: string, message: string, date: Date, id?: string) {
    PushNotification.localNotificationSchedule({
      id: id || String(Date.now()),
      channelId: 'myrutine-default',
      title,
      message,
      date,
      allowWhileIdle: true,
    });
  }

  cancelNotification(id: string) {
    PushNotification.cancelLocalNotifications({ id });
  }

  cancelAllNotifications() {
    PushNotification.cancelAllLocalNotifications();
  }
}

export const notificationService = new NotificationService();
