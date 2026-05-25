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
import { useDeleteUser } from "@/hooks/useUsers";

export default function DeleteUserDialog({ user, open, onClose }) {
  const { mutate: deleteUser, isPending } = useDeleteUser();

  const handleDelete = () => {
    if (!user) return;
    deleteUser(user.id, {
      onSuccess: () => onClose(),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa người dùng?</AlertDialogTitle>
          <AlertDialogDescription>
            Tài khoản <strong>{user?.fullName}</strong> ({user?.email}) sẽ bị
            xóa vĩnh viễn. Toàn bộ dữ liệu liên quan (khóa học, enrollment,
            quiz attempt) cũng sẽ bị xóa theo. Hành động này không thể hoàn
            tác.
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
