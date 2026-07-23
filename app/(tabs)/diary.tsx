import React, { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { useTheme } from '@/lib/useTheme';
import { spacing, radius, type } from '@/lib/theme';
import { useStore } from '@/lib/store';
import { MealCard } from '@/components/MealCard';
import { Card } from '@/components/Card';
import { PressableScale } from '@/components/PressableScale';
import { MealType } from '@/lib/types';

const MEAL_SECTIONS: { key: MealType; label: string; emoji: string }[] = [
  { key: 'breakfast', label: 'Sarapan', emoji: '🌅' },
  { key: 'lunch', label: 'Makan Siang', emoji: '☀️' },
  { key: 'dinner', label: 'Makan Malam', emoji: '🌙' },
  { key: 'snack', label: 'Camilan', emoji: '🍿' },
];

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function last14Days() {
  const days: Date[] = [];
  const today = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d);
  }
  return days;
}

export default function Diary() {
  const { colors } = useTheme();
  const { state, removeMeal } = useStore();
  const [selected, setSelected] = useState(new Date());
  const days = useMemo(() => last14Days(), []);

  const dayMeals = useMemo(() => state.meals.filter((m) => isSameDay(new Date(m.loggedAt), selected)), [state.meals, selected]);

  const totals = dayMeals.reduce(
    (acc, m) => ({ calories: acc.calories + m.calories, protein: acc.protein + m.protein, carbs: acc.carbs + m.carbs, fat: acc.fat + m.fat }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <Text style={[type.title1, { color: colors.label, paddingHorizontal: spacing.lg, marginBottom: spacing.md }]}>Jurnal</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.sm }}>
        {days.map((d) => {
          const active = isSameDay(d, selected);
          const hasEntries = state.meals.some((m) => isSameDay(new Date(m.loggedAt), d));
          return (
            <PressableScale
              key={d.toISOString()}
              onPress={() => setSelected(d)}
              style={{
                width: 52,
                paddingVertical: spacing.sm,
                borderRadius: radius.md,
                backgroundColor: active ? colors.blue : colors.card,
                alignItems: 'center',
              }}
            >
              <Text style={[type.caption1, { color: active ? 'rgba(255,255,255,0.8)' : colors.labelSecondary }]}>
                {d.toLocaleDateString('id-ID', { weekday: 'short' }).slice(0, 2)}
              </Text>
              <Text style={[type.headline, { color: active ? '#fff' : colors.label, marginVertical: 2 }]}>{d.getDate()}</Text>
              <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: hasEntries ? (active ? '#fff' : colors.orange) : 'transparent' }} />
            </PressableScale>
          );
        })}
      </ScrollView>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        <Card style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: spacing.lg }}>
          <TotalStat label="Kalori" value={totals.calories} color={colors.orange} />
          <TotalStat label="Protein" value={totals.protein} color={colors.pink} unit="g" />
          <TotalStat label="Karbo" value={totals.carbs} color={colors.indigo} unit="g" />
          <TotalStat label="Lemak" value={totals.fat} color={colors.teal} unit="g" />
        </Card>

        {MEAL_SECTIONS.map((section, idx) => {
          const meals = dayMeals.filter((m) => m.mealType === section.key);
          if (meals.length === 0) return null;
          return (
            <MotiView
              key={section.key}
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 350, delay: idx * 60 }}
              style={{ marginBottom: spacing.lg }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.sm }}>
                <Text>{section.emoji}</Text>
                <Text style={[type.headline, { color: colors.label }]}>{section.label}</Text>
                <Text style={[type.footnote, { color: colors.labelSecondary }]}>
                  · {meals.reduce((a, m) => a + m.calories, 0)} kal
                </Text>
              </View>
              <View style={{ gap: spacing.sm }}>
                {meals.map((m) => (
                  <MealCard key={m.id} meal={m} onDelete={() => removeMeal(m.id)} />
                ))}
              </View>
            </MotiView>
          );
        })}

        {dayMeals.length === 0 && (
          <Card style={{ alignItems: 'center', paddingVertical: spacing.xxl }}>
            <Text style={{ fontSize: 32, marginBottom: spacing.sm }}>📖</Text>
            <Text style={[type.subhead, { color: colors.labelSecondary }]}>Tidak ada catatan di hari ini</Text>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function TotalStat({ label, value, color, unit = '' }: { label: string; value: number; color: string; unit?: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={[type.headline, { color }]}>{Math.round(value)}{unit}</Text>
      <Text style={[type.caption1, { color: colors.labelSecondary }]}>{label}</Text>
    </View>
  );
}
