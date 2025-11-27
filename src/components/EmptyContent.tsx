import {kColors} from '@themes';
import LottieView from 'lottie-react-native';
import {useWindowDimensions, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
interface IEmptyContent {
  message?: string;
}
export const EmptyContent = ({message}: IEmptyContent) => {
  const {width, height} = useWindowDimensions();
  const theme = useTheme();
  const errorMessage = 'Oops..Something went wrong. Please try again';
  return (
    <View
      style={{
        flex: 1,
        height: height * 0.7,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <LottieView
        source={require('@assets/JSON/lottejson22.json')}
        style={{
          // flex: 1,
          width: width * 0.6,
          height: width * 0.4,
          alignSelf: 'center',
        }}
        autoPlay
      />
      <Text variant="titleMedium" style={{color: theme.colors.outline}}>
        {message ?? errorMessage}
      </Text>
    </View>
  );
};
