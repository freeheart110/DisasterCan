import { loadLocalResources } from '../../src/services/localResourcesService';

// Mock the JSON dataset (imported from odhf_v1.1.json)
jest.mock('../../../assets/odhf_v1.1.json', () => [
  {
    index: 1,
    facility_name: 'Included Facility',
    source_facility_type: 'clinic', // allowed
    odhf_facility_type: 'Health Centre',
    provider: 'Gov Test',
    street_no: 123,
    street_name: 'Main St',
    city: 'Testville',
    province: 'ON',
    postal_code: 'A1A1A1',
    latitude: 43.65107, // near Toronto
    longitude: -79.347015,
  },
  {
    index: 2,
    facility_name: 'Excluded by Type',
    source_facility_type: 'skate park', // not allowed
    odhf_facility_type: 'Recreation',
    provider: 'City Rec',
    street_no: 456,
    street_name: 'Side St',
    city: 'Nowhere',
    province: 'ON',
    postal_code: 'Z9Z9Z9',
    latitude: 43.7,
    longitude: -79.4,
  },
  {
    index: 3,
    facility_name: 'Too Far Away',
    source_facility_type: 'hospital',
    odhf_facility_type: 'Emergency',
    provider: 'Far Hospital',
    street_no: 789,
    street_name: 'Remote Rd',
    city: 'Farplace',
    province: 'BC',
    postal_code: 'V0V0V0',
    latitude: 49.157, // ~3,400km from Toronto
    longitude: -123.16,
  },
]);

describe('loadLocalResources', () => {
  it('returns only relevant and nearby facilities', async () => {
    const torontoLat = 43.65107;
    const torontoLon = -79.347015;

    const result = await loadLocalResources(torontoLat, torontoLon);

    expect(result).toHaveLength(1);
    expect(result[0].facility_name).toBe('Included Facility');
    expect(result[0].address).toBe('123 Main St');
    expect(result[0].latitude).toBeCloseTo(43.65107);
    expect(result[0].longitude).toBeCloseTo(-79.347015);
  });

  it('excludes facilities with unapproved types or out of range', async () => {
    const torontoLat = 43.65107;
    const torontoLon = -79.347015;

    const result = await loadLocalResources(torontoLat, torontoLon);
    const names = result.map((r) => r.facility_name);

    expect(names).not.toContain('Excluded by Type');
    expect(names).not.toContain('Too Far Away');
  });
});