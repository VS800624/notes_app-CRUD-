import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { loginSuccess, setPremiumStatus } from "../utils/userSlice";
import { useDispatch, useSelector } from "react-redux";
import NoteCard from "./NoteCard";

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
  const dispatch  = useDispatch()

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

  const verifyPremiumUser = async () => {
    const res = await axiosInstance.get("/premium/verify");
    console.log("Premium verify response:", res.data);
    
    if (res.data.isPremium) {
      // setIsUserPremium(true);
      dispatch(setPremiumStatus(res.data.isPremium))
    }
  };

   useEffect(() => {
    verifyPremiumUser();
  }, []);
  
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

      // Show confirmation alert
      const isConfirmed = window.confirm(
        "Are you sure you want to delete this item?",
      );

      // If user clicks Cancel, stop here
      if (!isConfirmed) return;

      const res = await axiosInstance.delete(`/notes/${id}`);
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
      setDeleteShowToast(true);
      setTimeout(() => {
        setDeleteShowToast(false);
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const updateNote = async (id, action) => {
    try {
      const res = await axiosInstance.put(`/notes/${action}/${id}`);
      const updatedNote = res.data.note;
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === updatedNote._id ? updatedNote : note,
        ),
      );
     setToastMessage(res.data.message)
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredNotes =
    view === "active"
      ? notes.filter((note) => !note.isArchived)
      : notes.filter((note) => note.isArchived);

  const pinnedNotes = filteredNotes.filter((note) => note.isPinned);
  const otherNotes = filteredNotes.filter((note) => !note.isPinned);

  return (
    <div className="min-h-screen bg-slate-800 p-10">
      <div className="flex bg-slate-800 rounded-lg p-1 w-fit mx-auto">
        <button
          onClick={() => setView("active")}
          className={`px-4 py-2 rounded-md ${
            view === "active"
              ? "bg-blue-600 text-white"
              : "bg-slate-700 text-gray-300"
          }`}
        >
          Notes
        </button>

        <button
          onClick={() => setView("archived")}
          className={`px-4 py-2 rounded-md ${
            view === "archived"
              ? "bg-blue-600 text-white"
              : "bg-slate-700 text-gray-300"
          }`}
        >
          Archived
        </button>
      </div>

      <div className="min-h-screen bg-slate-800 px-4 my-10">
        {loading ? (
          <p className="text-center text-white my-10">Loading...</p>
        ) : notes.length === 0 ? (
          <p className="flex justify-center   text-xl font-semibold">
            No notes found!
          </p>
        ) : (
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* PINNED NOTES */}
            {pinnedNotes.length > 0 && (
              <>
                <h2 className="text-slate-400 text-sm mb-4">📌 PINNED</h2>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
                  {pinnedNotes.map((note) => (
                    <NoteCard
                      key={note._id}
                      {...note}
                      handleDelete={handleDelete}
                      updateNote={updateNote}
                    />
                  ))}
                </div>
              </>
            )}

            {/* OTHER NOTES */}
            {otherNotes.length > 0 && (
              <>
                <h2 className="text-slate-400 text-sm mb-4">OTHERS</h2>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {otherNotes.map((note) => (
                    <NoteCard
                      key={note._id}
                      {...note}
                      handleDelete={handleDelete}
                      updateNote={updateNote}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {showDeleteToast && (
        <div className="toast toast-top toast-center my-10  z-50">
          <div className="alert alert-error alert-outline">
            <span>Note deleted successfully</span>
          </div>
        </div>
      )}

      {showToast && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert alert-success alert-outline">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Note;
