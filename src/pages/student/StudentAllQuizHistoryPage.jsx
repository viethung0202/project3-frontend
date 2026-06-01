import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Loader2,
  History,
  CheckCircle2,
  XCircle,
  Clock,
  Trophy,
  TrendingUp,
  ListChecks,
  Eye,
  Play,
  ChevronRight,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useStudentQuizHistory } from "@/hooks/useStudent";

export default function StudentAllQuizHistoryPage() {
  const { data: history = [], isLoading } = useStudentQuizHistory();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | passed | failed | in_progress

  const overallStats = useMemo(() => {
    let totalAttempts = 0;
    let completedAttempts = 0;
    let passedQuizzes = 0;
    let avgScores = [];
    for (const h of history) {
      totalAttempts += h.stats.totalAttempts;
      completedAttempts += h.stats.completedAttempts;
      if (h.stats.passed) passedQuizzes += 1;
      if (h.stats.bestScore != null) avgScores.push(h.stats.bestScore);
    }
    const avg = avgScores.length
      ? avgScores.reduce((s, n) => s + n, 0) / avgScores.length
      : null;
    return {
      totalQuizzes: history.length,
      totalAttempts,
      completedAttempts,
      passedQuizzes,
      avgBestScore: avg,
    };
  }, [history]);

  const filtered = useMemo(() => {
    let list = history;
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(
        (h) =>
          h.quiz.title.toLowerCase().includes(s) ||
          h.quiz.module?.title?.toLowerCase().includes(s) ||
          h.quiz.module?.course?.title?.toLowerCase().includes(s),
      );
    }
    if (filter === "passed") list = list.filter((h) => h.stats.passed);
    else if (filter === "failed")
      list = list.filter(
        (h) => h.stats.completedAttempts > 0 && !h.stats.passed,
      );
    else if (filter === "in_progress")
      list = list.filter((h) => h.stats.hasInProgress);
    return list;
  }, [history, search, filter]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <History className="h-5 w-5 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Lịch sử Quiz</h1>
        </div>
        <p className="text-sm text-gray-500">
          Tất cả các bài kiểm tra bạn đã làm
        </p>
      </div>

      {/* Overall stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          icon={ListChecks}
          label="Tổng quiz đã làm"
          value={overallStats.totalQuizzes}
          accent="bg-blue-100 text-blue-600"
        />
        <StatCard
          icon={History}
          label="Lần làm"
          value={overallStats.totalAttempts}
          accent="bg-indigo-100 text-indigo-600"
        />
        <StatCard
          icon={Trophy}
          label="Đã đạt"
          value={`${overallStats.passedQuizzes}/${overallStats.totalQuizzes}`}
          accent="bg-green-100 text-green-600"
          valueClass="text-green-600"
        />
        <StatCard
          icon={TrendingUp}
          label="TB điểm cao nhất"
          value={
            overallStats.avgBestScore != null
              ? `${formatScore(overallStats.avgBestScore)}%`
              : "—"
          }
          accent="bg-amber-100 text-amber-600"
          valueClass="text-amber-600"
        />
      </div>

      {/* Filter bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo tên quiz, module, khóa học..."
                className="pl-9"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              <FilterPill
                active={filter === "all"}
                onClick={() => setFilter("all")}
              >
                Tất cả
              </FilterPill>
              <FilterPill
                active={filter === "passed"}
                onClick={() => setFilter("passed")}
              >
                Đã đạt
              </FilterPill>
              <FilterPill
                active={filter === "failed"}
                onClick={() => setFilter("failed")}
              >
                Chưa đạt
              </FilterPill>
              <FilterPill
                active={filter === "in_progress"}
                onClick={() => setFilter("in_progress")}
              >
                Đang làm
              </FilterPill>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* List */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center">
            <History className="h-10 w-10 text-gray-300 mx-auto mb-2" />
            <p className="font-medium text-gray-700">
              {history.length === 0
                ? "Bạn chưa làm quiz nào"
                : "Không có quiz nào khớp bộ lọc"}
            </p>
            {history.length === 0 && (
              <p className="text-sm text-gray-500 mt-1">
                Hãy vào khóa học của bạn để bắt đầu làm bài kiểm tra.
              </p>
            )}
            {history.length === 0 && (
              <Button asChild className="mt-4">
                <Link to="/student/courses">Đi tới khóa học của tôi</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((h) => (
            <QuizHistoryRow key={h.quiz.id} item={h} />
          ))}
        </div>
      )}
    </div>
  );
}

