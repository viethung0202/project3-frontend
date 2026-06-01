import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  startQuizAttempt,
  getMyQuizAttempts,
  getAttempt,
  saveAttemptAnswer,
  submitAttempt,
  getAttemptResult,
} from "@/lib/api";

export const useStartQuizAttempt = () => {
  return useMutation({
    mutationFn: startQuizAttempt,
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Không thể bắt đầu bài làm"),
  });
};

export const useMyQuizAttempts = (quizId) => {
  return useQuery({
    queryKey: ["my-quiz-attempts", quizId],
    queryFn: () => getMyQuizAttempts(quizId),
    enabled: !!quizId,
    // Response: { data: { quiz, attempts } }
    select: (resp) => resp?.data ?? { quiz: null, attempts: [] },
  });
};

export const useAttempt = (attemptId) => {
  return useQuery({
    queryKey: ["attempt", attemptId],
    queryFn: () => getAttempt(attemptId),
    enabled: !!attemptId,
    select: (resp) => resp?.data ?? null,
    // Đang làm bài → không cần refetch tự động
    staleTime: Infinity,
  });
};

export const useSaveAttemptAnswer = () => {
  return useMutation({
    mutationFn: saveAttemptAnswer,
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Lưu đáp án thất bại"),
  });
};

export const useSubmitAttempt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitAttempt,
    onSuccess: (_res, attemptId) => {
      queryClient.invalidateQueries({ queryKey: ["attempt", attemptId] });
      queryClient.invalidateQueries({ queryKey: ["my-quiz-attempts"] });
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Nộp bài thất bại"),
  });
};

export const useAttemptResult = (attemptId) => {
  return useQuery({
    queryKey: ["attempt-result", attemptId],
    queryFn: () => getAttemptResult(attemptId),
    enabled: !!attemptId,
    select: (resp) => resp?.data ?? null,
  });
};
