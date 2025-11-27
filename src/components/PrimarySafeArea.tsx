import React from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import {MD3Theme} from 'react-native-paper/lib/typescript/types';
import {Edges} from 'react-native-safe-area-context';
import {useThemedStyles} from '@hooks/useThemedStyles';
import SafeArea from './SafeArea';
import {useTheme} from 'react-native-paper';

interface IPrimarySafeAreaProps {
  children: React.ReactNode;
  edges?: Edges;
}

export default function PrimarySafeArea({
  children,
  edges = ['bottom'],
}: IPrimarySafeAreaProps) {
  const themedStyles = useThemedStyles(styles);
  const theme = useTheme();
  return (
    <SafeArea edges={edges}>
      <StatusBar
        backgroundColor={theme.colors.elevation.level0}
        barStyle={'dark-content'}
      />
      {children}
    </SafeArea>
  );
}

const styles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    buttonText: {
      fontSize: 18,
      fontFamily: 'Gill Sans',
      textAlign: 'center',
      margin: 10,
      color: '#ffffff',
      backgroundColor: 'transparent',
    },
  });
