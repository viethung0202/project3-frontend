import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  Layers,
  Users,
  GraduationCap,
  Loader2,
  CheckCircle2,
  LogIn,
} from "lucide-react";
import { useCourseDetail } from "@/hooks/useCourses";
import useAuthUser from "@/hooks/authHook/useAuthUser";
import useStudentEnroll from "@/hooks/useStudentEnroll";
import { COURSE_LEVELS, COURSE_STATUS } from "@/utils/constants";

const statusStyles = {
  DRAFT: "bg-gray-100 text-gray-700",
  PUBLISHED: "bg-emerald-100 text-emerald-700",
  ARCHIVED: "bg-orange-100 text-orange-700",
};

export default function PublicCourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authUser, isLoading: authLoading } = useAuthUser();
  const { data: course, isLoading } = useCourseDetail(id);
  const { mutate: enroll, isPending: isEnrolling } = useStudentEnroll();

  if (isLoading || authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Không tìm thấy khóa học</p>
      </div>
    );
  }

  // Backend filter PUBLISHED nhưng nếu user gõ direct URL vào course DRAFT thì cũng cho xem
  // (read-only, không hiện nút đăng ký)
  const canEnroll = authUser?.role === "STUDENT" && course.status === "PUBLISHED";
  const handleEnroll = () => {
    enroll(course.id, {
      onSuccess: () => navigate("/student/courses"),
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link
        to="/courses"
        className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 mb-4"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Quay lại danh sách
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main */}
        <div className="md:col-span-2 space-y-6">
          {/* Thumbnail */}
          {course.thumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-48 md:h-64 object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-48 md:h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
              <Layers className="h-16 w-16 text-blue-300" />
            </div>
          )}

          {/* Title + badges */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{COURSE_LEVELS[course.level]}</Badge>
              <Badge className={statusStyles[course.status] || ""}>
                {COURSE_STATUS[course.status]}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
          </div>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Giới thiệu khóa học</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {course.description || "Khóa học chưa có mô tả chi tiết."}
              </p>
            </CardContent>
          </Card>

          {/* Modules outline */}
          <Card>
            <CardHeader>
              <CardTitle>Nội dung khóa học</CardTitle>
            </CardHeader>
            <CardContent>
              {course.modules?.length > 0 ? (
                <div className="space-y-2">
                  {course.modules.map((module, idx) => (
                    <div
                      key={module.id}
                      className="flex items-center gap-3 p-3 rounded-lg border"
                    >
                      <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-medium flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{module.title}</p>
                        {module.description && (
                          <p className="text-xs text-gray-500 truncate">
                            {module.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-6">
                  Khóa học chưa có module nào
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Stats card */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Layers className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-600">Modules:</span>
                <strong>{course._count?.modules || 0}</strong>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Users className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-600">Học viên:</span>
                <strong>{course._count?.enrollments || 0}</strong>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <GraduationCap className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-600">Giáo viên:</span>
                <strong>{course._count?.teachers || 0}</strong>
              </div>
            </CardContent>
          </Card>

          {/* Enroll button */}
          <Card>
            <CardContent className="p-4">
              {!authUser ? (
                <>
                  <p className="text-sm text-gray-600 mb-3">
                    Đăng nhập để đăng ký học khóa này
                  </p>
                  <Button
                    asChild
                    className="w-full"
                    size="lg"
                  >
                    <Link to="/login">
                      <LogIn className="mr-2 h-4 w-4" />
                      Đăng nhập
                    </Link>
                  </Button>
                </>
              ) : authUser.role !== "STUDENT" ? (
                <p className="text-sm text-gray-500 italic">
                  Chỉ tài khoản học sinh mới có thể đăng ký khóa học.
                </p>
              ) : course.status !== "PUBLISHED" ? (
                <p className="text-sm text-gray-500 italic">
                  Khóa học này chưa được mở.
                </p>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-3">
                    Đăng ký để bắt đầu học ngay hôm nay
                  </p>
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleEnroll}
                    disabled={isEnrolling || !canEnroll}
                  >
                    {isEnrolling ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang đăng ký...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Đăng ký ngay
                      </>
                    )}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
