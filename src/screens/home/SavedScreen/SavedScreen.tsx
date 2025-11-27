import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {Text, useTheme, Card} from 'react-native-paper';
import {VectorIcon} from '@components';
import {useThemedStyles} from '@hooks/useThemedStyles';
import {MD3Theme} from 'react-native-paper';
import {useAppSelector} from '@hooks/rtkHooks';

const SLIDE_DURATION = 300;

interface Category {
  id: string;
  name: string;
}

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

const categories: Category[] = [
  {id: '1', name: 'College'},
  {id: '2', name: 'IT Companies'},
  {id: '3', name: 'Cafe'},
  // Add more categories as needed
];

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

export default function SavedScreen() {
  const styles = useThemedStyles(themedStyles);
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const {favouriteBusiness} = useAppSelector(state => state.businesses);
  console.log('Favourite', favouriteBusiness);
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: SLIDE_DURATION,
      useNativeDriver: true,
    }).start();
  };

  const handleBack = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: SLIDE_DURATION,
      useNativeDriver: true,
    }).start(() => setSelectedCategory(null));
  };

  const renderCategory = ({item}: {item: Category}) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => handleCategorySelect(item.name)}>
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Your Favourites</Text>
      </View>

      <Animated.View
        style={[
          styles.categoriesContainer,
          {
            transform: [
              {
                translateX: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -400], // Adjust this value based on your screen width
                }),
              },
            ],
          },
        ]}>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.categoriesList}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.itemsContainer,
          {
            transform: [
              {
                translateX: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [400, 0], // Adjust this value based on your screen width
                }),
              },
            ],
          },
        ]}>
        {selectedCategory && (
          <>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <VectorIcon
                type={'materialCommunity'}
                name="arrow-left"
                size={24}
                color={theme.colors.primary}
              />
              <Text style={styles.backButtonText}>Back to Categories</Text>
            </TouchableOpacity>
            <Text style={styles.categoryTitle}>{selectedCategory}</Text>
            <FlatList
              data={savedItems.filter(
                item => item.category === selectedCategory,
              )}
              renderItem={renderSavedItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.itemsList}
            />
          </>
        )}
      </Animated.View>
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
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 16,
      paddingHorizontal: 16,
    },
    headerTitle: {
      ...theme.fonts.headlineSmall,
      fontWeight: 'bold',
    },
    categoriesContainer: {
      flex: 1,
      position: 'absolute',
      left: 0,
      right: 0,
      top: 60,
      bottom: 0,
    },
    categoriesList: {
      padding: 16,
    },
    categoryItem: {
      backgroundColor: theme.colors.primaryContainer,
      padding: 16,
      marginBottom: 12,
      borderRadius: 8,
    },
    categoryText: {
      ...theme.fonts.titleMedium,
      color: theme.colors.onPrimaryContainer,
    },
    itemsContainer: {
      flex: 1,
      position: 'absolute',
      left: 0,
      right: 0,
      top: 60,
      bottom: 0,
      backgroundColor: theme.colors.background,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
    },
    backButtonText: {
      ...theme.fonts.labelLarge,
      color: theme.colors.primary,
      marginLeft: 8,
    },
    categoryTitle: {
      ...theme.fonts.headlineSmall,
      fontWeight: 'bold',
      padding: 16,
    },
    itemsList: {
      padding: 16,
    },
    card: {
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
