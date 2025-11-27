import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import {
  Text,
  Searchbar,
  Card,
  useTheme,
  TouchableRipple,
  IconButton,
} from 'react-native-paper';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';

import {useThemedStyles} from '@hooks/useThemedStyles';
import {
  DetailBottomSheet,
  EmptyContent,
  FocusAwareStatusBar,
  VectorIcon,
} from '@components';
import {MD3Theme} from 'react-native-paper';
import {useAppDispatch, useAppSelector} from '@hooks/rtkHooks';
import Animated, {FadeInDown, Layout} from 'react-native-reanimated';
import {toggleFavouriteBusiness} from '@redux/features/businesses/businessesSlice';
import {showToast} from '@helpers';
import {SCREEN} from '@constants/enum';
import BottomSheet from '@gorhom/bottom-sheet';
import {baseApi} from '@redux/baseApi';
import {useLazyGetOverviewDetailQuery} from '@redux/features/businesses/businessService';

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
const {width: SCREEN_WIDTH} = Dimensions.get('screen');
export default function SavedItemsScreen() {
  const dispatch = useAppDispatch();
  const styles = useThemedStyles(themedStyles);
  const [getOverviewDetail, {isLoading: isOverviewLoading, isError}] =
    useLazyGetOverviewDetailQuery();
  const {favouriteBusiness} = useAppSelector(state => state.businesses);
  console.log('FavouriteBusiness', favouriteBusiness);
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const category = route?.params?.category ?? 'All Favourites';
  console.log('Category', category);
  // const {category} = route.params;
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    return favouriteBusiness
      .filter(item => {
        const matchesCategory =
          category === 'All Favourites' || item?.category?.name === category;
        const matchesSearchQuery = item?.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearchQuery;
      })
      .sort((a, b) => a?.name.localeCompare(b?.name));
  }, [favouriteBusiness, category, searchQuery]);
  // const filteredItems = savedItems.filter(
  //   item =>
  //     item.category === category &&
  //     item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  // );

  const sortedBusinesses = [...favouriteBusiness].sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  const renderSavedItem = ({item}: {item: SavedItem}) => (
    <Card style={styles.card} mode="elevated">
      <Card.Cover source={{uri: item.image}} style={styles.cardCover} />
      <Card.Content style={styles.cardContent}>
        <View style={styles.headerRow}>
          <View style={styles.labelContainer}>
            <Text style={styles.categoryLabel}>{item?.category?.name}</Text>
          </View>
        </View>
        <Text variant="titleMedium" style={styles.title}>
          {item?.name}
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
              {item?.location?.formattedAddress}
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
  const renderImage = ({item}) => (
    <Image source={{uri: item}} style={styles.carouselImage} />
  );
  const renderBusinessCard = ({item, index}: {item: any; index: number}) => {
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
              {/* <View style={styles.actionButtons}>
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
              </View> */}
            </View>
          </>
        </TouchableRipple>
      </Animated.View>
    );
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
  return (
    <View style={styles.container}>
      <FocusAwareStatusBar
        backgroundColor={'#F8F9FA'}
        barStyle={'dark-content'}
      />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate(SCREEN.SAVEDCATEGORIES)}>
          <VectorIcon
            type={'materialCommunity'}
            name="arrow-left"
            size={24}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
        <Text style={{...theme.fonts.titleLarge, color: theme.colors.primary}}>
          List
        </Text>
      </View>
      <View style={{paddingHorizontal: 16, paddingBottom: 16}}>
        <Text style={styles.headerTitle}>{category ?? 'All Favourites'}</Text>
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
        renderItem={renderBusinessCard}
        keyExtractor={item => item?._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyContent message="No Data Found" />}
      />
      <DetailBottomSheet
        bottomSheetRef={bottomSheetDetailRef}
        businessDataState={businessDataState}
        networkCallStatus={networkCallStatusV2}
        selectedBusiness={selectedBusiness}
        isError={isError}
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
    },
    categoryText: {
      ...theme.fonts.labelSmall,
      // marginLeft: 12,
      color: theme.colors.onSurfaceVariant,
      // fontSize: 14,
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
      paddingHorizontal: 16,
      marginBottom: 16,
      marginTop: 8,
      flexDirection: 'row',
      alignItems: 'center',
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
    // categoryText: {
    //   fontWeight: '500',
    // },
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

    // header: {
    //   flexDirection: 'row',
    //   alignItems: 'center',
    //   marginVertical: 16,
    //   paddingHorizontal: 16,
    // },
    backButton: {
      marginRight: 8,
    },
    headerTitle: {
      ...theme.fonts.headlineSmall,
      fontWeight: 'bold',
    },
    // searchBar: {
    //   marginHorizontal: 16,
    //   marginBottom: 16,
    //   backgroundColor: theme.colors.background,
    // },
    itemsList: {
      padding: 16,
    },
    // card: {
    //   backgroundColor: theme.colors.onPrimary,
    //   marginBottom: 16,
    //   borderRadius: 12,
    //   overflow: 'hidden',
    // },
    cardCover: {
      height: 120,
    },
    // cardContent: {
    //   padding: 12,
    // },
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
    // categoryLabel: {
    //   ...theme.fonts.labelLarge,
    //   color: theme.colors.onPrimaryContainer,
    // },
    // title: {
    //   fontWeight: '600',
    //   marginBottom: 8,
    // },
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
