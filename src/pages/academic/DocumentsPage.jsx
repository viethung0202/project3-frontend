import { useMemo, useState } from "react";
import {
  FileText,
  Upload,
  Pencil,
  Trash2,
  Search,
  ExternalLink,
  Loader2,
  Plus,
  Video,
  Music,
  FileSpreadsheet,
  Presentation,
  FileType,
  X,
  Eye,
  EyeOff,
  Download,
  Lock,
  Star,
  MessageSquare,
  Layers,
  ChevronDown,
  ChevronRight,
  Rows3,
  FolderTree,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useDocuments,
  useCreateDocument,
  useUpdateDocument,
  useDeleteDocument,
} from "@/hooks/useDocuments";
import { useCoursesList } from "@/hooks/useCourses";
import DocumentViewer from "@/components/document/DocumentViewer";

export default function DocumentsPage() {
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");

  const queryParams = useMemo(() => {
    const p = {};
    if (search) p.search = search;
    if (courseFilter === "none") p.courseId = "null";
    else if (courseFilter !== "all") p.courseId = courseFilter;
    return p;
  }, [search, courseFilter]);

  const { data: documents = [], isLoading } = useDocuments(queryParams);
  const { data: courses = [] } = useCoursesList();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [previewing, setPreviewing] = useState(null);
  const [viewMode, setViewMode] = useState("flat"); // "flat" | "grouped"

  const deleteMutation = useDeleteDocument();

  // Group documents by course (cho viewMode = "grouped")
  const grouped = useMemo(() => {
    const map = new Map();
    for (const doc of documents) {
      const key = doc.courseId || "__none__";
      const courseTitle = doc.course?.title || "Tài liệu không gắn khóa học";
      if (!map.has(key)) map.set(key, { courseId: key, courseTitle, docs: [] });
      map.get(key).docs.push(doc);
    }
    // Sort: courses with title alphabetically, "none" last
    return Array.from(map.values()).sort((a, b) => {
      if (a.courseId === "__none__") return 1;
      if (b.courseId === "__none__") return -1;
      return a.courseTitle.localeCompare(b.courseTitle);
    });
  }, [documents]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="h-5 w-5 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              Quản lý học liệu
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            Tài liệu bổ sung dùng cho các khóa học. Hỗ trợ PDF, Word, Excel,
            PowerPoint, video, audio.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm học liệu
        </Button>
      </div>

      {/* Filter + View toggle */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo tên, mô tả..."
                className="pl-9"
              />
            </div>
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Lọc theo khóa học" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả khóa học</SelectItem>
                <SelectItem value="none">Không gắn khóa học</SelectItem>
                {courses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="inline-flex rounded-md border bg-gray-50 p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("flat")}
                className={`inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-sm transition-colors ${
                  viewMode === "flat"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                title="Xem dạng bảng"
              >
                <Rows3 className="h-4 w-4" />
                Phẳng
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grouped")}
                className={`inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-sm transition-colors ${
                  viewMode === "grouped"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                title="Nhóm theo khóa học"
              >
                <FolderTree className="h-4 w-4" />
                Theo khóa học
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grouped view */}
      {!isLoading && documents.length > 0 && viewMode === "grouped" && (
        <div className="space-y-3">
          {grouped.map((g) => (
            <GroupedCourseSection
              key={g.courseId}
              group={g}
              onEdit={(doc) => {
                setEditing(doc);
                setDialogOpen(true);
              }}
              onDelete={(doc) => setDeleteTarget(doc)}
              onPreview={(doc) => setPreviewing(doc)}
            />
          ))}
        </div>
      )}

      {/* Table */}
      {viewMode === "flat" && (
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-700 font-medium">Chưa có học liệu nào</p>
              <p className="text-sm text-gray-500 mt-1">
                Bấm "Thêm học liệu" để tải file lên.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Khóa học</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Lesson</TableHead>
                  <TableHead>HS đánh giá</TableHead>
                  <TableHead>GV góp ý</TableHead>
                  <TableHead>Ngày upload</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <div className="flex items-center gap-3 min-w-0">
                        <FileIcon ext={doc.fileType} />
                        <div className="min-w-0">
                          <p className="font-medium truncate">{doc.title}</p>
                          {doc.description && (
                            <p className="text-xs text-gray-500 truncate max-w-md">
                              {doc.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="uppercase text-xs">
                        {doc.fileType || "file"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {doc.course?.title || (
                        <span className="text-gray-400 italic">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {doc.isPublished ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-[10px] h-5 w-fit">
                            <Eye className="h-2.5 w-2.5 mr-1" /> Đã công bố
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-600 text-[10px] h-5 w-fit">
                            <EyeOff className="h-2.5 w-2.5 mr-1" /> Nội bộ
                          </Badge>
                        )}
                        {doc.allowDownload ? (
                          <Badge variant="outline" className="border-blue-200 text-blue-700 text-[10px] h-5 w-fit">
                            <Download className="h-2.5 w-2.5 mr-1" /> Cho tải
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-orange-200 text-orange-700 text-[10px] h-5 w-fit">
                            <Lock className="h-2.5 w-2.5 mr-1" /> Chỉ xem
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {doc.lessons?.length > 0 ? (
                        <div className="flex flex-col gap-0.5 max-w-[180px]">
                          {doc.lessons.slice(0, 2).map((ld) => (
                            <span
                              key={ld.id}
                              className="text-xs text-gray-700 truncate inline-flex items-center gap-1"
                              title={ld.lesson?.title}
                            >
                              <Layers className="h-3 w-3 text-gray-400 flex-shrink-0" />
                              {ld.lesson?.title || "—"}
                            </span>
                          ))}
                          {doc.lessons.length > 2 && (
                            <span className="text-[10px] text-gray-500">
                              +{doc.lessons.length - 2} lesson khác
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {doc.reviewCount > 0 ? (
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-medium">{doc.avgRating}</span>
                          <span className="text-xs text-gray-500">
                            ({doc.reviewCount})
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Chưa có</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {doc.feedbackCount > 0 ? (
                        <div className="flex items-center gap-1 text-sm text-blue-700">
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span className="font-medium">{doc.feedbackCount}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Chưa có</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(doc.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setPreviewing(doc)}
                          title="Xem file"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditing(doc);
                            setDialogOpen(true);
                          }}
                          title="Sửa"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setDeleteTarget(doc)}
                          title="Xóa"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      )}

      {/* Form dialog */}
      <DocumentFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editing={editing}
        courses={courses}
      />

      {/* File viewer */}
      <DocumentViewer
        document={previewing}
        open={!!previewing}
        onOpenChange={(o) => !o && setPreviewing(null)}
      />

      {/* Delete confirm */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa học liệu này?</AlertDialogTitle>
            <AlertDialogDescription>
              Học liệu "{deleteTarget?.title}" sẽ bị xóa vĩnh viễn khỏi hệ
              thống. Hành động không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Huỷ</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() =>
                deleteMutation.mutate(deleteTarget.id, {
                  onSuccess: () => setDeleteTarget(null),
                })
              }
            >
              {deleteMutation.isPending ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function DocumentFormDialog({ open, onOpenChange, editing, courses }) {
  const isEdit = !!editing;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState("none");
  const [isPublished, setIsPublished] = useState(true);
  const [allowDownload, setAllowDownload] = useState(true);
  const [file, setFile] = useState(null);

  useMemo(() => {
    if (open) {
      setTitle(editing?.title || "");
      setDescription(editing?.description || "");
      setCourseId(editing?.courseId || "none");
      setIsPublished(editing?.isPublished ?? true);
      setAllowDownload(editing?.allowDownload ?? true);
      setFile(null);
    }
  }, [open, editing]);

  const createMutation = useCreateDocument();
  const updateMutation = useUpdateDocument();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (!isEdit && !file) return;

    const formData = new FormData();
    formData.append("title", title.trim());
    if (description) formData.append("description", description.trim());
    formData.append("courseId", courseId === "none" ? "" : courseId);
    formData.append("isPublished", String(isPublished));
    formData.append("allowDownload", String(allowDownload));
    if (file) formData.append("file", file);

    if (isEdit) {
      updateMutation.mutate(
        { id: editing.id, formData },
        { onSuccess: () => onOpenChange(false) },
      );
    } else {
      createMutation.mutate(formData, { onSuccess: () => onOpenChange(false) });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Sửa học liệu" : "Thêm học liệu mới"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Cập nhật thông tin. Chỉ chọn file mới nếu muốn thay file cũ."
              : "Tải lên file học liệu (tối đa 50MB)."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="doc-title">
              Tiêu đề <span className="text-red-500">*</span>
            </Label>
            <Input
              id="doc-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: TOEIC Basic - Unit 1 Vocabulary"
              required
            />
          </div>

          <div>
            <Label htmlFor="doc-desc">Mô tả</Label>
            <Textarea
              id="doc-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả ngắn về tài liệu này..."
              rows={3}
            />
          </div>

          <div>
            <Label>Khóa học liên kết</Label>
            <Select value={courseId} onValueChange={setCourseId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  Không gắn — tài liệu chung
                </SelectItem>
                {courses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              Học liệu gắn khóa học chỉ student đã đăng ký khóa đó mới xem được.
              Để trống = mọi user login đều xem được.
            </p>
          </div>

          <div className="space-y-3 p-3 rounded-lg border bg-gray-50">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <Label className="flex items-center gap-1.5">
                  {isPublished ? (
                    <Eye className="h-4 w-4 text-green-600" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  )}
                  Công bố cho học sinh
                </Label>
                <p className="text-xs text-gray-500 mt-0.5">
                  Tắt = tài liệu nội bộ, chỉ giáo vụ và giáo viên thấy.
                </p>
              </div>
              <Switch checked={isPublished} onCheckedChange={setIsPublished} />
            </div>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <Label className="flex items-center gap-1.5">
                  {allowDownload ? (
                    <Download className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Lock className="h-4 w-4 text-orange-600" />
                  )}
                  Cho phép tải xuống
                </Label>
                <p className="text-xs text-gray-500 mt-0.5">
                  Tắt = học sinh chỉ xem online, không cho tải file về máy.
                </p>
              </div>
              <Switch
                checked={allowDownload}
                onCheckedChange={setAllowDownload}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="doc-file">
              File {!isEdit && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id="doc-file"
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.mp4,.mp3,.wav,.m4a,.png,.jpg,.jpeg"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            {file && (
              <div className="flex items-center gap-2 mt-2 p-2 rounded border bg-gray-50 text-sm">
                <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <span className="flex-1 truncate">{file.name}</span>
                <span className="text-xs text-gray-500">
                  {formatFileSize(file.size)}
                </span>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-gray-400 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            {isEdit && !file && editing?.fileUrl && (
              <p className="text-xs text-gray-500 mt-1">
                File hiện tại:{" "}
                <a
                  href={editing.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {editing.fileType?.toUpperCase() || "Xem"}
                </a>
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Huỷ
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : isEdit ? (
                "Cập nhật"
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Tải lên
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function FileIcon({ ext }) {
  const e = (ext || "").toLowerCase();
  const cls = "h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0";
  if (["mp4", "mov", "webm", "avi"].includes(e)) {
    return (
      <div className={`${cls} bg-purple-50 text-purple-600`}>
        <Video className="h-4 w-4" />
      </div>
    );
  }
  if (["mp3", "wav", "m4a", "ogg"].includes(e)) {
    return (
      <div className={`${cls} bg-pink-50 text-pink-600`}>
        <Music className="h-4 w-4" />
      </div>
    );
  }
  if (["xls", "xlsx", "csv"].includes(e)) {
    return (
      <div className={`${cls} bg-green-50 text-green-600`}>
        <FileSpreadsheet className="h-4 w-4" />
      </div>
    );
  }
  if (["ppt", "pptx"].includes(e)) {
    return (
      <div className={`${cls} bg-orange-50 text-orange-600`}>
        <Presentation className="h-4 w-4" />
      </div>
    );
  }
  if (["doc", "docx"].includes(e)) {
    return (
      <div className={`${cls} bg-blue-50 text-blue-600`}>
        <FileType className="h-4 w-4" />
      </div>
    );
  }
  return (
    <div className={`${cls} bg-red-50 text-red-600`}>
      <FileText className="h-4 w-4" />
    </div>
  );
}

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// ====== GROUPED VIEW — accordion theo khóa học ======
function GroupedCourseSection({ group, onEdit, onDelete, onPreview }) {
  const [open, setOpen] = useState(true);
  const isNone = group.courseId === "__none__";

  return (
    <Card>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 p-4 hover:bg-gray-50 transition-colors text-left"
      >
        {open ? (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-500" />
        )}
        <div
          className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
            isNone ? "bg-gray-100 text-gray-500" : "bg-blue-50 text-blue-600"
          }`}
        >
          <FolderTree className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">
            {group.courseTitle}
          </p>
          <p className="text-xs text-gray-500">
            {group.docs.length} tài liệu
          </p>
        </div>
      </button>

      {open && (
        <div className="border-t">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Lesson</TableHead>
                <TableHead>HS đánh giá</TableHead>
                <TableHead>GV góp ý</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {group.docs.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div className="flex items-center gap-3 min-w-0">
                      <FileIcon ext={doc.fileType} />
                      <div className="min-w-0">
                        <p className="font-medium truncate">{doc.title}</p>
                        {doc.description && (
                          <p className="text-xs text-gray-500 truncate max-w-md">
                            {doc.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="uppercase text-xs">
                      {doc.fileType || "file"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {doc.isPublished ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-[10px] h-5 w-fit">
                          <Eye className="h-2.5 w-2.5 mr-1" /> Công bố
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-600 text-[10px] h-5 w-fit">
                          <EyeOff className="h-2.5 w-2.5 mr-1" /> Nội bộ
                        </Badge>
                      )}
                      {!doc.allowDownload && (
                        <Badge variant="outline" className="border-orange-200 text-orange-700 text-[10px] h-5 w-fit">
                          <Lock className="h-2.5 w-2.5 mr-1" /> Chỉ xem
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {doc.lessons?.length > 0 ? (
                      <div className="flex flex-col gap-0.5 max-w-[200px]">
                        {doc.lessons.slice(0, 2).map((ld) => (
                          <span
                            key={ld.id}
                            className="text-xs text-gray-700 truncate inline-flex items-center gap-1"
                            title={ld.lesson?.title}
                          >
                            <Layers className="h-3 w-3 text-gray-400 flex-shrink-0" />
                            {ld.lesson?.title || "—"}
                          </span>
                        ))}
                        {doc.lessons.length > 2 && (
                          <span className="text-[10px] text-gray-500">
                            +{doc.lessons.length - 2} khác
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {doc.reviewCount > 0 ? (
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-medium">{doc.avgRating}</span>
                        <span className="text-xs text-gray-500">
                          ({doc.reviewCount})
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {doc.feedbackCount > 0 ? (
                      <div className="flex items-center gap-1 text-sm text-blue-700">
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span className="font-medium">{doc.feedbackCount}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onPreview(doc)}
                        title="Xem file"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEdit(doc)}
                        title="Sửa"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => onDelete(doc)}
                        title="Xóa"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
}
