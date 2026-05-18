import { axiosInstance } from "./axios";

export const login = async (logindata) => {
  const res = await axiosInstance.post("/auth/login", logindata);
  return res.data;
};

export const signup = async (signupData) => {
  const res = await axiosInstance.post("/auth/register", signupData);
  return res.data;
};

export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    console.log("Error in getAuthUser:", error);
    return null;
  }
};
