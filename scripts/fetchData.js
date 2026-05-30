import fs from 'fs';
import path from 'path';
import * as xlsx from 'xlsx';

// Use export?format=xlsx to get the entire workbook (all sheets)
const SHEET_URL = "https://docs.google.com/spreadsheets/d/1du4mKiVLqA8hy9iME-JRZueU4Xe81DR1UopNDnMmJn4/export?format=xlsx";
const OUTPUT_FILE = path.join(process.cwd(), 'src', 'data.json');

async function fetchData() {
  console.log("Fetching Google Sheet data (XLSX format)...");
  const response = await fetch(SHEET_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }
  
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  const workbook = xlsx.read(buffer, { type: 'buffer' });
  
  const trips = [];
  
  // Iterate through all sheets (each sheet represents a Trip)
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const records = xlsx.utils.sheet_to_json(sheet, { defval: "" });
    
    const cities = [];
    for (const row of records) {
      // Find the city and duration keys flexibly
      const cityKey = Object.keys(row).find(k => k.toLowerCase().includes('city')) || Object.keys(row)[0];
      const durKey = Object.keys(row).find(k => k.toLowerCase().includes('duration') || k.toLowerCase().includes('dur')) || Object.keys(row)[1];
      
      const city = row[cityKey];
      const duration = durKey ? row[durKey] : "1 Day";
      
      if (city) {
        cities.push({
          city: city.toString().trim(),
          dur: duration ? duration.toString().trim() : "1 Day"
        });
      }
    }
    
    // Push the trip if there are cities in this sheet
    if (cities.length > 0) {
      trips.push({
        name: sheetName.trim(),
        cities: cities
      });
    }
  }

  if (trips.length === 0) {
    console.warn("No trips found in the spreadsheet!");
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(trips, null, 2), 'utf-8');
  console.log(`Successfully generated src/data.json with ${trips.length} trips and ${trips.reduce((acc, t) => acc + t.cities.length, 0)} total cities.`);
}

fetchData().catch(err => {
  console.error("Error fetching data:", err);
  process.exit(1);
});
