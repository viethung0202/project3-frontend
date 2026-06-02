import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  BookOpen,
  Award,
  CheckCircle2,
  Loader2,
  ArrowRight,
  FileText,
  HelpCircle,
  Compass,
  Trophy,
} from "lucide-react";
import { useStudentProgress } from "@/hooks/useStudent";
import { COURSE_LEVELS } from "@/utils/constants";

export default function StudentProgressPage() {
  const { data: progressList = [], isLoading } = useStudentProgress();

  const overall = useMemo(() => {
    if (progressList.length === 0) {
      return {
        totalCourses: 0,
        completedCourses: 0,
        avgProgress: 0,
        totalLessons: 0,
        completedLessons: 0,
        totalQuizzes: 0,
        passedQuizzes: 0,
      };
    }
    let totalLessons = 0;
    let completedLessons = 0;
    let totalQuizzes = 0;
    let passedQuizzes = 0;
    let completedCourses = 0;
    let progressSum = 0;
    for (const p of progressList) {
      totalLessons += p.lessons.total;
      completedLessons += p.lessons.completed;
      totalQuizzes += p.quizzes.total;
      passedQuizzes += p.quizzes.passed;
      progressSum += p.progress || 0;
      if ((p.progress || 0) >= 100) completedCourses += 1;
    }
    return {
      totalCourses: progressList.length,
      completedCourses,
      avgProgress:
        progressList.length > 0
          ? Math.round((progressSum / progressList.length) * 10) / 10
          : 0,
      totalLessons,
      completedLessons,
      totalQuizzes,
      passedQuizzes,
    };
  }, [progressList]);

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
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Tiến độ học tập</h1>
        </div>
        <p className="text-sm text-gray-500">
          Theo dõi tiến độ chi tiết của từng khóa học bạn đang theo
        </p>
      </div>

      {/* Overall stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          icon={BookOpen}
          label="Khóa học"
          value={`${overall.completedCourses}/${overall.totalCourses}`}
          subtitle="đã hoàn thành"
          accent="bg-blue-100 text-blue-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Tiến độ TB"
          value={`${overall.avgProgress}%`}
          accent="bg-indigo-100 text-indigo-600"
        />
        <StatCard
          icon={FileText}
          label="Bài học"
          value={`${overall.completedLessons}/${overall.totalLessons}`}
          subtitle="đã hoàn thành"
          accent="bg-emerald-100 text-emerald-600"
        />
        <StatCard
          icon={Trophy}
          label="Quiz đạt"
          value={`${overall.passedQuizzes}/${overall.totalQuizzes}`}
          accent="bg-amber-100 text-amber-600"
        />
      </div>

      {/* Per-course progress */}
      {progressList.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="font-medium text-gray-700 mb-1">
              Bạn chưa đăng ký khóa học nào
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Hãy khám phá các khóa học có sẵn để bắt đầu hành trình
            </p>
            <Button asChild>
              <Link to="/courses">
                <Compass className="mr-2 h-4 w-4" />
                Khám phá khóa học
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Chi tiết từng khóa học</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {progressList.map((p) => (
              <CourseProgressRow key={p.enrollmentId} item={p} />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function CourseProgressRow({ item }) {
  const { course, progress, lessons, quizzes, lastActivity } = item;
  const isCompleted = (progress || 0) >= 100;
  const lessonPct =
    lessons.total > 0 ? (lessons.completed / lessons.total) * 100 : 0;
  const quizPct =
    quizzes.total > 0 ? (quizzes.passed / quizzes.total) * 100 : 0;

  return (
    <Link
      to={`/student/courses/${course.id}`}
      className="block group rounded-lg border hover:shadow-sm transition-shadow"
    >
      <div className="p-4 flex flex-col md:flex-row gap-4">
        {/* Thumbnail */}
        <div className="flex-shrink-0 md:w-32 h-24 md:h-20 rounded-lg overflow-hidden">
          {course.thumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-blue-300" />
            </div>
          )}
        </div>

        {/* Info + progress */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap mb-2">
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                {course.title}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="outline" className="text-xs">
                  {COURSE_LEVELS[course.level] || course.level}
                </Badge>
                {isCompleted && (
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
                    <Trophy className="h-3 w-3 mr-1" />
                    Hoàn thành
                  </Badge>
                )}
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
          </div>

          {/* Main progress bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>Tổng tiến độ</span>
              <span className="font-semibold text-gray-900">
                {Math.round(progress || 0)}%
              </span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  isCompleted ? "bg-green-500" : "bg-blue-600"
                }`}
                style={{ width: `${progress || 0}%` }}
              />
            </div>
          </div>

          {/* Sub stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <SubProgress
              icon={FileText}
              iconColor="text-emerald-600"
              label="Bài học"
              value={`${lessons.completed}/${lessons.total}`}
              percent={lessonPct}
              barColor="bg-emerald-500"
            />
            <SubProgress
              icon={HelpCircle}
              iconColor="text-orange-600"
              label="Quiz đạt"
              value={`${quizzes.passed}/${quizzes.total}`}
              percent={quizPct}
              barColor="bg-orange-500"
            />
          </div>

          {lastActivity && (
            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Học gần nhất: {formatDate(lastActivity)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

function SubProgress({ icon: Icon, iconColor, label, value, percent, barColor }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
        <span className="inline-flex items-center gap-1">
          <Icon className={`h-3 w-3 ${iconColor}`} />
          {label}
        </span>
        <span className="font-medium text-gray-700">{value}</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all ${barColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, subtitle, accent }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div
            className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${accent}`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500 truncate">{label}</p>
            <p className="text-lg font-bold">{value}</p>
            {subtitle && (
              <p className="text-[11px] text-gray-400">{subtitle}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
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
