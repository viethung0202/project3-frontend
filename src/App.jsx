import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Layouts
import PublicLayout from "@/components/layout/PublicLayout";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Public pages
import HomePage from "@/pages/public/HomePage";
import LoginPage from "@/pages/public/LoginPage";
import RegisterPage from "@/pages/public/RegisterPage";
import ProfilePage from "@/pages/public/ProfilePage";
import PublicCoursesPage from "@/pages/public/CoursesPage";
import PublicCourseDetailPage from "@/pages/public/CourseDetailPage";

// Dashboards
import AdminDashboard from "@/pages/admin/AdminDashboard";
import UsersPage from "@/pages/admin/UsersPage";
import AcademicDashboard from "@/pages/academic/AcademicDashboard";
import CoursesPage from "@/pages/academic/CoursesPage";
import CreateCoursePage from "@/pages/academic/CreateCoursePage";
import CourseDetailPage from "@/pages/academic/CourseDetailPage";
import EditCoursePage from "@/pages/academic/EditCoursePage";
import ModuleDetailPage from "@/pages/academic/ModuleDetailPage";
import FlashcardSetDetailPage from "@/pages/academic/FlashcardSetDetailPage";
import QuizDetailPage from "@/pages/academic/QuizDetailPage";
import StaffDashboard from "@/pages/staff/StaffDashboard";
import TeachersPage from "@/pages/staff/TeachersPage";
import StudentsPage from "@/pages/staff/StudentsPage";
import EnrollmentsPage from "@/pages/staff/EnrollmentsPage";
import TeacherDashboard from "@/pages/teacher/TeacherDashboard";
import TeacherCoursesPage from "@/pages/teacher/TeacherCoursesPage";
import TeacherCourseDetailPage from "@/pages/teacher/TeacherCourseDetailPage";
import TeacherModuleDetailPage from "@/pages/teacher/TeacherModuleDetailPage";
import StudentDashboard from "@/pages/student/StudentDashboard";
import StudentCoursesPage from "@/pages/student/StudentCoursesPage";
import StudentCourseDetailPage from "@/pages/student/StudentCourseDetailPage";
import StudentModuleDetailPage from "@/pages/student/StudentModuleDetailPage";
import StudentFlashcardStudyPage from "@/pages/student/StudentFlashcardStudyPage";

// Common
import ForbiddenPage from "@/pages/ForbiddenPage";
import NotFoundPage from "@/pages/NotFoundPage";

export default function Apps() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<PublicCoursesPage />} />
          <Route path="/courses/:id" element={<PublicCourseDetailPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UsersPage />} />
        </Route>

        {/* Academic Staff (Giáo vụ) */}
        <Route
          path="/academic"
          element={
            <ProtectedRoute allowedRoles={["ACADEMIC_STAFF"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AcademicDashboard />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="courses/create" element={<CreateCoursePage />} />
          <Route path="courses/:id" element={<CourseDetailPage />} />
          <Route path="courses/:id/edit" element={<EditCoursePage />} />
          <Route path="modules/:id" element={<ModuleDetailPage />} />
          <Route
            path="flashcard-sets/:id"
            element={<FlashcardSetDetailPage />}
          />
          <Route path="quizzes/:id" element={<QuizDetailPage />} />
        </Route>

        {/* Admin Staff (Hành chính) */}
        <Route
          path="/staff"
          element={
            <ProtectedRoute allowedRoles={["ADMIN_STAFF"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StaffDashboard />} />
          <Route path="teachers" element={<TeachersPage />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="enrollments" element={<EnrollmentsPage />} />
        </Route>

        {/* Teacher */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={["TEACHER"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<TeacherDashboard />} />
          <Route path="courses" element={<TeacherCoursesPage />} />
          <Route
            path="courses/:id"
            element={<TeacherCourseDetailPage />}
          />
          <Route
            path="modules/:id"
            element={<TeacherModuleDetailPage />}
          />
        </Route>

        {/* Student */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StudentDashboard />} />
          <Route path="courses" element={<StudentCoursesPage />} />
          <Route
            path="courses/:id"
            element={<StudentCourseDetailPage />}
          />
          <Route
            path="modules/:id"
            element={<StudentModuleDetailPage />}
          />
          <Route
            path="flashcard-sets/:id"
            element={<StudentFlashcardStudyPage />}
          />
        </Route>
        <Route path="/forbidden" element={<ForbiddenPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Toaster position="top-right" />
    </>
  );
}
