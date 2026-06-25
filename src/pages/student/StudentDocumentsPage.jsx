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
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDocuments } from "@/hooks/useDocuments";
import { useStudentCourses } from "@/hooks/useStudent";

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
            <DocumentCard key={doc.id} doc={doc} />
          ))}
        </div>
      )}
    </div>
  );
}

function DocumentCard({ doc }) {
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

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{formatDate(doc.createdAt)}</span>
        </div>

        <div className="flex gap-2 mt-3">
          <Button asChild size="sm" className="flex-1">
            <a href={doc.fileUrl} target="_blank" rel="noreferrer">
              <Eye className="h-3.5 w-3.5 mr-1.5" />
              Xem
            </a>
          </Button>
          {doc.allowDownload ? (
            <Button asChild size="sm" variant="outline">
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
        </div>
      </CardContent>
    </Card>
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
