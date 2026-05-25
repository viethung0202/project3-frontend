import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  createModule,
  updateModule,
  deleteModule,
  getModuleById,
} from "@/lib/api";

export const useModuleDetail = (id) => {
  return useQuery({
    queryKey: ["module", id],
    queryFn: () => getModuleById(id),
    enabled: !!id,
    select: (resp) => resp?.data ?? null,
  });
};

const invalidateCourse = (queryClient, courseId) => {
  queryClient.invalidateQueries({ queryKey: ["course", courseId] });
  queryClient.invalidateQueries({ queryKey: ["courses"] });
};

export const useCreateModule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createModule,
    onSuccess: (res, variables) => {
      invalidateCourse(queryClient, variables.courseId);
      toast.success(res?.message || "Tạo module thành công");
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Tạo module thất bại"),
  });
};

export const useUpdateModule = (courseId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateModule,
    onSuccess: (res) => {
      if (courseId) invalidateCourse(queryClient, courseId);
      else queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success(res?.message || "Cập nhật module thành công");
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Cập nhật thất bại"),
  });
};

export const useDeleteModule = (courseId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteModule,
    onSuccess: (res) => {
      if (courseId) invalidateCourse(queryClient, courseId);
      else queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success(res?.message || "Đã xóa module");
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Xóa thất bại"),
  });
};
