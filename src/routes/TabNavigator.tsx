import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import {View, Text, Pressable, StyleSheet, Dimensions} from 'react-native';
import {
  Home,
  Heart,
  Search,
  Menu,
  CircleEllipsis,
  LayoutDashboard,
  Ellipsis,
} from 'lucide-react-native';
import {HomeScreen} from '@screens/home/HomeScreen';
import {SavedScreen} from '@screens/home/SavedScreen';
import {SearchScreen} from '@screens/home/SearchScreen';
import {ListsScreen} from '@screens/home/ListScreen';
import {PrimarySafeArea} from '@components';
import SavedStackNavigator from './SavedStackNavigator';
import {SCREEN} from '@constants/enum';
import {usePermissionContext} from '@hooks/PermissionContext';
import {MoreScreen} from '@screens/home/MoreScreen';

const Tab = createBottomTabNavigator();
const {width} = Dimensions.get('window');
const TAB_WIDTH = width / 4;

const CustomTabBar = ({state, descriptors, navigation, tabBarHidden}) => {
  console.log('tabBarHidden', tabBarHidden);
  const indicatorPosition = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(state.index * TAB_WIDTH + TAB_WIDTH * 0.25, {
            damping: 15,
            stiffness: 180,
          }),
        },
      ],
    };
  });
  // if (focusedOptions.tabBarVisible === false) {
  //   return null;
  // }
  return (
    <View style={[styles.tabBar, {display: tabBarHidden ? 'none' : 'flex'}]}>
      <Animated.View style={[styles.indicator, indicatorPosition]} />
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const iconStyle = useAnimatedStyle(() => {
          const scale = withSpring(isFocused ? 1.1 : 1);
          const color = interpolate(scale, [1, 1.1], [0.5, 1]);

          return {
            transform: [{scale}],
            opacity: color,
          };
        });

        return (
          <Pressable key={route.key} onPress={onPress} style={styles.tab}>
            <Animated.View style={iconStyle}>
              {getIcon(route.name, isFocused)}
            </Animated.View>
            <Animated.Text
              style={[
                styles.label,
                iconStyle,
                {color: isFocused ? '#6C5CE7' : '#999999'},
              ]}>
              {route.name}
            </Animated.Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const getIcon = (routeName: string, isFocused: boolean) => {
  const color = isFocused ? '#6C5CE7' : '#999999';
  const size = 24;

  switch (routeName) {
    case 'Home':
      return <Home size={size} color={color} />;
    case 'Favourites':
      return (
        <Heart size={size} color={color} fill={isFocused ? color : '#FFFFFF'} />
      );
    case 'Explore':
      return <LayoutDashboard size={size} color={color} />;
    case 'More':
      return <Ellipsis size={size} color={color} />;
    default:
      return null;
  }
};

export default function TabNavigator() {
  const {tabBarHidden} = usePermissionContext();
  return (
    <PrimarySafeArea>
      <Tab.Navigator
        tabBar={props => (
          <CustomTabBar {...props} tabBarHidden={tabBarHidden} />
        )}
        screenOptions={{
          headerShown: false,
        }}>
        <Tab.Screen name={SCREEN.HOME} component={HomeScreen} />
        <Tab.Screen name={SCREEN.SAVED} component={SavedStackNavigator} />
        <Tab.Screen name={SCREEN.LIST} component={ListsScreen} />
        <Tab.Screen name={SCREEN.MORE} component={MoreScreen} />
      </Tab.Navigator>
    </PrimarySafeArea>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    // height: 180,
    // paddingBottom: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  indicator: {
    position: 'absolute',
    top: 0,
    width: TAB_WIDTH * 0.5,
    height: 3,
    backgroundColor: '#6C5CE7',
    borderRadius: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
});
