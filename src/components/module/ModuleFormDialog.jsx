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
import { useCreateModule, useUpdateModule } from "@/hooks/useModules";

const EMPTY = { title: "", description: "" };

export default function ModuleFormDialog({ courseId, module, open, onClose }) {
  const isEdit = !!module;
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  const { mutate: create, isPending: isCreating } = useCreateModule();
  const { mutate: update, isPending: isUpdating } = useUpdateModule(courseId);
  const isPending = isCreating || isUpdating;

  useEffect(() => {
    if (open) {
      setForm(
        module
          ? {
              title: module.title || "",
              description: module.description || "",
            }
          : EMPTY,
      );
      setErrors({});
    }
  }, [module, open]);

  const setField = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Vui lòng nhập tên module";
    else if (form.title.trim().length < 2)
      e.title = "Tên module phải có ít nhất 2 ký tự";
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
      update({ id: module.id, ...payload }, { onSuccess: onClose });
    } else {
      create({ courseId, ...payload }, { onSuccess: onClose });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Sửa module" : "Tạo module mới"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Cập nhật thông tin module."
              : "Tạo module mới cho khóa học. Thứ tự sẽ được gán tự động."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Tên module <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="VD: Unit 1 - Greetings"
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
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
              placeholder="Mô tả ngắn về nội dung module..."
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
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
