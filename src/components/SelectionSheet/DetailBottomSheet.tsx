import React, {useCallback, useMemo, useRef, useState} from 'react';
import {View, StyleSheet, Dimensions, Animated} from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  useBottomSheetSpringConfigs,
} from '@gorhom/bottom-sheet';
import {MD3Theme, Portal, Text, useTheme} from 'react-native-paper';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import OverviewSection from './OverviewSection';
import RatingReviews from './RatingReview';
import DetailSection from './DetailsSection';
import {useThemedStyles} from '@hooks/useThemedStyles';

const {width} = Dimensions.get('screen');
const TAB_WIDTH = width / 3;

interface DetailBottomSheetProps {
  bottomSheetRef: any;
  businessDataState: any;
  selectedBusiness: any;
  networkCallStatus: boolean;
  isError: boolean;
}

const DetailBottomSheet: React.FC<DetailBottomSheetProps> = ({
  bottomSheetRef,
  businessDataState,
  networkCallStatus,
  selectedBusiness,
  isError,
}) => {
  const theme = useTheme();
  const styles = useThemedStyles(themedStyles);
  const snapPoints = useMemo(() => ['80%'], []);
  const [activeTab, setActiveTab] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  const handleTabPress = useCallback(
    (index: number) => {
      setActiveTab(index);
      Animated.spring(translateX, {
        toValue: index * TAB_WIDTH,
        useNativeDriver: true,
      }).start();
    },
    [translateX],
  );

  const renderContent = useCallback(() => {
    switch (activeTab) {
      case 0:
        return (
          <OverviewSection
            businessData={businessDataState}
            isLoading={networkCallStatus}
            isError={isError}
          />
        );
      case 1:
        return <RatingReviews businessData={selectedBusiness?._id} />;
      case 2:
        return (
          <DetailSection
            businessData={businessDataState}
            isLoading={networkCallStatus}
            isError={isError}
          />
        );
      default:
        return null;
    }
  }, [activeTab, networkCallStatus, businessDataState]);

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

  const animationConfigs = useBottomSheetSpringConfigs({
    damping: 80,
    overshootClamping: true,
    restDisplacementThreshold: 0.1,
    restSpeedThreshold: 0.1,
    stiffness: 500,
  });

  const tabs = ['Overview', 'Rating & Review', 'Services'];
  const renderTab = ({item, index}: any) => (
    <TouchableOpacity style={styles.tab} onPress={() => handleTabPress(index)}>
      <Text
        style={[styles.tabText, activeTab === index && styles.activeTabText]}>
        {item}
      </Text>
    </TouchableOpacity>
  );
  return (
    <Portal>
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
          <FlatList
            data={tabs}
            renderItem={renderTab}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
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
    </Portal>
  );
};

const themedStyles = (theme: MD3Theme) =>
  StyleSheet.create({
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
      ...theme.fonts.labelLarge,
      color: theme.colors.outline,
    },
    activeTabText: {
      color: theme.colors.primary,
      fontWeight: 'bold',
    },
    indicator: {
      position: 'absolute',
      bottom: 0,
      height: 3,
      width: TAB_WIDTH,
      justifyContent: 'center',
      alignItems: 'center',
    },
    contentContainer: {
      flex: 1,
      backgroundColor: 'white',
    },
  });

export default DetailBottomSheet;
