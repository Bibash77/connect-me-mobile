import React, {useCallback, useRef, useState} from 'react';
import {View, StyleSheet, Image, Dimensions} from 'react-native';
import {
  Card,
  MD3Theme,
  Portal,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import {CustomActionSheet, VectorIcon} from '@components';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
const {width} = Dimensions.get('screen');
export function BusinessCard({business, onPress}: any) {
  const theme = useTheme();
  const styles = themedStyles(theme);
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
  return (
    <TouchableRipple
      onPress={() => onPress(business)}
      borderless={true}
      style={[
        styles.ripple,
        {
          backgroundColor: theme.colors.onPrimary,
          elevation: 4,
          paddingHorizontal: 16,
          width: width * 0.8,
          justifyContent: 'space-between',
        },
      ]}>
      <>
        {/* <Card.Content> */}
        <View style={styles.content}>
          <View style={styles.infoContainer}>
            <View style={styles.categoryContainer}>
              <VectorIcon
                type="materialCommunity"
                name={business?.category?.icon ?? 'store'}
                size={16}
                color={theme.colors.primary}
              />
              <Text style={styles.categoryLabel}>
                {business?.category?.name ?? 'Business'}
              </Text>
            </View>
            <Text
              style={styles.businessName}
              numberOfLines={2}
              ellipsizeMode="tail">
              {business?.name}
            </Text>
            <View style={styles.infoRow}>
              <VectorIcon
                type="materialCommunity"
                name="map-marker"
                size={18}
                color={theme.colors.primary}
              />
              <Text
                style={styles.infoText}
                numberOfLines={2}
                ellipsizeMode="tail">
                {business?.location?.formattedAddress ?? 'N/A'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <VectorIcon
                type="materialCommunity"
                name="map-marker-distance"
                size={18}
                color={theme.colors.primary}
              />
              <Text style={styles.infoText}>
                {business?.distance
                  ? `${business.distance.toFixed(2)} km`
                  : 'N/A'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <VectorIcon
                type="materialCommunity"
                name="clock-outline"
                size={18}
                color={theme.colors.primary}
              />
              <Text style={styles.infoText}>{business?.hours ?? 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <VectorIcon
                type="materialCommunity"
                name="star"
                size={18}
                color="#FFD700"
              />
              <Text style={styles.infoText}>{business.rating || 'N/A'}</Text>
            </View>
          </View>
          <Image
            source={{uri: business.photos[0]}}
            style={styles.businessImage}
          />
        </View>
        <View style={styles.actionButtons}>
          <View style={styles.touchableWrapper}>
            <TouchableRipple
              style={styles.buttonWrapper}
              borderless={true}
              onPress={() =>
                showActionSheet('call', {call: `${business?.contact}`})
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
                showActionSheet('website', {website: `${business?.website}`})
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
                  map: `${business?.location?.coordinates}`,
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
        {/* </Card.Content> */}
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
      </>
    </TouchableRipple>
  );
}

const themedStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    businessCard: {
      backgroundColor: theme.colors.error,
      width: width * 0.8,
      borderRadius: 8,
      justifyContent: 'space-between',
    },
    actionButtons: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 8,
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
    ripple: {
      paddingVertical: 16,
      borderRadius: 8,
      //   paddingTop: 16,
      //   paddingVertical: 16,
    },
    content: {
      flexDirection: 'row',
    },
    infoContainer: {
      //   flex: 1,
      width: '60%',
      marginRight: 12,
    },
    categoryContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.primaryContainer,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: 'flex-start',
      marginBottom: 8,
    },
    categoryLabel: {
      ...theme.fonts.labelLarge,
      color: theme.colors.primary,
      marginLeft: 4,
    },
    businessName: {
      ...theme.fonts.titleMedium,
      fontWeight: '600',
      marginBottom: 8,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    infoText: {
      ...theme.fonts.labelLarge,
      color: theme.colors.outline,
      marginLeft: 8,
    },
    businessImage: {
      width: 100,
      height: 100,
      borderRadius: 8,
    },
  });
