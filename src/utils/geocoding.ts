import { ExifData } from '../types/metadata';

/**
 * Reverse geocoding using OpenStreetMap Nominatim API
 */
export async function reverseGeocode(latitude: number, longitude: number): Promise<ExifData['gps']['location']> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'PhotoMetadataAnalyzer/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(`Geocoding error: ${data.error}`);
    }
    
    const address = data.address || {};
    
    return {
      country: address.country,
      state: address.state || address.province,
      city: address.city || address.town || address.village,
      address: data.display_name,
      postalCode: address.postcode,
      timezone: data.timezone,
      accuracy: data.accuracy || null,
      placeId: data.place_id?.toString()
    };
  } catch (error) {
    console.warn('Reverse geocoding failed:', error);
    return null;
  }
}

/**
 * Calculate distance between two GPS coordinates in meters
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Calculate bearing between two GPS coordinates
 */
export function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  
  const θ = Math.atan2(y, x);
  return (θ * 180 / Math.PI + 360) % 360;
}

/**
 * Convert GPS coordinates to DMS (Degrees, Minutes, Seconds) format
 */
export function decimalToDMS(decimal: number): string {
  const degrees = Math.floor(Math.abs(decimal));
  const minutes = Math.floor((Math.abs(decimal) - degrees) * 60);
  const seconds = ((Math.abs(decimal) - degrees - minutes / 60) * 3600).toFixed(2);
  
  const direction = decimal >= 0 ? '' : '-';
  return `${direction}${degrees}° ${minutes}' ${seconds}"`;
}

/**
 * Convert GPS coordinates to different formats
 */
export function formatGPSCoordinates(latitude: number, longitude: number): {
  decimal: string;
  dms: string;
  utm: string;
} {
  return {
    decimal: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
    dms: `${decimalToDMS(latitude)}, ${decimalToDMS(longitude)}`,
    utm: convertToUTM(latitude, longitude)
  };
}

/**
 * Convert decimal coordinates to UTM format
 */
function convertToUTM(lat: number, lon: number): string {
  // Simplified UTM conversion (for display purposes)
  // In a production app, you'd use a proper UTM library
  const zone = Math.floor((lon + 180) / 6) + 1;
  const hemisphere = lat >= 0 ? 'N' : 'S';
  
  // Simplified calculation - for accurate UTM, use a proper library
  const easting = Math.round((lon + 180) * 100000);
  const northing = Math.round((lat + 90) * 100000);
  
  return `${zone}${hemisphere} ${easting}E ${northing}N`;
}

/**
 * Get timezone from coordinates
 */
export async function getTimezoneFromCoordinates(latitude: number, longitude: number): Promise<string | null> {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=0`);
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.timezone || null;
  } catch (error) {
    console.warn('Timezone lookup failed:', error);
    return null;
  }
}

/**
 * Calculate sunrise/sunset times for a location
 */
export function calculateSunTimes(latitude: number, longitude: number, date: Date = new Date()): {
  sunrise: Date;
  sunset: Date;
  dayLength: number;
} {
  // Simplified sun calculation - for accurate times, use a proper astronomical library
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  
  // Approximate calculations
  const declination = 23.45 * Math.sin((360 / 365) * (dayOfYear - 80) * Math.PI / 180);
  const hourAngle = Math.acos(-Math.tan(latitude * Math.PI / 180) * Math.tan(declination * Math.PI / 180));
  
  const sunriseHour = 12 - (hourAngle * 180 / Math.PI) / 15;
  const sunsetHour = 12 + (hourAngle * 180 / Math.PI) / 15;
  
  const sunrise = new Date(date);
  sunrise.setHours(Math.floor(sunriseHour), Math.round((sunriseHour % 1) * 60), 0);
  
  const sunset = new Date(date);
  sunset.setHours(Math.floor(sunsetHour), Math.round((sunsetHour % 1) * 60), 0);
  
  const dayLength = sunsetHour - sunriseHour;
  
  return { sunrise, sunset, dayLength };
}

/**
 * Determine time of day based on coordinates and timestamp
 */
export function getTimeOfDay(latitude: number, longitude: number, timestamp: Date): 'dawn' | 'day' | 'dusk' | 'night' {
  const { sunrise, sunset } = calculateSunTimes(latitude, longitude, timestamp);
  const hour = timestamp.getHours();
  const sunriseHour = sunrise.getHours();
  const sunsetHour = sunset.getHours();
  
  if (hour >= sunriseHour - 1 && hour < sunriseHour + 1) return 'dawn';
  if (hour >= sunriseHour + 1 && hour < sunsetHour - 1) return 'day';
  if (hour >= sunsetHour - 1 && hour < sunsetHour + 1) return 'dusk';
  return 'night';
}

/**
 * Determine season based on date and latitude
 */
export function getSeason(date: Date, latitude: number): 'spring' | 'summer' | 'autumn' | 'winter' {
  const month = date.getMonth();
  const isNorthernHemisphere = latitude >= 0;
  
  if (isNorthernHemisphere) {
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  } else {
    if (month >= 2 && month <= 4) return 'autumn';
    if (month >= 5 && month <= 7) return 'winter';
    if (month >= 8 && month <= 10) return 'spring';
    return 'summer';
  }
}
