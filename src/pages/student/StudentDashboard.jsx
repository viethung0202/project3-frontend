import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, TrendingUp, Award, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import useAuthUser from "@/hooks/authHook/useAuthUser";

export default function StudentDashboard() {
  const { authUser } = useAuthUser();

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold">
          Xin chào, {authUser?.fullName}! 🎓
        </h1>
        <p className="mt-2 text-blue-100">
          Hôm nay bạn muốn học gì? Hãy bắt đầu hành trình của bạn nhé!
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Khóa đang học</p>
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
                <p className="text-sm text-gray-600">Tiến độ trung bình</p>
                <p className="text-2xl font-bold mt-1">0%</p>
              </div>
              <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Quiz đã làm</p>
                <p className="text-2xl font-bold mt-1">0</p>
              </div>
              <div className="bg-orange-50 text-orange-600 p-3 rounded-lg">
                <Award className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My courses */}
      <Card>
        <CardHeader>
          <CardTitle>Khóa học của tôi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">Bạn chưa đăng ký khóa học nào</p>
            <Button asChild>
              <Link to="/courses">
                Khám phá khóa học
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
