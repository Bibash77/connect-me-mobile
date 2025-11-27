import React, {useState, useCallback, useRef, useEffect, useMemo} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  Image,
  Linking,
  Animated as Animate,
  TouchableOpacity,
  StatusBar,
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
  Button,
  TextInput,
} from 'react-native-paper';

import Animated, {
  FadeInDown,
  FadeOutDown,
  Layout,
} from 'react-native-reanimated';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
  BottomSheetView,
  useBottomSheetSpringConfigs,
} from '@gorhom/bottom-sheet';
import {
  CustomActionSheet,
  DetailBottomSheet,
  DetailSection,
  FocusAwareStatusBar,
  OverviewSection,
  RatingReviews,
  VectorIcon,
} from '@components';
import {FlatList} from 'react-native-gesture-handler';
import {useThemedStyles} from '@hooks/useThemedStyles';
import {
  useAllBusinessListMutation,
  useLazyGetCategoriesWithTagsQuery,
  useLazyGetOverviewDetailQuery,
} from '@redux/features/businesses/businessService';
import LottieView from 'lottie-react-native';
import {debounce} from 'lodash';
import {useAppDispatch, useAppSelector} from '@hooks/rtkHooks';
import {
  searchedBusiness,
  toggleFavouriteBusiness,
} from '@redux/features/businesses/businessesSlice';
import {SlidersHorizontal, X} from 'lucide-react-native';
import Slider from '@react-native-community/slider';
import {showToast} from '@helpers';
import {baseApi} from '@redux/baseApi';
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

