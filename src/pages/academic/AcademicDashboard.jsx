import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Layers,
  FileText,
  HelpCircle,
  Loader2,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import useAuthUser from "@/hooks/authHook/useAuthUser";
import useAcademicStats from "@/hooks/useAcademicStats";
import { COURSE_LEVELS, COURSE_STATUS } from "@/utils/constants";

export default function AcademicDashboard() {
  const { authUser } = useAuthUser();
  const { data: stats, isLoading } = useAcademicStats();

  const formatTime = (iso) => {
    if (!iso) return "";
    const date = new Date(iso);
    const diffMs = Date.now() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "vừa xong";
    if (diffMin < 60) return `${diffMin} phút trước`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `${diffH} giờ trước`;
    const diffD = Math.floor(diffH / 24);
    if (diffD < 30) return `${diffD} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Xin chào, {authUser?.fullName}! 👋
          </h1>
          <p className="text-gray-600 mt-1">Trang quản lý của Giáo vụ</p>
        </div>
        <Button asChild>
          <Link to="/academic/courses/create">
            <Plus className="mr-2 h-4 w-4" />
            Tạo khóa học
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Khóa học"
          value={stats?.totalCourses}
          subtitle={
            stats?.newCoursesThisWeek
              ? `+${stats.newCoursesThisWeek} trong 7 ngày`
              : null
          }
          icon={BookOpen}
          color="text-blue-600"
          bgColor="bg-blue-50"
          isLoading={isLoading}
        />
        <StatCard
          title="Modules"
          value={stats?.totalModules}
          icon={Layers}
          color="text-emerald-600"
          bgColor="bg-emerald-50"
          isLoading={isLoading}
        />
        <StatCard
          title="Lessons"
          value={stats?.totalLessons}
          icon={FileText}
          color="text-orange-600"
          bgColor="bg-orange-50"
          isLoading={isLoading}
        />
        <StatCard
          title="Quizzes"
          value={stats?.totalQuizzes}
          icon={HelpCircle}
          color="text-purple-600"
          bgColor="bg-purple-50"
          isLoading={isLoading}
        />
      </div>

      {/* Course status breakdown */}
      {stats?.coursesByStatus &&
        Object.keys(stats.coursesByStatus).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Khóa học theo trạng thái</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Object.entries(stats.coursesByStatus).map(([status, count]) => (
                  <Badge
                    key={status}
                    variant="outline"
                    className="text-sm py-1.5"
                  >
                    {COURSE_STATUS[status] || status}:{" "}
                    <strong className="ml-1">{count}</strong>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      {/* Recent courses */}
      <Card>
        <CardHeader>
          <CardTitle>Khóa học gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            </div>
          ) : !stats?.recentCourses?.length ? (
            <p className="text-sm text-gray-500">Chưa có khóa học nào</p>
          ) : (
            <div className="space-y-3">
              {stats.recentCourses.map((c) => (
                <Link
                  key={c.id}
                  to={`/academic/courses/${c.id}`}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {c.thumbnail ? (
                      <img
                        src={c.thumbnail}
                        alt={c.title}
                        className="h-12 w-12 rounded-md object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="h-5 w-5" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{c.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="outline" className="text-xs">
                          {COURSE_LEVELS[c.level] || c.level}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {c._count?.modules || 0} modules ·{" "}
                          {c._count?.enrollments || 0} học viên
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                    {formatTime(c.createdAt)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, color, bgColor, isLoading }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-gray-400 mt-1" />
            ) : (
              <p className="text-2xl font-bold mt-1">{value ?? 0}</p>
            )}
            {subtitle && !isLoading && (
              <p className="text-xs text-emerald-600 mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`${bgColor} ${color} p-3 rounded-lg`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
