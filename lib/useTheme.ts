import { useColorScheme } from 'react-native';
import { palette } from './theme';

export function useTheme() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const colors = isDark ? palette.dark : palette.light;
  return { colors, isDark };
}
