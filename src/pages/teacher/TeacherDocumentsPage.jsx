import { useMemo, useState } from "react";
import {
  FileText,
  Search,
  Eye,
  Download,
  Loader2,
  Star,
  Video,
  Music,
  FileSpreadsheet,
  Presentation,
  FileType,
  BookOpen,
  EyeOff,
  Lock,
  Trash2,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  useDocuments,
  useFeedbackDocument,
  useDeleteMyDocumentFeedback,
} from "@/hooks/useDocuments";
import useAuthUser from "@/hooks/authHook/useAuthUser";
import DocumentViewer from "@/components/document/DocumentViewer";

export default function TeacherDocumentsPage() {
  const [search, setSearch] = useState("");
  const queryParams = useMemo(() => (search ? { search } : {}), [search]);
  const { data: documents = [], isLoading } = useDocuments(queryParams);
  const [viewing, setViewing] = useState(null); // for feedback dialog
  const [previewing, setPreviewing] = useState(null); // for file viewer

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <FileText className="h-5 w-5 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Học liệu</h1>
        </div>
        <p className="text-sm text-gray-500">
          Xem và góp ý nội dung học liệu của trung tâm
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên, mô tả..."
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      ) : documents.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center">
            <FileText className="h-10 w-10 text-gray-300 mx-auto mb-2" />
            <p className="font-medium text-gray-700">Chưa có học liệu nào</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              onOpen={() => setViewing(doc)}
              onView={() => setPreviewing(doc)}
            />
          ))}
        </div>
      )}

      <FeedbackDialog
        document={viewing}
        open={!!viewing}
        onOpenChange={(o) => !o && setViewing(null)}
      />

      <DocumentViewer
        document={previewing}
        open={!!previewing}
        onOpenChange={(o) => !o && setPreviewing(null)}
      />
    </div>
  );
}

