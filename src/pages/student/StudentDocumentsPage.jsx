import { useMemo, useState } from "react";
import {
  FileText,
  Search,
  Download,
  Eye,
  Loader2,
  Video,
  Music,
  FileSpreadsheet,
  Presentation,
  FileType,
  BookOpen,
  Star,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  useDocuments,
  useReviewDocument,
  useDeleteMyDocumentReview,
} from "@/hooks/useDocuments";
import { useStudentCourses } from "@/hooks/useStudent";
import useAuthUser from "@/hooks/authHook/useAuthUser";
import DocumentViewer from "@/components/document/DocumentViewer";

export default function StudentDocumentsPage() {
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");

  const queryParams = useMemo(() => {
    const p = {};
    if (search) p.search = search;
    if (courseFilter !== "all") p.courseId = courseFilter;
    return p;
  }, [search, courseFilter]);

  const { data: documents = [], isLoading } = useDocuments(queryParams);
  const { data: myCourses = [] } = useStudentCourses();
  const [reviewing, setReviewing] = useState(null);
  const [viewing, setViewing] = useState(null);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <FileText className="h-5 w-5 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Học liệu</h1>
        </div>
        <p className="text-sm text-gray-500">
          Tài liệu tham khảo từ các khóa học bạn đã đăng ký
        </p>
      </div>

      {/* Filter */}
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
                <SelectItem value="all">Tất cả</SelectItem>
                {myCourses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <p className="font-medium text-gray-700">
              Chưa có học liệu phù hợp
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Hãy đăng ký khóa học để truy cập học liệu của khóa đó.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              onReview={() => setReviewing(doc)}
              onView={() => setViewing(doc)}
            />
          ))}
        </div>
      )}

      <ReviewDialog
        document={reviewing}
        open={!!reviewing}
        onOpenChange={(o) => !o && setReviewing(null)}
      />

      <DocumentViewer
        document={viewing}
        open={!!viewing}
        onOpenChange={(o) => !o && setViewing(null)}
      />
    </div>
  );
}

