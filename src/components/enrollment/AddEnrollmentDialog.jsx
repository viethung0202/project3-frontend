import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useUsersList } from "@/hooks/useUsers";
import { useCoursesList } from "@/hooks/useCourses";
import { useCreateEnrollment } from "@/hooks/useEnrollments";

export default function AddEnrollmentDialog({ open, onClose }) {
  const [studentId, setStudentId] = useState("");
  const [courseId, setCourseId] = useState("");

  const { data: students = [], isLoading: loadingStudents } = useUsersList({
    role: "STUDENT",
  });
  const { data: courses = [], isLoading: loadingCourses } = useCoursesList();
  const { mutate: enroll, isPending } = useCreateEnrollment();

  const activeStudents = useMemo(
    () => students.filter((s) => s.isActive),
    [students],
  );

  useEffect(() => {
    if (open) {
      setStudentId("");
      setCourseId("");
    }
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!studentId || !courseId) return;
    enroll({ studentId, courseId }, { onSuccess: onClose });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Enroll học sinh vào khóa học</DialogTitle>
          <DialogDescription>
            Chọn học sinh và khóa học để tạo enrollment mới.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="student">
              Học sinh <span className="text-red-500">*</span>
            </Label>
            <Select
              value={studentId}
              onValueChange={setStudentId}
              disabled={isPending || loadingStudents}
            >
              <SelectTrigger id="student">
                <SelectValue placeholder="Chọn học sinh..." />
              </SelectTrigger>
              <SelectContent>
                {activeStudents.length === 0 ? (
                  <div className="px-2 py-1.5 text-sm text-gray-500">
                    Không có học sinh
                  </div>
                ) : (
                  activeStudents.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.fullName} — {s.email}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="course">
              Khóa học <span className="text-red-500">*</span>
            </Label>
            <Select
              value={courseId}
              onValueChange={setCourseId}
              disabled={isPending || loadingCourses}
            >
              <SelectTrigger id="course">
                <SelectValue placeholder="Chọn khóa học..." />
              </SelectTrigger>
              <SelectContent>
                {courses.length === 0 ? (
                  <div className="px-2 py-1.5 text-sm text-gray-500">
                    Không có khóa học
                  </div>
                ) : (
                  courses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isPending || !studentId || !courseId}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang enroll...
                </>
              ) : (
                "Enroll"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
