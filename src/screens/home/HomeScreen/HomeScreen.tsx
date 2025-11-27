import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';

import {SearchBar} from './components';
import {FavoriteCard} from './components';
import {CategorySection} from './components';
import {BusinessSection} from './components';
import {useLocation} from './hooks/useLocation';
import {useBusinessData} from './hooks/useBusinessData';
import {Header} from './components';
import {SCREEN} from '@constants/enum';
import {FocusAwareStatusBar} from '@components';

export default function HomeScreen({navigation}) {
  const theme = useTheme();
  const styles = themedStyles(theme);
  const {location, fetchLocation} = useLocation();
  const {
    topSearchedCategories,
    nearbyBusinesses,
    topBusinesses,
    fetchAllData,
    isLoading,
  } = useBusinessData(location);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
  }, [fetchAllData]);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  useEffect(() => {
    if (location) {
      fetchAllData();
    }
  }, [location, fetchAllData]);

  useFocusEffect(
    useCallback(() => {
      // Handle back button press for search
    }, []),
  );

  const renderItem = useCallback(
    ({item}) => {
      switch (item.type) {
        case 'header':
          return <Header />;
        case 'search':
          return <SearchBar navigation={navigation} />;
        case 'favorite':
          return <FavoriteCard navigation={navigation} />;
        case 'categories':
          return (
            <CategorySection
              categories={topSearchedCategories}
              isLoading={isLoading.categories}
            />
          );
        case 'nearbyBusinesses':
          return (
            <BusinessSection
              title="Businesses near you"
              businesses={nearbyBusinesses}
              isLoading={isLoading.nearby}
              onViewAll={() => navigation.navigate(SCREEN.BUSINESSNEARLIST)}
            />
          );
        case 'topBusinesses':
          return (
            <BusinessSection
              title="Business hot in town"
              businesses={topBusinesses}
              isLoading={isLoading.top}
              onViewAll={() => navigation.navigate(SCREEN.BUSINESSHOTLIST)}
            />
          );
        default:
          return null;
      }
    },
    [
      topSearchedCategories,
      nearbyBusinesses,
      topBusinesses,
      isLoading,
      navigation,
    ],
  );

  const data = [
    {type: 'header', id: 'header'},
    {type: 'search', id: 'search'},
    {type: 'favorite', id: 'favorite'},
    {type: 'categories', id: 'categories'},
    {type: 'nearbyBusinesses', id: 'nearbyBusinesses'},
    {type: 'topBusinesses', id: 'topBusinesses'},
  ];

  return (
    <View style={styles.container}>
      <FocusAwareStatusBar
        backgroundColor={'#F8F9FA'}
        barStyle={'dark-content'}
      />
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </View>
  );
}

const themedStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F8F9FA',
    },
  });
