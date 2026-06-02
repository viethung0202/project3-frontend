import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  FileText,
  HelpCircle,
  Layers,
  Loader2,
  Video,
  Clock,
  Award,
  Play,
  Sparkles,
  History,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { useModuleDetail } from "@/hooks/useModules";
import { useModuleLessons } from "@/hooks/useLessons";
import { useModuleFlashcardSets } from "@/hooks/useFlashcards";
import { useModuleQuizzes } from "@/hooks/useQuizzes";
import {
  useCompletedLessons,
  useMarkLessonComplete,
  useUnmarkLessonComplete,
} from "@/hooks/useLessonCompletion";

export default function StudentModuleDetailPage() {
  const { id } = useParams();
  const { data: module, isLoading } = useModuleDetail(id);
  const { data: lessons = [], isLoading: lessonsLoading } =
    useModuleLessons(id);
  const { data: flashcardSets = [], isLoading: setsLoading } =
    useModuleFlashcardSets(id);
  const { data: quizzes = [], isLoading: quizzesLoading } =
    useModuleQuizzes(id);

  const courseId = module?.course?.id || module?.courseId;
  const { data: completions = [] } = useCompletedLessons(courseId);
  const { mutate: markComplete, isPending: isMarking } =
    useMarkLessonComplete(courseId);
  const { mutate: unmarkComplete, isPending: isUnmarking } =
    useUnmarkLessonComplete(courseId);

  const completedSet = new Set(completions.map((c) => c.lessonId));
  const isPendingCompletion = isMarking || isUnmarking;

  const toggleLessonComplete = (lessonId) => {
    if (completedSet.has(lessonId)) {
      unmarkComplete(lessonId);
    } else {
      markComplete(lessonId);
    }
  };

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
          to={`/student/courses/${module.course?.id || module.courseId}`}
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

      {/* Lessons */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Bài học ({lessons.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {lessonsLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            </div>
          ) : lessons.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">
              Chưa có bài học nào
            </p>
          ) : (
            <div className="space-y-4">
              {lessons.map((lesson, idx) => {
                const isDone = completedSet.has(lesson.id);
                return (
                <div
                  key={lesson.id}
                  className={`border rounded-lg p-4 hover:shadow-sm transition-shadow ${
                    isDone
                      ? "border-green-200 bg-green-50/30"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`h-7 w-7 rounded-lg flex items-center justify-center text-sm font-medium flex-shrink-0 ${
                        isDone
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-50 text-blue-600"
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <h3 className="font-semibold text-base flex-1">
                      {lesson.title}
                    </h3>
                    <button
                      type="button"
                      onClick={() => toggleLessonComplete(lesson.id)}
                      disabled={isPendingCompletion}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                        isDone
                          ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-200"
                          : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                      } disabled:opacity-50`}
                      title={isDone ? "Đã hoàn thành — bấm để bỏ" : "Đánh dấu đã học"}
                    >
                      {isDone ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Đã học
                        </>
                      ) : (
                        <>
                          <Circle className="h-3.5 w-3.5" />
                          Đánh dấu
                        </>
                      )}
                    </button>
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
                        Xem video bài giảng
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
                        Mở tài liệu PDF
                      </a>
                    )}
                  </div>

                  {lesson.content && (
                    <div className="text-sm text-gray-700 whitespace-pre-wrap mt-2 prose prose-sm max-w-none">
                      {lesson.content}
                    </div>
                  )}

                  {lesson.pdfUrl && (
                    <div className="mt-3 rounded-lg overflow-hidden border bg-gray-50">
                      <iframe
                        src={lesson.pdfUrl}
                        title={`PDF - ${lesson.title}`}
                        className="w-full"
                        style={{ height: 500 }}
                      />
                    </div>
                  )}

                  {!lesson.videoUrl && !lesson.content && !lesson.pdfUrl && (
                    <p className="text-xs text-gray-400 italic">
                      Bài học chưa có nội dung
                    </p>
                  )}
                </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Flashcard sets — bấm để study (Phase S4) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Học từ vựng ({flashcardSets.length})
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
              {flashcardSets.map((set) => (
                <div
                  key={set.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="h-9 w-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                      <Layers className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{set.title}</p>
                      <p className="text-xs text-gray-500">
                        {set.flashcards?.length || 0} thẻ
                        {set.description && ` · ${set.description}`}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" asChild>
                    <Link to={`/student/flashcard-sets/${set.id}`}>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Học
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quizzes — bấm để take (Phase S5) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Bài kiểm tra ({quizzes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {quizzesLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            </div>
          ) : quizzes.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">
              Chưa có bài kiểm tra nào
            </p>
          ) : (
            <div className="space-y-2">
              {quizzes.map((q) => (
                <div
                  key={q.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="h-9 w-9 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0">
                      <HelpCircle className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
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
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/student/quizzes/${q.id}/history`}>
                        <History className="mr-1.5 h-3.5 w-3.5" />
                        Lịch sử
                      </Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link to={`/student/quizzes/${q.id}`}>
                        <Play className="mr-2 h-4 w-4" />
                        Làm bài
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
