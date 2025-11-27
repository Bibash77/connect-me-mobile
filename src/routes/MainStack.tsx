import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  BusinessHotScreen,
  BusinessNearScreen,
  HomeScreen,
} from '@screens/home/HomeScreen';
import TabNavigator from './TabNavigator';
import {SCREEN} from '@constants/enum';
import {ProfileScreen} from '@screens/home/MoreScreen';

type MainStackParams = {
  Home: undefined;
  MainTabs: undefined;
};

const Stack = createNativeStackNavigator<MainStackParams>();

export default function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={SCREEN.MAINTABS} component={TabNavigator} />
      <Stack.Screen
        name={SCREEN.BUSINESSNEARLIST}
        component={BusinessNearScreen}
      />
      <Stack.Screen
        name={SCREEN.BUSINESSHOTLIST}
        component={BusinessHotScreen}
      />
      <Stack.Screen name={SCREEN.PROFILESCREEN} component={ProfileScreen} />
    </Stack.Navigator>
  );
}
