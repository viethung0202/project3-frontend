import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, UserPlus, Loader2, Check } from "lucide-react";
import { useTeachers, useAddCourseTeacher } from "@/hooks/useCourseTeachers";

export default function AddTeacherDialog({
  courseId,
  currentTeachers,
  open,
  onClose,
}) {
  const [search, setSearch] = useState("");
  const { data: teachersData, isLoading } = useTeachers();
  const { mutate: addTeacher, isPending } = useAddCourseTeacher();

  // Lấy list giáo viên từ response
  const allTeachers = teachersData?.data || teachersData || [];

  // Lấy id của các giáo viên đã được add
  const currentTeacherIds = useMemo(
    () => new Set(currentTeachers?.map((t) => t.teacher?.id || t.id) || []),
    [currentTeachers],
  );

  // Filter: chưa thuộc course + match search
  const availableTeachers = useMemo(() => {
    return allTeachers
      .filter((teacher) => !currentTeacherIds.has(teacher.id))
      .filter((teacher) => {
        if (!search) return true;
        const keyword = search.toLowerCase();
        return (
          teacher.fullName?.toLowerCase().includes(keyword) ||
          teacher.email?.toLowerCase().includes(keyword)
        );
      });
  }, [allTeachers, currentTeacherIds, search]);

  const getInitials = (name) => {
    if (!name) return "T";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const handleAdd = (teacherId) => {
    addTeacher({ courseId, teacherId });
  };

  const handleClose = () => {
    setSearch("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm giáo viên vào khóa học</DialogTitle>
          <DialogDescription>
            Chọn giáo viên để phân vào khóa học này
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm theo tên hoặc email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* List */}
          <div className="max-h-[400px] overflow-y-auto space-y-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              </div>
            ) : availableTeachers.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <UserPlus className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">
                  {search
                    ? "Không tìm thấy giáo viên"
                    : "Tất cả giáo viên đã được thêm vào khóa"}
                </p>
              </div>
            ) : (
              availableTeachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="h-9 w-9 flex-shrink-0">
                      <AvatarImage
                        src={teacher.avatar}
                        alt={teacher.fullName}
                      />
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-sm">
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
                    size="sm"
                    onClick={() => handleAdd(teacher.id)}
                    disabled={isPending}
                  >
                    <UserPlus className="mr-1 h-3 w-3" />
                    Thêm
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
