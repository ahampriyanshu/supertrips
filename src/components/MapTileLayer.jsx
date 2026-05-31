import { TileLayer } from 'react-leaflet';

export default function MapTileLayer() {
  return import.meta.env.VITE_MAPPLS_KEY ? (
    <TileLayer
      attribution='&copy; <a href="https://www.mappls.com/">MapmyIndia</a>'
      url={`https://apis.mappls.com/advancedmaps/v1/${import.meta.env.VITE_MAPPLS_KEY}/still_map/{z}/{x}/{y}.png`}
    />
  ) : (
    <TileLayer
      attribution='&copy; OpenStreetMap contributors'
      url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
    />
  );
}
