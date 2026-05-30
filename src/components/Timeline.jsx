import React from 'react';
import { RAW_TRIPS as tripData } from '../data.js';
import { Briefcase } from 'lucide-react';

export default function Timeline() {
  return (
    <div className="timeline-container">
      <h2>Your Journey</h2>
      <div className="timeline">
        {tripData.map((trip, index) => (
          <div className="timeline-item" key={trip.id} style={{ animationDelay: `${index * 0.2}s` }}>
            <div className="timeline-dot">
              <Briefcase size={16} color="#fff" />
            </div>
            <div className="timeline-content">
              <h3>{trip.city}</h3>
              <span className="duration">{trip.duration}</span>
              <p>{trip.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
