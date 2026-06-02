import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getCompletedLessons,
  markLessonComplete,
  unmarkLessonComplete,
} from "@/lib/api";

export const useCompletedLessons = (courseId) => {
  return useQuery({
    queryKey: ["completed-lessons", courseId],
    queryFn: () => getCompletedLessons(courseId),
    enabled: !!courseId,
    // Backend trả [{ lessonId, completedAt }]
    select: (resp) => resp?.data ?? [],
  });
};

// Optimistic update — đánh dấu ngay không đợi network
export const useMarkLessonComplete = (courseId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markLessonComplete,
    onMutate: async (lessonId) => {
      if (!courseId) return;
      await queryClient.cancelQueries({
        queryKey: ["completed-lessons", courseId],
      });
      const previous = queryClient.getQueryData(["completed-lessons", courseId]);
      // Optimistically thêm vào list
      queryClient.setQueryData(["completed-lessons", courseId], (old) => {
        const list = old?.data ?? [];
        if (list.some((c) => c.lessonId === lessonId)) return old;
        return {
          ...old,
          data: [...list, { lessonId, completedAt: new Date().toISOString() }],
        };
      });
      return { previous };
    },
    onError: (err, _vars, ctx) => {
      if (courseId && ctx?.previous) {
        queryClient.setQueryData(["completed-lessons", courseId], ctx.previous);
      }
      toast.error(err?.response?.data?.message || "Đánh dấu thất bại");
    },
    onSettled: () => {
      // Refetch để đồng bộ + progress
      if (courseId) {
        queryClient.invalidateQueries({
          queryKey: ["completed-lessons", courseId],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["student-progress"] });
      queryClient.invalidateQueries({ queryKey: ["my-enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["student-stats"] });
    },
  });
};

export const useUnmarkLessonComplete = (courseId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unmarkLessonComplete,
    onMutate: async (lessonId) => {
      if (!courseId) return;
      await queryClient.cancelQueries({
        queryKey: ["completed-lessons", courseId],
      });
      const previous = queryClient.getQueryData(["completed-lessons", courseId]);
      queryClient.setQueryData(["completed-lessons", courseId], (old) => {
        const list = old?.data ?? [];
        return {
          ...old,
          data: list.filter((c) => c.lessonId !== lessonId),
        };
      });
      return { previous };
    },
    onError: (err, _vars, ctx) => {
      if (courseId && ctx?.previous) {
        queryClient.setQueryData(["completed-lessons", courseId], ctx.previous);
      }
      toast.error(err?.response?.data?.message || "Bỏ đánh dấu thất bại");
    },
    onSettled: () => {
      if (courseId) {
        queryClient.invalidateQueries({
          queryKey: ["completed-lessons", courseId],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["student-progress"] });
      queryClient.invalidateQueries({ queryKey: ["my-enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["student-stats"] });
    },
  });
};
