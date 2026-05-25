import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import {
  useCreateFlashcardSet,
  useUpdateFlashcardSet,
} from "@/hooks/useFlashcards";

const EMPTY = { title: "", description: "" };

export default function FlashcardSetFormDialog({
  moduleId,
  set,
  open,
  onClose,
}) {
  const isEdit = !!set;
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  const { mutate: create, isPending: isCreating } = useCreateFlashcardSet();
  const { mutate: update, isPending: isUpdating } =
    useUpdateFlashcardSet(moduleId);
  const isPending = isCreating || isUpdating;

  useEffect(() => {
    if (open) {
      setForm(
        set
          ? { title: set.title || "", description: set.description || "" }
          : EMPTY,
      );
      setErrors({});
    }
  }, [set, open]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Vui lòng nhập tên bộ flashcard";
    else if (form.title.trim().length < 2)
      e.title = "Tên phải có ít nhất 2 ký tự";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
    };

    if (isEdit) {
      update({ id: set.id, ...payload }, { onSuccess: onClose });
    } else {
      create({ moduleId, ...payload }, { onSuccess: onClose });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Sửa bộ flashcard" : "Tạo bộ flashcard mới"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Cập nhật thông tin bộ flashcard."
              : "Tạo bộ flashcard mới cho module. Sau khi tạo có thể thêm từng card."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Tên bộ <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="VD: Vocabulary Unit 1"
              value={form.title}
              onChange={(e) => {
                setForm((p) => ({ ...p, title: e.target.value }));
                if (errors.title) setErrors((p) => ({ ...p, title: "" }));
              }}
              disabled={isPending}
              aria-invalid={!!errors.title}
            />
            {errors.title && (
              <p className="text-xs text-red-600">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              placeholder="Mô tả ngắn về nội dung bộ flashcard..."
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              disabled={isPending}
              rows={3}
            />
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
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : isEdit ? (
                "Cập nhật"
              ) : (
                "Tạo"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
