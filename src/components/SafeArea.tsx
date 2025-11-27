import React from 'react';
import {StyleSheet} from 'react-native';
import {MD3Theme} from 'react-native-paper/lib/typescript/types';
import {Edges, SafeAreaView} from 'react-native-safe-area-context';

import {useThemedStyles} from '@hooks/useThemedStyles';

interface IPrimarySafeAreaProps {
  children: React.ReactNode;
  edges?: Edges;
}

export default function SafeArea({
  children,
  edges = ['bottom'],
}: IPrimarySafeAreaProps) {
  const themedStyles = useThemedStyles(styles);

  return (
    <SafeAreaView edges={edges} style={themedStyles.container}>
      {children}
    </SafeAreaView>
  );
}

const styles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'red',
      // backgroundColor: theme.colors.background,
    },
  });
