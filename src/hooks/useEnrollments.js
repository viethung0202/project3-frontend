import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getEnrollments,
  createEnrollment,
  deleteEnrollment,
} from "@/lib/api";

export const useEnrollmentsList = (params) => {
  return useQuery({
    queryKey: ["enrollments", params],
    queryFn: () => getEnrollments(params),
    select: (resp) => resp?.data ?? [],
  });
};

export const useCreateEnrollment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEnrollment,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      toast.success(res?.message || "Enroll thành công");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Enroll thất bại");
    },
  });
};

export const useDeleteEnrollment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEnrollment,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      toast.success(res?.message || "Đã gỡ enrollment");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Gỡ thất bại");
    },
  });
};
