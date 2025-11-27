import {useState, useCallback} from 'react';
import {getCurrentLocation} from '@helpers';
import {usePermissionContext} from '@hooks/PermissionContext';

export function useLocation() {
  const [location, setLocation] = useState(null);
  const {hasLocationPermission, checkLocationPermission} =
    usePermissionContext();

  const fetchLocation = useCallback(async () => {
    try {
      if (hasLocationPermission) {
        const currentLocation = await getCurrentLocation();
        if (currentLocation?.coords) {
          setLocation({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
          });
        }
      } else {
        const getPermission = await checkLocationPermission();
        if (getPermission) {
          const currentLocation = await getCurrentLocation();
          if (currentLocation?.coords) {
            setLocation({
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
            });
          }
        } else {
          setLocation({
            latitude: 40.73061,
            longitude: -74.006,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching location:', error);
      setLocation({
        latitude: 40.73061,
        longitude: -74.006,
      });
    }
  }, [hasLocationPermission, checkLocationPermission]);

  return {location, fetchLocation};
}
