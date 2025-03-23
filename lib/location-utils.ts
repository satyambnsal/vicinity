import Geolocation from '@react-native-community/geolocation';
import {Alert, Linking, Platform} from 'react-native';
import {calculateDistance} from './index';

interface LocationResult {
  status: 'success' | 'error' | 'permission_denied';
  message?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  distanceInfo?: {
    isNearby: boolean;
    distanceInKm: number;
  };
}

/**
 * Get user's current location and calculate distance from target location
 * @param targetLat Target latitude
 * @param targetLong Target longitude
 * @param proximityThresholdKm Proximity threshold in kilometers
 * @returns Promise with location result
 */
export const getUserLocationAndDistance = (
  targetLat: number,
  targetLong: number,
  proximityThresholdKm: number = 1,
): Promise<LocationResult> => {
  return new Promise(resolve => {
    Geolocation.getCurrentPosition(
      info => {
        const distanceInfo = calculateDistance(
          {
            lat: targetLat,
            long: targetLong,
          },
          {
            lat: info.coords.latitude,
            long: info.coords.longitude,
          },
          proximityThresholdKm,
        );

        resolve({
          status: 'success',
          coordinates: {
            latitude: info.coords.latitude,
            longitude: info.coords.longitude,
          },
          distanceInfo,
        });
      },
      error => {
        if (error.code === error.PERMISSION_DENIED) {
          resolve({
            status: 'permission_denied',
            message:
              'Location permission denied. Please enable location services to verify your presence.',
          });
        } else {
          resolve({
            status: 'error',
            message: `Unable to get your location: ${error.message}`,
          });
        }
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  });
};

/**
 * Prompt user to open app settings to enable location permissions
 */
export const promptOpenSettings = (locationServicesDisabled = false) => {
  const title = locationServicesDisabled
    ? 'Location Services Disabled'
    : 'Location Permission Required';

  const message = locationServicesDisabled
    ? 'Vicinity needs location services to be enabled. Would you like to open system settings to enable location services?'
    : "Vicinity needs location access to verify you're at the venue. Would you like to open settings to enable location permissions?";

  Alert.alert(title, message, [
    {text: 'Cancel', style: 'cancel'},
    {
      text: 'Open Settings',
      onPress: () => {
        if (locationServicesDisabled) {
          if (Platform.OS === 'ios') {
            Linking.openURL('App-Prefs:Privacy&path=LOCATION');
          } else {
            Linking.openSettings();
          }
        } else {
          if (Platform.OS === 'ios') {
            Linking.openURL('app-settings:');
          } else {
            Linking.openSettings();
          }
        }
      },
    },
  ]);
};

/**
 * Request location permission explicitly
 * @returns Promise resolving to boolean indicating if permission was granted
 */
export const requestLocationPermission = (): Promise<{
  granted: boolean;
  locationServicesEnabled: boolean;
}> => {
  return new Promise(resolve => {
    Geolocation.getCurrentPosition(
      () => {
        resolve({granted: true, locationServicesEnabled: true});
      },
      error => {
        if (error.code === error.PERMISSION_DENIED) {
          resolve({granted: false, locationServicesEnabled: true});
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          resolve({granted: false, locationServicesEnabled: false});
        } else {
          resolve({granted: false, locationServicesEnabled: true});
        }
      },
      {enableHighAccuracy: true, timeout: 5000, maximumAge: 10000},
    );
  });
};
