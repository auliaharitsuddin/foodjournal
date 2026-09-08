import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

// Scheduled local notifications (daily trigger, getAllScheduledNotificationsAsync) aren't
// implemented in expo-notifications' web runtime and throw instead of rejecting gracefully,
// so every entry point here short-circuits on web before touching the native module.
const SUPPORTED = Platform.OS !== 'web';

if (SUPPORTED) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

const REMINDER_ID_KEY = 'foodjournal-daily-reminder';

export async function enableDailyReminder(hour: number, minute: number) {
  if (!SUPPORTED) return false;
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
  if (!SUPPORTED) return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function isReminderScheduled() {
  if (!SUPPORTED) return false;
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  return scheduled.some((n) => n.identifier === REMINDER_ID_KEY);
}
