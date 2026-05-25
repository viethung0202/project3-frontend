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
import { useDeleteQuestion } from "@/hooks/useQuizzes";

export default function DeleteQuestionDialog({
  quizId,
  question,
  open,
  onClose,
}) {
  const { mutate: removeQuestion, isPending } = useDeleteQuestion(quizId);

  const handleDelete = () => {
    if (!question) return;
    removeQuestion(question.id, { onSuccess: onClose });
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa câu hỏi?</AlertDialogTitle>
          <AlertDialogDescription>
            Câu hỏi sẽ bị xóa cùng tất cả các đáp án của nó. Hành động không
            thể hoàn tác.
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
