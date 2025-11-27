import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Card, Text, IconButton, useTheme} from 'react-native-paper';
import {VectorIcon} from '@components';
import {useThemedStyles} from '@hooks/useThemedStyles';
import {MD3Theme} from 'react-native-paper';

interface SavedItemProps {
  item: {
    name: string;
    category: string;
    location: string;
    distance: string;
    timing: string;
    rating: number;
    image: string;
  };
}

export const SavedItem: React.FC<SavedItemProps> = ({item}) => {
  const styles = useThemedStyles(themedStyles);
  const theme = useTheme();

  return (
    <Card style={styles.card} mode="elevated">
      <Card.Cover source={{uri: item.image}} style={styles.cardCover} />
      <Card.Content style={styles.cardContent}>
        <View style={styles.headerRow}>
          <View style={styles.labelContainer}>
            <Text style={styles.categoryLabel}>{item.category}</Text>
          </View>
          <IconButton
            icon="heart"
            iconColor={theme.colors.primary}
            size={20}
            onPress={() => {}}
            style={styles.favoriteButton}
          />
        </View>
        <Text variant="titleMedium" style={styles.title}>
          {item.name}
        </Text>
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <VectorIcon
              type={'materialCommunity'}
              name="map-marker"
              size={16}
              color={theme.colors.primary}
            />
            <Text variant="bodyMedium" style={styles.detailText}>
              {item.location}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <VectorIcon
              type={'materialCommunity'}
              name="clock-outline"
              size={16}
              color={theme.colors.primary}
            />
            <Text variant="bodyMedium" style={styles.detailText}>
              {item.timing}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <VectorIcon
              type={'materialCommunity'}
              name="star"
              size={16}
              color={theme.colors.primary}
            />
            <Text variant="bodyMedium" style={styles.detailText}>
              {item.rating} • {item.distance}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const themedStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    card: {
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: theme.colors.background,
    },
    cardCover: {
      height: 120,
    },
    cardContent: {
      padding: 12,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    labelContainer: {
      backgroundColor: theme.colors.primaryContainer,
      paddingHorizontal: 12,
      opacity: 0.7,
      paddingVertical: 2,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'flex-start',
      marginBottom: 8,
    },
    categoryLabel: {
      ...theme.fonts.labelLarge,
      color: theme.colors.primary,
    },
    favoriteButton: {
      margin: 0,
    },
    title: {
      fontWeight: '600',
      marginBottom: 8,
    },
    detailsContainer: {
      gap: 4,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    detailText: {
      flex: 1,
    },
  });
