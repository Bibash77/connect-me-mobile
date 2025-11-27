import React, {useState} from 'react';
import {View, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {Text, Searchbar, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

import {useThemedStyles} from '@hooks/useThemedStyles';
import {VectorIcon} from '@components';
import {MD3Theme} from 'react-native-paper';
import {SavedStackParamList} from '@routes/SavedStackNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type SavedCategoriesScreenNavigationProp = NativeStackNavigationProp<
  SavedStackParamList,
  'SavedCategories'
>;

interface Category {
  id: string;
  name: string;
  icon: string;
  itemCount: number;
}

const categories: Category[] = [
  {id: '1', name: 'College', icon: 'school', itemCount: 5},
  {id: '2', name: 'IT Companies', icon: 'laptop', itemCount: 8},
  {id: '3', name: 'Cafe', icon: 'coffee', itemCount: 12},
  {id: '4', name: 'Restaurants', icon: 'food', itemCount: 15},
  {id: '5', name: 'Gyms', icon: 'dumbbell', itemCount: 6},
  {id: '6', name: 'Hotels', icon: 'bed', itemCount: 10},
  {id: '7', name: 'Parks', icon: 'tree', itemCount: 4},
  {id: '8', name: 'Museums', icon: 'bank', itemCount: 3},
];

export default function SavedCategoriesScreen() {
  const styles = useThemedStyles(themedStyles);
  const theme = useTheme();
  const navigation = useNavigation<SavedCategoriesScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderCategory = ({item}: {item: Category}) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => navigation.navigate('SavedItems', {category: item.name})}>
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
        <Text style={styles.headerTitle}>Your Favourites</Text>
        <Text style={styles.headerSubtext}>
          Easily access your go-to contacts
        </Text>
      </View>
      <Searchbar
        placeholder="Search categories"
        onChangeText={setSearchQuery}
        value={searchQuery}
        elevation={1}
        style={styles.searchBar}
        iconColor={theme.colors.primary}
      />
      <FlatList
        data={filteredCategories}
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
      // backgroundColor: theme.colors.elevation.level1,
    },
    headerSubtext: {
      ...theme.fonts.labelLarge,
      color: theme.colors.onSurfaceVariant,
    },
    header: {
      marginBottom: 24,
      padding: 16,
    },
    headerTitle: {
      ...theme.fonts.headlineMedium,
      fontWeight: 'bold',
    },
    searchBar: {
      marginHorizontal: 16,
      marginBottom: 16,
      backgroundColor: theme.colors.onPrimary,
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
