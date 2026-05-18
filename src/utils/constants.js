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
