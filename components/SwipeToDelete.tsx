import React from 'react';
import { Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { radius, spacing, type } from '@/lib/theme';

const DELETE_WIDTH = 84;

export function SwipeToDelete({ children, onDelete }: { children: React.ReactNode; onDelete: () => void }) {
  const translateX = useSharedValue(0);
  const itemHeight = useSharedValue<number | 'auto'>('auto');
  const opacity = useSharedValue(1);
  const triggered = useSharedValue(false);

  const pan = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((e) => {
      translateX.value = Math.min(0, Math.max(e.translationX, -DELETE_WIDTH * 1.4));
      if (e.translationX < -DELETE_WIDTH && !triggered.value) {
        triggered.value = true;
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
      } else if (e.translationX >= -DELETE_WIDTH) {
        triggered.value = false;
      }
    })
    .onEnd((e) => {
      if (e.translationX < -DELETE_WIDTH) {
        translateX.value = withTiming(-500, { duration: 220 });
        opacity.value = withTiming(0, { duration: 220 }, () => {
          runOnJS(onDelete)();
        });
      } else {
        translateX.value = withSpring(0, { damping: 18, stiffness: 250 });
      }
    });

  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  const deleteStyle = useAnimatedStyle(() => ({
    opacity: Math.min(-translateX.value / DELETE_WIDTH, 1),
  }));

  return (
    <View style={{ position: 'relative' }}>
      <Animated.View
        style={[
          deleteStyle,
          {
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: DELETE_WIDTH + 20,
            backgroundColor: '#FF3B30',
            borderRadius: radius.lg,
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}
      >
        <Text style={[type.caption1, { color: '#fff', fontFamily: 'Inter_600SemiBold' }]}>Hapus</Text>
      </Animated.View>
      <GestureDetector gesture={pan}>
        <Animated.View style={rowStyle}>{children}</Animated.View>
      </GestureDetector>
    </View>
  );
}
