import React from 'react'
import Navbar from './Navbar'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from "react-redux";

const Body = () => {
  // (reduxState) => reduxState.user.isAuthenticated
  const isLoggedIn = useSelector((state) => state.user.isAuthenticated);
  //or const isLoggedIn = useSelector((store) => store.user.isAuthenticated)

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