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

// ===== COURSES =====
export const getCourses = async (params = {}) => {
  const { data } = await axiosInstance.get("/courses", { params });
  return data;
};

export const getCourseById = async (id) => {
  const { data } = await axiosInstance.get(`/courses/${id}`);
  return data;
};

export const createCourse = async (courseData) => {
  const { data } = await axiosInstance.post("/courses", courseData);
  return data;
};

export const updateCourse = async ({ id, formData }) => {
  const { data } = await axiosInstance.put(`/courses/${id}`, formData);
  return data;
};

export const deleteCourse = async (id) => {
  const { data } = await axiosInstance.delete(`/courses/${id}`);
  return data;
};

export const publishCourse = async (id) => {
  const { data } = await axiosInstance.put(`/courses/${id}/publish`);
  return data;
};

// ===== COURSE TEACHERS =====
export const getCourseTeachers = async (courseId) => {
  const { data } = await axiosInstance.get(`/courses/${courseId}/teachers`);
  return data;
};

export const addCourseTeacher = async ({ courseId, teacherId }) => {
  const { data } = await axiosInstance.post(`/courses/${courseId}/teachers`, {
    teacherId,
  });
  return data;
};

export const removeCourseTeacher = async ({ courseId, teacherId }) => {
  const { data } = await axiosInstance.delete(
    `/courses/${courseId}/teachers/${teacherId}`,
  );
  return data;
};

// ===== USERS (cho phần list giáo viên) =====
export const getUsers = async (params = {}) => {
  const { data } = await axiosInstance.get("/users", { params });
  return data;
};

export const getUserById = async (id) => {
  const { data } = await axiosInstance.get(`/users/${id}`);
  return data;
};

export const createUser = async (userData) => {
  const { data } = await axiosInstance.post("/users", userData);
  return data;
};

export const updateUser = async ({ id, ...userData }) => {
  const { data } = await axiosInstance.put(`/users/${id}`, userData);
  return data;
};

export const deleteUser = async (id) => {
  const { data } = await axiosInstance.delete(`/users/${id}`);
  return data;
};
