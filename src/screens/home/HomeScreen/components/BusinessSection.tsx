import React, {useCallback, useRef, useState} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {
  Card,
  MD3Theme,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import {DetailBottomSheet, VectorIcon} from '@components';
import {CardSkeletonLoader} from './SkeletonLoaders';
import {BusinessCard} from './BusinessCard';
import BottomSheet from '@gorhom/bottom-sheet';
import {baseApi} from '@redux/baseApi';
import {useLazyGetOverviewDetailQuery} from '@redux/features/businesses/businessService';

export function BusinessSection({
  title,
  businesses,
  isLoading,
  onViewAll,
}: any) {
  const theme = useTheme();
  const styles = themedStyles(theme);
  const [getOverviewDetail, {isError}] = useLazyGetOverviewDetailQuery();
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

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableRipple onPress={onViewAll} style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View all</Text>
        </TouchableRipple>
      </View>
      {isLoading ? (
        <CardSkeletonLoader />
      ) : (
        <FlatList
          data={businesses}
          renderItem={({item}) => (
            <BusinessCard business={item} onPress={handleModalOpen} />
          )}
          keyExtractor={item => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.businessList}
        />
      )}

      <DetailBottomSheet
        bottomSheetRef={bottomSheetRef}
        businessDataState={businessDataState}
        networkCallStatus={networkCallStatus}
        selectedBusiness={selectedBusiness}
        isError={isError}
      />
    </View>
  );
}

const themedStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    section: {
      marginBottom: 16,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      marginBottom: 8,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '800',
    },
    viewAllButton: {
      borderColor: theme.colors.primary,
      borderWidth: 1,
      borderRadius: 4,
      paddingHorizontal: 12,
      paddingVertical: 4,
    },
    viewAllText: {
      ...theme.fonts.labelLarge,
      color: theme.colors.primary,
    },
    businessList: {
      gap: 12,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
  });
