import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { loginSuccess } from "../utils/userSlice";
import { useSelector } from "react-redux";

const Note = () => {
  const [notes, setNotes] = useState([]);
  const [showDeleteToast, setDeleteShowToast] = useState(false);
  const isLoggedIn = useSelector((state) => state.user.isAuthenticated);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const getNotes = async () => {
    try {
      const res = await axiosInstance.get("/notes", {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
        // withCredentials: true,
      });
      // console.log(res.data.data)
      setNotes(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) return;
    getNotes().finally(() => setLoading(false));

    if (location.state?.toast) {
      setToastMessage(location.state.toast);
      setShowToast(true);
    }

    // clear state so back button won't trigger toast
    //  replace: true rewrites history and clears state, so back navigation doesn’t re-trigger logic.
    //We cleared route state by replacing the current history entry using navigate(path, { replace: true }), so the toast-triggering state doesn’t persist
    navigate(location.pathname, { replace: true });

    const timer = setTimeout(() => {
      setShowToast(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isLoggedIn]);

  const handleDelete = async (id) => {
    try {
      // const token = localStorage.getItem("token");

      const res = await axiosInstance.delete(`/notes/delete/${id}`);
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
      setDeleteShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="px-4 my-10">
        {loading ? (
          <p className="text-center my-10">Loading...</p>
        ) : notes.length === 0 ? (
          <p className="flex justify-center   text-xl font-semibold">
            No notes found!
          </p>
        ) : (
          notes.map(({ title, description, _id }) => (
            <div
              key={_id}
              className="flex items-start my-10 gap-4 max-w-4xl mx-auto"
            >
              <div className="border p-4 rounded-md flex-1">
                <h2 className="font-semibold text-lg">{title}</h2>
                <p className="text-gray-600 mt-1">{description}</p>
              </div>

              <div className="flex flex-col gap-2">
                <Link
                  to={`/edit/${_id}`}
                  className="px-4 py-2 font-semibold text-white text-center rounded bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Update
                </Link>
                <button
                  className="px-4 py-2 font-semibold text-white rounded bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 transition-all duration-300 shadow-md hover:shadow-lg"
                  onClick={() => handleDelete(_id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showDeleteToast && (
        <div className="toast toast-top toast-center my-10  z-50">
          <div className="alert alert-error">
            <span>Note deleted successfully</span>
          </div>
        </div>
      )}

      {showToast && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert alert-success">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Note;
