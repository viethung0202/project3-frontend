import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  listEvaluationsForCourse,
  upsertEvaluation,
  deleteEvaluation,
} from "@/lib/api";
import { useCourseDetail } from "@/hooks/useCourses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ChevronLeft,
  ClipboardCheck,
  Loader2,
  Pencil,
  Trash2,
  Star,
  Inbox,
} from "lucide-react";
import { EVAL_GRADES } from "@/utils/constants";

const SKILLS = [
  { key: "listeningScore", label: "Nghe (Listening)" },
  { key: "speakingScore", label: "Nói (Speaking)" },
  { key: "readingScore", label: "Đọc (Reading)" },
  { key: "writingScore", label: "Viết (Writing)" },
];

export default function TeacherEvaluationsPage() {
  const { id: courseId } = useParams();
  const queryClient = useQueryClient();
  const { data: course } = useCourseDetail(courseId);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["evaluations", courseId],
    queryFn: () => listEvaluationsForCourse(courseId),
    enabled: !!courseId,
  });

  const [editing, setEditing] = useState(null); // {student, evaluation}

  const deleteMutation = useMutation({
    mutationFn: deleteEvaluation,
    onSuccess: () => {
      toast.success("Đã xóa đánh giá");
      queryClient.invalidateQueries({ queryKey: ["evaluations", courseId] });
    },
    onError: (e) =>
      toast.error(e?.response?.data?.message || "Xóa thất bại"),
  });

  const handleDelete = (row) => {
    if (
      window.confirm(
        `Xóa đánh giá của "${row.student.fullName}"?`,
      )
    ) {
      deleteMutation.mutate(row.evaluation.id);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          to={`/teacher/courses/${courseId}`}
          className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 mb-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Quay lại khóa học
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          Đánh giá học sinh
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          {course?.title} — {rows.length} học sinh
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ClipboardCheck className="h-5 w-5" />
            Danh sách học sinh
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : rows.length === 0 ? (
            <div className="text-center py-12">
              <Inbox className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">Chưa có học sinh nào</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rows.map((row) => {
                const grade = row.evaluation?.overallGrade;
                const gradeInfo = grade ? EVAL_GRADES[grade] : null;
                return (
                  <div
                    key={row.student.id}
                    className="flex items-center justify-between gap-3 p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <Avatar>
                        <AvatarImage src={row.student.avatar} />
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {row.student.fullName?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">
                          {row.student.fullName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {row.student.email} · Tiến độ{" "}
                          {Math.round(row.progress || 0)}%
                        </p>
                      </div>
                      {gradeInfo && (
                        <Badge
                          variant="outline"
                          className={gradeInfo.color}
                        >
                          <Star className="h-3 w-3 mr-1" />
                          {gradeInfo.label}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setEditing({
                            student: row.student,
                            evaluation: row.evaluation,
                          })
                        }
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        {row.evaluation ? "Sửa" : "Đánh giá"}
                      </Button>
                      {row.evaluation && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(row)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {editing && (
        <EvaluationDialog
          open={!!editing}
          onClose={() => setEditing(null)}
          courseId={courseId}
          student={editing.student}
          evaluation={editing.evaluation}
          onSaved={() => {
            queryClient.invalidateQueries({
              queryKey: ["evaluations", courseId],
            });
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function EvaluationDialog({ open, onClose, courseId, student, evaluation, onSaved }) {
  const [form, setForm] = useState({
    overallGrade: evaluation?.overallGrade || "GOOD",
    listeningScore: evaluation?.listeningScore ?? "",
    speakingScore: evaluation?.speakingScore ?? "",
    readingScore: evaluation?.readingScore ?? "",
    writingScore: evaluation?.writingScore ?? "",
    strengths: evaluation?.strengths || "",
    weaknesses: evaluation?.weaknesses || "",
    recommendation: evaluation?.recommendation || "",
  });

  const setField = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const mutation = useMutation({
    mutationFn: upsertEvaluation,
    onSuccess: () => {
      toast.success("Đã lưu đánh giá");
      onSaved();
    },
    onError: (e) =>
      toast.error(e?.response?.data?.message || "Lưu thất bại"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      ...form,
      studentId: student.id,
      courseId,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Đánh giá {student.fullName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>
              Xếp loại tổng <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {Object.entries(EVAL_GRADES).map(([key, info]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setField("overallGrade", key)}
                  className={`p-2 rounded-lg border text-xs font-medium transition-all ${
                    form.overallGrade === key
                      ? `${info.color} ring-2 ring-blue-500`
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`inline-block h-2 w-2 rounded-full mr-1 ${info.dot}`}
                  />
                  {info.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Điểm 4 kỹ năng (0 - 100)</Label>
            <div className="grid grid-cols-2 gap-3">
              {SKILLS.map((s) => (
                <div key={s.key} className="space-y-1">
                  <Label htmlFor={s.key} className="text-xs">
                    {s.label}
                  </Label>
                  <Input
                    id={s.key}
                    type="number"
                    min={0}
                    max={100}
                    step={0.5}
                    placeholder="—"
                    value={form[s.key]}
                    onChange={(e) => setField(s.key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="strengths">Điểm mạnh</Label>
            <textarea
              id="strengths"
              rows={2}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="VD: Phát âm tốt, tự tin giao tiếp..."
              value={form.strengths}
              onChange={(e) => setField("strengths", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="weaknesses">Điểm yếu</Label>
            <textarea
              id="weaknesses"
              rows={2}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="VD: Ngữ pháp còn yếu, kỹ năng viết cần cải thiện..."
              value={form.weaknesses}
              onChange={(e) => setField("weaknesses", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="recommendation">Lời khuyên</Label>
            <textarea
              id="recommendation"
              rows={2}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="VD: Em nên luyện thêm phần Reading qua sách TOEIC Basic..."
              value={form.recommendation}
              onChange={(e) => setField("recommendation", e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : null}
              Lưu đánh giá
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
