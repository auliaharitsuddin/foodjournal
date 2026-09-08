import React, { useMemo, useState } from 'react';
import { LayoutChangeEvent, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/useTheme';
import { spacing, radius, type } from '@/lib/theme';
import { useStore } from '@/lib/store';
import { Card } from '@/components/Card';
import { LineChart } from '@/components/LineChart';
import { BarChart } from '@/components/BarChart';
import { PressableScale } from '@/components/PressableScale';

function last7Days() {
  const days: Date[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d);
  }
  return days;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function Trends() {
  const { colors } = useTheme();
  const { state } = useStore();
  const days = useMemo(() => last7Days(), []);
  const [chartWidth, setChartWidth] = useState(0);
  const onChartCardLayout = (e: LayoutChangeEvent) => setChartWidth(e.nativeEvent.layout.width - spacing.lg * 2);

  const calorieData = days.map((d) => ({
    label: d.toLocaleDateString('id-ID', { weekday: 'short' }).slice(0, 2),
    value: state.meals.filter((m) => isSameDay(new Date(m.loggedAt), d)).reduce((a, m) => a + m.calories, 0),
  }));

  const weightSeries = useMemo(() => {
    const sorted = [...state.weights].sort((a, b) => new Date(a.loggedAt).getTime() - new Date(b.loggedAt).getTime());
    return sorted.slice(-14);
  }, [state.weights]);

  const currentWeight = weightSeries[weightSeries.length - 1]?.kg ?? state.profile.startWeightKg;
  const weightDelta = currentWeight - state.profile.startWeightKg;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        <Text style={[type.title1, { color: colors.label, marginBottom: spacing.lg }]}>Progres</Text>

        <PressableScale onPress={() => router.push('/insights')} style={{ marginBottom: spacing.lg }}>
          <Card style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
            <View style={{ width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.indigo + '22', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="sparkles" size={22} color={colors.indigo} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[type.bodyMedium, { color: colors.label }]}>Insight & Rekomendasi AI</Text>
              <Text style={[type.footnote, { color: colors.labelSecondary }]}>Pola makan & saran kesehatan dari datamu</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.labelTertiary} />
          </Card>
        </PressableScale>

        <Card style={{ marginBottom: spacing.lg }} onLayout={onChartCardLayout}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
            <View>
              <Text style={[type.footnote, { color: colors.labelSecondary }]}>Berat Badan</Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
                <Text style={[type.title1, { color: colors.label }]}>{currentWeight}</Text>
                <Text style={[type.subhead, { color: colors.labelSecondary }]}>kg</Text>
                {weightDelta !== 0 && (
                  <Text style={[type.caption1, { color: weightDelta < 0 ? colors.green : colors.orange }]}>
                    {weightDelta > 0 ? '+' : ''}
                    {weightDelta.toFixed(1)} kg
                  </Text>
                )}
              </View>
            </View>
            <PressableScale
              onPress={() => router.push('/log-weight')}
              style={{ backgroundColor: colors.blue, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, flexDirection: 'row', alignItems: 'center', gap: 4 }}
            >
              <Ionicons name="add" size={16} color="#fff" />
              <Text style={[type.caption1, { color: '#fff' }]}>Catat</Text>
            </PressableScale>
          </View>
          {weightSeries.length > 1 && chartWidth > 0 ? (
            <LineChart
              data={weightSeries.map((w) => w.kg)}
              width={chartWidth}
              height={120}
              color={colors.blue}
              fillColor={colors.blue + '18'}
            />
          ) : (
            <View style={{ height: 120, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={[type.footnote, { color: colors.labelTertiary }]}>Catat berat badan minimal 2x untuk melihat grafik</Text>
            </View>
          )}
        </Card>

        <Card style={{ marginBottom: spacing.lg }}>
          <Text style={[type.footnote, { color: colors.labelSecondary, marginBottom: spacing.md }]}>Kalori 7 Hari Terakhir</Text>
          <BarChart
            data={calorieData}
            goal={state.profile.goalCalories}
            color={colors.orange}
            colors={colors}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.md }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.orange }} />
            <Text style={[type.caption1, { color: colors.labelSecondary }]}>Target: {state.profile.goalCalories} kal/hari</Text>
          </View>
        </Card>

        <Card>
          <Text style={[type.footnote, { color: colors.labelSecondary, marginBottom: spacing.md }]}>Rata-rata 7 Hari</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <AvgStat
              label="Kalori"
              value={Math.round(calorieData.reduce((a, d) => a + d.value, 0) / 7)}
              color={colors.orange}
            />
            <AvgStat
              label="Hari Tercapai"
              value={calorieData.filter((d) => d.value > 0 && d.value <= state.profile.goalCalories).length}
              color={colors.green}
              suffix="/7"
            />
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function AvgStat({ label, value, color, suffix = '' }: { label: string; value: number; color: string; suffix?: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={[type.title2, { color }]}>
        {value}
        {suffix}
      </Text>
      <Text style={[type.caption1, { color: colors.labelSecondary }]}>{label}</Text>
    </View>
  );
}
