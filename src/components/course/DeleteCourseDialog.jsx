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
import { useDeleteCourse } from "@/hooks/useCourses";

export default function DeleteCourseDialog({ course, open, onClose }) {
  const { mutate: deleteCourse, isPending } = useDeleteCourse();

  const handleDelete = () => {
    if (!course) return;
    deleteCourse(course.id, {
      onSuccess: () => onClose(),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa khóa học?</AlertDialogTitle>
          <AlertDialogDescription>
            Khóa học "<strong>{course?.title}</strong>" sẽ bị xóa vĩnh viễn.
            Toàn bộ modules, lessons, quizzes và flashcards của khóa cũng sẽ bị
            xóa theo. Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {isPending ? "Đang xóa..." : "Xóa"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
