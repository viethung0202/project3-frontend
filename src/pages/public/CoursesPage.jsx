import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Search,
  Users,
  Layers,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { useCoursesList } from "@/hooks/useCourses";
import { COURSE_LEVELS } from "@/utils/constants";

export default function PublicCoursesPage() {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");

  const { data: courses = [], isLoading } = useCoursesList({
    status: "PUBLISHED", // chỉ hiển thị course đã publish
    search: search || undefined,
    level: levelFilter !== "all" ? levelFilter : undefined,
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Khóa học</h1>
        <p className="text-gray-600 mt-1">
          Khám phá các khóa học tiếng Anh chất lượng tại EngCenter
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm theo tên khóa học..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Cấp độ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả cấp độ</SelectItem>
                <SelectItem value="BEGINNER">Cơ bản</SelectItem>
                <SelectItem value="INTERMEDIATE">Trung cấp</SelectItem>
                <SelectItem value="ADVANCED">Nâng cao</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      ) : courses.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              {search || levelFilter !== "all"
                ? "Không tìm thấy khóa học phù hợp"
                : "Chưa có khóa học nào"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((c) => (
            <Link
              key={c.id}
              to={`/courses/${c.id}`}
              className="block group"
            >
              <Card className="h-full hover:shadow-md transition-shadow overflow-hidden">
                {c.thumbnail ? (
                  <img
                    src={c.thumbnail}
                    alt={c.title}
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  <div className="w-full h-40 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-blue-300" />
                  </div>
                )}
                <CardContent className="p-4">
                  <Badge variant="outline" className="text-xs mb-2">
                    {COURSE_LEVELS[c.level] || c.level}
                  </Badge>
                  <h3 className="font-semibold text-lg mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {c.title}
                  </h3>
                  {c.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {c.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1">
                        <Layers className="h-3 w-3" />
                        {c._count?.modules || 0} modules
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {c._count?.enrollments || 0} HS
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
