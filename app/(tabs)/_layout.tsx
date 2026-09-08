import React from 'react';
import { Platform, Pressable, View } from 'react-native';
import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useTheme } from '@/lib/useTheme';
import { springConfig } from '@/lib/theme';

function TabButton(props: any) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Pressable
      {...props}
      onPressIn={(e) => {
        scale.value = withSpring(0.85, springConfig);
        props.onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withSpring(1, springConfig);
        props.onPressOut?.(e);
      }}
      onPress={(e) => {
        // react-native-web renders this Pressable as a real <a href> (expo-router passes
        // `href` through tabBarButton props for web deep-linking). Without preventDefault
        // the browser's native anchor navigation fires alongside the SPA navigation below,
        // causing a full page reload on every tab switch.
        (e as any)?.preventDefault?.();
        Haptics.selectionAsync();
        props.onPress?.(e);
      }}
      style={[props.style, { alignItems: 'center', justifyContent: 'center' }]}
    >
      <Animated.View style={style}>{props.children}</Animated.View>
    </Pressable>
  );
}

export default function TabsLayout() {
  const { colors, isDark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.blue,
        tabBarInactiveTintColor: colors.labelTertiary,
        tabBarShowLabel: true,
        tabBarButton: (props) => <TabButton {...props} />,
        tabBarStyle: {
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: Platform.OS === 'ios' ? 24 : 16,
          height: 64,
          borderRadius: 28,
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: 'transparent',
        },
        tabBarBackground: () => (
          <BlurView
            intensity={80}
            tint={isDark ? 'dark' : 'light'}
            style={{
              flex: 1,
              borderRadius: 28,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
            }}
          />
        ),
        tabBarLabelStyle: { fontFamily: 'Inter_600SemiBold', fontSize: 10 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Hari Ini',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'sunny' : 'sunny-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="diary"
        options={{
          title: 'Jurnal',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'book' : 'book-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="trends"
        options={{
          title: 'Progres',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'stats-chart' : 'stats-chart-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'person-circle' : 'person-circle-outline'} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
