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

export const changePassword = async ({ currentPassword, newPassword }) => {
  const { data } = await axiosInstance.post("/auth/change-password", {
    currentPassword,
    newPassword,
  });
  return data;
};

export const updateProfile = async (formData) => {
  const { data } = await axiosInstance.put("/auth/me", formData);
  return data;
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

// ===== USERS =====
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

export const updateUser = async ({ id, formData }) => {
  const { data } = await axiosInstance.put(`/users/${id}`, formData);
  return data;
};

export const deleteUser = async (id) => {
  const { data } = await axiosInstance.delete(`/users/${id}`);
  return data;
};

export const toggleUserActive = async (id) => {
  const { data } = await axiosInstance.put(`/users/${id}/toggle-active`);
  return data;
};

// ===== ADMIN =====
export const getAdminStats = async () => {
  const { data } = await axiosInstance.get("/admin/stats");
  return data;
};

// ===== ENROLLMENTS =====
export const getEnrollments = async (params = {}) => {
  const { data } = await axiosInstance.get("/enrollments", { params });
  return data;
};

export const createEnrollment = async ({ studentId, courseId }) => {
  const { data } = await axiosInstance.post("/enrollments", {
    studentId,
    courseId,
  });
  return data;
};

export const deleteEnrollment = async (id) => {
  const { data } = await axiosInstance.delete(`/enrollments/${id}`);
  return data;
};

// ===== STAFF =====
export const getStaffStats = async () => {
  const { data } = await axiosInstance.get("/staff/stats");
  return data;
};

// ===== ACADEMIC =====
export const getAcademicStats = async () => {
  const { data } = await axiosInstance.get("/academic/stats");
  return data;
};

// ===== TEACHER =====
export const getTeacherStats = async () => {
  const { data } = await axiosInstance.get("/teacher/stats");
  return data;
};

export const getTeacherCourses = async () => {
  const { data } = await axiosInstance.get("/teacher/courses");
  return data;
};

export const getTeacherCourseEnrollments = async (courseId) => {
  const { data } = await axiosInstance.get(
    `/teacher/courses/${courseId}/enrollments`,
  );
  return data;
};

// ===== STUDENT =====
export const selfEnroll = async (courseId) => {
  // Backend tự fill studentId = req.user.id khi role = STUDENT
  const { data } = await axiosInstance.post("/enrollments", { courseId });
  return data;
};

export const getStudentStats = async () => {
  const { data } = await axiosInstance.get("/student/stats");
  return data;
};

export const getStudentCourses = async () => {
  const { data } = await axiosInstance.get("/student/courses");
  return data;
};

export const getStudentQuizHistory = async () => {
  const { data } = await axiosInstance.get("/student/quiz-history");
  return data;
};

// ===== MODULES =====
export const createModule = async ({ courseId, ...moduleData }) => {
  const { data } = await axiosInstance.post(
    `/courses/${courseId}/modules`,
    moduleData,
  );
  return data;
};

export const updateModule = async ({ id, ...moduleData }) => {
  const { data } = await axiosInstance.put(`/modules/${id}`, moduleData);
  return data;
};

export const deleteModule = async (id) => {
  const { data } = await axiosInstance.delete(`/modules/${id}`);
  return data;
};

export const getModuleById = async (id) => {
  const { data } = await axiosInstance.get(`/modules/${id}`);
  return data;
};

// ===== LESSONS =====
export const getModuleLessons = async (moduleId) => {
  const { data } = await axiosInstance.get(`/modules/${moduleId}/lessons`);
  return data;
};

export const createLesson = async ({ moduleId, formData }) => {
  const { data } = await axiosInstance.post(
    `/modules/${moduleId}/lessons`,
    formData,
  );
  return data;
};

export const updateLesson = async ({ id, formData }) => {
  const { data } = await axiosInstance.put(`/lessons/${id}`, formData);
  return data;
};

export const deleteLesson = async (id) => {
  const { data } = await axiosInstance.delete(`/lessons/${id}`);
  return data;
};

// ===== FLASHCARD SETS =====
export const getModuleFlashcardSets = async (moduleId) => {
  const { data } = await axiosInstance.get(
    `/modules/${moduleId}/flashcard-sets`,
  );
  return data;
};

export const getFlashcardSetById = async (id) => {
  const { data } = await axiosInstance.get(`/flashcard-sets/${id}`);
  return data;
};

export const createFlashcardSet = async ({ moduleId, ...setData }) => {
  const { data } = await axiosInstance.post(
    `/modules/${moduleId}/flashcard-sets`,
    setData,
  );
  return data;
};

export const updateFlashcardSet = async ({ id, ...setData }) => {
  const { data } = await axiosInstance.put(`/flashcard-sets/${id}`, setData);
  return data;
};

export const deleteFlashcardSet = async (id) => {
  const { data } = await axiosInstance.delete(`/flashcard-sets/${id}`);
  return data;
};

// ===== FLASHCARDS =====
export const createFlashcard = async ({ setId, formData }) => {
  const { data } = await axiosInstance.post(
    `/flashcard-sets/${setId}/flashcards`,
    formData,
  );
  return data;
};

export const updateFlashcard = async ({ id, formData }) => {
  const { data } = await axiosInstance.put(`/flashcards/${id}`, formData);
  return data;
};

export const deleteFlashcard = async (id) => {
  const { data } = await axiosInstance.delete(`/flashcards/${id}`);
  return data;
};

// ===== QUIZZES =====
export const getModuleQuizzes = async (moduleId) => {
  const { data } = await axiosInstance.get(`/modules/${moduleId}/quizzes`);
  return data;
};

export const getQuizById = async (id) => {
  const { data } = await axiosInstance.get(`/quizzes/${id}`);
  return data;
};

export const createQuiz = async ({ moduleId, ...quizData }) => {
  const { data } = await axiosInstance.post(
    `/modules/${moduleId}/quizzes`,
    quizData,
  );
  return data;
};

export const updateQuiz = async ({ id, ...quizData }) => {
  const { data } = await axiosInstance.put(`/quizzes/${id}`, quizData);
  return data;
};

export const deleteQuiz = async (id) => {
  const { data } = await axiosInstance.delete(`/quizzes/${id}`);
  return data;
};

// ===== QUESTIONS =====
export const createQuestion = async ({ quizId, ...questionData }) => {
  const { data } = await axiosInstance.post(
    `/quizzes/${quizId}/questions`,
    questionData,
  );
  return data;
};

export const updateQuestion = async ({ id, ...questionData }) => {
  const { data } = await axiosInstance.put(`/questions/${id}`, questionData);
  return data;
};

export const deleteQuestion = async (id) => {
  const { data } = await axiosInstance.delete(`/questions/${id}`);
  return data;
};

// ===== QUIZ ATTEMPTS (student) =====
export const startQuizAttempt = async (quizId) => {
  const { data } = await axiosInstance.post(`/quizzes/${quizId}/attempts`);
  return data;
};

export const getMyQuizAttempts = async (quizId) => {
  const { data } = await axiosInstance.get(`/quizzes/${quizId}/my-attempts`);
  return data;
};

export const getAttempt = async (attemptId) => {
  const { data } = await axiosInstance.get(`/attempts/${attemptId}`);
  return data;
};

export const saveAttemptAnswer = async ({
  attemptId,
  questionId,
  selectedAnswers,
}) => {
  const { data } = await axiosInstance.post(`/attempts/${attemptId}/answers`, {
    questionId,
    selectedAnswers,
  });
  return data;
};

export const submitAttempt = async (attemptId) => {
  const { data } = await axiosInstance.post(`/attempts/${attemptId}/submit`);
  return data;
};

export const getAttemptResult = async (attemptId) => {
  const { data } = await axiosInstance.get(`/attempts/${attemptId}/result`);
  return data;
};

// ===== ANSWERS =====
export const createAnswer = async ({ questionId, ...answerData }) => {
  const { data } = await axiosInstance.post(
    `/questions/${questionId}/answers`,
    answerData,
  );
  return data;
};

export const updateAnswer = async ({ id, ...answerData }) => {
  const { data } = await axiosInstance.put(`/answers/${id}`, answerData);
  return data;
};

export const deleteAnswer = async (id) => {
  const { data } = await axiosInstance.delete(`/answers/${id}`);
  return data;
};
