import React, { useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/lib/useTheme';
import { spacing, radius, type } from '@/lib/theme';
import { Button } from '@/components/Button';
import { SheetHeader } from '@/components/SheetHeader';

export default function ManualEntry() {
  const { colors } = useTheme();
  const params = useLocalSearchParams<{ mealType?: string }>();
  const [name, setName] = useState('');
  const [cal, setCal] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [servingG, setServingG] = useState('100');

  const canSave = name.trim().length > 0 && Number(cal) > 0;

  const save = () => {
    // food/[id] expects values per 100g (it scales by grams/100), but this form
    // collects values for the whole serving — convert before handing off.
    const grams = Number(servingG) || 100;
    const factor = grams / 100;
    router.replace({
      pathname: '/food/[id]',
      params: {
        id: `manual-${Date.now()}`,
        mealType: params.mealType ?? 'snack',
        name: name.trim(),
        emoji: '🍽️',
        cal: String((Number(cal) || 0) / factor),
        protein: String((Number(protein) || 0) / factor),
        carbs: String((Number(carbs) || 0) / factor),
        fat: String((Number(fat) || 0) / factor),
        servingG: String(grams),
        servingLabel: '1 porsi',
      },
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg }} showsVerticalScrollIndicator={false}>
        <SheetHeader title="Tambah Manual" />
        <Text style={[type.footnote, { color: colors.labelSecondary, marginBottom: spacing.lg, marginTop: -spacing.sm }]}>
          Masukkan nilai gizi per porsi yang kamu makan.
        </Text>

        <Field label="Nama makanan" value={name} onChangeText={setName} colors={colors} autoFocus />
        <View style={{ height: spacing.md }} />
        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          <View style={{ flex: 1 }}>
            <Field label="Kalori" value={cal} onChangeText={setCal} colors={colors} numeric />
          </View>
          <View style={{ flex: 1 }}>
            <Field label="Porsi (gram)" value={servingG} onChangeText={setServingG} colors={colors} numeric />
          </View>
        </View>
        <View style={{ height: spacing.md }} />
        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          <View style={{ flex: 1 }}>
            <Field label="Protein (g)" value={protein} onChangeText={setProtein} colors={colors} numeric />
          </View>
          <View style={{ flex: 1 }}>
            <Field label="Karbo (g)" value={carbs} onChangeText={setCarbs} colors={colors} numeric />
          </View>
          <View style={{ flex: 1 }}>
            <Field label="Lemak (g)" value={fat} onChangeText={setFat} colors={colors} numeric />
          </View>
        </View>

        <View style={{ height: spacing.xl }} />
        <Button title="Lanjut" onPress={save} disabled={!canSave} />
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
  autoFocus,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  colors: any;
  numeric?: boolean;
  autoFocus?: boolean;
}) {
  return (
    <View>
      <Text style={[type.footnote, { color: colors.labelSecondary, marginBottom: spacing.xs }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={(v) => onChangeText(numeric ? v.replace(/[^0-9.]/g, '') : v)}
        keyboardType={numeric ? 'decimal-pad' : 'default'}
        autoFocus={autoFocus}
        placeholder={numeric ? '0' : ''}
        placeholderTextColor={colors.labelTertiary}
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
