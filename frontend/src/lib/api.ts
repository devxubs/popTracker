import axios from "axios";

/**
 * Central Axios instance used by every API call in the app.
 * Base URL comes from the environment so it's easy to point at
 * a different backend in staging/production without code changes.
 */
const api = axios.create({
   baseURL:
      process.env.NEXT_PUBLIC_API_URL ||
      "https://poptracker-backend.onrender.com/api",
   headers: {
      "Content-Type": "application/json",
   },
});

export default api;
