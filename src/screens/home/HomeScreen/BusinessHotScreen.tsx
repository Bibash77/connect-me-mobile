import React, {useState, useCallback, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import {
  Searchbar,
  Chip,
  Card,
  Text,
  IconButton,
  useTheme,
  Surface,
  Portal,
  MD3Theme,
  TouchableRipple,
} from 'react-native-paper';

import Animated, {
  FadeInDown,
  FadeOutDown,
  Layout,
} from 'react-native-reanimated';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {VectorIcon} from '@components';
import {FlatList} from 'react-native-gesture-handler';
import {useThemedStyles} from '@hooks/useThemedStyles';
import {
  useAllBusinessListMutation,
  useAllTopBussinessesMutation,
} from '@redux/features/businesses/businessService';
import LottieView from 'lottie-react-native';

const {width} = Dimensions.get('window');

interface Business {
  id: string;
  name: string;
  category: string;
  address: string;
  distance: string;
  rating: number;
  image?: string;
  isLiked?: boolean;
}

const categories = [
  {id: 'all', name: 'All', icon: 'apps'},
  {id: 'college', name: 'College', icon: 'school'},
  {id: 'hospital', name: 'Hospital', icon: 'hospital-building'},
  {id: 'restaurant', name: 'Restaurant', icon: 'food'},
  {id: 'hotel', name: 'Hotel', icon: 'bed'},
  {id: 'cafe', name: 'Cafe', icon: 'coffee'},
  {id: 'gym', name: 'Gym', icon: 'dumbbell'},
  {id: 'shopping', name: 'Shopping', icon: 'shopping'},
  {id: 'entertainment', name: 'Entertainment', icon: 'movie'},
  {id: 'beauty', name: 'Beauty', icon: 'face-woman'},
  {id: 'sports', name: 'Sports', icon: 'basketball'},
  {id: 'education', name: 'Education', icon: 'book-open-variant'},
];

const businesses: Business[] = [
  {
    id: '1',
    name: 'College of Applied Business and Technology',
    category: 'College',
    address: 'Gangahity, Chabahil, Kathmandu 44600',
    distance: '3.1 km away',
    rating: 3.1,
    image: 'https://picsum.photos/seed/college/400/200',
  },
  {
    id: '2',
    name: 'Central Hospital',
    category: 'Hospital',
    address: 'Gangahity, Chabahil, Kathmandu 44600',
    distance: '3.1 km away',
    rating: 3.1,
  },
  {
    id: '3',
    name: 'Star Cafe',
    category: 'Cafe',
    address: 'Gangahity, Chabahil, Kathmandu 44600',
    distance: '3.1 km away',
    rating: 3.1,
    image: 'https://picsum.photos/seed/cafe/400/200',
  },
];

export default function BusinessHotScreen({navigation}: any) {
  const theme = useTheme();
  const [allTopBussinesses] = useAllTopBussinessesMutation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const styles = useThemedStyles(themedStyles);
  const [likedBusinesses, setLikedBusinesses] = useState<Set<string>>(
    new Set(),
  );
  const pageRef = useRef(1);
  const [businessList, setBusinessList] = useState([]);
  const [filteredBusinessList, setFilteredBusinessList] = useState([]);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [pageLimit, setPageLimit] = useState(4);
  const [networkCallStatus, setNetworkCallStatus] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const handleLoadMore = () => {
    if (hasMore && !networkCallStatus) {
      pageRef.current = pageRef.current + 1;
      fetchHotBusiness(pageRef.current);
    }
  };
  const fetchHotBusiness = useCallback(
    async (pageNumber: number) => {
      if (!hasMore || networkCallStatus) return;
      try {
        setNetworkCallStatus(true);
        const postData = {
          latitude: 40.73061,
          longitude: -74.006,
          page: pageNumber,
          limit: pageLimit,
        };
        const resp = await allTopBussinesses(postData).unwrap();
        if (resp?.results && resp?.results?.length > 0) {
          setFilteredBusinessList(prevData => [...prevData, ...resp?.results]);
          setBusinessList(prevData => [...prevData, ...resp?.results]);
          setHasMore(resp.results.length === 4);
        } else {
          setHasMore(false);
        }
        console.log('Response', resp);
      } catch (error) {
      } finally {
        setNetworkCallStatus(false);
      }
    },
    [hasMore, networkCallStatus],
  );

  useEffect(() => {
    fetchHotBusiness(1);
  }, []);

  const toggleLike = useCallback((businessId: string) => {
    setLikedBusinesses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(businessId)) {
        newSet.delete(businessId);
      } else {
        newSet.add(businessId);
      }
      return newSet;
    });
  }, []);

  const openMap = coordinates => {
    const [longitude, latitude] = coordinates;
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;

    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'Unable to open the map.'),
    );
  };

  const openWebsite = url => {
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'Unable to open the website.'),
    );
  };
  const renderBusinessCard = ({
    item,
    index,
  }: {
    item: Business;
    index: number;
  }) => (
    <Animated.View
      key={`${item?._id + index}`}
      entering={FadeInDown.delay(index * 100)}
      // exiting={FadeOutDown}
      style={{
        backgroundColor: theme.colors.background,
        elevation: 2,
        borderRadius: 16,
      }}
      layout={Layout.springify()}>
      <View style={styles.card}>
        {item.photos ? (
          <Image source={{uri: item.photos[0]}} style={styles.cardImage} />
        ) : (
          <View
            style={[
              styles.cardImagePlaceholder,
              {backgroundColor: theme.colors.surfaceVariant},
            ]}>
            <VectorIcon
              type="materialCommunity"
              name={item?.category?.icon ?? 'store'}
              size={48}
              color={theme.colors.onSurfaceVariant}
            />
          </View>
        )}
        <View
          style={[
            styles.categoryLabel,
            {backgroundColor: theme.colors.primaryContainer},
          ]}>
          {item?.category?.icon && (
            <VectorIcon
              type={'materialCommunity'}
              name={item?.category?.icon}
              size={16}
              color={theme.colors.primary}
            />
          )}
          <Text
            variant="labelSmall"
            style={[
              styles.categoryText,
              {color: theme.colors.onPrimaryContainer},
            ]}>
            {item.category?.name}
          </Text>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View>
              <Text variant="titleMedium" style={styles.businessName}>
                {item.name}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 8,
                  gap: 4,
                }}>
                <VectorIcon
                  type="materialCommunity"
                  name="phone"
                  size={16}
                  color={theme.colors.primary}
                />
                <Text
                  variant="labelMedium"
                  style={{color: theme.colors.outline}}>
                  {item?.contact}
                </Text>
              </View>
            </View>

            <IconButton
              icon={likedBusinesses.has(item.id) ? 'heart' : 'heart-outline'}
              iconColor={
                likedBusinesses.has(item.id)
                  ? theme.colors.error
                  : theme.colors.outline
              }
              size={20}
              onPress={() => toggleLike(item.id)}
            />
          </View>

          <View style={styles.locationInfo}>
            <VectorIcon
              type="materialCommunity"
              name="map-marker"
              size={16}
              color={theme.colors.primary}
            />
            <Text variant="bodySmall" style={styles.address}>
              {item?.location?.formattedAddress}
            </Text>
          </View>
          <View style={styles.bottomInfo}>
            <View style={styles.distanceContainer}>
              <VectorIcon
                type="materialCommunity"
                name="map-marker-distance"
                size={16}
                color={theme.colors.primary}
              />
              <Text variant="bodySmall" style={styles.distance}>
                {item?.distance ?? '5.7 km away'}
              </Text>
            </View>
            <View style={styles.ratingContainer}>
              <VectorIcon
                type="materialCommunity"
                name="star"
                size={16}
                color={theme.colors.primary}
              />
              <Text variant="bodySmall" style={styles.rating}>
                {item.rating} rating
              </Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <View style={styles.touchableWrapper}>
              <TouchableRipple
                style={styles.buttonWrapper}
                borderless={true}
                onPress={() => Linking.openURL(`tel:${item?.contact}`)}>
                <>
                  <VectorIcon
                    type={'materialCommunity'}
                    name="phone"
                    mode="outlined"
                    size={18}
                  />
                  <Text style={styles.buttonText}>Call</Text>
                </>
              </TouchableRipple>
            </View>
            <View style={styles.touchableWrapper}>
              <TouchableRipple
                style={styles.buttonWrapper}
                borderless={true}
                onPress={() => openWebsite(item?.website)}>
                <>
                  <VectorIcon
                    type={'materialCommunity'}
                    name="web"
                    mode="outlined"
                    size={18}
                  />
                  <Text style={styles.buttonText}>Website</Text>
                </>
              </TouchableRipple>
            </View>
            <View style={styles.touchableWrapper}>
              <TouchableRipple
                style={styles.buttonWrapper}
                borderless={true}
                onPress={() => openMap(item?.location?.coordinates)}>
                <>
                  <VectorIcon
                    type={'materialCommunity'}
                    name="map-marker"
                    mode="outlined"
                    size={18}
                  />
                  <Text style={styles.buttonText}>Map</Text>
                </>
              </TouchableRipple>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );

  const renderCategoryItem = ({
    item,
  }: {
    item: {id: string; name: string; icon: string};
  }) => (
    <Chip
      key={item.id}
      selected={selectedCategory === item.name}
      onPress={() => setSelectedCategory(item.name)}
      style={styles.categoryChip}
      showSelectedOverlay
      icon={({size, color}) => (
        <VectorIcon
          type="materialCommunity"
          name={item.icon}
          size={size}
          color={color}
        />
      )}>
      {item.name}
    </Chip>
  );

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );
  return (
    <Surface style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 26,
        }}>
        <TouchableOpacity style={{}} onPress={() => navigation.goBack()}>
          <VectorIcon
            type={'materialCommunity'}
            name={'chevron-left'}
            color={theme.colors.onBackground}
            size={28}
          />
        </TouchableOpacity>
        <Text variant="titleLarge" style={styles.title}>
          Business hot in town
        </Text>
      </View>
      {/* <Searchbar
        placeholder="Search businesses"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        elevation={0}
      /> */}
      {/* <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories.slice(0, 5)}
          renderItem={renderCategoryItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.categoriesScroll}
          ListFooterComponent={
            <Chip
              mode="outlined"
              onPress={() => {
                console.log('Hello!!');
                bottomSheetRef.current?.expand();
              }}
              style={styles.moreButton}
              icon="dots-horizontal">
              More
            </Chip>
          }
        />
      </View> */}
      <FlatList
        data={filteredBusinessList}
        renderItem={renderBusinessCard}
        keyExtractor={item => item?._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          filteredBusinessList && hasMore ? (
            <LottieView
              source={require('@assets/JSON/lottie_loading.json')}
              style={{
                flex: 1,
                width: width * 0.2,
                height: width * 0.2,
                alignSelf: 'center',
              }}
              autoPlay
            />
          ) : null
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
      <Portal>
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={['50%']}
          backdropComponent={renderBackdrop}
          enablePanDownToClose
          backgroundStyle={{backgroundColor: theme.colors.background}}>
          <BottomSheetView style={styles.bottomSheetContent}>
            <Text variant="titleLarge" style={styles.bottomSheetTitle}>
              All Categories
            </Text>
            <FlatList
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={item => item.id}
              numColumns={3}
              contentContainerStyle={styles.bottomSheetCategoriesGrid}
            />
          </BottomSheetView>
        </BottomSheet>
      </Portal>
    </Surface>
  );
}

const themedStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F8F9FA',
    },
    actionButtons: {
      flexDirection: 'row',
      gap: 8,
      // justifyContent: 'space-between',
      marginTop: 16,
    },
    touchableWrapper: {
      borderColor: theme.colors.outlineVariant,
      backgroundColor: theme.colors.elevation.level2,
      borderRadius: 18,
      borderWidth: 1,
    },
    buttonWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      borderRadius: 18,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    buttonText: {
      ...theme.fonts.labelLarge,
      // fontSize: 14,
      fontWeight: '500',
    },
    title: {
      paddingHorizontal: 16,
      // paddingTop: 16,
      // paddingBottom: 8,
      fontWeight: 'bold',
    },
    searchBar: {
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: 12,
      backgroundColor: '#FFFFFF',
    },
    categoriesContainer: {
      marginBottom: 16,
    },
    categoriesScroll: {
      paddingHorizontal: 16,
      gap: 8,
    },
    categoryChip: {
      marginRight: 8,
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
      borderRadius: 18,
    },
    moreButton: {
      borderRadius: 20,
      marginLeft: 8,
    },
    listContainer: {
      paddingHorizontal: 16,
      paddingBottom: 16,
      gap: 16,
    },
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      // elevation: 2,
      overflow: 'hidden',
      margin: 0, // Remove unwanted space
      padding: 0, // Ensure no internal spacing
    },
    cardImage: {
      height: 160,
    },
    cardImagePlaceholder: {
      height: 160,
      alignItems: 'center',
      justifyContent: 'center',
    },
    categoryLabel: {
      position: 'absolute',
      top: 12,
      left: 12,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      gap: 4,
    },
    categoryText: {
      fontWeight: '500',
    },
    cardContent: {
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    businessName: {
      flex: 1,
      fontWeight: '600',
      marginRight: 8,
    },
    locationInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
      gap: 4,
    },
    address: {
      flex: 1,
      color: '#666',
    },
    bottomInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 12,
    },
    distanceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    distance: {
      color: '#666',
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    rating: {
      color: '#666',
    },
    bottomSheetContent: {
      flex: 1,
      padding: 16,
    },
    bottomSheetTitle: {
      fontWeight: 'bold',
      marginBottom: 16,
    },
    bottomSheetCategoriesGrid: {
      gap: 8,
    },
  });
