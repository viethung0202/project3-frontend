import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Upload, X } from "lucide-react";

export default function CourseForm({ initialData, onSubmit, isPending }) {
  const navigate = useNavigate();
  const isEdit = !!initialData;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    level: "BEGINNER",
    status: "DRAFT",
  });

  // File mới user vừa chọn (chưa upload). null = giữ ảnh cũ ở edit.
  const [thumbnailFile, setThumbnailFile] = useState(null);
  // URL preview hiển thị: blob nếu vừa chọn file, hoặc URL ảnh cũ ở edit.
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const [errors, setErrors] = useState({});

  // Fill data when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        level: initialData.level || "BEGINNER",
        status: initialData.status || "DRAFT",
      });
      setThumbnailPreview(initialData.thumbnail || "");
    }
  }, [initialData]);

  // Cleanup blob URL khi component unmount hoặc khi chọn file mới
  useEffect(() => {
    return () => {
      if (thumbnailPreview.startsWith("blob:")) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, thumbnail: "Vui lòng chọn file ảnh" }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, thumbnail: "Ảnh tối đa 5MB" }));
      return;
    }

    if (thumbnailPreview.startsWith("blob:")) {
      URL.revokeObjectURL(thumbnailPreview);
    }
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, thumbnail: "" }));
  };

  const handleRemoveThumbnail = () => {
    if (thumbnailPreview.startsWith("blob:")) {
      URL.revokeObjectURL(thumbnailPreview);
    }
    setThumbnailFile(null);
    setThumbnailPreview("");
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Vui lòng nhập tên khóa học";
    } else if (formData.title.length < 3) {
      newErrors.title = "Tên khóa học phải có ít nhất 3 ký tự";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const fd = new FormData();
    fd.append("title", formData.title);
    fd.append("description", formData.description);
    fd.append("level", formData.level);
    fd.append("status", formData.status);
    if (thumbnailFile) {
      fd.append("thumbnail", thumbnailFile);
    }
    onSubmit(fd);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Tên khóa học <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="VD: Tiếng Anh giao tiếp cơ bản"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              disabled={isPending}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              placeholder="Mô tả ngắn về khóa học..."
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              disabled={isPending}
              rows={4}
            />
          </div>

          {/* Thumbnail */}
          <div className="space-y-2">
            <Label htmlFor="thumbnail">Ảnh thumbnail</Label>
            <div className="flex items-center gap-3">
              <label
                htmlFor="thumbnail"
                className="inline-flex items-center gap-2 cursor-pointer rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
              >
                <Upload className="h-4 w-4" />
                {thumbnailPreview ? "Đổi ảnh khác" : "Chọn ảnh từ máy"}
              </label>
              <input
                id="thumbnail"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={isPending}
              />
              {thumbnailFile && (
                <span className="text-xs text-gray-600 truncate max-w-[200px]">
                  {thumbnailFile.name}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, WEBP tối đa 5MB</p>
            {errors.thumbnail && (
              <p className="text-sm text-red-500">{errors.thumbnail}</p>
            )}
            {thumbnailPreview && (
              <div className="relative mt-2 rounded-lg overflow-hidden border w-fit">
                <img
                  src={thumbnailPreview}
                  alt="Preview"
                  className="h-40 w-auto object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveThumbnail}
                  disabled={isPending}
                  className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                  aria-label="Xóa ảnh"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Level + Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="level">Cấp độ</Label>
              <Select
                value={formData.level}
                onValueChange={(v) => handleChange("level", v)}
                disabled={isPending}
              >
                <SelectTrigger id="level">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BEGINNER">Cơ bản</SelectItem>
                  <SelectItem value="INTERMEDIATE">Trung cấp</SelectItem>
                  <SelectItem value="ADVANCED">Nâng cao</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select
                value={formData.status}
                onValueChange={(v) => handleChange("status", v)}
                disabled={isPending}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Bản nháp</SelectItem>
                  <SelectItem value="PUBLISHED">Đã xuất bản</SelectItem>
                  <SelectItem value="ARCHIVED">Lưu trữ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/academic/courses")}
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
            "Tạo khóa học"
          )}
        </Button>
      </div>
    </form>
  );
}
