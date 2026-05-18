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

// Dashboards
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AcademicDashboard from "@/pages/academic/AcademicDashboard";
import CoursesPage from "@/pages/academic/CoursesPage";
import CreateCoursePage from "@/pages/academic/CreateCoursePage";
import CourseDetailPage from "@/pages/academic/CourseDetailPage";
import EditCoursePage from "@/pages/academic/EditCoursePage";
import StaffDashboard from "@/pages/staff/StaffDashboard";
import TeacherDashboard from "@/pages/teacher/TeacherDashboard";
import StudentDashboard from "@/pages/student/StudentDashboard";

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
        </Route>
        <Route path="/forbidden" element={<ForbiddenPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Toaster position="top-right" />
    </>
  );
}
