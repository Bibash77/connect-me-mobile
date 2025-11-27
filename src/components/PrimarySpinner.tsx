import React from 'react';
import {StyleSheet} from 'react-native';
import {ActivityIndicator, MD3Theme} from 'react-native-paper';

import {useThemedStyles} from '@hooks/useThemedStyles';

export default function PrimarySpinner() {
  const themedStyles = useThemedStyles(styles);

  return <ActivityIndicator style={themedStyles.container} />;
}

const styles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
  });
