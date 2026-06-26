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

export const getStudentProgress = async () => {
  const { data } = await axiosInstance.get("/student/progress");
  return data;
};

export const getCompletedLessons = async (courseId) => {
  const { data } = await axiosInstance.get(
    `/student/courses/${courseId}/completed-lessons`,
  );
  return data;
};

export const markLessonComplete = async (lessonId) => {
  const { data } = await axiosInstance.post(`/lessons/${lessonId}/complete`);
  return data;
};

export const unmarkLessonComplete = async (lessonId) => {
  const { data } = await axiosInstance.delete(`/lessons/${lessonId}/complete`);
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

// ===== LESSON DOCUMENTS =====
export const attachLessonDocument = async ({ lessonId, documentId }) => {
  const { data } = await axiosInstance.post(`/lessons/${lessonId}/documents`, {
    documentId,
  });
  return data;
};

export const detachLessonDocument = async ({ lessonId, documentId }) => {
  const { data } = await axiosInstance.delete(
    `/lessons/${lessonId}/documents/${documentId}`,
  );
  return data;
};

export const reorderLessonDocuments = async ({ lessonId, documentIds }) => {
  const { data } = await axiosInstance.put(
    `/lessons/${lessonId}/documents/order`,
    { documentIds },
  );
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
// Accept hoặc plain object (JSON) hoặc FormData (multipart với audio/image)
export const createQuestion = async ({ quizId, ...questionData }) => {
  // formData được truyền dưới key "formData" để rõ ràng
  const payload = questionData.formData || questionData;
  const { data } = await axiosInstance.post(
    `/quizzes/${quizId}/questions`,
    payload,
  );
  return data;
};

export const updateQuestion = async ({ id, ...questionData }) => {
  const payload = questionData.formData || questionData;
  const { data } = await axiosInstance.put(`/questions/${id}`, payload);
  return data;
};

export const deleteQuestion = async (id) => {
  const { data } = await axiosInstance.delete(`/questions/${id}`);
  return data;
};

// ===== DOCUMENTS (học liệu) =====
export const getDocuments = async (params = {}) => {
  const { data } = await axiosInstance.get("/documents", { params });
  return data;
};

export const getDocumentSources = async () => {
  const { data } = await axiosInstance.get("/documents/sources");
  return data.data;
};

export const getDocumentById = async (id) => {
  const { data } = await axiosInstance.get(`/documents/${id}`);
  return data;
};

export const createDocument = async (formData) => {
  const { data } = await axiosInstance.post("/documents", formData);
  return data;
};

export const updateDocument = async ({ id, formData }) => {
  const { data } = await axiosInstance.put(`/documents/${id}`, formData);
  return data;
};

export const deleteDocument = async (id) => {
  const { data } = await axiosInstance.delete(`/documents/${id}`);
  return data;
};

// Track download / view (best-effort, không cần await trên UI)
export const trackDocumentDownload = (id) =>
  axiosInstance.post(`/documents/${id}/download`).catch(() => null);

export const trackDocumentView = (id) =>
  axiosInstance.post(`/documents/${id}/view`).catch(() => null);

// Student review (rating + comment)
export const reviewDocument = async ({ documentId, rating, comment }) => {
  const { data } = await axiosInstance.post(
    `/documents/${documentId}/reviews`,
    { rating, comment },
  );
  return data;
};

export const deleteMyDocumentReview = async (documentId) => {
  const { data } = await axiosInstance.delete(
    `/documents/${documentId}/reviews/me`,
  );
  return data;
};

// Teacher feedback (chỉ nội dung)
export const feedbackDocument = async ({ documentId, content }) => {
  const { data } = await axiosInstance.post(
    `/documents/${documentId}/feedbacks`,
    { content },
  );
  return data;
};

export const deleteMyDocumentFeedback = async (documentId) => {
  const { data } = await axiosInstance.delete(
    `/documents/${documentId}/feedbacks/me`,
  );
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

// ==================== CONTACT ====================
export const submitContact = async (payload) => {
  const { data } = await axiosInstance.post("/contact", payload);
  return data;
};

export const listContactMessages = async (params = {}) => {
  const { data } = await axiosInstance.get("/contact", { params });
  return data.data;
};

export const getContactStats = async () => {
  const { data } = await axiosInstance.get("/contact/stats");
  return data.data;
};

export const updateContactStatus = async ({ id, status }) => {
  const { data } = await axiosInstance.patch(`/contact/${id}/status`, { status });
  return data;
};

export const deleteContactMessage = async (id) => {
  const { data } = await axiosInstance.delete(`/contact/${id}`);
  return data;
};

// ==================== FORGOT PASSWORD ====================
export const forgotPassword = async (email) => {
  const { data } = await axiosInstance.post("/auth/forgot-password", { email });
  return data;
};

export const verifyResetToken = async (token) => {
  const { data } = await axiosInstance.get("/auth/verify-reset-token", {
    params: { token },
  });
  return data.data;
};

export const resetPassword = async ({ token, newPassword }) => {
  const { data } = await axiosInstance.post("/auth/reset-password", {
    token,
    newPassword,
  });
  return data;
};

// ==================== CERTIFICATE ====================
export const claimCertificate = async (courseId) => {
  const { data } = await axiosInstance.post("/certificates/claim", { courseId });
  return data;
};

export const listMyCertificates = async () => {
  const { data } = await axiosInstance.get("/certificates/me");
  return data.data;
};

export const getCertificateByNumber = async (certNumber) => {
  const { data } = await axiosInstance.get(
    `/certificates/by-number/${certNumber}`,
  );
  return data.data;
};

export const verifyCertificate = async (certNumber) => {
  const { data } = await axiosInstance.get(
    `/certificates/verify/${certNumber}`,
  );
  return data.data;
};

// ==================== EVALUATION ====================
export const upsertEvaluation = async (payload) => {
  const { data } = await axiosInstance.post("/evaluations", payload);
  return data;
};

export const listEvaluationsForCourse = async (courseId) => {
  const { data } = await axiosInstance.get(`/evaluations/course/${courseId}`);
  return data.data;
};

export const deleteEvaluation = async (id) => {
  const { data } = await axiosInstance.delete(`/evaluations/${id}`);
  return data;
};

export const getMyEvaluationForCourse = async (courseId) => {
  const { data } = await axiosInstance.get(
    `/evaluations/me/course/${courseId}`,
  );
  return data.data;
};

export const listMyEvaluations = async () => {
  const { data } = await axiosInstance.get("/evaluations/me");
  return data.data;
};

// ==================== LEADERBOARD ====================
export const getLeaderboard = async (courseId) => {
  const { data } = await axiosInstance.get(`/leaderboard/course/${courseId}`);
  return data.data;
};
