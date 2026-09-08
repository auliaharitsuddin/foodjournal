import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/useTheme';
import { spacing, type } from '@/lib/theme';
import { PressableScale } from './PressableScale';
import { safeBack } from '@/lib/nav';

export function SheetHeader({ title }: { title: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md }}>
      <Text style={[type.title2, { color: colors.label }]}>{title}</Text>
      <PressableScale
        onPress={safeBack}
        haptic="light"
        style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.fill, alignItems: 'center', justifyContent: 'center' }}
      >
        <Ionicons name="close" size={18} color={colors.label} />
      </PressableScale>
    </View>
  );
}
