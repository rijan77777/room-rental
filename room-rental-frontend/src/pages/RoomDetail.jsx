import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import RoomMap from "../components/RoomMap";
import ChatBox from "../components/ChatBox";

function RoomDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [moveInDate, setMoveInDate] = useState("");
  const [moveOutDate, setMoveOutDate] = useState("");
  const [method, setMethod] = useState("esewa");
  const [bookingError, setBookingError] = useState("");
  const [booking, setBooking] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquirySuccess, setInquirySuccess] = useState("");
  const [inquiryError, setInquiryError] = useState("");
  const [sendingInquiry, setSendingInquiry] = useState(false);

  const [similarRooms, setSimilarRooms] = useState([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    setLoading(true);
    setRoom(null);
    setReviews([]);
    setSimilarRooms([]);

    api.get(`/rooms/${id}`)
      .then((res) => setRoom(res.data.room))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    api.get(`/reviews/room/${id}`)
      .then((res) => setReviews(res.data.reviews))
      .catch((err) => console.error(err));

    api.get(`/rooms/${id}/similar`)
      .then((res) => setSimilarRooms(res.data.rooms))
      .catch((err) => console.error(err));

    if (user) {
      api.get(`/rooms/${id}/favorite-status`)
        .then((res) => setIsFavorited(res.data.isFavorited))
        .catch((err) => console.error(err));
    }
  }, [id, user]);

  const openModal = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setShowModal(true);
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingError("");
    setBooking(true);
    try {
      const res = await api.post("/bookings", { roomId: id, moveInDate, moveOutDate });
      navigate("/my-bookings");
      alert(`Booking created! Total: Rs. ${res.data.booking.totalPrice}. Go to My Bookings to pay.`);
    } catch (err) {
      setBookingError(err.response?.data?.message || "Booking failed");
    } finally {
      setBooking(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError("");
    setReviewSuccess("");
    setSubmittingReview(true);
    try {
      await api.post("/reviews", {
        bookingId: prompt("Enter your booking ID for this room (from My Bookings):"),
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviewSuccess("Review submitted!");
      setReviewComment("");
      const res = await api.get(`/reviews/room/${id}`);
      setReviews(res.data.reviews);
    } catch (err) {
      setReviewError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleInquiry = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    setInquiryError("");
    setInquirySuccess("");
    setSendingInquiry(true);
    try {
      await api.post("/inquiries", { roomId: id, message: inquiryMessage });
      setInquirySuccess("Message sent to the owner!");
      setInquiryMessage("");
    } catch (err) {
      setInquiryError(err.response?.data?.message || "Failed to send message");
    } finally {
      setSendingInquiry(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      const res = await api.put(`/rooms/${id}/favorite`);
      setIsFavorited(res.data.isFavorited);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update favorite");
    }
  };

  const handleReport = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    const reason = prompt("Why are you reporting this listing?");
    if (!reason) return;
    try {
      await api.post("/reports", { roomId: id, reason });
      alert("Report submitted. Thank you for helping keep the platform safe.");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit report");
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!room) return <div className="text-center py-20">Room not found</div>;

  const advancePercent = 24;
  const platformFee = Math.round(room.pricePerMonth * (advancePercent / 100) / 6);

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
      <div className="md:col-span-2">
        {room.images.length > 0 ? (
          <img
            src={room.images[0].replace('/upload/', '/upload/w_900,q_auto/')}
            alt={room.title}
            className="w-full h-96 object-cover rounded-2xl mb-6"
          />
        ) : (
          <div className="w-full h-96 bg-gray-100 rounded-2xl mb-6 flex items-center justify-center text-gray-400">
            No image
          </div>
        )}

        <p className="text-sm text-gray-500 flex items-center gap-1">
          📍 {room.location.address}, {room.location.district ? `${room.location.district}, ` : ""}{room.location.city}
        </p>
        <h1 className="text-3xl font-bold mt-2 text-gray-900">{room.title}</h1>

        <p className="mt-4 text-gray-700">{room.description}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {room.amenities.map((a, i) => (
            <span key={i} className="bg-gray-100 px-4 py-1.5 rounded-full text-sm font-medium text-gray-700">
              {a}
            </span>
          ))}
        </div>

        {room.location.latitude && room.location.longitude && (
          <div className="mt-6">
            <h3 className="font-bold mb-2 text-gray-900">Location</h3>
            <RoomMap
              latitude={room.location.latitude}
              longitude={room.location.longitude}
              title={room.title}
            />
          </div>
        )}

        <div className="mt-8 border-t pt-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-teal-800 text-white flex items-center justify-center font-bold">
            {room.owner.name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{room.owner.name}</p>
            <p className="text-sm text-gray-500">{room.owner.phone}</p>
          </div>
        </div>

        <button
          onClick={handleReport}
          className="mt-4 flex items-center gap-2 text-sm font-medium text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition"
        >
          🚩 Report this listing
        </button>

        <div className="mt-10 border-t pt-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Reviews</h2>

          {reviews.length === 0 ? (
            <p className="text-gray-500 text-sm">No reviews yet.</p>
          ) : (
            <div className="flex flex-col gap-4 mb-6">
              {reviews.map((r) => (
                <div key={r._id} className="border rounded-xl p-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{r.user.name}</span>
                    <span className="text-yellow-500">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                  </div>
                  {r.comment && <p className="text-gray-600 text-sm mt-1">{r.comment}</p>}
                </div>
              ))}
            </div>
          )}

          {user && user.role === "tenant" && (
            <div className="border rounded-xl p-4 bg-gray-50">
              <h3 className="font-semibold mb-2 text-sm">Leave a review (only if you've completed a booking here)</h3>

              {reviewError && <p className="text-red-600 text-sm mb-2">{reviewError}</p>}
              {reviewSuccess && <p className="text-green-600 text-sm mb-2">{reviewSuccess}</p>}

              <form onSubmit={handleReviewSubmit} className="flex flex-col gap-3">
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="border rounded-lg px-3 py-2 text-sm"
                >
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Good</option>
                  <option value={3}>3 - Okay</option>
                  <option value={2}>2 - Poor</option>
                  <option value={1}>1 - Terrible</option>
                </select>

                <textarea
                  placeholder="Your comment"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm"
                  rows="2"
                />

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="bg-teal-800 text-white rounded-lg px-4 py-2 text-sm disabled:opacity-50 w-fit"
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>
          )}
        </div>

        {similarRooms.length > 0 && (
          <div className="mt-10 border-t pt-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Similar Rooms</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {similarRooms.map((r) => (
                <Link key={r._id} to={`/rooms/${r._id}`} className="border rounded-xl overflow-hidden hover:shadow-md transition bg-white">
                  {r.images.length > 0 ? (
                    <img src={r.images[0].replace('/upload/', '/upload/w_300,q_auto/')} alt={r.title} className="w-full h-28 object-cover" />
                  ) : (
                    <div className="w-full h-28 bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No image</div>
                  )}
                  <div className="p-3">
                    <p className="font-semibold text-sm text-gray-900 truncate">{r.title}</p>
                    <p className="text-xs text-gray-500">{r.location.city}</p>
                    <p className="text-sm font-bold text-teal-800 mt-1">Rs. {r.pricePerMonth}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="md:col-span-1">
        <div className="border rounded-2xl p-6 shadow-sm sticky top-6 bg-white">
          <p className="text-2xl font-bold text-teal-800">
            Rs. {room.pricePerMonth.toLocaleString()}
            <span className="text-base font-normal text-gray-500"> / month</span>
          </p>

          <span className={`inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full ${
            room.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {room.isAvailable ? "Available now" : "Not available"}
          </span>

          <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-600 mt-4 flex gap-2">
            🛡️ Your request is private until the owner responds. No payment is needed to request.
          </div>

          <button
            onClick={openModal}
            disabled={!room.isAvailable}
            className="w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold py-3 rounded-xl mt-4 disabled:opacity-50"
          >
            📅 {room.isAvailable ? "Request this place" : "Not available"}
          </button>

          <button
            onClick={handleToggleFavorite}
            className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-xl mt-2 text-sm"
          >
            {isFavorited ? "❤️ Saved to Favorites" : "🤍 Save to Favorites"}
          </button>
          {user && user._id !== room.owner._id && (
  <button
    onClick={() => setShowChat(!showChat)}
    className="w-full bg-teal-800 hover:bg-teal-900 text-white font-medium py-2.5 rounded-xl mt-2 text-sm"
  >
    💬 {showChat ? "Close Chat" : "Message Owner"}
  </button>
)}

{showChat && (
  <ChatBox roomId={id} otherUserId={room.owner._id} otherUserName={room.owner.name} />
)}

          <div className="mt-6 border-t pt-4">
            <p className="text-sm font-semibold text-gray-900 mb-2">Have a question?</p>

            {inquiryError && <p className="text-red-600 text-xs mb-2">{inquiryError}</p>}
            {inquirySuccess && <p className="text-green-600 text-xs mb-2">{inquirySuccess}</p>}

            <form onSubmit={handleInquiry} className="flex flex-col gap-2">
              <textarea
                placeholder="Ask the owner something..."
                value={inquiryMessage}
                onChange={(e) => setInquiryMessage(e.target.value)}
                required
                rows="3"
                className="border rounded-lg px-3 py-2 text-sm"
              />
              <button
                type="submit"
                disabled={sendingInquiry}
                className="bg-gray-900 text-white text-sm font-semibold py-2 rounded-lg disabled:opacity-50"
              >
                {sendingInquiry ? "Sending..." : "Contact Owner"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700"
            >
              ✕
            </button>

            <p className="text-orange-500 text-xs font-bold tracking-wide">ALMOST THERE</p>
            <h2 className="text-2xl font-bold mt-1 text-gray-900">Request {room.title}</h2>

            {bookingError && (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mt-4 text-sm">
                {bookingError}
              </div>
            )}

            <form onSubmit={handleBooking} className="mt-6 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <label className="text-sm font-medium text-gray-700">
                  Move-in date
                  <input
                    type="date"
                    value={moveInDate}
                    onChange={(e) => setMoveInDate(e.target.value)}
                    required
                    className="border rounded-lg px-3 py-2 w-full mt-1"
                  />
                </label>

                <label className="text-sm font-medium text-gray-700">
                  Move-out date
                  <input
                    type="date"
                    value={moveOutDate}
                    onChange={(e) => setMoveOutDate(e.target.value)}
                    required
                    className="border rounded-lg px-3 py-2 w-full mt-1"
                  />
                </label>
              </div>

              <label className="text-sm font-medium text-gray-700">
                How would you like to pay?
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="border rounded-lg px-3 py-2 w-full mt-1"
                >
                  <option value="esewa">eSewa</option>
                  <option value="khalti">Khalti</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cash">Cash</option>
                </select>
              </label>

              <div className="bg-orange-50 rounded-xl p-4 text-sm flex justify-between">
                <span className="text-gray-600">Monthly rent</span>
                <span className="font-bold text-gray-900">Rs. {room.pricePerMonth.toLocaleString()}</span>
              </div>
              <div className="bg-orange-50 -mt-4 rounded-b-xl px-4 pb-4 text-sm flex justify-between">
                <span className="text-gray-600">Platform fee</span>
                <span className="font-semibold text-teal-700">Rs. {platformFee} (shown before payment)</span>
              </div>

              <button
                type="submit"
                disabled={booking}
                className="bg-teal-800 hover:bg-teal-900 text-white font-semibold py-3 rounded-xl disabled:opacity-50"
              >
                {booking ? "Sending..." : "✓ Send request"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoomDetail;