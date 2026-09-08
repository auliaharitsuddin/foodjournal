import React, { useState } from 'react';
import { Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/lib/useTheme';
import { spacing, radius, type } from '@/lib/theme';
import { useStore } from '@/lib/store';
import { Button } from '@/components/Button';
import { PressableScale } from '@/components/PressableScale';
import { SheetHeader } from '@/components/SheetHeader';
import { safeBack } from '@/lib/nav';

const PRESETS = [
  { ml: 200, label: 'Gelas', emoji: '🥛' },
  { ml: 330, label: 'Botol Kecil', emoji: '🧴' },
  { ml: 600, label: 'Botol Besar', emoji: '🍶' },
  { ml: 1000, label: '1 Liter', emoji: '💧' },
];

export default function LogWater() {
  const { colors } = useTheme();
  const { addWater, todayWater, state } = useStore();
  const [custom, setCustom] = useState(250);
  const waterMl = todayWater.reduce((a, w) => a + w.ml, 0);

  const log = (ml: number) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addWater(ml);
    safeBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: spacing.lg }}>
      <SheetHeader title="Catat Air Minum" />
      <Text style={[type.footnote, { color: colors.labelSecondary, marginBottom: spacing.xl }]}>
        {waterMl} / {state.profile.goalWaterMl} ml hari ini
      </Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl }}>
        {PRESETS.map((p) => (
          <PressableScale
            key={p.ml}
            onPress={() => log(p.ml)}
            style={{
              flexBasis: '47%',
              flexGrow: 1,
              backgroundColor: colors.card,
              borderRadius: radius.lg,
              padding: spacing.lg,
              alignItems: 'center',
              gap: spacing.xs,
            }}
          >
            <Text style={{ fontSize: 28 }}>{p.emoji}</Text>
            <Text style={[type.bodyMedium, { color: colors.label }]}>{p.ml} ml</Text>
            <Text style={[type.caption1, { color: colors.labelSecondary }]}>{p.label}</Text>
          </PressableScale>
        ))}
      </View>

      <Text style={[type.footnote, { color: colors.labelSecondary, marginBottom: spacing.sm }]}>Jumlah kustom</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.lg, marginBottom: spacing.xl }}>
        <PressableScale
          onPress={() => setCustom((c) => Math.max(50, c - 50))}
          style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.fill, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={[type.title3, { color: colors.label }]}>−</Text>
        </PressableScale>
        <Text style={[type.title1, { color: colors.label, minWidth: 100, textAlign: 'center' }]}>{custom} ml</Text>
        <PressableScale
          onPress={() => setCustom((c) => c + 50)}
          style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.fill, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={[type.title3, { color: colors.label }]}>+</Text>
        </PressableScale>
      </View>

      <Button title={`Tambah ${custom} ml`} onPress={() => log(custom)} />
    </View>
  );
}
