import React, {useState} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {MD3Theme, Text} from 'react-native-paper';

import {PrimarySpinner} from '@components';
import {useThemedStyles} from '@hooks/useThemedStyles';

export default function AuthScreen() {
  const themedStyles = useThemedStyles(styles);

  if (false) return <PrimarySpinner />;

  return (
    <View>
      <Text variant="titleMedium">Auth Screen</Text>
    </View>
  );
}

const styles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.elevation.level1,
      overflow: 'hidden',
    },
  });
