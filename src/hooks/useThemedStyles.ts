import {MD3Theme, useTheme} from 'react-native-paper';

export const useThemedStyles = <T>(styles: (theme: MD3Theme) => T): T => {
  const theme = useTheme();

  return styles(theme);
};
