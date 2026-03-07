// export const BASE_URL = "http://localhost:3000/api"

// export const BASE_URL = "https://notes-app-crud-154o.onrender.com/api"

const isLocal =
  location.hostname === "localhost" ||
  location.hostname === "127.0.0.1";

export const BASE_URL = isLocal
  ? "http://localhost:3000/api"
  : "https://notes-app-crud-154o.onrender.com/api";
