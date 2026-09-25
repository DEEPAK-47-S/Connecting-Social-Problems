"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Search, MapPin, Check } from "lucide-react";

// Fix for default marker icon in leaflet with Next.js/Webpack
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface LocationPickerMapProps {
  onSelectLocation: (data: {
    lat: number;
    lng: number;
    address: any;
  }) => void;
  onClose: () => void;
}

function LocationMarker({ position, setPosition }: { position: L.LatLng | null; setPosition: (pos: L.LatLng) => void }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={icon}></Marker>
  );
}

export default function LocationPickerMap({ onSelectLocation, onClose }: LocationPickerMapProps) {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [addressDetails, setAddressDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Default to India (center of India approx)
  const defaultCenter: L.LatLngExpression = [20.5937, 78.9629];
  const defaultZoom = 5;

  useEffect(() => {
    // Try to get user's current location to center map
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          // We won't auto-set position marker, just let map handle it if we want.
          // Actually, let's just leave the map at default center, but zoom to user if possible.
          // For simplicity, we just use defaultCenter. MapContainer doesn't easily change center dynamically without a custom component.
        },
        () => {}
      );
    }
  }, []);

  useEffect(() => {
    if (position) {
      reverseGeocode(position.lat, position.lng);
    }
  }, [position]);

  const reverseGeocode = async (lat: number, lng: number) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=en`);
      const data = await res.json();
      if (data && data.address) {
        setAddressDetails(data.address);
      } else {
        setAddressDetails(null);
      }
    } catch (err) {
      setError("Failed to fetch location details.");
      setAddressDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUseLocation = () => {
    if (position) {
      onSelectLocation({
        lat: position.lat,
        lng: position.lng,
        address: addressDetails || {}
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-white dark:bg-zinc-950 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
        <h2 className="font-bold text-lg text-zinc-900 dark:text-white flex items-center gap-2">
          <MapPin className="h-5 w-5 text-indigo-500" />
          Select Exact Location
        </h2>
        <button onClick={onClose} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white font-medium text-sm">Cancel</button>
      </div>
      
      <div className="flex-1 relative">
        <MapContainer center={defaultCenter} zoom={defaultZoom} className="w-full h-full z-0">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} setPosition={setPosition} />
        </MapContainer>
        
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white dark:bg-zinc-900 px-4 py-2 rounded-full shadow-lg border border-zinc-200 dark:border-zinc-800 text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2 pointer-events-none">
          <Search className="h-4 w-4 text-indigo-500" />
          Tap anywhere on the map
        </div>
      </div>

      {position && (
        <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
          <h3 className="font-bold text-zinc-900 dark:text-white mb-2 text-sm flex items-center gap-1.5">
            <Check className="h-4 w-4 text-emerald-500" />
            Location Selected
          </h3>
          
          {loading ? (
            <p className="text-sm text-zinc-500 animate-pulse">Fetching address details...</p>
          ) : error ? (
            <p className="text-sm text-rose-500">{error}</p>
          ) : addressDetails ? (
            <div className="text-sm text-zinc-700 dark:text-zinc-300 mb-4 line-clamp-2">
              {[
                addressDetails.road || addressDetails.street,
                addressDetails.suburb || addressDetails.neighbourhood || addressDetails.village,
                addressDetails.city_district || addressDetails.state_district || addressDetails.county,
                addressDetails.city || addressDetails.town,
                addressDetails.state,
                addressDetails.postcode
              ].filter(Boolean).join(", ")}
            </div>
          ) : (
            <p className="text-sm text-zinc-500 mb-4">Coordinates: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}</p>
          )}

          <button
            onClick={handleUseLocation}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-md shadow-indigo-500/20"
          >
            Use this Location
          </button>
        </div>
      )}
    </div>
  );
}
