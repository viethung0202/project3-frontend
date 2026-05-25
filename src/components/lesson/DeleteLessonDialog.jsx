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
import { useDeleteLesson } from "@/hooks/useLessons";

export default function DeleteLessonDialog({ moduleId, lesson, open, onClose }) {
  const { mutate: removeLesson, isPending } = useDeleteLesson(moduleId);

  const handleDelete = () => {
    if (!lesson) return;
    removeLesson(lesson.id, { onSuccess: onClose });
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa lesson?</AlertDialogTitle>
          <AlertDialogDescription>
            Lesson <strong>{lesson?.title}</strong> sẽ bị xóa vĩnh viễn. Hành
            động không thể hoàn tác.
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
