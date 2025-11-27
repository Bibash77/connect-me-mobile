import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  SavedCategoriesScreen,
  SavedItemsScreen,
} from '@screens/home/SavedScreen';

export type SavedStackParamList = {
  SavedCategories: undefined;
  SavedItems: {category: string};
};

const Stack = createNativeStackNavigator<SavedStackParamList>();

export default function SavedStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="SavedItems" component={SavedItemsScreen} />
      <Stack.Screen name="SavedCategories" component={SavedCategoriesScreen} />
    </Stack.Navigator>
  );
}
