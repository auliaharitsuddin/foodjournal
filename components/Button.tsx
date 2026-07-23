import React from 'react';
import { Text, ViewStyle } from 'react-native';
import { PressableScale } from './PressableScale';
import { useTheme } from '@/lib/useTheme';
import { radius, spacing, type } from '@/lib/theme';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'destructive';
  disabled?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
}

export function Button({ title, onPress, variant = 'primary', disabled, style, icon }: Props) {
  const { colors } = useTheme();

  const bg =
    variant === 'primary' ? colors.blue : variant === 'destructive' ? colors.red : colors.fill;
  const textColor = variant === 'secondary' ? colors.blue : '#FFFFFF';

  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      haptic="medium"
      style={{
        backgroundColor: bg,
        opacity: disabled ? 0.4 : 1,
        paddingVertical: spacing.md + 2,
        borderRadius: radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: spacing.sm,
        ...style,
      }}
    >
      {icon}
      <Text style={[type.headline, { color: textColor }]}>{title}</Text>
    </PressableScale>
  );
}
