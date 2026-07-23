import React, { useMemo, useState } from 'react';
import { FlatList, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/useTheme';
import { spacing, radius, type } from '@/lib/theme';
import { searchFoodDatabase } from '@/lib/foodDatabase';
import { PressableScale } from '@/components/PressableScale';
import { Segmented } from '@/components/Segmented';
import { MealType } from '@/lib/types';

const MEAL_LABELS: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];
const MEAL_LABEL_TEXT = ['Sarapan', 'Siang', 'Malam', 'Camilan'];

export default function AddMeal() {
  const { colors } = useTheme();
  const params = useLocalSearchParams<{ mealType?: string }>();
  const [query, setQuery] = useState('');
  const initialIndex = Math.max(0, MEAL_LABELS.indexOf((params.mealType as MealType) ?? 'snack'));
  const [mealIndex, setMealIndex] = useState(initialIndex === -1 ? 3 : initialIndex);

  const results = useMemo(() => searchFoodDatabase(query), [query]);
  const mealType = MEAL_LABELS[mealIndex];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: spacing.lg }}>
      <Text style={[type.title2, { color: colors.label, marginBottom: spacing.md }]}>Tambah Makanan</Text>

      <Segmented options={MEAL_LABEL_TEXT} value={mealIndex} onChange={setMealIndex} />

      <View style={{ height: spacing.md }} />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.fill,
          borderRadius: radius.md,
          paddingHorizontal: spacing.md,
          marginBottom: spacing.sm,
        }}
      >
        <Ionicons name="search" size={18} color={colors.labelSecondary} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Cari makanan..."
          placeholderTextColor={colors.labelTertiary}
          style={[type.body, { color: colors.label, flex: 1, paddingVertical: spacing.md, paddingHorizontal: spacing.sm }]}
        />
      </View>

      <PressableScale
        onPress={() => router.push({ pathname: '/add-meal/scan', params: { mealType } })}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
          backgroundColor: colors.blue,
          borderRadius: radius.md,
          padding: spacing.md,
          marginBottom: spacing.md,
          justifyContent: 'center',
        }}
      >
        <Ionicons name="barcode-outline" size={20} color="#fff" />
        <Text style={[type.headline, { color: '#fff' }]}>Scan Barcode</Text>
      </PressableScale>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <PressableScale
            onPress={() => router.push({ pathname: '/food/[id]', params: { id: item.id, mealType } })}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing.md,
              paddingVertical: spacing.sm + 2,
              borderBottomWidth: 1,
              borderBottomColor: colors.separator,
            }}
          >
            <Text style={{ fontSize: 24 }}>{item.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[type.bodyMedium, { color: colors.label }]}>{item.name}</Text>
              <Text style={[type.footnote, { color: colors.labelSecondary }]}>
                {item.caloriesPer100g} kal / 100g · {item.servingLabel}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.labelTertiary} />
          </PressableScale>
        )}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingTop: spacing.xxl }}>
            <Text style={{ fontSize: 32, marginBottom: spacing.sm }}>🔍</Text>
            <Text style={[type.subhead, { color: colors.labelSecondary }]}>Makanan tidak ditemukan</Text>
            <Text style={[type.footnote, { color: colors.labelTertiary, textAlign: 'center', marginTop: spacing.xs }]}>
              Coba kata kunci lain atau scan barcode kemasan
            </Text>
          </View>
        }
      />
    </View>
  );
}
