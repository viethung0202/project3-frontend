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
import { useDeleteQuiz } from "@/hooks/useQuizzes";

export default function DeleteQuizDialog({ moduleId, quiz, open, onClose }) {
  const { mutate: removeQuiz, isPending } = useDeleteQuiz(moduleId);

  const handleDelete = () => {
    if (!quiz) return;
    removeQuiz(quiz.id, { onSuccess: onClose });
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa quiz?</AlertDialogTitle>
          <AlertDialogDescription>
            Quiz <strong>{quiz?.title}</strong> sẽ bị xóa cùng tất cả câu hỏi
            và lịch sử làm bài. Hành động không thể hoàn tác.
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
