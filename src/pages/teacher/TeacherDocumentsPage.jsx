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
  X,
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
  useReviewDocument,
  useDeleteMyDocumentReview,
} from "@/hooks/useDocuments";
import useAuthUser from "@/hooks/authHook/useAuthUser";

export default function TeacherDocumentsPage() {
  const [search, setSearch] = useState("");
  const queryParams = useMemo(() => (search ? { search } : {}), [search]);
  const { data: documents = [], isLoading } = useDocuments(queryParams);
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
          Xem và đánh giá học liệu của giáo vụ tải lên
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
            />
          ))}
        </div>
      )}

      <ReviewDialog
        document={viewing}
        open={!!viewing}
        onOpenChange={(o) => !o && setViewing(null)}
      />
    </div>
  );
}

function DocumentCard({ doc, onOpen }) {
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
          {doc.reviewCount > 0 ? (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="font-medium text-gray-700">{doc.avgRating}</span>
              <span>({doc.reviewCount})</span>
            </div>
          ) : (
            <span className="italic">Chưa có đánh giá</span>
          )}
        </div>

        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline" className="flex-1">
            <a href={doc.fileUrl} target="_blank" rel="noreferrer">
              <Eye className="h-3.5 w-3.5 mr-1.5" />
              Xem
            </a>
          </Button>
          {doc.allowDownload && (
            <Button asChild size="sm" variant="outline">
              <a href={doc.fileUrl} download>
                <Download className="h-3.5 w-3.5" />
              </a>
            </Button>
          )}
          <Button size="sm" onClick={onOpen}>
            <Star className="h-3.5 w-3.5 mr-1.5" />
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
    () => doc?.reviews?.find((r) => r.teacher?.id === authUser?.id),
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
          <Badge variant="outline">
            {doc.reviewCount} đánh giá
          </Badge>
        </div>

        {/* Form đánh giá của tôi */}
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
              placeholder="Chia sẻ cảm nhận của bạn về học liệu..."
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

        {/* Đánh giá của người khác */}
        {doc.reviews && doc.reviews.length > 0 && (
          <div className="border-t pt-3">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Đánh giá khác ({doc.reviews.filter((r) => r.teacher?.id !== authUser?.id).length})
            </p>
            <div className="space-y-2">
              {doc.reviews
                .filter((r) => r.teacher?.id !== authUser?.id)
                .map((r) => (
                  <ReviewItem key={r.id} review={r} />
                ))}
              {doc.reviews.filter((r) => r.teacher?.id !== authUser?.id)
                .length === 0 && (
                <p className="text-xs text-gray-500 italic">
                  Chưa có giáo viên khác đánh giá.
                </p>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ReviewItem({ review }) {
  const initials = (review.teacher?.fullName || "?")
    .split(" ")
    .map((s) => s[0])
    .slice(-2)
    .join("")
    .toUpperCase();
  return (
    <div className="flex gap-3 p-2.5 rounded-lg border bg-white">
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={review.teacher?.avatar} />
        <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium truncate">
            {review.teacher?.fullName}
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
