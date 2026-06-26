import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Loader2,
  Eye,
  Download,
  ExternalLink,
  Star,
  MessageSquare,
  Video,
  Music,
  FileSpreadsheet,
  Presentation,
  FileType,
  ArrowRight,
  EyeOff,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDocuments } from "@/hooks/useDocuments";
import DocumentViewer from "@/components/document/DocumentViewer";

const ROLE_DOC_PAGE = {
  STUDENT: "/student/documents",
  TEACHER: "/teacher/documents",
  ACADEMIC_STAFF: "/academic/documents",
};

export default function CourseDocumentsSection({ courseId, role }) {
  const { data: documents = [], isLoading } = useDocuments(
    courseId ? { courseId } : {},
  );
  const [previewing, setPreviewing] = useState(null);

  const allDocsPage = ROLE_DOC_PAGE[role];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Tài liệu khóa học ({documents.length})
          </CardTitle>
          {allDocsPage && (
            <Button asChild variant="ghost" size="sm">
              <Link to={`${allDocsPage}?courseId=${courseId}`}>
                Xem trang học liệu
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          </div>
        ) : documents.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">
            Khóa học này chưa có tài liệu nào
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {documents.map((doc) => (
              <DocMiniCard
                key={doc.id}
                doc={doc}
                role={role}
                onView={() => setPreviewing(doc)}
              />
            ))}
          </div>
        )}
      </CardContent>

      <DocumentViewer
        document={previewing}
        open={!!previewing}
        onOpenChange={(o) => !o && setPreviewing(null)}
      />
    </Card>
  );
}

function DocMiniCard({ doc, role, onView }) {
  const ext = (doc.fileType || "").toLowerCase();
  return (
    <div className="border rounded-lg p-3 hover:shadow-sm transition-shadow bg-white">
      <div className="flex items-start gap-2 mb-2">
        <FileIcon ext={ext} />
        <div className="min-w-0 flex-1">
          <p
            className="font-semibold text-sm text-gray-900 truncate"
            title={doc.title}
          >
            {doc.title}
          </p>
          <div className="flex items-center gap-1 mt-0.5 flex-wrap">
            <Badge variant="outline" className="uppercase text-[9px] h-4">
              {ext || "file"}
            </Badge>
            {!doc.isPublished && (
              <Badge variant="outline" className="text-[9px] h-4 text-gray-500">
                <EyeOff className="h-2 w-2 mr-0.5" />
                Nội bộ
              </Badge>
            )}
            {!doc.allowDownload && (
              <Badge
                variant="outline"
                className="text-[9px] h-4 text-orange-700 border-orange-200"
              >
                <Lock className="h-2 w-2 mr-0.5" />
                Chỉ xem
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Rating + feedback counts */}
      {(doc.reviewCount > 0 || doc.feedbackCount > 0) && (
        <div className="flex items-center gap-3 text-[11px] text-gray-500 mb-2">
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
              <span>{doc.feedbackCount}</span>
            </span>
          )}
        </div>
      )}

      <div className="flex gap-1.5">
        <Button size="sm" className="flex-1 h-8 text-xs" onClick={onView}>
          <Eye className="h-3 w-3 mr-1" />
          Xem
        </Button>
        <Button
          asChild
          size="sm"
          variant="outline"
          className="h-8 px-2"
          title="Tab mới"
        >
          <a
            href={`/documents/${doc.id}/view`}
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
        {doc.allowDownload ? (
          <Button
            asChild
            size="sm"
            variant="outline"
            className="h-8 px-2"
            title="Tải"
          >
            <a href={doc.fileUrl} download>
              <Download className="h-3 w-3" />
            </a>
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            className="h-8 px-2 opacity-50"
            disabled
            title="Không cho tải"
          >
            <Download className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}

function FileIcon({ ext }) {
  const cls =
    "h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0";
  if (["mp4", "mov", "webm", "avi"].includes(ext))
    return (
      <div className={`${cls} bg-purple-50 text-purple-600`}>
        <Video className="h-4 w-4" />
      </div>
    );
  if (["mp3", "wav", "m4a", "ogg"].includes(ext))
    return (
      <div className={`${cls} bg-pink-50 text-pink-600`}>
        <Music className="h-4 w-4" />
      </div>
    );
  if (["xls", "xlsx", "csv"].includes(ext))
    return (
      <div className={`${cls} bg-green-50 text-green-600`}>
        <FileSpreadsheet className="h-4 w-4" />
      </div>
    );
  if (["ppt", "pptx"].includes(ext))
    return (
      <div className={`${cls} bg-orange-50 text-orange-600`}>
        <Presentation className="h-4 w-4" />
      </div>
    );
  if (["doc", "docx"].includes(ext))
    return (
      <div className={`${cls} bg-blue-50 text-blue-600`}>
        <FileType className="h-4 w-4" />
      </div>
    );
  return (
    <div className={`${cls} bg-red-50 text-red-600`}>
      <FileText className="h-4 w-4" />
    </div>
  );
}