function DocumentCard({ doc, onReview, onView }) {
  const ext = (doc.fileType || "").toLowerCase();
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <FileIcon ext={ext} large />
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
                  Tài liệu chung
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
          {doc.reviewCount > 0 && (
            <span className="inline-flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="font-medium text-gray-700">{doc.avgRating}</span>
              <span>({doc.reviewCount})</span>
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <Button size="sm" className="flex-1" onClick={onView}>
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
          {doc.allowDownload ? (
            <Button asChild size="sm" variant="outline" title="Tải về">
              <a href={doc.fileUrl} download>
                <Download className="h-3.5 w-3.5" />
              </a>
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              disabled
              title="Học liệu này không cho phép tải"
            >
              <Download className="h-3.5 w-3.5 opacity-40" />
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={onReview}>
            <Star className="h-3.5 w-3.5 mr-1.5 text-amber-500" />
            Đánh giá
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ReviewDialog({ document: doc, open, onOpenChange }) {
  const { authUser } = useAuthUser();
  const myReview = useMemo(
    () => doc?.reviews?.find((r) => r.student?.id === authUser?.id),
    [doc, authUser],
  );

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  useMemo(() => {
    if (open) {
      setRating(myReview?.rating || 0);
      setHover(0);
      setComment(myReview?.comment || "");
    }
  }, [open, myReview]);

  const reviewMutation = useReviewDocument();
  const deleteMutation = useDeleteMyDocumentReview();

  const onSubmit = (e) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) return;
    reviewMutation.mutate(
      { documentId: doc.id, rating, comment },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  if (!doc) return null;

  const otherReviews = (doc.reviews || []).filter(
    (r) => r.student?.id !== authUser?.id,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500" />
            Đánh giá học liệu
          </DialogTitle>
          <DialogDescription className="line-clamp-2">
            {doc.title}
          </DialogDescription>
        </DialogHeader>

        {/* Tổng quan */}
        <div className="p-3 rounded-lg border bg-gradient-to-br from-amber-50 to-white flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Điểm trung bình</p>
            {doc.reviewCount > 0 ? (
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-amber-600">
                  {doc.avgRating}
                </span>
                <span className="text-xs text-gray-500">/ 5</span>
              </div>
            ) : (
              <span className="text-sm text-gray-400">Chưa có đánh giá</span>
            )}
          </div>
          <Badge variant="outline">{doc.reviewCount || 0} đánh giá</Badge>
        </div>

        {/* Form đánh giá */}
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <Label className="mb-2 block">
              Đánh giá của bạn{myReview && " (cập nhật)"}
            </Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => {
                const active = (hover || rating) >= n;
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    onMouseEnter={() => setHover(n)}
                    onMouseLeave={() => setHover(0)}
                    className="p-0.5"
                  >
                    <Star
                      className={`h-7 w-7 transition-colors ${
                        active
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                );
              })}
              {rating > 0 && (
                <span className="ml-2 text-sm font-medium text-gray-700">
                  {rating}/5
                </span>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="review-comment">Nhận xét (tuỳ chọn)</Label>
            <Textarea
              id="review-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ cảm nhận của bạn về tài liệu này..."
              rows={3}
            />
          </div>

          <DialogFooter className="gap-2">
            {myReview && (
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
                Xoá đánh giá
              </Button>
            )}
            <Button
              type="submit"
              disabled={rating < 1 || reviewMutation.isPending}
            >
              {reviewMutation.isPending
                ? "Đang lưu..."
                : myReview
                ? "Cập nhật"
                : "Gửi đánh giá"}
            </Button>
          </DialogFooter>
        </form>

        {/* Đánh giá của học sinh khác */}
        {otherReviews.length > 0 && (
          <div className="border-t pt-3">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Đánh giá khác ({otherReviews.length})
            </p>
            <div className="space-y-2">
              {otherReviews.map((r) => (
                <ReviewItem key={r.id} review={r} />
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ReviewItem({ review }) {
  const initials = (review.student?.fullName || "?")
    .split(" ")
    .map((s) => s[0])
    .slice(-2)
    .join("")
    .toUpperCase();
  return (
    <div className="flex gap-3 p-2.5 rounded-lg border bg-white">
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={review.student?.avatar} />
        <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium truncate">
            {review.student?.fullName}
          </span>
          <div className="flex items-center gap-0.5 flex-shrink-0">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                className={`h-3 w-3 ${
                  n <= review.rating
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
        {review.comment && (
          <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
        )}
        <p className="text-[11px] text-gray-400 mt-1">
          {formatDate(review.createdAt)}
        </p>
      </div>
    </div>
  );
}

function FileIcon({ ext, large = false }) {
  const size = large ? "h-11 w-11" : "h-9 w-9";
  const iconSize = large ? "h-5 w-5" : "h-4 w-4";
  const cls = `${size} rounded-lg flex items-center justify-center flex-shrink-0`;
  if (["mp4", "mov", "webm", "avi"].includes(ext)) {
    return (
      <div className={`${cls} bg-purple-50 text-purple-600`}>
        <Video className={iconSize} />
      </div>
    );
  }
  if (["mp3", "wav", "m4a", "ogg"].includes(ext)) {
    return (
      <div className={`${cls} bg-pink-50 text-pink-600`}>
        <Music className={iconSize} />
      </div>
    );
  }
  if (["xls", "xlsx", "csv"].includes(ext)) {
    return (
      <div className={`${cls} bg-green-50 text-green-600`}>
        <FileSpreadsheet className={iconSize} />
      </div>
    );
  }
  if (["ppt", "pptx"].includes(ext)) {
    return (
      <div className={`${cls} bg-orange-50 text-orange-600`}>
        <Presentation className={iconSize} />
      </div>
    );
  }
  if (["doc", "docx"].includes(ext)) {
    return (
      <div className={`${cls} bg-blue-50 text-blue-600`}>
        <FileType className={iconSize} />
      </div>
    );
  }
  return (
    <div className={`${cls} bg-red-50 text-red-600`}>
      <FileText className={iconSize} />
    </div>
  );
}

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
