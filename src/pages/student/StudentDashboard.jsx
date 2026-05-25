import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  TrendingUp,
  ClipboardList,
  Award,
  Loader2,
  Compass,
  ArrowRight,
} from "lucide-react";
import useAuthUser from "@/hooks/authHook/useAuthUser";
import { useStudentStats } from "@/hooks/useStudent";
import { COURSE_LEVELS } from "@/utils/constants";

export default function StudentDashboard() {
  const { authUser } = useAuthUser();
  const { data: stats, isLoading } = useStudentStats();

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
          <p className="text-gray-600 mt-1">
            Tiếp tục hành trình học tiếng Anh của bạn
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/courses">
            <Compass className="mr-2 h-4 w-4" />
            Khám phá khóa học
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Khóa học đã đăng ký"
          value={stats?.totalCourses}
          icon={BookOpen}
          color="text-blue-600"
          bgColor="bg-blue-50"
          isLoading={isLoading}
        />
        <StatCard
          title="Tiến độ trung bình"
          value={stats != null ? `${stats.avgProgress}%` : "—"}
          icon={TrendingUp}
          color="text-emerald-600"
          bgColor="bg-emerald-50"
          isLoading={isLoading}
        />
        <StatCard
          title="Quiz đã làm"
          value={stats?.totalAttempts}
          icon={ClipboardList}
          color="text-orange-600"
          bgColor="bg-orange-50"
          isLoading={isLoading}
        />
        <StatCard
          title="Quiz đạt"
          value={stats?.passedAttempts}
          icon={Award}
          color="text-purple-600"
          bgColor="bg-purple-50"
          isLoading={isLoading}
        />
      </div>

      {/* Recent enrolled courses */}
      <Card>
        <CardHeader>
          <CardTitle>Khóa học gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            </div>
          ) : !stats?.recentEnrollments?.length ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">
                Bạn chưa đăng ký khóa học nào
              </p>
              <Button asChild>
                <Link to="/courses">
                  <Compass className="mr-2 h-4 w-4" />
                  Khám phá khóa học
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentEnrollments.map((e) => (
                <Link
                  key={e.id}
                  to={`/student/courses/${e.course?.id}`}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {e.course?.thumbnail ? (
                      <img
                        src={e.course.thumbnail}
                        alt={e.course.title}
                        className="h-12 w-12 rounded-md object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="h-5 w-5" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate group-hover:text-blue-600 transition-colors">
                        {e.course?.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="outline" className="text-xs">
                          {COURSE_LEVELS[e.course?.level] || e.course?.level}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          enroll {formatTime(e.enrolledAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="hidden sm:flex items-center gap-2 min-w-[100px]">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600"
                          style={{ width: `${e.progress || 0}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 w-8">
                        {Math.round(e.progress || 0)}%
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, bgColor, isLoading }) {
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
          </div>
          <div className={`${bgColor} ${color} p-3 rounded-lg`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
