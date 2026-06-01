import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  Send,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  useStartQuizAttempt,
  useAttempt,
  useSaveAttemptAnswer,
  useSubmitAttempt,
} from "@/hooks/useQuizAttempts";
import toast from "react-hot-toast";

export default function StudentQuizPage() {
  const { id: quizId } = useParams();
  const navigate = useNavigate();

  const [attemptId, setAttemptId] = useState(null);
  const [selected, setSelected] = useState({}); // { [questionId]: string[] }
  const [currentIdx, setCurrentIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(null);
  const submittedRef = useRef(false);

  const startMutation = useStartQuizAttempt();
  const { data: attempt, isLoading } = useAttempt(attemptId);
  const saveMutation = useSaveAttemptAnswer();
  const submitMutation = useSubmitAttempt();

  // Start attempt khi mount
  useEffect(() => {
    if (!quizId || attemptId) return;
    startMutation.mutate(quizId, {
      onSuccess: (res) => {
        const a = res?.data;
        if (a?.id) {
          setAttemptId(a.id);
          setSelected(a.selectedByQuestion || {});
          // Tính thời gian còn lại nếu quiz có timeLimit
          if (a.quiz?.timeLimit) {
            const startedAt = new Date(a.startedAt).getTime();
            const endAt = startedAt + a.quiz.timeLimit * 60 * 1000;
            const remain = Math.max(0, Math.floor((endAt - Date.now()) / 1000));
            setSecondsLeft(remain);
          }
        }
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId]);

  const quiz = attempt?.quiz;
  const questions = quiz?.questions || [];
  const currentQ = questions[currentIdx];

  const answeredCount = useMemo(
    () => Object.values(selected).filter((v) => v?.length > 0).length,
    [selected],
  );

  const doSubmit = async () => {
    if (submittedRef.current || !attemptId) return;
    submittedRef.current = true;
    submitMutation.mutate(attemptId, {
      onSuccess: () => {
        toast.success("Nộp bài thành công");
        navigate(`/student/attempts/${attemptId}/result`, { replace: true });
      },
      onError: () => {
        submittedRef.current = false;
      },
    });
  };

  // Countdown timer
  useEffect(() => {
    if (secondsLeft === null) return;
    if (secondsLeft <= 0) {
      doSubmit();
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  const persistAnswer = (questionId, answerIds) => {
    saveMutation.mutate({
      attemptId,
      questionId,
      selectedAnswers: answerIds,
    });
  };

  const toggleAnswer = (questionId, answerId, type) => {
    setSelected((prev) => {
      const cur = prev[questionId] || [];
      let next;
      if (type === "MULTIPLE_CHOICE") {
        next = cur.includes(answerId)
          ? cur.filter((x) => x !== answerId)
          : [...cur, answerId];
      } else {
        next = [answerId];
      }
      persistAnswer(questionId, next);
      return { ...prev, [questionId]: next };
    });
  };

  if (startMutation.isPending || isLoading || !attempt) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (attempt.status === "COMPLETED") {
    // Đã nộp rồi — đẩy thẳng sang kết quả
    navigate(`/student/attempts/${attempt.id}/result`, { replace: true });
    return null;
  }

  if (!questions.length) {
    return (
      <div className="space-y-4">
        <Link
          to={`/student/modules/${quiz.module?.id}`}
          className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Quay lại module
        </Link>
        <p>Quiz này chưa có câu hỏi nào.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Link
            to={`/student/modules/${quiz.module?.id}`}
            className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 mb-1"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Quay lại module
          </Link>
          <h1 className="text-xl font-bold">{quiz.title}</h1>
          {quiz.description && (
            <p className="text-sm text-gray-600">{quiz.description}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {secondsLeft !== null && (
            <Badge
              variant="outline"
              className={`text-base px-3 py-1.5 ${
                secondsLeft < 60 ? "text-red-600 border-red-300" : ""
              }`}
            >
              <Clock className="h-4 w-4 mr-1.5" />
              {formatTime(secondsLeft)}
            </Badge>
          )}
          <Badge variant="outline" className="text-base px-3 py-1.5">
            <Award className="h-4 w-4 mr-1.5" /> Đạt: {quiz.passingScore}%
          </Badge>
        </div>
      </div>

      {/* Progress + nav */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
            <span>
              Câu {currentIdx + 1} / {questions.length}
            </span>
            <span>
              Đã trả lời: {answeredCount} / {questions.length}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {questions.map((q, idx) => {
              const isAnswered = (selected[q.id]?.length || 0) > 0;
              const isCurrent = idx === currentIdx;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(idx)}
                  className={`h-8 w-8 rounded-md text-xs font-medium border transition-colors ${
                    isCurrent
                      ? "bg-blue-600 text-white border-blue-600"
                      : isAnswered
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Question */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-lg">
              Câu {currentIdx + 1}:{" "}
              <span className="font-normal">{currentQ.content}</span>
            </CardTitle>
            <Badge variant="outline" className="flex-shrink-0">
              {typeLabel(currentQ.type)} · {currentQ.points} điểm
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {currentQ.answers.map((a, idx) => {
              const isSel = (selected[currentQ.id] || []).includes(a.id);
              return (
                <label
                  key={a.id}
                  className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    isSel
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type={
                      currentQ.type === "MULTIPLE_CHOICE" ? "checkbox" : "radio"
                    }
                    name={`q-${currentQ.id}`}
                    checked={isSel}
                    onChange={() =>
                      toggleAnswer(currentQ.id, a.id, currentQ.type)
                    }
                    className="mt-0.5"
                  />
                  <span className="flex-1">
                    <span className="text-gray-500 mr-2">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    {a.content}
                  </span>
                </label>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Footer nav */}
      <div className="flex items-center justify-between gap-2">
        <Button
          variant="outline"
          disabled={currentIdx === 0}
          onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Câu trước
        </Button>
        <div className="flex items-center gap-2">
          {currentIdx < questions.length - 1 && (
            <Button
              variant="outline"
              onClick={() =>
                setCurrentIdx((i) => Math.min(questions.length - 1, i + 1))
              }
            >
              Câu sau <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>
                <Send className="h-4 w-4 mr-2" />
                Nộp bài
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận nộp bài?</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn đã trả lời {answeredCount} / {questions.length} câu.
                  {answeredCount < questions.length &&
                    " Các câu chưa trả lời sẽ bị tính 0 điểm."}
                  <br />
                  Sau khi nộp bài sẽ không thể sửa.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Huỷ</AlertDialogCancel>
                <AlertDialogAction
                  onClick={doSubmit}
                  disabled={submitMutation.isPending}
                >
                  {submitMutation.isPending ? "Đang nộp..." : "Nộp bài"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function typeLabel(t) {
  if (t === "SINGLE_CHOICE") return "Chọn 1";
  if (t === "MULTIPLE_CHOICE") return "Chọn nhiều";
  if (t === "TRUE_FALSE") return "Đúng/Sai";
  return t;
}
