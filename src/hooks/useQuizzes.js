import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getModuleQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  deleteQuestion,
} from "@/lib/api";

// === QUIZZES ===
export const useModuleQuizzes = (moduleId) => {
  return useQuery({
    queryKey: ["module-quizzes", moduleId],
    queryFn: () => getModuleQuizzes(moduleId),
    enabled: !!moduleId,
    // Backend trả { data: { module, quizzes } }
    select: (resp) => resp?.data?.quizzes ?? [],
  });
};

export const useQuizDetail = (id) => {
  return useQuery({
    queryKey: ["quiz", id],
    queryFn: () => getQuizById(id),
    enabled: !!id,
    select: (resp) => resp?.data ?? null,
  });
};

export const useCreateQuiz = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createQuiz,
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["module-quizzes", variables.moduleId],
      });
      toast.success(res?.message || "Tạo quiz thành công");
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Tạo quiz thất bại"),
  });
};

export const useUpdateQuiz = (moduleId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateQuiz,
    onSuccess: (res, variables) => {
      if (moduleId)
        queryClient.invalidateQueries({
          queryKey: ["module-quizzes", moduleId],
        });
      queryClient.invalidateQueries({ queryKey: ["quiz", variables.id] });
      toast.success(res?.message || "Cập nhật quiz thành công");
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Cập nhật thất bại"),
  });
};

export const useDeleteQuiz = (moduleId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteQuiz,
    onSuccess: (res) => {
      if (moduleId)
        queryClient.invalidateQueries({
          queryKey: ["module-quizzes", moduleId],
        });
      toast.success(res?.message || "Đã xóa quiz");
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Xóa thất bại"),
  });
};

// === QUESTIONS ===
// Question + Answers được sync trong QuestionFormDialog (gọi api trực tiếp)
// nên ở đây chỉ cần hook xóa question.
export const useDeleteQuestion = (quizId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteQuestion,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["quiz", quizId] });
      toast.success(res?.message || "Đã xóa câu hỏi");
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Xóa thất bại"),
  });
};
