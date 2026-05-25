import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  FileText,
  HelpCircle,
  Layers,
  Loader2,
  Video,
  Clock,
  Award,
} from "lucide-react";
import { useModuleDetail } from "@/hooks/useModules";
import { useModuleLessons } from "@/hooks/useLessons";
import { useModuleFlashcardSets } from "@/hooks/useFlashcards";
import { useModuleQuizzes } from "@/hooks/useQuizzes";

export default function TeacherModuleDetailPage() {
  const { id } = useParams();
  const { data: module, isLoading } = useModuleDetail(id);
  const { data: lessons = [], isLoading: lessonsLoading } =
    useModuleLessons(id);
  const { data: flashcardSets = [], isLoading: setsLoading } =
    useModuleFlashcardSets(id);
  const { data: quizzes = [], isLoading: quizzesLoading } =
    useModuleQuizzes(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!module) {
    return <div>Không tìm thấy module</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          to={`/teacher/courses/${module.course?.id || module.courseId}`}
          className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 mb-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          {module.course?.title || "Quay lại khóa học"}
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{module.title}</h1>
        {module.description && (
          <p className="text-gray-600 mt-1">{module.description}</p>
        )}
      </div>

      {/* Lessons — inline content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Lessons ({lessons.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {lessonsLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            </div>
          ) : lessons.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">
              Chưa có lesson nào
            </p>
          ) : (
            <div className="space-y-4">
              {lessons.map((lesson, idx) => (
                <div
                  key={lesson.id}
                  className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-7 w-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {idx + 1}
                    </div>
                    <h3 className="font-semibold text-base flex-1">
                      {lesson.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-2">
                    {lesson.videoUrl && (
                      <a
                        href={lesson.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                      >
                        <Video className="h-4 w-4" />
                        Xem video
                      </a>
                    )}
                    {lesson.pdfUrl && (
                      <a
                        href={lesson.pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-red-600 hover:underline"
                      >
                        <FileText className="h-4 w-4" />
                        Mở PDF
                      </a>
                    )}
                  </div>

                  {lesson.content && (
                    <div className="text-sm text-gray-700 whitespace-pre-wrap mt-2 prose prose-sm max-w-none">
                      {lesson.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quizzes — list titles only */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Quizzes ({quizzes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {quizzesLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            </div>
          ) : quizzes.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">
              Chưa có quiz nào
            </p>
          ) : (
            <div className="space-y-2">
              {quizzes.map((q, idx) => (
                <div
                  key={q.id}
                  className="flex items-center gap-3 p-3 rounded-lg border"
                >
                  <div className="h-8 w-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center text-sm font-medium flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{q.title}</p>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {q.timeLimit
                          ? `${q.timeLimit} phút`
                          : "Không giới hạn"}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        Đạt: {q.passingScore}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Flashcard sets — list titles only */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Flashcard Sets ({flashcardSets.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {setsLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            </div>
          ) : flashcardSets.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">
              Chưa có bộ flashcard nào
            </p>
          ) : (
            <div className="space-y-2">
              {flashcardSets.map((set, idx) => (
                <div
                  key={set.id}
                  className="flex items-center gap-3 p-3 rounded-lg border"
                >
                  <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-sm font-medium flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{set.title}</p>
                    <p className="text-xs text-gray-500">
                      {set.flashcards?.length || 0} thẻ
                      {set.description && ` · ${set.description}`}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {set.flashcards?.length || 0} cards
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
