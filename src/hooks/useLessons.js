import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getModuleLessons,
  createLesson,
  updateLesson,
  deleteLesson,
  attachLessonDocument,
  detachLessonDocument,
} from "@/lib/api";

const invalidate = (queryClient, moduleId) => {
  queryClient.invalidateQueries({ queryKey: ["module-lessons", moduleId] });
};

// Backend trả { success, data: { module, lessons } } → unwrap về lessons[]
export const useModuleLessons = (moduleId) => {
  return useQuery({
    queryKey: ["module-lessons", moduleId],
    queryFn: () => getModuleLessons(moduleId),
    enabled: !!moduleId,
    select: (resp) => resp?.data?.lessons ?? [],
  });
};

export const useCreateLesson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLesson,
    onSuccess: (res, variables) => {
      invalidate(queryClient, variables.moduleId);
      toast.success(res?.message || "Tạo lesson thành công");
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Tạo lesson thất bại"),
  });
};

export const useUpdateLesson = (moduleId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateLesson,
    onSuccess: (res) => {
      if (moduleId) invalidate(queryClient, moduleId);
      toast.success(res?.message || "Cập nhật lesson thành công");
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Cập nhật thất bại"),
  });
};

export const useDeleteLesson = (moduleId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLesson,
    onSuccess: (res) => {
      if (moduleId) invalidate(queryClient, moduleId);
      toast.success(res?.message || "Đã xóa lesson");
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Xóa thất bại"),
  });
};

export const useAttachLessonDocument = (moduleId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: attachLessonDocument,
    onSuccess: (res) => {
      if (moduleId) invalidate(queryClient, moduleId);
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success(res?.message || "Đã gắn tài liệu");
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Gắn tài liệu thất bại"),
  });
};

export const useDetachLessonDocument = (moduleId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: detachLessonDocument,
    onSuccess: (res) => {
      if (moduleId) invalidate(queryClient, moduleId);
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success(res?.message || "Đã gỡ tài liệu");
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Gỡ thất bại"),
  });
};
