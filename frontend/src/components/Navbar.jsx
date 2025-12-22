import { Link, NavLink } from "react-router-dom";

function Navbar({ isLoggedIn }) {
  return (
    <nav className="w-full bg-white border-b shadow-sm fixed top-0 left-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          NotesApp
        </Link>

        {/* Right Menu */}
        <ul className="flex items-center gap-6 text-gray-700 font-medium">
          {!isLoggedIn ? (
            <>
              <NavLink
                to="/login"
                className="hover:text-blue-600 transition"
              >
                Login
              </NavLink>

              <NavLink
                to="/signup"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Signup
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/notes"
                className="hover:text-blue-600 transition"
              >
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
