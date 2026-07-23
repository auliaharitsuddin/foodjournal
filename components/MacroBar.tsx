import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { useTheme } from '@/lib/useTheme';
import { radius, spacing, type } from '@/lib/theme';

interface Props {
  label: string;
  value: number;
  goal: number;
  unit: string;
  color: string;
}

export function MacroBar({ label, value, goal, unit, color }: Props) {
  const { colors } = useTheme();
  const pct = useSharedValue(0);
  const ratio = goal > 0 ? Math.min(value / goal, 1) : 0;

  useEffect(() => {
    pct.value = withTiming(ratio, { duration: 800, easing: Easing.out(Easing.cubic) });
  }, [ratio]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${pct.value * 100}%`,
  }));

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs }}>
        <Text style={[type.caption1, { color: colors.labelSecondary }]}>{label}</Text>
        <Text style={[type.caption1, { color: colors.label }]}>
          {Math.round(value)}/{goal}
          {unit}
        </Text>
      </View>
      <View style={{ height: 6, backgroundColor: colors.fill, borderRadius: radius.pill, overflow: 'hidden' }}>
        <Animated.View style={[animatedStyle, { height: '100%', backgroundColor: color, borderRadius: radius.pill }]} />
      </View>
    </View>
  );
}
