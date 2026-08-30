import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const amenityIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [20, 33],
  iconAnchor: [10, 33],
});

function RoomMap({ latitude, longitude, title }) {
  const [nearby, setNearby] = useState([]);

  useEffect(() => {
    if (!latitude || !longitude) return;

    const query = `
      [out:json][timeout:10];
      (
        node["amenity"="hospital"](around:1500,${latitude},${longitude});
        node["amenity"="school"](around:1500,${latitude},${longitude});
        node["amenity"="bus_station"](around:1500,${latitude},${longitude});
        node["shop"="supermarket"](around:1500,${latitude},${longitude});
      );
      out body 10;
    `;

    fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query,
    })
      .then((res) => res.json())
      .then((data) => setNearby(data.elements || []))
      .catch((err) => console.error("Overpass fetch failed:", err));
  }, [latitude, longitude]);

  if (!latitude || !longitude) return null;

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  const getLabel = (tags) => {
    if (tags.amenity === "hospital") return "🏥 " + (tags.name || "Hospital");
    if (tags.amenity === "school") return "🏫 " + (tags.name || "School");
    if (tags.amenity === "bus_station") return "🚌 " + (tags.name || "Bus Station");
    if (tags.shop === "supermarket") return "🛒 " + (tags.name || "Supermarket");
    return tags.name || "Place";
  };

  return (
    <div>
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        style={{ height: "300px", width: "100%", borderRadius: "1rem" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <Marker position={[latitude, longitude]}>
          <Popup>{title}</Popup>
        </Marker>

        {nearby.map((place) => (
          <Marker key={place.id} position={[place.lat, place.lon]} icon={amenityIcon}>
            <Popup>{getLabel(place.tags || {})}</Popup>
          </Marker>
        ))}
      </MapContainer>

      
        href={directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-2 text-sm font-semibold text-teal-800 hover:underline"
      >
        📍 Get Directions on Google Maps
      </a>

      {nearby.length > 0 && (
        <p className="text-xs text-gray-500 mt-1">
          Showing {nearby.length} nearby amenities (hospitals, schools, bus stops, supermarkets)
        </p>
      )}
    </div>
  );
}

export default RoomMap;