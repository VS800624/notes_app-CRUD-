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
  const [view, setView] = useState("active");

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

      const res = await axiosInstance.delete(`/notes/${id}`);
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
      setDeleteShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const updateNote = async (id, action) => {
    try {
      const res = await axiosInstance.put(`/notes/${action}/${id}`);
      const updatedNote = res.data.note;
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note._id === updatedNote._id ? updatedNote : note)),
      );
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
          <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {notes.filter(note => !note.isArchived).map(({ title, description, _id, isPinned }) => (
                <div
                  key={_id}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 
                    border border-slate-700 rounded-xl p-5 shadow-lg hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between"
                >
                  {/* NOTE CONTENT */}
                  <Link to={`/note/${_id}`}>
                    <div>
                      <div className="flex justify-between items-start">
                        <h2 className="text-lg font-semibold text-white">
                          {title}
                        </h2>

                        {isPinned && <span>📌</span>}
                      </div>

                      <p className="text-slate-400 mt-2 text-sm break-words line-clamp-3">
                        {description}
                      </p>
                    </div>
                  </Link>

                  {/* ACTION BUTTONS */}
                  <div className="flex gap-2 mt-6 flex-wrap">
                    <Link
                      to={`/edit/${_id}`}
                      className="px-3 py-1 text-sm rounded-md bg-blue-500 hover:bg-blue-600 text-white transition"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(_id)}
                      className="px-3 py-1 text-sm rounded-md bg-red-500 hover:bg-red-600 text-white transition"
                    >
                      Delete
                    </button>

                    <button
                      onClick={() => updateNote(_id,"pin")}
                      className="px-3 py-1 text-sm rounded-md bg-slate-700 hover:bg-slate-600 text-white transition"
                    >
                      📌
                    </button>

                    <button
                      onClick={() => updateNote(_id,"archive")}
                      className="px-3 py-1 text-sm rounded-md bg-slate-700 hover:bg-slate-600 text-white transition"
                    >
                      📦
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
