import * as Location from 'expo-location';
import { getLocationInfo } from '../../src/services/locationService';

jest.mock('expo-location'); 

describe('getLocationInfo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return structured location info when permissions granted', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });

    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue({
      coords: {
        latitude: 51.0447,
        longitude: -114.0719,
      },
    });

    (Location.reverseGeocodeAsync as jest.Mock).mockResolvedValue([
      {
        city: 'Calgary',
        region: 'AB',
        street: '1st Street SW',
        streetNumber: '123',
        postalCode: 'T2X 1A4',
        country: 'Canada',
      },
    ]);

    const locationInfo = await getLocationInfo();

    expect(locationInfo).toEqual({
      latitude: 51.0447,
      longitude: -114.0719,
      province: 'AB',
      regionCode: 'CWWG',
      city: 'Calgary',
      fullAddress: '123 1st Street SW, Calgary, AB T2X 1A4, Canada',
    });
  });

  it('should throw an error if permission is denied', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'denied',
    });

    await expect(getLocationInfo()).rejects.toThrow('Permission to access location was denied');
  });
});