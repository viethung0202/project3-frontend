import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, X, GraduationCap, Loader2 } from "lucide-react";
import {
  useCourseTeachers,
  useRemoveCourseTeacher,
} from "@/hooks/useCourseTeachers";
import AddTeacherDialog from "./AddTeacherDialog";

export default function CourseTeachersSection({ courseId }) {
  const [addOpen, setAddOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState(null);

  const { data: teachersData, isLoading } = useCourseTeachers(courseId);
  const { mutate: removeTeacher, isPending: isRemoving } =
    useRemoveCourseTeacher();

  // Backend có thể trả về:
  //   [{ id, teacher: { id, fullName, ... } }]   (qua bảng CourseTeacher)
  //   hoặc [{ id, fullName, ... }]               (trả thẳng user)
  const teachers = teachersData?.data || teachersData || [];

  const getInitials = (name) => {
    if (!name) return "T";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const handleConfirmRemove = () => {
    if (!removeTarget) return;
    const teacherId = removeTarget.teacher?.id || removeTarget.id;
    removeTeacher(
      { courseId, teacherId },
      {
        onSuccess: () => setRemoveTarget(null),
      },
    );
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Giáo viên phụ trách
          </CardTitle>
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm giáo viên
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            </div>
          ) : teachers.length === 0 ? (
            <div className="text-center py-8">
              <GraduationCap className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">
                Chưa có giáo viên nào được phân vào khóa học
              </p>
              <Button onClick={() => setAddOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Phân giáo viên
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {teachers.map((item) => {
                const teacher = item.teacher || item;
                return (
                  <div
                    key={teacher.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-white hover:bg-gray-50 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarImage
                          src={teacher.avatar}
                          alt={teacher.fullName}
                        />
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {getInitials(teacher.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">
                          {teacher.fullName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {teacher.email}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                      onClick={() => setRemoveTarget(item)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add dialog */}
      <AddTeacherDialog
        courseId={courseId}
        currentTeachers={teachers}
        open={addOpen}
        onClose={() => setAddOpen(false)}
      />

      {/* Remove confirm */}
      <AlertDialog
        open={!!removeTarget}
        onOpenChange={() => setRemoveTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Gỡ giáo viên khỏi khóa học?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn gỡ giáo viên{" "}
              <strong>
                {removeTarget?.teacher?.fullName || removeTarget?.fullName}
              </strong>{" "}
              khỏi khóa học này? Có thể thêm lại bất cứ lúc nào.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemoving}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmRemove}
              disabled={isRemoving}
              className="bg-red-600 hover:bg-red-700"
            >
              {isRemoving ? "Đang xử lý..." : "Gỡ"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
