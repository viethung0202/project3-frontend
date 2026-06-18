import { useParams, Link, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  Award,
  ChevronLeft,
  Loader2,
  RotateCw,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAttemptResult } from "@/hooks/useQuizAttempts";

export default function StudentQuizResultPage() {
  const { id: attemptId } = useParams();
  const navigate = useNavigate();
  const { data: result, isLoading, error } = useAttemptResult(attemptId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="p-6">
        <p className="text-red-600">
          {error?.response?.data?.message || "Không thể lấy kết quả"}
        </p>
      </div>
    );
  }

  const { quiz, score, passed, totalQuestions, correctCount, questions } =
    result;
  const wrongCount = totalQuestions - correctCount;

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {/* Summary */}
      <Card
        className={
          passed
            ? "border-green-200 bg-green-50/50"
            : "border-red-200 bg-red-50/50"
        }
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-xl font-bold mb-1">{quiz.title}</h1>
              <p className="text-sm text-gray-600">
                {passed
                  ? "Chúc mừng, bạn đã vượt qua bài kiểm tra!"
                  : "Bạn chưa đạt điểm tối thiểu. Hãy thử lại!"}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <div
                className={`text-4xl font-bold ${
                  passed ? "text-green-600" : "text-red-600"
                }`}
              >
                {score?.toFixed?.(2) ?? score}%
              </div>
              <Badge
                variant="outline"
                className={
                  passed
                    ? "border-green-300 text-green-700"
                    : "border-red-300 text-red-700"
                }
              >
                <Award className="h-3.5 w-3.5 mr-1" />
                Đạt: {quiz.passingScore}%
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
            <Stat label="Tổng câu" value={totalQuestions} />
            <Stat
              label="Đúng"
              value={correctCount}
              valueClass="text-green-600"
            />
            <Stat
              label="Sai"
              value={wrongCount}
              valueClass="text-red-600"
            />
          </div>

          <div className="flex flex-wrap gap-2 mt-5">
            <Button asChild>
              <Link to={`/student/quizzes/${quiz.id}`}>
                <RotateCw className="h-4 w-4 mr-2" /> Làm lại
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to={`/student/quizzes/${quiz.id}/history`}>
                <History className="h-4 w-4 mr-2" /> Lịch sử
              </Link>
            </Button>
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Quay lại
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* All questions — đúng + sai */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-700">
            Chi tiết bài làm ({totalQuestions} câu)
          </h2>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
              Đúng: {correctCount}
            </span>
            <span className="inline-flex items-center gap-1">
              <XCircle className="h-3.5 w-3.5 text-red-600" />
              Sai: {wrongCount}
            </span>
          </div>
        </div>

        {questions.map((q, idx) => {
          const selectedSet = new Set(q.selectedAnswerIds);
          const isQCorrect = q.isCorrect;
          return (
            <Card
              key={q.id}
              className={isQCorrect ? "border-green-100" : "border-red-100"}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-base">
                    <span
                      className={`mr-2 ${
                        isQCorrect ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isQCorrect ? (
                        <CheckCircle2 className="h-4 w-4 inline-block mb-0.5" />
                      ) : (
                        <XCircle className="h-4 w-4 inline-block mb-0.5" />
                      )}
                    </span>
                    Câu {idx + 1}:{" "}
                    <span className="font-normal">{q.content}</span>
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className={`flex-shrink-0 ${
                      isQCorrect
                        ? "border-green-300 text-green-700"
                        : "border-red-300 text-red-700"
                    }`}
                  >
                    {q.points} điểm
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {(q.audioUrl || q.imageUrl) && (
                  <div className="mb-3 space-y-2">
                    {q.imageUrl && (
                      <img
                        src={q.imageUrl}
                        alt={`Question ${idx + 1}`}
                        className="rounded-lg border max-h-64 w-auto"
                      />
                    )}
                    {q.audioUrl && (
                      <audio
                        controls
                        src={q.audioUrl}
                        className="w-full"
                        preload="metadata"
                      />
                    )}
                  </div>
                )}
                <div className="space-y-2">
                  {q.answers.map((a, ai) => {
                    const isCorrect = a.isCorrect;
                    const wasSelected = selectedSet.has(a.id);
                    return (
                      <div
                        key={a.id}
                        className={`flex items-start gap-3 p-2.5 rounded-lg border ${
                          isCorrect
                            ? "border-green-300 bg-green-50"
                            : wasSelected
                            ? "border-red-300 bg-red-50"
                            : "border-gray-200"
                        }`}
                      >
                        <span className="flex-shrink-0 mt-0.5">
                          {isCorrect ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : wasSelected ? (
                            <XCircle className="h-4 w-4 text-red-600" />
                          ) : (
                            <span className="inline-block h-4 w-4 rounded-full border border-gray-300" />
                          )}
                        </span>
                        <span className="flex-1 text-sm">
                          <span className="text-gray-500 mr-2">
                            {String.fromCharCode(65 + ai)}.
                          </span>
                          {a.content}
                          {isCorrect && (
                            <Badge
                              variant="outline"
                              className="ml-2 border-green-300 text-green-700 text-[10px]"
                            >
                              Đáp án đúng
                            </Badge>
                          )}
                          {wasSelected && !isCorrect && (
                            <Badge
                              variant="outline"
                              className="ml-2 border-red-300 text-red-700 text-[10px]"
                            >
                              Bạn chọn
                            </Badge>
                          )}
                        </span>
                      </div>
                    );
                  })}
                  {selectedSet.size === 0 && (
                    <p className="text-xs text-gray-500 italic mt-1">
                      Bạn chưa chọn đáp án cho câu này.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, value, valueClass = "" }) {
  return (
    <div className="bg-white rounded-lg border p-3">
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p className={`text-xl font-bold ${valueClass}`}>{value}</p>
    </div>
  );
}
