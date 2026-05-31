import { MapPin, Calendar, Compass } from 'lucide-react';
import { RAW_TRIPS as tripData } from '../data.js';

export default function Stats() {
  const totalCities = tripData.length;
  const totalDays = tripData.reduce((acc, trip) => acc + trip.days, 0);

  return (
    <div className="stats-container">
      <div className="stat-card">
        <MapPin size={24} className="stat-icon" />
        <div className="stat-info">
          <h3>{totalCities}</h3>
          <p>Cities Visited</p>
        </div>
      </div>
      <div className="stat-card">
        <Calendar size={24} className="stat-icon" />
        <div className="stat-info">
          <h3>{totalDays}</h3>
          <p>Days on Workation</p>
        </div>
      </div>
      <div className="stat-card">
        <Compass size={24} className="stat-icon" />
        <div className="stat-info">
          <h3>5+</h3>
          <p>Memories Made</p>
        </div>
      </div>
    </div>
  );
}
