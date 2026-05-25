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
import { useCreateQuiz, useUpdateQuiz } from "@/hooks/useQuizzes";

const EMPTY = {
  title: "",
  description: "",
  timeLimit: "",
  passingScore: "50",
};

export default function QuizFormDialog({ moduleId, quiz, open, onClose }) {
  const isEdit = !!quiz;
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  const { mutate: create, isPending: isCreating } = useCreateQuiz();
  const { mutate: update, isPending: isUpdating } = useUpdateQuiz(moduleId);
  const isPending = isCreating || isUpdating;

  useEffect(() => {
    if (open) {
      setForm(
        quiz
          ? {
              title: quiz.title || "",
              description: quiz.description || "",
              timeLimit: quiz.timeLimit?.toString() || "",
              passingScore: quiz.passingScore?.toString() || "50",
            }
          : EMPTY,
      );
      setErrors({});
    }
  }, [quiz, open]);

  const setField = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Vui lòng nhập tên quiz";
    else if (form.title.trim().length < 2)
      e.title = "Tên quiz phải có ít nhất 2 ký tự";

    if (form.timeLimit) {
      const t = Number(form.timeLimit);
      if (!Number.isInteger(t) || t <= 0)
        e.timeLimit = "Thời gian phải là số nguyên dương (phút)";
    }

    const score = Number(form.passingScore);
    if (!Number.isInteger(score) || score < 0 || score > 100)
      e.passingScore = "Điểm đạt phải là số nguyên từ 0 đến 100";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      timeLimit: form.timeLimit ? Number(form.timeLimit) : null,
      passingScore: Number(form.passingScore),
    };

    if (isEdit) {
      update({ id: quiz.id, ...payload }, { onSuccess: onClose });
    } else {
      create({ moduleId, ...payload }, { onSuccess: onClose });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Sửa quiz" : "Tạo quiz mới"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Cập nhật thông tin quiz."
              : "Tạo quiz mới cho module. Sau khi tạo có thể thêm câu hỏi."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Tên quiz <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="VD: Quiz Unit 1"
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
              placeholder="Mô tả ngắn về nội dung quiz..."
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              disabled={isPending}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timeLimit">Thời gian (phút)</Label>
              <Input
                id="timeLimit"
                type="number"
                min="1"
                placeholder="Bỏ trống = không giới hạn"
                value={form.timeLimit}
                onChange={(e) => setField("timeLimit", e.target.value)}
                disabled={isPending}
                aria-invalid={!!errors.timeLimit}
              />
              {errors.timeLimit && (
                <p className="text-xs text-red-600">{errors.timeLimit}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="passingScore">
                Điểm đạt (%) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="passingScore"
                type="number"
                min="0"
                max="100"
                value={form.passingScore}
                onChange={(e) => setField("passingScore", e.target.value)}
                disabled={isPending}
                aria-invalid={!!errors.passingScore}
              />
              {errors.passingScore && (
                <p className="text-xs text-red-600">{errors.passingScore}</p>
              )}
            </div>
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
