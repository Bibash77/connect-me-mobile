import React from 'react';
import {View, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

import {useThemedStyles} from '@hooks/useThemedStyles';
import {VectorIcon} from '@components';
import {MD3Theme} from 'react-native-paper';
import {SavedStackParamList} from '@routes/SavedStackNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useAppSelector} from '@hooks/rtkHooks';
import {SCREEN} from '@constants/enum';

type SavedCategoriesScreenNavigationProp = NativeStackNavigationProp<
  SavedStackParamList,
  'SavedCategories'
>;

export default function SavedCategoriesScreen() {
  const styles = useThemedStyles(themedStyles);
  const {favouriteBusiness} = useAppSelector(state => state.businesses);
  const theme = useTheme();
  const navigation = useNavigation<SavedCategoriesScreenNavigationProp>();

  // Group businesses by category
  const categorizedBusinesses =
    favouriteBusiness?.reduce((acc, item) => {
      const categoryName = item.category.name;
      if (!acc[categoryName]) {
        acc[categoryName] = {
          ...item.category,
          items: [],
        };
      }
      acc[categoryName].items.push(item);
      return acc;
    }, {}) || {};

  // Create a list of categories with item counts
  const categories = Object.keys(categorizedBusinesses).map(key => ({
    id: categorizedBusinesses[key]._id,
    name: categorizedBusinesses[key].name,
    icon: categorizedBusinesses[key].icon,
    itemCount: categorizedBusinesses[key].items.length,
  }));

  // Add "All Categories" as the first item
  const allCategories = [
    {
      id: 'all',
      name: 'All Favourites',
      icon: 'apps',
      itemCount: favouriteBusiness?.length || 0,
    },
    ...categories,
  ];

  const renderCategory = ({item}: {item: (typeof allCategories)[0]}) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() =>
        navigation.navigate(SCREEN.SAVEDITEMS, {
          category: item.id === 'all' ? 'All Favourites' : item.name,
        })
      }>
      <View style={styles.categoryContent}>
        <View style={styles.iconContainer}>
          <VectorIcon
            type="materialCommunity"
            name={item.icon}
            size={24}
            color={theme.colors.primary}
          />
        </View>
        <Text style={styles.categoryText}>{item.name}</Text>
        <Text style={styles.itemCount}>{item.itemCount} items</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favourite Lists</Text>
        <Text style={styles.headerSubtext}>
          Easily access your go-to contacts
        </Text>
      </View>
      <FlatList
        data={allCategories}
        renderItem={renderCategory}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.categoriesList}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
}

const themedStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F8F9FA',
    },
    header: {
      // marginBottom: ,
      padding: 16,
    },
    headerTitle: {
      ...theme.fonts.headlineMedium,
      fontWeight: 'bold',
    },
    headerSubtext: {
      ...theme.fonts.labelLarge,
      color: theme.colors.onSurfaceVariant,
    },
    categoriesList: {
      padding: 8,
    },
    row: {
      justifyContent: 'space-between',
    },
    categoryItem: {
      flex: 1,
      margin: 8,
      borderRadius: 16,
      overflow: 'hidden',
      backgroundColor: theme.colors.onPrimary,
      elevation: 2,
    },
    categoryContent: {
      padding: 16,
      alignItems: 'center',
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.primaryContainer,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    categoryText: {
      ...theme.fonts.titleMedium,
      color: theme.colors.onSurfaceVariant,
      textAlign: 'center',
      marginBottom: 4,
    },
    itemCount: {
      ...theme.fonts.labelMedium,
      color: theme.colors.onSurfaceVariant,
      opacity: 0.8,
    },
  });
