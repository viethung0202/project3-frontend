import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronLeft,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  FileText,
  HelpCircle,
  Layers,
  Loader2,
  Video,
} from "lucide-react";
import { useModuleDetail } from "@/hooks/useModules";
import { useModuleLessons } from "@/hooks/useLessons";
import { useModuleFlashcardSets } from "@/hooks/useFlashcards";
import { useModuleQuizzes } from "@/hooks/useQuizzes";
import LessonFormDialog from "@/components/lesson/LessonFormDialog";
import DeleteLessonDialog from "@/components/lesson/DeleteLessonDialog";
import FlashcardSetFormDialog from "@/components/flashcard/FlashcardSetFormDialog";
import DeleteFlashcardSetDialog from "@/components/flashcard/DeleteFlashcardSetDialog";
import QuizFormDialog from "@/components/quiz/QuizFormDialog";
import DeleteQuizDialog from "@/components/quiz/DeleteQuizDialog";

export default function ModuleDetailPage() {
  const { id } = useParams();
  const { data: module, isLoading } = useModuleDetail(id);
  const { data: lessons = [], isLoading: lessonsLoading } =
    useModuleLessons(id);
  const { data: flashcardSets = [], isLoading: setsLoading } =
    useModuleFlashcardSets(id);
  const { data: quizzes = [], isLoading: quizzesLoading } =
    useModuleQuizzes(id);

  const [lessonFormTarget, setLessonFormTarget] = useState(null);
  const [lessonFormOpen, setLessonFormOpen] = useState(false);
  const [lessonDeleteTarget, setLessonDeleteTarget] = useState(null);

  const [setFormTarget, setSetFormTarget] = useState(null);
  const [setFormOpen, setSetFormOpen] = useState(false);
  const [setDeleteTarget, setSetDeleteTarget] = useState(null);

  const [quizFormTarget, setQuizFormTarget] = useState(null);
  const [quizFormOpen, setQuizFormOpen] = useState(false);
  const [quizDeleteTarget, setQuizDeleteTarget] = useState(null);

  const openCreateLesson = () => {
    setLessonFormTarget(null);
    setLessonFormOpen(true);
  };

  const openEditLesson = (lesson) => {
    setLessonFormTarget(lesson);
    setLessonFormOpen(true);
  };

  const openCreateSet = () => {
    setSetFormTarget(null);
    setSetFormOpen(true);
  };

  const openEditSet = (set) => {
    setSetFormTarget(set);
    setSetFormOpen(true);
  };

  const openCreateQuiz = () => {
    setQuizFormTarget(null);
    setQuizFormOpen(true);
  };

  const openEditQuiz = (quiz) => {
    setQuizFormTarget(quiz);
    setQuizFormOpen(true);
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
      {/* Header + breadcrumb */}
      <div>
        <Link
          to={`/academic/courses/${module.course?.id || module.courseId}`}
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

      {/* Lessons section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Lessons
          </CardTitle>
          <Button size="sm" onClick={openCreateLesson}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm lesson
          </Button>
        </CardHeader>
        <CardContent>
          {lessonsLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            </div>
          ) : lessons.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 mb-3 text-sm">Chưa có lesson nào</p>
              <Button size="sm" onClick={openCreateLesson}>
                <Plus className="mr-2 h-4 w-4" />
                Tạo lesson đầu tiên
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {lessons.map((lesson, idx) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{lesson.title}</p>
                      <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                        {lesson.videoUrl && (
                          <span className="inline-flex items-center gap-1">
                            <Video className="h-3 w-3" />
                            Có video
                          </span>
                        )}
                        {lesson.content && (
                          <span className="inline-flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {lesson.content.length} ký tự
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditLesson(lesson)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={() => setLessonDeleteTarget(lesson)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quizzes section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Quizzes
          </CardTitle>
          <Button size="sm" onClick={openCreateQuiz}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm quiz
          </Button>
        </CardHeader>
        <CardContent>
          {quizzesLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            </div>
          ) : quizzes.length === 0 ? (
            <div className="text-center py-8">
              <HelpCircle className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 mb-3 text-sm">Chưa có quiz nào</p>
              <Button size="sm" onClick={openCreateQuiz}>
                <Plus className="mr-2 h-4 w-4" />
                Tạo quiz đầu tiên
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {quizzes.map((quiz, idx) => (
                <div
                  key={quiz.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50"
                >
                  <Link
                    to={`/academic/quizzes/${quiz.id}`}
                    className="flex items-center gap-3 min-w-0 flex-1"
                  >
                    <div className="h-8 w-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate hover:text-blue-600 transition-colors">
                        {quiz.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {quiz.timeLimit
                          ? `${quiz.timeLimit} phút`
                          : "Không giới hạn thời gian"}
                        {" · "}Đạt: {quiz.passingScore}%
                      </p>
                    </div>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditQuiz(quiz)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={() => setQuizDeleteTarget(quiz)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Flashcard sets section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Flashcard Sets
          </CardTitle>
          <Button size="sm" onClick={openCreateSet}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm bộ flashcard
          </Button>
        </CardHeader>
        <CardContent>
          {setsLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            </div>
          ) : flashcardSets.length === 0 ? (
            <div className="text-center py-8">
              <Layers className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 mb-3 text-sm">
                Chưa có bộ flashcard nào
              </p>
              <Button size="sm" onClick={openCreateSet}>
                <Plus className="mr-2 h-4 w-4" />
                Tạo bộ đầu tiên
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {flashcardSets.map((set, idx) => (
                <div
                  key={set.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50"
                >
                  <Link
                    to={`/academic/flashcard-sets/${set.id}`}
                    className="flex items-center gap-3 min-w-0 flex-1"
                  >
                    <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate hover:text-blue-600 transition-colors">
                        {set.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {set.flashcards?.length || 0} thẻ
                        {set.description && ` · ${set.description}`}
                      </p>
                    </div>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditSet(set)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={() => setSetDeleteTarget(set)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <LessonFormDialog
        moduleId={id}
        lesson={lessonFormTarget}
        open={lessonFormOpen}
        onClose={() => setLessonFormOpen(false)}
      />

      <DeleteLessonDialog
        moduleId={id}
        lesson={lessonDeleteTarget}
        open={!!lessonDeleteTarget}
        onClose={() => setLessonDeleteTarget(null)}
      />

      <FlashcardSetFormDialog
        moduleId={id}
        set={setFormTarget}
        open={setFormOpen}
        onClose={() => setSetFormOpen(false)}
      />

      <DeleteFlashcardSetDialog
        moduleId={id}
        set={setDeleteTarget}
        open={!!setDeleteTarget}
        onClose={() => setSetDeleteTarget(null)}
      />

      <QuizFormDialog
        moduleId={id}
        quiz={quizFormTarget}
        open={quizFormOpen}
        onClose={() => setQuizFormOpen(false)}
      />

      <DeleteQuizDialog
        moduleId={id}
        quiz={quizDeleteTarget}
        open={!!quizDeleteTarget}
        onClose={() => setQuizDeleteTarget(null)}
      />
    </div>
  );
}
