import { Link, NavLink, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { useDispatch } from "react-redux";
import { logout } from "../utils/userSlice";

function Navbar({ isLoggedIn }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/logout");
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="w-full bg-white border-b shadow-sm fixed top-0 left-0 z-50 mb-30">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          NotesApp
        </Link>

        {/* Right Menu */}
        <ul className="flex items-center gap-6 text-blue-700 font-medium">
          {!isLoggedIn ? (
            <>
              <NavLink
                to="/create"
                className="font-semibold px-5 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition"
              >
                Create
              </NavLink>

              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/" className="hover:text-blue-600 transition">
                My Notes
              </NavLink>

              <NavLink
                to="/create"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                + Create
              </NavLink>

              <button className="text-red-600 hover:text-red-700 transition">
                Logout
              </button>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
