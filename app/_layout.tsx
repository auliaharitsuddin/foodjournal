import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';
import { Platform, useColorScheme, View } from 'react-native';
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

if (Platform.OS === 'web') {
  // react-native-reanimated's web CSS-transform driver emits a `transform-origin` inline
  // style key that react-dom flags as invalid (it expects `transformOrigin`). It's harmless —
  // the animation still works — but Expo's web dev overlay treats any console.error as a
  // blocking toast, so this one specific known-benign warning is filtered before it reaches it.
  const originalConsoleError = console.error;
  console.error = (...args: unknown[]) => {
    const first = args[0];
    if (typeof first === 'string' && first.includes('Invalid DOM property') && args.some((a) => typeof a === 'string' && a.includes('transformOrigin'))) {
      return;
    }
    originalConsoleError(...args);
  };
}

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
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <View style={{ flex: 1, width: '100%', maxWidth: 480, alignSelf: 'center' }}>
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
            name="add-meal/manual"
            options={{ presentation: 'formSheet', sheetAllowedDetents: [0.75], sheetGrabberVisible: true }}
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
          <Stack.Screen
            name="edit-profile"
            options={{ presentation: 'formSheet', sheetAllowedDetents: [0.85], sheetGrabberVisible: true }}
          />
          <Stack.Screen name="insights" />
        </Stack>
      </View>
    </View>
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
