import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Card, MD3Theme, Text, useTheme} from 'react-native-paper';
import {VectorIcon} from '@components';
import {SCREEN} from '@constants/enum';
import {useAppSelector} from '@hooks/rtkHooks';

export function FavoriteCard({navigation}) {
  const theme = useTheme();
  const styles = themedStyles(theme);
  const {favouriteBusiness} = useAppSelector(state => state.businesses);

  if (favouriteBusiness?.length === 0) return null;

  return (
    <Card
      elevation={2}
      style={styles.favoriteCard}
      onPress={() => navigation.navigate(SCREEN.SAVED)}>
      <Card.Content style={styles.favoriteContent}>
        <View style={styles.favoriteLeft}>
          <VectorIcon
            type="materialCommunity"
            name="heart"
            size={24}
            color={theme.colors.primary}
          />
          <View style={styles.favoriteTextContainer}>
            <Text style={styles.favoriteCount}>
              {favouriteBusiness?.length} Businesses
            </Text>
            <Text style={styles.favoriteSubtext}>
              Recently added to favorite
            </Text>
          </View>
        </View>
        <VectorIcon
          type="materialCommunity"
          name="chevron-right"
          size={24}
          color="#666"
        />
      </Card.Content>
    </Card>
  );
}

const themedStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    favoriteCard: {
      backgroundColor: theme.colors.onPrimary,
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: 8,
    },
    favoriteContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    favoriteLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    favoriteTextContainer: {
      marginLeft: 8,
    },
    favoriteCount: {
      ...theme.fonts.titleMedium,
      fontWeight: '600',
    },
    favoriteSubtext: {
      ...theme.fonts.labelMedium,
      color: theme.colors.outline,
    },
  });
