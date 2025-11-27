import React from 'react';
import {View, StyleSheet, FlatList, Dimensions} from 'react-native';
import {Card, MD3Theme, Text, useTheme} from 'react-native-paper';
import {VectorIcon} from '@components';
import {CategorySkeletonLoader} from './SkeletonLoaders';
const {width} = Dimensions.get('screen');
export function CategorySection({categories, isLoading}) {
  const theme = useTheme();
  const styles = themedStyles(theme);

  const renderCategoryCard = ({item}: any) =>
    item?.categoryName && (
      <Card style={styles.categoryCard} key={item._id} elevation={2}>
        <Card.Content style={styles.categoryContent}>
          <View style={styles.categoryIcon}>
            <VectorIcon
              type="materialCommunity"
              name={item?.categoryIcon}
              size={20}
              color={theme.colors.primary}
            />
          </View>
          <View style={styles.categoryTextContainer}>
            <Text
              style={styles.categoryName}
              numberOfLines={1}
              ellipsizeMode="tail">
              {item?.categoryName}
            </Text>
            <Text style={styles.categoryCount}>{item?.count} near you</Text>
          </View>
        </Card.Content>
      </Card>
    );

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        Top searched business categories near you
      </Text>
      {isLoading ? (
        <CategorySkeletonLoader />
      ) : (
        <FlatList
          data={categories}
          renderItem={renderCategoryCard}
          keyExtractor={item => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categories}
        />
      )}
    </View>
  );
}

const themedStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    section: {
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '800',
      marginHorizontal: 16,
      marginBottom: 8,
    },
    categories: {
      flexDirection: 'row',
      paddingVertical: 8,
      paddingHorizontal: 16,
      gap: 12,
    },
    categoryCard: {
      minWidth: width * 0.4,
      backgroundColor: theme.colors.onPrimary,
      borderRadius: 8,
    },
    categoryContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    categoryIcon: {
      backgroundColor: theme.colors.surfaceVariant,
      padding: 8,
      borderRadius: 8,
      marginRight: 8,
    },
    categoryTextContainer: {
      flex: 1,
    },
    categoryName: {
      ...theme.fonts.titleMedium,
      fontWeight: '500',
    },
    categoryCount: {
      ...theme.fonts.labelMedium,
      color: theme.colors.outline,
    },
  });
