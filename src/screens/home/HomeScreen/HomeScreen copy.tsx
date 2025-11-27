import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  Card,
  MD3Theme,
  Portal,
  Searchbar,
  Surface,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';

import {CustomActionSheet, DetailBottomSheet, VectorIcon} from '@components';
import {useThemedStyles} from '@hooks/useThemedStyles';
import {
  useAllNearbyBussinessesMutation,
  useAllSearchedCategoriesMutation,
  useAllTopBussinessesMutation,
  useLazyGetOverviewDetailQuery,
} from '@redux/features/businesses/businessService';
import {useAppDispatch, useAppSelector} from '@hooks/rtkHooks';
import {SCREEN} from '@constants/enum';
import {getCurrentLocation} from '@helpers';
import {usePermissionContext} from '@hooks/PermissionContext';
import {
  CardSkeletonLoader,
  CategorySkeletonLoader,
} from './components/SkeletonLoaders';
import {useFocusEffect} from '@react-navigation/native';
import BottomSheet, {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import {baseApi} from '@redux/baseApi';
import {ChevronRight, Clock} from 'lucide-react-native';

interface Cafe {
  id: string;
  name: string;
  location?: string;
  distance?: string;
  type: 'recent' | 'search' | 'location';
}
const {width} = Dimensions.get('screen');
const TAB_WIDTH = width / 3;
export default function HomeScreen({navigation}: any) {
  const dispatch = useAppDispatch();
  const styles = useThemedStyles(themedStyles);
  const {
    hasLocationPermission,
    checkLocationPermission,
    tabBarHidden,
    handleTabBar,
  } = usePermissionContext();

  const {favouriteBusiness, searchHistory} = useAppSelector(
    state => state.businesses,
  );
  const {user} = useAppSelector(state => state.settings);
  console.log('User', user);

  const [allTopBussinesses, {isLoading: isTopBusLoading}] =
    useAllTopBussinessesMutation();
  const [allNearbyBussinesses, {isLoading: isNearBusLoading}] =
    useAllNearbyBussinessesMutation();
  const [allSearchedCategories, {isLoading: isCatLoading}] =
    useAllSearchedCategoriesMutation();
  const [getOverviewDetail, {isLoading, isError}] =
    useLazyGetOverviewDetailQuery();
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();

  const [topBusinesses, setTopBusinesses] = useState<any>([]);
  const [nearbyBusinesses, setNearbyBusinesses] = useState([]);
  const [topSearchedCategories, setTopSearchedCategories] = useState([]);
  const [location, setLocation] = useState();
  const [pageLimit, setPageLimit] = useState(3);
  const [refreshing, setRefreshing] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  console.log('topSearchedCategories', topSearchedCategories);
  const dismissSearchOverlay = () => {
    setIsSearchActive(false);
    Keyboard.dismiss();
  };
  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      setTimeout(() => {
        setRefreshing(false);
      }, 300);
    } catch (error) {}
  }, []);

  const fetchLocation = useCallback(async () => {
    try {
      if (hasLocationPermission) {
        const currentLocation = await getCurrentLocation();
        console.log('CUrrent', currentLocation?.coords);
        if (currentLocation?.coords) {
          // setLocation({
          //   latitude: currentLocation.coords.latitude,
          //   longitude: currentLocation.coords.longitude,
          // });
          setLocation({
            latitude: 40.73061,
            longitude: -74.006,
          });
        } else {
          console.log('No location data found.');
        }
      } else {
        const getPermission = await checkLocationPermission();
        console.log('GetPermission', getPermission);
        if (getPermission) {
          console.log('dudu');
          const currentLocation = await getCurrentLocation();
          console.log('CUrrent', currentLocation?.coords);
          if (currentLocation?.coords) {
            // setLocation({
            //   latitude: currentLocation.coords.latitude,
            //   longitude: currentLocation.coords.longitude,
            // });
            setLocation({
              latitude: 40.73061,
              longitude: -74.006,
            });
          }
        } else {
          console.log('No location data found.');
          setLocation({
            latitude: 40.73061,
            longitude: -74.006,
          });
        }
        console.log('GotPermissionYet', getPermission);
      }
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  }, []);

  const fetchAllCategoriesData = useCallback(async () => {
    if (!location) return;
    try {
      const postData = {
        latitude: location.latitude,
        longitude: location.longitude,
        page: 1,
        limit: pageLimit,
      };
      const resp = await allSearchedCategories(postData).unwrap();
      console.log('Fetched Categories:', resp);
      if (resp?.results?.length) {
        setTopSearchedCategories(resp.results);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, [location, pageLimit]);

  const fetchTopBusinessData = useCallback(async () => {
    if (!location) return;
    try {
      const postData = {
        latitude: location.latitude,
        longitude: location.longitude,
        page: 1,
        limit: pageLimit,
      };
      const resp = await allTopBussinesses(postData).unwrap();
      console.log('Fetched Top Businesses:', resp?.results[0]);
      setTopBusinesses(resp?.results || []);
    } catch (error) {
      console.error('Error fetching top businesses:', error);
    }
  }, [location, pageLimit]);

  const fetchNearbyBusinessData = useCallback(async () => {
    if (!location) return;
    try {
      const postData = {
        latitude: location.latitude,
        longitude: location.longitude,
        page: 1,
        limit: pageLimit,
      };
      console.log('PostData', postData);
      const resp = await allNearbyBussinesses(postData).unwrap();
      console.log('Fetched Nearby Businesses:', resp);
      setNearbyBusinesses(resp?.results || []);
    } catch (error) {
      console.error('Error fetching nearby businesses:', error);
    }
  }, [location, pageLimit]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (isSearchActive) {
          setIsSearchActive(false);
          handleTabBar(false);
          return true;
        }
        return false;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [isSearchActive]),
  );

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation, hasLocationPermission]);

  useEffect(() => {
    if (isSearchActive) {
      handleTabBar(true);
    } else {
      handleTabBar(false);
    }
  }, [isSearchActive]);

  useEffect(() => {
    if (location) {
      fetchTopBusinessData();
      fetchNearbyBusinessData();
      fetchAllCategoriesData();
    }
  }, [
    location,
    refreshing,
    fetchTopBusinessData,
    fetchNearbyBusinessData,
    fetchAllCategoriesData,
  ]);

  /*Display Overview modal and fetch data */
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<{} | null>(null);
  const [businessDataState, setBusinessDataState] = useState({});
  const [networkCallStatus, setNetworkCallStatus] = useState(false);

  const handleOpenBottomSheet = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.expand();
    }
  };

  // const handleCloseBottomSheet = () => {
  //   if (bottomSheetRef.current) {
  //     bottomSheetRef.current.close();
  //   }
  // };
  const fetchOverviewData = useCallback(
    async (_id: any) => {
      try {
        setNetworkCallStatus(true);
        baseApi.util.invalidateTags(['Overview']);
        const resp = await getOverviewDetail({
          businessId: _id,
        }).unwrap();
        if (resp) {
          setBusinessDataState(resp);
        }
        setNetworkCallStatus(false);
      } catch (error) {
        console.error('Error fetching top businesses:', error);
      } finally {
        console.log('HIIIII');
        setNetworkCallStatus(false);
      }
    },
    [selectedBusiness],
  );

  const handleModalOpen = (item: any) => {
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

  const renderItem = ({item}: {item: Cafe}) => (
    <View style={styles.itemContainer}>
      <View style={styles.leftIcon}>
        <View
          style={{
            backgroundColor: theme.colors.surfaceVariant,
            padding: 6,
            borderRadius: 100,
          }}>
          <Clock size={18} color={theme.colors.onBackground} />
        </View>
        {/* {renderIcon(item.type)} */}
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.name}>
          {item?.matched === true ? item?.searchedText : item?.name}
        </Text>
        {item.address && (
          <Text style={styles.location}>{item?.address ?? ''}</Text>
        )}
      </View>
      {item.distance && (
        <Text style={styles.distance}>{item?.distance ?? ''}</Text>
      )}
      <ChevronRight size={20} color="#666" />
    </View>
  );

  const renderCategoryCard = ({item, index}: any) =>
    item?.categoryName && (
      <Card style={styles.categoryCard} key={item?._id ?? index}>
        <Card.Content style={styles.categoryContent}>
          <View
            style={{
              backgroundColor: theme.colors.surfaceVariant,
              paddingHorizontal: 8,
              paddingVertical: 8,
              borderRadius: 8,
            }}>
            <VectorIcon
              type="materialCommunity"
              name={item.categoryIcon}
              size={20}
              color={theme.colors.primary}
            />
          </View>
          <View style={{flex: 1}}>
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

  const renderBusinessCard = ({item, index}: any) => {
    console.log('Item!!!!1', item);
    return (
      <Card style={styles.businessCard}>
        <TouchableRipple
          style={{paddingVertical: 16, borderRadius: 8}}
          borderless={true}
          key={item?._id ?? index}
          onPress={() => handleModalOpen(item)}>
          <Card.Content>
            <View style={{flexDirection: 'row'}}>
              <View style={{width: '60%'}}>
                <View style={styles.labelContainer}>
                  <View style={styles.categoryContainer}>
                    {item?.category?.icon && (
                      <VectorIcon
                        type={'materialCommunity'}
                        name={item?.category?.icon}
                        size={16}
                        color={theme.colors.primary}
                      />
                    )}
                    <Text style={styles.categoryLabel}>
                      {item?.category?.name}
                    </Text>
                  </View>
                </View>
                <Text style={styles.businessName}>{item?.name ?? 'N/A'}</Text>
                <View style={styles.infoRow}>
                  <VectorIcon
                    type="materialCommunity"
                    name="map-marker"
                    size={18}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.infoText}>
                    {item?.location?.formattedAddress ?? 'N/A'}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <VectorIcon
                    type="materialCommunity"
                    name="map-marker-distance"
                    size={18}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.infoText}>{item?.distance ?? 'N/A'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <VectorIcon
                    type="materialCommunity"
                    name="clock-outline"
                    size={18}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.infoText}>{item?.hours ?? 'N/A'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <VectorIcon
                    type="materialCommunity"
                    name="star"
                    size={18}
                    color="#FFD700"
                  />
                  <Text style={styles.infoText}>
                    {item?.rating ? `${item?.rating}` : 'N/A'}{' '}
                  </Text>
                </View>
              </View>
              <View style={{width: '40%', paddingLeft: 16}}>
                <Image
                  source={{uri: item?.photos[0]}}
                  resizeMode="contain"
                  style={{width: '100%', aspectRatio: 1, borderRadius: 8}}
                />
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
          </Card.Content>
        </TouchableRipple>
      </Card>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        style={[styles.container, isSearchActive && styles.fullScreenContainer]}
        refreshControl={
          <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
        }>
        <View style={styles.header}>
          <View
            style={{
              backgroundColor: theme.colors.surfaceVariant,
              height: 50,
              width: 50,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 100,
              marginRight: 8,
            }}>
            <VectorIcon
              type={'material'}
              name="person"
              size={32}
              color={theme.colors.outline}
            />
          </View>
          <View style={{}}>
            <Text style={styles.headerText2}>
              Hi {user?.name?.split(' ')[0] ?? 'User'},
            </Text>

            <Text style={styles.headerSubtext}>Welcome to Connectme</Text>
          </View>
          {/* <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <TouchableOpacity
              onPress={() => dispatch(toggleTheme())}
              style={{
                backgroundColor: theme.colors.surfaceVariant,
                padding: 6,
                borderRadius: 60,
              }}>
              <SunMoon />
            </TouchableOpacity>
          </View> */}
        </View>

        <Searchbar
          placeholder="Search here"
          placeholderTextColor={theme.colors.outline}
          onChangeText={setSearchQuery}
          value={searchQuery}
          elevation={1}
          style={styles.searchBar}
          onFocus={() => {
            handleTabBar(true);
            setIsSearchActive(true);
          }}
          iconColor={theme.colors.outline}
          onSubmitEditing={() => {
            if (searchQuery.trim()) {
              navigation.navigate(SCREEN.LIST, {
                searchValue: searchQuery.trim(),
              });
            }
          }}
        />
        {isSearchActive && (
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              // backgroundColor: '#ffffff',
              zIndex: 1,
            }}>
            <Surface style={styles.container}>
              <View style={styles.header}>
                <View style={{}}>
                  <Text style={styles.headerText2}>Discover Nearby</Text>
                  <Text style={styles.headerSubtext}>
                    Find the best local businesses
                  </Text>
                </View>
              </View>
              <Searchbar
                placeholder="Search here"
                placeholderTextColor={theme.colors.outline}
                onChangeText={setSearchQuery}
                value={searchQuery}
                elevation={1}
                style={styles.searchBar}
                icon={() => (
                  <VectorIcon
                    type={'feather'}
                    name="arrow-left" // Ensure this is the correct name for the left arrow icon in your icon set
                    size={20}
                    color={theme.colors.onBackground}
                  />
                )}
                onFocus={() => setIsSearchActive(true)}
                // onBlur={() => {
                //   setIsSearchActive(false);
                // }}
                iconColor={theme.colors.outline}
                onIconPress={() => setIsSearchActive(false)}
                autoFocus
                onSubmitEditing={() => {
                  console.log('cool');
                  if (searchQuery.trim()) {
                    navigation.navigate(SCREEN.LIST, {
                      searchValue: searchQuery.trim(),
                    });
                  }
                }}
              />
              <FlatList
                data={searchHistory}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
              />
            </Surface>
          </View>
        )}
        {favouriteBusiness?.length > 0 && (
          <Card
            style={styles.favoriteCard}
            onPress={() => navigation.navigate(SCREEN.SAVED)}>
            <Card.Content style={styles.favoriteContent}>
              <View style={styles.favoriteLeft}>
                <VectorIcon
                  type="materialCommunity"
                  name="heart"
                  size={24}
                  color={theme.colors.primary}
                />
                <View style={styles.favoriteTextContainer}>
                  <Text style={styles.favoriteCount}>
                    {favouriteBusiness?.length} Businesses
                  </Text>
                  <Text style={styles.favoriteSubtext}>
                    Recently added to favorite
                  </Text>
                </View>
              </View>
              <VectorIcon
                type="materialCommunity"
                name="chevron-right"
                size={24}
                color="#666"
              />
            </Card.Content>
          </Card>
        )}

        <View style={styles.section}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionTitle}>
              Top searched business categories near you
            </Text>
          </View>
          {isCatLoading ? (
            <CategorySkeletonLoader />
          ) : (
            <FlatList
              data={topSearchedCategories}
              renderItem={renderCategoryCard}
              keyExtractor={item => item?._id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categories}
            />
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionTitle}>Businesses near you</Text>
            <View style={styles.viewBtn}>
              <TouchableRipple
                onPress={() => navigation.navigate(SCREEN.BUSINESSNEARLIST)}
                borderless={true}
                rippleColor={theme.colors.primaryContainer}
                style={styles.viewRipple}>
                <>
                  <Text style={styles.viewText}>View all</Text>
                </>
              </TouchableRipple>
            </View>
          </View>
          {isNearBusLoading ? (
            <CardSkeletonLoader />
          ) : (
            <FlatList
              data={nearbyBusinesses}
              renderItem={renderBusinessCard}
              keyExtractor={item => item?._id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.businessList}
            />
          )}
        </View>
        <View style={styles.section}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionTitle}>Business hot in town</Text>
            <View style={styles.viewBtn}>
              <TouchableRipple
                onPress={() => navigation.navigate(SCREEN.BUSINESSHOTLIST)}
                borderless={true}
                rippleColor={theme.colors.primaryContainer}
                style={styles.viewRipple}>
                <>
                  <Text style={styles.viewText}>View all</Text>
                </>
              </TouchableRipple>
            </View>
          </View>
          {isTopBusLoading ? (
            <CardSkeletonLoader />
          ) : (
            <FlatList
              data={topBusinesses}
              renderItem={renderBusinessCard}
              keyExtractor={item => item?._id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.businessList}
            />
          )}
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
            bottomSheetRef={bottomSheetRef}
            businessDataState={businessDataState}
            networkCallStatus={networkCallStatus}
            selectedBusiness={selectedBusiness}
            isError={isError}
          />
          {/* <Portal>
            <BottomSheet
              ref={bottomSheetRef}
              index={-1}
              snapPoints={snapPoints}
              backdropComponent={renderBackdrop}
              enablePanDownToClose
              animationConfigs={animationConfigs}
              animateOnMount={true}
              enableDynamicSizing={false}>
              <View style={styles.tabBar}>
                {['Overview', 'Rating & Review', 'Details'].map(
                  (tab, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.tab}
                      onPress={() => handleTabPress(index)}>
                      <Text
                        style={[
                          styles.tabText,
                          activeTab === index && styles.activeTabText,
                        ]}>
                        {tab}
                      </Text>
                    </TouchableOpacity>
                  ),
                )}
                <Animated.View
                  style={[styles.indicator, {transform: [{translateX}]}]}>
                  <View
                    style={{
                      backgroundColor: theme.colors.primary,
                      width: '50%',
                      height: '100%',
                      borderRadius: 12,
                    }}
                  />
                </Animated.View>
              </View>
              {selectedBusiness && businessDataState && (
                <View style={styles.contentContainer}>{renderContent()}</View>
              )}
            </BottomSheet>
          </Portal> */}
        </View>
      </ScrollView>
    </View>
  );
}

const themedStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    listContainer: {
      backgroundColor: '#fff',
    },
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 70,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
    },
    leftIcon: {
      width: 24,
      alignItems: 'center',
      marginRight: 12,
    },
    contentContainer: {
      flex: 1,
      marginRight: 8,
    },
    name: {
      fontSize: 16,
      color: '#000',
    },
    location: {
      fontSize: 14,
      color: '#666',
    },
    distance: {
      fontSize: 14,
      color: '#666',
      marginRight: 8,
    },
    mainContainer: {
      flex: 1,
      backgroundColor: '#F8F9FA',
    },
    tabBar: {
      flexDirection: 'row',
      position: 'relative',
    },
    tab: {
      width: TAB_WIDTH,
      alignItems: 'center',
      paddingVertical: 10,
    },
    tabText: {
      fontSize: 14,
      fontWeight: '500',
      color: '#71717A',
    },
    activeTabText: {
      color: '#7C3AED',
    },
    indicator: {
      position: 'absolute',
      bottom: 0,
      height: 3,
      width: TAB_WIDTH,
      justifyContent: 'center',
      alignItems: 'center',
    },

    fullScreenContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
    },
    container: {
      flex: 1,
      backgroundColor: '#F8F9FA',
      overflow: 'hidden',
    },
    actionButtons: {
      flexDirection: 'row',
      gap: 8,
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
    viewText: {
      ...theme.fonts.labelLarge,
      color: theme.colors.primary,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      marginBottom: 8,
    },
    viewBtn: {
      borderColor: theme.colors.primary,
      borderWidth: 1,
      borderRadius: 4,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'flex-start',
    },
    viewRipple: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 4,
    },
    categoryContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
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
    businessList: {
      gap: 12,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    header: {
      // marginBottom: 24,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      // justifyContent: 'space-between',
    },
    textHeader: {
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    headerText: {
      ...theme.fonts.headlineLarge,
      letterSpacing: 3,
    },
    headerText2: {
      ...theme.fonts.headlineMedium,
      fontWeight: 'bold',
    },
    headerSubtext: {
      ...theme.fonts.labelLarge,
      color: theme.colors.onSurfaceVariant,
    },
    headerSecondaryText: {
      ...theme.fonts.bodyLarge,
    },
    searchBar: {
      marginHorizontal: 16,
      marginBottom: 16,
      backgroundColor: theme.colors.onPrimary,
    },
    searchInput: {
      marginHorizontal: 16,
      marginBottom: 16,
      backgroundColor: theme.colors.onPrimary,
    },
    favoriteCard: {
      backgroundColor: theme.colors.onPrimary,
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: 8,
    },
    favoriteContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    favoriteLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    favoriteTextContainer: {
      marginLeft: 8,
    },
    favoriteCount: {
      ...theme.fonts.titleMedium,
      fontWeight: '600',
    },
    favoriteSubtext: {
      ...theme.fonts.labelMedium,
      color: theme.colors.outline,
    },
    section: {
      marginBottom: 16,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '800',
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
      gap: 8,
    },
    categoryName: {
      ...theme.fonts.titleMedium,
      fontWeight: '500',
    },
    categoryCount: {
      ...theme.fonts.labelMedium,
      color: theme.colors.outline,
    },
    businessCard: {
      backgroundColor: theme.colors.onPrimary,
      width: width * 0.8,
      borderRadius: 8,
    },
    categoryLabel: {
      ...theme.fonts.labelLarge,
      color: theme.colors.primary,
    },
    businessName: {
      ...theme.fonts.titleMedium,
      lineHeight: 18,
      fontWeight: '600',
      marginBottom: 8,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
      gap: 8,
    },
    infoText: {
      ...theme.fonts.labelLarge,
      color: theme.colors.outline,
    },
  });

