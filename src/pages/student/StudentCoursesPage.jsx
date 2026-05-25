import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Layers,
  Compass,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { useStudentCourses } from "@/hooks/useStudent";
import { COURSE_LEVELS } from "@/utils/constants";

export default function StudentCoursesPage() {
  const { data: courses = [], isLoading } = useStudentCourses();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Khóa học của tôi</h1>
          <p className="text-gray-600 mt-1">
            Các khóa học bạn đã đăng ký
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/courses">
            <Compass className="mr-2 h-4 w-4" />
            Khám phá thêm
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      ) : courses.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">
              Bạn chưa đăng ký khóa học nào
            </p>
            <Button asChild>
              <Link to="/courses">
                <Compass className="mr-2 h-4 w-4" />
                Khám phá khóa học ngay
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((c) => (
            <Link
              key={c.id}
              to={`/student/courses/${c.id}`}
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
                  <Badge variant="outline" className="text-xs mb-2">
                    {COURSE_LEVELS[c.level] || c.level}
                  </Badge>
                  <h3 className="font-semibold text-base mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {c.title}
                  </h3>
                  {c.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {c.description}
                    </p>
                  )}

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>Tiến độ</span>
                      <span className="font-medium">
                        {Math.round(c.progress || 0)}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 transition-all"
                        style={{ width: `${c.progress || 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <Layers className="h-3 w-3" />
                      {c._count?.modules || 0} modules
                    </span>
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