function QuizHistoryRow({ item }) {
  const { quiz, stats, attempts } = item;
  const lastCompleted = attempts.find((a) => a.status === "COMPLETED");

  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0">
                <ListChecks className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <p className="font-semibold text-gray-900 truncate">
                    {quiz.title}
                  </p>
                  <StatusBadge stats={stats} />
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                  {quiz.module?.course?.title && (
                    <Link
                      to={`/student/courses/${quiz.module.course.id}`}
                      className="hover:text-blue-600 truncate"
                    >
                      {quiz.module.course.title}
                    </Link>
                  )}
                  {quiz.module?.title && (
                    <>
                      <ChevronRight className="h-3 w-3 flex-shrink-0" />
                      <Link
                        to={`/student/modules/${quiz.module.id}`}
                        className="hover:text-blue-600 truncate"
                      >
                        {quiz.module.title}
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats inline */}
          <div className="flex gap-4 md:gap-6 text-sm">
            <InlineStat label="Lần làm" value={stats.totalAttempts} />
            <InlineStat
              label={`Cao nhất (đạt ${quiz.passingScore}%)`}
              value={
                stats.bestScore != null
                  ? `${formatScore(stats.bestScore)}%`
                  : "—"
              }
              valueClass={stats.passed ? "text-green-600 font-semibold" : ""}
            />
            <InlineStat
              label="Lần gần nhất"
              value={formatDate(stats.lastAttemptAt)}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-shrink-0">
            {stats.hasInProgress && (
              <Button size="sm" asChild>
                <Link to={`/student/quizzes/${quiz.id}`}>
                  <Play className="h-3.5 w-3.5 mr-1.5" />
                  Làm tiếp
                </Link>
              </Button>
            )}
            {!stats.hasInProgress && lastCompleted && (
              <Button size="sm" variant="outline" asChild>
                <Link to={`/student/attempts/${lastCompleted.id}/result`}>
                  <Eye className="h-3.5 w-3.5 mr-1.5" />
                  Kết quả mới nhất
                </Link>
              </Button>
            )}
            <Button size="sm" variant="outline" asChild>
              <Link to={`/student/quizzes/${quiz.id}/history`}>
                <History className="h-3.5 w-3.5 mr-1.5" />
                Chi tiết
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ stats }) {
  if (stats.hasInProgress) {
    return (
      <Badge variant="outline" className="text-amber-700 border-amber-300">
        <Clock className="h-3 w-3 mr-1" /> Đang làm
      </Badge>
    );
  }
  if (stats.completedAttempts === 0) {
    return (
      <Badge variant="outline" className="text-gray-500">
        Chưa nộp bài
      </Badge>
    );
  }
  if (stats.passed) {
    return (
      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
        <CheckCircle2 className="h-3 w-3 mr-1" /> Đã đạt
      </Badge>
    );
  }
  return (
    <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
      <XCircle className="h-3 w-3 mr-1" /> Chưa đạt
    </Badge>
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

function InlineStat({ label, value, valueClass = "", hidden = false }) {
  if (hidden) return null;
  return (
    <div className="min-w-0">
      <p className="text-[11px] text-gray-500 leading-tight">{label}</p>
      <p className={`text-sm font-medium ${valueClass}`}>{value}</p>
    </div>
  );
}

function FilterPill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
        active
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );
}

function formatScore(n) {
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
}

function formatDate(d) {
  if (!d) return "—";
  const dt = new Date(d);
  return dt.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
