import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Button,
  TextInput,
  Surface,
  useTheme,
  MD3Theme,
} from 'react-native-paper';
import Slider from '@react-native-community/slider';
import {VectorIcon} from '@components';
import {useThemedStyles} from '@hooks/useThemedStyles';
import {SCREEN} from '@constants/enum';

const categories = [
  {id: '1', name: 'IT Companies', icon: 'laptop'},
  {id: '2', name: 'Cafe', icon: 'coffee'},
  {id: '3', name: 'Hotel', icon: 'bed'},
  {id: '4', name: 'Hospital', icon: 'hospital'},
  {id: '5', name: 'College', icon: 'school'},
  {id: '6', name: 'School', icon: 'book'},
  {id: '7', name: 'Government', icon: 'briefcase'},
  {id: '8', name: 'Restaurants', icon: 'food'},
  {id: '9', name: 'Shopping', icon: 'shopping'},
  {id: '10', name: 'Entertainment', icon: 'film'},
];

export default function SearchScreen({route, navigation}: any) {
  const params = route?.params;
  console.log('Parameters', params);
  const theme = useTheme();
  const styles = useThemedStyles(themedStyles);
  const [radius, setRadius] = useState(0);
  const [rating, setRating] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState(['1']);
  const [hashtag, setHashtag] = useState('');
  const [showAllCategories, setShowAllCategories] = useState(false);

  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, 6);

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(catId => catId !== id) : [...prev, id],
    );
  };

  const handleNavigation = () => {
    try {
      const postData = {
        name: params?.searchValue ?? '',
        rating: rating ?? '',
        radius: radius ?? '',
        category: 'cafe',
        hashtag: hashtag ?? '',
      };
      navigation.navigate(SCREEN.LIST, {
        searchData: postData,
      });
    } catch (error) {}
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Discover Nearby</Text>
          <Text style={styles.headerSubtext}>
            Find the best local businesses
          </Text>
        </View>

        <Surface style={styles.card}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location Radius</Text>
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                value={radius}
                onValueChange={setRadius}
                minimumValue={0}
                maximumValue={50}
                step={1}
                minimumTrackTintColor={theme.colors.primary}
                maximumTrackTintColor={theme.colors.inversePrimary}
                thumbTintColor={theme.colors.primary}
              />
              <View style={styles.sliderValueContainer}>
                <Text style={styles.sliderValue}>{radius}</Text>
                <Text style={styles.sliderUnit}>km</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rating</Text>
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                value={rating}
                onValueChange={setRating}
                minimumValue={0}
                maximumValue={5}
                step={0.5}
                minimumTrackTintColor={theme.colors.primary}
                maximumTrackTintColor={theme.colors.inversePrimary}
                thumbTintColor={theme.colors.primary}
              />
              <View style={styles.sliderValueContainer}>
                <Text style={styles.sliderValue}>{rating.toFixed(1)}</Text>
                <VectorIcon
                  type={'materialCommunity'}
                  name="star"
                  size={16}
                  color={theme.colors.primary}
                  style={styles.starIcon}
                />
              </View>
            </View>
          </View>
        </Surface>

        <Surface style={[styles.card, styles.categoriesCard]}>
          <Text style={[styles.sectionTitle, {paddingBottom: 8}]}>
            Categories
          </Text>
          <View style={styles.categoriesContainer}>
            {visibleCategories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryItem,
                  selectedCategories.includes(category.id) &&
                    styles.selectedCategoryItem,
                ]}
                onPress={() => toggleCategory(category.id)}>
                <VectorIcon
                  type={'materialCommunity'}
                  name={category.icon}
                  size={24}
                  color={
                    selectedCategories.includes(category.id)
                      ? theme.colors.primary
                      : theme.colors.onSurfaceVariant
                  }
                />
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategories.includes(category.id) &&
                      styles.selectedCategoryText,
                  ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Button
            mode="text"
            onPress={() => setShowAllCategories(!showAllCategories)}
            style={styles.showMoreButton}>
            {showAllCategories ? 'Show Less' : 'Show More'}
          </Button>
        </Surface>

        <Surface style={styles.card}>
          <Text style={[styles.sectionTitle, {paddingBottom: 8}]}>Hashtag</Text>
          <View style={styles.hashtagInputContainer}>
            <VectorIcon
              type={'materialCommunity'}
              name="pound"
              size={24}
              color={theme.colors.onSurfaceVariant}
              style={styles.hashtagIcon}
            />
            <TextInput
              mode="flat"
              value={hashtag}
              onChangeText={setHashtag}
              placeholder="Add a hashtag"
              style={styles.hashtagInput}
              underlineColor="transparent"
            />
          </View>
        </Surface>

        <Button
          mode="contained"
          onPress={handleNavigation}
          style={styles.searchButton}
          icon="magnify">
          Search
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const themedStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F8F9FA',
      // backgroundColor: theme.colors.background,
    },
    content: {
      // padding: 16,
    },
    header: {
      // marginBottom: 24,
      padding: 18,
    },
    headerText: {
      ...theme.fonts.headlineMedium,
      fontWeight: 'bold',
    },
    headerSubtext: {
      ...theme.fonts.labelLarge,
      color: theme.colors.onSurfaceVariant,
    },
    card: {
      marginBottom: 16,
      marginHorizontal: 18,
      borderRadius: 16,
      padding: 16,
      elevation: 25,
      backgroundColor: theme.colors.onPrimary,
    },
    section: {
      // marginBottom: 20,
    },
    sectionTitle: {
      ...theme.fonts.titleMedium,
      fontWeight: '800',
      color: theme.colors.outline,
      marginBottom: 4,
    },
    sliderContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      // backgroundColor: 'cyan',
    },
    slider: {
      flex: 1,
      height: 40,
    },
    sliderValueContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.primaryContainer,
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 4,
      marginLeft: 12,
    },
    sliderValue: {
      ...theme.fonts.labelLarge,
      fontWeight: '600',
      color: theme.colors.onPrimaryContainer,
    },
    sliderUnit: {
      ...theme.fonts.labelLarge,
      color: theme.colors.onPrimaryContainer,
      marginLeft: 2,
    },
    starIcon: {
      marginLeft: 4,
    },
    categoriesCard: {
      padding: 16,
    },
    categoriesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    categoryItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
      width: '48%',
    },
    selectedCategoryItem: {
      backgroundColor: theme.colors.primaryContainer,
    },
    categoryText: {
      marginLeft: 12,
      color: theme.colors.onSurfaceVariant,
      fontSize: 14,
      fontWeight: '500',
    },
    selectedCategoryText: {
      color: theme.colors.onPrimaryContainer,
      fontWeight: '600',
    },
    showMoreButton: {
      alignSelf: 'center',
      marginTop: 8,
    },
    hashtagInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: 12,
      paddingHorizontal: 12,
    },
    hashtagIcon: {
      marginRight: 8,
    },
    hashtagInput: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    searchButton: {
      marginVertical: 16,
      borderRadius: 12,
      paddingVertical: 8,
      marginHorizontal: 18,
    },
  });
