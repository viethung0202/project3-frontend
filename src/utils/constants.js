import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  TrendingUp,
  ClipboardList,
  Mail,
  Award,
} from "lucide-react";

// Các role trong hệ thống
export const ROLES = {
  ADMIN: "ADMIN",
  ACADEMIC_STAFF: "ACADEMIC_STAFF",
  ADMIN_STAFF: "ADMIN_STAFF",
  TEACHER: "TEACHER",
  STUDENT: "STUDENT",
};

// Tên hiển thị tiếng Việt của role
export const ROLE_LABELS = {
  ADMIN: "Quản trị viên",
  ACADEMIC_STAFF: "Giáo vụ",
  ADMIN_STAFF: "Hành chính",
  TEACHER: "Giáo viên",
  STUDENT: "Học sinh",
};

// Đường dẫn dashboard tương ứng với mỗi role
export const ROLE_REDIRECT = {
  ADMIN: "/admin",
  ACADEMIC_STAFF: "/academic",
  ADMIN_STAFF: "/staff",
  TEACHER: "/teacher",
  STUDENT: "/student",
};

// ===== MENU CHO TỪNG ROLE =====
export const MENU_BY_ROLE = {
  ADMIN: [
    { to: "/admin", label: "Tổng quan", icon: LayoutDashboard },
    { to: "/admin/users", label: "Quản lý người dùng", icon: Users },
    { to: "/admin/messages", label: "Tin nhắn liên hệ", icon: Mail },
  ],
  ACADEMIC_STAFF: [
    { to: "/academic", label: "Tổng quan", icon: LayoutDashboard },
    { to: "/academic/courses", label: "Khóa học", icon: BookOpen },
  ],
  ADMIN_STAFF: [
    { to: "/staff", label: "Tổng quan", icon: LayoutDashboard },
    { to: "/staff/teachers", label: "Giáo viên", icon: GraduationCap },
    { to: "/staff/students", label: "Học sinh", icon: Users },
    { to: "/staff/enrollments", label: "Enrollment", icon: ClipboardList },
  ],
  TEACHER: [
    { to: "/teacher", label: "Tổng quan", icon: LayoutDashboard },
    { to: "/teacher/courses", label: "Khóa học của tôi", icon: BookOpen },
  ],
  STUDENT: [
    { to: "/student", label: "Tổng quan", icon: LayoutDashboard },
    { to: "/student/courses", label: "Khóa học của tôi", icon: BookOpen },
    { to: "/student/quizzes", label: "Lịch sử Quiz", icon: ClipboardList },
    { to: "/student/progress", label: "Tiến độ", icon: TrendingUp },
    { to: "/student/certificates", label: "Chứng chỉ", icon: Award },
  ],
};

// Level của khóa học
export const COURSE_LEVELS = {
  BEGINNER: "Cơ bản",
  INTERMEDIATE: "Trung cấp",
  ADVANCED: "Nâng cao",
};

// Status của khóa học
export const COURSE_STATUS = {
  DRAFT: "Bản nháp",
  PUBLISHED: "Đã xuất bản",
  ARCHIVED: "Lưu trữ",
};

// Loại câu hỏi
export const QUESTION_TYPES = {
  SINGLE_CHOICE: "Một đáp án",
  MULTIPLE_CHOICE: "Nhiều đáp án",
  TRUE_FALSE: "Đúng / Sai",
};

// Trạng thái làm quiz
export const ATTEMPT_STATUS = {
  IN_PROGRESS: "Đang làm",
  COMPLETED: "Hoàn thành",
};

// Xếp loại đánh giá học sinh
export const EVAL_GRADES = {
  EXCELLENT: {
    label: "Xuất sắc",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  GOOD: {
    label: "Giỏi",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
  },
  AVERAGE: {
    label: "Khá",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  FAIR: {
    label: "Trung bình",
    color: "bg-orange-100 text-orange-700 border-orange-200",
    dot: "bg-orange-500",
  },
  POOR: {
    label: "Cần cải thiện",
    color: "bg-red-100 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
};
