import React, { useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/lib/useTheme';
import { spacing, radius, type } from '@/lib/theme';
import { useStore } from '@/lib/store';
import { Button } from '@/components/Button';
import { Segmented } from '@/components/Segmented';
import { SheetHeader } from '@/components/SheetHeader';
import { UserProfile } from '@/lib/types';
import { safeBack } from '@/lib/nav';

type Activity = UserProfile['activityLevel'];
type GoalType = UserProfile['goalType'];

const ACTIVITY_OPTIONS: { key: Activity; label: string; factor: number }[] = [
  { key: 'sedentary', label: 'Santai', factor: 1.2 },
  { key: 'light', label: 'Ringan', factor: 1.375 },
  { key: 'moderate', label: 'Sedang', factor: 1.55 },
  { key: 'active', label: 'Aktif', factor: 1.725 },
];

const GOAL_OPTIONS: { key: GoalType; label: string }[] = [
  { key: 'lose', label: 'Turun BB' },
  { key: 'maintain', label: 'Jaga BB' },
  { key: 'gain', label: 'Naik BB' },
];

export default function EditProfile() {
  const { colors } = useTheme();
  const { state, updateProfile } = useStore();
  const p = state.profile;
  const currentWeightKg = state.weights[0]?.kg ?? p.startWeightKg;

  const [name, setName] = useState(p.name);
  const [heightCm, setHeightCm] = useState(String(p.heightCm));
  const [goalWeightKg, setGoalWeightKg] = useState(String(p.goalWeightKg));
  const [activity, setActivity] = useState<Activity>(p.activityLevel);
  const [goalType, setGoalType] = useState<GoalType>(p.goalType);
  const [goalCalories, setGoalCalories] = useState(String(p.goalCalories));
  const [goalProteinG, setGoalProteinG] = useState(String(p.goalProteinG));
  const [goalCarbsG, setGoalCarbsG] = useState(String(p.goalCarbsG));
  const [goalFatG, setGoalFatG] = useState(String(p.goalFatG));
  const [goalWaterMl, setGoalWaterMl] = useState(String(p.goalWaterMl));

  const activityIndex = ACTIVITY_OPTIONS.findIndex((a) => a.key === activity);
  const goalTypeIndex = GOAL_OPTIONS.findIndex((g) => g.key === goalType);

  const recalculate = () => {
    Haptics.selectionAsync();
    const h = parseFloat(heightCm) || p.heightCm;
    const factor = ACTIVITY_OPTIONS.find((a) => a.key === activity)?.factor ?? 1.5;
    const bmr = 10 * currentWeightKg + 6.25 * h - 5 * 28;
    let tdee = bmr * factor;
    if (goalType === 'lose') tdee -= 400;
    if (goalType === 'gain') tdee += 350;
    const cal = Math.max(1200, Math.round(tdee / 10) * 10);
    const protein = Math.round((cal * 0.3) / 4);
    const fat = Math.round((cal * 0.25) / 9);
    const carbs = Math.round((cal - protein * 4 - fat * 9) / 4);
    setGoalCalories(String(cal));
    setGoalProteinG(String(protein));
    setGoalFatG(String(fat));
    setGoalCarbsG(String(carbs));
    setGoalWaterMl(String(Math.round((currentWeightKg * 35) / 50) * 50));
  };

  const save = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    updateProfile({
      name: name.trim() || p.name,
      heightCm: parseFloat(heightCm) || p.heightCm,
      goalWeightKg: parseFloat(goalWeightKg) || p.goalWeightKg,
      activityLevel: activity,
      goalType,
      goalCalories: parseInt(goalCalories, 10) || p.goalCalories,
      goalProteinG: parseInt(goalProteinG, 10) || p.goalProteinG,
      goalCarbsG: parseInt(goalCarbsG, 10) || p.goalCarbsG,
      goalFatG: parseInt(goalFatG, 10) || p.goalFatG,
      goalWaterMl: parseInt(goalWaterMl, 10) || p.goalWaterMl,
    });
    safeBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }} showsVerticalScrollIndicator={false}>
        <SheetHeader title="Ubah Profil & Target" />

        <Field label="Nama" value={name} onChangeText={setName} colors={colors} />
        <View style={{ height: spacing.md }} />
        <Field label="Tinggi badan (cm)" value={heightCm} onChangeText={setHeightCm} colors={colors} numeric />
        <View style={{ height: spacing.md }} />
        <Field label="Berat badan target (kg)" value={goalWeightKg} onChangeText={setGoalWeightKg} colors={colors} numeric />

        <View style={{ height: spacing.lg }} />
        <Text style={[type.footnote, { color: colors.labelSecondary, marginBottom: spacing.xs }]}>Level Aktivitas</Text>
        <Segmented options={ACTIVITY_OPTIONS.map((a) => a.label)} value={activityIndex} onChange={(i) => setActivity(ACTIVITY_OPTIONS[i].key)} />

        <View style={{ height: spacing.lg }} />
        <Text style={[type.footnote, { color: colors.labelSecondary, marginBottom: spacing.xs }]}>Tujuan</Text>
        <Segmented options={GOAL_OPTIONS.map((g) => g.label)} value={goalTypeIndex} onChange={(i) => setGoalType(GOAL_OPTIONS[i].key)} />

        <View style={{ height: spacing.xl }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
          <Text style={[type.headline, { color: colors.label }]}>Target Harian</Text>
          <Button title="Hitung Otomatis" variant="secondary" onPress={recalculate} style={{ paddingHorizontal: spacing.md, paddingVertical: spacing.sm }} />
        </View>

        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          <View style={{ flex: 1 }}>
            <Field label="Kalori" value={goalCalories} onChangeText={setGoalCalories} colors={colors} numeric />
          </View>
          <View style={{ flex: 1 }}>
            <Field label="Air (ml)" value={goalWaterMl} onChangeText={setGoalWaterMl} colors={colors} numeric />
          </View>
        </View>
        <View style={{ height: spacing.md }} />
        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          <View style={{ flex: 1 }}>
            <Field label="Protein (g)" value={goalProteinG} onChangeText={setGoalProteinG} colors={colors} numeric />
          </View>
          <View style={{ flex: 1 }}>
            <Field label="Karbo (g)" value={goalCarbsG} onChangeText={setGoalCarbsG} colors={colors} numeric />
          </View>
          <View style={{ flex: 1 }}>
            <Field label="Lemak (g)" value={goalFatG} onChangeText={setGoalFatG} colors={colors} numeric />
          </View>
        </View>

        <View style={{ height: spacing.xl }} />
        <Button title="Simpan" onPress={save} />
      </ScrollView>
    </View>
  );
}

function Field({
  label,
  value,
  onChangeText,
  colors,
  numeric,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  colors: any;
  numeric?: boolean;
}) {
  return (
    <View>
      <Text style={[type.footnote, { color: colors.labelSecondary, marginBottom: spacing.xs }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={(v) => onChangeText(numeric ? v.replace(/[^0-9.]/g, '') : v)}
        keyboardType={numeric ? 'decimal-pad' : 'default'}
        style={[
          type.bodyMedium,
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
