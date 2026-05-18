import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCourseTeachers,
  addCourseTeacher,
  removeCourseTeacher,
  getUsers,
} from "@/lib/api";
import toast from "react-hot-toast";

// List giáo viên của course
export const useCourseTeachers = (courseId) => {
  return useQuery({
    queryKey: ["course-teachers", courseId],
    queryFn: () => getCourseTeachers(courseId),
    enabled: !!courseId,
    // Backend trả { success, data: { course, teachers } } — chỉ lấy teachers
    select: (resp) => resp?.data?.teachers ?? [],
  });
};

// List tất cả giáo viên (để chọn add vào course)
export const useTeachers = (params = {}) => {
  return useQuery({
    queryKey: ["teachers", params],
    queryFn: () => getUsers({ ...params, role: "TEACHER" }),
    select: (resp) => resp?.data ?? [],
  });
};

// Add giáo viên vào course
export const useAddCourseTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addCourseTeacher,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["course-teachers", variables.courseId],
      });
      queryClient.invalidateQueries({
        queryKey: ["course", variables.courseId],
      });
      toast.success("Đã thêm giáo viên vào khóa học");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    },
  });
};

// Remove
export const useRemoveCourseTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeCourseTeacher,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["course-teachers", variables.courseId],
      });
      queryClient.invalidateQueries({
        queryKey: ["course", variables.courseId],
      });
      toast.success("Đã gỡ giáo viên khỏi khóa học");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    },
  });
};
