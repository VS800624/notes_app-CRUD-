import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import { Navigate, Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import axiosInstance from '../utils/axiosInstance';
import { loginSuccess } from "../utils/userSlice";

const Body = () => {
  // (reduxState) => reduxState.user.isAuthenticated
  const isLoggedIn = useSelector((state) => state.user.isAuthenticated);
  //or const isLoggedIn = useSelector((store) => store.user.isAuthenticated)
  const dispatch = useDispatch()
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    setAuthChecked(true)
    return
  }

  axiosInstance.get("/notes")
  .then((res) => {
    dispatch(loginSuccess({
      user: res.data.user,
      token,
    }));
  })
  .catch(() => {
    localStorage.removeItem("token");
  })
   .finally(() => {
        setAuthChecked(true);
      });
}, [dispatch]);


  // ⏳ wait until auth check is complete
  if (!authChecked) {
    return null; // or loader
  }

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