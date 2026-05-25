import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Plus,
  Trash2,
  ClipboardList,
  Loader2,
} from "lucide-react";
import {
  useEnrollmentsList,
  useDeleteEnrollment,
} from "@/hooks/useEnrollments";
import { useCoursesList } from "@/hooks/useCourses";
import { COURSE_LEVELS } from "@/utils/constants";
import AddEnrollmentDialog from "@/components/enrollment/AddEnrollmentDialog";

export default function EnrollmentsPage() {
  const [courseFilter, setCourseFilter] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: courses = [] } = useCoursesList();
  const { data: enrollments = [], isLoading } = useEnrollmentsList({
    courseId: courseFilter !== "all" ? courseFilter : undefined,
  });

  const { mutate: removeEnrollment, isPending: isDeleting } =
    useDeleteEnrollment();

  const getInitials = (name) => {
    if (!name) return "S";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    removeEnrollment(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  const formatDate = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("vi-VN");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enrollment</h1>
          <p className="text-gray-600 mt-1">
            Quản lý việc học sinh đăng ký khóa học
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm enrollment
        </Button>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="p-4">
          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="Lọc theo khóa học" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả khóa học</SelectItem>
              {courses.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : enrollments.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardList className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">Chưa có enrollment nào</p>
              <Button onClick={() => setAddOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Tạo enrollment đầu tiên
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Học sinh</TableHead>
                  <TableHead>Khóa học</TableHead>
                  <TableHead>Cấp độ</TableHead>
                  <TableHead>Tiến độ</TableHead>
                  <TableHead>Ngày enroll</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrollments.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage
                            src={e.student?.avatar}
                            alt={e.student?.fullName}
                          />
                          <AvatarFallback className="bg-blue-100 text-blue-700 text-sm">
                            {getInitials(e.student?.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">
                            {e.student?.fullName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {e.student?.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-sm">
                      {e.course?.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {COURSE_LEVELS[e.course?.level] || e.course?.level}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-[120px]">
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
                    </TableCell>
                    <TableCell className="text-sm text-gray-700">
                      {formatDate(e.enrolledAt)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => setDeleteTarget(e)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AddEnrollmentDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
      />

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Gỡ enrollment?</AlertDialogTitle>
            <AlertDialogDescription>
              Học sinh <strong>{deleteTarget?.student?.fullName}</strong> sẽ bị
              gỡ khỏi khóa học <strong>{deleteTarget?.course?.title}</strong>.
              Toàn bộ tiến độ học tập sẽ bị xóa. Hành động không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Đang gỡ..." : "Gỡ"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
