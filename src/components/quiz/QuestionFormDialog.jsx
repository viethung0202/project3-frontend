import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Trash2, Check, X } from "lucide-react";
import {
  createQuestion,
  updateQuestion,
  createAnswer,
  updateAnswer,
  deleteAnswer,
} from "@/lib/api";
import { QUESTION_TYPES } from "@/utils/constants";

const EMPTY_ANSWER = () => ({
  _key: Math.random().toString(36).slice(2),
  id: null,
  content: "",
  isCorrect: false,
});

const EMPTY_FORM = {
  content: "",
  type: "SINGLE_CHOICE",
  points: "1",
  answers: [EMPTY_ANSWER(), EMPTY_ANSWER()],
};

export default function QuestionFormDialog({
  quizId,
  question,
  open,
  onClose,
}) {
  const queryClient = useQueryClient();
  const isEdit = !!question;
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      if (question) {
        setForm({
          content: question.content || "",
          type: question.type || "SINGLE_CHOICE",
          points: question.points?.toString() || "1",
          answers: (question.answers || []).map((a) => ({
            _key: a.id,
            id: a.id,
            content: a.content,
            isCorrect: a.isCorrect,
          })),
        });
      } else {
        setForm({
          ...EMPTY_FORM,
          answers: [EMPTY_ANSWER(), EMPTY_ANSWER()],
        });
      }
      setErrors({});
    }
  }, [question, open]);

  const setField = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  };

  const updateAnswerRow = (key, patch) => {
    setForm((p) => ({
      ...p,
      answers: p.answers.map((a) => (a._key === key ? { ...a, ...patch } : a)),
    }));
  };

  const toggleCorrect = (key) => {
    setForm((p) => {
      if (p.type === "SINGLE_CHOICE" || p.type === "TRUE_FALSE") {
        // Single correct: chỉ 1 đáp án đúng
        return {
          ...p,
          answers: p.answers.map((a) => ({
            ...a,
            isCorrect: a._key === key,
          })),
        };
      }
      // MULTIPLE_CHOICE: toggle
      return {
        ...p,
        answers: p.answers.map((a) =>
          a._key === key ? { ...a, isCorrect: !a.isCorrect } : a,
        ),
      };
    });
  };

  const addAnswer = () => {
    setForm((p) => ({ ...p, answers: [...p.answers, EMPTY_ANSWER()] }));
  };

  const removeAnswer = (key) => {
    setForm((p) => ({
      ...p,
      answers: p.answers.filter((a) => a._key !== key),
    }));
  };

  const handleTypeChange = (newType) => {
    setForm((p) => {
      let newAnswers = p.answers;
      if (newType === "TRUE_FALSE") {
        // Cố định 2 đáp án True/False
        newAnswers = [
          { _key: "true", id: null, content: "Đúng", isCorrect: true },
          { _key: "false", id: null, content: "Sai", isCorrect: false },
        ];
      } else if (newType === "SINGLE_CHOICE") {
        // Đảm bảo chỉ có 1 correct
        let foundCorrect = false;
        newAnswers = p.answers.map((a) => {
          if (a.isCorrect && !foundCorrect) {
            foundCorrect = true;
            return a;
          }
          return { ...a, isCorrect: false };
        });
      }
      return { ...p, type: newType, answers: newAnswers };
    });
  };

  const validate = () => {
    const e = {};
    if (!form.content.trim()) e.content = "Vui lòng nhập nội dung câu hỏi";

    const points = Number(form.points);
    if (!Number.isInteger(points) || points <= 0)
      e.points = "Điểm phải là số nguyên dương";

    const answers = form.answers.filter((a) => a.content.trim());
    if (answers.length < 2)
      e.answers = "Câu hỏi phải có ít nhất 2 đáp án có nội dung";

    const correctCount = answers.filter((a) => a.isCorrect).length;
    if (form.type === "SINGLE_CHOICE" || form.type === "TRUE_FALSE") {
      if (correctCount !== 1)
        e.answers = `${form.type === "TRUE_FALSE" ? "Đúng/Sai" : "Câu hỏi 1 đáp án"}: phải có đúng 1 đáp án đúng`;
    } else if (form.type === "MULTIPLE_CHOICE") {
      if (correctCount < 1)
        e.answers = "Câu hỏi nhiều đáp án: phải có ít nhất 1 đáp án đúng";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const syncAnswers = async (questionId, formAnswers, originalAnswers = []) => {
    const validForm = formAnswers.filter((a) => a.content.trim());
    const formIds = new Set(validForm.filter((a) => a.id).map((a) => a.id));

    // Delete những answer cũ không còn trong form
    const toDelete = originalAnswers.filter((a) => !formIds.has(a.id));
    await Promise.all(toDelete.map((a) => deleteAnswer(a.id)));

    // Update existing, create new
    await Promise.all(
      validForm.map((a) => {
        if (a.id) {
          return updateAnswer({
            id: a.id,
            content: a.content.trim(),
            isCorrect: a.isCorrect,
          });
        }
        return createAnswer({
          questionId,
          content: a.content.trim(),
          isCorrect: a.isCorrect,
        });
      }),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        content: form.content.trim(),
        type: form.type,
        points: Number(form.points),
      };

      if (isEdit) {
        await updateQuestion({ id: question.id, ...payload });
        await syncAnswers(question.id, form.answers, question.answers || []);
        toast.success("Cập nhật câu hỏi thành công");
      } else {
        const res = await createQuestion({ quizId, ...payload });
        const newQuestionId = res?.data?.id;
        if (!newQuestionId) throw new Error("Không lấy được ID câu hỏi mới");
        await syncAnswers(newQuestionId, form.answers, []);
        toast.success("Tạo câu hỏi thành công");
      }
      queryClient.invalidateQueries({ queryKey: ["quiz", quizId] });
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Lưu câu hỏi thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const isLockAnswers = form.type === "TRUE_FALSE";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Sửa câu hỏi" : "Tạo câu hỏi mới"}
          </DialogTitle>
          <DialogDescription>
            Nhập nội dung, chọn loại câu hỏi và thêm các đáp án. Tích chọn đáp
            án đúng.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">
              Nội dung câu hỏi <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="content"
              placeholder="VD: What is the capital of England?"
              value={form.content}
              onChange={(e) => setField("content", e.target.value)}
              disabled={submitting}
              rows={2}
              aria-invalid={!!errors.content}
            />
            {errors.content && (
              <p className="text-xs text-red-600">{errors.content}</p>
            )}
          </div>

          {/* Type + Points */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">
                Loại câu hỏi <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.type}
                onValueChange={handleTypeChange}
                disabled={submitting}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(QUESTION_TYPES).map(([v, label]) => (
                    <SelectItem key={v} value={v}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="points">
                Điểm <span className="text-red-500">*</span>
              </Label>
              <Input
                id="points"
                type="number"
                min="1"
                value={form.points}
                onChange={(e) => setField("points", e.target.value)}
                disabled={submitting}
                aria-invalid={!!errors.points}
              />
              {errors.points && (
                <p className="text-xs text-red-600">{errors.points}</p>
              )}
            </div>
          </div>

          {/* Answers */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>
                Đáp án <span className="text-red-500">*</span>
              </Label>
              {!isLockAnswers && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={addAnswer}
                  disabled={submitting}
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Thêm đáp án
                </Button>
              )}
            </div>

            <div className="space-y-2">
              {form.answers.map((a, idx) => (
                <div
                  key={a._key}
                  className="flex items-center gap-2 p-2 rounded-md border bg-gray-50"
                >
                  <button
                    type="button"
                    onClick={() => toggleCorrect(a._key)}
                    disabled={submitting}
                    className={`h-6 w-6 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                      a.isCorrect
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "bg-white border-2 border-gray-300 hover:border-gray-400"
                    }`}
                    title={a.isCorrect ? "Đáp án đúng" : "Đánh dấu là đúng"}
                  >
                    {a.isCorrect && <Check className="h-3 w-3" />}
                  </button>

                  <span className="text-xs text-gray-500 w-6 flex-shrink-0">
                    {String.fromCharCode(65 + idx)}.
                  </span>

                  <Input
                    placeholder="Nội dung đáp án..."
                    value={a.content}
                    onChange={(e) =>
                      updateAnswerRow(a._key, { content: e.target.value })
                    }
                    disabled={submitting || isLockAnswers}
                    className="flex-1 bg-white"
                  />

                  {!isLockAnswers && form.answers.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                      onClick={() => removeAnswer(a._key)}
                      disabled={submitting}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {errors.answers && (
              <p className="text-xs text-red-600">{errors.answers}</p>
            )}
            <p className="text-xs text-gray-500">
              {form.type === "SINGLE_CHOICE"
                ? "Click vào ô vuông để chọn 1 đáp án đúng."
                : form.type === "MULTIPLE_CHOICE"
                  ? "Click vào ô vuông để chọn các đáp án đúng (≥ 1)."
                  : "Câu hỏi Đúng/Sai có 2 đáp án cố định."}
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
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
