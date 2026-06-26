import { useMemo, useState } from "react";
import {
  FileText,
  Plus,
  X,
  Upload,
  Loader2,
  Video,
  Music,
  FileSpreadsheet,
  Presentation,
  FileType,
  Eye,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  useDocuments,
  useCreateDocument,
} from "@/hooks/useDocuments";
import {
  useAttachLessonDocument,
  useDetachLessonDocument,
} from "@/hooks/useLessons";
import DocumentViewer from "@/components/document/DocumentViewer";

export default function LessonDocumentsManager({ lesson, moduleId, courseId }) {
  const linkedDocs = useMemo(
    () =>
      (lesson?.documents || []).map((ld) => ({
        ...ld.document,
        linkId: ld.id,
        order: ld.order,
      })),
    [lesson],
  );

  const [pickerOpen, setPickerOpen] = useState(false);
  const [previewing, setPreviewing] = useState(null);

  const detachMutation = useDetachLessonDocument(moduleId);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-1.5">
          <FileText className="h-4 w-4 text-gray-500" />
          Tài liệu đính kèm ({linkedDocs.length})
        </Label>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => setPickerOpen(true)}
          disabled={!lesson?.id}
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          Thêm
        </Button>
      </div>

      {!lesson?.id ? (
        <p className="text-xs text-gray-500 italic p-3 border rounded">
          Tạo lesson trước, sau đó mới gắn được tài liệu.
        </p>
      ) : linkedDocs.length === 0 ? (
        <p className="text-xs text-gray-500 italic p-3 border rounded text-center">
          Chưa gắn tài liệu nào. Bấm "Thêm" để gắn PDF, video, hoặc tài liệu khác.
        </p>
      ) : (
        <div className="space-y-1.5">
          {linkedDocs.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-2 p-2 border rounded-lg bg-white"
            >
              <FileIcon ext={(doc.fileType || "").toLowerCase()} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate" title={doc.title}>
                  {doc.title}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Badge variant="outline" className="text-[9px] h-4 uppercase">
                    {doc.fileType || "file"}
                  </Badge>
                  {!doc.isPublished && (
                    <Badge variant="outline" className="text-[9px] h-4 text-gray-500">
                      Nội bộ
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0"
                onClick={() => setPreviewing(doc)}
                title="Xem"
              >
                <Eye className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() =>
                  detachMutation.mutate({
                    lessonId: lesson.id,
                    documentId: doc.id,
                  })
                }
                title="Gỡ khỏi lesson"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <DocumentPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        lesson={lesson}
        moduleId={moduleId}
        courseId={courseId}
        excludeIds={linkedDocs.map((d) => d.id)}
      />

      <DocumentViewer
        document={previewing}
        open={!!previewing}
        onOpenChange={(o) => !o && setPreviewing(null)}
      />
    </div>
  );
}

// ===== Picker — chọn document có sẵn HOẶC upload mới =====
function DocumentPickerDialog({
  open,
  onOpenChange,
  lesson,
  moduleId,
  courseId,
  excludeIds,
}) {
  const [mode, setMode] = useState("existing"); // existing | upload
  const [search, setSearch] = useState("");

  const { data: allDocs = [], isLoading } = useDocuments({});
  const available = useMemo(() => {
    const exclude = new Set(excludeIds);
    let list = allDocs.filter((d) => !exclude.has(d.id));
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(
        (d) =>
          d.title.toLowerCase().includes(s) ||
          (d.description || "").toLowerCase().includes(s),
      );
    }
    return list;
  }, [allDocs, excludeIds, search]);

  const attachMutation = useAttachLessonDocument(moduleId);

  const handlePick = (docId) => {
    attachMutation.mutate(
      { lessonId: lesson.id, documentId: docId },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Thêm tài liệu vào lesson</DialogTitle>
          <DialogDescription>
            {lesson?.title && `Lesson: ${lesson.title}`}
          </DialogDescription>
        </DialogHeader>

        {/* Mode toggle */}
        <div className="flex gap-1 border-b">
          <button
            type="button"
            onClick={() => setMode("existing")}
            className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px ${
              mode === "existing"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600"
            }`}
          >
            Chọn từ học liệu có sẵn
          </button>
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px ${
              mode === "upload"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600"
            }`}
          >
            Upload mới
          </button>
        </div>

        {mode === "existing" ? (
          <div className="flex-1 overflow-hidden flex flex-col gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo tên..."
                className="pl-9"
              />
            </div>
            <div className="flex-1 overflow-auto space-y-1.5">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                </div>
              ) : available.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">
                  {allDocs.length === 0
                    ? "Chưa có tài liệu nào trong hệ thống. Hãy chuyển sang tab Upload mới."
                    : "Không tìm thấy tài liệu phù hợp"}
                </p>
              ) : (
                available.map((doc) => (
                  <PickerRow
                    key={doc.id}
                    doc={doc}
                    onPick={() => handlePick(doc.id)}
                    disabled={attachMutation.isPending}
                  />
                ))
              )}
            </div>
          </div>
        ) : (
          <UploadForm
            lesson={lesson}
            moduleId={moduleId}
            courseId={courseId}
            onDone={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function PickerRow({ doc, onPick, disabled }) {
  const ext = (doc.fileType || "").toLowerCase();
  return (
    <button
      type="button"
      onClick={onPick}
      disabled={disabled}
      className="w-full flex items-center gap-2 p-2 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-left disabled:opacity-50"
    >
      <FileIcon ext={ext} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate">{doc.title}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <Badge variant="outline" className="text-[9px] h-4 uppercase">
            {ext || "file"}
          </Badge>
          {doc.course?.title && (
            <span className="text-[10px] text-gray-500 truncate">
              {doc.course.title}
            </span>
          )}
        </div>
      </div>
      <Plus className="h-4 w-4 text-gray-400 flex-shrink-0" />
    </button>
  );
}

function UploadForm({ lesson, moduleId, courseId, onDone }) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const createDoc = useCreateDocument();
  const attachMutation = useAttachLessonDocument(moduleId);
  const busy = createDoc.isPending || attachMutation.isPending;

  const handleUpload = (e) => {
    e.preventDefault();
    if (!file || !title.trim()) return;
    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("isPublished", "true");
    formData.append("allowDownload", "true");
    if (courseId) formData.append("courseId", courseId);
    formData.append("file", file);

    createDoc.mutate(formData, {
      onSuccess: (res) => {
        const docId = res?.data?.id;
        if (docId) {
          attachMutation.mutate(
            { lessonId: lesson.id, documentId: docId },
            { onSuccess: onDone },
          );
        }
      },
    });
  };

  return (
    <form onSubmit={handleUpload} className="space-y-3">
      <div>
        <Label htmlFor="lesson-doc-title">Tiêu đề</Label>
        <Input
          id="lesson-doc-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="VD: Slide bài giảng Unit 1"
          required
        />
      </div>
      <div>
        <Label htmlFor="lesson-doc-file">File</Label>
        <Input
          id="lesson-doc-file"
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.mp4,.mp3,.wav,.m4a,.png,.jpg,.jpeg,.txt,.md,.csv"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        {file && (
          <p className="text-xs text-gray-500 mt-1 truncate">{file.name}</p>
        )}
      </div>
      <p className="text-xs text-gray-500 italic">
        File sẽ được tạo dưới dạng Document trong khóa học này, có thể xem ở trang quản lý học liệu.
      </p>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone} disabled={busy}>
          Huỷ
        </Button>
        <Button type="submit" disabled={!file || !title.trim() || busy}>
          {busy ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Đang tải...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload & gắn
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}

function FileIcon({ ext }) {
  const cls = "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0";
  if (["mp4", "mov", "webm"].includes(ext))
    return <div className={`${cls} bg-purple-50 text-purple-600`}><Video className="h-4 w-4" /></div>;
  if (["mp3", "wav", "m4a"].includes(ext))
    return <div className={`${cls} bg-pink-50 text-pink-600`}><Music className="h-4 w-4" /></div>;
  if (["xls", "xlsx", "csv"].includes(ext))
    return <div className={`${cls} bg-green-50 text-green-600`}><FileSpreadsheet className="h-4 w-4" /></div>;
  if (["ppt", "pptx"].includes(ext))
    return <div className={`${cls} bg-orange-50 text-orange-600`}><Presentation className="h-4 w-4" /></div>;
  if (["doc", "docx"].includes(ext))
    return <div className={`${cls} bg-blue-50 text-blue-600`}><FileType className="h-4 w-4" /></div>;
  return <div className={`${cls} bg-red-50 text-red-600`}><FileText className="h-4 w-4" /></div>;
}
