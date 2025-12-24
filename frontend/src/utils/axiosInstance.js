import axios from "axios";
import { BASE_URL } from "./constants";


const axiosInstance = axios.create({
  baseURL: BASE_URL
})

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if(token){
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// axiosInstance.interceptors.response.use(successFn, errorFn)
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance
