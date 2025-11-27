import React, {useState} from 'react';
import {View, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {Text, Searchbar, Card, useTheme} from 'react-native-paper';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {SavedStackParamList} from '../navigation/SavedStackNavigator';
import {useThemedStyles} from '@hooks/useThemedStyles';
import {VectorIcon} from '@components';
import {MD3Theme} from 'react-native-paper';

type SavedItemsScreenRouteProp = RouteProp<SavedStackParamList, 'SavedItems'>;
type SavedItemsScreenNavigationProp = StackNavigationProp<
  SavedStackParamList,
  'SavedItems'
>;

interface SavedItem {
  id: string;
  name: string;
  category: string;
  location: string;
  distance: string;
  timing: string;
  rating: number;
  image: string;
}

const savedItems: SavedItem[] = [
  {
    id: '1',
    name: 'College of Applied Business and Technology',
    category: 'College',
    location: 'Gangahity, Chabahil, Kathmandu 44600',
    distance: '3.1 km',
    timing: '10 am - 5 pm',
    rating: 4.2,
    image: 'https://picsum.photos/seed/college/200',
  },
  {
    id: '2',
    name: 'Tech Solutions Nepal',
    category: 'IT Companies',
    location: 'Putalisadak, Kathmandu',
    distance: '2.5 km',
    timing: '9 am - 6 pm',
    rating: 4.5,
    image: 'https://picsum.photos/seed/tech/200',
  },
  {
    id: '3',
    name: 'Himalayan Java Coffee',
    category: 'Cafe',
    location: 'Thamel, Kathmandu',
    distance: '1.8 km',
    timing: '7 am - 9 pm',
    rating: 4.7,
    image: 'https://picsum.photos/seed/coffee/200',
  },
  // Add more items as needed
];

export default function SavedItemsScreen() {
  const styles = useThemedStyles(themedStyles);
  const theme = useTheme();
  const navigation = useNavigation<SavedItemsScreenNavigationProp>();
  const route = useRoute<SavedItemsScreenRouteProp>();
  const {category} = route.params;
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = savedItems.filter(
    item =>
      item.category === category &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderSavedItem = ({item}: {item: SavedItem}) => (
    <Card style={styles.card} mode="elevated">
      <Card.Cover source={{uri: item.image}} style={styles.cardCover} />
      <Card.Content style={styles.cardContent}>
        <View style={styles.headerRow}>
          <View style={styles.labelContainer}>
            <Text style={styles.categoryLabel}>{item.category}</Text>
          </View>
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <VectorIcon
            type={'materialCommunity'}
            name="arrow-left"
            size={24}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category}</Text>
      </View>
      <Searchbar
        placeholder="Search items"
        onChangeText={setSearchQuery}
        value={searchQuery}
        elevation={1}
        style={styles.searchBar}
        iconColor={theme.colors.primary}
      />
      <FlatList
        data={filteredItems}
        renderItem={renderSavedItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.itemsList}
      />
    </View>
  );
}

const themedStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F8F9FA',
      // backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 16,
      paddingHorizontal: 16,
    },
    backButton: {
      marginRight: 16,
    },
    headerTitle: {
      ...theme.fonts.headlineSmall,
      fontWeight: 'bold',
    },
    searchBar: {
      marginHorizontal: 16,
      marginBottom: 16,
      backgroundColor: theme.colors.background,
    },
    itemsList: {
      padding: 16,
    },
    card: {
      backgroundColor: theme.colors.onPrimary,
      marginBottom: 16,
      borderRadius: 12,
      overflow: 'hidden',
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
      paddingVertical: 2,
      borderRadius: 12,
      alignSelf: 'flex-start',
    },
    categoryLabel: {
      ...theme.fonts.labelLarge,
      color: theme.colors.onPrimaryContainer,
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
