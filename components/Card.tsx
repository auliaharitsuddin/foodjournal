import React from 'react';
import { View, ViewProps } from 'react-native';
import { useTheme } from '@/lib/useTheme';
import { radius, shadow, spacing } from '@/lib/theme';

export function Card({ style, children, ...rest }: ViewProps) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: colors.card,
          borderRadius: radius.lg,
          padding: spacing.lg,
        },
        shadow.card,
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
