import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/lib/useTheme';
import { spacing, radius, type } from '@/lib/theme';
import { useStore } from '@/lib/store';
import { Button } from '@/components/Button';

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
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: spacing.lg }}>
      <Text style={[type.title2, { color: colors.label, marginBottom: spacing.xl }]}>Catat Berat Badan</Text>

      <View style={{ alignItems: 'center', marginBottom: spacing.xl }}>
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
