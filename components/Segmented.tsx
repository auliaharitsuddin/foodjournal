import React, { useEffect, useState } from 'react';
import { LayoutChangeEvent, Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/lib/useTheme';
import { radius, spacing, springConfig, type } from '@/lib/theme';

interface Props {
  options: string[];
  value: number;
  onChange: (index: number) => void;
}

export function Segmented({ options, value, onChange }: Props) {
  const { colors } = useTheme();
  const [width, setWidth] = useState(0);
  const segWidth = width / options.length;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withSpring(segWidth * value, springConfig) }],
    width: segWidth,
  }));

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  return (
    <View
      onLayout={onLayout}
      style={{
        flexDirection: 'row',
        backgroundColor: colors.fill,
        borderRadius: radius.sm,
        padding: 3,
        position: 'relative',
      }}
    >
      {width > 0 && (
        <Animated.View
          style={[
            animatedStyle,
            {
              position: 'absolute',
              top: 3,
              bottom: 3,
              left: 0,
              backgroundColor: colors.card,
              borderRadius: radius.sm - 3,
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 1 },
            },
          ]}
        />
      )}
      {options.map((opt, i) => (
        <Pressable
          key={opt}
          onPress={() => {
            Haptics.selectionAsync();
            onChange(i);
          }}
          style={{ flex: 1, paddingVertical: spacing.sm, alignItems: 'center', zIndex: 1 }}
        >
          <Text style={[type.subhead, { color: i === value ? colors.label : colors.labelSecondary }]}>{opt}</Text>
        </Pressable>
      ))}
    </View>
  );
}
