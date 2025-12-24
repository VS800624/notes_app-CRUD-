import React, { useEffect } from 'react'
import Navbar from './Navbar'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from "react-redux";
import axios from 'axios';
import { BASE_URL } from '../utils/constants';

const Body = () => {
  // (reduxState) => reduxState.user.isAuthenticated
  const isLoggedIn = useSelector((state) => state.user.isAuthenticated);
  //or const isLoggedIn = useSelector((store) => store.user.isAuthenticated)

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;

  axios.get(BASE_URL + "/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  .then((res) => {
    dispatch(loginSuccess({
      user: res.data.user,
      token,
    }));
  })
  .catch(() => {
    localStorage.removeItem("token");
  });
}, []);


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