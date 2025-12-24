import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { loginSuccess } from "../utils/userSlice";
import { useSelector } from "react-redux";

const Note = () => {
  const [notes, setNotes] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const isLoggedIn = useSelector((state) => state.user.isAuthenticated);
  const [loading, setLoading] = useState(true);

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
  }, [isLoggedIn]);

  const handleDelete = async (id) => {
    try {
      // const token = localStorage.getItem("token");

      const res = await axiosInstance.delete(`/notes/delete/${id}`);
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
      setShowToast(true);
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
                  className="px-4 py-2 font-semibold bg-blue-500 text-white rounded hover:bg-blue-600 text-center"
                >
                  Update
                </Link>
                <button
                  className="px-4 py-2 font-semibold bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => handleDelete(_id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showToast && (
        <div className="toast toast-top toast-center my-10  z-50">
          <div className="alert alert-error">
            <span>Note deleted successfully</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Note;
