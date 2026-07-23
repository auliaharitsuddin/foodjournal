import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/lib/useTheme';
import { spacing, radius, type } from '@/lib/theme';
import { FOOD_DATABASE } from '@/lib/foodDatabase';
import { useStore } from '@/lib/store';
import { Button } from '@/components/Button';
import { PressableScale } from '@/components/PressableScale';
import { FoodItem, MealType } from '@/lib/types';

export default function FoodDetail() {
  const { colors } = useTheme();
  const { addMeal } = useStore();
  const params = useLocalSearchParams<{
    id: string;
    mealType?: string;
    name?: string;
    emoji?: string;
    cal?: string;
    protein?: string;
    carbs?: string;
    fat?: string;
    servingG?: string;
    servingLabel?: string;
  }>();

  const dbFood = FOOD_DATABASE.find((f) => f.id === params.id);
  const food: FoodItem = dbFood ?? {
    id: params.id,
    name: params.name ?? 'Makanan',
    emoji: params.emoji ?? '📦',
    caloriesPer100g: Number(params.cal ?? 0),
    proteinPer100g: Number(params.protein ?? 0),
    carbsPer100g: Number(params.carbs ?? 0),
    fatPer100g: Number(params.fat ?? 0),
    defaultServingG: Number(params.servingG ?? 100),
    servingLabel: params.servingLabel ?? '1 porsi',
  };

  const [grams, setGrams] = useState(food.defaultServingG);
  const mealType = (params.mealType as MealType) ?? 'snack';
  const factor = grams / 100;

  const adjust = (delta: number) => {
    Haptics.selectionAsync();
    setGrams((g) => Math.max(10, g + delta));
  };

  const confirm = () => {
    addMeal(food, grams, mealType);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.dismissAll();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: spacing.lg }}>
      <View style={{ alignItems: 'center', marginBottom: spacing.lg }}>
        <Text style={{ fontSize: 48 }}>{food.emoji}</Text>
        <Text style={[type.title2, { color: colors.label, marginTop: spacing.sm, textAlign: 'center' }]}>{food.name}</Text>
        {food.brand ? <Text style={[type.footnote, { color: colors.labelSecondary }]}>{food.brand}</Text> : null}
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing.lg,
          marginBottom: spacing.lg,
        }}
      >
        <PressableScale
          onPress={() => adjust(-10)}
          style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.fill, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={[type.title2, { color: colors.label }]}>−</Text>
        </PressableScale>
        <View style={{ alignItems: 'center', minWidth: 100 }}>
          <Text style={[type.largeTitle, { color: colors.label }]}>{grams}</Text>
          <Text style={[type.footnote, { color: colors.labelSecondary }]}>gram</Text>
        </View>
        <PressableScale
          onPress={() => adjust(10)}
          style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.fill, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={[type.title2, { color: colors.label }]}>+</Text>
        </PressableScale>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, marginBottom: spacing.xl }}>
        {[food.defaultServingG, 100, 200].filter((v, i, a) => a.indexOf(v) === i).map((v) => (
          <PressableScale
            key={v}
            onPress={() => {
              Haptics.selectionAsync();
              setGrams(v);
            }}
            style={{
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
              borderRadius: radius.pill,
              backgroundColor: grams === v ? colors.blue : colors.fill,
            }}
          >
            <Text style={[type.caption1, { color: grams === v ? '#fff' : colors.label }]}>{v}g</Text>
          </PressableScale>
        ))}
      </View>

      <View style={{ flexDirection: 'row', backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.xl }}>
        <Stat label="Kalori" value={Math.round(food.caloriesPer100g * factor)} unit="kal" color={colors.orange} />
        <Stat label="Protein" value={Math.round(food.proteinPer100g * factor * 10) / 10} unit="g" color={colors.pink} />
        <Stat label="Karbo" value={Math.round(food.carbsPer100g * factor * 10) / 10} unit="g" color={colors.indigo} />
        <Stat label="Lemak" value={Math.round(food.fatPer100g * factor * 10) / 10} unit="g" color={colors.teal} />
      </View>

      <Button title="Tambahkan ke Jurnal" onPress={confirm} />
    </View>
  );
}

function Stat({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Text style={[type.headline, { color }]}>{value}</Text>
      <Text style={[type.caption2, { color: colors.labelSecondary }]}>{unit}</Text>
      <Text style={[type.caption1, { color: colors.labelSecondary, marginTop: 2 }]}>{label}</Text>
    </View>
  );
}