// const allData = [
//   {
//     topSearched: [
//       {id: '1', name: 'Hospitals', count: 4, icon: 'hospital-building'},
//       {id: '2', name: 'IT Companies', count: 14, icon: 'desktop-classic'},
//       {
//         id: '3',
//         name: 'Restaurants',
//         count: 20,
//         icon: 'silverware-fork-knife',
//       },
//     ],
//   },
//   {
//     businessNear: [
//       {
//         id: '1',
//         category: 'College',
//         name: 'College of Applied Business and Technology',
//         location: 'Gangahity, Chabahil, Kathmandu 44600',
//         distance: '3.1 km away',
//         hours: '10 am - 5 pm',
//         rating: '4.2',
//         ratingContainer: {
//           rating: '3.1',
//           ratingCount: 13,
//           reviews: [
//             {
//               id: '1',
//               author: 'Ram Shrestha',
//               avatar: 'https://placeholder.com/40',
//               rating: 3,
//               content:
//                 'COVID-19 affects different people in different ways. Most infected people will develop mild to different ways. Most infected people will develop mild to',
//               timeAgo: '4 min.',
//             },
//             {
//               id: '2',
//               author: 'Hari Sharma',
//               avatar: 'https://placeholder.com/40',
//               rating: 4,
//               content:
//                 'COVID-19 affects different people in different ways. Most infected people will develop mild to different ways. Most infected people will develop mild to',
//               timeAgo: '4 min.',
//             },
//             {
//               id: '3',
//               author: 'Hari Sharma',
//               avatar: 'https://placeholder.com/40',
//               rating: 2,
//               content:
//                 'COVID-19 affects different people in different ways. Most infected people will develop mild to different ways. Most infected people will develop mild to',
//               timeAgo: '4 min.',
//             },
//           ],
//         },
//       },
//       {
//         id: '2',
//         category: 'Hospital',
//         name: 'College of Applied Medical Sciences',
//         location: 'Gangahity, Chabahil, Kathmandu 44600',
//         distance: '2.5 km away',
//         hours: '24/7',
//         rating: '4.8',
//         ratingContainer: {
//           rating: '3.1',
//           ratingCount: 13,
//           reviews: [
//             {
//               id: '1',
//               author: 'Ram Shrestha',
//               avatar: 'https://placeholder.com/40',
//               rating: 3,
//               content:
//                 'COVID-19 affects different people in different ways. Most infected people will develop mild to different ways. Most infected people will develop mild to',
//               timeAgo: '4 min.',
//             },
//             {
//               id: '2',
//               author: 'Hari Sharma',
//               avatar: 'https://placeholder.com/40',
//               rating: 4,
//               content:
//                 'COVID-19 affects different people in different ways. Most infected people will develop mild to different ways. Most infected people will develop mild to',
//               timeAgo: '4 min.',
//             },
//             {
//               id: '3',
//               author: 'Hari Sharma',
//               avatar: 'https://placeholder.com/40',
//               rating: 2,
//               content:
//                 'COVID-19 affects different people in different ways. Most infected people will develop mild to different ways. Most infected people will develop mild to',
//               timeAgo: '4 min.',
//             },
//           ],
//         },
//       },
//     ],
//   },
//   {
//     businessHot: [
//       {
//         id: '1',
//         category: 'College',
//         name: 'College of Applied Business and Technology',
//         location: 'Gangahity, Chabahil, Kathmandu 44600',
//         distance: '3.1 km away',
//         hours: '10 am - 5 pm',
//         rating: '4.2',
//         ratingContainer: {
//           rating: '3.1',
//           ratingCount: 13,
//           reviews: [
//             {
//               id: '1',
//               author: 'Ram Shrestha',
//               avatar: 'https://placeholder.com/40',
//               rating: 3,
//               content:
//                 'COVID-19 affects different people in different ways. Most infected people will develop mild to different ways. Most infected people will develop mild to',
//               timeAgo: '4 min.',
//             },
//             {
//               id: '2',
//               author: 'Hari Sharma',
//               avatar: 'https://placeholder.com/40',
//               rating: 4,
//               content:
//                 'COVID-19 affects different people in different ways. Most infected people will develop mild to different ways. Most infected people will develop mild to',
//               timeAgo: '4 min.',
//             },
//             {
//               id: '3',
//               author: 'Hari Sharma',
//               avatar: 'https://placeholder.com/40',
//               rating: 2,
//               content:
//                 'COVID-19 affects different people in different ways. Most infected people will develop mild to different ways. Most infected people will develop mild to',
//               timeAgo: '4 min.',
//             },
//           ],
//         },
//       },
//       {
//         id: '2',
//         category: 'Hospital',
//         name: 'College of Applied Medical Sciences',
//         location: 'Gangahity, Chabahil, Kathmandu 44600',
//         distance: '2.5 km away',
//         hours: '24/7',
//         rating: '4.8',
//         ratingContainer: {
//           rating: '3.1',
//           ratingCount: 13,
//           reviews: [
//             {
//               id: '1',
//               author: 'Ram Shrestha',
//               avatar: 'https://placeholder.com/40',
//               rating: 3,
//               content:
//                 'COVID-19 affects different people in different ways. Most infected people will develop mild to different ways. Most infected people will develop mild to',
//               timeAgo: '4 min.',
//             },
//             {
//               id: '2',
//               author: 'Hari Sharma',
//               avatar: 'https://placeholder.com/40',
//               rating: 4,
//               content:
//                 'COVID-19 affects different people in different ways. Most infected people will develop mild to different ways. Most infected people will develop mild to',
//               timeAgo: '4 min.',
//             },
//             {
//               id: '3',
//               author: 'Hari Sharma',
//               avatar: 'https://placeholder.com/40',
//               rating: 2,
//               content:
//                 'COVID-19 affects different people in different ways. Most infected people will develop mild to different ways. Most infected people will develop mild to',
//               timeAgo: '4 min.',
//             },
//           ],
//         },
//       },
//     ],
//   },
// ];
