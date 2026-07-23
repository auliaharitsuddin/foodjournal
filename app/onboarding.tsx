import React, { useState } from 'react';
import { Dimensions, KeyboardAvoidingView, Platform, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MotiView, AnimatePresence } from 'moti';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/lib/useTheme';
import { spacing, radius, type } from '@/lib/theme';
import { Button } from '@/components/Button';
import { PressableScale } from '@/components/PressableScale';
import { useStore } from '@/lib/store';
import { UserProfile } from '@/lib/types';

const { width } = Dimensions.get('window');

type GoalType = UserProfile['goalType'];
type Activity = UserProfile['activityLevel'];

const ACTIVITY_OPTIONS: { key: Activity; label: string; desc: string; factor: number }[] = [
  { key: 'sedentary', label: 'Santai', desc: 'Jarang olahraga', factor: 1.2 },
  { key: 'light', label: 'Ringan', desc: 'Olahraga 1-3x/minggu', factor: 1.375 },
  { key: 'moderate', label: 'Sedang', desc: 'Olahraga 3-5x/minggu', factor: 1.55 },
  { key: 'active', label: 'Aktif', desc: 'Olahraga tiap hari', factor: 1.725 },
];

const GOAL_OPTIONS: { key: GoalType; label: string; emoji: string }[] = [
  { key: 'lose', label: 'Turun Berat Badan', emoji: '📉' },
  { key: 'maintain', label: 'Jaga Berat Badan', emoji: '⚖️' },
  { key: 'gain', label: 'Naik Berat Badan', emoji: '📈' },
];

