import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CourseTeachersSection from "@/components/course/CourseTeachersSection";
import ModuleFormDialog from "@/components/module/ModuleFormDialog";
import DeleteModuleDialog from "@/components/module/DeleteModuleDialog";
import {
  ChevronLeft,
  Pencil,
  Layers,
  Users,
  GraduationCap,
  Loader2,
  Plus,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { useCourseDetail } from "@/hooks/useCourses";
import { COURSE_LEVELS, COURSE_STATUS } from "@/utils/constants";

export default function CourseDetailPage() {
  const { id } = useParams();
  const { data: course, isLoading } = useCourseDetail(id);

  const [moduleFormTarget, setModuleFormTarget] = useState(null);
  const [moduleFormOpen, setModuleFormOpen] = useState(false);
  const [moduleDeleteTarget, setModuleDeleteTarget] = useState(null);

  const openCreateModule = () => {
    setModuleFormTarget(null);
    setModuleFormOpen(true);
  };

  const openEditModule = (module) => {
    setModuleFormTarget(module);
    setModuleFormOpen(true);
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
      {/* Back + actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <Link
            to="/academic/courses"
            className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 mb-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Quay lại danh sách
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
        </div>
        <Button asChild>
          <Link to={`/academic/courses/${id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Sửa khóa học
          </Link>
        </Button>
      </div>

      {/* Info card */}
      <Card>
        <CardContent className="p-6">
          {course.thumbnail && (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-48 md:h-64 object-cover rounded-lg mb-4"
            />
          )}

          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline">{COURSE_LEVELS[course.level]}</Badge>
            <StatusBadge status={course.status} />
          </div>

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
          label="Giáo viên"
          value={course._count?.teachers || 0}
          color="text-emerald-600"
          bgColor="bg-emerald-50"
        />
        <StatCard
          icon={Users}
          label="Học viên"
          value={course._count?.enrollments || 0}
          color="text-purple-600"
          bgColor="bg-purple-50"
        />
      </div>

      <CourseTeachersSection courseId={id} />

      {/* Modules section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Modules</CardTitle>
          <Button size="sm" onClick={openCreateModule}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm module
          </Button>
        </CardHeader>
        <CardContent>
          {course.modules?.length > 0 ? (
            <div className="space-y-2">
              {course.modules.map((module, idx) => (
                <div
                  key={module.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50"
                >
                  <Link
                    to={`/academic/modules/${module.id}`}
                    className="flex items-center gap-3 min-w-0 flex-1"
                  >
                    <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate hover:text-blue-600 transition-colors">
                        {module.title}
                      </p>
                      {module.description && (
                        <p className="text-xs text-gray-500 truncate">
                          {module.description}
                        </p>
                      )}
                    </div>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditModule(module)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={() => setModuleDeleteTarget(module)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Layers className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">Chưa có module nào</p>
              <Button onClick={openCreateModule}>
                <Plus className="mr-2 h-4 w-4" />
                Tạo module đầu tiên
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <ModuleFormDialog
        courseId={id}
        module={moduleFormTarget}
        open={moduleFormOpen}
        onClose={() => setModuleFormOpen(false)}
      />

      <DeleteModuleDialog
        courseId={id}
        module={moduleDeleteTarget}
        open={!!moduleDeleteTarget}
        onClose={() => setModuleDeleteTarget(null)}
      />
    </div>
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

function StatusBadge({ status }) {
  const styles = {
    DRAFT: "bg-gray-100 text-gray-700",
    PUBLISHED: "bg-emerald-100 text-emerald-700",
    ARCHIVED: "bg-orange-100 text-orange-700",
  };
  return (
    <Badge className={`${styles[status]} hover:${styles[status]}`}>
      {COURSE_STATUS[status]}
    </Badge>
  );
}
