import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Loader2,
  HelpCircle,
  Clock,
  Award,
  Check,
} from "lucide-react";
import { useQuizDetail } from "@/hooks/useQuizzes";
import QuestionFormDialog from "@/components/quiz/QuestionFormDialog";
import DeleteQuestionDialog from "@/components/quiz/DeleteQuestionDialog";
import { QUESTION_TYPES } from "@/utils/constants";

export default function QuizDetailPage() {
  const { id } = useParams();
  const { data: quiz, isLoading } = useQuizDetail(id);

  const [questionFormTarget, setQuestionFormTarget] = useState(null);
  const [questionFormOpen, setQuestionFormOpen] = useState(false);
  const [questionDeleteTarget, setQuestionDeleteTarget] = useState(null);

  const openCreate = () => {
    setQuestionFormTarget(null);
    setQuestionFormOpen(true);
  };

  const openEdit = (question) => {
    setQuestionFormTarget(question);
    setQuestionFormOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!quiz) {
    return <div>Không tìm thấy quiz</div>;
  }

  const questions = quiz.questions || [];
  const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header + breadcrumb */}
      <div>
        <Link
          to={`/academic/modules/${quiz.module?.id || quiz.moduleId}`}
          className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 mb-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          {quiz.module?.title || "Quay lại module"}
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
        {quiz.description && (
          <p className="text-gray-600 mt-1">{quiz.description}</p>
        )}

        {/* Quiz meta */}
        <div className="flex flex-wrap gap-3 mt-3">
          <Badge variant="outline" className="text-sm py-1">
            <Clock className="h-3 w-3 mr-1" />
            {quiz.timeLimit ? `${quiz.timeLimit} phút` : "Không giới hạn thời gian"}
          </Badge>
          <Badge variant="outline" className="text-sm py-1">
            <Award className="h-3 w-3 mr-1" />
            Điểm đạt: {quiz.passingScore}%
          </Badge>
          <Badge variant="outline" className="text-sm py-1">
            <HelpCircle className="h-3 w-3 mr-1" />
            {questions.length} câu · {totalPoints} điểm
          </Badge>
        </div>
      </div>

      {/* Questions section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Câu hỏi ({questions.length})
          </CardTitle>
          <Button size="sm" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm câu hỏi
          </Button>
        </CardHeader>
        <CardContent>
          {questions.length === 0 ? (
            <div className="text-center py-10">
              <HelpCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">Chưa có câu hỏi nào</p>
              <Button onClick={openCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Tạo câu hỏi đầu tiên
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="h-7 w-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium break-words">{q.content}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {QUESTION_TYPES[q.type] || q.type}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {q.points} điểm
                          </span>
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
                        <DropdownMenuItem onClick={() => openEdit(q)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => setQuestionDeleteTarget(q)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Answers list */}
                  <div className="ml-10 space-y-1.5">
                    {q.answers?.map((a, aIdx) => (
                      <div
                        key={a.id}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                          a.isCorrect
                            ? "bg-emerald-50 border border-emerald-200"
                            : "bg-gray-50 border border-gray-100"
                        }`}
                      >
                        <span className="text-xs text-gray-500 font-medium w-5">
                          {String.fromCharCode(65 + aIdx)}.
                        </span>
                        <span className="flex-1 break-words">{a.content}</span>
                        {a.isCorrect && (
                          <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <QuestionFormDialog
        quizId={id}
        question={questionFormTarget}
        open={questionFormOpen}
        onClose={() => setQuestionFormOpen(false)}
      />

      <DeleteQuestionDialog
        quizId={id}
        question={questionDeleteTarget}
        open={!!questionDeleteTarget}
        onClose={() => setQuestionDeleteTarget(null)}
      />
    </div>
  );
}