export default function Onboarding() {
  const { colors } = useTheme();
  const { completeOnboarding } = useStore();
  const [step, setStep] = useState(0);

  const [name, setName] = useState('');
  const [goalType, setGoalType] = useState<GoalType>('maintain');
  const [activity, setActivity] = useState<Activity>('moderate');
  const [heightCm, setHeightCm] = useState('165');
  const [weightKg, setWeightKg] = useState('65');
  const [goalWeightKg, setGoalWeightKg] = useState('60');

  const totalSteps = 5;

  const next = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      finish();
    }
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  const finish = () => {
    const w = parseFloat(weightKg) || 65;
    const h = parseFloat(heightCm) || 165;
    const gw = parseFloat(goalWeightKg) || w;
    const activityFactor = ACTIVITY_OPTIONS.find((a) => a.key === activity)?.factor ?? 1.5;

    // Mifflin-St Jeor (assume age 28, mixed constant) simplified
    const bmr = 10 * w + 6.25 * h - 5 * 28;
    let tdee = bmr * activityFactor;
    if (goalType === 'lose') tdee -= 400;
    if (goalType === 'gain') tdee += 350;
    const goalCalories = Math.max(1200, Math.round(tdee / 10) * 10);

    const goalProteinG = Math.round((goalCalories * 0.3) / 4);
    const goalFatG = Math.round((goalCalories * 0.25) / 9);
    const goalCarbsG = Math.round((goalCalories - goalProteinG * 4 - goalFatG * 9) / 4);

    completeOnboarding({
      name: name.trim() || 'Kamu',
      heightCm: h,
      startWeightKg: w,
      goalWeightKg: gw,
      activityLevel: activity,
      goalType,
      goalCalories,
      goalProteinG,
      goalCarbsG,
      goalFatG,
      goalWaterMl: Math.round((w * 35) / 50) * 50,
    });

    router.replace('/(tabs)');
  };

  const canProceed = () => {
    if (step === 0) return name.trim().length > 0;
    if (step === 2) return !!heightCm && !!weightKg;
    return true;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        {/* progress dots */}
        <View style={{ flexDirection: 'row', gap: 6, justifyContent: 'center', marginTop: spacing.lg }}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <View
              key={i}
              style={{
                width: i === step ? 20 : 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: i <= step ? colors.blue : colors.fill,
              }}
            />
          ))}
        </View>

        <View style={{ flex: 1, paddingHorizontal: spacing.xl, justifyContent: 'center' }}>
          <AnimatePresence exitBeforeEnter>
            <MotiView
              key={step}
              from={{ opacity: 0, translateX: 24 }}
              animate={{ opacity: 1, translateX: 0 }}
              exit={{ opacity: 0, translateX: -24 }}
              transition={{ type: 'timing', duration: 280 }}
            >
              {step === 0 && (
                <View>
                  <Text style={{ fontSize: 44, marginBottom: spacing.md }}>🍎</Text>
                  <Text style={[type.largeTitle, { color: colors.label, marginBottom: spacing.sm }]}>
                    Selamat Datang
                  </Text>
                  <Text style={[type.body, { color: colors.labelSecondary, marginBottom: spacing.xxl }]}>
                    Yuk mulai catat perjalanan makan sehatmu. Siapa nama kamu?
                  </Text>
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Nama kamu"
                    placeholderTextColor={colors.labelTertiary}
                    style={[
                      type.title3,
                      {
                        color: colors.label,
                        backgroundColor: colors.card,
                        borderRadius: radius.md,
                        paddingHorizontal: spacing.lg,
                        paddingVertical: spacing.md,
                      },
                    ]}
                    autoFocus
                  />
                </View>
              )}

              {step === 1 && (
                <View>
                  <Text style={[type.largeTitle, { color: colors.label, marginBottom: spacing.sm }]}>
                    Apa tujuanmu?
                  </Text>
                  <Text style={[type.body, { color: colors.labelSecondary, marginBottom: spacing.xxl }]}>
                    Kami akan sesuaikan target kalori harianmu.
                  </Text>
                  {GOAL_OPTIONS.map((g) => (
                    <PressableScale
                      key={g.key}
                      onPress={() => setGoalType(g.key)}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: spacing.md,
                        padding: spacing.lg,
                        borderRadius: radius.md,
                        marginBottom: spacing.sm,
                        backgroundColor: goalType === g.key ? colors.blue : colors.card,
                      }}
                    >
                      <Text style={{ fontSize: 24 }}>{g.emoji}</Text>
                      <Text style={[type.bodyMedium, { color: goalType === g.key ? '#fff' : colors.label }]}>
                        {g.label}
                      </Text>
                    </PressableScale>
                  ))}
                </View>
              )}

              {step === 2 && (
                <View>
                  <Text style={[type.largeTitle, { color: colors.label, marginBottom: spacing.sm }]}>
                    Tinggi & Berat
                  </Text>
                  <Text style={[type.body, { color: colors.labelSecondary, marginBottom: spacing.xxl }]}>
                    Dipakai untuk menghitung kebutuhan kalori harianmu.
                  </Text>
                  <Field label="Tinggi badan (cm)" value={heightCm} onChangeText={setHeightCm} colors={colors} />
                  <View style={{ height: spacing.md }} />
                  <Field label="Berat badan saat ini (kg)" value={weightKg} onChangeText={setWeightKg} colors={colors} />
                  {goalType !== 'maintain' && (
                    <>
                      <View style={{ height: spacing.md }} />
                      <Field label="Berat badan target (kg)" value={goalWeightKg} onChangeText={setGoalWeightKg} colors={colors} />
                    </>
                  )}
                </View>
              )}

              {step === 3 && (
                <View>
                  <Text style={[type.largeTitle, { color: colors.label, marginBottom: spacing.sm }]}>
                    Seberapa aktif kamu?
                  </Text>
                  <Text style={[type.body, { color: colors.labelSecondary, marginBottom: spacing.xxl }]}>
                    Semakin aktif, semakin besar kebutuhan kalorimu.
                  </Text>
                  {ACTIVITY_OPTIONS.map((a) => (
                    <PressableScale
                      key={a.key}
                      onPress={() => setActivity(a.key)}
                      style={{
                        padding: spacing.lg,
                        borderRadius: radius.md,
                        marginBottom: spacing.sm,
                        backgroundColor: activity === a.key ? colors.blue : colors.card,
                      }}
                    >
                      <Text style={[type.bodyMedium, { color: activity === a.key ? '#fff' : colors.label }]}>
                        {a.label}
                      </Text>
                      <Text style={[type.footnote, { color: activity === a.key ? 'rgba(255,255,255,0.8)' : colors.labelSecondary }]}>
                        {a.desc}
                      </Text>
                    </PressableScale>
                  ))}
                </View>
              )}

              {step === 4 && (
                <View>
                  <Text style={{ fontSize: 44, marginBottom: spacing.md }}>🎉</Text>
                  <Text style={[type.largeTitle, { color: colors.label, marginBottom: spacing.sm }]}>
                    Semua siap, {name || 'kamu'}!
                  </Text>
                  <Text style={[type.body, { color: colors.labelSecondary }]}>
                    Kami sudah menyiapkan target kalori & nutrisi harian yang disesuaikan untukmu. Kamu bisa
                    mengubahnya kapan saja di halaman Profil.
                  </Text>
                </View>
              )}
            </MotiView>
          </AnimatePresence>
        </View>

        <View style={{ flexDirection: 'row', gap: spacing.md, padding: spacing.xl }}>
          {step > 0 && (
            <Button title="Kembali" variant="secondary" onPress={back} style={{ flex: 1 }} />
          )}
          <Button
            title={step === totalSteps - 1 ? 'Mulai Catat' : 'Lanjut'}
            onPress={next}
            disabled={!canProceed()}
            style={{ flex: 2 }}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  colors,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  colors: any;
}) {
  return (
    <View>
      <Text style={[type.footnote, { color: colors.labelSecondary, marginBottom: spacing.xs }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={(v) => onChangeText(v.replace(/[^0-9.]/g, ''))}
        keyboardType="decimal-pad"
        style={[
          type.title3,
          {
            color: colors.label,
            backgroundColor: colors.card,
            borderRadius: radius.md,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
          },
        ]}
      />
    </View>
  );
}
