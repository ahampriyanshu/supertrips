import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import tripData from '../data.json';
import L from 'leaflet';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom dark marker icon
const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function Map() {
  const center = [25.3176, 80.0]; // Center around central India
  const positions = tripData.map(trip => [trip.lat, trip.lng]);

  return (
    <div className="map-wrapper">
      <MapContainer 
        center={center} 
        zoom={5} 
        scrollWheelZoom={false}
        className="map-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        />
        {tripData.map((trip) => (
          <Marker key={trip.id} position={[trip.lat, trip.lng]} icon={customIcon}>
            <Popup className="custom-popup">
              <strong>{trip.city}</strong><br />
              Duration: {trip.duration}
            </Popup>
          </Marker>
        ))}
        {/* Draw a line connecting the trips */}
        <Polyline positions={positions} color="#8b5cf6" weight={3} dashArray="5, 10" opacity={0.7} />
      </MapContainer>
    </div>
  );
}
