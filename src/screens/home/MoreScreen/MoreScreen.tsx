import React from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  Linking,
} from 'react-native';
import {
  Divider,
  MD3Theme,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

import {FocusAwareStatusBar, PrimarySafeArea, VectorIcon} from '@components';
import {useThemedStyles} from '@hooks/useThemedStyles';
import {useAppDispatch, useAppSelector} from '@hooks/rtkHooks';
import {SCREEN} from '@constants/enum';
import {setAuthlessLogin, signOut} from '@redux/features/settings';

export default function MoreScreen() {
  const styles = useThemedStyles(themedStyles);
  const theme = useTheme();
  const {isLoggedIn, user} = useAppSelector(state => state.settings);
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const full_name = user?.name;
  const ICONS_DATA = [
    {
      name: 'facebook',
      color: '#1877f2',
      icon: 'facebook',
      url: 'fb://profile/100709726392204',
      fallbackUrl: 'https://www.facebook.com/armedpoliceforcenepal/',
    },
    {
      name: 'twitter',
      color: '#000000',
      icon: 'twitter',
      url: 'twitter://user?screen_name=APF_Nepal',
      fallbackUrl: 'https://x.com/APF_Nepal',
    },
    {
      name: 'youtube',
      color: '#e4405f',
      icon: 'youtube',
      url: 'vnd.youtube://www.youtube.com/@apfaudiovisual',
      fallbackUrl: 'https://www.youtube.com/@apfaudiovisual',
    },
  ];

  const openAppSettings = async () => {
    try {
      await Linking.openSettings();
    } catch (error) {
      console.error('An error occurred while opening app settings:', error);
    }
  };

  const openSocialUrls = async (url: string, fallbackUrl: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        await Linking.openURL(fallbackUrl);
      }
    } catch (error) {
      console.error('An error occurred while opening social urls:', error);
    }
  };

  const logoutHandler = () => {
    if (isLoggedIn) {
      dispatch(signOut());
      navigation.reset({
        index: 0,
        routes: [{name: SCREEN.MAINTABS}],
      });
    }
  };

  const loginHandler = () => {
    dispatch(setAuthlessLogin(false));
    // navigation.navigate(SCREEN.LOGINSCREEN, {
    //   userType: 0,
    // });
  };
  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };
  return (
    <View style={{backgroundColor: theme.colors.background, flex: 1}}>
      <FocusAwareStatusBar
        backgroundColor={'#F8F9FA'}
        barStyle={'dark-content'}
      />
      <View style={styles.backbutton}>
        <TouchableOpacity onPress={handleGoBack}>
          <VectorIcon
            type={'materialCommunity'}
            name={'arrow-left'}
            size={28}
            color={theme.colors.onBackground}
          />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.bodyContainer}>
          <View style={{flex: 1}}>
            <View style={styles.headerContent}>
              <View style={styles.headerFirst}>
                <View>
                  {!isLoggedIn && (
                    <Text
                      variant="headlineLarge"
                      style={{
                        fontWeight: 'bold',
                        letterSpacing: 3,
                        textAlign: 'center',
                      }}>
                      Hi, User
                    </Text>
                  )}
                  <View>
                    <Text
                      variant="titleLarge"
                      style={{
                        fontWeight: 'bold',
                        letterSpacing: 3,
                      }}>
                      {isLoggedIn ? full_name : null}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    backgroundColor: theme.colors.surfaceVariant,
                    paddingHorizontal: 28,
                    paddingVertical: 28,
                    borderRadius: 68,
                  }}>
                  <VectorIcon
                    type={'material'}
                    name="person"
                    size={28}
                    color={theme.colors.onBackground}
                  />
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 16,
                  overflow: 'hidden',
                }}>
                {isLoggedIn ? (
                  <Text variant="labelLarge">
                    {'Logged in with' + ' ' + user?.email}
                  </Text>
                ) : (
                  <Text variant="labelLarge">Login with email</Text>
                )}

                <View
                  style={{
                    backgroundColor: theme.colors.outlineVariant,
                    height: 0.2,
                    flex: 1,
                    marginLeft: 28,
                  }}
                />
              </View>
            </View>

            <View style={styles.innerContent}>
              {isLoggedIn && (
                <>
                  <TouchableRipple
                    onPress={() => navigation.navigate(SCREEN.PROFILESCREEN)}>
                    <View style={styles.innerContentStyle}>
                      <VectorIcon
                        type={'ionicon'}
                        name={'person-circle-outline'}
                        color={theme.colors.onBackground}
                        size={32}
                      />
                      <View style={styles.textContainer}>
                        <Text variant="titleMedium">Profile</Text>
                        <Text style={styles.textSecondaryStyle}>
                          Access your profile settings
                        </Text>
                      </View>
                    </View>
                  </TouchableRipple>
                  <Divider
                    style={{backgroundColor: theme.colors.outlineVariant}}
                    horizontalInset={true}
                  />
                </>
              )}
              <TouchableRipple onPress={openAppSettings}>
                <View style={styles.innerContentStyle}>
                  <VectorIcon
                    type={'ionicon'}
                    name={'settings-outline'}
                    color={theme.colors.onBackground}
                    size={28}
                  />
                  <View style={styles.textContainer}>
                    <Text variant="titleMedium">Settings</Text>
                    <Text style={styles.textSecondaryStyle}>
                      Access app settings
                    </Text>
                  </View>
                </View>
              </TouchableRipple>

              <Divider
                style={{backgroundColor: theme.colors.outlineVariant}}
                horizontalInset={true}
              />
              <TouchableRipple onPress={openAppSettings}>
                <View style={styles.innerContentStyle}>
                  <VectorIcon
                    type={'ionicon'}
                    name={'share-social-outline'}
                    color={theme.colors.onBackground}
                    size={28}
                  />
                  <View style={styles.textContainer}>
                    <Text variant="titleMedium">Invite Friends</Text>
                    <Text style={styles.textSecondaryStyle}>
                      Invite your friends
                    </Text>
                  </View>
                </View>
              </TouchableRipple>

              <Divider
                style={{backgroundColor: theme.colors.outlineVariant}}
                horizontalInset={true}
              />
              <TouchableRipple onPress={openAppSettings}>
                <View style={styles.innerContentStyle}>
                  <VectorIcon
                    type={'ionicon'}
                    name={'information-circle-outline'}
                    color={theme.colors.onBackground}
                    size={28}
                  />
                  <View style={styles.textContainer}>
                    <Text variant="titleMedium">About & FAQs</Text>
                    <Text style={styles.textSecondaryStyle}>
                      Know more about us
                    </Text>
                  </View>
                </View>
              </TouchableRipple>

              <Divider
                style={{backgroundColor: theme.colors.outlineVariant}}
                horizontalInset={true}
              />
            </View>
          </View>

          {isLoggedIn ? (
            <View style={styles.buttonWrapper}>
              <View style={styles.rippleWrapper}>
                <TouchableRipple
                  borderless={true}
                  style={styles.rippleStyle}
                  onPress={() => logoutHandler()}>
                  <View style={styles.authbtnwrapper}>
                    <View style={styles.iconWrapper}>
                      <VectorIcon
                        type={'materialCommunity'}
                        name="logout-variant"
                        size={20}
                        color={theme.colors.onBackground}
                      />
                    </View>
                    <Text variant="titleMedium">Logout</Text>
                  </View>
                </TouchableRipple>
              </View>
            </View>
          ) : (
            <View style={styles.buttonWrapper}>
              <View style={styles.rippleWrapper}>
                <TouchableRipple
                  style={styles.rippleStyle}
                  onPress={() => loginHandler()}>
                  <View style={styles.authbtnwrapper}>
                    <View style={styles.iconWrapper}>
                      <VectorIcon
                        type={'materialCommunity'}
                        name="login-variant"
                        size={20}
                        color={theme.colors.onBackground}
                      />
                    </View>
                    <Text variant="titleMedium">Login</Text>
                  </View>
                </TouchableRipple>
              </View>
            </View>
          )}

          <View style={styles.followbuttons}>
            <Text variant="titleMedium">Follow us</Text>
            <FlatList
              horizontal={true}
              data={ICONS_DATA}
              renderItem={({item}) => (
                <TouchableRipple
                  onPress={() => openSocialUrls(item.url, item.fallbackUrl)}>
                  <View style={{padding: 12}}>
                    {item?.name === 'twitter' ? (
                      <Image
                        source={require('@assets/xlogoblack.png')}
                        style={{height: 36, width: 36, resizeMode: 'contain'}}
                      />
                    ) : (
                      <VectorIcon
                        type={'fontawesome'}
                        name={item.icon}
                        color={item.color}
                        size={32}
                      />
                    )}
                  </View>
                </TouchableRipple>
              )}
              keyExtractor={item => item.name}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const themedStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    background: {
      flexDirection: 'row',
      borderRadius: 25,
      backgroundColor: '#E0E0E0',
      position: 'relative',
      overflow: 'hidden',
      height: 40,
      borderWidth: 2,
      // borderColor: kColors.primaryOne,
      elevation: 5,
    },
    followbuttons: {alignItems: 'center'},
    backbutton: {paddingHorizontal: 16, paddingTop: 18, paddingBottom: 18},
    appVersion: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: 18,
    },
    buttonWrapper: {
      alignItems: 'center',
    },
    rippleWrapper: {
      // backgroundColor: kColors.darkgrey,
      height: 50,
      borderWidth: 0.5,
      // borderColor: kColors.white,
      borderRadius: 10,
    },
    rippleStyle: {
      height: '100%',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
    },
    iconWrapper: {
      // backgroundColor: kColors.white,
      paddingHorizontal: 4,
      paddingVertical: 3,
      borderRadius: 20,
    },
    authbtnwrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginHorizontal: 28,
    },
    option: {
      paddingVertical: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    optionText: {
      color: '#2D2D2D', // Default color for unselected text
      zIndex: 1, // Ensure text is above the animated background
      position: 'absolute', // Position text absolutely within each option
    },
    selectedOptionText: {
      color: '#FFFFFF', // Change to white when selected
    },
    selectedBackground: {
      position: 'absolute',
      height: '100%',
      // backgroundColor: kColors.primaryOne,
      borderRadius: 25,
    },
    textContainer: {
      gap: 8,
    },
    textSecondaryStyle: {
      ...theme.fonts.labelSmall,
      // color: kColors.lightGrey,
    },
    textPrimaryStyle: {
      ...theme.fonts.titleMedium,
      // color: kColors.lightGrey,
      fontWeight: '100',
    },
    container: {
      flex: 1,
    },
    bodyContainer: {
      flex: 1,
      gap: 38,
      justifyContent: 'space-between',
    },
    headerContent: {
      flex: 2,
    },
    headerFirst: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      alignItems: 'center',
      paddingVertical: 28,
    },
    innerContent: {
      flex: 1,
    },
    innerContentStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 16,
      paddingHorizontal: 16,
      gap: 18,
    },
  });
