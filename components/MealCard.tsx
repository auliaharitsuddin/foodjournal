import React from 'react';
import { Text, View } from 'react-native';
import { MealEntry } from '@/lib/types';
import { useTheme } from '@/lib/useTheme';
import { radius, spacing, type } from '@/lib/theme';
import { SwipeToDelete } from './SwipeToDelete';

export function MealCard({ meal, onDelete }: { meal: MealEntry; onDelete: () => void }) {
  const { colors } = useTheme();
  const time = new Date(meal.loggedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  return (
    <SwipeToDelete onDelete={onDelete}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.card,
          borderRadius: radius.lg,
          padding: spacing.md,
          gap: spacing.md,
        }}
      >
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: radius.md,
            backgroundColor: colors.fill,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 22 }}>{meal.emoji}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[type.bodyMedium, { color: colors.label }]} numberOfLines={1}>
            {meal.name}
          </Text>
          <Text style={[type.footnote, { color: colors.labelSecondary }]}>
            {meal.grams}g · {time}
          </Text>
        </View>
        <Text style={[type.headline, { color: colors.label }]}>{meal.calories}</Text>
        <Text style={[type.caption1, { color: colors.labelSecondary }]}>kal</Text>
      </View>
    </SwipeToDelete>
  );
}
