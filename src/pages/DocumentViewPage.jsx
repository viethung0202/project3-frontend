import { useParams, Link } from "react-router-dom";
import {
  ChevronLeft,
  Download,
  ExternalLink,
  Loader2,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDocumentDetail } from "@/hooks/useDocuments";
import {
  ViewerBody,
  getDocumentViewerType,
} from "@/components/document/DocumentViewer";

export default function DocumentViewPage() {
  const { id } = useParams();
  const { data: doc, isLoading, error } = useDocumentDetail(id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !doc) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <p className="text-lg font-medium text-red-600 mb-2">
          {error?.response?.data?.message || "Không tìm thấy học liệu"}
        </p>
        <Button asChild variant="outline">
          <Link to="/">
            <ChevronLeft className="h-4 w-4 mr-1" /> Về trang chủ
          </Link>
        </Button>
      </div>
    );
  }

  const type = getDocumentViewerType(doc.fileType);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-start justify-between gap-3 flex-wrap">
          <div className="min-w-0 flex-1">
            <h1
              className="text-lg font-semibold text-gray-900 truncate"
              title={doc.title}
            >
              {doc.title}
            </h1>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              {doc.fileType && (
                <Badge variant="outline" className="uppercase text-[10px] h-5">
                  {doc.fileType}
                </Badge>
              )}
              {doc.course && (
                <span className="text-xs text-gray-500">
                  Khóa: {doc.course.title}
                </span>
              )}
              {doc.source && (
                <span className="text-xs text-gray-500 italic">
                  · Nguồn: {doc.source}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            {doc.allowDownload ? (
              <Button asChild size="sm" variant="outline">
                <a href={doc.fileUrl} download>
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  Tải về
                </a>
              </Button>
            ) : (
              <Button size="sm" variant="outline" disabled title="Không cho tải">
                <Lock className="h-3.5 w-3.5 mr-1.5" />
                Khóa tải
              </Button>
            )}
            <Button asChild size="sm" variant="outline">
              <a href={doc.fileUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                File gốc
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 overflow-auto">
        <ViewerBody type={type} doc={doc} />
      </main>
    </div>
  );
}
