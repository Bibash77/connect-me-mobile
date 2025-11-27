import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import {ActivityIndicator, MD3Theme} from 'react-native-paper';

import {useThemedStyles} from '@hooks/useThemedStyles';
import LottieView from 'lottie-react-native';
const {width} = Dimensions.get('screen');
export default function LottieSpinner() {
  const themedStyles = useThemedStyles(styles);

  return (
    <LottieView
      source={require('@assets/JSON/lottie_loading.json')}
      style={{
        flex: 1,
        width: width * 0.2,
        height: width * 0.2,
        alignSelf: 'center',
      }}
      autoPlay
    />
  );
}

const styles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
  });
