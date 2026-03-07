import { Link, NavLink, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { useDispatch } from "react-redux";
import { logout } from "../utils/userSlice";
import { useState } from "react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Show confirmation alert
      const isConfirmed = window.confirm(
        "Are you sure you want to logout?",
      );

      // If user clicks Cancel, stop here
      if (!isConfirmed) return;
      
      await axiosInstance.post("/logout");
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="w-full bg-slate-900 border-b border-slate-700 shadow-sm fixed top-0 left-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl md:text-2xl font-bold text-blue-600 tracking-wide"
        >
          NotesApp
        </Link>

        {/* Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col  gap-1"
        >
          <span
            className={`h-0.5 w-6 bg-white transition ${isOpen && "rotate-45 translate-y-1.5"}`}
          ></span>
          <span
            className={`h-0.5 w-6 bg-white transition ${isOpen && "opacity-0"}`}
          ></span>
          <span
            className={`h-0.5 w-6 bg-white transition ${isOpen && "-rotate-45 -translate-y-1.5"}`}
          ></span>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4 font-medium">
          <NavLink
            to="/create"
            className="px-4 py-2 rounded-lg text-white font-semibold
            bg-gradient-to-r from-green-500 to-emerald-600
            hover:scale-105 hover:shadow-md
            transition"
          >
            + Create
          </NavLink>

          <NavLink
            to="/premium"
            className="px-4 py-2 rounded-lg text-white font-semibold
            bg-gradient-to-r from-purple-600 to-pink-600
            hover:scale-105 hover:shadow-md
            transition"
          >
            💎 Premium
          </NavLink>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg text-white font-semibold
            bg-gradient-to-r from-red-500 to-orange-500
            hover:scale-105 hover:shadow-md
            transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute right-4 top-16 mt-4  border rounded-lg shadow-lg transition-all duration-300 ${
          isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="flex flex-col p-3 gap-3 w-fit">
          <NavLink
            to="/create"
            onClick={() => setIsOpen(false)}
            className="text-center px-4 py-2 rounded-lg text-white font-semibold
      bg-gradient-to-r from-green-500 to-emerald-600"
          >
            + Create
          </NavLink>

          <NavLink
            to="/premium"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 rounded-lg text-white font-semibold
      bg-gradient-to-r from-purple-600 to-pink-600"
          >
            💎 Premium
          </NavLink>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg text-white font-semibold
      bg-gradient-to-r from-red-500 to-orange-500"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
