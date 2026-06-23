import { useQuery } from "@tanstack/react-query";
import { getLeaderboard } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Loader2, Inbox, Crown } from "lucide-react";

const RANK_STYLE = {
  1: {
    bg: "bg-gradient-to-r from-amber-100 to-yellow-50 border-amber-300",
    icon: Crown,
    iconColor: "text-amber-500",
    badge: "bg-gradient-to-br from-amber-400 to-yellow-500 text-white",
  },
  2: {
    bg: "bg-gradient-to-r from-gray-100 to-slate-50 border-gray-300",
    icon: Medal,
    iconColor: "text-gray-500",
    badge: "bg-gradient-to-br from-gray-400 to-slate-500 text-white",
  },
  3: {
    bg: "bg-gradient-to-r from-orange-100 to-amber-50 border-orange-300",
    icon: Medal,
    iconColor: "text-orange-600",
    badge: "bg-gradient-to-br from-orange-400 to-amber-600 text-white",
  },
};

export default function CourseLeaderboard({ courseId }) {
  const { data, isLoading } = useQuery({
    queryKey: ["leaderboard", courseId],
    queryFn: () => getLeaderboard(courseId),
    enabled: !!courseId,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2 text-base">
          <span className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            Bảng xếp hạng
          </span>
          {data && (
            <span className="text-xs text-gray-500 font-normal">
              {data.totalStudents} học sinh · {data.totalQuizzes} quiz ·{" "}
              {data.totalLessons} bài
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        ) : !data || data.items.length === 0 ? (
          <div className="text-center py-10">
            <Inbox className="h-10 w-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">
              Chưa có học sinh nào trong khóa
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {data.items.map((row) => (
              <RankRow
                key={row.student.id}
                row={row}
                totalQuizzes={data.totalQuizzes}
                totalLessons={data.totalLessons}
              />
            ))}
            <p className="text-xs text-gray-400 italic mt-3 pt-3 border-t">
              Xếp hạng theo điểm TB trên tổng số quiz của khóa (quiz chưa làm
              tính 0) · Tiến độ · Tên
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RankRow({ row, totalQuizzes, totalLessons }) {
  const rankStyle = RANK_STYLE[row.rank];
  const RankIcon = rankStyle?.icon || Award;
  const isTop3 = row.rank <= 3;

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg border transition-shadow hover:shadow-sm ${
        row.isMe
          ? "border-blue-400 bg-blue-50/50 ring-2 ring-blue-200"
          : rankStyle?.bg || "border-gray-200 bg-white"
      }`}
    >
      {/* Rank */}
      <div
        className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm ${
          rankStyle?.badge || "bg-gray-100 text-gray-600"
        }`}
      >
        {isTop3 ? (
          <RankIcon className={`h-5 w-5 ${rankStyle.iconColor}`} />
        ) : (
          `#${row.rank}`
        )}
      </div>

      {/* Avatar + name */}
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <Avatar className="h-9 w-9 flex-shrink-0">
          <AvatarImage src={row.student.avatar} />
          <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
            {row.student.fullName?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-sm truncate">
            {row.student.fullName}
            {row.isMe && (
              <Badge
                variant="outline"
                className="ml-2 text-[10px] border-blue-300 text-blue-700"
              >
                Bạn
              </Badge>
            )}
          </p>
          <div className="flex items-center gap-3 text-[11px] text-gray-500 mt-0.5">
            <span>
              📖 {row.lessonsDone}/{totalLessons || 0} bài
            </span>
            <span>
              📝 {row.quizzesDone}/{totalQuizzes || 0} quiz
            </span>
            <span>📊 {row.progress}%</span>
          </div>
        </div>
      </div>

      {/* Score */}
      <div className="text-right flex-shrink-0">
        <p className="text-lg font-bold text-gray-900">
          {row.avgScore !== null ? row.avgScore : "—"}
          {row.avgScore !== null && (
            <span className="text-xs font-normal text-gray-500">%</span>
          )}
        </p>
        <p className="text-[10px] text-gray-500">điểm TB</p>
      </div>
    </div>
  );
}
