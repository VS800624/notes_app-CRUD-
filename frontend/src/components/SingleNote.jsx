import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axiosInstance from '../utils/axiosInstance'

const SingleNote = () => {

  const {id} = useParams()
  const [note, setNote] = useState(null)

  const getNote = async() => {
    try{
      const res = await axiosInstance.get(`/notes/${id}`)
      setNote(res.data.note)
    }catch(err){
      console.error(err)
    }
  } 

  useEffect(() => {
    getNote()
  }, [])

  if (!note) return <p className="text-center mt-10">Loading...</p>;
  
  return (
     <div className="max-w-4xl mx-auto px-6 py-12">

      <div className="bg-gradient-to-br from-slate-800 to-slate-900
      border border-slate-700 rounded-xl p-8 shadow-xl">

        <h1 className="text-2xl font-bold text-white">
          {note.title}
        </h1>

        <p className="text-slate-400 mt-6 whitespace-pre-wrap break-words">
          {note.description}
        </p>

      </div>

    </div>
  )
}

export default SingleNote