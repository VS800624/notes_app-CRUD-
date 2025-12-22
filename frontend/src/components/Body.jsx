import React from 'react'
import Navbar from './Navbar'
import { Navigate, Outlet } from 'react-router-dom'

const Body = () => {
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  if(!isLoggedIn){
    return <Navigate to= "/login"/>
  }
  
  return (
    <>
      <Navbar/>
      <Outlet/>
    </>
  )
}

export default Body

// Golden Rule (Memorize this)
// If you are inside return or conditional rendering → use <Navigate />
// If you are inside a function / event / API success → use useNavigate()