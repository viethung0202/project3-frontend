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
import { useDeleteFlashcardSet } from "@/hooks/useFlashcards";

export default function DeleteFlashcardSetDialog({
  moduleId,
  set,
  open,
  onClose,
}) {
  const { mutate: removeSet, isPending } = useDeleteFlashcardSet(moduleId);

  const handleDelete = () => {
    if (!set) return;
    removeSet(set.id, { onSuccess: onClose });
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa bộ flashcard?</AlertDialogTitle>
          <AlertDialogDescription>
            Bộ <strong>{set?.title}</strong> sẽ bị xóa cùng tất cả flashcards
            bên trong. Hành động không thể hoàn tác.
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