// const categories = [
//   {id: 'all', name: 'All', icon: 'apps'},
//   {id: 'college', name: 'College', icon: 'school'},
//   {id: 'hospital', name: 'Hospital', icon: 'hospital-building'},
//   {id: 'restaurant', name: 'Restaurant', icon: 'food'},
//   {id: 'hotel', name: 'Hotel', icon: 'bed'},
//   {id: 'cafe', name: 'Cafe', icon: 'coffee'},
//   {id: 'gym', name: 'Gym', icon: 'dumbbell'},
//   {id: 'shopping', name: 'Shopping', icon: 'shopping'},
//   {id: 'entertainment', name: 'Entertainment', icon: 'movie'},
//   {id: 'beauty', name: 'Beauty', icon: 'face-woman'},
//   {id: 'sports', name: 'Sports', icon: 'basketball'},
//   {id: 'education', name: 'Education', icon: 'book-open-variant'},
// ];

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
const SCREEN_WIDTH = Dimensions.get('window').width;
export default function BusinessNearYouScreen({route, navigation}: any) {
  const {favouriteBusiness} = useAppSelector(state => state.businesses);
  const [getCategoriesWithTags] = useLazyGetCategoriesWithTagsQuery();
  const [getOverviewDetail, {isLoading: isOverviewLoading, isError}] =
    useLazyGetOverviewDetailQuery();
  const dispatch = useAppDispatch();
  const params = route?.params;
  const theme = useTheme();
  const [allBusinessList] = useAllBusinessListMutation();
  const [searchQuery, setSearchQuery] = useState('');
  const styles = useThemedStyles(themedStyles);
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [businessList, setBusinessList] = useState([]);
  const [filteredBusinessList, setFilteredBusinessList] = useState([]);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const pageRef = useRef(1);
  const [pageLimit] = useState(4);
  const [networkCallStatus, setNetworkCallStatus] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (params && params?.searchValue) {
      onChangeSearch(params?.searchValue);
      // handleSearchNew(params?.searchValue);
    }
  }, [route]);
  // const handleSearchNew = async (searchValue: string) => {
  //   setSearchQuery(searchValue);
  //   try {
  //     setIsLoading(true);
  //     const resp = await allBusinessList({
  //       searchField: {name: searchValue},
  //       limit: 100,
  //     }).unwrap();

  //     if (resp?.results?.length === 1) {
  //       const singleResult = resp.results[0];
  //       console.log('SingleResult!!', singleResult);
  //       if (
  //         singleResult.name.toLowerCase().includes(searchValue.toLowerCase())
  //       ) {
  //         dispatch(
  //           searchedBusiness({
  //             searchedText: searchValue,
  //             matched: true,
  //             name: singleResult?.name,
  //             address: singleResult?.location?.formattedAddress,
  //             distance: singleResult?.distance,
  //           }),
  //         );
  //       } else {
  //         dispatch(searchedBusiness({name: searchValue, matched: false}));
  //       }
  //     } else if (resp?.results?.length === 0) {
  //       dispatch(searchedBusiness({name: searchValue, matched: false}));
  //     }
  //     setFilteredBusinessList(resp?.results || []);
  //   } catch (error) {
  //     console.error('Error fetching search results:', error);
  //     setFilteredBusinessList([]);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleSearchNew = async (searchValue: string) => {
  //   setSearchQuery(searchValue);
  //   try {
  //     setIsLoading(true);
  //     const resp = await allBusinessList({
  //       searchField: {name: searchValue},
  //       limit: 100,
  //     }).unwrap();
  //     if (resp?.results?.length === 1) {
  //       const singleResult = resp.results[0];
  //       dispatch(
  //         searchedBusiness({
  //           searchedText: searchValue,
  //           name: singleResult?.name,
  //           address: singleResult?.address,
  //           distance: singleResult?.distance,
  //         }),
  //       );
  //     } else if (resp?.results?.length === 0) {
  //       dispatch(searchedBusiness({name: searchValue}));
  //     }
  //     setFilteredBusinessList(resp?.results || []);
  //   } catch (error) {
  //     console.error('Error fetching search results:', error);
  //     setFilteredBusinessList([]);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleLoadMore = () => {
    if (hasMore && !networkCallStatus) {
      pageRef.current = pageRef.current + 1;
      if (searchQuery !== '') {
        handleOnlineSearch(searchQuery, pageRef.current);
      } else {
        fetchAllBusiness(pageRef.current);
      }
    }
  };

  const fetchAllBusiness = useCallback(
    async (pageNumber: number) => {
      if (!hasMore || networkCallStatus) return;
      try {
        setNetworkCallStatus(true);
        const postData = {page: pageNumber, limit: pageLimit};
        const resp = await allBusinessList(postData).unwrap();
        if (resp?.results?.length) {
          setFilteredBusinessList(prev => [...prev, ...resp.results]);
          setBusinessList(prev => [...prev, ...resp.results]);
          setHasMore(resp.results.length === pageLimit);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setNetworkCallStatus(false);
      }
    },
    [hasMore, networkCallStatus, allBusinessList, pageLimit, setBusinessList],
  );

  useEffect(() => {
    fetchCategories();
    fetchAllBusiness(1);
  }, []);

  const renderImage = ({item}) => (
    <Image source={{uri: item}} style={styles.carouselImage} />
  );

  const onChangeSearch = (text: string) => {
    setSearchQuery(text);
    handleSearch(text);
  };

  const handleSearch = useCallback(
    debounce(async text => {
      await handleOnlineSearch(text, 1);
    }, 500),
    [businessList],
  );

  const handleOnlineSearch = async (query, pageNumber) => {
    try {
      setIsLoading(true);
      const postData =
        query === ''
          ? {page: pageNumber, limit: pageLimit}
          : {
              searchField: {name: query},
              limit: 100,
            };
      const resp = await allBusinessList(postData).unwrap();
      if (resp?.results) {
        setFilteredBusinessList(resp.results);
        if (query === '') {
          setHasMore(resp?.results?.length === pageLimit);
        } else {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Search error:', error);
      setFilteredBusinessList([]);
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleOpenSheet = useCallback(async () => {
    bottomSheetRef.current?.expand();
    setModalOpen(true);
  }, []);
  const handleCloseSheet = useCallback(async () => {
    bottomSheetRef.current?.close();
    setModalOpen(false);
  }, []);

  const handleFilteredSearch = () => {
    try {
      const postData = {
        searchField: {
          radius: radius,
        },
        page: 1,
        limit: 50,
      };
    } catch (error) {}
  };
  const bottomSheetDetailRef = useRef<BottomSheet>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<{} | null>(null);
  const [businessDataState, setBusinessDataState] = useState({});
  const [networkCallStatusV2, setNetworkCallStatusV2] = useState(false);

  const handleOpenBottomSheet = () => {
    if (bottomSheetDetailRef.current) {
      bottomSheetDetailRef.current.expand(); // Open the BottomSheet
    }
  };
  const fetchCategories = useCallback(async () => {
    try {
      const resp = await getCategoriesWithTags().unwrap();
      if (resp?.success === true && resp?.data && resp?.data?.length > 0) {
        setCategories(resp?.data);
      }
      console.log('Response!!Cat!', resp);
    } catch (error) {
      console.log('Error', error);
    }
  }, []);
  const fetchOverviewData = useCallback(
    async (_id: any) => {
      try {
        setNetworkCallStatusV2(true);
        baseApi.util.invalidateTags(['Overview']);
        const resp = await getOverviewDetail({
          businessId: _id,
        }).unwrap();
        if (resp) {
          setBusinessDataState(resp);
        }
        setNetworkCallStatusV2(false);
      } catch (error) {
        console.error('Error fetching top businesses:', error);
      } finally {
        setNetworkCallStatusV2(false);
      }
    },
    [selectedBusiness],
  );

  const handleModalOpen = (item: any) => {
    console.log('Item!!!!!!!!!!!', item);
    setSelectedBusiness(item);
    fetchOverviewData(item?._id);
    handleOpenBottomSheet();
  };

  /*CallWebsiteMapEmailSection*/
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [actionType, setActionType] = useState<
    'call' | 'website' | 'map' | 'email'
  >();
  const [actionData, setActionData] = useState({});

  const showActionSheet = (
    type: 'call' | 'website' | 'map' | 'email',
    data: any,
  ) => {
    setActionType(type);
    setActionData(data);
    setIsVisible(true);
    handlePresentModalPress();
  };
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  /*CallWebsiteMapEmailSection*/

  const renderBusinessCard = ({
    item,
    index,
  }: {
    item: Business;
    index: number;
  }) => {
    const handleAddFavourite = () => {
      dispatch(toggleFavouriteBusiness(item));
      setTimeout(() => {
        favouriteBusiness.some(fav => fav._id === item?._id)
          ? showToast({
              message: 'Business removed to favourites',
              position: 'Top',
            })
          : showToast({
              message: 'Business added to favourites',
              position: 'Top',
            });
      }, 500);
    };

    return (
      <Animated.View
        entering={FadeInDown.delay(index * 100)}
        // exiting={FadeOutDown}
        style={{
          backgroundColor: theme.colors.background,
          elevation: 2,
          borderRadius: 16,
        }}
        layout={Layout.springify()}>
        <TouchableRipple
          onPress={() => handleModalOpen(item)}
          style={{overflow: 'hidden', borderRadius: 16}}>
          <>
            {item?.photos && item?.photos.length > 0 ? (
              <View style={styles.imageContainer}>
                <FlatList
                  data={item?.photos}
                  renderItem={renderImage}
                  keyExtractor={(item, index) => `photo-${index}`}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            ) : (
              <View
                style={[
                  styles.cardImagePlaceholder,
                  {backgroundColor: theme.colors.surfaceVariant},
                ]}>
                <VectorIcon
                  type="materialCommunity"
                  name={item?.category?.icon}
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
                  icon={
                    favouriteBusiness.some(fav => fav._id === item?._id)
                      ? 'heart'
                      : 'heart-outline'
                  }
                  iconColor={
                    favouriteBusiness.some(fav => fav._id === item?._id)
                      ? theme.colors.error
                      : theme.colors.outline
                  }
                  size={20}
                  onPress={handleAddFavourite}
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
                    onPress={() =>
                      showActionSheet('call', {call: `${item?.contact}`})
                    }>
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
                    onPress={() =>
                      showActionSheet('website', {website: `${item?.website}`})
                    }>
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
                    onPress={() =>
                      showActionSheet('map', {
                        map: `${item?.location?.coordinates}`,
                      })
                    }>
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
          </>
        </TouchableRipple>
      </Animated.View>
    );
  };
  const renderCategoryItem = ({
    item,
    index,
  }: {
    item: {id: string; name: string; icon: string};
    index: number;
  }) => {
    const isSelected = selectedCategories.includes(item?._id);
    // console.log('IsSelected', isSelected);
    return (
      <Chip
        key={item?._id ?? index}
        selected={isSelected}
        onPress={() => toggleCategory(item._id)}
        style={[styles.categoryChip, isSelected && styles.selectedCategoryItem]}
        textStyle={{
          color: isSelected ? theme.colors.primary : theme.colors.onBackground,
        }}
        showSelectedOverlay
        icon={({size, color}) => (
          <VectorIcon
            type="materialCommunity"
            name={item.icon}
            size={size}
            color={
              isSelected ? theme.colors.primary : theme.colors.onBackground
            }
          />
        )}>
        {item.name}
      </Chip>
    );
  };

  const renderAllCategoryItem = ({item: category}) => {
    const isSelected = selectedCategories.includes(category._id);

    return (
      <TouchableOpacity
        style={[styles.categoryItem, isSelected && styles.selectedCategoryItem]}
        onPress={() => toggleCategory(category._id)}>
        <VectorIcon
          type="materialCommunity"
          name={category?.icon}
          size={24}
          color={
            isSelected ? theme.colors.primary : theme.colors.onSurfaceVariant
          }
        />
        <Text
          style={[
            styles.categoryText,
            isSelected && styles.selectedCategoryText,
          ]}>
          {category?.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Surface style={styles.container}>
      <FocusAwareStatusBar
        backgroundColor={modalOpen ? 'rgba(0,0,0,0.5)' : '#F8F9FA'}
        barStyle={'dark-content'}
      />
      <View
        style={[
          styles.header,
          {flexDirection: 'row', justifyContent: 'space-between'},
        ]}>
        <View>
          <Text style={styles.headerText}>Discover Nearby</Text>
          <Text style={styles.headerSubtext}>
            Find the best local businesses
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleOpenSheet}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingRight: 8,
          }}>
          <SlidersHorizontal size={28} />
        </TouchableOpacity>
      </View>
      <Searchbar
        placeholder="Search businesses"
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={styles.searchBar}
        elevation={1}
      />
      <View style={[styles.categoriesContainer, {marginBottom: 16}]}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories.slice(0, 5)}
          renderItem={renderCategoryItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.categoriesScroll}
        />
      </View>
      {isLoading ? (
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
      ) : (
        <FlatList
          data={filteredBusinessList}
          renderItem={renderBusinessCard}
          keyExtractor={item => item.id}
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
      )}
      <Portal>
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={['90%']}
          onClose={() => setModalOpen(false)}
          backdropComponent={renderBackdrop}
          enablePanDownToClose={false} // Prevent the bottom sheet from closing
          enableContentPanningGesture={false} // Disable panning gestures for content
          enableHandlePanningGesture={false} // Disable panning gestures for handle
          backgroundStyle={{backgroundColor: theme.colors.background}}>
          <BottomSheetScrollView style={styles.bottomSheetContent}>
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 16,
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
              }}>
              <Text style={[styles.headerText]}>Filter</Text>
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <TouchableOpacity
                  onPress={handleCloseSheet}
                  style={{
                    backgroundColor: theme.colors.surfaceVariant,
                    padding: 6,
                    borderRadius: 60,
                  }}>
                  <X size={20} />
                </TouchableOpacity>
              </View>
            </View>
            <Surface style={styles.cardFilter}>
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

            <Surface style={[styles.categoriesCard]}>
              <Text style={[styles.sectionTitle, {paddingBottom: 8}]}>
                Categories
              </Text>
              {/* <View style={styles.categoriesContainer}> */}
              <FlatList
                numColumns={2}
                data={visibleCategories}
                keyExtractor={item => item._id.toString()}
                renderItem={renderAllCategoryItem}
                columnWrapperStyle={{
                  justifyContent: 'space-between', // Ensures space-between for items in each row
                }}
              />
              {/* </View> */}
              <Button
                mode="text"
                onPress={() => setShowAllCategories(!showAllCategories)}
                style={styles.showMoreButton}>
                {showAllCategories ? 'Show Less' : 'Show More'}
              </Button>
            </Surface>

            <Surface style={styles.categoriesCard}>
              <Text style={[styles.sectionTitle, {paddingBottom: 8}]}>
                Hashtag
              </Text>
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

              <Button
                mode="contained"
                onPress={handleFilteredSearch}
                style={styles.searchButton}
                icon="magnify">
                Search
              </Button>
            </Surface>
          </BottomSheetScrollView>
        </BottomSheet>
      </Portal>
      <Portal>
        <BottomSheetModalProvider>
          <CustomActionSheet
            bottomSheetModalRef={bottomSheetModalRef}
            type={actionType}
            data={actionData}
            isVisible={isVisible}
            onClose={() => setIsVisible(false)}
          />
        </BottomSheetModalProvider>
      </Portal>
      <DetailBottomSheet
        bottomSheetRef={bottomSheetDetailRef}
        businessDataState={businessDataState}
        networkCallStatus={networkCallStatusV2}
        selectedBusiness={selectedBusiness}
        isError={isError}
      />
    </Surface>
  );
}

const themedStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F8F9FA',
    },
    categoryItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
      width: '48%',
      gap: 8,
    },
    selectedCategoryItem: {
      backgroundColor: theme.colors.primaryContainer,
      borderWidth: 0.5,
      borderColor: theme.colors.primary,
    },
    categoryText: {
      marginLeft: 12,
      color: theme.colors.onSurfaceVariant,
      fontSize: 14,
      fontWeight: '500',
    },
    selectedCategoryText: {
      color: theme.colors.primary,
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
    },
    cardFilter: {
      marginBottom: 16,
      marginHorizontal: 16,
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
      paddingHorizontal: 16,
      backgroundColor: theme.colors.background,
    },
    categoriesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },

    imageContainer: {
      position: 'relative',
    },
    carouselImage: {
      width: SCREEN_WIDTH - 32,
      height: SCREEN_WIDTH * 0.35,
      // borderRadius: 16,
    },
    paginationContainer: {
      position: 'absolute',
      backgroundColor: 'rgba(0,0,0,0.3)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 18,
      bottom: 8, // Adjust the position from the top of the image
      alignSelf: 'center',
      flexDirection: 'row',
      zIndex: 1,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 4,
    },
    activeDot: {
      backgroundColor: theme.colors.surfaceVariant,
    },
    inactiveDot: {
      backgroundColor: theme.colors.outline,
    },
    card: {
      overflow: 'hidden',
      borderRadius: 16,
      backgroundColor: theme.colors.background,
      paddingHorizontal: 16,
    },
    cardImagePlaceholder: {
      height: 200,
      justifyContent: 'center',
      alignItems: 'center',
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
      marginTop: 16,
      marginBottom: 18,
      fontWeight: 'bold',
    },
    searchBar: {
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: 12,
      backgroundColor: '#FFFFFF',
    },
    // categoriesContainer: {
    //   marginBottom: 16,
    // },
    categoriesScroll: {
      paddingHorizontal: 16,
      gap: 8,
    },
    categoryChip: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 40,
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

    cardImage: {
      height: 160,
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
      // backgroundColor: theme.colors.surface,
      // paddingHorizontal: 16,
    },
    bottomSheetTitle: {
      fontWeight: 'bold',
      marginBottom: 16,
    },
    bottomSheetCategoriesGrid: {
      gap: 8,
    },
  });

//PAGINATION CODE
// const [activeSlide, setActiveSlide] = useState(0);
// const flatListRef = useRef();

// const onViewableItemsChanged = ({viewableItems}) => {
//   if (viewableItems.length > 0) {
//     setActiveSlide(viewableItems[0].index);
//   }
// };

// const viewabilityConfig = {
//   viewAreaCoveragePercentThreshold: 50,
// };

// ref={flatListRef}
// onViewableItemsChanged={onViewableItemsChanged}
// viewabilityConfig={viewabilityConfig}

// const images = [
//   {
//     id: '1',
//     uri: 'https://cdn.photographylife.com/wp-content/uploads/2014/09/Nikon-D750-Image-Samples-2.jpg',
//   },
//   {
//     id: '2',
//     uri: 'https://cdn.photographylife.com/wp-content/uploads/2014/09/Nikon-D750-Image-Samples-2.jpg',
//   },
//   {
//     id: '3',
//     uri: 'https://cdn.photographylife.com/wp-content/uploads/2014/09/Nikon-D750-Image-Samples-2.jpg',
//   },
// ];
