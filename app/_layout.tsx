import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';
import { useColorScheme } from 'react-native';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import { StoreProvider, useStore } from '@/lib/store';
import { palette } from '@/lib/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

function RootNavigator() {
  const { ready } = useStore();
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? palette.dark : palette.light;

  useEffect(() => {
    if (ready) {
      SystemUI.setBackgroundColorAsync(colors.bg).catch(() => {});
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [ready]);

  if (!ready) return null;

  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="add-meal/index"
          options={{ presentation: 'formSheet', sheetAllowedDetents: [0.6, 0.92], sheetGrabberVisible: true }}
        />
        <Stack.Screen
          name="add-meal/scan"
          options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="food/[id]"
          options={{ presentation: 'formSheet', sheetAllowedDetents: [0.55], sheetGrabberVisible: true }}
        />
        <Stack.Screen
          name="log-water"
          options={{ presentation: 'formSheet', sheetAllowedDetents: [0.45], sheetGrabberVisible: true }}
        />
        <Stack.Screen
          name="log-weight"
          options={{ presentation: 'formSheet', sheetAllowedDetents: [0.45], sheetGrabberVisible: true }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StoreProvider>
        <RootNavigator />
      </StoreProvider>
    </GestureHandlerRootView>
  );
}
