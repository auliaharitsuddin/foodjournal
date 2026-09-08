import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/lib/useTheme';
import { spacing, radius, type } from '@/lib/theme';
import { useStore } from '@/lib/store';
import { Button } from '@/components/Button';
import { SheetHeader } from '@/components/SheetHeader';
import { safeBack } from '@/lib/nav';

export default function LogWeight() {
  const { colors } = useTheme();
  const { addWeight, state } = useStore();
  const lastWeight = state.weights[0]?.kg ?? state.profile.startWeightKg;
  const [kg, setKg] = useState(String(lastWeight));

  const save = () => {
    const val = parseFloat(kg);
    if (!val || val <= 0) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addWeight(val);
    safeBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: spacing.lg }}>
      <SheetHeader title="Catat Berat Badan" />

      <View style={{ alignItems: 'center', marginBottom: spacing.xl, marginTop: spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
          <TextInput
            value={kg}
            onChangeText={(v) => setKg(v.replace(/[^0-9.]/g, ''))}
            keyboardType="decimal-pad"
            style={[type.largeTitle, { color: colors.label, fontSize: 56, textAlign: 'center', minWidth: 140 }]}
            autoFocus
          />
          <Text style={[type.title2, { color: colors.labelSecondary }]}>kg</Text>
        </View>
        <Text style={[type.footnote, { color: colors.labelSecondary, marginTop: spacing.sm }]}>
          Target: {state.profile.goalWeightKg} kg
        </Text>
      </View>

      <Button title="Simpan" onPress={save} />
    </View>
  );
}
