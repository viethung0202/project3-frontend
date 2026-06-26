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
import { Loader2, Upload, Link2, X, FileVideo, FileText } from "lucide-react";
import { useCreateLesson, useUpdateLesson } from "@/hooks/useLessons";
import LessonDocumentsManager from "@/components/document/LessonDocumentsManager";

const EMPTY = { title: "", content: "", videoUrl: "" };
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_PDF_SIZE = 20 * 1024 * 1024; // 20MB
const formatMB = (bytes) => (bytes / 1024 / 1024).toFixed(1);

export default function LessonFormDialog({ moduleId, lesson, open, onClose }) {
  const isEdit = !!lesson;
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [videoMode, setVideoMode] = useState("url"); // "url" | "upload"
  const [videoFile, setVideoFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

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
      setVideoFile(null);
      setPdfFile(null);
      setVideoMode("url");
    }
  }, [lesson, open]);

  const setField = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      setErrors((p) => ({ ...p, video: "Vui lòng chọn file video" }));
      return;
    }
    if (file.size > MAX_VIDEO_SIZE) {
      setErrors((p) => ({
        ...p,
        video: `Video tối đa 100MB (file của bạn: ${formatMB(file.size)}MB)`,
      }));
      return;
    }
    setVideoFile(file);
    setErrors((p) => ({ ...p, video: "" }));
  };

  const removeFile = () => {
    setVideoFile(null);
    setErrors((p) => ({ ...p, video: "" }));
  };

  const handlePdfChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setErrors((p) => ({ ...p, pdf: "Vui lòng chọn file PDF" }));
      return;
    }
    if (file.size > MAX_PDF_SIZE) {
      setErrors((p) => ({
        ...p,
        pdf: `PDF tối đa 20MB (file của bạn: ${formatMB(file.size)}MB)`,
      }));
      return;
    }
    setPdfFile(file);
    setErrors((p) => ({ ...p, pdf: "" }));
  };

  const removePdf = () => {
    setPdfFile(null);
    setErrors((p) => ({ ...p, pdf: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Vui lòng nhập tên lesson";
    else if (form.title.trim().length < 2)
      e.title = "Tên lesson phải có ít nhất 2 ký tự";
    if (
      videoMode === "url" &&
      form.videoUrl &&
      !/^https?:\/\/.+/.test(form.videoUrl)
    )
      e.videoUrl = "URL video phải bắt đầu bằng http:// hoặc https://";
    setErrors((p) => ({ ...p, ...e }));
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const fd = new FormData();
    fd.append("title", form.title.trim());
    if (form.content.trim()) fd.append("content", form.content.trim());

    if (videoMode === "upload" && videoFile) {
      // File mới → backend sẽ upload Cloudinary và override videoUrl
      fd.append("video", videoFile);
    } else if (videoMode === "url") {
      // Chỉ gửi videoUrl nếu user thực sự nhập (kể cả empty để clear)
      if (form.videoUrl !== (lesson?.videoUrl || "")) {
        fd.append("videoUrl", form.videoUrl.trim());
      }
    }

    if (pdfFile) {
      fd.append("pdf", pdfFile);
    }

    const onSuccess = onClose;
    if (isEdit) {
      update({ id: lesson.id, formData: fd }, { onSuccess });
    } else {
      create({ moduleId, formData: fd }, { onSuccess });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
            <Label>Video bài giảng</Label>

            {/* Toggle tabs */}
            <div className="inline-flex rounded-md border bg-gray-50 p-0.5 text-sm">
              <button
                type="button"
                onClick={() => setVideoMode("url")}
                disabled={isPending}
                className={`inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5 transition-colors ${
                  videoMode === "url"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Link2 className="h-3.5 w-3.5" />
                Dùng link
              </button>
              <button
                type="button"
                onClick={() => setVideoMode("upload")}
                disabled={isPending}
                className={`inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5 transition-colors ${
                  videoMode === "upload"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Upload className="h-3.5 w-3.5" />
                Upload từ máy
              </button>
            </div>

            {videoMode === "url" ? (
              <>
                <Input
                  id="videoUrl"
                  placeholder="https://youtube.com/watch?v=..."
                  value={form.videoUrl}
                  onChange={(e) => setField("videoUrl", e.target.value)}
                  disabled={isPending}
                  aria-invalid={!!errors.videoUrl}
                />
                <p className="text-xs text-gray-500">
                  Paste link YouTube, Vimeo hoặc Cloudinary URL.
                </p>
                {errors.videoUrl && (
                  <p className="text-xs text-red-600">{errors.videoUrl}</p>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <label
                    htmlFor="video-file"
                    className={`inline-flex items-center gap-2 cursor-pointer rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-muted ${
                      isPending ? "pointer-events-none opacity-50" : ""
                    }`}
                  >
                    <Upload className="h-4 w-4" />
                    {videoFile ? "Đổi video khác" : "Chọn video"}
                  </label>
                  <input
                    id="video-file"
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isPending}
                  />
                  {videoFile && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                      disabled={isPending}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {videoFile && (
                  <div className="flex items-center gap-2 p-3 rounded-md border bg-blue-50">
                    <FileVideo className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {videoFile.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatMB(videoFile.size)} MB
                      </p>
                    </div>
                  </div>
                )}

                {!videoFile && lesson?.videoUrl && (
                  <p className="text-xs text-gray-500">
                    Video hiện tại đang dùng URL.{" "}
                    {form.videoUrl && (
                      <span className="break-all">{form.videoUrl}</span>
                    )}
                    {" — "}Chọn file mới để thay thế.
                  </p>
                )}

                <p className="text-xs text-gray-500">MP4, WebM, MOV — tối đa 100MB</p>
                {errors.video && (
                  <p className="text-xs text-red-600">{errors.video}</p>
                )}
              </>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Ghi chú ngắn (tuỳ chọn)</Label>
            <Textarea
              id="content"
              placeholder="Mô tả ngắn về bài học, hoặc để trống nếu đã upload PDF..."
              value={form.content}
              onChange={(e) => setField("content", e.target.value)}
              disabled={isPending}
              rows={4}
            />
          </div>

          {/* PDF upload */}
          <div className="space-y-2">
            <Label>Tài liệu PDF</Label>
            <div className="flex items-center gap-3">
              <label
                htmlFor="pdf-file"
                className={`inline-flex items-center gap-2 cursor-pointer rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-muted ${
                  isPending ? "pointer-events-none opacity-50" : ""
                }`}
              >
                <Upload className="h-4 w-4" />
                {pdfFile ? "Đổi PDF khác" : "Chọn file PDF"}
              </label>
              <input
                id="pdf-file"
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handlePdfChange}
                disabled={isPending}
              />
              {pdfFile && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removePdf}
                  disabled={isPending}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {pdfFile && (
              <div className="flex items-center gap-2 p-3 rounded-md border bg-red-50">
                <FileText className="h-5 w-5 text-red-600 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">
                    {pdfFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatMB(pdfFile.size)} MB
                  </p>
                </div>
              </div>
            )}

            {!pdfFile && lesson?.pdfUrl && (
              <a
                href={lesson.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs text-blue-600 hover:underline"
              >
                <FileText className="h-3 w-3" />
                Xem PDF hiện tại
              </a>
            )}

            <p className="text-xs text-gray-500">PDF tối đa 20MB (cách cũ — nên dùng "Tài liệu đính kèm" bên dưới)</p>
            {errors.pdf && (
              <p className="text-xs text-red-600">{errors.pdf}</p>
            )}
          </div>

          {/* Tài liệu đính kèm — many-to-many với Document */}
          {isEdit && (
            <div className="pt-3 border-t">
              <LessonDocumentsManager
                lesson={lesson}
                moduleId={moduleId}
                courseId={lesson?.module?.courseId}
              />
            </div>
          )}

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
