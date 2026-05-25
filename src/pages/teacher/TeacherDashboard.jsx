import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BookOpen,
  Users,
  ClipboardList,
  UserPlus,
  Loader2,
} from "lucide-react";
import useAuthUser from "@/hooks/authHook/useAuthUser";
import { useTeacherStats } from "@/hooks/useTeacher";

export default function TeacherDashboard() {
  const { authUser } = useAuthUser();
  const { data: stats, isLoading } = useTeacherStats();

  const getInitials = (name) => {
    if (!name) return "S";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Xin chào, {authUser?.fullName}! 👋
        </h1>
        <p className="text-gray-600 mt-1">Trang tổng quan dành cho Giáo viên</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Khóa học đang dạy"
          value={stats?.totalCourses}
          icon={BookOpen}
          color="text-blue-600"
          bgColor="bg-blue-50"
          isLoading={isLoading}
        />
        <StatCard
          title="Học sinh"
          value={stats?.totalStudents}
          icon={Users}
          color="text-purple-600"
          bgColor="bg-purple-50"
          isLoading={isLoading}
        />
        <StatCard
          title="Enrollment"
          value={stats?.totalEnrollments}
          subtitle={
            stats?.newEnrollmentsThisWeek
              ? `+${stats.newEnrollmentsThisWeek} trong 7 ngày`
              : null
          }
          icon={ClipboardList}
          color="text-emerald-600"
          bgColor="bg-emerald-50"
          isLoading={isLoading}
        />
        <StatCard
          title="Mới tuần này"
          value={stats?.newEnrollmentsThisWeek}
          icon={UserPlus}
          color="text-orange-600"
          bgColor="bg-orange-50"
          isLoading={isLoading}
        />
      </div>

      {/* Recent enrollments */}
      <Card>
        <CardHeader>
          <CardTitle>Học sinh mới đăng ký</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            </div>
          ) : !stats?.recentEnrollments?.length ? (
            <p className="text-sm text-gray-500">
              Chưa có học sinh nào đăng ký vào khóa của bạn
            </p>
          ) : (
            <div className="space-y-3">
              {stats.recentEnrollments.map((e) => (
                <Link
                  key={e.id}
                  to={`/teacher/courses/${e.course?.id}`}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="h-9 w-9 flex-shrink-0">
                      <AvatarImage
                        src={e.student?.avatar}
                        alt={e.student?.fullName}
                      />
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-sm">
                        {getInitials(e.student?.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">
                        {e.student?.fullName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        đăng ký <strong>{e.course?.title}</strong>
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    {formatTime(e.enrolledAt)}
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
