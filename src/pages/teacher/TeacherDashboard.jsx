import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import useAuthUser from "@/hooks/authHook/useAuthUser";

export default function TeacherDashboard() {
  const { authUser } = useAuthUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Xin chào, {authUser?.fullName}! 👋
        </h1>
        <p className="text-gray-600 mt-1">Trang dành cho Giáo viên</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Khóa học của tôi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Bạn chưa được phân vào khóa học nào
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
