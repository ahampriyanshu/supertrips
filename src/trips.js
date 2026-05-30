import RAW_TRIPS from './data.json';
import CITIES from './cities.json';

// Resolve city codes back to full objects so the rest of the app
// can still use city.city / city.lat / city.lng / city.dur unchanged.
const TRIPS = RAW_TRIPS.map(trip => ({
  ...trip,
  cities: trip.cities.map(c => ({
    ...CITIES[c.code],
    dur: c.dur,
  })),
}));

export default TRIPS;
