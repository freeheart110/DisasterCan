import { getLatestAlerts } from '../../src/services/alertService';
// Import axios to mock its functionality
import axios from 'axios';
// Import the location service to mock its return value
import * as locationService from '../../src/services/locationService';

/**
 * MOCK SETUP
 * Telling Jest to replace the actual implementations of these modules
 * with our own fake versions. This is crucial for unit testing.
 */

// Mock the entire axios library.
jest.mock('axios');
// Create a typed version of the mocked axios for easier use.
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock our own location service.
jest.mock('../../../src/services/locationService');
const mockedLocationService = locationService as jest.Mocked<typeof locationService>;

/**
 * MOCK DATA
 * This is fake data that simulates what the real services would return.
 * This makes our tests predictable and independent of the network.
 */

// A mock location that the location service will "return".
const mockLocation = {
  latitude: 50.4452,
  longitude: -104.6189,
  province: 'SK',
  regionCode: 'CWWG',
  city: 'Regina',
  fullAddress: 'Regina, SK',
};

// Directory listing with links to CAP files.
const mockDirectoryHtml = `
  <a href="T_WOCN25_C_CWWG_202509212000_active.cap">active.cap</a>
  <a href="T_WOCN26_C_CWWG_202509211900_ended.cap">ended.cap</a>
  <a href="T_WOCN25_C_CWWG_202509211800_old_version.cap">old_version.cap</a>
`;

// XML: ACTIVE alert (latest)
const mockActiveCapXml = `
<alert>
  <identifier>urn:oid:active</identifier>
  <sent>2025-09-21T20:00:00-00:00</sent>
  <info>
    <language>en-CA</language>
    <event>air quality</event>
    <headline>special air quality statement in effect</headline>
    <description>High levels of pollution expected.</description>
    <instruction>Stay indoors.</instruction>
    <severity>Moderate</severity>
    <parameter>
      <valueName>layer:EC-MSC-SMC:1.0:Alert_Type</valueName>
      <value>advisory</value>
    </parameter>
    <parameter>
      <valueName>layer:EC-MSC-SMC:1.0:Alert_Location_Status</valueName>
      <value>active</value>
    </parameter>
  </info>
</alert>
`;

// XML: ENDED alert
const mockEndedCapXml = `
<alert>
  <identifier>urn:oid:ended</identifier>
  <sent>2025-09-21T19:00:00-00:00</sent>
  <info>
    <language>en-CA</language>
    <event>fog</event>
    <headline>fog advisory ended</headline>
    <description>Fog has dissipated.</description>
    <instruction>None</instruction>
    <severity>Minor</severity>
    <parameter>
      <valueName>layer:EC-MSC-SMC:1.0:Alert_Type</valueName>
      <value>advisory</value>
    </parameter>
    <parameter>
      <valueName>layer:EC-MSC-SMC:1.0:Alert_Location_Status</valueName>
      <value>ended</value>
    </parameter>
  </info>
</alert>
`;

// XML: older version of ACTIVE alert
const mockOldVersionCapXml = `
<alert>
  <identifier>urn:oid:active_old</identifier>
  <sent>2025-09-21T18:00:00-00:00</sent>
  <info>
    <language>en-CA</language>
    <event>air quality</event>
    <headline>special air quality statement issued</headline>
    <description>Initial air quality concern.</description>
    <instruction>Stay indoors.</instruction>
    <severity>Moderate</severity>
    <parameter>
      <valueName>layer:EC-MSC-SMC:1.0:Alert_Type</valueName>
      <value>advisory</value>
    </parameter>
    <parameter>
      <valueName>layer:EC-MSC-SMC:1.0:Alert_Location_Status</valueName>
      <value>active</value>
    </parameter>
  </info>
</alert>
`;

/**
 * TEST SUITE
 */
describe('getLatestAlerts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedLocationService.getLocationInfo.mockResolvedValue(mockLocation);
  });

  it('should fetch, parse, and return active and ended alerts correctly', async () => {
    mockedAxios.get.mockImplementation((url: string) => {
      if (url === 'https://dd.weather.gc.ca/alerts/cap/20250921/CWWG/20/') {
        return Promise.resolve({ data: mockDirectoryHtml });
      }
      if (url.endsWith('active.cap')) {
        return Promise.resolve({ data: mockActiveCapXml });
      }
      if (url.endsWith('ended.cap')) {
        return Promise.resolve({ data: mockEndedCapXml });
      }
      if (url.endsWith('old_version.cap')) {
        return Promise.resolve({ data: mockOldVersionCapXml });
      }
      // All other folder requests return 404
      return Promise.reject({ response: { status: 404 } });
    });

    const alerts = await getLatestAlerts();

    expect(alerts).toHaveLength(2);

    const activeAlert = alerts.find(a => a.event === 'air quality');
    const endedAlert = alerts.find(a => a.event === 'fog');

    // ACTIVE alert assertions
    expect(activeAlert).toBeDefined();
    expect(activeAlert?.isActive).toBe(true);
    expect(activeAlert?.headline).toBe('special air quality statement in effect');
    expect(activeAlert?.versions).toHaveLength(2);
    expect(activeAlert?.versions[0].headline).toBe('special air quality statement in effect');
    expect(activeAlert?.versions[1].headline).toBe('special air quality statement issued');

    // ENDED alert assertions
    expect(endedAlert).toBeDefined();
    expect(endedAlert?.isActive).toBe(false);
    expect(endedAlert?.headline).toBe('fog advisory ended');
    expect(endedAlert?.versions).toHaveLength(1);
    expect(endedAlert?.versions[0].severity).toBe('Minor');
  });

  it('should return an empty array if the alert directory returns a 404 error', async () => {
    mockedAxios.get.mockRejectedValue({ response: { status: 404 } });
    const alerts = await getLatestAlerts();
    expect(alerts).toEqual([]);
  });

  it('should return an empty array if the directory contains no .cap files', async () => {
    mockedAxios.get.mockResolvedValue({ data: '<html><body>No alerts here.</body></html>' });
    const alerts = await getLatestAlerts();
    expect(alerts).toEqual([]);
  });
});