import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChevronLeft,
  Layers,
  Users,
  GraduationCap,
  Loader2,
  HelpCircle,
  FileText,
  Trophy,
} from "lucide-react";
import { useCourseDetail } from "@/hooks/useCourses";
import { useCourseTeachers } from "@/hooks/useCourseTeachers";
import { useTeacherCourseEnrollments } from "@/hooks/useTeacher";
import { COURSE_LEVELS, COURSE_STATUS } from "@/utils/constants";
import CourseLeaderboard from "@/components/course/CourseLeaderboard";
import CourseDocumentsSection from "@/components/document/CourseDocumentsSection";

const statusStyles = {
  DRAFT: "bg-gray-100 text-gray-700",
  PUBLISHED: "bg-emerald-100 text-emerald-700",
  ARCHIVED: "bg-orange-100 text-orange-700",
};

export default function TeacherCourseDetailPage() {
  const { id } = useParams();
  const [tab, setTab] = useState("students");
  const { data: course, isLoading } = useCourseDetail(id);
  const { data: teachers = [] } = useCourseTeachers(id);
  const { data: enrollments = [], isLoading: enrollmentsLoading } =
    useTeacherCourseEnrollments(id);

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!course) {
    return <div>Không tìm thấy khóa học</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/teacher/courses"
          className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 mb-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Quay lại danh sách
        </Link>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">{COURSE_LEVELS[course.level]}</Badge>
              <Badge className={statusStyles[course.status] || ""}>
                {COURSE_STATUS[course.status]}
              </Badge>
            </div>
          </div>
          <Link
            to={`/teacher/courses/${course.id}/evaluations`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Đánh giá học sinh
          </Link>
        </div>
      </div>

      {/* Course info */}
      <Card>
        <CardContent className="p-6">
          {course.thumbnail && (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-48 md:h-64 object-cover rounded-lg mb-4"
            />
          )}
          <p className="text-gray-600 leading-relaxed">
            {course.description || "Chưa có mô tả"}
          </p>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={Layers}
          label="Modules"
          value={course._count?.modules || 0}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatCard
          icon={GraduationCap}
          label="Đồng giáo viên"
          value={teachers.length || 0}
          color="text-emerald-600"
          bgColor="bg-emerald-50"
        />
        <StatCard
          icon={Users}
          label="Học viên"
          value={enrollments.length || 0}
          color="text-purple-600"
          bgColor="bg-purple-50"
        />
      </div>

      {/* Modules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Nội dung khóa học
          </CardTitle>
        </CardHeader>
        <CardContent>
          {course.modules?.length > 0 ? (
            <div className="space-y-2">
              {course.modules.map((module, idx) => (
                <Link
                  key={module.id}
                  to={`/teacher/modules/${module.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-medium flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{module.title}</p>
                    {module.description && (
                      <p className="text-xs text-gray-500 truncate">
                        {module.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-6">
              Khóa học chưa có module nào
            </p>
          )}
        </CardContent>
      </Card>

      {/* Co-teachers */}
      {teachers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Đồng giáo viên
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {teachers.map((item) => {
                const t = item.teacher || item;
                return (
                  <div
                    key={t.id}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={t.avatar} alt={t.fullName} />
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        {getInitials(t.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">
                        {t.fullName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {t.email}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab switcher */}
      <div className="border-b flex gap-1">
        <TabBtn
          active={tab === "students"}
          onClick={() => setTab("students")}
          icon={Users}
        >
          Học sinh
        </TabBtn>
        <TabBtn
          active={tab === "documents"}
          onClick={() => setTab("documents")}
          icon={FileText}
        >
          Tài liệu
        </TabBtn>
        <TabBtn
          active={tab === "leaderboard"}
          onClick={() => setTab("leaderboard")}
          icon={Trophy}
        >
          Bảng xếp hạng
        </TabBtn>
      </div>

      {tab === "leaderboard" && <CourseLeaderboard courseId={course.id} />}

      {tab === "documents" && (
        <CourseDocumentsSection courseId={course.id} role="TEACHER" />
      )}

      {/* Students */}
      {tab === "students" && (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Học sinh ({enrollments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {enrollmentsLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            </div>
          ) : enrollments.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">
              Chưa có học sinh nào enroll vào khóa này
            </p>
          ) : (
            <div className="space-y-2">
              {enrollments.map((e) => (
                <div
                  key={e.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Avatar className="h-9 w-9">
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
                        {e.student?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 min-w-[140px]">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600"
                        style={{ width: `${e.progress || 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600 w-10">
                      {Math.round(e.progress || 0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      )}
    </div>
  );
}

function TabBtn({ active, onClick, icon: Icon, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
        active
          ? "border-blue-600 text-blue-600"
          : "border-transparent text-gray-600 hover:text-gray-900"
      }`}
    >
      <Icon className="h-4 w-4" />
      {children}
    </button>
  );
}

function StatCard({ icon: Icon, label, value, color, bgColor }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{label}</p>
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
