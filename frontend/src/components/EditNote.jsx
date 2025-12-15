import React from "react";
import { useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

const EditNote = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false)
  const {id} = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchNote = async () => {
      try{
        const res = await axios.get(`${BASE_URL}/note/${id}`, 
        {withCredentials: true}
      )
      setTitle(res.data.data.title)
      setDescription(res.data.data.description)
      }catch(err){
      setError("Failed to load note");
      }
    }
    fetchNote()
  }, [id])

  const handleEdit = async () => {
    if (!title || !description) {
      setError("All fields are required");
      return
    }
    try {
      const res = await axios.put(
        BASE_URL + "/notes/edit/" +id,
        {
          title,
          description,
        },
        { withCredentials: true }
      );
      
      setError("")
      setShowToast(true)
      setTimeout(() => {
        setShowToast(false)
      },3000)
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
      console.log(err);
    }
  };

  return (
    <>
    <div className="min-h-screen flex justify-center items-start  mt-10">
      <button
        className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-800 transition"
        onClick={() => navigate(-1)}
      >
        Back
      </button>
      <div className="w-full max-w-xl bg-gray-200 mt-20 text-gray-800 p-6 rounded-xl shadow-md">
        <h1 className="text-center text-2xl font-bold mb-6 ">
          Edit Note
        </h1>

        {/* Title */}
        <div className="mb-4">
          <label className="block font-semibold text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={title}
            placeholder="Enter note title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block font-semibold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={description}
            placeholder="Enter note description"
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <p className="text-red-500 my-[10px]">{error}</p>

        {/* Button */}
        <button
          className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-800 transition"
          onClick={handleEdit}
        >
          Save
        </button>
      </div>
    </div>
      {showToast && (<div className="toast toast-top toast-center">
        <div className="alert alert-success">
          <span>Note edited successfully.</span>
        </div>
      </div>)}
    </>
  );
};

export default EditNote;
