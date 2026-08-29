import { useState, useEffect } from "react";
import api from "../services/api";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState({});
  const [proofFiles, setProofFiles] = useState({});
  const [uploadingProof, setUploadingProof] = useState({});

  useEffect(() => {
    api.get("/bookings/my")
      .then((res) => setBookings(res.data.bookings))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!confirm("Cancel this booking?")) return;
    try {
      await api.put(`/bookings/${id}/cancel`);
      setBookings(bookings.map(b => b._id === id ? { ...b, status: "cancelled" } : b));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel");
    }
  };

  const handlePay = async (id) => {
    try {
      const res = await api.post("/payments", { bookingId: id, method: "esewa" });
      setBookings(bookings.map(b => b._id === id ? { ...b, status: "confirmed" } : b));
      setPayments({ ...payments, [id]: res.data.payment });
      alert("Payment successful! Please upload your payment proof screenshot below.");
    } catch (err) {
      alert(err.response?.data?.message || "Payment failed");
    }
  };

  const handleProofUpload = async (bookingId) => {
    let paymentId = payments[bookingId]?._id;
    const file = proofFiles[bookingId];
    if (!file) return;

    setUploadingProof({ ...uploadingProof, [bookingId]: true });
    try {
      if (!paymentId) {
        const res = await api.get(`/payments/booking/${bookingId}`);
        paymentId = res.data.payment._id;
      }

      const form = new FormData();
      form.append("image", file);
      await api.post(`/payments/${paymentId}/upload-proof`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Proof uploaded successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setUploadingProof({ ...uploadingProof, [bookingId]: false });
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">My Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-gray-500">No bookings yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {bookings.map((b) => (
            <div key={b._id} className="border rounded-2xl p-5 bg-white">
              <h2 className="font-bold text-lg text-gray-900">{b.room?.title || "Deleted room"}</h2>
<p className="text-sm text-gray-500">{b.room?.location?.city || "-"}</p>
              <p className="mt-1 text-gray-700">
                {new Date(b.moveInDate).toLocaleDateString()} → {new Date(b.moveOutDate).toLocaleDateString()}
              </p>
              <p className="font-semibold mt-1 text-teal-800">Total: Rs. {b.totalPrice}</p>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                b.status === "confirmed" ? "bg-green-100 text-green-700" :
                b.status === "cancelled" ? "bg-red-100 text-red-700" :
                "bg-yellow-100 text-yellow-700"
              }`}>
                {b.status}
              </span>

              {b.status === "pending" && (
                <div className="mt-3 flex gap-2">
                  <button onClick={() => handlePay(b._id)} className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold">
                    Pay Now
                  </button>
                  <button onClick={() => handleCancel(b._id)} className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl text-sm">
                    Cancel
                  </button>
                </div>
              )}

              {b.status === "confirmed" && (
                <div className="mt-4 border-t pt-4">
                  <p className="text-sm font-medium mb-2 text-gray-700">Upload payment proof screenshot:</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProofFiles({ ...proofFiles, [b._id]: e.target.files[0] })}
                    className="mb-2 text-sm"
                  />
                  <button
                    onClick={() => handleProofUpload(b._id)}
                    disabled={!proofFiles[b._id] || uploadingProof[b._id]}
                    className="bg-teal-800 hover:bg-teal-900 text-white px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-50 block"
                  >
                    {uploadingProof[b._id] ? "Uploading..." : "Upload Proof"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;