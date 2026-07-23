import React from 'react';
import { Pressable, PressableProps } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { springConfig } from '@/lib/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props extends PressableProps {
  haptic?: 'light' | 'medium' | 'heavy' | 'none';
  scaleTo?: number;
}

export function PressableScale({ haptic = 'light', scaleTo = 0.96, style, onPressIn, onPressOut, onPress, ...rest }: Props) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      style={[animatedStyle, style as any]}
      onPressIn={(e) => {
        scale.value = withSpring(scaleTo, springConfig);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withSpring(1, springConfig);
        onPressOut?.(e);
      }}
      onPress={(e) => {
        if (haptic !== 'none') {
          const map = {
            light: Haptics.ImpactFeedbackStyle.Light,
            medium: Haptics.ImpactFeedbackStyle.Medium,
            heavy: Haptics.ImpactFeedbackStyle.Heavy,
          } as const;
          Haptics.impactAsync(map[haptic]);
        }
        onPress?.(e);
      }}
      {...rest}
    />
  );
}
