import {View} from 'react-native';
import {VectorIcon} from '../Icons';
import {HelperText, useTheme} from 'react-native-paper';

export const HelperTextMessage = ({
  isError,
  errorMessage,
}: {
  isError: boolean;
  errorMessage: string;
}) => {
  const theme = useTheme();
  if (!isError) {
    return;
  }
  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <VectorIcon
        type={'material'}
        name="error"
        color={theme.colors.error}
        size={18}
      />
      <HelperText type="error" visible={isError}>
        {errorMessage}
      </HelperText>
    </View>
  );
};
