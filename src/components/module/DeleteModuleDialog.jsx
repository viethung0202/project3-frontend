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
import { useDeleteModule } from "@/hooks/useModules";

export default function DeleteModuleDialog({ courseId, module, open, onClose }) {
  const { mutate: removeModule, isPending } = useDeleteModule(courseId);

  const handleDelete = () => {
    if (!module) return;
    removeModule(module.id, { onSuccess: onClose });
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa module?</AlertDialogTitle>
          <AlertDialogDescription>
            Module <strong>{module?.title}</strong> sẽ bị xóa. Toàn bộ lessons,
            quizzes và flashcard sets bên trong cũng sẽ bị xóa theo. Hành động
            không thể hoàn tác.
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
