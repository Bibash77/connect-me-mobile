import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {
  MD3Theme,
  Portal,
  Searchbar,
  Surface,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import {SCREEN} from '@constants/enum';
import {VectorIcon} from '@components';
import {useAppSelector} from '@hooks/rtkHooks';
import {usePermissionContext} from '@hooks/PermissionContext';
import {ChevronRight, Clock} from 'lucide-react-native';

export function SearchBar({navigation}) {
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();
  const styles = themedStyles(theme);
  const {handleTabBar} = usePermissionContext();
  const {favouriteBusiness, searchHistory} = useAppSelector(
    state => state.businesses,
  );
  const [isSearchActive, setIsSearchActive] = useState(false);

  const handleNavigate = (query: string) => {
    if (query.trim()) {
      navigation.navigate(SCREEN.LIST, {
        searchValue: query.trim(),
      });
    }
  };

  useEffect(() => {
    if (isSearchActive) {
      handleTabBar(true);
    } else {
      handleTabBar(false);
    }
  }, [isSearchActive]);

  const renderItem = ({item}: {item: Cafe}) => (
    <TouchableRipple
      onPress={() => {
        handleNavigate(
          item?.matched === true ? item?.searchedText : item?.name,
        ),
          setIsSearchActive(false);
        handleTabBar(true);
      }}>
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
    </TouchableRipple>
  );
  return (
    <View style={{flex: 1}}>
      <Searchbar
        placeholder="Search here"
        placeholderTextColor={theme.colors.outline}
        onChangeText={setSearchQuery}
        value={searchQuery}
        elevation={2}
        style={styles.searchBar}
        onFocus={() => {
          handleTabBar(true);
          setIsSearchActive(true);
        }}
        iconColor={theme.colors.outline}
        onSubmitEditing={() => {
          if (searchQuery.trim()) {
            handleNavigate(searchQuery);
            // navigation.navigate(SCREEN.LIST, {
            //   searchValue: searchQuery.trim(),
            // });
          }
        }}
      />
      {isSearchActive && (
        <Portal>
          <View
            style={{
              flex: 1,
              ...StyleSheet.absoluteFillObject,
              backgroundColor: 'red',
              zIndex: 2,
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
                iconColor={theme.colors.outline}
                onIconPress={() => {
                  handleTabBar(true);
                  setIsSearchActive(false);
                }}
                autoFocus
                onSubmitEditing={() => {
                  console.log('cool');
                  if (searchQuery.trim()) {
                    setIsSearchActive(false);
                    handleTabBar(true);
                    handleNavigate(searchQuery);
                    // navigation.navigate(SCREEN.LIST, {
                    //   searchValue: searchQuery.trim(),
                    // });
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
        </Portal>
      )}
    </View>
  );
}

const themedStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F8F9FA',
      overflow: 'hidden',
    },
    header: {
      // marginBottom: 24,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      // justifyContent: 'space-between',
    },
    headerText2: {
      ...theme.fonts.headlineMedium,
      fontWeight: 'bold',
    },
    headerSubtext: {
      ...theme.fonts.labelLarge,
      color: theme.colors.onSurfaceVariant,
    },
    searchBar: {
      marginHorizontal: 16,
      marginBottom: 16,
      backgroundColor: theme.colors.onPrimary,
    },
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
  });
