import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users } from "lucide-react";
import useAuthUser from "@/hooks/authHook/useAuthUser";

export default function StaffDashboard() {
  const { authUser } = useAuthUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Xin chào, {authUser?.fullName}! 👋
        </h1>
        <p className="text-gray-600 mt-1">
          Trang quản lý nhân sự của Hành chính
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Giáo viên</p>
                <p className="text-2xl font-bold mt-1">0</p>
              </div>
              <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
                <GraduationCap className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Học sinh</p>
                <p className="text-2xl font-bold mt-1">0</p>
              </div>
              <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
