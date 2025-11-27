import {createContext, useContext, useEffect, useState} from 'react';
import {Platform} from 'react-native';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
interface PermissionContextType {
  checkLocationPermission: () => boolean;
  hasLocationPermission: boolean;
  tabBarHidden: boolean;
  handleTabBar: (state: boolean) => void;
}

const defaultContext: PermissionContextType = {
  checkLocationPermission: () => false,
  hasLocationPermission: false,
  tabBarHidden: false,
  handleTabBar: (state: boolean) => {},
};

const PermissionContext = createContext(defaultContext);

export default function PermissionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [tabBarHidden, setTabBarHidden] = useState(false);
  console.log('HasPermission?????????', hasLocationPermission);
  useEffect(() => {
    checkLocationPermission();
  }, []);
  const handleTabBar = (state: boolean) => {
    console.log('State!!', state);
    setTabBarHidden(state);
  };

  async function checkLocationPermission() {
    try {
      let permission;

      if (Platform.OS === 'android') {
        permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
      } else {
        permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
      }

      let permissionStatus = await check(permission);
      console.log('PermissionStatus', permissionStatus);
      if (permissionStatus === RESULTS.GRANTED) {
        console.log('GotPermission');
        setHasLocationPermission(true);
        return true;
      } else {
        console.log('NoPermission');
      }

      if (
        permissionStatus === RESULTS.DENIED ||
        permissionStatus === RESULTS.BLOCKED
      ) {
        permissionStatus = await request(permission);
        if (permissionStatus === RESULTS.GRANTED) {
          setHasLocationPermission(true);
        } else {
          setHasLocationPermission(false);
        }
        return permissionStatus === RESULTS.GRANTED;
      }

      return false;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  }
  return (
    <PermissionContext.Provider
      value={{
        hasLocationPermission,
        checkLocationPermission,
        handleTabBar,
        tabBarHidden,
      }}>
      {children}
    </PermissionContext.Provider>
  );
}

export const usePermissionContext = () => useContext(PermissionContext);
