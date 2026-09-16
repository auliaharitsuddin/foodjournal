import React, { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/lib/useTheme';
import { spacing, radius, type } from '@/lib/theme';
import { useStore } from '@/lib/store';
import { Card } from '@/components/Card';
import { PressableScale } from '@/components/PressableScale';
import { enableDailyReminder, disableDailyReminder, isReminderScheduled } from '@/lib/notifications';
import { useLanguage } from '@/lib/i18n';

export default function Profile() {
  const { colors } = useTheme();
  const { t, lang, setLang } = useLanguage();
  const { state, streakDays, resetAll } = useStore();
  const [reminderOn, setReminderOn] = useState(false);
  const profile = state.profile;

  useEffect(() => {
    isReminderScheduled().then(setReminderOn);
  }, []);

  const bmi = profile.heightCm > 0 ? (state.weights[0]?.kg ?? profile.startWeightKg) / Math.pow(profile.heightCm / 100, 2) : 0;

  const toggleReminder = async (value: boolean) => {
    Haptics.selectionAsync();
    if (value) {
      const ok = await enableDailyReminder(19, 0);
      setReminderOn(ok);
      if (!ok) {
        Alert.alert(
          Platform.OS === 'web' ? t.reminderNotSupportedWeb : t.reminderDeniedTitle,
          Platform.OS === 'web' ? t.reminderWebOnlyMobile : t.reminderEnableInSettings
        );
      }
    } else {
      await disableDailyReminder();
      setReminderOn(false);
    }
  };

  const resetData = () => {
    Alert.alert(t.resetConfirmTitle, t.resetConfirmMsg, [
      { text: t.cancel, style: 'cancel' },
      {
        text: t.confirm,
        style: 'destructive',
        onPress: () => resetAll(),
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        <Text style={[type.title1, { color: colors.label, marginBottom: spacing.lg }]}>{t.profileTitle}</Text>

        <Card style={{ alignItems: 'center', marginBottom: spacing.lg }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: colors.blue,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: spacing.sm,
            }}
          >
            <Text style={{ fontSize: 30, color: '#fff' }}>{(profile.name || 'K')[0].toUpperCase()}</Text>
          </View>
          <Text style={[type.title2, { color: colors.label }]}>{profile.name || 'Kamu'}</Text>
          <View style={{ flexDirection: 'row', gap: spacing.lg, marginTop: spacing.md }}>
            <MiniStat label="Streak" value={`${streakDays}🔥`} colors={colors} />
            <MiniStat label="BMI" value={bmi ? bmi.toFixed(1) : '-'} colors={colors} />
            <MiniStat label="Target" value={`${profile.goalWeightKg}kg`} colors={colors} />
          </View>
        </Card>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm, marginLeft: spacing.xs }}>
          <SectionLabel colors={colors} noMargin>{t.dailyGoals}</SectionLabel>
          <PressableScale onPress={() => router.push('/edit-profile')}>
            <Text style={[type.footnote, { color: colors.blue }]}>{t.editProfile}</Text>
          </PressableScale>
        </View>
        <Card style={{ marginBottom: spacing.lg, gap: spacing.md }}>
          <GoalRow label="Kalori" value={`${profile.goalCalories} kal`} icon="flame" color={colors.orange} colors={colors} />
          <GoalRow label={t.protein} value={`${profile.goalProteinG} g`} icon="barbell" color={colors.pink} colors={colors} />
          <GoalRow label={t.carbs} value={`${profile.goalCarbsG} g`} icon="leaf" color={colors.indigo} colors={colors} />
          <GoalRow label={t.fat} value={`${profile.goalFatG} g`} icon="water" color={colors.teal} colors={colors} />
          <GoalRow label={t.waterIntake} value={`${profile.goalWaterMl} ml`} icon="water-outline" color={colors.blue} colors={colors} />
        </Card>

        <SectionLabel colors={colors}>{t.language}</SectionLabel>
        <Card style={{ marginBottom: spacing.lg, flexDirection: 'row', gap: spacing.sm }}>
          {(['id', 'en'] as const).map((l) => (
            <PressableScale
              key={l}
              onPress={() => setLang(l)}
              style={{
                flex: 1,
                alignItems: 'center',
                paddingVertical: spacing.sm,
                borderRadius: radius.md,
                backgroundColor: lang === l ? colors.blue : colors.fill,
              }}
            >
              <Text style={[type.bodyMedium, { color: lang === l ? '#fff' : colors.label }]}>
                {l === 'id' ? 'Indonesia' : 'English'}
              </Text>
            </PressableScale>
          ))}
        </Card>

        <SectionLabel colors={colors}>{t.settingsSection}</SectionLabel>
        <Card style={{ marginBottom: spacing.lg }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
              <Ionicons name="notifications" size={20} color={colors.orange} />
              <View>
                <Text style={[type.bodyMedium, { color: colors.label }]}>{t.dailyReminder}</Text>
                <Text style={[type.footnote, { color: colors.labelSecondary }]}>
                  {Platform.OS === 'web' ? t.reminderWebHint : t.reminderTimeHint}
                </Text>
              </View>
            </View>
            <Switch
              value={reminderOn}
              onValueChange={toggleReminder}
              trackColor={{ true: colors.green }}
              disabled={Platform.OS === 'web'}
            />
          </View>
        </Card>

        <PressableScale onPress={resetData} style={{ alignItems: 'center', padding: spacing.md }}>
          <Text style={[type.subhead, { color: colors.red }]}>{t.resetData}</Text>
        </PressableScale>

        <Text style={[type.caption1, { color: colors.labelTertiary, textAlign: 'center', marginTop: spacing.xl }]}>
          {t.madeWith}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function MiniStat({ label, value, colors }: { label: string; value: string; colors: any }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={[type.headline, { color: colors.label }]}>{value}</Text>
      <Text style={[type.caption1, { color: colors.labelSecondary }]}>{label}</Text>
    </View>
  );
}

function SectionLabel({ children, colors, noMargin }: { children: React.ReactNode; colors: any; noMargin?: boolean }) {
  return (
    <Text style={[type.caption1, { color: colors.labelSecondary, textTransform: 'uppercase' }, !noMargin && { marginBottom: spacing.sm, marginLeft: spacing.xs }]}>
      {children}
    </Text>
  );
}

function GoalRow({ label, value, icon, color, colors }: { label: string; value: string; icon: any; color: string; colors: any }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        <View style={{ width: 32, height: 32, borderRadius: radius.sm, backgroundColor: color + '22', alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name={icon} size={16} color={color} />
        </View>
        <Text style={[type.body, { color: colors.label }]}>{label}</Text>
      </View>
      <Text style={[type.bodyMedium, { color: colors.labelSecondary }]}>{value}</Text>
    </View>
  );
}
