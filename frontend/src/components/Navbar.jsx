import { Link, NavLink, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { useDispatch } from "react-redux";
import { logout } from "../utils/userSlice";

function Navbar() {
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
    <nav className="w-full bg-white border-b shadow-sm fixed top-0 left-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          NotesApp
        </Link>

        {/* Right Menu */}
        <ul className="flex items-center gap-6  font-medium">

          <NavLink
            to="/create"
            className="px-4 py-2 rounded-md text-white font-semibold
             bg-gradient-to-r from-green-500 to-emerald-600
             hover:from-green-600 hover:to-emerald-700
             transition-all duration-300"
          >
            + Create
          </NavLink>

          <NavLink
            to="/premium"
            className="px-4 py-2 rounded-md text-white font-semibold
             bg-gradient-to-r from-purple-600 to-pink-600
             hover:from-purple-700 hover:to-pink-700
             transition-all duration-300"
          >
            💎 Premium
          </NavLink>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-md text-white font-semibold
             bg-gradient-to-r from-red-500 to-orange-500
             hover:from-red-600 hover:to-orange-600
             transition-all duration-300"
          >
            Logout
          </button>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
