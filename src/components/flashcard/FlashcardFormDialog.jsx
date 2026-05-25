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
import { Loader2, Upload, X } from "lucide-react";
import { useCreateFlashcard, useUpdateFlashcard } from "@/hooks/useFlashcards";

const EMPTY = {
  front: "",
  back: "",
  example: "",
  pronunciation: "",
  audioUrl: "",
};

export default function FlashcardFormDialog({ setId, card, open, onClose }) {
  const isEdit = !!card;
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const { mutate: create, isPending: isCreating } = useCreateFlashcard(setId);
  const { mutate: update, isPending: isUpdating } = useUpdateFlashcard(setId);
  const isPending = isCreating || isUpdating;

  useEffect(() => {
    if (open) {
      setForm(
        card
          ? {
              front: card.front || "",
              back: card.back || "",
              example: card.example || "",
              pronunciation: card.pronunciation || "",
              audioUrl: card.audioUrl || "",
            }
          : EMPTY,
      );
      setImageFile(null);
      setImagePreview(card?.imageUrl || "");
      setErrors({});
    }
  }, [card, open]);

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const setField = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors((p) => ({ ...p, image: "Vui lòng chọn file ảnh" }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((p) => ({ ...p, image: "Ảnh tối đa 5MB" }));
      return;
    }
    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((p) => ({ ...p, image: "" }));
  };

  const handleRemoveImage = () => {
    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview(card?.imageUrl || "");
  };

  const validate = () => {
    const e = {};
    if (!form.front.trim()) e.front = "Vui lòng nhập mặt trước";
    if (!form.back.trim()) e.back = "Vui lòng nhập mặt sau";
    if (form.audioUrl && !/^https?:\/\/.+/.test(form.audioUrl))
      e.audioUrl = "URL phải bắt đầu bằng http:// hoặc https://";
    setErrors((p) => ({ ...p, ...e }));
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const fd = new FormData();
    fd.append("front", form.front.trim());
    fd.append("back", form.back.trim());
    if (form.example.trim()) fd.append("example", form.example.trim());
    if (form.pronunciation.trim())
      fd.append("pronunciation", form.pronunciation.trim());
    if (form.audioUrl.trim()) fd.append("audioUrl", form.audioUrl.trim());
    if (imageFile) fd.append("image", imageFile);

    if (isEdit) {
      update({ id: card.id, formData: fd }, { onSuccess: onClose });
    } else {
      create({ setId, formData: fd }, { onSuccess: onClose });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Sửa flashcard" : "Tạo flashcard mới"}
          </DialogTitle>
          <DialogDescription>
            Mặt trước (từ vựng / câu hỏi) và mặt sau (nghĩa / câu trả lời) là
            bắt buộc.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="front">
                Mặt trước <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="front"
                placeholder="hello"
                value={form.front}
                onChange={(e) => setField("front", e.target.value)}
                disabled={isPending}
                rows={3}
                aria-invalid={!!errors.front}
              />
              {errors.front && (
                <p className="text-xs text-red-600">{errors.front}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="back">
                Mặt sau <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="back"
                placeholder="xin chào"
                value={form.back}
                onChange={(e) => setField("back", e.target.value)}
                disabled={isPending}
                rows={3}
                aria-invalid={!!errors.back}
              />
              {errors.back && (
                <p className="text-xs text-red-600">{errors.back}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pronunciation">Phát âm (IPA)</Label>
            <Input
              id="pronunciation"
              placeholder="/həˈloʊ/"
              value={form.pronunciation}
              onChange={(e) => setField("pronunciation", e.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="example">Câu ví dụ</Label>
            <Textarea
              id="example"
              placeholder="Hello, how are you?"
              value={form.example}
              onChange={(e) => setField("example", e.target.value)}
              disabled={isPending}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="audioUrl">Audio URL</Label>
            <Input
              id="audioUrl"
              placeholder="https://example.com/audio.mp3"
              value={form.audioUrl}
              onChange={(e) => setField("audioUrl", e.target.value)}
              disabled={isPending}
              aria-invalid={!!errors.audioUrl}
            />
            {errors.audioUrl && (
              <p className="text-xs text-red-600">{errors.audioUrl}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Hình minh họa</Label>
            <div className="flex items-center gap-3">
              <label
                htmlFor="image"
                className="inline-flex items-center gap-2 cursor-pointer rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                <Upload className="h-4 w-4" />
                {imagePreview ? "Đổi ảnh" : "Chọn ảnh"}
              </label>
              <input
                id="image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={isPending}
              />
              {imageFile && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveImage}
                  disabled={isPending}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            {errors.image && (
              <p className="text-xs text-red-600">{errors.image}</p>
            )}
            {imagePreview && (
              <div className="mt-2 rounded-lg overflow-hidden border w-fit">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-32 w-auto object-cover"
                />
              </div>
            )}
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
