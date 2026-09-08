import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/useTheme';
import { spacing, radius, type } from '@/lib/theme';
import { useStore } from '@/lib/store';
import { Card } from '@/components/Card';
import { ActivityRing } from '@/components/ActivityRing';
import { MacroBar } from '@/components/MacroBar';
import { MealCard } from '@/components/MealCard';
import { PressableScale } from '@/components/PressableScale';
import { MealType } from '@/lib/types';

const MEAL_TYPES: { key: MealType; label: string; emoji: string }[] = [
  { key: 'breakfast', label: 'Sarapan', emoji: '🌅' },
  { key: 'lunch', label: 'Makan Siang', emoji: '☀️' },
  { key: 'dinner', label: 'Makan Malam', emoji: '🌙' },
  { key: 'snack', label: 'Camilan', emoji: '🍿' },
];

function greeting() {
  const h = new Date().getHours();
  if (h < 11) return 'Selamat Pagi';
  if (h < 15) return 'Selamat Siang';
  if (h < 18) return 'Selamat Sore';
  return 'Selamat Malam';
}

export default function Home() {
  const { colors } = useTheme();
  const { state, todayMeals, todayWater, todayTotals, streakDays, removeMeal, addWater } = useStore();
  const goal = state.profile;

  const remaining = Math.max(goal.goalCalories - todayTotals.calories, 0);
  const waterMl = todayWater.reduce((a, w) => a + w.ml, 0);
  const dateStr = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        <MotiView from={{ opacity: 0, translateY: 12 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 400 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
            <View>
              <Text style={[type.footnote, { color: colors.labelSecondary }]}>{dateStr}</Text>
              <Text style={[type.title1, { color: colors.label }]}>
                {greeting()}, {goal.name || 'kamu'} 👋
              </Text>
            </View>
            {streakDays > 0 && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                  backgroundColor: colors.orange,
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.sm,
                  borderRadius: radius.pill,
                }}
              >
                <Ionicons name="flame" size={16} color="#fff" />
                <Text style={[type.caption1, { color: '#fff' }]}>{streakDays}</Text>
              </View>
            )}
          </View>
        </MotiView>

        <MotiView from={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'timing', duration: 450, delay: 80 }}>
          <Card style={{ alignItems: 'center', marginBottom: spacing.lg }}>
            <View style={{ width: 200, height: 200, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg }}>
              <ActivityRing size={200} strokeWidth={16} progress={todayTotals.calories / goal.goalCalories} color={colors.orange} trackColor={colors.fill} />
              <View style={{ position: 'absolute', alignItems: 'center' }}>
                <Text style={[type.largeTitle, { color: colors.label }]}>{remaining}</Text>
                <Text style={[type.footnote, { color: colors.labelSecondary }]}>kalori tersisa</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', width: '100%', gap: spacing.lg }}>
              <MacroBar label="Protein" value={todayTotals.protein} goal={goal.goalProteinG} unit="g" color={colors.pink} />
              <MacroBar label="Karbo" value={todayTotals.carbs} goal={goal.goalCarbsG} unit="g" color={colors.indigo} />
              <MacroBar label="Lemak" value={todayTotals.fat} goal={goal.goalFatG} unit="g" color={colors.teal} />
            </View>
          </Card>
        </MotiView>

        <MotiView from={{ opacity: 0, translateY: 12 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 400, delay: 140 }}>
          <PressableScale onPress={() => router.push('/log-water')}>
            <Card style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg, gap: spacing.md }}>
              <View style={{ width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.teal + '22', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="water" size={22} color={colors.teal} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[type.bodyMedium, { color: colors.label }]}>Air Minum</Text>
                <Text style={[type.footnote, { color: colors.labelSecondary }]}>
                  {waterMl} / {goal.goalWaterMl} ml
                </Text>
              </View>
              <View style={{ height: 6, width: 80, backgroundColor: colors.fill, borderRadius: radius.pill, overflow: 'hidden' }}>
                <View
                  style={{
                    height: '100%',
                    width: `${Math.min((waterMl / goal.goalWaterMl) * 100, 100)}%`,
                    backgroundColor: colors.teal,
                  }}
                />
              </View>
              <Ionicons name="add-circle" size={26} color={colors.teal} />
            </Card>
          </PressableScale>
        </MotiView>

        <Text style={[type.title3, { color: colors.label, marginBottom: spacing.md }]}>Tambah Makan</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl }}>
          {MEAL_TYPES.map((m) => (
            <PressableScale
              key={m.key}
              onPress={() => router.push({ pathname: '/add-meal', params: { mealType: m.key } })}
              style={{
                flexBasis: '47%',
                flexGrow: 1,
                backgroundColor: colors.card,
                borderRadius: radius.lg,
                padding: spacing.lg,
                alignItems: 'flex-start',
                gap: spacing.xs,
              }}
            >
              <Text style={{ fontSize: 24 }}>{m.emoji}</Text>
              <Text style={[type.subhead, { color: colors.label }]}>{m.label}</Text>
            </PressableScale>
          ))}
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
          <Text style={[type.title3, { color: colors.label }]}>Makan Hari Ini</Text>
          <Text style={[type.footnote, { color: colors.labelSecondary }]}>{todayMeals.length} item</Text>
        </View>

        {todayMeals.length === 0 ? (
          <Card style={{ alignItems: 'center', paddingVertical: spacing.xxl }}>
            <Text style={{ fontSize: 32, marginBottom: spacing.sm }}>🍽️</Text>
            <Text style={[type.subhead, { color: colors.labelSecondary }]}>Belum ada makanan dicatat</Text>
          </Card>
        ) : (
          <View style={{ gap: spacing.sm }}>
            {todayMeals.map((m) => (
              <MealCard key={m.id} meal={m} onDelete={() => removeMeal(m.id)} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
