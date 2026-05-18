import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3678/api",
  withCredentials: true,
});
