import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  publishCourse,
} from "@/lib/api";
import toast from "react-hot-toast";

// Get list courses
export const useCoursesList = (params) => {
  return useQuery({
    queryKey: ["courses", params],
    queryFn: () => getCourses(params),
    select: (resp) => resp?.data ?? [],
  });
};

// Get 1 course
export const useCourseDetail = (id) => {
  return useQuery({
    queryKey: ["course", id],
    queryFn: () => getCourseById(id),
    enabled: !!id,
    select: (resp) => resp?.data ?? null,
  });
};

// Create
export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Tạo khóa học thành công!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    },
  });
};

// Update
export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCourse,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["course", variables.id] });
      toast.success("Cập nhật thành công!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    },
  });
};

// Delete
export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Đã xóa khóa học");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    },
  });
};

// Publish
export const usePublishCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: publishCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Cập nhật trạng thái thành công");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    },
  });
};
