import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {getInitials} from '@helpers';
import {useLazyGetRatingListQuery} from '@redux/features/businesses/businessService';
import LottieView from 'lottie-react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, ScrollView, StyleSheet, FlatList, Dimensions} from 'react-native';
import {Avatar, Button, Text, useTheme} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface Review {
  _id: string;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const reviews: Review[] = [];

const RatingStars = ({rating}: {rating: number}) => {
  return (
    <View style={styles.starsContainer}>
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <MaterialCommunityIcons
            key={i}
            name="star"
            size={20}
            color={i < rating ? '#7C3AED' : '#E4E4E7'}
          />
        ))}
    </View>
  );
};

const {width} = Dimensions.get('screen');
export default function RatingReviews({businessData}: any) {
  console.log('RatingDetails', businessData);
  const [getRatingList] = useLazyGetRatingListQuery();
  const theme = useTheme();
  const averageRating = 3.1;
  const totalReviews = 13;

  const [ratingData, setRatingData] = useState([]);
  const [filteredRatingData, setFilteredRatingData] = useState([]);
  const pageRef = useRef(1);
  const [pageLimit, setPageLimit] = useState(4);
  const [networkCallStatus, setNetworkCallStatus] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadMore = () => {
    if (hasMore && !networkCallStatus) {
      pageRef.current = pageRef.current + 1;
      fetchRatingData(pageRef.current);
    }
  };
  const fetchRatingData = useCallback(
    async (pageNumber: number) => {
      if (!hasMore || networkCallStatus) return;
      try {
        setNetworkCallStatus(true);
        const resp = await getRatingList({
          businessId: businessData,
          page: pageNumber,
          limit: pageLimit,
        }).unwrap();
        if (resp?.reviews?.length > 0) {
          setRatingData(prev => [...prev, ...resp.reviews]);
          setFilteredRatingData(prev => [...prev, ...resp.reviews]);
          setHasMore(resp.reviews.length === pageLimit);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setNetworkCallStatus(false);
      }
    },
    [hasMore, networkCallStatus, businessData],
  );
  useEffect(() => {
    if (businessData) {
      fetchRatingData(1);
    }
  }, [businessData]);

  const renderReviews = ({item, index}: {item: Review; index: number}) => (
    <View key={item?._id} style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <Avatar.Text
          size={50}
          label={getInitials(item?.name)}
          style={styles.avatar}
          labelStyle={styles.avatarLabel}
        />
        {/* <Avatar.Image size={40} source={{uri: review.avatar}} /> */}
        <View style={styles.reviewHeaderContent}>
          <View style={styles.authorContainer}>
            <Text style={styles.authorName}>{item?.name}</Text>
          </View>
          <RatingStars rating={item?.rating} />
        </View>
      </View>
      <Text style={styles.reviewContent}>{item?.comment}</Text>
      <Text style={styles.timeAgo}>{item?.createdAt}</Text>
    </View>
  );

  return (
    <BottomSheetScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}>
      {/* Header with overall rating */}
      <View style={styles.header}>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingNumber}>{ratingData?.rating}</Text>
          <RatingStars rating={Math.floor(ratingData?.rating ?? '4')} />
        </View>
        <Text style={styles.reviewCount}>
          {ratingData?.ratingCount ?? '20'} Reviews
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Reviews</Text>

      {/* Reviews list */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <FlatList
          data={ratingData}
          renderItem={renderReviews}
          keyExtractor={item => item?._id}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            filteredRatingData && hasMore ? (
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
      </ScrollView>

      {/* Add review button */}
      <Button
        mode="contained"
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
        onPress={() => {}}>
        Add Rate and Review
      </Button>
    </BottomSheetScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    // padding: 16,
  },
  avatar: {
    elevation: 4,
  },
  avatarLabel: {
    fontSize: 22,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 18,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingNumber: {
    fontSize: 24,
    fontWeight: '500',
    color: '#18181B',
  },
  reviewCount: {
    fontSize: 14,
    color: '#71717A',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#18181B',
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    gap: 16,
  },
  reviewItem: {
    gap: 8,
  },
  reviewHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  reviewHeaderContent: {
    flex: 1,
    gap: 4,
  },
  authorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#18181B',
  },
  reviewContent: {
    fontSize: 14,
    lineHeight: 20,
    color: '#52525B',
  },
  timeAgo: {
    fontSize: 14,
    color: '#71717A',
  },
  button: {
    marginTop: 16,
    backgroundColor: '#7C3AED',
    borderRadius: 8,
  },
  buttonContent: {
    height: 48,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
});
