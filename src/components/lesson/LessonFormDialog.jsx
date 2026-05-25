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
import { useCreateLesson, useUpdateLesson } from "@/hooks/useLessons";

const EMPTY = { title: "", content: "", videoUrl: "" };

export default function LessonFormDialog({ moduleId, lesson, open, onClose }) {
  const isEdit = !!lesson;
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  const { mutate: create, isPending: isCreating } = useCreateLesson();
  const { mutate: update, isPending: isUpdating } = useUpdateLesson(moduleId);
  const isPending = isCreating || isUpdating;

  useEffect(() => {
    if (open) {
      setForm(
        lesson
          ? {
              title: lesson.title || "",
              content: lesson.content || "",
              videoUrl: lesson.videoUrl || "",
            }
          : EMPTY,
      );
      setErrors({});
    }
  }, [lesson, open]);

  const setField = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Vui lòng nhập tên lesson";
    else if (form.title.trim().length < 2)
      e.title = "Tên lesson phải có ít nhất 2 ký tự";
    if (form.videoUrl && !/^https?:\/\/.+/.test(form.videoUrl))
      e.videoUrl = "URL video phải bắt đầu bằng http:// hoặc https://";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      title: form.title.trim(),
      content: form.content.trim() || undefined,
      videoUrl: form.videoUrl.trim() || undefined,
    };

    if (isEdit) {
      update({ id: lesson.id, ...payload }, { onSuccess: onClose });
    } else {
      create({ moduleId, ...payload }, { onSuccess: onClose });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Sửa lesson" : "Tạo lesson mới"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Cập nhật nội dung lesson."
              : "Thêm lesson mới vào module. Thứ tự sẽ được gán tự động."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Tên lesson <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="VD: Lesson 1 - Hello"
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
            <Label htmlFor="videoUrl">Video URL</Label>
            <Input
              id="videoUrl"
              placeholder="https://youtube.com/watch?v=..."
              value={form.videoUrl}
              onChange={(e) => setField("videoUrl", e.target.value)}
              disabled={isPending}
              aria-invalid={!!errors.videoUrl}
            />
            {errors.videoUrl && (
              <p className="text-xs text-red-600">{errors.videoUrl}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Nội dung</Label>
            <Textarea
              id="content"
              placeholder="Nội dung bài học (hỗ trợ HTML/Markdown)..."
              value={form.content}
              onChange={(e) => setField("content", e.target.value)}
              disabled={isPending}
              rows={8}
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