function DocumentCard({ doc, onOpen, onView }) {
  const ext = (doc.fileType || "").toLowerCase();
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <FileIcon ext={ext} />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-900 truncate" title={doc.title}>
              {doc.title}
            </p>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <Badge variant="outline" className="uppercase text-[10px] h-5">
                {ext || "file"}
              </Badge>
              {doc.course ? (
                <Badge
                  variant="outline"
                  className="text-[10px] h-5 text-blue-700 border-blue-200"
                >
                  <BookOpen className="h-2.5 w-2.5 mr-1" />
                  {doc.course.title}
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[10px] h-5 text-gray-500">
                  Chung
                </Badge>
              )}
              {!doc.isPublished && (
                <Badge variant="outline" className="text-[10px] h-5 text-gray-600">
                  <EyeOff className="h-2.5 w-2.5 mr-1" /> Nội bộ
                </Badge>
              )}
              {!doc.allowDownload && (
                <Badge
                  variant="outline"
                  className="text-[10px] h-5 text-orange-700 border-orange-200"
                >
                  <Lock className="h-2.5 w-2.5 mr-1" /> Chỉ xem
                </Badge>
              )}
            </div>
          </div>
        </div>

        {doc.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {doc.description}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>{formatDate(doc.createdAt)}</span>
          <div className="flex items-center gap-3">
            {doc.reviewCount > 0 && (
              <span className="inline-flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="font-medium text-gray-700">{doc.avgRating}</span>
                <span>({doc.reviewCount})</span>
              </span>
            )}
            {doc.feedbackCount > 0 && (
              <span className="inline-flex items-center gap-1 text-blue-600">
                <MessageSquare className="h-3 w-3" />
                <span className="font-medium">{doc.feedbackCount}</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1" onClick={onView}>
            <Eye className="h-3.5 w-3.5 mr-1.5" />
            Xem
          </Button>
          <Button
            asChild
            size="sm"
            variant="outline"
            title="Mở trong tab mới"
          >
            <a
              href={`/documents/${doc.id}/view`}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
          {doc.allowDownload && (
            <Button asChild size="sm" variant="outline" title="Tải về">
              <a href={doc.fileUrl} download>
                <Download className="h-3.5 w-3.5" />
              </a>
            </Button>
          )}
          <Button size="sm" onClick={onOpen}>
            <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
            Góp ý
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function FeedbackDialog({ document: doc, open, onOpenChange }) {
  const { authUser } = useAuthUser();
  const myFeedback = useMemo(
    () => doc?.feedbacks?.find((f) => f.teacher?.id === authUser?.id),
    [doc, authUser],
  );

  const [content, setContent] = useState("");

  useMemo(() => {
    if (open) {
      setContent(myFeedback?.content || "");
    }
  }, [open, myFeedback]);

  const feedbackMutation = useFeedbackDocument();
  const deleteMutation = useDeleteMyDocumentFeedback();

  const onSubmit = (e) => {
    e.preventDefault();
    const text = content.trim();
    if (!text) return;
    feedbackMutation.mutate(
      { documentId: doc.id, content: text },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  if (!doc) return null;

  const otherFeedbacks = (doc.feedbacks || []).filter(
    (f) => f.teacher?.id !== authUser?.id,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            Góp ý nội dung học liệu
          </DialogTitle>
          <DialogDescription className="line-clamp-2">
            {doc.title}
          </DialogDescription>
        </DialogHeader>

        {/* Tổng quan */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded-lg border bg-blue-50/50">
            <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-1">
              <MessageSquare className="h-3.5 w-3.5" />
              Góp ý từ giáo viên
            </div>
            <p className="text-xl font-bold text-blue-700">
              {doc.feedbackCount || 0}
            </p>
          </div>
          <div className="p-3 rounded-lg border bg-amber-50/50">
            <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-1">
              <Star className="h-3.5 w-3.5" />
              Đánh giá từ học sinh
            </div>
            <p className="text-xl font-bold text-amber-600">
              {doc.avgRating != null ? `${doc.avgRating} / 5` : "—"}
              <span className="text-xs font-normal text-gray-500 ml-1">
                ({doc.reviewCount || 0})
              </span>
            </p>
          </div>
        </div>

        {/* Form góp ý */}
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <Label htmlFor="feedback-content">
              Góp ý của bạn{myFeedback && " (cập nhật)"}
            </Label>
            <Textarea
              id="feedback-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nội dung tài liệu có chỗ nào cần chỉnh sửa, bổ sung hay làm rõ hơn không?"
              rows={4}
              maxLength={2000}
            />
            <div className="flex justify-between mt-1">
              <p className="text-xs text-gray-500">
                Góp ý của giáo viên giúp giáo vụ cải thiện chất lượng học liệu.
              </p>
              <p className="text-xs text-gray-400">{content.length}/2000</p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            {myFeedback && (
              <Button
                type="button"
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={() =>
                  deleteMutation.mutate(doc.id, {
                    onSuccess: () => onOpenChange(false),
                  })
                }
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="h-4 w-4 mr-1.5" />
                Xoá góp ý
              </Button>
            )}
            <Button
              type="submit"
              disabled={!content.trim() || feedbackMutation.isPending}
            >
              {feedbackMutation.isPending
                ? "Đang lưu..."
                : myFeedback
                ? "Cập nhật"
                : "Gửi góp ý"}
            </Button>
          </DialogFooter>
        </form>

        {/* Góp ý của giáo viên khác */}
        {otherFeedbacks.length > 0 && (
          <div className="border-t pt-3">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Góp ý từ giáo viên khác ({otherFeedbacks.length})
            </p>
            <div className="space-y-2">
              {otherFeedbacks.map((f) => (
                <FeedbackItem key={f.id} feedback={f} />
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function FeedbackItem({ feedback }) {
  const initials = (feedback.teacher?.fullName || "?")
    .split(" ")
    .map((s) => s[0])
    .slice(-2)
    .join("")
    .toUpperCase();
  return (
    <div className="flex gap-3 p-2.5 rounded-lg border bg-white">
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={feedback.teacher?.avatar} />
        <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{feedback.teacher?.fullName}</p>
        <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">
          {feedback.content}
        </p>
        <p className="text-[11px] text-gray-400 mt-1">
          {formatDate(feedback.createdAt)}
        </p>
      </div>
    </div>
  );
}

function FileIcon({ ext }) {
  const cls = "h-11 w-11 rounded-lg flex items-center justify-center flex-shrink-0";
  if (["mp4", "mov", "webm", "avi"].includes(ext))
    return <div className={`${cls} bg-purple-50 text-purple-600`}><Video className="h-5 w-5" /></div>;
  if (["mp3", "wav", "m4a", "ogg"].includes(ext))
    return <div className={`${cls} bg-pink-50 text-pink-600`}><Music className="h-5 w-5" /></div>;
  if (["xls", "xlsx", "csv"].includes(ext))
    return <div className={`${cls} bg-green-50 text-green-600`}><FileSpreadsheet className="h-5 w-5" /></div>;
  if (["ppt", "pptx"].includes(ext))
    return <div className={`${cls} bg-orange-50 text-orange-600`}><Presentation className="h-5 w-5" /></div>;
  if (["doc", "docx"].includes(ext))
    return <div className={`${cls} bg-blue-50 text-blue-600`}><FileType className="h-5 w-5" /></div>;
  return <div className={`${cls} bg-red-50 text-red-600`}><FileText className="h-5 w-5" /></div>;
}

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
