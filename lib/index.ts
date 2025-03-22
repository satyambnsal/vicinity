export function formatProof(proof: string) {
  const length = proof.length;
  return `${proof.substring(0, 100)}...${proof.substring(
    length - 100,
    length,
  )}`;
}

export interface Location {
  lat: number;
  long: number;
}

/**
 * Result interface containing the distance in kilometers and a nearness flag
 */
interface DistanceResult {
  distanceInKm: number;
  isNearby: boolean;
}

/**
 * Calculates the distance between two geographic coordinates using the Haversine formula
 * and determines if the current location is near the source location
 *
 * @param source - The source location with lat and long properties
 * @param currentLocation - The current location with lat and long properties
 * @param thresholdInKm - The threshold distance in kilometers to determine nearness (default: 1km)
 * @returns An object containing the distance in kilometers and a boolean indicating nearness
 */

const EARTH_RADIUS_IN_KM = 6371;

export function calculateDistance(
  source: Location,
  currentLocation: Location,
  thresholdInKm: number = 1,
): DistanceResult {
  // Convert latitude and longitude from degrees to radians
  const lat1Rad = toRadians(source.lat);
  const lon1Rad = toRadians(source.long);
  const lat2Rad = toRadians(currentLocation.lat);
  const lon2Rad = toRadians(currentLocation.long);

  console.log('source', source);
  console.log('currentLocation', currentLocation);

  // Differences in coordinates
  const dLat = lat2Rad - lat1Rad;
  const dLon = lon2Rad - lon1Rad;

  // Haversine formula
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceInKm = EARTH_RADIUS_IN_KM * c;

  // Determine if the location is nearby based on the threshold
  const isNearby = distanceInKm <= thresholdInKm;

  return {
    distanceInKm,
    isNearby,
  };
}

/**
 * Helper function to convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Example usage:
// const source = { lat: 40.7128, long: -74.0060 }; // New York
// const currentLocation = { lat: 40.7142, long: -74.0064 }; // Nearby location
// const result = calculateDistance(source, currentLocation);
// console.log(`Distance: ${result.distanceInKm.toFixed(2)}km, Nearby: ${result.isNearby}`);
