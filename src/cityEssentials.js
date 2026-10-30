const ESSENTIALS = [
  { key: 'hostels', label: 'Hostels', core: true },
  { key: 'app_cabs', label: 'App cabs', core: true },
  { key: 'metro', label: 'Metro', core: true },
  { key: 'public_transport', label: 'Public transport', core: true },
  { key: 'auto_rickshaws', label: 'Auto rickshaws' },
  { key: 'taxis', label: 'Local taxis' },
  { key: 'bike_rentals', label: 'Bike rentals' },
];

// true/false are recorded availability; null or missing means unknown.
// Absence in the old notes is not evidence that a service is unavailable.
export function getCityEssentials(city) {
  const availability = city?.essentials || {};
  return ESSENTIALS.filter(item => item.core || typeof availability[item.key] === 'boolean')
    .map(item => {
      const value = availability[item.key];
      const status = value === true ? 'available' : value === false ? 'unavailable' : 'unknown';
      return {
        key: item.key,
        label: item.label,
        status,
        description: status === 'available' ? 'Available' : 'Not available',
      };
    });
}
