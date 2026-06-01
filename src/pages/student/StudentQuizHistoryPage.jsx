import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronLeft,
  Loader2,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  TrendingUp,
  Trophy,
  Eye,
  RotateCw,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMyQuizAttempts } from "@/hooks/useQuizAttempts";

export default function StudentQuizHistoryPage() {
  const { id: quizId } = useParams();
  const { data, isLoading } = useMyQuizAttempts(quizId);

  const quiz = data?.quiz;
  const attempts = useMemo(() => data?.attempts || [], [data]);

  const stats = useMemo(() => {
    const completed = attempts.filter((a) => a.status === "COMPLETED");
    const scores = completed.map((a) => a.score ?? 0);
    const best = scores.length ? Math.max(...scores) : null;
    const avg = scores.length
      ? scores.reduce((s, n) => s + n, 0) / scores.length
      : null;
    const passingScore = quiz?.passingScore ?? 0;
    const passedCount = completed.filter(
      (a) => (a.score ?? 0) >= passingScore,
    ).length;
    const inProgress = attempts.find((a) => a.status === "IN_PROGRESS");
    return {
      total: attempts.length,
      completed: completed.length,
      best,
      avg,
      passedCount,
      inProgress,
    };
  }, [attempts, quiz]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="p-6">
        <p className="text-red-600">Không tìm thấy quiz</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <Link
          to={`/student/modules/${quiz.module?.id}`}
          className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 mb-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          {quiz.module?.title || "Quay lại module"}
        </Link>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <History className="h-5 w-5 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Lịch sử bài làm
              </h1>
            </div>
            <p className="text-gray-700 font-medium">{quiz.title}</p>
            {quiz.description && (
              <p className="text-sm text-gray-500">{quiz.description}</p>
            )}
          </div>
          <div className="flex gap-2">
            {stats.inProgress ? (
              <Button asChild>
                <Link to={`/student/quizzes/${quiz.id}`}>
                  <Play className="h-4 w-4 mr-2" /> Làm tiếp
                </Link>
              </Button>
            ) : (
              <Button asChild>
                <Link to={`/student/quizzes/${quiz.id}`}>
                  <RotateCw className="h-4 w-4 mr-2" />
                  {attempts.length === 0 ? "Bắt đầu làm bài" : "Làm lại"}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Quick info */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="px-3 py-1">
          <Clock className="h-3.5 w-3.5 mr-1.5" />
          {quiz.timeLimit ? `${quiz.timeLimit} phút` : "Không giới hạn"}
        </Badge>
        <Badge variant="outline" className="px-3 py-1">
          <Award className="h-3.5 w-3.5 mr-1.5" />
          Đạt: {quiz.passingScore}%
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          icon={History}
          label="Tổng số lần làm"
          value={stats.total}
          accent="bg-blue-100 text-blue-600"
        />
        <StatCard
          icon={Trophy}
          label="Điểm cao nhất"
          value={stats.best != null ? `${formatScore(stats.best)}%` : "—"}
          accent="bg-amber-100 text-amber-600"
          valueClass="text-amber-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Điểm trung bình"
          value={stats.avg != null ? `${formatScore(stats.avg)}%` : "—"}
          accent="bg-purple-100 text-purple-600"
        />
        <StatCard
          icon={CheckCircle2}
          label="Lần đạt"
          value={
            stats.completed > 0 ? `${stats.passedCount}/${stats.completed}` : "—"
          }
          accent="bg-green-100 text-green-600"
          valueClass="text-green-600"
        />
      </div>

      {/* Attempts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Tất cả các lần làm ({attempts.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {attempts.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-10">
              Bạn chưa làm quiz này lần nào. Hãy bấm "Bắt đầu làm bài" để thử.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Bắt đầu</TableHead>
                  <TableHead>Nộp bài</TableHead>
                  <TableHead>Điểm</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attempts.map((a, idx) => {
                  const passed =
                    a.status === "COMPLETED" &&
                    (a.score ?? 0) >= quiz.passingScore;
                  return (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium text-gray-500">
                        {attempts.length - idx}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(a.startedAt)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {a.submittedAt ? formatDate(a.submittedAt) : "—"}
                      </TableCell>
                      <TableCell>
                        {a.status === "COMPLETED" ? (
                          <span
                            className={`font-semibold ${
                              passed ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {formatScore(a.score ?? 0)}%
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {a.status === "COMPLETED" ? (
                          passed ? (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Đạt
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                              <XCircle className="h-3 w-3 mr-1" />
                              Chưa đạt
                            </Badge>
                          )
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-amber-700 border-amber-300"
                          >
                            <Clock className="h-3 w-3 mr-1" />
                            Đang làm
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {a.status === "COMPLETED" ? (
                          <Button size="sm" variant="outline" asChild>
                            <Link to={`/student/attempts/${a.id}/result`}>
                              <Eye className="h-3.5 w-3.5 mr-1.5" />
                              Xem chi tiết
                            </Link>
                          </Button>
                        ) : (
                          <Button size="sm" asChild>
                            <Link to={`/student/quizzes/${quiz.id}`}>
                              <Play className="h-3.5 w-3.5 mr-1.5" />
                              Làm tiếp
                            </Link>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent, valueClass = "" }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div
            className={`h-10 w-10 rounded-lg flex items-center justify-center ${accent}`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500 truncate">{label}</p>
            <p className={`text-lg font-bold ${valueClass}`}>{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function formatScore(n) {
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
}

function formatDate(d) {
  if (!d) return "—";
  const dt = new Date(d);
  return dt.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
