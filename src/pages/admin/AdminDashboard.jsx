import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  BookOpen,
  GraduationCap,
  UserPlus,
  Loader2,
} from "lucide-react";
import useAuthUser from "@/hooks/authHook/useAuthUser";
import useAdminStats from "@/hooks/useAdminStats";
import { ROLE_LABELS } from "@/utils/constants";

export default function AdminDashboard() {
  const { authUser } = useAuthUser();
  const { data: stats, isLoading } = useAdminStats();

  const getInitials = (name) => {
    if (!name) return "U";
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
    const now = new Date();
    const diffMs = now - date;
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
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Xin chào, {authUser?.fullName}! 👋
        </h1>
        <p className="text-gray-600 mt-1">
          Đây là trang tổng quan dành cho Quản trị viên
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Tổng người dùng"
          value={stats?.totalUsers}
          subtitle={
            stats?.newUsersThisWeek != null
              ? `+${stats.newUsersThisWeek} trong 7 ngày`
              : null
          }
          icon={Users}
          color="text-blue-600"
          bgColor="bg-blue-50"
          isLoading={isLoading}
        />
        <StatCard
          title="Khóa học"
          value={stats?.totalCourses}
          icon={BookOpen}
          color="text-emerald-600"
          bgColor="bg-emerald-50"
          isLoading={isLoading}
        />
        <StatCard
          title="Giáo viên"
          value={stats?.totalTeachers}
          icon={GraduationCap}
          color="text-orange-600"
          bgColor="bg-orange-50"
          isLoading={isLoading}
        />
        <StatCard
          title="Học viên"
          value={stats?.totalStudents}
          icon={UserPlus}
          color="text-purple-600"
          bgColor="bg-purple-50"
          isLoading={isLoading}
        />
      </div>

      {/* User breakdown by role */}
      {stats?.usersByRole && Object.keys(stats.usersByRole).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Phân bố theo vai trò</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(stats.usersByRole).map(([role, count]) => (
                <Badge key={role} variant="outline" className="text-sm py-1.5">
                  {ROLE_LABELS[role] || role}: <strong className="ml-1">{count}</strong>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent activity */}
      <Card>
        <CardHeader>
          <CardTitle>Người dùng mới gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            </div>
          ) : !stats?.recentUsers?.length ? (
            <p className="text-sm text-gray-500">Chưa có người dùng nào</p>
          ) : (
            <div className="space-y-3">
              {stats.recentUsers.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="h-9 w-9 flex-shrink-0">
                      <AvatarImage src={u.avatar} alt={u.fullName} />
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-sm">
                        {getInitials(u.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">
                        {u.fullName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {u.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant="outline" className="text-xs">
                      {ROLE_LABELS[u.role] || u.role}
                    </Badge>
                    <span className="text-xs text-gray-500 hidden sm:inline">
                      {formatTime(u.createdAt)}
                    </span>
                  </div>
                </div>
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
