import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../services/api";

function Rooms() {
  const [searchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [type, setType] = useState("");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async (filterCity, filterType, filterSort) => {
    setLoading(true);
    try {
      const params = {};
      const cityVal = filterCity !== undefined ? filterCity : searchParams.get("city");
      const maxPrice = searchParams.get("maxPrice");
      const q = searchParams.get("q");
      const typeVal = filterType !== undefined ? filterType : type;
      const sortVal = filterSort !== undefined ? filterSort : sort;

      if (cityVal) params.city = cityVal;
      if (maxPrice) params.maxPrice = maxPrice;
      if (q) params.q = q;
      if (typeVal) params.type = typeVal;
      if (sortVal && sortVal !== "newest") params.sort = sortVal;

      const res = await api.get("/rooms", { params });
      setRooms(res.data.rooms);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRooms(city, type, sort);
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
    fetchRooms(city, e.target.value, sort);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    fetchRooms(city, type, e.target.value);
  };

  if (loading) return <div className="text-center py-20">Loading rooms...</div>;

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">Available Rooms</h1>

      <form onSubmit={handleSearch} className="flex flex-wrap gap-2 mb-8">
        <input
          type="text"
          placeholder="Search by city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border rounded-xl px-4 py-2 flex-1 min-w-[180px]"
        />

        <select value={type} onChange={handleTypeChange} className="border rounded-xl px-4 py-2 bg-white">
          <option value="">All types</option>
          <option value="single">Single</option>
          <option value="shared">Shared</option>
          <option value="apartment">Apartment</option>
        </select>

        <select value={sort} onChange={handleSortChange} className="border rounded-xl px-4 py-2 bg-white">
          <option value="newest">Newest first</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>

        <button type="submit" className="bg-teal-800 text-white px-6 py-2 rounded-xl">
          Search
        </button>
      </form>

      {rooms.length === 0 ? (
        <p className="text-gray-500">No rooms found.</p>
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

export default Rooms;