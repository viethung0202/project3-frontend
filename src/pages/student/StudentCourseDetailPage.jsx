import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  Layers,
  TrendingUp,
  BookOpen,
  Loader2,
} from "lucide-react";
import { useCourseDetail } from "@/hooks/useCourses";
import { useStudentCourses } from "@/hooks/useStudent";
import { COURSE_LEVELS } from "@/utils/constants";

export default function StudentCourseDetailPage() {
  const { id } = useParams();
  const { data: course, isLoading } = useCourseDetail(id);
  const { data: myCourses = [] } = useStudentCourses();

  // Lấy progress của course này từ list enrollment
  const myEnrollment = myCourses.find((c) => c.id === id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!course) {
    return <div>Không tìm thấy khóa học</div>;
  }

  const progress = myEnrollment?.progress || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/student/courses"
          className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 mb-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Quay lại khóa học của tôi
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline">{COURSE_LEVELS[course.level]}</Badge>
        </div>
      </div>

      {/* Course info */}
      <Card>
        <CardContent className="p-6">
          {course.thumbnail && (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-48 md:h-64 object-cover rounded-lg mb-4"
            />
          )}
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {course.description || "Chưa có mô tả"}
          </p>
        </CardContent>
      </Card>

      {/* Progress card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-5 w-5" />
            Tiến độ học tập
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-700 min-w-[3rem] text-right">
              {Math.round(progress)}%
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {progress === 0
              ? "Bắt đầu học để cập nhật tiến độ"
              : progress === 100
                ? "🎉 Bạn đã hoàn thành khóa học!"
                : `Đang học · còn ${100 - Math.round(progress)}% nữa`}
          </p>
        </CardContent>
      </Card>

      {/* Modules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Nội dung khóa học ({course.modules?.length || 0} modules)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {course.modules?.length > 0 ? (
            <div className="space-y-2">
              {course.modules.map((module, idx) => (
                <Link
                  key={module.id}
                  to={`/student/modules/${module.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 hover:border-blue-200 transition-colors"
                >
                  <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-medium flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{module.title}</p>
                    {module.description && (
                      <p className="text-xs text-gray-500 truncate">
                        {module.description}
                      </p>
                    )}
                  </div>
                  <BookOpen className="h-4 w-4 text-gray-400 flex-shrink-0" />
                </Link>
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
  );
}
