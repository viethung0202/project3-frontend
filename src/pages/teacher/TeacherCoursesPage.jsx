import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Layers,
  Users,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { useTeacherCourses } from "@/hooks/useTeacher";
import { COURSE_LEVELS, COURSE_STATUS } from "@/utils/constants";

const statusStyles = {
  DRAFT: "bg-gray-100 text-gray-700",
  PUBLISHED: "bg-emerald-100 text-emerald-700",
  ARCHIVED: "bg-orange-100 text-orange-700",
};

export default function TeacherCoursesPage() {
  const { data: courses = [], isLoading } = useTeacherCourses();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Khóa học của tôi</h1>
        <p className="text-gray-600 mt-1">
          Các khóa học bạn được phân công giảng dạy
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      ) : courses.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              Bạn chưa được phân công vào khóa học nào.
              <br />
              Hãy liên hệ giáo vụ để được thêm vào khóa học.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((c) => (
            <Link
              key={c.id}
              to={`/teacher/courses/${c.id}`}
              className="block group"
            >
              <Card className="h-full hover:shadow-md transition-shadow overflow-hidden">
                {c.thumbnail ? (
                  <img
                    src={c.thumbnail}
                    alt={c.title}
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  <div className="w-full h-40 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-blue-300" />
                  </div>
                )}
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {COURSE_LEVELS[c.level] || c.level}
                    </Badge>
                    <Badge
                      className={`text-xs ${statusStyles[c.status] || ""}`}
                    >
                      {COURSE_STATUS[c.status] || c.status}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-base mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {c.title}
                  </h3>
                  {c.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {c.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1">
                        <Layers className="h-3 w-3" />
                        {c._count?.modules || 0} modules
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {c._count?.enrollments || 0} HS
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
