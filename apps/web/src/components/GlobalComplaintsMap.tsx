"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapPin, X, Activity, Image as ImageIcon } from "lucide-react";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface GlobalComplaintsMapProps {
  posts: any[];
  onClose: () => void;
  onPostClick?: (post: any) => void;
}

export default function GlobalComplaintsMap({ posts, onClose, onPostClick }: GlobalComplaintsMapProps) {
  // Center roughly on Tamil Nadu or India depending on data. Let's do TN center.
  const defaultCenter: L.LatLngExpression = [11.1271, 78.6569];
  const defaultZoom = 7;

  // Only plot posts that have latitude and longitude
  const mappedPosts = posts.filter(p => p.lat && p.lng);

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-white dark:bg-zinc-950 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
        <h2 className="font-bold text-lg text-zinc-900 dark:text-white flex items-center gap-2">
          <MapPin className="h-5 w-5 text-indigo-500" />
          Global Complaints Map ({mappedPosts.length})
        </h2>
        <button onClick={onClose} className="p-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white rounded-full transition">
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <div className="flex-1 relative">
        <MapContainer center={defaultCenter} zoom={defaultZoom} className="w-full h-full z-0">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {mappedPosts.map((post) => (
            <Marker key={post.id} position={[post.lat, post.lng]} icon={icon}>
              <Popup className="custom-popup">
                <div className="w-48 sm:w-64 max-h-[300px] overflow-y-auto overflow-x-hidden flex flex-col gap-2 p-1">
                  {post.imageUrl ? (
                    <img src={post.imageUrl} alt={post.title} className="w-full h-32 object-cover rounded-lg" />
                  ) : (
                    <div className="w-full h-32 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-zinc-300" />
                    </div>
                  )}
                  <h3 className="font-bold text-sm text-zinc-900 line-clamp-2">{post.title}</h3>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 w-fit">
                    <Activity className="h-3 w-3" />
                    {post.status.replace(/_/g, ' ')}
                  </div>
                  <p className="text-xs text-zinc-500 line-clamp-2">{post.location}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        
        {mappedPosts.length === 0 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white dark:bg-zinc-900 px-4 py-2 rounded-full shadow-lg border border-zinc-200 dark:border-zinc-800 text-sm font-medium text-zinc-700 dark:text-zinc-300 pointer-events-none">
            No complaints with GPS coordinates yet.
          </div>
        )}
      </div>
    </div>
  );
}
