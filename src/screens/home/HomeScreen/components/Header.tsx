import React from 'react';
import {View, StyleSheet} from 'react-native';
import {
  Avatar,
  MD3Theme,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import {VectorIcon} from '@components';
import {useAppSelector} from '@hooks/rtkHooks';
import {getInitials} from '@helpers';
import {useNavigation} from '@react-navigation/native';
import {SCREEN} from '@constants/enum';

export function Header() {
  const navigation = useNavigation();
  const theme = useTheme();
  const styles = themedStyles(theme);
  const {user, isLoggedIn} = useAppSelector(state => state.settings);
  return (
    <View style={styles.header}>
      <View
        style={[
          styles.avatar,
          {
            backgroundColor: user?.name
              ? theme.colors.primary
              : theme.colors.surfaceVariant,
            borderWidth: 3,
            borderColor: '#FFFFFF',
            elevation: 5,
          },
        ]}>
        <TouchableRipple
          disabled={!isLoggedIn}
          onPress={() => navigation.navigate(SCREEN.PROFILESCREEN)}>
          <View>
            {isLoggedIn && user?.name ? (
              <Text style={styles.avatarLabel}>{getInitials(user?.name)}</Text>
            ) : (
              <VectorIcon
                type="material"
                name="person"
                size={32}
                color={theme.colors.outline}
              />
            )}
          </View>
        </TouchableRipple>
      </View>

      <View>
        <Text style={styles.headerText}>
          Hi {user?.name?.split(' ')[0] ?? 'User'},
        </Text>
        <Text style={styles.headerSubtext}>Welcome to Connectme</Text>
      </View>
    </View>
  );
}

const themedStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    header: {
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatarLabel: {
      ...theme.fonts.headlineSmall,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    avatar: {
      height: 55,
      width: 55,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 60,
      marginRight: 8,
    },
    headerText: {
      ...theme.fonts.headlineMedium,
      fontWeight: 'bold',
      letterSpacing: 2,
    },
    headerSubtext: {
      ...theme.fonts.labelLarge,
      color: theme.colors.onSurfaceVariant,
    },
  });
