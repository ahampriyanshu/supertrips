function parseDurationDays(duration) {
  const d = duration.toLowerCase();
  if (d.includes('month')) return parseFloat(d) * 30;
  if (d.includes('week')) return parseFloat(d) * 7;
  if (d.includes('½') || d.includes('0.5')) return 0.5;
  return parseFloat(d) || 1;
}

function formatUnit(value, unit) {
  return `${value} ${unit}${value === 1 ? '' : 's'}`;
}

export function getTripDuration(cities) {
  const days = cities.reduce((sum, city) => sum + parseDurationDays(city.dur), 0);
  if (days >= 30) return formatUnit(Math.round(days / 30), 'month');
  if (days >= 7) return formatUnit(Math.round(days / 7), 'week');
  return formatUnit(Math.round(days), 'day');
}
