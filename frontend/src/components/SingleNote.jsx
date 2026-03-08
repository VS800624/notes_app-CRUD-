import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { ArrowBigLeft } from "lucide-react";

const SingleNote = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [note, setNote] = useState(null);

  const getNote = async () => {
    try {
      const res = await axiosInstance.get(`/note/${id}`);
      setNote(res.data.note);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getNote();
  }, []);

  if (!note) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-slate-800">
      <button
        className="bg-blue-600 mt-10 ml-20 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-800 transition"
        onClick={() => navigate(-1)}
      >
        <ArrowBigLeft />
      </button>
      <div >
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div
            className="bg-gradient-to-br from-slate-800 to-slate-900
      border border-slate-700 rounded-xl p-8 shadow-xl"
          >
            <h1 className="text-2xl font-bold text-white">{note.title}</h1>

            <p className="text-slate-400 mt-6 whitespace-pre-wrap break-words">
              {note.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleNote;
