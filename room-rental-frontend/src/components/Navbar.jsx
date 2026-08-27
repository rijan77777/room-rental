import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";
import { useState, useEffect } from "react";
import api from "../services/api";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    if (user && user.role === "tenant") {
      api.get("/favorites/count")
        .then((res) => setFavCount(res.data.count))
        .catch((err) => console.error(err));
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-green-700 text-white shadow">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <Link to="/" className="text-2xl font-bold">
          Room Rental
        </Link>

        <div className="flex gap-6 items-center">
          <Link to="/" className="hover:text-yellow-300">
            Home
          </Link>

          <Link to="/rooms" className="hover:text-yellow-300">
            Rooms
          </Link>
          <Link to="/about" className="hover:text-yellow-300">
            About
          </Link>

          <Link to="/contact" className="hover:text-yellow-300">
            Contact
          </Link>

          {user ? (
            <>
              {user.role === "owner" && (
                <Link to="/my-rooms" className="hover:text-yellow-300">
                  My Rooms
                </Link>
              )}
              {user.role === "admin" && (
                <Link to="/admin" className="hover:text-yellow-300">
                  Admin
                </Link>
              )}
              {user.role === "tenant" && (
                <Link to="/my-bookings" className="hover:text-yellow-300">
                  My Bookings
                </Link>
              )}
              {user.role === "tenant" && (
                <Link to="/favorites" className="hover:text-yellow-300 relative">
                  Favorites
                  {favCount > 0 && (
                    <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {favCount}
                    </span>
                  )}
                </Link>
              )}
              {user.role === "owner" && (
                <Link to="/owner-bookings" className="hover:text-yellow-300">
                  Bookings
                </Link>
              )}
              {user.role === "owner" && (
                <Link to="/inquiries" className="hover:text-yellow-300">
                  Inquiries
                </Link>
              )}

              {(user.role === "owner" || user.role === "admin") && <NotificationBell />}

              <span className="text-sm">Hi, {user.name}</span>

              <button
                onClick={handleLogout}
                className="bg-white text-blue-700 px-3 py-1 rounded-md hover:bg-yellow-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-yellow-300">
                Login
              </Link>

              <Link to="/register" className="hover:text-yellow-300">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;