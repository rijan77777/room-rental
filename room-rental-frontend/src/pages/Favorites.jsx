import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Favorites() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/favorites")
      .then((res) => setRooms(res.data.rooms))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">My Favorites</h1>

      {rooms.length === 0 ? (
        <p className="text-gray-500">No saved rooms yet. Browse rooms and tap the heart to save them here.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <Link
              to={`/rooms/${room._id}`}
              key={room._id}
              className="border rounded-2xl overflow-hidden hover:shadow-xl transition bg-white"
            >
              {room.images.length > 0 ? (
                <img
                  src={room.images[0].replace('/upload/', '/upload/w_500,q_auto/')}
                  alt={room.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
              <div className="p-4">
                <h2 className="font-bold text-lg text-gray-900">{room.title}</h2>
                <p className="text-sm text-gray-500">{room.location.city}</p>
                <p className="font-semibold mt-2 text-teal-800">Rs. {room.pricePerMonth}/month</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;