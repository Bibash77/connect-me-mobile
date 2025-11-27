import {StatusBar} from 'react-native';
import {DefaultTheme, PaperProvider} from 'react-native-paper';
import {ThemeProp} from 'react-native-paper/lib/typescript/types';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';

// import AuthHandler from '@hooks/AuthHandler';
import {darkTheme, lightTheme} from '@themes';

import {useState} from 'react';
import MainStack from './MainStack';
import AuthStack from './AuthStack';
import {useAppSelector} from '@hooks/rtkHooks';
import PermissionProvider, {
  usePermissionContext,
} from '@hooks/PermissionContext';

export default function RootNavController() {
  // const {token } = useAppSelector(state => state.auth);

  const {authlesslogin, isLoggedIn} = useAppSelector(state => state.settings);
  const isDarkMode = false;
  console.log('AUthlessloginStatus', authlesslogin);
  const theme: ThemeProp = {
    ...DefaultTheme,
    dark: isDarkMode,
    roundness: 1,
    colors: isDarkMode ? darkTheme.colors : lightTheme.colors,
  };

  const switchRoute = () => {
    if (!!isLoggedIn || !!authlesslogin) {
      return (
        <PermissionProvider>
          <MainStack />
        </PermissionProvider>
      );
    }

    return <AuthStack />;
  };

  return (
    <PaperProvider theme={theme}>
      <StatusBar
        backgroundColor={theme.colors?.surface}
        // backgroundColor={'#F8F9FA'}
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      {/* <AuthHandler> */}
      <NavigationContainer
        theme={isDarkMode ? NavigationDarkTheme : NavigationDefaultTheme}>
        {switchRoute()}
      </NavigationContainer>
      {/* </AuthHandler> */}
    </PaperProvider>
  );
}
