import {
  Button,
  Card,
  Icon,
  IconButton,
  MD3Theme,
  Paragraph,
  Text,
  Title,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import {VectorIcon} from '../Icons';
import {Dimensions, Image, Linking, StyleSheet, View} from 'react-native';
import {BottomSheetFlatList, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {useThemedStyles} from '@hooks/useThemedStyles';
import {FlatList} from 'react-native-gesture-handler';
import {useCallback} from 'react';
import LottieSpinner from '../LottieSpinner';
import {EmptyContent} from '../EmptyContent';

const {height, width} = Dimensions.get('screen');
const TAB_WIDTH = width / 3.5;
export default function DetailSection({businessData, isLoading, isError}: any) {
  console.log('BusinessDATA', businessData);
  const theme = useTheme();
  const styles = useThemedStyles(themedStyles);
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
  const keyExtractor = (item: string, index: number) => `${index}${item?._id}`;
  const renderImage = ({item}) => (
    <Image source={{uri: item.uri}} style={styles.image} resizeMode="cover" />
  );
  const renderSeparator = useCallback(
    () => <View style={styles.separator} />,
    [],
  );

  const renderItem = ({item}: {item: Service}) => (
    <View style={styles.serviceItem}>
      <Text style={styles.serviceName}>{item.name}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.charges}>
        Charges: ${item.charges.toLocaleString()}
      </Text>
    </View>
  );

  return (
    <BottomSheetScrollView style={styles.scene}>
      {isLoading ? (
        <View style={{height: height * 0.7}}>
          <LottieSpinner />
        </View>
      ) : isError ? (
        <EmptyContent />
      ) : (
        <>
          <View style={{paddingHorizontal: 16}}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Services
            </Text>
            <FlatList
              data={businessData?.services}
              renderItem={renderItem}
              keyExtractor={item => item._id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          </View>
          <View style={{paddingHorizontal: 16}}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Description
            </Text>
            <Text variant="bodyMedium">{businessData?.description}</Text>
          </View>
        </>
      )}
    </BottomSheetScrollView>
  );
}

const themedStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    imageListContainer: {
      marginTop: 8,
    },
    listContent: {},
    serviceItem: {
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
    },
    serviceName: {
      ...theme.fonts.titleMedium,
      fontWeight: 'bold',
      color: theme.colors.onBackground,
      marginBottom: 4,
    },
    description: {
      ...theme.fonts.bodyMedium,
      color: theme.colors.outline,
      // marginBottom: 8,
    },
    charges: {
      ...theme.fonts.labelLarge,
      color: theme.colors.primary,
      fontWeight: '500',
    },
    touchableWrapper: {
      borderColor: theme.colors.outline,
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
      ...theme.fonts.labelLarge,
    },
    bottomSheetContent: {
      flex: 1,
      paddingHorizontal: 16,
    },
    tabBar: {
      flexDirection: 'row',
      position: 'relative',
    },
    tab: {
      width: TAB_WIDTH,
      // flex: 1,
      // paddingHorizontal: 16,
      alignItems: 'center',
      paddingVertical: 10,
    },
    tabText: {
      ...theme.fonts.labelLarge,

      color: theme.colors.outline,
    },
    activeTabText: {
      ...theme.fonts.labelLarge,
      color: theme.colors.primary,
    },
    indicator: {
      position: 'absolute',
      bottom: 0,
      height: 3,
      width: TAB_WIDTH, // Adjust based on the tab width
      justifyContent: 'center',
      alignItems: 'center',
      // backgroundColor: theme.colors.primary,
    },
    contentContainer: {
      marginTop: 16,
      flex: 1,
      backgroundColor: theme.colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      fontSize: 18,
      color: '#212529',
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
      paddingHorizontal: 16,
    },
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 16,
      paddingHorizontal: 16,
    },
    sectionTitle: {
      marginTop: 16,
      marginBottom: 8,
      fontWeight: 'bold',
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
      flexDirection: 'row',
      gap: 8,
      marginTop: 8,
      paddingHorizontal: 16,
    },
    favoriteButton: {
      marginTop: 16,
      marginHorizontal: 18,
    },

    tabLabel: {
      fontSize: 14,
      fontWeight: 'bold',
      textTransform: 'none',
    },
    scene: {
      flex: 1,
      backgroundColor: theme.colors.background,
      // paddingHorizontal: 16,
      // backgroundColor: 'red',
    },
    infoSection: {
      padding: 16,
      elevation: 0,
    },
    tabView: {
      flex: 1,
    },
    dropdown: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 12,
      backgroundColor: '#2E2E2E', // Dark theme background
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#444',
    },
    dropdownText: {
      fontSize: 16,
      color: '#FFFFFF',
    },
    dropdownIcon: {
      fontSize: 16,
      color: '#AAAAAA',
    },
    bottomSheetBackground: {
      // backgroundColor: 'red',
    },
    handleIndicator: {
      backgroundColor: '#666',
      width: 40,
      height: 4,
      borderRadius: 2,
      alignSelf: 'center',
    },

    item: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
      paddingHorizontal: 16,
    },
    selectedItem: {
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: 4,
    },
    itemText: {
      fontSize: 16,
      color: '#FFFFFF',
    },
    selectedItemText: {
      fontWeight: 'bold',
    },
    checkmark: {
      fontSize: 16,
    },
  });

//   <View style={{paddingHorizontal: 16, marginTop: 18}}>
//   <Text variant="titleLarge" style={styles.collegeName}>
//     {businessData?.name}
//   </Text>
// </View>

// <View style={styles.infoRow}>
//   <Icon source="map-marker" size={20} color={theme.colors.primary} />
//   <Text variant="bodyMedium">
//     {businessData?.location?.formattedAddress}
//   </Text>
// </View>

// <View style={styles.infoRow}>
//   <Icon
//     source="map-marker-distance"
//     size={20}
//     color={theme.colors.primary}
//   />
//   <Text variant="bodyMedium">
//     {businessData?.distance ?? 3.4} km away
//   </Text>
// </View>

// <View style={styles.infoRow}>
//   <Icon
//     source="clock-outline"
//     size={20}
//     color={theme.colors.primary}
//   />
//   <Text variant="bodyMedium">{businessData?.openingHours}</Text>
// </View>

// <View style={styles.infoRow}>
//   <Icon source="phone" size={20} color={theme.colors.primary} />
//   <Text variant="bodyMedium">9841574348</Text>
// </View>

// <View style={styles.imageListContainer}>
//   <FlatList
//     data={images}
//     horizontal={true}
//     renderItem={renderImage}
//     ItemSeparatorComponent={renderSeparator}
//     keyExtractor={keyExtractor}
//     showsHorizontalScrollIndicator={false}
//     contentContainerStyle={styles.imageList}
//   />
// </View>
