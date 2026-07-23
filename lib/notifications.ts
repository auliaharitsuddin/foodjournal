import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const REMINDER_ID_KEY = 'foodjournal-daily-reminder';

export async function enableDailyReminder(hour: number, minute: number) {
  const perm = await Notifications.requestPermissionsAsync();
  if (!perm.granted) return false;
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    identifier: REMINDER_ID_KEY,
    content: {
      title: '🍽️ Waktunya catat makan!',
      body: 'Jangan lupa catat apa yang sudah kamu makan hari ini.',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
  return true;
}

export async function disableDailyReminder() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
