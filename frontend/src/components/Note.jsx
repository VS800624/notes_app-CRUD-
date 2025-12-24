import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const Note = () => {
  const [notes, setNotes] = useState([]);
  const [showToast, setShowToast] = useState(false);

  const getNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get(BASE_URL + "/notes", {
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
    getNotes();
  }, []);

  const handleDelete = async (id) => {
    try {
      // const token = localStorage.getItem("token");

      const res = await axiosInstance.delete(`${BASE_URL}/notes/delete/${id}`,
         {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      });
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (err) {
      console.error(err);
    }
  };

  if (!notes || notes.length === 0) {
    return (
      <p className="flex justify-center my-10 text-xl font-semibold">
        No notes found!
      </p>
    );
  }

  return (
    <>
      {notes && (
        <div className=" px-4">
          <div className="flex items-center justify-between mt-20 mb-10 max-w-4xl mx-auto">
            <h1 className=" text-3xl font-bold">Notes</h1>
            <button className=" font-semibold  px-5 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition">
              <Link to="/create">Create</Link>
            </button>
          </div>
          {notes.map((note) => {
            const { title, description, _id } = note;
            return (
              <div
                key={_id}
                className="flex  items-start my-10 gap-4 max-w-4xl mx-auto"
              >
                {/* Note Card */}
                <div className="border p-4 rounded-md flex-1 text-left">
                  <h2 className="font-semibold text-lg">{title}</h2>
                  <p className="text-gray-600 mt-1">{description}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                  <button className="px-4 py-2 font-semibold bg-blue-500 text-white rounded hover:bg-blue-600">
                    <Link to={`/edit/${_id}`}>Update</Link>
                  </button>
                  <button
                    className="px-4 py-2 font-semibold bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => handleDelete(_id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-error">
            <span>Note deleted successfully</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Note;
