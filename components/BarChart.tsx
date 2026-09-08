import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { type } from '@/lib/theme';

interface Bar {
  label: string;
  value: number;
}

export function BarChart({ data, goal, color, colors }: { data: Bar[]; goal: number; color: string; colors: any }) {
  const max = Math.max(goal, ...data.map((d) => d.value), 1);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 140, gap: 8 }}>
      {data.map((d, i) => (
        <BarColumn key={i} value={d.value} max={max} color={d.value > goal ? colors.red : color} label={d.label} delay={i * 60} colors={colors} />
      ))}
    </View>
  );
}

function BarColumn({ value, max, color, label, delay, colors }: { value: number; max: number; color: string; label: string; delay: number; colors: any }) {
  const height = useSharedValue(0);
  const ratio = value / max;

  useEffect(() => {
    height.value = withDelay(delay, withTiming(ratio * 100, { duration: 600 }));
  }, [ratio]);

  const style = useAnimatedStyle(() => ({ height: `${height.value}%` }));

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
      <View style={{ flex: 1, width: '100%', justifyContent: 'flex-end' }}>
        <Animated.View style={[style, { backgroundColor: color, borderRadius: 6, minHeight: value > 0 ? 4 : 0 }]} />
      </View>
      <Text style={[type.caption2, { color: colors.labelSecondary, marginTop: 4 }]}>{label}</Text>
    </View>
  );
}
