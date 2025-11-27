import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthScreen, LoginScreen, RegisterScreen} from '@screens/auth';
import {SCREEN} from '@constants/enum';

export type AuthStackParams = {
  AuthScreen: undefined;
  Loginscreen: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParams>();

export default function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Group>
        <Stack.Screen name={SCREEN.LOGIN} component={LoginScreen} />
        <Stack.Screen name={SCREEN.REGISTER} component={RegisterScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}
