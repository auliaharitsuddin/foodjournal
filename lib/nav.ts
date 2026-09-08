import { router } from 'expo-router';

// On web, refreshing or opening a URL directly on a pushed/modal screen leaves no
// in-memory navigation history behind it (the URL survives a reload, the JS stack
// doesn't), so router.back()/dismissAll() throw "action was not handled". Falls back
// to the tab root instead of leaving the screen stuck on a failed action.
export function safeBack() {
  try {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)');
  } catch {
    router.replace('/(tabs)');
  }
}

export function safeDismissAll() {
  try {
    if (router.canGoBack()) router.dismissAll();
    else router.replace('/(tabs)');
  } catch {
    router.replace('/(tabs)');
  }
}
