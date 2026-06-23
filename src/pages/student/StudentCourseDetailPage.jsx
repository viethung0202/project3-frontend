import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Layers,
  TrendingUp,
  BookOpen,
  Loader2,
  Award,
  ExternalLink,
  Trophy,
} from "lucide-react";
import { useCourseDetail } from "@/hooks/useCourses";
import { useStudentCourses } from "@/hooks/useStudent";
import { COURSE_LEVELS } from "@/utils/constants";
import {
  listMyCertificates,
  claimCertificate,
  getMyEvaluationForCourse,
} from "@/lib/api";
import { EVAL_GRADES } from "@/utils/constants";
import CourseLeaderboard from "@/components/course/CourseLeaderboard";

export default function StudentCourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("modules");
  const { data: course, isLoading } = useCourseDetail(id);
  const { data: myCourses = [] } = useStudentCourses();
  const { data: myCerts = [] } = useQuery({
    queryKey: ["my-certificates"],
    queryFn: listMyCertificates,
  });
  const { data: myEval } = useQuery({
    queryKey: ["my-evaluation", id],
    queryFn: () => getMyEvaluationForCourse(id),
    enabled: !!id,
  });

  const myEnrollment = myCourses.find((c) => c.id === id);
  const myCert = myCerts.find((c) => c.course.id === id);

  const claimMutation = useMutation({
    mutationFn: () => claimCertificate(id),
    onSuccess: (res) => {
      toast.success("Đã cấp chứng chỉ!");
      queryClient.invalidateQueries({ queryKey: ["my-certificates"] });
      const certNumber = res?.data?.certNumber;
      if (certNumber) navigate(`/certificate/${certNumber}`);
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Nhận chứng chỉ thất bại"),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!course) {
    return <div>Không tìm thấy khóa học</div>;
  }

  const progress = myEnrollment?.progress || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/student/courses"
          className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 mb-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Quay lại khóa học của tôi
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline">{COURSE_LEVELS[course.level]}</Badge>
        </div>
      </div>

      {/* Course info */}
      <Card>
        <CardContent className="p-6">
          {course.thumbnail && (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-48 md:h-64 object-cover rounded-lg mb-4"
            />
          )}
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {course.description || "Chưa có mô tả"}
          </p>
        </CardContent>
      </Card>

      {/* Progress card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-5 w-5" />
            Tiến độ học tập
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-700 min-w-[3rem] text-right">
              {Math.round(progress)}%
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {progress === 0
              ? "Bắt đầu học để cập nhật tiến độ"
              : progress === 100
                ? "🎉 Bạn đã hoàn thành khóa học!"
                : `Đang học · còn ${100 - Math.round(progress)}% nữa`}
          </p>
        </CardContent>
      </Card>

      {/* Teacher Evaluation */}
      {myEval && (
        <Card className="border-indigo-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-2 text-base">
              <span className="flex items-center gap-2">
                <Award className="h-5 w-5 text-indigo-600" />
                Đánh giá từ giáo viên
              </span>
              <Badge
                variant="outline"
                className={EVAL_GRADES[myEval.overallGrade].color}
              >
                {EVAL_GRADES[myEval.overallGrade].label}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 4 kỹ năng */}
            {(myEval.listeningScore !== null ||
              myEval.speakingScore !== null ||
              myEval.readingScore !== null ||
              myEval.writingScore !== null) && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <SkillBox label="Nghe" value={myEval.listeningScore} color="text-blue-600" />
                <SkillBox label="Nói" value={myEval.speakingScore} color="text-emerald-600" />
                <SkillBox label="Đọc" value={myEval.readingScore} color="text-amber-600" />
                <SkillBox label="Viết" value={myEval.writingScore} color="text-purple-600" />
              </div>
            )}

            {myEval.strengths && (
              <TextBlock title="Điểm mạnh" color="bg-emerald-50 border-emerald-200 text-emerald-900" content={myEval.strengths} />
            )}
            {myEval.weaknesses && (
              <TextBlock title="Điểm cần cải thiện" color="bg-amber-50 border-amber-200 text-amber-900" content={myEval.weaknesses} />
            )}
            {myEval.recommendation && (
              <TextBlock title="Lời khuyên" color="bg-blue-50 border-blue-200 text-blue-900" content={myEval.recommendation} />
            )}

            <p className="text-xs text-gray-500 text-right">
              Đánh giá bởi <strong>{myEval.evaluatedBy.fullName}</strong> ·{" "}
              {new Date(myEval.updatedAt).toLocaleDateString("vi-VN")}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Certificate */}
      {progress === 100 && (
        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
          <CardContent className="p-5 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-shrink-0 h-14 w-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center">
              <Award className="h-7 w-7" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-bold text-gray-900 mb-1">
                {myCert ? "Bạn đã nhận chứng chỉ" : "Bạn đủ điều kiện nhận chứng chỉ"}
              </h3>
              <p className="text-sm text-gray-600">
                {myCert
                  ? `Mã: ${myCert.certNumber}`
                  : "Hoàn thành 100% khóa học — nhận chứng chỉ EngCenter của bạn"}
              </p>
            </div>
            {myCert ? (
              <Button asChild>
                <Link to={`/certificate/${myCert.certNumber}`} target="_blank">
                  Xem chứng chỉ <ExternalLink className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            ) : (
              <Button
                onClick={() => claimMutation.mutate()}
                disabled={claimMutation.isPending}
                className="bg-amber-600 hover:bg-amber-700"
              >
                {claimMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Award className="h-4 w-4 mr-1" />
                )}
                Nhận chứng chỉ
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tab switcher */}
      <div className="border-b flex gap-1">
        <TabBtn
          active={tab === "modules"}
          onClick={() => setTab("modules")}
          icon={Layers}
        >
          Nội dung khóa học
        </TabBtn>
        <TabBtn
          active={tab === "leaderboard"}
          onClick={() => setTab("leaderboard")}
          icon={Trophy}
        >
          Bảng xếp hạng
        </TabBtn>
      </div>

      {tab === "leaderboard" && <CourseLeaderboard courseId={id} />}

      {/* Modules */}
      {tab === "modules" && (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Nội dung khóa học ({course.modules?.length || 0} modules)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {course.modules?.length > 0 ? (
            <div className="space-y-2">
              {course.modules.map((module, idx) => (
                <Link
                  key={module.id}
                  to={`/student/modules/${module.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 hover:border-blue-200 transition-colors"
                >
                  <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-medium flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{module.title}</p>
                    {module.description && (
                      <p className="text-xs text-gray-500 truncate">
                        {module.description}
                      </p>
                    )}
                  </div>
                  <BookOpen className="h-4 w-4 text-gray-400 flex-shrink-0" />
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-6">
              Khóa học chưa có module nào
            </p>
          )}
        </CardContent>
      </Card>
      )}
    </div>
  );
}

function TabBtn({ active, onClick, icon: Icon, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
        active
          ? "border-blue-600 text-blue-600"
          : "border-transparent text-gray-600 hover:text-gray-900"
      }`}
    >
      <Icon className="h-4 w-4" />
      {children}
    </button>
  );
}

function SkillBox({ label, value, color }) {
  return (
    <div className="border rounded-lg p-3 text-center bg-white">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-xl font-bold ${color}`}>
        {value !== null && value !== undefined ? value : "—"}
      </p>
    </div>
  );
}

function TextBlock({ title, color, content }) {
  return (
    <div className={`border rounded-lg p-3 ${color}`}>
      <p className="text-xs font-semibold uppercase tracking-wider mb-1 opacity-70">
        {title}
      </p>
      <p className="text-sm whitespace-pre-wrap">{content}</p>
    </div>
  );
}
