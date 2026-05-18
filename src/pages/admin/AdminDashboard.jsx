import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, GraduationCap, Activity } from "lucide-react";
import useAuthUser from "@/hooks/authHook/useAuthUser";

export default function AdminDashboard() {
  const { authUser } = useAuthUser();

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
          value="0"
          icon={Users}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatCard
          title="Khóa học"
          value="0"
          icon={BookOpen}
          color="text-emerald-600"
          bgColor="bg-emerald-50"
        />
        <StatCard
          title="Giáo viên"
          value="0"
          icon={GraduationCap}
          color="text-orange-600"
          bgColor="bg-orange-50"
        />
        <StatCard
          title="Hoạt động"
          value="0"
          icon={Activity}
          color="text-purple-600"
          bgColor="bg-purple-50"
        />
      </div>

      {/* Recent activity */}
      <Card>
        <CardHeader>
          <CardTitle>Hoạt động gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Chưa có hoạt động nào</p>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, bgColor }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <div className={`${bgColor} ${color} p-3 rounded-lg`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
