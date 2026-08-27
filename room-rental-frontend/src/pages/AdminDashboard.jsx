import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reports, setReports] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingPage, setBookingPage] = useState(1);
  const [roomPage, setRoomPage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const [userSearch, setUserSearch] = useState("");

  useEffect(() => {
    Promise.all([
      api.get("/admin/stats"),
      api.get("/admin/users"),
      api.get("/admin/rooms"),
      api.get("/admin/bookings"),
      api.get("/admin/revenue-chart"),
      api.get("/admin/reports"),
    ])
      .then(([statsRes, usersRes, roomsRes, bookingsRes, chartRes, reportsRes]) => {
        setStats(statsRes.data);
        setUsers(usersRes.data.users);
        setRooms(roomsRes.data.rooms);
        setBookings(bookingsRes.data.bookings);
        setChartData(chartRes.data.data);
        setReports(reportsRes.data.reports);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleDeleteUser = async (id, name) => {
    if (!confirm(`Delete user "${name}"?`)) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handleDeleteRoom = async (id, title) => {
    if (!confirm(`Delete room "${title}"?`)) return;
    try {
      await api.delete(`/admin/rooms/${id}`);
      setRooms(rooms.filter((r) => r._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete room");
    }
  };

  const handleReportStatus = async (id, status) => {
    try {
      await api.put(`/admin/reports/${id}`, { status });
      setReports(reports.map(r => r._id === id ? { ...r, status } : r));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update report");
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Admin Dashboard</h1>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          <StatCard label="Total Users" value={stats.totalUsers} />
          <StatCard label="Owners" value={stats.totalOwners} />
          <StatCard label="Tenants" value={stats.totalTenants} />
          <StatCard label="Total Rooms" value={stats.totalRooms} />
          <StatCard label="Total Bookings" value={stats.totalBookings} />
          <StatCard label="Platform Revenue" value={`Rs. ${stats.totalPlatformRevenue}`} />
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4 text-gray-900">Revenue Over Time</h2>
      <div className="border rounded-2xl p-6 bg-white mb-12" style={{ height: 300 }}>
        {chartData.length === 0 ? (
          <p className="text-gray-400 text-sm">No revenue data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#0f766e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-4 text-gray-900">Reported Listings ({reports.length})</h2>
      <div className="overflow-x-auto border rounded-2xl mb-12">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3">Room</th>
              <th className="px-4 py-3">Reported By</th>
              <th className="px-4 py-3">Reason</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r._id} className="border-t">
                <td className="px-4 py-3 font-medium text-gray-900">{r.room?.title || "Deleted room"}</td>
                <td className="px-4 py-3 text-gray-600">{r.reportedBy?.name}</td>
                <td className="px-4 py-3 text-gray-600">{r.reason}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    r.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                    r.status === "reviewed" ? "bg-green-100 text-green-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {r.status === "pending" && (
                    <>
                      <button onClick={() => handleReportStatus(r._id, "reviewed")} className="text-green-600 hover:underline text-xs mr-2">
                        Mark Reviewed
                      </button>
                      <button onClick={() => handleReportStatus(r._id, "dismissed")} className="text-gray-500 hover:underline text-xs">
                        Dismiss
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-gray-900">All Bookings ({bookings.length})</h2>
      <div className="overflow-x-auto border rounded-2xl mb-4">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3">Room</th>
              <th className="px-4 py-3">Tenant</th>
              <th className="px-4 py-3">Dates</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Payment</th>
            </tr>
          </thead>
          <tbody>
            {bookings.slice((bookingPage - 1) * 10, bookingPage * 10).map((b) => (
              <tr key={b._id} className="border-t">
                <td className="px-4 py-3 font-medium text-gray-900">
                  {b.room?.title || <span className="text-gray-400 italic">Deleted room</span>}
                </td>
                <td className="px-4 py-3 text-gray-600">{b.user?.name}</td>
                <td className="px-4 py-3 text-gray-600">
                  {new Date(b.moveInDate).toLocaleDateString()} → {new Date(b.moveOutDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    b.status === "confirmed" ? "bg-green-100 text-green-700" :
                    b.status === "cancelled" ? "bg-red-100 text-red-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>
                    {b.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {b.payment ? `Rs. ${b.payment.amount} (${b.payment.method})` : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {bookings.length > 10 && (
        <div className="flex justify-center gap-2 mb-12">
          <button onClick={() => setBookingPage(p => Math.max(1, p - 1))} disabled={bookingPage === 1} className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-40">
            Previous
          </button>
          <span className="text-sm text-gray-500 px-2 py-1.5">
            Page {bookingPage} of {Math.ceil(bookings.length / 10)}
          </span>
          <button onClick={() => setBookingPage(p => Math.min(Math.ceil(bookings.length / 10), p + 1))} disabled={bookingPage === Math.ceil(bookings.length / 10)} className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-40">
            Next
          </button>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4 text-gray-900">All Users ({filteredUsers.length})</h2>

      <input
        type="text"
        placeholder="Search by name..."
        value={userSearch}
        onChange={(e) => { setUserSearch(e.target.value); setUserPage(1); }}
        className="border rounded-xl px-4 py-2 mb-4 w-full max-w-sm text-sm"
      />

      <div className="overflow-x-auto border rounded-2xl mb-4">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.slice((userPage - 1) * 10, userPage * 10).map((u) => (
              <tr key={u._id} className="border-t">
                <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                <td className="px-4 py-3 text-gray-600">{u.email}</td>
                <td className="px-4 py-3 text-gray-600">{u.phone || "-"}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    u.role === "admin" ? "bg-purple-100 text-purple-700" :
                    u.role === "owner" ? "bg-blue-100 text-blue-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  {u.role !== "admin" && (
                    <button onClick={() => handleDeleteUser(u._id, u.name)} className="text-red-600 hover:underline text-xs">
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length > 10 && (
        <div className="flex justify-center gap-2 mb-12">
          <button onClick={() => setUserPage(p => Math.max(1, p - 1))} disabled={userPage === 1} className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-40">
            Previous
          </button>
          <span className="text-sm text-gray-500 px-2 py-1.5">
            Page {userPage} of {Math.ceil(filteredUsers.length / 10)}
          </span>
          <button onClick={() => setUserPage(p => Math.min(Math.ceil(filteredUsers.length / 10), p + 1))} disabled={userPage === Math.ceil(filteredUsers.length / 10)} className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-40">
            Next
          </button>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4 text-gray-900">All Rooms ({rooms.length})</h2>
      <div className="overflow-x-auto border rounded-2xl mb-4">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {rooms.slice((roomPage - 1) * 10, roomPage * 10).map((r) => (
              <tr key={r._id} className="border-t">
                <td className="px-4 py-3 font-medium text-gray-900">{r.title}</td>
                <td className="px-4 py-3 text-gray-600">{r.owner?.name || "Unknown"}</td>
                <td className="px-4 py-3 text-gray-600">{r.location?.city}</td>
                <td className="px-4 py-3 text-gray-600">Rs. {r.pricePerMonth}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    r.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {r.isAvailable ? "Available" : "Not available"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link to={`/edit-room/${r._id}`} className="text-blue-600 hover:underline text-xs mr-3">
                    Edit
                  </Link>
                  <button onClick={() => handleDeleteRoom(r._id, r.title)} className="text-red-600 hover:underline text-xs">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rooms.length > 10 && (
        <div className="flex justify-center gap-2">
          <button onClick={() => setRoomPage(p => Math.max(1, p - 1))} disabled={roomPage === 1} className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-40">
            Previous
          </button>
          <span className="text-sm text-gray-500 px-2 py-1.5">
            Page {roomPage} of {Math.ceil(rooms.length / 10)}
          </span>
          <button onClick={() => setRoomPage(p => Math.min(Math.ceil(rooms.length / 10), p + 1))} disabled={roomPage === Math.ceil(rooms.length / 10)} className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-40">
            Next
          </button>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="border rounded-2xl p-5 bg-white">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-teal-800 mt-1">{value}</p>
    </div>
  );
}

export default AdminDashboard;