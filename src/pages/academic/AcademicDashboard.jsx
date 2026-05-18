import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Layers, FileText, Users } from "lucide-react";
import useAuthUser from "@/hooks/authHook/useAuthUser";

export default function AcademicDashboard() {
  const { authUser } = useAuthUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Xin chào, {authUser?.fullName}! 👋
        </h1>
        <p className="text-gray-600 mt-1">Trang quản lý của Giáo vụ</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Khóa học</p>
                <p className="text-2xl font-bold mt-1">0</p>
              </div>
              <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
                <BookOpen className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Modules</p>
                <p className="text-2xl font-bold mt-1">0</p>
              </div>
              <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg">
                <Layers className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tài liệu</p>
                <p className="text-2xl font-bold mt-1">0</p>
              </div>
              <div className="bg-orange-50 text-orange-600 p-3 rounded-lg">
                <FileText className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Học viên</p>
                <p className="text-2xl font-bold mt-1">0</p>
              </div>
              <div className="bg-purple-50 text-purple-600 p-3 rounded-lg">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Khóa học gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Chưa có khóa học nào</p>
        </CardContent>
      </Card>
    </div>
  );
}
