import React from "react";
import { useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../utils/axiosInstance";
import { ArrowBigLeft } from 'lucide-react';

const CreateNote = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate()

  const handleCreate = async () => {
    if (!title || !description) {
      setError("All fields are required");
      return
    }
    try {
      const res = await axiosInstance.post(
        BASE_URL + "/notes/create",
        {
          title,
          description,
        },
        // { withCredentials: true }
      );
      navigate("/")
      setError("")
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen  items-start ">
      <button
        className="bg-blue-600 mt-10 ml-10 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-800 transition"
        onClick={() => navigate(-1)}
      >
        <ArrowBigLeft/>
      </button>
      <div className="max-w-xl mx-auto mt-10 bg-white text-black p-6 rounded-xl shadow-md">
        <h1 className="text-center text-2xl  font-bold mb-6 ">
          Create Note
        </h1>

        {/* Title */}
        <div className="mb-4 ">
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
          onClick={handleCreate}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default CreateNote;
