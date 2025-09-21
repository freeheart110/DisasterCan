import fs from 'fs';

// Load the JSON data
const jsonData = JSON.parse(fs.readFileSync('./assets/odhf_v1.1.json', 'utf-8'));

// Extract unique source_facility_type values
const facilityTypes = new Set<string>();

jsonData.forEach((item: any) => {
  if (item.source_facility_type) {
    facilityTypes.add(item.source_facility_type.trim());
  }
});

const sortedFacilityTypes = Array.from(facilityTypes).sort();

console.log('source_facility_type:');
console.dir(sortedFacilityTypes, { maxArrayLength: null });