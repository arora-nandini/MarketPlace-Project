import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../features/auth/authSlice";

export default function Navbar() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between">
      <Link to="/" className="font-bold text-lg">
        MarketPlace
      </Link>

      <div className="flex gap-4 items-center">
        <Link to="/projects">Projects</Link>

        {/* 🔵 Show Plagiarism Checker for all logged-in users */}
        {user && (
          <Link to="/plagiarism-checker">Plagiarism Checker</Link>
        )}

        {user ? (
          <>
            {/* 🔥 Only show Dashboard for sellers or admins */}
            {(user.role === "seller" || user.role === "admin") && (
              <Link to="/dashboard">Dashboard</Link>
            )}

            {/* Buyer Orders */}
            <Link to="/my-orders">My Orders</Link>

            <button
              onClick={() => dispatch(logout())}
              className="bg-red-500 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link
              to="/register"
              className="bg-blue-600 px-3 py-1 rounded"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
