import {
  Button,
  Icon,
  IconButton,
  MD3Theme,
  Portal,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import {VectorIcon} from '../Icons';
import {
  Alert,
  Dimensions,
  Image,
  Linking,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {FlatList} from 'react-native-gesture-handler';
import {useCallback, useRef, useState} from 'react';
import {useDispatch} from 'react-redux';
import {toggleFavouriteBusiness} from '@redux/features/businesses/businessesSlice';
import {useAppSelector} from '@hooks/rtkHooks';
import {showToast} from '@helpers';
import LottieSpinner from '../LottieSpinner';
import {EmptyContent} from '../EmptyContent';
import CustomActionSheet from './CustomActionSheet';

const {width} = Dimensions.get('screen');
const keyExtractor = (item: string, index: number) => `${index}${item?.id}`;
export default function OverviewSection({
  businessData,
  isLoading,
  isError,
}: any) {
  console.log('isLoading', isLoading);
  const theme = useTheme();
  const dispatch = useDispatch();
  const {favouriteBusiness} = useAppSelector(state => state.businesses);
  const images = [
    {
      id: '1',
      uri: 'https://cdn.photographylife.com/wp-content/uploads/2014/09/Nikon-D750-Image-Samples-2.jpg',
    },
    {
      id: '2',
      uri: 'https://cdn.photographylife.com/wp-content/uploads/2014/09/Nikon-D750-Image-Samples-2.jpg',
    },
    {
      id: '3',
      uri: 'https://cdn.photographylife.com/wp-content/uploads/2014/09/Nikon-D750-Image-Samples-2.jpg',
    },
  ];

  const renderImage = ({item}) => (
    <Image
      source={{uri: item?.uri ?? item}}
      style={styles.image}
      resizeMode="cover"
    />
  );
  const renderSeparator = useCallback(
    () => <View style={styles.separator} />,
    [],
  );

  const handleAddFavourite = () => {
    dispatch(toggleFavouriteBusiness(businessData));
    setTimeout(() => {
      favouriteBusiness.some(item => item._id === businessData?._id)
        ? showToast({
            message: 'Business removed to favourites',
            position: 'Top',
          })
        : showToast({message: 'Business added to favourites', position: 'Top'});
    }, 500);
  };

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
  const {height} = useWindowDimensions();

  const [isVisible, setIsVisible] = useState(false);
  const [actionType, setActionType] = useState<
    'call' | 'website' | 'map' | 'email'
  >();
  const [actionData, setActionData] = useState({});
  console.log('IsVisible', isVisible);
  console.log('actionType', actionType);
  console.log('actionData', actionData);

  const showActionSheet = (
    type: 'call' | 'website' | 'map' | 'email',
    data: any,
  ) => {
    setActionType(type);
    setActionData(data);
    setIsVisible(true);
    handlePresentModalPress();
  };

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  console.log('Item!!', businessData);
  return (
    <BottomSheetScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      {isLoading ? (
        <View style={{height: height * 0.7}}>
          <LottieSpinner />
        </View>
      ) : isError ? (
        <EmptyContent />
      ) : (
        <View style={styles.content}>
          <Text variant="titleLarge" style={styles.collegeName}>
            {businessData?.name}
          </Text>

          <View style={styles.infoRow}>
            <Icon source="map-marker" size={20} color={theme.colors.primary} />
            <Text variant="bodyMedium">
              {businessData?.location?.formattedAddress ?? 'N/A'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Icon
              source="map-marker-distance"
              size={20}
              color={theme.colors.primary}
            />
            <Text variant="bodyMedium">{businessData?.distance ?? 'N/A'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon
              source="clock-outline"
              size={20}
              color={theme.colors.primary}
            />
            <Text variant="bodyMedium">
              {businessData?.openingHours ?? 'N/A'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Icon source="phone" size={20} color={theme.colors.primary} />
            <Text variant="bodyMedium">{businessData?.contact ?? 'N/A'}</Text>
          </View>

          <View style={styles.actionButtons}>
            <View style={styles.touchableWrapper}>
              <TouchableRipple
                style={styles.buttonWrapper}
                borderless={true}
                onPress={() =>
                  showActionSheet('call', {
                    call: `${businessData?.contact}`,
                  })
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
                  showActionSheet('website', {
                    website: `${businessData?.website}`,
                  })
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
                    map: `${businessData?.location?.coordinates}`,
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
            <View style={styles.touchableWrapper}>
              <TouchableRipple
                style={styles.buttonWrapper}
                borderless={true}
                onPress={() =>
                  showActionSheet('email', {
                    map: `${businessData?.email ?? 'example@gmail.com'}`,
                  })
                }>
                <>
                  <VectorIcon
                    type={'materialCommunity'}
                    name="email"
                    mode="outlined"
                    size={18}
                  />
                  <Text style={styles.buttonText}>Email</Text>
                </>
              </TouchableRipple>
            </View>
          </View>

          {businessData?.photos ? (
            <View style={styles.imageListContainer}>
              <FlatList
                data={businessData?.photos}
                horizontal={true}
                renderItem={renderImage}
                ItemSeparatorComponent={renderSeparator}
                keyExtractor={keyExtractor}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.imageList}
              />
            </View>
          ) : (
            <View style={styles.imageListContainer}>
              <FlatList
                data={images}
                horizontal={true}
                renderItem={renderImage}
                ItemSeparatorComponent={renderSeparator}
                keyExtractor={keyExtractor}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.imageList}
              />
            </View>
          )}

          <View style={styles.socialLinks}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Social Links
            </Text>
            <View style={styles.socialButtons}>
              <IconButton icon="facebook" mode="outlined" onPress={() => {}} />
              <IconButton icon="instagram" mode="outlined" onPress={() => {}} />
              <IconButton icon="twitter" mode="outlined" onPress={() => {}} />
            </View>
          </View>
          <Button
            mode="contained"
            icon={
              favouriteBusiness.some(item => item._id === businessData?._id)
                ? 'heart'
                : 'heart-outline'
            }
            onPress={handleAddFavourite}
            style={styles.favoriteButton}>
            {favouriteBusiness.some(item => item._id === businessData?._id)
              ? 'Added to Favourites'
              : 'Add to Favourites'}
          </Button>

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
        </View>
      )}
    </BottomSheetScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  content: {
    padding: 18,
  },
  collegeName: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  touchableWrapper: {
    borderColor: '#E0E0E0',
    borderRadius: 18,
    borderWidth: 1,
  },
  buttonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 18,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTitle: {
    fontWeight: 'bold',
  },
  imageListContainer: {
    marginHorizontal: -18, // Negative margin to allow full-width scrolling
  },
  imageList: {
    gap: 8,
    paddingHorizontal: 16,
  },
  image: {
    width: width / 2,
    height: width / 2,
    borderRadius: 8,
  },
  socialLinks: {
    marginTop: 8,
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  favoriteButton: {
    marginTop: 16,
  },
});
