import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';

export function getCurrentLocation(
  throwError = true,
): Promise<GeolocationResponse | undefined> {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      response => resolve(response),
      error => (throwError ? reject(error) : resolve(undefined)),
      {
        timeout: 60000, // in milliseconds
      },
    );
  });
}
