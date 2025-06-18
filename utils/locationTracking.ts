import * as Location from 'expo-location';
import { fetcher } from './fetcher';
import { API_URLS } from '@/config/api';
import { getUserId } from './storage';

let locationSubscription: Location.LocationSubscription | null = null;

export const startLocationUpdates = async () => {
  try {
    // Check if we already have a subscription
    if (locationSubscription) {
      await stopLocationUpdates();
    }

    // Start location updates
    locationSubscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 30000, // Update every 30 seconds
        distanceInterval: 10, // Update every 10 meters
      },
      async (location) => {
        try {
          const userId = await getUserId();
          if (!userId) return;

          await updateUserLocation(userId, {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            timestamp: new Date().toISOString()
          });
        } catch (error) {
          console.error('Error updating location:', error);
        }
      }
    );
  } catch (error) {
    console.error('Error starting location updates:', error);
  }
};

export const stopLocationUpdates = async () => {
  if (locationSubscription) {
    locationSubscription.remove();
    locationSubscription = null;
  }
};

const updateUserLocation = async (userId: any, location: {
  latitude: number;
  longitude: number;
  timestamp: string;
}) => {
  try {
    await fetcher(API_URLS.family.memberLocation(userId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(location)
    });
  } catch (error) {
    console.error('Error updating user location:', error);
  }
};
