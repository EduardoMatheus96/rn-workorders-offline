import { useThemeContext } from '../context/ThemeContext';
import { colors } from '../constants/colors';

export function useTheme() {
  const { isDark, toggleTheme } = useThemeContext();

  return {
    isDark,
    toggleTheme,
    iconColor: {
      muted: isDark ? colors.inmetaGreenAccent : colors.gray400,
      subtle: isDark ? colors.inmetaGreenText : colors.gray500,
    },
  };
}