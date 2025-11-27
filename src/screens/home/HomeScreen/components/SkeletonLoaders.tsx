import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {Dimensions, View} from 'react-native';
const {width, height} = Dimensions.get('window');
export const CategorySkeletonLoader = () => (
  <SkeletonPlaceholder
    backgroundColor={'rgb(229, 224, 236)'}
    highlightColor={'rgb(255, 251, 255)'}>
    <View
      style={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        // padding: 10,
        gap: 10,
        backgroundColor: '#fff',
      }}>
      <View
        style={{
          //   height: 20,
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 8,
        }}>
        <View
          style={{width: width / 3.4, height: width * 0.22, borderRadius: 10}}
        />

        <View
          style={{width: width / 3.4, height: width * 0.22, borderRadius: 10}}
        />
        <View
          style={{width: width / 3.4, height: width * 0.22, borderRadius: 10}}
        />
      </View>
    </View>
  </SkeletonPlaceholder>
);

export const CardSkeletonLoader = () => (
  <SkeletonPlaceholder
    backgroundColor={'rgb(229, 224, 236)'}
    highlightColor={'rgb(255, 251, 255)'}>
    <View
      style={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        // padding: 10,
        gap: 10,
        backgroundColor: '#fff',
      }}>
      <View
        style={{
          //   height: 20,
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 8,
        }}>
        <View
          style={{width: width * 0.7, height: width * 0.5, borderRadius: 10}}
        />

        <View
          style={{width: width * 0.2, height: width * 0.5, borderRadius: 10}}
        />
      </View>
    </View>
  </SkeletonPlaceholder>
);
